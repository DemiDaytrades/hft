import "server-only";

import {
  getResend,
  getTwilio,
  getTelnyx,
  isEmailConfigured,
  isSmsConfigured,
  isTelnyxConfigured,
} from "@/lib/communications/providers";
import {
  adminNewMemberEmail,
  adminNewMemberSms,
  affiliateInviteEmail,
  affiliatePayoutEmail,
  affiliatePayoutSms,
  consultationAdminEmail,
  consultationAdminSms,
  consultationConfirmedEmail,
  consultationConfirmedSms,
  inviteEmail,
  inviteSms,
  paymentFailedEmail,
  paymentFailedSms,
  subscriptionCanceledEmail,
  tempPasswordSms,
  welcomeEmail,
  welcomeSms,
} from "@/lib/communications/templates";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** ------------------------------------------------------------------ */
/* Types                                                              */
/** ------------------------------------------------------------------ */

export type CommChannel = "email" | "sms";

export type CommEventType =
  | "complimentary_invite"
  | "teaching"
  | "welcome"
  | "invite"
  | "affiliate_invite"
  | "password"
  | "payment_failed"
  | "subscription_canceled"
  | "affiliate_payout"
  | "admin_new_member"
  | "consultation_confirmed"
  | "consultation_admin"
  | "generic";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  userId?: string | null;
  eventType?: CommEventType;
  idempotencyKey?: string;
}

export interface SendSmsParams {
  to: string;
  body: string;
  userId?: string | null;
  eventType?: CommEventType;
  idempotencyKey?: string;
  /** Allow sending a required opt-out confirmation even if consent gating would normally block. */
  allowOptOutConfirmation?: boolean;
}

export interface SendResult {
  channel: CommChannel;
  status: "sent" | "skipped" | "failed";
  providerMessageId?: string;
  error?: string;
  idempotencyKey?: string;
  /** Provider outcome may be unknown after a timeout; do not blindly retry secure invites or teaching notifications. */
  uncertain?: boolean;
}

/** ------------------------------------------------------------------ */
/* Helpers                                                            */
/** ------------------------------------------------------------------ */

const LOGIN_URL = "/login";

/** These callers coordinate retries durably and must retain unknown outcomes. */
function requiresReliableDelivery(eventType: CommEventType | undefined): eventType is 'complimentary_invite' | 'teaching' {
  return eventType === "complimentary_invite" || eventType === "teaching";
}

/** Admin phone number for new-member SMS notifications. */
function adminPhone(): string | null {
  return (
    (typeof process !== "undefined" && process.env
      ? ((process.env as Record<string, string | undefined>).ADMIN_PHONE_NUMBER ??
        null)
      : null) ?? null
  );
}

/** Whether admin SMS notifications are enabled. Defaults to false. */
function adminSmsEnabled(): boolean {
  return (
    (typeof process !== "undefined" && process.env
      ? ((process.env as Record<string, string | undefined>).ADMIN_SMS_ENABLED ??
        "false")
      : "false") === "true"
  );
}

function db() {
  return getCloudflareContext().env.DB;
}

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

/** Normalize a phone number to E.164. Accepts digits, +, spaces, dashes, parens.
 *  Returns null if it cannot be parsed as a plausible phone number. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^0-9+]/g, "");
  if (!digits) return null;

  let normalized = digits;
  if (!normalized.startsWith("+")) {
    // Assume US/Canada if no country code and 10 digits.
    const onlyDigits = normalized.replace(/\+/g, "");
    if (onlyDigits.length === 10) {
      normalized = "+1" + onlyDigits;
    } else if (onlyDigits.length === 11 && onlyDigits.startsWith("1")) {
      normalized = "+" + onlyDigits;
    } else {
      return null;
    }
  }

  // E.164: + followed by 1-15 digits
  const e164 = /^\+[1-9]\d{1,14}$/;
  if (!e164.test(normalized)) return null;
  return normalized;
}

/** ------------------------------------------------------------------ */
/* Consent                                                            */
/** ------------------------------------------------------------------ */

export type ConsentState = {
  emailOptedIn: boolean;
  smsOptedIn: boolean;
  phoneNumber: string | null;
  phoneVerified: boolean;
};

