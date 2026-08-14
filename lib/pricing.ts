import "server-only";

import type Stripe from "stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import { SETTING_KEYS, setSetting } from "./settings";
import { getStripe } from "./stripe";
import { PRICE_LOOKUP_KEY, createOrReusePrice } from "./stripe-setup";

/**
 * Price changes.
 *
 * Stripe Price objects are immutable -- `unit_amount` cannot be edited. So a
 * price change creates a NEW price and moves the `hft_membership` lookup key
 * onto it. Checkout resolves by lookup key, so this needs no deploy.
 *
 * Existing subscribers keep their old price unless explicitly migrated. That
 * default is deliberate: silently repricing active members is how a business
 * loses its member base overnight.
 */

/** How many subscriptions to migrate per request. Workers cap subrequests per
 *  invocation (50 on the free plan), and each migration is one Stripe call, so
 *  bulk work is chunked rather than looped. */
export const MIGRATION_BATCH_SIZE = 20;

export type PricingOverview = {
  currentPriceCents: number;
  activeMemberCount: number;
  /** Members still billed at a price other than the current one. */
  onOlderPriceCount: number;
  currentPriceId: string | null;
};

export async function getPricingOverview(): Promise<PricingOverview> {
  const stripe = await getStripe();

  const prices = await stripe.prices.list({
    lookup_keys: [PRICE_LOOKUP_KEY],
    limit: 1,
  });
  const current = prices.data[0] ?? null;

  const activeMemberCount = await countActiveMembers();

  let onOlderPriceCount = 0;
  if (current) {
    // Stripe knows who is on which price; D1 only mirrors status.
    const subs = await stripe.subscriptions.list({
      status: "active",
      limit: 100,
    });
    onOlderPriceCount = subs.data.filter(
      (sub) => sub.items.data[0]?.price?.id !== current.id,
    ).length;
  }

  return {
    currentPriceCents: current?.unit_amount ?? 0,
    currentPriceId: current?.id ?? null,
    activeMemberCount,
    onOlderPriceCount,
  };
}

async function countActiveMembers(): Promise<number> {
  const row = await getCloudflareContext()
    .env.DB.prepare(
      `SELECT COUNT(*) AS n FROM "user"
       WHERE "subscriptionStatus" IN ('active','trialing');`,
    )
    .first<{ n: number }>();
  return row?.n ?? 0;
}

/**
 * Points new signups at a new amount. Existing subscribers are untouched.
 * Returns the new price so the caller can report what happened.
 */
export async function changePrice(newAmountCents: number): Promise<Stripe.Price> {
  if (!Number.isInteger(newAmountCents) || newAmountCents < 100) {
    throw new Error("Enter a price of at least $1.00.");
  }

  const stripe = await getStripe();

  const productId = await resolveProductId(stripe);
  const price = await createOrReusePrice(stripe, productId, newAmountCents);

  await setSetting(SETTING_KEYS.membershipPriceCents, String(newAmountCents));
  await setSetting(SETTING_KEYS.stripePriceId, price.id);

  return price;
}

async function resolveProductId(stripe: Stripe): Promise<string> {
  const prices = await stripe.prices.list({
    lookup_keys: [PRICE_LOOKUP_KEY],
    limit: 1,
  });
  const product = prices.data[0]?.product;
  if (typeof product === "string") return product;
  if (product && !product.deleted) return product.id;

  throw new Error(
    "No membership product found. Reconnect payments in Settings → Payments.",
  );
}

export type MigrationProgress = {
  migrated: number;
  remaining: number;
  done: boolean;
};

/**
 * Moves a batch of existing subscribers onto the current price.
 *
 * `proration_behavior: "none"` means nobody gets a surprise mid-cycle charge or
 * credit -- the new amount simply applies from their next renewal.
 */
export async function migrateExistingMembers(): Promise<MigrationProgress> {
  const stripe = await getStripe();

  const prices = await stripe.prices.list({
    lookup_keys: [PRICE_LOOKUP_KEY],
    limit: 1,
  });
  const current = prices.data[0];
  if (!current) throw new Error("No current price is set up.");

  const subs = await stripe.subscriptions.list({ status: "active", limit: 100 });
  const stale = subs.data.filter(
    (sub) => sub.items.data[0]?.price?.id !== current.id,
  );

  const batch = stale.slice(0, MIGRATION_BATCH_SIZE);

  for (const sub of batch) {
    const item = sub.items.data[0];
    if (!item) continue;
    await stripe.subscriptions.update(sub.id, {
      items: [{ id: item.id, price: current.id }],
      proration_behavior: "none",
    });
  }

  const remaining = stale.length - batch.length;
  return { migrated: batch.length, remaining, done: remaining === 0 };
}
