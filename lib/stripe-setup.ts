import "server-only";

import type Stripe from "stripe";

import { SETTING_KEYS, getSettingNumber, setSetting } from "./settings";
import { stripeFromKey } from "./stripe";

/**
 * One-click provisioning of everything Stripe needs, so the owner never has to
 * open the Stripe dashboard to wire up webhooks or copy a signing secret.
 *
 * Every step is idempotent -- re-running after a key rotation reuses what is
 * already there instead of creating duplicates.
 */

/** Stable handle for "the current membership price". Checkout resolves the
 *  price through this, so changing the price never needs a deploy. */
export const PRICE_LOOKUP_KEY = "hft_membership";

const PRODUCT_METADATA_KEY = "hft_role";
const PRODUCT_METADATA_VALUE = "membership";

const WEBHOOK_EVENTS: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "charge.refunded",
  "account.updated",
];

export type PayoutReadiness =
  | { state: "ready" }
  | { state: "needs_details"; message: string }
  | { state: "unknown"; message: string };

export type SetupResult = {
  productId: string;
  priceId: string;
  priceCents: number;
  webhookId: string;
  portalConfigId: string;
  payouts: PayoutReadiness;
  accountName: string | null;
  livemode: boolean;
};

/**
 * Validates the key with a cheap read. Deliberately not `accounts.retrieve`:
 * a restricted key may lack account access while still being perfectly usable
 * for products, prices and webhooks.
 */
async function assertKeyWorks(stripe: Stripe): Promise<void> {
  await stripe.products.list({ limit: 1 });
}

async function findOrCreateProduct(stripe: Stripe): Promise<Stripe.Product> {
  // Prices carry the lookup key, so the product is found via the live price
  // first -- that survives a settings wipe.
  const existingPrices = await stripe.prices.list({
    lookup_keys: [PRICE_LOOKUP_KEY],
    expand: ["data.product"],
    limit: 1,
  });

  const linked = existingPrices.data[0]?.product;
  if (linked && typeof linked !== "string" && !linked.deleted) {
    return linked as Stripe.Product;
  }

  return stripe.products.create({
    name: "HFT Membership",
    description: "Monthly membership: 3ZS strategy, live alerts and community.",
    metadata: { [PRODUCT_METADATA_KEY]: PRODUCT_METADATA_VALUE },
  });
}

/**
 * Prices are immutable in Stripe -- `unit_amount` cannot be edited. Changing
 * the price means creating a new one and moving the lookup key onto it, which
 * is what `transfer_lookup_key` does atomically.
 */
export async function createOrReusePrice(
  stripe: Stripe,
  productId: string,
  amountCents: number,
): Promise<Stripe.Price> {
  const existing = await stripe.prices.list({
    lookup_keys: [PRICE_LOOKUP_KEY],
    limit: 1,
  });

  const current = existing.data[0];
  if (current && current.unit_amount === amountCents && current.active) {
    return current;
  }

  const price = await stripe.prices.create({
    product: productId,
    currency: "usd",
    unit_amount: amountCents,
    recurring: { interval: "month" },
    lookup_key: PRICE_LOOKUP_KEY,
    // Steals the lookup key off the old price in one atomic step, so there is
    // never a moment where checkout cannot resolve a price.
    transfer_lookup_key: true,
  });

  if (current && current.id !== price.id) {
    // Archive rather than delete: existing subscriptions still reference it.
    await stripe.prices.update(current.id, { active: false });
  }

  return price;
}

async function findOrCreateWebhook(
  stripe: Stripe,
  webhookUrl: string,
): Promise<{ id: string; secret: string | null }> {
  const existing = await stripe.webhookEndpoints.list({ limit: 100 });
  const match = existing.data.find((endpoint) => endpoint.url === webhookUrl);

  if (match) {
    // The signing secret is only ever returned at creation time. If an endpoint
    // already exists we cannot recover it, so replace it -- otherwise we would
    // be left unable to verify any incoming event.
    await stripe.webhookEndpoints.del(match.id);
  }

  const created = await stripe.webhookEndpoints.create({
    url: webhookUrl,
    enabled_events: WEBHOOK_EVENTS,
    description: "HFT membership + affiliate events",
  });

  return { id: created.id, secret: created.secret ?? null };
}

