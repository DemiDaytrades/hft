import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { getAuth } from "@/lib/auth";
import { requireAdmin } from "@/lib/dal";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { hitRateLimit } from "@/lib/auth-rate-limit-simple";
import { createInvite } from "@/lib/invites";
import { resendComplimentaryInvitation } from "@/lib/complimentary-invitation";
import { notifyInvite } from "@/lib/communications";

export const dynamic = "force-dynamic";

type Action = "status" | "send_reset" | "resend_invite";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (hitRateLimit(`admin-recovery:${admin.id}:${ip}`, 30, 60_000)) {
    return json({ ok: false, error: "Too many requests. Try again shortly." }, 429);
  }

  let payload: { action?: Action; email?: string; userId?: string; kind?: "member" | "admin" | "affiliate"; duration?: string; customDate?: string; requestId?: string };
  try { payload = await request.json(); } catch { return json({ ok: false, error: "Invalid request." }, 400); }
  const action = payload.action;
  const email = String(payload.email ?? "").trim().toLowerCase();
  if (!action || !email || !email.includes("@")) return json({ ok: false, error: "Invalid request." }, 400);

  const db = getCloudflareContext().env.DB;
  const user = await db
    .prepare(
      `SELECT id, name, email, role, "subscriptionStatus",
              "complimentaryAccessExpiresAt", "complimentaryAccessRevokedAt"
       FROM "user" WHERE email = ?;`,
    )
    .bind(email)
    .first<any>();
  const invite = await db
    .prepare(
      `SELECT id, kind, "createdAt", "expiresAt", "usedAt", "userId" FROM "invite" WHERE email = ? ORDER BY "createdAt" DESC LIMIT 1;`,
    )
    .bind(email)
    .first<any>();
  const hasCredential = user
    ? await db
        .prepare(`SELECT 1 AS ok FROM "account" WHERE "userId" = ? AND "providerId" = 'credential' AND password IS NOT NULL LIMIT 1;`)
        .bind(user.id)
        .first<{ ok: number }>()
    : null;

  const status = {
    accountExists: Boolean(user),
    hasCredential: Boolean(hasCredential?.ok),
    complimentaryActive:
      Boolean(user?.complimentaryAccessExpiresAt) &&
      !user?.complimentaryAccessRevokedAt &&
      new Date(user.complimentaryAccessExpiresAt).getTime() > Date.now(),
    complimentaryExpiresAt: user?.complimentaryAccessExpiresAt ?? null,
    invitationRedeemed: invite ? Boolean(invite.usedAt) : null,
    invitationExpiresAt: invite?.expiresAt ?? null,
    invitationKind: invite?.kind ?? null,
    role: user?.role ?? null,
  };

  if (action === "status") return json({ ok: true, status });

  if (action === "send_reset") {
    // Enumeration-safe outward behavior in admin UI is not required, but we
    // must not leak passwords and must rate-limit. Better Auth handles
    // non-existent users generically; we trigger its reset flow.
    if (hitRateLimit(`pwreset:${email}`, 5, 60 * 60_000)) {
      return json({ ok: false, error: "Reset already requested recently for this email. Try again later." }, 429);
    }
    try {
      await getAuth().api.requestPasswordReset({ body: { email, redirectTo: "/reset-password" }, headers: await headers() });
    } catch (e) {
      console.error("[admin-recovery] reset request failed", { adminId: admin.id });
      return json({ ok: false, error: "Could not send a password reset email. Try again later." }, 503);
    }
    return json({ ok: true, status, message: "Password reset requested. Delivery is not guaranteed; check the member’s inbox." });
  }

  if (action === "resend_invite") {
    // Complimentary/member invites: if account already exists, notify as
    // existing-user sign-in (no password overwrite). Otherwise issue a new
    // create-password+activate invite token.
    const kind = payload.kind ?? "member";
    if (kind === "member") {
      try {
        const delivery = await resendComplimentaryInvitation(db, { userId: admin.id, role: "admin" }, { email, channels: ["email"], ...(payload.requestId ? { requestId: payload.requestId } : {}) });
        return json({ ok: true, status, delivery, inviteUrl: delivery.activationUrl, message: "Invitation/access notice processed; an already-sent notice is reused unless an explicit requestId is supplied. Existing access expiration was preserved." });
      } catch (e) { return json({ ok: false, error: e instanceof Error ? e.message : "Could not resend invitation." }, 400); }
    }

    const inviteKind: string = kind;
    const inv = await createInvite({ email, kind: inviteKind as any, createdBy: admin.id });
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
    const inviteUrl = `${proto}://${host}/invite/${inv.token}`;
    try {
      const state = "new";
      await notifyInvite({ userId: user?.id ?? admin.id, email, inviteUrl, kind, inviterName: admin.name ?? undefined, state });
    } catch {}
    return json({ ok: true, status, inviteUrl, message: user ? "Invitation created. The member must redeem this link to activate complimentary access; their existing password is preserved. Share the link securely if delivery is uncertain." : "Invitation created. Share the link securely if email delivery is uncertain." });
  }

  return json({ ok: false, error: "Unsupported action." }, 400);
}