/** Read a user's communication preferences. Returns defaults when the user
 *  has no phone / consent columns populated yet (legacy members).
 *  Returns null-style defaults when userId is null (system/admin sends). */
export async function getConsentState(
  userId: string | null,
): Promise<ConsentState | null> {
  if (!userId) return null;
  const row = await db()
    .prepare(
      `SELECT "email_opted_in", "sms_opted_in", "phone_number", "phone_verified"
       FROM "user" WHERE id = ?;`,
    )
    .bind(userId)
    .first<{
      email_opted_in: number | null;
      sms_opted_in: number | null;
      phone_number: string | null;
      phone_verified: number | null;
    }>();

  if (!row) return null;

  return {
    emailOptedIn: row.email_opted_in === null ? true : row.email_opted_in === 1,
    smsOptedIn: row.sms_opted_in === null ? false : row.sms_opted_in === 1,
    phoneNumber: row.phone_number ?? null,
    phoneVerified: row.phone_verified === null ? false : row.phone_verified === 1,
  };
}

/** Can we send SMS to this user? Requires phone + opt-in + provider configured. */
export async function canSendSms(userId: string): Promise<boolean> {
  const consent = await getConsentState(userId);
  if (!consent) return false;
  if (!consent.phoneNumber || !consent.smsOptedIn) return false;
  return isSmsConfigured();
}

/** Can we send email to this user? Requires email_opted_in (default true) + provider configured. */
export async function canSendEmail(userId: string): Promise<boolean> {
  const consent = await getConsentState(userId);
  if (!consent) return isEmailConfigured();
  if (!consent.emailOptedIn) return false;
  return isEmailConfigured();
}

/** Update SMS consent for a user. */
export async function setSmsConsent(
  userId: string,
  optedIn: boolean,
  phoneNumber?: string | null,
): Promise<void> {
  const normalized =
    phoneNumber !== undefined && phoneNumber !== null
      ? normalizePhone(phoneNumber)
      : null;

  await db()
    .prepare(
      `UPDATE "user"
       SET "sms_opted_in" = ?,
           "phone_number" = COALESCE(?, "phone_number"),
           "phone_verified" = CASE WHEN ? IS NOT NULL THEN 0 ELSE "phone_verified" END,
           "updatedAt" = ?
       WHERE id = ?;`,
    )
    .bind(
      optedIn ? 1 : 0,
      normalized ?? null,
      normalized,
      nowIso(),
      userId,
    )
    .run();
}

/** ------------------------------------------------------------------ */
/* Idempotency / logging                                              */
/** ------------------------------------------------------------------ */

