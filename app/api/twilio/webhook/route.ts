import { getCloudflareContext } from "@opennextjs/cloudflare";

type CfEnv = Record<string, string | undefined>;

/**
 * Twilio incoming message webhook.
 *
 * Handles STOP/opt-out keywords so a member can unsubscribe from transactional
 * SMS by replying to any HFT text. Validates the Twilio request signature so
 * only Twilio can trigger opt-outs.
 *
 * Twilio posts form-encoded data: From, To, Body, AccountSid, etc.
 */

export const dynamic = "force-dynamic";

const STOP_KEYWORDS = ["stop", "stopall", "unsubscribe", "cancel", "quit"];
const START_KEYWORDS = ["start", "subscribe"];

function db() {
  return getCloudflareContext().env.DB;
}

function env(): CfEnv {
  return getCloudflareContext().env as unknown as CfEnv;
}

/** Validate Twilio request signature using Web Crypto (Workers-compatible). */
async function validateTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string | null,
  authToken: string | undefined,
): Promise<boolean> {
  if (!signature || !authToken) return false;

  // Twilio: sort params alphabetically, concatenate URL + key=value pairs.
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("");

  const data = url + sorted;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(authToken),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );

  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));

  return expected === signature;
}

export async function POST(request: Request): Promise<Response> {
  const authToken = env().TWILIO_AUTH_TOKEN;

  const signature = request.headers.get("X-Twilio-Signature");
  const url = request.url;

  const form = await request.formData();
  const params: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    params[key] = String(value);
  }

  // Validate signature (skip in local dev if no auth token configured).
  const isValid = await validateTwilioSignature(url, params, signature, authToken);
  if (!isValid && authToken) {
    return new Response("Invalid signature", { status: 401 });
  }

  const from = params.From; // user's phone number (E.164)
  const body = (params.Body || "").trim().toLowerCase();

  if (!from || !body) {
    return new Response("Missing parameters", { status: 400 });
  }

  // Find the user by phone number.
  const user = await db()
    .prepare(
      `SELECT id, "sms_opted_in" FROM "user" WHERE "phone_number" = ?;`,
    )
    .bind(from)
    .first<{ id: string; sms_opted_in: number }>();

  if (!user) {
    // Unknown number: acknowledge but do nothing.
    return new Response("OK", { status: 200 });
  }

  const now = new Date().toISOString();

  if (STOP_KEYWORDS.includes(body)) {
    // Opt out of SMS.
    if (user.sms_opted_in === 1) {
      await db()
        .prepare(
          `UPDATE "user" SET "sms_opted_in" = 0, "updatedAt" = ? WHERE id = ?;`,
        )
        .bind(now, user.id)
        .run();
    }
  } else if (START_KEYWORDS.includes(body)) {
    // Re-opt-in: require the user to confirm via the app (we don't auto-re-enable
    // from a text reply to avoid accidental re-subscription).
    // No-op here; the user can re-enable SMS in the app when we add a settings UI.
  }

  // Twilio expects a 200 with empty or TwiML body.
  return new Response("OK", { status: 200 });
}

/** Twilio expects `btoa` to be available; it is in Workers. */
declare function btoa(s: string): string;
