"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal";
import { createInvite, type InviteKind } from "@/lib/invites";
import { notifyInvite } from "@/lib/communications";
import { createComplimentaryInvitation, type ComplimentaryInvitationStatus, type DeliveryChoice } from "@/lib/complimentary-invitation";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type InviteResult =
  | { ok: true; inviteUrl: string; email: string; delivery?: ComplimentaryInvitationStatus }
  | { ok: false; error: string };

/**
 * Creates an invite for staff or a comped member.
 *
 * The invite link is shown in the UI for the admin to copy, and is also
 * delivered to the invitee via email. Delivery failures are logged but never
 * prevent the invite from being created.
 */
export async function createInviteAction(
  email: string,
  kind: InviteKind,
  duration?: string,
  customDate?: string,
  deliveryChannels: DeliveryChoice[] = ["email"],
): Promise<InviteResult> {
  const admin = await requireAdmin();

  const clean = email.trim().toLowerCase();
  if (!clean || !clean.includes("@")) {
    return { ok: false, error: "Enter a valid email address." };
  }

  if (kind === "member") {
    if (duration === "custom" && !customDate) return { ok: false, error: "Choose a future custom expiration date." };
    try {
      const delivery = await createComplimentaryInvitation(getCloudflareContext().env.DB, { userId: admin.id, role: "admin" }, { email: clean, days: duration === "custom" ? undefined : Number(duration || 30), customDate: duration === "custom" ? customDate : undefined, channels: deliveryChannels });
      revalidatePath("/admin/users");
      return { ok: true, email: clean, inviteUrl: delivery.activationUrl || "", delivery };
    } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Could not create complimentary invitation." }; }
  }
  if (kind !== "admin" && kind !== "affiliate") return { ok: false, error: "Invalid invitation type." };

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
    const inviteKind: InviteKind = kind;
    const invite = await createInvite({ email: clean, kind: inviteKind, createdBy: admin.id });

    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto =
      h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");

    const inviteUrl = `${proto}://${host}/invite/${invite.token}`;

    // Deliver the invite link via email (best-effort). SMS is not used here
    // because we don't have the invitee's phone number yet.
    try {
      await notifyInvite({
        userId: admin.id,
        email: clean,
        inviteUrl,
        kind,
        inviterName: admin.name ?? undefined,
      });
    } catch {
      // Swallowed: invite email is best-effort.
    }

    revalidatePath("/admin/users");
    return {
      ok: true,
      email: clean,
      inviteUrl,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not create that invite.",
    };
  }
}
