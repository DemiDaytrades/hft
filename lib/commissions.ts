import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getAffiliateById } from "./affiliates";
import { SETTING_KEYS, getSettingNumber } from "./settings";

/**
 * Commission ledger.
 *
 * Commissions are written the moment an invoice is paid, but held as `pending`
 * until the hold window passes. A transfer to a connected account cannot be
 * pulled back automatically, so paying instantly would mean a refund or
 * chargeback leaves the owner permanently out of pocket.
 */

function db() {
  return getCloudflareContext().env.DB;
}

function newId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export type Commission = {
  id: string;
  affiliateId: string;
  memberId: string | null;
  invoiceId: string;
  chargeId: string | null;
  amountCents: number;
  commissionPercent: number;
  status: "pending" | "paid" | "failed" | "void";
  stripeTransferId: string | null;
  failureReason: string | null;
  payableAt: string;
  paidAt: string | null;
  createdAt: string;
};

/**
 * Records what an affiliate earned on a paid invoice.
 *
 * The rate is copied onto the row so later rate changes never rewrite history.
 * A unique index on (invoiceId, affiliateId) makes a webhook replay a no-op.
 */
export async function recordCommission(params: {
  affiliateId: string;
  memberId: string | null;
  invoiceId: string;
  chargeId: string | null;
  invoiceAmountCents: number;
}): Promise<Commission | null> {
  const affiliate = await getAffiliateById(params.affiliateId);
  if (!affiliate || affiliate.status !== "active") return null;

  const percent = affiliate.commissionPercent;
  const amountCents = Math.floor((params.invoiceAmountCents * percent) / 100);
  if (amountCents <= 0) return null;

  const holdDays = (await getSettingNumber(SETTING_KEYS.commissionHoldDays)) ?? 7;
  const now = new Date();
  const payableAt = new Date(now.getTime() + holdDays * 24 * 60 * 60 * 1000);

  const result = await db()
    .prepare(
      `INSERT INTO "commission"
         (id, "affiliateId", "memberId", "invoiceId", "chargeId", "amountCents",
          "commissionPercent", status, "payableAt", "createdAt")
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
       ON CONFLICT("invoiceId", "affiliateId") DO NOTHING;`,
    )
    .bind(
      newId(),
      params.affiliateId,
      params.memberId,
      params.invoiceId,
      params.chargeId,
      amountCents,
      percent,
      payableAt.toISOString(),
      now.toISOString(),
    )
    .run();

  if ((result.meta?.changes ?? 0) === 0) return null; // replay

  return db()
    .prepare(
      `SELECT * FROM "commission" WHERE "invoiceId" = ? AND "affiliateId" = ?;`,
    )
    .bind(params.invoiceId, params.affiliateId)
    .first<Commission>();
}

/**
 * Cancels unpaid commissions for an invoice -- used on refund or failed
 * payment. Already-paid rows are deliberately left alone: the money is gone,
 * and silently rewriting them would hide a real loss from the ledger.
 */
export async function voidCommissionsForInvoice(
  invoiceId: string,
  reason: string,
): Promise<number> {
  const result = await db()
    .prepare(
      `UPDATE "commission"
       SET status = 'void', "failureReason" = ?
       WHERE "invoiceId" = ? AND status IN ('pending','failed');`,
    )
    .bind(reason, invoiceId)
    .run();

  return result.meta?.changes ?? 0;
}

/**
 * Voids unpaid commissions matched by the stored payment reference. Used for
 * refunds, where Stripe gives us a payment intent rather than an invoice id.
 */
export async function voidCommissionsByPaymentRef(
  paymentRef: string,
  reason: string,
): Promise<number> {
  const result = await db()
    .prepare(
      `UPDATE "commission"
       SET status = 'void', "failureReason" = ?
       WHERE "chargeId" = ? AND status IN ('pending','failed');`,
    )
    .bind(reason, paymentRef)
    .run();

  return result.meta?.changes ?? 0;
}

/** Commissions whose hold has expired and whose affiliate can receive money. */
export async function listPayableCommissions(limit = 50): Promise<
  (Commission & { stripeAccountId: string })[]
> {
  const { results } = await db()
    .prepare(
      `SELECT c.*, a."stripeAccountId" AS "stripeAccountId"
       FROM "commission" c
       JOIN "affiliate" a ON a.id = c."affiliateId"
       WHERE c.status IN ('pending','failed')
         AND c."payableAt" <= ?
         AND a."payoutsEnabled" = 1
         AND a."stripeAccountId" IS NOT NULL
         AND a.status = 'active'
       ORDER BY c."payableAt" ASC
       LIMIT ?;`,
    )
    .bind(new Date().toISOString(), limit)
    .all<Commission & { stripeAccountId: string }>();

  return results;
}

export async function markCommissionPaid(
  id: string,
  transferId: string,
): Promise<void> {
  await db()
    .prepare(
      `UPDATE "commission"
       SET status = 'paid', "stripeTransferId" = ?, "paidAt" = ?, "failureReason" = NULL
       WHERE id = ?;`,
    )
    .bind(transferId, new Date().toISOString(), id)
    .run();
}

/** Failures stay retryable rather than disappearing -- the next sweep picks
 *  them up again. */
export async function markCommissionFailed(
  id: string,
  reason: string,
): Promise<void> {
  await db()
    .prepare(
      `UPDATE "commission" SET status = 'failed', "failureReason" = ? WHERE id = ?;`,
    )
    .bind(reason.slice(0, 500), id)
    .run();
}

export type CommissionTotals = {
  pendingCents: number;
  paidCents: number;
  voidCents: number;
};

export async function getCommissionTotals(
  affiliateId?: string,
): Promise<CommissionTotals> {
  const where = affiliateId ? `WHERE "affiliateId" = ?` : "";
  const stmt = db().prepare(
    `SELECT
       COALESCE(SUM(CASE WHEN status IN ('pending','failed') THEN "amountCents" END), 0) AS "pendingCents",
       COALESCE(SUM(CASE WHEN status = 'paid' THEN "amountCents" END), 0) AS "paidCents",
       COALESCE(SUM(CASE WHEN status = 'void' THEN "amountCents" END), 0) AS "voidCents"
     FROM "commission" ${where};`,
  );

  const row = await (affiliateId ? stmt.bind(affiliateId) : stmt).first<CommissionTotals>();
  return row ?? { pendingCents: 0, paidCents: 0, voidCents: 0 };
}
