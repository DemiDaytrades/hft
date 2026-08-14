import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import { SETTING_KEYS, getSettingNumber } from "./settings";

function db() {
  return getCloudflareContext().env.DB;
}

export type Affiliate = {
  id: string;
  userId: string;
  code: string;
  commissionPercent: number;
  status: "active" | "paused";
  stripeAccountId: string | null;
  payoutsEnabled: number;
  createdAt: string;
};

export type AffiliateWithStats = Affiliate & {
  name: string | null;
  email: string;
  clicks: number;
  referredMembers: number;
  pendingCents: number;
  paidCents: number;
};

/** Plain-language payout state for the admin table -- never a Stripe status. */
export function payoutLabel(affiliate: {
  stripeAccountId: string | null;
  payoutsEnabled: number;
}): string {
  if (!affiliate.stripeAccountId) return "Hasn't set up payouts yet";
  if (!affiliate.payoutsEnabled) return "Waiting on their bank details";
  return "Ready to be paid";
}

function newId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

/** Referral codes are shared out loud and typed by hand, so ambiguous
 *  characters (0/O, 1/I/l) are excluded. */
function generateCode(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export async function getAffiliateByUserId(
  userId: string,
): Promise<Affiliate | null> {
  return db()
    .prepare(`SELECT * FROM "affiliate" WHERE "userId" = ?;`)
    .bind(userId)
    .first<Affiliate>();
}

export async function getAffiliateByCode(
  code: string,
): Promise<Affiliate | null> {
  return db()
    .prepare(`SELECT * FROM "affiliate" WHERE code = ? AND status = 'active';`)
    .bind(code.toLowerCase())
    .first<Affiliate>();
}

export async function getAffiliateById(id: string): Promise<Affiliate | null> {
  return db()
    .prepare(`SELECT * FROM "affiliate" WHERE id = ?;`)
    .bind(id)
    .first<Affiliate>();
}

/** Creates an affiliate for an existing user, seeded with the global default
 *  rate. Idempotent -- returns the existing record if there is one. */
export async function createAffiliate(userId: string): Promise<Affiliate> {
  const existing = await getAffiliateByUserId(userId);
  if (existing) return existing;

  const defaultPercent =
    (await getSettingNumber(SETTING_KEYS.defaultCommissionPercent)) ?? 20;

  const now = new Date().toISOString();
  const id = newId();

  // Codes are random; a collision is vanishingly unlikely but the unique index
  // would reject it, so retry a couple of times rather than 500.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await db()
        .prepare(
          `INSERT INTO "affiliate"
             (id, "userId", code, "commissionPercent", status, "payoutsEnabled", "createdAt", "updatedAt")
           VALUES (?, ?, ?, ?, 'active', 0, ?, ?);`,
        )
        .bind(id, userId, generateCode(), defaultPercent, now, now)
        .run();

      const created = await getAffiliateByUserId(userId);
      if (created) return created;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }

  throw new Error("Could not create the affiliate record.");
}

export async function setCommissionPercent(
  affiliateId: string,
  percent: number,
): Promise<void> {
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new Error("Commission must be between 0 and 100 percent.");
  }

  // Only affects commissions written from now on -- existing ledger rows keep
  // the rate they were earned at.
  await db()
    .prepare(
      `UPDATE "affiliate" SET "commissionPercent" = ?, "updatedAt" = ? WHERE id = ?;`,
    )
    .bind(percent, new Date().toISOString(), affiliateId)
    .run();
}

export async function setAffiliateStatus(
  affiliateId: string,
  status: "active" | "paused",
): Promise<void> {
  await db()
    .prepare(`UPDATE "affiliate" SET status = ?, "updatedAt" = ? WHERE id = ?;`)
    .bind(status, new Date().toISOString(), affiliateId)
    .run();
}

export async function linkStripeAccount(
  affiliateId: string,
  stripeAccountId: string,
): Promise<void> {
  await db()
    .prepare(
      `UPDATE "affiliate" SET "stripeAccountId" = ?, "updatedAt" = ? WHERE id = ?;`,
    )
    .bind(stripeAccountId, new Date().toISOString(), affiliateId)
    .run();
}

export async function setPayoutsEnabled(
  stripeAccountId: string,
  enabled: boolean,
): Promise<void> {
  await db()
    .prepare(
      `UPDATE "affiliate" SET "payoutsEnabled" = ?, "updatedAt" = ?
       WHERE "stripeAccountId" = ?;`,
    )
    .bind(enabled ? 1 : 0, new Date().toISOString(), stripeAccountId)
    .run();
}

export async function recordClick(affiliateId: string): Promise<void> {
  await db()
    .prepare(
      `INSERT INTO "referral_click" (id, "affiliateId", "createdAt") VALUES (?, ?, ?);`,
    )
    .bind(newId(), affiliateId, new Date().toISOString())
    .run();
}

/** Admin list with the numbers she actually cares about. */
export async function listAffiliates(): Promise<AffiliateWithStats[]> {
  const { results } = await db()
    .prepare(
      `SELECT a.*,
              u.name  AS name,
              u.email AS email,
              (SELECT COUNT(*) FROM "referral_click" c WHERE c."affiliateId" = a.id) AS clicks,
              (SELECT COUNT(*) FROM "user" m WHERE m."referredByAffiliateId" = a.id) AS "referredMembers",
              COALESCE((SELECT SUM(amountCents) FROM "commission" k
                        WHERE k."affiliateId" = a.id AND k.status = 'pending'), 0) AS "pendingCents",
              COALESCE((SELECT SUM(amountCents) FROM "commission" k
                        WHERE k."affiliateId" = a.id AND k.status = 'paid'), 0) AS "paidCents"
       FROM "affiliate" a
       JOIN "user" u ON u.id = a."userId"
       ORDER BY a."createdAt" DESC;`,
    )
    .all<AffiliateWithStats>();

  return results;
}
