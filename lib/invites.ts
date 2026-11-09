import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * One-time invite links.
 *
 * The invitation helper only creates tokens. Authorized delivery orchestration
 * sends account-setup messages; secure copying remains an admin fallback.
 * Redemption continues to establish the student's own password.
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
  kind: string; // InviteKind base or encoded member duration, e.g. member:30
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  userId: string | null;
};

export type InviteKind = "affiliate" | "member" | "admin";

export async function createInvite(params: {
  email: string;
  kind?: string; // allows encoded member kinds
  createdBy: string;
  reuseValid?: boolean;
}): Promise<Invite> {
  const email = params.email.trim().toLowerCase();
  const now = new Date();
  const expires = new Date(now.getTime() + INVITE_TTL_DAYS * 86400000);
  const token = newToken();

  // Repeated complimentary creation reuses a valid matching link. Rotation is
  // atomic: a failed insert cannot invalidate the previous invitation.
  const existingClause = params.reuseValid
    ? ` AND NOT EXISTS(SELECT 1 FROM invite WHERE email=? AND kind=? AND usedAt IS NULL AND expiresAt>?)`
    : "";
  const extra = params.reuseValid ? [email, params.kind ?? "affiliate", now.toISOString()] : [];
  await db().batch([
    db().prepare(`UPDATE invite SET expiresAt=? WHERE email=? AND usedAt IS NULL${existingClause}`)
      .bind(now.toISOString(), email, ...extra),
    db().prepare(`INSERT INTO invite(id,token,email,kind,createdBy,createdAt,expiresAt)
      SELECT ?,?,?,?,?,?,? WHERE 1=1${existingClause}`)
      .bind(newId(),token,email,params.kind ?? "affiliate",params.createdBy,now.toISOString(),expires.toISOString(),...extra),
  ]);
  if (params.reuseValid) {
    const reused = await db().prepare(`SELECT * FROM invite WHERE email=? AND kind=? AND usedAt IS NULL AND expiresAt>? ORDER BY createdAt DESC,id DESC LIMIT 1`).bind(email,params.kind ?? "affiliate",now.toISOString()).first<Invite>();
    if (!reused) throw new Error("Could not create the invite.");
    return reused;
  }

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

/** Idempotent redemption: safe when re-claiming the same token for the same
 *  user (recovery path). Refuses to steal a token already used by another user. */
export async function markInviteUsedForUser(
  token: string,
  userId: string,
): Promise<void> {
  await db()
    .prepare(
      `UPDATE "invite"
       SET "usedAt" = COALESCE("usedAt", ?), "userId" = COALESCE("userId", ?)
       WHERE token = ? AND ("usedAt" IS NULL OR "userId" = ?);`,
    )
    .bind(new Date().toISOString(), userId, token, userId)
    .run();
}
