import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * One-time invite links.
 *
 * The owner creates one, copies the URL, and sends it however she already
 * talks to that person. No email delivery is involved, which is what keeps
 * this workable before the site has any mail setup.
 */

const INVITE_TTL_DAYS = 14;

function db() {
  return getCloudflareContext().env.DB;
}

function newId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

/** URL-safe, unguessable, and short enough to paste into a DM. */
function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export type Invite = {
  id: string;
  token: string;
  email: string;
  kind: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  userId: string | null;
};

export type InviteKind = "affiliate" | "member" | "admin";

export async function createInvite(params: {
  email: string;
  kind?: InviteKind;
  createdBy: string;
}): Promise<Invite> {
  const email = params.email.trim().toLowerCase();
  const now = new Date();
  const expires = new Date(now.getTime() + INVITE_TTL_DAYS * 86400000);
  const token = newToken();

  // Supersede any outstanding invite for this email so an old link cannot be
  // used after she reissues one.
  await db()
    .prepare(
      `UPDATE "invite" SET "expiresAt" = ? WHERE email = ? AND "usedAt" IS NULL;`,
    )
    .bind(now.toISOString(), email)
    .run();

  await db()
    .prepare(
      `INSERT INTO "invite" (id, token, email, kind, "createdBy", "createdAt", "expiresAt")
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
    )
    .bind(
      newId(),
      token,
      email,
      params.kind ?? "affiliate",
      params.createdBy,
      now.toISOString(),
      expires.toISOString(),
    )
    .run();

  const invite = await getInviteByToken(token);
  if (!invite) throw new Error("Could not create the invite.");
  return invite;
}

export async function getInviteByToken(token: string): Promise<Invite | null> {
  return db()
    .prepare(`SELECT * FROM "invite" WHERE token = ?;`)
    .bind(token)
    .first<Invite>();
}

export type InviteStatus = "valid" | "used" | "expired" | "unknown";

export function inviteStatus(invite: Invite | null): InviteStatus {
  if (!invite) return "unknown";
  if (invite.usedAt) return "used";
  if (new Date(invite.expiresAt).getTime() <= Date.now()) return "expired";
  return "valid";
}

export async function markInviteUsed(
  token: string,
  userId: string,
): Promise<void> {
  await db()
    .prepare(
      `UPDATE "invite" SET "usedAt" = ?, "userId" = ? WHERE token = ? AND "usedAt" IS NULL;`,
    )
    .bind(new Date().toISOString(), userId, token)
    .run();
}
