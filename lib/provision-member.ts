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
  /** Password chosen by the user (normal signup). Mutually exclusive with tempPassword. */
  password?: string;
  /** System-generated temporary password (SMS onboarding). Mutually exclusive with password. When set, must_change_password is forced. */
  tempPassword?: string;
  name: string;
  /** Null for invited affiliates, who have an account without ever paying. */
  stripeCustomerId?: string | null;
  referralCode?: string | null;
  /** E.164 phone number or null. */
  phoneNumber?: string | null;
  /** Whether the user opted into transactional SMS. */
  smsOptedIn?: boolean;
}): Promise<ProvisionResult> {
  const email = params.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const affiliate = params.referralCode
    ? await getAffiliateByCode(params.referralCode)
    : null;
  const phone = params.phoneNumber ?? null;
  const smsOptedIn = params.smsOptedIn === true ? 1 : 0;
  const useTempPassword = params.tempPassword !== undefined;
  const passwordForHash = useTempPassword ? params.tempPassword : params.password;

  if (!passwordForHash) {
    throw new Error("Either password or tempPassword must be provided.");
  }

  const existing = await db()
    .prepare(`SELECT id FROM "user" WHERE email = ?;`)
    .bind(email)
    .first<{ id: string }>();

  if (existing) {
    // Someone reloaded /welcome, or already had an account. Attach missing
    // Stripe/referral links but never overwrite first-touch attribution or an
    // existing password. Update phone/consent if newly provided.
    await db()
      .prepare(
        `UPDATE "user"
         SET "stripeCustomerId" = COALESCE("stripeCustomerId", ?),
             "referredByAffiliateId" = COALESCE("referredByAffiliateId", ?),
             "phone_number" = COALESCE("phone_number", ?),
             "sms_opted_in" = CASE WHEN ? = 1 THEN 1 ELSE "sms_opted_in" END,
             "updatedAt" = ?
         WHERE id = ?;`,
      )
      .bind(
        params.stripeCustomerId ?? null,
        affiliate?.id ?? null,
        phone,
        smsOptedIn,
        now,
        existing.id,
      )
      .run();

    return { created: false, userId: existing.id, reason: "already_exists" };
  }

  const userId = newId();
  const passwordHash = await hashPassword(passwordForHash);
  const mustChangePassword = useTempPassword ? 1 : 0;

  // Resolve the referral code to an affiliate here rather than trusting a code
  // string on the user row -- a renamed or deleted affiliate must not orphan
  // the attribution.
  await db().batch([
    db()
      .prepare(
        `INSERT INTO "user"
           (id, name, email, "emailVerified", role, banned, "stripeCustomerId", "referredByAffiliateId", "phone_number", "sms_opted_in", "must_change_password", "createdAt", "updatedAt")
         VALUES (?, ?, ?, 1, 'student', 0, ?, ?, ?, ?, ?, ?, ?);`,
      )
      .bind(
        userId,
        params.name || email.split("@")[0],
        email,
        params.stripeCustomerId ?? null,
        affiliate?.id ?? null,
        phone,
        smsOptedIn,
        mustChangePassword,
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
