import "server-only";

import { hashPassword } from "better-auth/crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getAffiliateByCode } from "./affiliates";

/**
 * Creates a member account directly in D1.
 *
 * Public sign-up is disabled (see emailAndPassword.disableSignUp), so this is
 * the path for someone who has just paid. It writes the same rows Better Auth
 * would: a `user` row plus a `credential` account holding the scrypt hash.
 * Verified compatible with Better Auth sign-in by scripts/create-admin.mjs.
 */

function db() {
  return getCloudflareContext().env.DB;
}

function newId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export type ProvisionResult =
  | { created: true; userId: string }
  | { created: false; userId: string; reason: "already_exists" };

export async function provisionMember(params: {
  email: string;
  password: string;
  name: string;
  /** Null for invited affiliates, who have an account without ever paying. */
  stripeCustomerId?: string | null;
  referralCode?: string | null;
}): Promise<ProvisionResult> {
  const email = params.email.trim().toLowerCase();
  const now = new Date().toISOString();

  const existing = await db()
    .prepare(`SELECT id FROM "user" WHERE email = ?;`)
    .bind(email)
    .first<{ id: string }>();

  if (existing) {
    // Someone reloaded /welcome, or the webhook already made the link. Attach
    // the customer id but never touch an existing password.
    await db()
      .prepare(
        `UPDATE "user" SET "stripeCustomerId" = COALESCE("stripeCustomerId", ?), "updatedAt" = ?
         WHERE id = ?;`,
      )
      .bind(params.stripeCustomerId ?? null, now, existing.id)
      .run();

    return { created: false, userId: existing.id, reason: "already_exists" };
  }

  const userId = newId();
  const passwordHash = await hashPassword(params.password);

  // Resolve the referral code to an affiliate here rather than trusting a code
  // string on the user row -- a renamed or deleted affiliate must not orphan
  // the attribution.
  const affiliate = params.referralCode
    ? await getAffiliateByCode(params.referralCode)
    : null;

  await db().batch([
    db()
      .prepare(
        `INSERT INTO "user"
           (id, name, email, "emailVerified", role, banned, "stripeCustomerId", "referredByAffiliateId", "createdAt", "updatedAt")
         VALUES (?, ?, ?, 1, 'student', 0, ?, ?, ?, ?);`,
      )
      .bind(
        userId,
        params.name || email.split("@")[0],
        email,
        params.stripeCustomerId ?? null,
        affiliate?.id ?? null,
        now,
        now,
      ),
    db()
      .prepare(
        `INSERT INTO "account"
           (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
         VALUES (?, ?, ?, 'credential', ?, ?, ?);`,
      )
      .bind(newId(), userId, userId, passwordHash, now, now),
  ]);

  return { created: true, userId };
}
