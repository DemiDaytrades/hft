import "server-only";

import type Stripe from "stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Writes Stripe subscription state onto the user row. Everything that grants or
 * revokes member access flows through here, so there is one place to audit.
 */

/** Statuses that entitle someone to member content. */
export const ACTIVE_STATUSES = ["active", "trialing"] as const;

function db() {
  return getCloudflareContext().env.DB;
}

/** True if this Stripe event has already been handled. Records it if not. */
export async function claimEvent(event: Stripe.Event): Promise<boolean> {
  const result = await db()
    .prepare(
      `INSERT INTO "webhook_event" (id, type, "processedAt")
       VALUES (?, ?, ?)
       ON CONFLICT(id) DO NOTHING;`,
    )
    .bind(event.id, event.type, new Date().toISOString())
    .run();

  // meta.changes === 0 means the row already existed -- a replay.
  return (result.meta?.changes ?? 0) > 0;
}

export type MembershipState = {
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
};

/**
 * Read straight from D1 rather than the session. A webhook cancelling a
 * subscription must revoke access on the very next request, not whenever the
 * session happens to refresh.
 */
export async function getMembership(
  userId: string,
): Promise<MembershipState | null> {
  return db()
    .prepare(
      `SELECT "subscriptionStatus", "currentPeriodEnd", "stripeCustomerId"
       FROM "user" WHERE id = ?;`,
    )
    .bind(userId)
    .first<MembershipState>();
}

export function isActive(status: string | null | undefined): boolean {
  return (
    !!status && ACTIVE_STATUSES.includes(status as (typeof ACTIVE_STATUSES)[number])
  );
}

export async function findUserByCustomerId(customerId: string): Promise<{
  id: string;
  email: string;
  referredByAffiliateId: string | null;
} | null> {
  return db()
    .prepare(
      `SELECT id, email, "referredByAffiliateId"
       FROM "user" WHERE "stripeCustomerId" = ?;`,
    )
    .bind(customerId)
    .first<{ id: string; email: string; referredByAffiliateId: string | null }>();
}

export async function findUserByEmail(
  email: string,
): Promise<{ id: string; email: string; stripeCustomerId: string | null } | null> {
  return db()
    .prepare(
      `SELECT id, email, "stripeCustomerId" FROM "user" WHERE email = ?;`,
    )
    .bind(email.toLowerCase())
    .first<{ id: string; email: string; stripeCustomerId: string | null }>();
}

export async function linkCustomer(
  userId: string,
  customerId: string,
): Promise<void> {
  await db()
    .prepare(
      `UPDATE "user" SET "stripeCustomerId" = ?, "updatedAt" = ? WHERE id = ?;`,
    )
    .bind(customerId, new Date().toISOString(), userId)
    .run();
}

/** Mirrors a subscription onto the user row. */
export async function applySubscription(
  userId: string,
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: number | null;
  },
): Promise<void> {
  await db()
    .prepare(
      `UPDATE "user"
       SET "subscriptionId" = ?,
           "subscriptionStatus" = ?,
           "currentPeriodEnd" = ?,
           "updatedAt" = ?
       WHERE id = ?;`,
    )
    .bind(
      subscription.id,
      subscription.status,
      subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd * 1000).toISOString()
        : null,
      new Date().toISOString(),
      userId,
    )
    .run();
}

export async function clearSubscription(userId: string): Promise<void> {
  await db()
    .prepare(
      `UPDATE "user"
       SET "subscriptionStatus" = 'canceled', "updatedAt" = ?
       WHERE id = ?;`,
    )
    .bind(new Date().toISOString(), userId)
    .run();
}

export async function setReferrer(
  userId: string,
  affiliateId: string,
): Promise<void> {
  // First-touch attribution: never overwrite an existing referrer.
  await db()
    .prepare(
      `UPDATE "user"
       SET "referredByAffiliateId" = ?
       WHERE id = ? AND "referredByAffiliateId" IS NULL;`,
    )
    .bind(affiliateId, userId)
    .run();
}
