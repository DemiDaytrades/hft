"use server";

import { headers } from "next/headers";

import { createAffiliate } from "@/lib/affiliates";
import { getAuth } from "@/lib/auth";
import { getInviteByToken, inviteStatus, markInviteUsed } from "@/lib/invites";
import { provisionMember } from "@/lib/provision-member";

const MIN_PASSWORD_LENGTH = 12;

export type AcceptState =
  | { status: "idle" }
  | { status: "error"; message: string }
  /** Where to send them once the account exists -- staff and affiliates land
   *  in different places. */
  | { status: "done"; redirectTo: string };

/**
 * Turns an invite into an account.
 *
 * The token is re-validated here, not just on the page render -- a server
 * action is a public endpoint, so the page check alone proves nothing.
 */
export async function acceptInviteAction(
  _prev: AcceptState,
  formData: FormData,
): Promise<AcceptState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      status: "error",
      message: `Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  const invite = await getInviteByToken(token);
  const state = inviteStatus(invite);

  if (state !== "valid" || !invite) {
    return {
      status: "error",
      message:
        state === "used"
          ? "This invite has already been used. Try signing in instead."
          : "This invite link is no longer valid. Ask for a new one.",
    };
  }

  const result = await provisionMember({
    email: invite.email,
    password,
    name,
    stripeCustomerId: null,
  });

  if (!result.created) {
    return {
      status: "error",
      message:
        "There's already an account with this email — sign in with your existing password.",
    };
  }

  let redirectTo = "/dashboard";

  if (invite.kind === "affiliate") {
    await createAffiliate(result.userId);
    redirectTo = "/affiliate";
  } else if (invite.kind === "admin") {
    // provisionMember always creates a 'student'; staff are promoted here so
    // there is exactly one place that writes a user row.
    await promoteToAdmin(result.userId);
    redirectTo = "/admin";
  }

  await markInviteUsed(token, result.userId);

  await getAuth().api.signInEmail({
    body: { email: invite.email, password },
    headers: await headers(),
  });

  return { status: "done", redirectTo };
}

async function promoteToAdmin(userId: string): Promise<void> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  await getCloudflareContext()
    .env.DB.prepare(
      `UPDATE "user" SET role = 'admin', "updatedAt" = ? WHERE id = ?;`,
    )
    .bind(new Date().toISOString(), userId)
    .run();
}
