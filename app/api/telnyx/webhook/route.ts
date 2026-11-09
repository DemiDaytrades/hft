import { getCloudflareContext } from "@opennextjs/cloudflare";

type CfEnv = Record<string, string | undefined>;

export const dynamic = "force-dynamic";

const STOP_KEYWORDS = ["stop", "stopall", "unsubscribe", "cancel", "quit", "end", "revoke"];
const START_KEYWORDS = ["start", "subscribe", "unstop", "yes"];
const HELP_KEYWORDS = ["help", "info"];

function db() {
  return getCloudflareContext().env.DB;
}

function env(): CfEnv {
  return getCloudflareContext().env as unknown as CfEnv;
}

// Telnyx webhook signature verification (Ed25519)
async function validateTelnyxSignature(request: Request, rawBody: string): Promise<boolean> {
  const publicKey = env().TELNYX_WEBHOOK_PUBLIC_KEY;
  if (!publicKey) {
    // Fail closed in production-like environments if key expected; allow only if truly missing in dev
    return false;
  }

  const signature = request.headers.get("telnyx-signature-ed25519") || request.headers.get("x-telnyx-signature-ed25519");
  const timestamp = request.headers.get("telnyx-timestamp") || request.headers.get("x-telnyx-timestamp");
  
  if (!signature || !timestamp) {
    return false;
  }

  try {
    // Telnyx signs: timestamp + "|" + payload (raw body)
    const signedPayload = `${timestamp}|${rawBody}`;
    const keyData = base64ToArrayBuffer(publicKey);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "Ed25519" },
      false,
      ["verify"]
    );
    const sigData = base64ToArrayBuffer(signature);
    const verified = await crypto.subtle.verify(
      "Ed25519",
      cryptoKey,
      sigData,
      new TextEncoder().encode(signedPayload)
    );
    return verified;
  } catch {
    return false;
  }
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function POST(request: Request): Promise<Response> {
  const rawBody = await request.text();
  const valid = await validateTelnyxSignature(request, rawBody);
  if (!valid) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // Telnyx webhook structure
  const eventType = payload?.data?.event_type || payload?.event_type;
  if (eventType && !eventType.includes("message")) {
    return new Response("OK", { status: 200 });
  }

  const from = payload?.data?.payload?.from?.phone_number || payload?.data?.payload?.from || payload?.from;
  const body = (payload?.data?.payload?.text || payload?.text || payload?.body || "").trim().toLowerCase();

  if (!from || !body) {
    return new Response("OK", { status: 200 });
  }

  const user = await db()
    .prepare(`SELECT id, "sms_opted_in" FROM "user" WHERE "phone_number" = ?;`)
    .bind(from)
    .first<{ id: string; sms_opted_in: number }>();

  if (!user) {
    return new Response("OK", { status: 200 });
  }

  const now = new Date().toISOString();

  if (STOP_KEYWORDS.includes(body)) {
    if (user.sms_opted_in === 1) {
      await db()
        .prepare(`UPDATE "user" SET "sms_opted_in" = 0, "updatedAt" = ? WHERE id = ?;`)
        .bind(now, user.id)
        .run();
    }
    try {
      const { sendSms } = await import("@/lib/communications");
      await sendSms({
        to: from,
        body: "High Frequency Talent: You have been unsubscribed and will receive no further messages. Reply START to resubscribe.",
        userId: user.id,
        eventType: "generic",
        idempotencyKey: `sms:telnyx_stop:${from}:${Math.floor(Date.now() / 60000)}`,
        // Required opt-out confirmation must be sent even after opt-out is recorded
        allowOptOutConfirmation: true,
      });
    } catch {
      // Do not fail webhook
    }
    return new Response("OK", { status: 200 });
  } else if (START_KEYWORDS.includes(body)) {
    if (user.sms_opted_in !== 1) {
      await db()
        .prepare(`UPDATE "user" SET "sms_opted_in" = 1, "updatedAt" = ? WHERE id = ?;`)
        .bind(now, user.id)
        .run();
    }
    try {
      const { sendSms } = await import("@/lib/communications");
      await sendSms({
        to: from,
        body: "High Frequency Talent: You have been resubscribed and will receive messages again. Reply STOP to opt out, HELP for help.",
        userId: user.id,
        eventType: "generic",
        idempotencyKey: `sms:telnyx_start:${from}:${Math.floor(Date.now() / 60000)}`,
      });
    } catch {
      // Do not fail webhook
    }
    return new Response("OK", { status: 200 });
  } else if (HELP_KEYWORDS.includes(body)) {
    try {
      const { sendSms } = await import("@/lib/communications");
      await sendSms({
        to: from,
        body: "High Frequency Talent support: Msg frequency varies. Msg & data rates may apply. Reply STOP to opt out. Contact hello@highfrequency.vip for help.",
        userId: user.id,
        eventType: "generic",
        idempotencyKey: `sms:telnyx_help:${from}:${Math.floor(Date.now() / 60000)}`,
      });
    } catch {
      // Do not fail webhook
    }
    return new Response("OK", { status: 200 });
  }

  return new Response("OK", { status: 200 });
}