type LogRow = {
  id: string;
  user_id: string;
  channel: string;
  event_type: string;
  idempotency_key: string;
  provider_message_id: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

/** Check whether this communication was already sent (idempotency). */
export async function wasSent(
  idempotencyKey: string,
): Promise<{ sent: boolean; messageId?: string }> {
  const row = await db()
    .prepare(
      `SELECT status, "provider_message_id" FROM "communication_log"
       WHERE "idempotency_key" = ?;`,
    )
    .bind(idempotencyKey)
    .first<{ status: string; provider_message_id: string | null }>();

  if (!row) return { sent: false };
  return { sent: row.status === "sent", messageId: row.provider_message_id ?? undefined };
}

/** Record a communication attempt in the log. Upsert by idempotency key. */
async function logCommunication(params: {
  userId: string | null;
  channel: CommChannel;
  eventType: CommEventType;
  idempotencyKey: string;
  status: SendResult["status"];
  providerMessageId?: string;
  error?: string;
}): Promise<void> {
  const existing = await db()
    .prepare(`SELECT id FROM "communication_log" WHERE "idempotency_key" = ?;`)
    .bind(params.idempotencyKey)
    .first<{ id: string }>();

  const now = nowIso();
  if (existing) {
    await db()
      .prepare(
         `UPDATE "communication_log"
          SET status = ?, "provider_message_id" = ?, "error_message" = ?, "updated_at" = ?
          WHERE id = ?;`,
      )
      .bind(
        params.status,
        params.providerMessageId ?? null,
        params.error ?? null,
        now,
        existing.id,
      )
      .run();
  } else {
    await db()
      .prepare(
        `INSERT INTO "communication_log"
          (id, "user_id", channel, "event_type", "idempotency_key",
           "provider_message_id", status, "error_message", "created_at", "updated_at")
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      )
      .bind(
        newId(),
        params.userId,
        params.channel,
        params.eventType,
        params.idempotencyKey,
        params.providerMessageId ?? null,
        params.status,
        params.error ?? null,
        now,
        now,
      )
      .run();
  }
}

/** ------------------------------------------------------------------ */
/* Senders                                                            */
/** ------------------------------------------------------------------ */

export async function sendEmail(
  params: SendEmailParams,
): Promise<SendResult> {
  const key =
    params.idempotencyKey ?? `email:${params.eventType ?? "generic"}:${params.to}`;

  const already = await wasSent(key);
  if (already.sent) {
    return {
      channel: "email",
      status: "skipped",
      providerMessageId: already.messageId,
      idempotencyKey: key,
    };
  }

  const resend = getResend();
  if (!resend) {
    await logCommunication({
      userId: params.userId ?? null,
      channel: "email",
      eventType: params.eventType ?? "generic",
      idempotencyKey: key,
      status: "failed",
      error: "Email provider not configured (RESEND_API_KEY missing).",
    });
    return { channel: "email", status: "failed", idempotencyKey: key, error: "Email provider not configured." };
  }

  try {
    const response = await resend.emails.send({
      from: (process.env as Record<string, string | undefined>).EMAIL_FROM ?? "noreply@highfrequency.vip",
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }, requiresReliableDelivery(params.eventType) ? {
      idempotencyKey: key,
      ...(params.eventType === "teaching" ? { signal: AbortSignal.timeout(30_000) } : {}),
    } : undefined);

    const providerError = (response as { error?: { message?: string; statusCode?: number } })?.error;
    const messageId = (response as { data?: { id?: string } })?.data?.id;

    if (providerError || !messageId) {
      const errorMessage = params.eventType === "complimentary_invite" ? "Email provider rejected the invitation." : providerError?.message ?? "Resend returned no message ID.";
      await logCommunication({
        userId: params.userId ?? null,
        channel: "email",
        eventType: params.eventType ?? "generic",
        idempotencyKey: key,
        status: "failed",
        error: errorMessage,
      });
      return {
        channel: "email",
        status: "failed",
        idempotencyKey: key,
        error: errorMessage,
        providerMessageId: undefined,
        uncertain: requiresReliableDelivery(params.eventType) && (!providerError || (providerError.statusCode ?? 0) >= 500 || (params.eventType === "teaching" && !providerError.statusCode)),
      };
    }

    await logCommunication({
      userId: params.userId ?? null,
      channel: "email",
      eventType: params.eventType ?? "generic",
      idempotencyKey: key,
      status: "sent",
      providerMessageId: messageId,
    });
    return { channel: "email", status: "sent", providerMessageId: messageId, idempotencyKey: key };
  } catch (error) {
    const message = params.eventType === "complimentary_invite" ? "Email invitation delivery failed." : error instanceof Error ? error.message : "Unknown email error";
    // Log but never throw — communications must not roll back the business action.
    console.error("[communications] email send failed", { to: params.to, eventType: params.eventType, error: message });
    await logCommunication({
      userId: params.userId ?? null,
      channel: "email",
      eventType: params.eventType ?? "generic",
      idempotencyKey: key,
      status: "failed",
      error: message,
    });
    return { channel: "email", status: "failed", idempotencyKey: key, error: message, uncertain: requiresReliableDelivery(params.eventType) };
  }
}

export async function sendSms(
  params: SendSmsParams,
): Promise<SendResult> {
  const key =
    params.idempotencyKey ?? `sms:${params.eventType ?? "generic"}:${params.to}`;

  const already = await wasSent(key);
  if (already.sent) {
    return {
      channel: "sms",
      status: "skipped",
      providerMessageId: already.messageId,
      idempotencyKey: key,
    };
  }

  // Prefer Telnyx when configured
  let telnyxFailure: string | null = null;
  if (isTelnyxConfigured()) {
    try {
      const result = await sendSmsViaTelnyx(params, params.to);
      await logCommunication({
        userId: params.userId ?? null,
        channel: "sms",
        eventType: params.eventType ?? "generic",
        idempotencyKey: key,
        status: result.status,
        providerMessageId: result.providerMessageId,
        error: result.error,
      });
      return { ...result, idempotencyKey: key };
    } catch (error) {
      const raw = error instanceof Error ? error.message : "Unknown Telnyx error";
      // Sanitize: never expose secrets, tokens, or full payloads
      telnyxFailure = params.eventType === "complimentary_invite" ? "Telnyx invitation delivery failed." : `Telnyx failed: ${raw}`.slice(0, 500);
      console.error("[communications] telnyx sms send failed", { to: params.to, eventType: params.eventType, error: telnyxFailure });
      const rejectionStatus = (error as { status?: number })?.status;
      if (requiresReliableDelivery(params.eventType) && !(rejectionStatus && rejectionStatus >= 400 && rejectionStatus < 500)) {
        await logCommunication({ userId: params.userId ?? null, channel: "sms", eventType: params.eventType, idempotencyKey: key, status: "failed", error: telnyxFailure });
        return { channel: "sms", status: "failed", idempotencyKey: key, error: telnyxFailure, uncertain: true };
      }
      // Fall through to Twilio as fallback if available
    }
  }

  const twilio = getTwilio();
  if (!twilio) {
    const errorMsg = telnyxFailure ? telnyxFailure : "SMS provider not configured (TELNYX or TWILIO missing).";
    await logCommunication({
      userId: params.userId ?? null,
      channel: "sms",
      eventType: params.eventType ?? "generic",
      idempotencyKey: key,
      status: "failed",
      error: errorMsg,
    });
    return { channel: "sms", status: "failed", idempotencyKey: key, error: errorMsg };
  }

  const fromNumber = (process.env as Record<string, string | undefined>).TWILIO_FROM_NUMBER;
  if (!fromNumber) {
    await logCommunication({
      userId: params.userId ?? null,
      channel: "sms",
      eventType: params.eventType ?? "generic",
      idempotencyKey: key,
      status: "failed",
      error: "TWILIO_FROM_NUMBER not configured.",
    });
    return { channel: "sms", status: "failed", idempotencyKey: key, error: "TWILIO_FROM_NUMBER not configured." };
  }

  try {
    const message = await twilio.messages.create({
      body: params.body,
      from: fromNumber,
      to: params.to,
    });

    await logCommunication({
      userId: params.userId ?? null,
      channel: "sms",
      eventType: params.eventType ?? "generic",
      idempotencyKey: key,
      status: requiresReliableDelivery(params.eventType) && !message.sid ? "failed" : "sent",
      providerMessageId: message.sid,
    });
    return { channel: "sms", status: requiresReliableDelivery(params.eventType) && !message.sid ? "failed" : "sent", providerMessageId: message.sid, idempotencyKey: key, uncertain: requiresReliableDelivery(params.eventType) && !message.sid };
  } catch (error) {
    const message = params.eventType === "complimentary_invite" ? "SMS invitation delivery failed." : error instanceof Error ? error.message : "Unknown SMS error";
    console.error("[communications] sms send failed", { to: params.to, eventType: params.eventType, error: message });
    await logCommunication({
      userId: params.userId ?? null,
      channel: "sms",
      eventType: params.eventType ?? "generic",
      idempotencyKey: key,
      status: "failed",
      error: message,
    });
    return { channel: "sms", status: "failed", idempotencyKey: key, error: message, uncertain: requiresReliableDelivery(params.eventType) && !((error as { status?: number })?.status! >= 400 && (error as { status?: number })?.status! < 500) };
  }
}

/** ------------------------------------------------------------------ */
/* Combined notification                                              */
/** ------------------------------------------------------------------ */

export interface SendNotificationOptions {
  userId: string | null;
  toEmail?: string;
  toPhone?: string; // E.164, optional
  eventType: CommEventType;
  email?: { subject: string; html: string; text: string };
  sms?: { body: string };
  /** Force email even if provider not configured (for logging purposes). */
  forceEmail?: boolean;
  /** Force SMS even if consent not checked (for testing). */
  forceSms?: boolean;
}

export async function sendNotification(
  options: SendNotificationOptions,
): Promise<SendResult[]> {
  const results: SendResult[] = [];

  // --- Email ---
  if (options.email) {
    const consent = await getConsentState(options.userId);
    const emailEnabled = options.forceEmail
      ? isEmailConfigured()
      : consent
        ? consent.emailOptedIn && isEmailConfigured()
      : isEmailConfigured();

    if (emailEnabled && options.toEmail) {
      results.push(await sendEmail({
        to: options.toEmail,
        subject: options.email.subject,
        html: options.email.html,
        text: options.email.text,
        userId: options.userId,
        eventType: options.eventType,
        idempotencyKey: `email:${options.eventType}:${options.userId}`,
      }));
    } else {
      results.push({
        channel: "email",
        status: "skipped",
        idempotencyKey: `email:${options.eventType}:${options.userId}`,
      });
    }
  }

  // --- SMS ---
  if (options.sms) {
    const consent = await getConsentState(options.userId);
    const smsEnabled = options.forceSms
      ? isSmsConfigured() && Boolean(options.toPhone)
      : consent
        ? consent.smsOptedIn && Boolean(consent.phoneNumber) && isSmsConfigured()
      : false;

    const to = options.toPhone ?? consent?.phoneNumber ?? null;
    if (smsEnabled && to) {
      results.push(await sendSms({
        to,
        body: options.sms.body,
        userId: options.userId,
        eventType: options.eventType,
        idempotencyKey: `sms:${options.eventType}:${options.userId}`,
      }));
    } else {
      results.push({
        channel: "sms",
        status: "skipped",
        idempotencyKey: `sms:${options.eventType}:${options.userId}`,
      });
    }
  }

  return results;
}

/** ------------------------------------------------------------------ */
/* Convenience: event-based sends                                     */
/** ------------------------------------------------------------------ */

/** Welcome a newly paid member. Sends email + SMS based on consent. */
export async function notifyWelcome(params: {
  userId: string;
  email: string;
  name: string;
  phone?: string | null;
  loginUrl?: string;
}): Promise<SendResult[]> {
  return sendNotification({
    userId: params.userId,
    toEmail: params.email,
    toPhone: params.phone ?? undefined,
    eventType: "welcome",
    email: welcomeEmail({ name: params.name, loginUrl: params.loginUrl ?? LOGIN_URL }),
    sms: params.phone ? welcomeSms({ name: params.name }) : undefined,
  });
}

/** Send a temporary password via SMS only. Never emails the password.
 *  Idempotent keyed on userId + event type so replays are safe. */
export async function notifyTempPasswordSms(params: {
  userId: string;
  email: string;
  name: string;
  phone: string; // E.164
  tempPassword: string;
  loginUrl?: string;
}): Promise<SendResult[]> {
  return sendNotification({
    userId: params.userId,
    toEmail: undefined, // never email the temp password
    toPhone: params.phone,
    eventType: "password",
    email: undefined,
    sms: tempPasswordSms({
      name: params.name,
      email: params.email,
      tempPassword: params.tempPassword,
      loginUrl: params.loginUrl ?? LOGIN_URL,
    }),
  });
}

/** Notify admin(s) of a new member. Email always; SMS only when enabled. */
export async function notifyAdminNewMember(params: {
  adminEmail: string;
  adminPhone?: string | null;
  memberName: string;
  memberEmail: string;
  memberPhone: string | null;
}): Promise<SendResult[]> {
  const results: SendResult[] = [
    await sendEmail({
      to: params.adminEmail,
      ...adminNewMemberEmail({
        adminEmail: params.adminEmail,
        memberName: params.memberName,
        memberEmail: params.memberEmail,
        memberPhone: params.memberPhone,
      }),
      userId: null,
      eventType: "admin_new_member",
      idempotencyKey: `email:admin_new_member:${params.memberEmail}`,
    }),
  ];

  // Admin SMS is independent of the new member's SMS consent.
  // It is controlled by ADMIN_SMS_ENABLED and ADMIN_PHONE_NUMBER env vars.
  if (adminSmsEnabled() && params.adminPhone) {
    results.push(
      await sendSms({
        to: params.adminPhone,
        body: adminNewMemberSms({ memberName: params.memberName }).body,
        userId: null,
        eventType: "admin_new_member",
        idempotencyKey: `sms:admin_new_member:${params.memberEmail}`,
      }),
    );
  }

  return results;
}

/** Send an invite link via email (and SMS if phone + consent on file).
 *  `state` controls CTA/wording: `new` (default) = create password + activate;
 *  `existing_user` = sign in with existing password (complimentary grant). */
export async function notifyInvite(params: {
  userId: string;
  email: string;
  phone?: string | null;
  inviteUrl: string;
  kind: "admin" | "member" | "affiliate";
  inviterName?: string | null;
  state?: "new" | "existing_user" | "existing_user_pending";
}): Promise<SendResult[]> {
  if (params.state === "existing_user" || params.state === "existing_user_pending") {
    const { complimentaryExistingUserEmail, complimentaryExistingUserSms } = await import("./communications/templates");
    const pending = params.state === "existing_user_pending";
    const signInUrl = pending ? params.inviteUrl : params.inviteUrl.replace(/\/invite\/[^/]+$/, "/login");
    return sendNotification({
      userId: params.userId,
      toEmail: params.email,
      toPhone: params.phone ?? undefined,
      eventType: "invite",
      email: complimentaryExistingUserEmail({ signInUrl, inviterName: params.inviterName, pending }),
      sms: params.phone ? complimentaryExistingUserSms({ signInUrl, pending }) : undefined,
    });
  }
  const { inviteEmail, inviteSms } = await import("./communications/templates");
  const email = inviteEmail({ inviteUrl: params.inviteUrl, kind: params.kind, inviterName: params.inviterName });
  return sendNotification({
    userId: params.userId,
    toEmail: params.email,
    toPhone: params.phone ?? undefined,
    eventType: params.kind === "affiliate" ? "affiliate_invite" : "invite",
    email,
    sms: params.phone ? inviteSms({ inviteUrl: params.inviteUrl }) : undefined,
  });
}

/** Notify a member of a failed payment. */
export async function notifyPaymentFailed(params: {
  userId: string;
  email: string;
  phone?: string | null;
  name: string;
  amount: string;
  retryUrl: string;
}): Promise<SendResult[]> {
  return sendNotification({
    userId: params.userId,
    toEmail: params.email,
    toPhone: params.phone ?? undefined,
    eventType: "payment_failed",
    email: paymentFailedEmail({
      name: params.name,
      amount: params.amount,
      retryUrl: params.retryUrl,
    }),
    sms: params.phone ? paymentFailedSms({ name: params.name, amount: params.amount }) : undefined,
  });
}

/** Notify a member their subscription was canceled. */
export async function notifySubscriptionCanceled(params: {
  userId: string;
  email: string;
  phone?: string | null;
  name: string;
}): Promise<SendResult[]> {
  return sendNotification({
    userId: params.userId,
    toEmail: params.email,
    toPhone: params.phone ?? undefined,
    eventType: "subscription_canceled",
    email: subscriptionCanceledEmail({ name: params.name }),
  });
}

/** Notify an affiliate their payout was sent. */
export async function notifyAffiliatePayout(params: {
  userId: string;
  email: string;
  phone?: string | null;
  name: string;
  amount: string;
}): Promise<SendResult[]> {
  return sendNotification({
    userId: params.userId,
    toEmail: params.email,
    toPhone: params.phone ?? undefined,
    eventType: "affiliate_payout",
    email: affiliatePayoutEmail({ name: params.name, amount: params.amount }),
    sms: params.phone ? affiliatePayoutSms({ name: params.name, amount: params.amount }) : undefined,
  });
}

/** Customer confirmation email + optional SMS after a booking is confirmed. */
export async function notifyConsultationConfirmed(params: {
  userId: string | null;
  email: string;
  phone?: string | null;
  customerName: string;
  consultationType: string;
  appointmentAt: string;
  durationMin: number;
  timezone: string;
  amountCents: number;
}): Promise<SendResult[]> {
  return sendNotification({
    userId: params.userId,
    toEmail: params.email,
    toPhone: params.phone ?? undefined,
    eventType: "consultation_confirmed",
    email: consultationConfirmedEmail({
      customerName: params.customerName,
      consultationType: params.consultationType,
      appointmentAt: params.appointmentAt,
      durationMin: params.durationMin,
      timezone: params.timezone,
      amountCents: params.amountCents,
    }),
    sms: params.phone
      ? consultationConfirmedSms({
          customerName: params.customerName,
      consultationType: String(params.consultationType),
          appointmentAt: params.appointmentAt,
          durationMin: params.durationMin,
          timezone: params.timezone,
        })
      : undefined,
  });
}

/** Admin notification email + optional SMS when a booking is confirmed. */
export async function notifyConsultationAdmin(params: {
  userId: string | null;
  adminEmail: string;
  adminPhone?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  consultationType: string;
  appointmentAt: string;
  durationMin: number;
  timezone: string;
  amountCents: number;
  questions: Record<string, string>;
  adminBookingUrl: string;
}): Promise<SendResult[]> {
  const results: SendResult[] = [
    await sendEmail({
      to: params.adminEmail,
      ...consultationAdminEmail({
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        customerPhone: params.customerPhone,
        consultationType: params.consultationType,
        appointmentAt: params.appointmentAt,
        durationMin: params.durationMin,
        timezone: params.timezone,
        amountCents: params.amountCents,
        questions: params.questions,
        adminBookingUrl: params.adminBookingUrl,
      }),
      userId: null,
      eventType: "consultation_admin",
      idempotencyKey: `email:consultation_admin:${params.customerEmail}:${params.appointmentAt}`,
    }),
  ];

  // Admin SMS is independent of customer SMS consent — controlled by ADMIN_SMS_ENABLED.
  if (adminSmsEnabled() && params.adminPhone) {
    results.push(
      await sendSms({
        to: params.adminPhone,
        body: consultationAdminSms({
          customerName: params.customerName,
          amountCents: params.amountCents,
          durationMin: params.durationMin,
          appointmentAt: params.appointmentAt,
          timezone: params.timezone,
          adminBookingUrl: params.adminBookingUrl,
        }).body,
        userId: null,
        eventType: "consultation_admin",
        idempotencyKey: `sms:consultation_admin:${params.customerEmail}:${params.appointmentAt}`,
      }),
    );
  }

  return results;
}

async function sendSmsViaTelnyx(params: SendSmsParams, to: string): Promise<SendResult> {
  const providers = await import("@/lib/communications/providers");
  const telnyx = providers.getTelnyx?.();
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>;
  const apiKey = telnyx?.apiKey || env.TELNYX_API_KEY;
  const from = env.TELNYX_FROM_NUMBER;
  const messagingProfileId = env.TELNYX_MESSAGING_PROFILE_ID;
  if (!apiKey) throw new Error("Telnyx not configured");
  if (!from && !messagingProfileId) throw new Error("Telnyx from/messaging profile not configured");

  const normalizedTo = normalizePhone(to);
  if (!normalizedTo) {
    throw new Error("Invalid destination phone number.");
  }

  const body: any = { to: normalizedTo, text: params.body };
  if (from) body.from = from;
  if (messagingProfileId) body.messaging_profile_id = messagingProfileId;

  const res = await fetch("https://api.telnyx.com/v2/messages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...(params.eventType === "teaching" ? { signal: AbortSignal.timeout(30_000) } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw Object.assign(new Error(`Telnyx error: ${res.status} ${text}`), { status: res.status });
  }

  const json: any = await res.json();
  const messageId = json?.data?.id;
  return { channel: "sms", status: messageId ? "sent" : "failed", providerMessageId: messageId, idempotencyKey: params.idempotencyKey, uncertain: !messageId && requiresReliableDelivery(params.eventType) };
}
