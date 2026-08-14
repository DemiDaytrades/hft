import "server-only";

import { cache } from "react";
import { symmetricDecrypt, symmetricEncrypt } from "better-auth/crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Owner-editable configuration, stored in D1 so nothing here needs a deploy.
 *
 * Secrets are encrypted at rest with SETTINGS_ENCRYPTION_KEY (a Workers secret)
 * using the same primitives Better Auth uses. Encryption does not remove the
 * need for a Workers secret -- it moves the *Stripe* key out of deploys so the
 * owner can rotate it herself, which is the point.
 */

export const SETTING_KEYS = {
  stripeSecretKey: "stripe.secret_key",
  stripeWebhookSecret: "stripe.webhook_secret",
  stripeWebhookId: "stripe.webhook_id",
  stripeProductId: "stripe.product_id",
  stripePriceId: "stripe.price_id",
  stripePortalConfigId: "stripe.portal_config_id",
  stripeKeyHint: "stripe.key_hint",
  membershipPriceCents: "membership.price_cents",
  defaultCommissionPercent: "affiliate.default_commission_percent",
  commissionHoldDays: "affiliate.commission_hold_days",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

/** Fallbacks used until the owner saves her own values. */
export const SETTING_DEFAULTS: Partial<Record<SettingKey, string>> = {
  [SETTING_KEYS.membershipPriceCents]: "15000",
  [SETTING_KEYS.defaultCommissionPercent]: "20",
  [SETTING_KEYS.commissionHoldDays]: "7",
};

function db() {
  return getCloudflareContext().env.DB;
}

function encryptionKey(): string {
  const key = getCloudflareContext().env.SETTINGS_ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "SETTINGS_ENCRYPTION_KEY is not set. Add it to .dev.vars locally and via " +
        "`wrangler secret put SETTINGS_ENCRYPTION_KEY` for deployments.",
    );
  }
  return key;
}

type Row = { key: string; value: string; encrypted: number };

/**
 * Loads every setting once per render pass. Settings are read on most requests
 * (price for checkout, commission for payouts) and the table is tiny, so one
 * cached read beats a query per key.
 */
const loadAll = cache(async (): Promise<Map<string, Row>> => {
  const { results } = await db()
    .prepare(`SELECT key, value, encrypted FROM "app_setting";`)
    .all<Row>();
  return new Map(results.map((row) => [row.key, row]));
});

/** Plain (non-secret) setting, falling back to SETTING_DEFAULTS. */
export async function getSetting(key: SettingKey): Promise<string | null> {
  const row = (await loadAll()).get(key);
  if (!row) return SETTING_DEFAULTS[key] ?? null;
  if (row.encrypted) {
    throw new Error(`"${key}" is a secret -- read it with getSecret().`);
  }
  return row.value;
}

export async function getSettingNumber(key: SettingKey): Promise<number | null> {
  const raw = await getSetting(key);
  if (raw === null) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Decrypted secret. Returns null when unset so callers can prompt for setup. */
export async function getSecret(key: SettingKey): Promise<string | null> {
  const row = (await loadAll()).get(key);
  if (!row) return null;
  if (!row.encrypted) return row.value;

  try {
    return await symmetricDecrypt({ key: encryptionKey(), data: row.value });
  } catch {
    // A rotated or mismatched SETTINGS_ENCRYPTION_KEY leaves undecryptable
    // rows. Treat as "not configured" so the UI prompts for re-entry rather
    // than throwing on every request.
    return null;
  }
}

export async function setSetting(
  key: SettingKey,
  value: string,
  options: { encrypt?: boolean } = {},
): Promise<void> {
  const encrypt = options.encrypt ?? false;
  const stored = encrypt
    ? await symmetricEncrypt({ key: encryptionKey(), data: value })
    : value;

  await db()
    .prepare(
      `INSERT INTO "app_setting" (key, value, encrypted, "updatedAt")
       VALUES (?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         value = excluded.value,
         encrypted = excluded.encrypted,
         "updatedAt" = excluded."updatedAt";`,
    )
    .bind(key, stored, encrypt ? 1 : 0, new Date().toISOString())
    .run();
}

export async function deleteSetting(key: SettingKey): Promise<void> {
  await db().prepare(`DELETE FROM "app_setting" WHERE key = ?;`).bind(key).run();
}

/** "••••4242" — safe to render for a stored secret. */
export function maskSecret(value: string): string {
  return `••••${value.slice(-4)}`;
}
