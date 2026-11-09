"use server";

import { revalidatePath } from "next/cache";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import { requireAdmin } from "@/lib/dal";
import { grantComplimentaryAccess, revokeComplimentaryAccess } from "@/app/(app)/admin/users/actions";

/**
 * Admin-only complimentary-access management for a student profile.
 *
 * Every mutation re-asserts `requireAdmin()` -- server actions are public HTTP
 * endpoints, so the page-level check alone is not sufficient.
 *
 * These actions reuse the existing complimentary-access backend logic and the
 * existing `user` columns (complimentaryAccessStartsAt / ExpiresAt /
 * RevokedAt / GrantedBy). They touch NO Stripe objects: no customer, no
 * Checkout Session, no Payment Intent, no subscription, no invoice, no
 * payment. They send no email and no SMS.
 */

export type ComplimentaryAction =
  | "extend"
  | "custom"
  | "revoke"
  | "restore";

export type ComplimentaryActionResult =
  | { ok: true }
  | { ok: false; error: string };

const PRESET_DAYS = [7, 14, 30, 60, 90] as const;

function isPresetDays(value: unknown): value is (typeof PRESET_DAYS)[number] {
  return typeof value === "number" && PRESET_DAYS.includes(value as never);
}

function isFutureDate(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  // Allow same-day (start of today) but not the past.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const candidate = new Date(iso);
  candidate.setHours(0, 0, 0, 0);
  return candidate.getTime() >= today.getTime();
}

/** Grant / re-grant / extend / set a custom expiry. Always sets GrantedBy. */
async function grant(
  userId: string,
  adminId: string,
  expiresAt: string,
): Promise<ComplimentaryActionResult> {
  const db = getCloudflareContext().env.DB;
  const now = new Date();
  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime())) {
    return { ok: false, error: "That expiration date is not valid." };
  }
  if (expiry.getTime() <= now.getTime()) {
    return { ok: false, error: "Choose a future expiration date." };
  }
  await db
    .prepare(
      `UPDATE "user"
        SET "complimentaryAccessStartsAt" = ?,
            "complimentaryAccessExpiresAt" = ?,
            "complimentaryAccessRevokedAt" = NULL,
            "complimentaryGrantedBy" = ?,
            "updatedAt" = ?
       WHERE id = ?;`,
    )
    .bind(now.toISOString(), expiry.toISOString(), adminId, now.toISOString(), userId)
    .run();
  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function extendComplimentary(
  userId: string,
  days: number,
): Promise<ComplimentaryActionResult> {
  const admin = await requireAdmin();
  if (!isPresetDays(days)) {
    return { ok: false, error: "Choose 7, 14, 30, 60, or 90 days." };
  }
  const now = new Date();
  const fallbackExpiry = new Date(now.getTime() + days * 86400000).toISOString();
  // Compute against the stored expiry in one UPDATE, so concurrent extensions
  // cannot replace a later grant with an earlier one.
  const result = await getCloudflareContext().env.DB.prepare(
    `UPDATE "user" SET
       "complimentaryAccessStartsAt" = COALESCE("complimentaryAccessStartsAt", ?),
       "complimentaryAccessExpiresAt" = CASE
         WHEN julianday("complimentaryAccessExpiresAt") > julianday(?)
         THEN strftime('%Y-%m-%dT%H:%M:%fZ', "complimentaryAccessExpiresAt", '+' || ? || ' days')
         ELSE ? END,
       "complimentaryAccessRevokedAt" = NULL,
       "complimentaryGrantedBy" = ?, "updatedAt" = ? WHERE id = ?;`,
  ).bind(now.toISOString(), now.toISOString(), days, fallbackExpiry, admin.id, now.toISOString(), userId).run();
  if (!result.meta?.changes) return { ok: false, error: "Member not found." };
  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setComplimentaryExpiry(
  userId: string,
  expiresAt: string,
): Promise<ComplimentaryActionResult> {
  const admin = await requireAdmin();
  if (!isFutureDate(expiresAt)) {
    return { ok: false, error: "Choose a future expiration date." };
  }
  return grant(userId, admin.id, expiresAt);
}

export async function revokeComplimentary(userId: string): Promise<ComplimentaryActionResult> {
  await requireAdmin();
  const db = getCloudflareContext().env.DB;
  const now = new Date().toISOString();
  await db
    .prepare(
      `UPDATE "user"
        SET "complimentaryAccessRevokedAt" = ?, "updatedAt" = ?
       WHERE id = ?;`,
    )
    .bind(now, now, userId)
    .run();
  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/users");
  return { ok: true };
}

/**
 * Restore revoked complimentary access. The admin MUST pick a new duration or
 * custom future date -- we never auto-restore for 30 days.
 */
export async function restoreComplimentary(
  userId: string,
  days?: number,
  expiresAt?: string,
): Promise<ComplimentaryActionResult> {
  const admin = await requireAdmin();
  if (expiresAt !== undefined && expiresAt !== "") {
    if (!isFutureDate(expiresAt)) {
      return { ok: false, error: "Choose a future expiration date." };
    }
    return grant(userId, admin.id, expiresAt);
  }
  if (days === undefined || !isPresetDays(days)) {
    return { ok: false, error: "Choose 7, 14, 30, 60, or 90 days to restore access." };
  }
  const expiry = new Date(Date.now() + days * 86400000);
  return grant(userId, admin.id, expiry.toISOString());
}

// Re-export the existing actions so the control component can import a single
// module without reaching across the users table boundary.
export { grantComplimentaryAccess, revokeComplimentaryAccess };