async function findOrCreatePortalConfig(
  stripe: Stripe,
): Promise<Stripe.BillingPortal.Configuration> {
  const existing = await stripe.billingPortal.configurations.list({ limit: 10 });
  const mine = existing.data.find(
    (config) => config.metadata?.[PRODUCT_METADATA_KEY] === PRODUCT_METADATA_VALUE,
  );
  if (mine) return mine;

  return stripe.billingPortal.configurations.create({
    business_profile: { headline: "High Frequency Talent membership" },
    features: {
      customer_update: { enabled: true, allowed_updates: ["email", "address"] },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true, mode: "at_period_end" },
    },
    metadata: { [PRODUCT_METADATA_KEY]: PRODUCT_METADATA_VALUE },
  });
}

/**
 * Whether she can pay affiliates yet. Phrased for a non-technical reader --
 * never surfaces Stripe requirement codes.
 */
export async function checkPayoutReadiness(
  stripe: Stripe,
): Promise<{ readiness: PayoutReadiness; accountName: string | null }> {
  try {
    // null = the account this key belongs to (rather than a connected account).
    const account = await stripe.accounts.retrieve(null);
    const name =
      account.business_profile?.name ?? account.settings?.dashboard?.display_name ?? null;

    if (!account.charges_enabled || !account.payouts_enabled) {
      return {
        readiness: {
          state: "needs_details",
          message:
            "Stripe still needs a few details from you before money can move — usually your business info and bank account.",
        },
        accountName: name,
      };
    }

    return { readiness: { state: "ready" }, accountName: name };
  } catch {
    // A restricted key without account access is fine for everything else, so
    // this is reported as unknown rather than treated as a failure.
    return {
      readiness: {
        state: "unknown",
        message:
          "We couldn't check your payout status with this key. Everything else is set up and working.",
      },
      accountName: null,
    };
  }
}

/** Runs the whole setup and persists the results. Safe to re-run. */
export async function connectStripe(
  apiKey: string,
  webhookUrl: string,
): Promise<SetupResult> {
  const stripe = stripeFromKey(apiKey);

  await assertKeyWorks(stripe);

  const priceCents = (await getSettingNumber(SETTING_KEYS.membershipPriceCents)) ?? 15000;

  const product = await findOrCreateProduct(stripe);
  const price = await createOrReusePrice(stripe, product.id, priceCents);
  const webhook = await findOrCreateWebhook(stripe, webhookUrl);
  const portal = await findOrCreatePortalConfig(stripe);
  const { readiness, accountName } = await checkPayoutReadiness(stripe);

  await setSetting(SETTING_KEYS.stripeSecretKey, apiKey, { encrypt: true });
  await setSetting(SETTING_KEYS.stripeKeyHint, apiKey.slice(-4));
  await setSetting(SETTING_KEYS.stripeProductId, product.id);
  await setSetting(SETTING_KEYS.stripePriceId, price.id);
  await setSetting(SETTING_KEYS.stripeWebhookId, webhook.id);
  await setSetting(SETTING_KEYS.stripePortalConfigId, portal.id);
  await setSetting(SETTING_KEYS.membershipPriceCents, String(price.unit_amount ?? priceCents));

  if (webhook.secret) {
    await setSetting(SETTING_KEYS.stripeWebhookSecret, webhook.secret, {
      encrypt: true,
    });
  }

  return {
    productId: product.id,
    priceId: price.id,
    priceCents: price.unit_amount ?? priceCents,
    webhookId: webhook.id,
    portalConfigId: portal.id,
    payouts: readiness,
    accountName,
    livemode: price.livemode,
  };
}
