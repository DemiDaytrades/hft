import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

function db() {
  return getCloudflareContext().env.DB;
}

function env(): Record<string, string | undefined> {
  return getCloudflareContext().env as unknown as Record<string, string | undefined>;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

async function verifyResendSignature(request: Request, rawBody: string): Promise<boolean> {
  const secret = env().RESEND_WEBHOOK_SECRET;
  if (!secret) {
    // If secret not configured, do not accept unverified events
    return false;
  }

  // Resend uses Svix-style webhooks by default; check common header names
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (svixId && svixTimestamp && svixSignature) {
    try {
      const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      );
      const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signedContent));
      // svix-signature may contain multiple signatures like v1,base64...
      const sigs = svixSignature.split(" ");
      for (const s of sigs) {
        const parts = s.split(",");
        const version = parts[0];
        const sig = parts[1];
        if (version === "v1" && sig) {
          // base64url to base64
          const b64 = sig.replace(/-/g, "+").replace(/_/g, "/");
          const expected = btoa(String.fromCharCode(...new Uint8Array(signature)));
          if (timingSafeEqual(b64, expected)) return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  // Fallback: some setups use resend-signature/resend-timestamp
  const resendSig = request.headers.get("resend-signature") || request.headers.get("x-resend-signature");
  const resendTs = request.headers.get("resend-timestamp") || request.headers.get("x-resend-timestamp");
  if (resendSig && resendTs) {
    try {
      const signedContent = `${resendTs}.${rawBody}`;
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      );
      const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signedContent));
      const expected = btoa(String.fromCharCode(...new Uint8Array(signature)));
      const provided = resendSig.replace(/-/g, "+").replace(/_/g, "/");
      return timingSafeEqual(provided, expected);
    } catch {
      return false;
    }
  }

  return false;
}

function mapEventToStatus(type: string): string | null {
  switch (type) {
    case "email.sent":
      return "sent";
    case "email.delivered":
      return "delivered";
    case "email.delivery_delayed":
      return "delivery_delayed";
    case "email.bounced":
      return "bounced";
    case "email.complained":
      return "complained";
    case "email.failed":
      return "failed";
    case "email.suppressed":
      return "suppressed";
    default:
      return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  const rawBody = await request.text();
  const valid = await verifyResendSignature(request, rawBody);
  if (!valid) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const eventType = payload?.type || payload?.event || payload?.event_type;
  if (!eventType || typeof eventType !== "string") {
    return new Response("OK", { status: 200 });
  }

  // Resend email events typically have data.email_id or data.id or data.message_id
  const messageId =
    payload?.data?.email_id ||
    payload?.data?.id ||
    payload?.data?.message_id ||
    payload?.email_id ||
    payload?.id;

  if (!messageId || typeof messageId !== "string") {
    return new Response("OK", { status: 200 });
  }

  const newStatus = mapEventToStatus(eventType);
  if (!newStatus) {
    return new Response("OK", { status: 200 });
  }

  // Match by provider_message_id only; update only status/error/updated_at
  try {
    const now = new Date().toISOString();
    await db()
      .prepare(
        `UPDATE "communication_log"
         SET status = ?, "updated_at" = ?
         WHERE "provider_message_id" = ? AND channel = 'email';`,
      )
      .bind(newStatus, now, messageId)
      .run();
  } catch {
    // Swallow - webhook must not throw
  }

  return new Response("OK", { status: 200 });
}
