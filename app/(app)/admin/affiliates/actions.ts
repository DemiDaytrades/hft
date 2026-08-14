"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  createAffiliate,
  setAffiliateStatus,
  setCommissionPercent,
} from "@/lib/affiliates";
import { requireAdmin } from "@/lib/dal";
import { createInvite } from "@/lib/invites";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type AffiliateActionResult = { ok: true } | { ok: false; error: string };

function fail(error: unknown, fallback: string): { ok: false; error: string } {
  return { ok: false, error: error instanceof Error ? error.message : fallback };
}

export type AddAffiliateResult =
  | { ok: true; kind: "existing" }
  /** They had no account, so an invite link was made for her to send. */
  | { ok: true; kind: "invited"; inviteUrl: string; email: string }
  | { ok: false; error: string };

/**
 * Adds an affiliate by email.
 *
 * If they already have an account they become an affiliate immediately. If they
 * do not -- the normal case for an outside creator -- an invite link is created
 * for her to send. Public sign-up is disabled, so this is the only way someone
 * who has never paid can get in.
 */
export async function addAffiliateAction(
  email: string,
): Promise<AddAffiliateResult> {
  const admin = await requireAdmin();

  const clean = email.trim().toLowerCase();
  if (!clean || !clean.includes("@")) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const user = await getCloudflareContext()
    .env.DB.prepare(`SELECT id FROM "user" WHERE email = ?;`)
    .bind(clean)
    .first<{ id: string }>();

  try {
    if (user) {
      await createAffiliate(user.id);
      revalidatePath("/admin/affiliates");
      return { ok: true, kind: "existing" };
    }

    const invite = await createInvite({
      email: clean,
      kind: "affiliate",
      createdBy: admin.id,
    });

    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto =
      h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");

    revalidatePath("/admin/affiliates");
    return {
      ok: true,
      kind: "invited",
      email: clean,
      inviteUrl: `${proto}://${host}/invite/${invite.token}`,
    };
  } catch (error) {
    return fail(error, "Could not add that affiliate.");
  }
}

export async function updateCommissionAction(
  affiliateId: string,
  percent: number,
): Promise<AffiliateActionResult> {
  await requireAdmin();

  try {
    await setCommissionPercent(affiliateId, percent);
  } catch (error) {
    return fail(error, "Could not update that rate.");
  }

  revalidatePath("/admin/affiliates");
  return { ok: true };
}

export async function toggleAffiliateStatusAction(
  affiliateId: string,
  paused: boolean,
): Promise<AffiliateActionResult> {
  await requireAdmin();

  try {
    await setAffiliateStatus(affiliateId, paused ? "paused" : "active");
  } catch (error) {
    return fail(error, "Could not update that affiliate.");
  }

  revalidatePath("/admin/affiliates");
  return { ok: true };
}
