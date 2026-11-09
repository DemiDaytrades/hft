import "server-only";

/**
 * SAFE diagnostic helper (read-only). Returns only non-sensitive state flags.
 * Never returns passwords, hashes, tokens, secrets, or full session data.
 * Intended for admin-authorized recovery procedures run in a controlled context.
 */
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type MemberRecoveryDiagnostic = {
  accountExists: boolean;
  hasCredential: boolean;
  role: string | null;
  subscriptionStatus: string | null;
  complimentaryActive: boolean;
  complimentaryExpiresAt: string | null;
  complimentaryRevoked: boolean;
  latestInvitation: null | {
    redeemed: boolean;
    expired: boolean;
    kind: string | null;
    expiresAt: string | null;
  };
};

export async function getMemberRecoveryDiagnostic(emailRaw: string): Promise<MemberRecoveryDiagnostic> {
  const email = emailRaw.trim().toLowerCase();
  const db = getCloudflareContext().env.DB;
  const user = await db
    .prepare(
      `SELECT id, role, "subscriptionStatus", "complimentaryAccessExpiresAt", "complimentaryAccessRevokedAt"
       FROM "user" WHERE email = ?;`,
    )
    .bind(email)
    .first<any>();
  const cred = user
    ? await db
        .prepare(`SELECT 1 AS ok FROM "account" WHERE "userId" = ? AND "providerId" = 'credential' AND password IS NOT NULL LIMIT 1;`)
        .bind(user.id)
        .first<{ ok: number }>()
    : null;
  const inv = await db
    .prepare(`SELECT kind, "expiresAt", "usedAt" FROM "invite" WHERE email = ? ORDER BY "createdAt" DESC LIMIT 1;`)
    .bind(email)
    .first<any>();
  const revoked = Boolean(user?.complimentaryAccessRevokedAt);
  const exp = user?.complimentaryAccessExpiresAt ? new Date(user.complimentaryAccessExpiresAt).getTime() : 0;
  return {
    accountExists: Boolean(user),
    hasCredential: Boolean(cred?.ok),
    role: user?.role ?? null,
    subscriptionStatus: user?.subscriptionStatus ?? null,
    complimentaryActive: Boolean(exp > Date.now() && !revoked),
    complimentaryExpiresAt: user?.complimentaryAccessExpiresAt ?? null,
    complimentaryRevoked: revoked,
    latestInvitation: inv
      ? { redeemed: Boolean(inv.usedAt), expired: new Date(inv.expiresAt).getTime() <= Date.now(), kind: inv.kind ?? null, expiresAt: inv.expiresAt ?? null }
      : null,
  };
}
