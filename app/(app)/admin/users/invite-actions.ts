"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal";
import { createInvite, type InviteKind } from "@/lib/invites";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type InviteResult =
  | { ok: true; inviteUrl: string; email: string }
  | { ok: false; error: string };

/**
 * Creates an invite for staff or a comped member.
 *
 * Staff invites are how the owner (and anyone she trusts) gets an admin login
 * without a developer running a script. The link is copied and sent by hand --
 * there is no email delivery in the product yet.
 */
export async function createInviteAction(
  email: string,
  kind: InviteKind,
): Promise<InviteResult> {
  const admin = await requireAdmin();

  const clean = email.trim().toLowerCase();
  if (!clean || !clean.includes("@")) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const existing = await getCloudflareContext()
    .env.DB.prepare(`SELECT id FROM "user" WHERE email = ?;`)
    .bind(clean)
    .first<{ id: string }>();

  if (existing) {
    return {
      ok: false,
      error: `${clean} already has an account. Change their role in the table below instead.`,
    };
  }

  try {
    const invite = await createInvite({ email: clean, kind, createdBy: admin.id });

    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto =
      h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");

    revalidatePath("/admin/users");
    return {
      ok: true,
      email: clean,
      inviteUrl: `${proto}://${host}/invite/${invite.token}`,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not create that invite.",
    };
  }
}
