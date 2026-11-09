"use server";

import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import { createAffiliate } from "@/lib/affiliates";
import { getAuth } from "@/lib/auth";
import { getInviteByToken, inviteStatus, markInviteUsed, markInviteUsedForUser } from "@/lib/invites";
import { normalizePhone } from "@/lib/communications";
import { provisionMember } from "@/lib/provision-member";
import { hitRateLimit } from "@/lib/auth-rate-limit-simple";
import { assertLifecycleActive } from "@/lib/student-lifecycle";
import { findUserByEmail } from "@/lib/membership";

const MIN_PASSWORD_LENGTH = 8;

export type AcceptState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "recovery"; message: string }
  /** Where to send them once the account exists -- staff and affiliates land
   *  in different places. */
  | { status: "done"; redirectTo: string };

function db() {
  return getCloudflareContext().env.DB;
}

function computeExpiry(inviteKind: string, now: Date): Date {
  const parts = inviteKind.split(":");
  if (parts[1] === "custom" && parts[2]) return new Date(`${parts[2]}T23:59:59`);
  const days = Number.parseInt(parts[1] ?? "30", 10) || 30;
  return new Date(now.getTime() + days * 86400000);
}

async function grantComplimentaryForInvite(userId: string, inviteKind: string): Promise<void> {
  if (!(inviteKind === "member" || inviteKind.startsWith("member:"))) return;
  const now = new Date();
  const expiry = computeExpiry(inviteKind, now);
  // Idempotent upsert of entitlement: never reduces an existing later expiry
  // except by explicit admin revoke path; keeps access active.
  await db()
    .prepare(
      `UPDATE "user"
       SET "complimentaryAccessStartsAt" = COALESCE("complimentaryAccessStartsAt", ?),
           "complimentaryAccessExpiresAt" = CASE
             WHEN "complimentaryAccessExpiresAt" IS NULL THEN ?
             WHEN julianday("complimentaryAccessExpiresAt") < julianday(?) THEN ?
             ELSE "complimentaryAccessExpiresAt" END,
           "complimentaryAccessRevokedAt" = NULL,
           "updatedAt" = ?
       WHERE id = ? AND lifecycle_status = 'ACTIVE';`,
    )
    .bind(now.toISOString(), expiry.toISOString(), expiry.toISOString(), expiry.toISOString(), now.toISOString(), userId)
    .run();
}

async function postProvisionRedirect(userId: string, inviteKind: string): Promise<string> {
  let redirectTo = "/dashboard";
  if (inviteKind === "affiliate") {
    await createAffiliate(userId);
    redirectTo = "/affiliate";
  } else if (inviteKind === "admin") {
    await promoteToAdmin(userId);
    redirectTo = "/admin";
  }
  await grantComplimentaryForInvite(userId, inviteKind);
  return redirectTo;
}

/**
 * Turns an invite into an account.
 *
 * The token is re-validated here, not just on the page render -- a server
 * action is a public endpoint, so the page check alone proves nothing.
 *
 * Idempotent/recoverable: a valid, unused invite for an email that already has
 * an account will attach the complimentary entitlement (if applicable) and mark
 * the invite redeemed, but NEVER overwrites the existing password. Recovery
 * uses Forgot Password / admin-issued reset.
 */
export async function acceptInviteAction(
  _prev: AcceptState,
  formData: FormData,
): Promise<AcceptState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const rawPhone = String(formData.get("phone") ?? "").trim();
  const smsConsent = String(formData.get("sms_consent") ?? "") === "on";

  const reqHeaders = await headers();
  const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (hitRateLimit(`invite-accept:${ip}:${token.slice(0, 24)}`, 20, 15 * 60_000)) {
    return { status: "error", message: "Too many attempts. Please try again later." };
  }

  const invite = await getInviteByToken(token);
  const state = inviteStatus(invite);

  if (state === "used" && invite) {
    return { status: "error", message: "This invite has already been used. If you need access, sign in or use Forgot Password." };
  }
  if (state !== "valid" || !invite) {
    return { status: "error", message: "This invite link is no longer valid. Ask for a new one." };
  }

  const existing = await findUserByEmail(invite.email);
  if (existing) { try { await assertLifecycleActive(db(), existing.id); } catch { return { status: "error", message: "This account is deactivated or unavailable. Ask HFT staff about reactivation." }; } }
  if (!existing && password.length < MIN_PASSWORD_LENGTH) {
    return { status: "error", message: `Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  const result = existing ? { created: false as const, userId: existing.id } : await provisionMember({
    email: invite.email,
    password,
    name,
    stripeCustomerId: null,
    phoneNumber: normalizePhone(rawPhone) || null,
    smsOptedIn: smsConsent,
  });

  if (!result.created) {
    // Existing account: validate-invite context allows safe, idempotent
    // complimentary entitlement attachment. NEVER overwrite password.
    try {
      await grantComplimentaryForInvite(result.userId, invite.kind);
      await markInviteUsedForUser(token, result.userId);
      // Notify existing user: complimentary attached, sign in with existing password.
      if (invite.kind === "member" || invite.kind.startsWith("member:")) {
        try {
          const { notifyInvite } = await import("@/lib/communications");
          const h = await headers();
          const host = h.get("x-forwarded-host") ?? h.get("host");
          const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
          await notifyInvite({ userId: result.userId, email: invite.email, inviteUrl: `${proto}://${host}/login`, kind: "member", state: "existing_user" });
        } catch {}
      }
    } catch (error) {
      console.error("[invite] existing-account redemption recovery failed", { error: error instanceof Error ? error.message : "unknown" });
    }
    return {
      status: "recovery",
      message:
        "This account already exists. If complimentary High Frequency VIP access was included, it has been applied. Sign in with your existing password, or use Forgot Password to securely set a new password.",
    };
  }

  let redirectTo = "/dashboard";
  try {
    redirectTo = await postProvisionRedirect(result.userId, invite.kind);
    await markInviteUsed(token, result.userId);
  } catch (error) {
    // Account/credential created; avoid duplicate-user paths by not retrying
    // creation. Marking used is best-effort here only if grant succeeded in
    // spirit is complex; keep invite redeemable via recovery path? We already
    // created the user — recovery (existing-account branch) will attach/mark.
    console.error("[invite] post-provision step failed", { error: error instanceof Error ? error.message : "unknown" });
    return {
      status: "recovery",
      message:
        "Your account was created, but we could not finish setup automatically. Use Sign in or Forgot Password to access your account; if this was a complimentary invitation, an admin can confirm your access.",
    };
  }

  try {
    await getAuth().api.signInEmail({
      body: { email: invite.email, password },
      headers: await headers(),
    });
  } catch (error) {
    console.error("[invite] auto sign-in failed after redemption", { error: error instanceof Error ? error.message : "unknown" });
    return { status: "recovery", message: "Your account is ready. Please sign in with the password you just created." };
  }

  return { status: "done", redirectTo };
}

async function promoteToAdmin(userId: string): Promise<void> {
  await db()
    .prepare(`UPDATE "user" SET role = 'admin', "updatedAt" = ? WHERE id = ?;`)
    .bind(new Date().toISOString(), userId)
    .run();
}

