import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/dal";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getConsentState, sendNotification, sendSms } from "@/lib/communications";
import { isTelnyxConfigured, isSmsConfigured } from "@/lib/communications/providers";

export const dynamic = "force-dynamic";

const TEST_SMS_BODY = "HFT SMS test successful.";

function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "***";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  return `***-***-${digits.slice(-4)}`;
}

type EligibleRecipient = {
  id: string;
  name: string;
  phoneNumber: string;
  maskedPhone: string;
};

async function getEligibleRecipients(db: D1Database): Promise<EligibleRecipient[]> {
  // Already-confirmed opted-in test recipient(s) whose phone number ends in 5070.
  const { results } = await db
    .prepare(
      `SELECT id, name, "phone_number" AS phoneNumber
       FROM "user"
       WHERE "sms_opted_in" = 1
         AND "phone_number" IS NOT NULL
         AND TRIM("phone_number") <> ''
         AND REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("phone_number", ' ', ''), '-', ''), '(', ''), ')', ''), '+', '') LIKE '%5070'
       ORDER BY name ASC
       LIMIT 25`,
    )
    .all<{ id: string; name: string | null; phoneNumber: string }>();

  return (results ?? []).map((r) => ({
    id: r.id,
    name: r.name?.trim() || "—",
    phoneNumber: r.phoneNumber,
    maskedPhone: maskPhone(r.phoneNumber),
  }));
}

export async function GET() {
  await requireAdmin();
  const { env } = getCloudflareContext();
  const recipients = await getEligibleRecipients(env.DB);
  return NextResponse.json({
    recipients: recipients.map(({ id, name, maskedPhone }) => ({ id, name, maskedPhone })),
    body: TEST_SMS_BODY,
  });
}

export async function POST(request: Request) {
  await requireAdmin();
  const { env } = getCloudflareContext();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  const confirmed = body.confirmed === true;
  const confirmationId = typeof body.confirmationId === "string" ? body.confirmationId.trim() : "";

  if (!userId) {
    return NextResponse.json({ error: "Select a test recipient." }, { status: 400 });
  }
  if (!confirmed) {
    return NextResponse.json({ error: "Explicit confirmation is required before sending." }, { status: 400 });
  }
  // Each explicit confirmation uses a distinct token to prevent accidental
  // duplicate submissions while still allowing intentional separate tests.
  if (!confirmationId || confirmationId.length < 8 || confirmationId.length > 128) {
    return NextResponse.json({ error: "Invalid confirmation token." }, { status: 400 });
  }

  const recipients = await getEligibleRecipients(env.DB);
  const recipient = recipients.find((r) => r.id === userId);
  if (!recipient) {
    return NextResponse.json(
      { error: "Recipient is not eligible (must be opted-in with a phone number ending in 5070)." },
      { status: 400 },
    );
  }

  // Respect existing sms_opted_in consent rules (same rule set sendNotification uses).
  const consent = await getConsentState(recipient.id);
  if (!consent?.smsOptedIn || !consent.phoneNumber) {
    return NextResponse.json({ error: "Recipient has not consented to SMS." }, { status: 403 });
  }
  if (!isSmsConfigured()) {
    return NextResponse.json({ error: "SMS provider is not configured." }, { status: 500 });
  }

  // Uses existing production sendSms() path (Telnyx preferred when configured,
  // Twilio fallback). sendSms records the attempt/result in communication_log.
  // sendNotification() is the consent-gated wrapper in the same module; consent
  // is enforced above, and we use sendSms with a per-confirmation idempotency key
  // so each explicit admin confirmation is a distinct intentional send.
  const provider = isTelnyxConfigured() ? "telnyx" : "twilio";
  const result = await sendSms({
    to: consent.phoneNumber,
    body: TEST_SMS_BODY,
    userId: recipient.id,
    eventType: "generic",
    idempotencyKey: `sms:admin_communications_test:${recipient.id}:${confirmationId}`,
  });
  void sendNotification;

  return NextResponse.json({
    recipient: { name: recipient.name, maskedPhone: recipient.maskedPhone },
    result: {
      channel: result.channel,
      status: result.status,
      provider,
      providerMessageId: result.providerMessageId ?? null,
      error: result.error ?? null,
      idempotencyKey: result.idempotencyKey ?? null,
    },
  });
}
