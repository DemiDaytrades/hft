import "server-only";

import { Resend } from "resend";
import Twilio from "twilio";

import { getCloudflareContext } from "@opennextjs/cloudflare";

// Twilio's default export is a factory function; its instance type is awkward
// to name statically, so we type the client as any internally.
type TwilioClient = any;

/**
 * Provider clients built lazily per request from Cloudflare env / Workers secrets.
 * Credentials never live in source control or the client bundle.
 *
 * Custom env vars (RESEND_API_KEY, TWILIO_*) are set via `wrangler secret put`
 * and are not part of the generated CloudflareEnv type, so we read them through
 * a Record cast.
 */

let resendClient: Resend | null = null;
let twilioClient: TwilioClient | null = null;

function env(): Record<string, string | undefined> {
  return getCloudflareContext().env as unknown as Record<string, string | undefined>;
}

export function getResend(): Resend | null {
  if (resendClient) return resendClient;
  const apiKey = env().RESEND_API_KEY;
  if (!apiKey) return null;
  resendClient = new Resend(apiKey);
  return resendClient;
}

export function getTwilio(): TwilioClient | null {
  if (twilioClient) return twilioClient;
  const accountSid = env().TWILIO_ACCOUNT_SID;
  const authToken = env().TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  twilioClient = new (Twilio as any)(accountSid, authToken);
  return twilioClient;
}

export function isEmailConfigured(): boolean {
  return getResend() !== null;
}

export function isSmsConfigured(): boolean {
  if (isTelnyxConfigured()) return true;
  return getTwilio() !== null;
}

let telnyxClient: any = null;

export function getTelnyx(): any | null {
  if (telnyxClient) return telnyxClient;
  const apiKey = env().TELNYX_API_KEY;
  if (!apiKey) return null;
  // Lazy init - Telnyx uses REST API, we can just store config
  telnyxClient = { apiKey };
  return telnyxClient;
}

export function isTelnyxConfigured(): boolean {
  return getTelnyx() !== null && !!(env().TELNYX_MESSAGING_PROFILE_ID || env().TELNYX_FROM_NUMBER);
}
