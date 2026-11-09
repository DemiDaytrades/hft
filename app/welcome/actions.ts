"use server";

import { headers } from "next/headers";

import { getAuth } from "@/lib/auth";
import { applySubscription } from "@/lib/membership";
import { recordCommissionForInvoice } from "@/lib/commission-attribution";
import { provisionMember } from "@/lib/provision-member";
import { getStripe, friendlyStripeError } from "@/lib/stripe";
import {
  normalizePhone,
  notifyAdminNewMember,
  notifyTempPasswordSms,
  notifyWelcome,
} from "@/lib/communications";
import { site } from "@/lib/site";

const MIN_PASSWORD_LENGTH = 8;

export type WelcomeState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "exists"; message: string }
  | { status: "done" };

/**
 * Turns a paid checkout into an account.
 *
 * The checkout session is re-fetched from Stripe on every submit and its
 * payment status re-checked. The browser only ever supplies a session id, so
 * nothing about "did they actually pay" is taken on trust.
 *
 * Two onboarding paths:
 * 1. SMS consent (temp credentials): a secure random temporary password is
 *    generated, set via Better Auth, and sent by SMS only. The user is forced
 *    to set a permanent password on first login.
 * 2. No SMS consent (self-set password): the user chooses their own password
 *    as before.
 *
 * Communications (welcome email, temp password SMS, admin notification) are
 * sent after the account is created. Delivery failures are logged but never
 * roll back the signup, subscription, or commission attribution.
 */
export async function completeSignupAction(
  _prev: WelcomeState,
  formData: FormData,
): Promise<WelcomeState> {
  const sessionId = String(formData.get("sessionId") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const rawPhone = String(formData.get("phone") ?? "").trim();
  const smsConsent = String(formData.get("sms_consent") ?? "") === "on";
  const normalizedPhone = normalizePhone(rawPhone) || null;

  if (!sessionId) {
    return { status: "error", message: "That link is missing something. Open it again from your receipt." };
  }

  // When SMS consent is given, a temporary password is generated server-side
  // and delivered by SMS only. The user does not choose a password at signup.
  // When SMS consent is not given, the user must choose their own password.
  let loginPassword = password;
  let tempPassword: string | undefined;
  if (smsConsent) {
    if (!normalizedPhone) {
      return {
        status: "error",
        message: "Please enter a valid mobile number to receive your temporary password by SMS.",
      };
    }
    const buf = new Uint8Array(24);
    crypto.getRandomValues(buf);
    tempPassword = Array.from(buf, (b) => b.toString(16).padStart(2, "")).join("");
    loginPassword = tempPassword;
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      status: "error",
      message: `Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  try {
    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription.latest_invoice"],
    });

    if (session.payment_status !== "paid") {
      return {
        status: "error",
        message: "We can't see a completed payment for this link yet. Give it a moment and refresh.",
      };
    }

    const email = session.customer_details?.email ?? session.customer_email;
    const customerId = session.customer ? String(session.customer) : null;
    if (!email || !customerId) {
      return { status: "error", message: "That checkout is missing an email address." };
    }

    const result = await provisionMember({
      email,
      ...(smsConsent
        ? { tempPassword: tempPassword! }
        : { password: loginPassword }),
      name,
      stripeCustomerId: customerId,
      // Carried through Stripe rather than re-read from the browser: the
      // cookie may be gone by now (different device, cleared jar), and Stripe
      // is the one source that survived the redirect.
      referralCode: session.client_reference_id,
      phoneNumber: normalizedPhone,
      smsOptedIn: smsConsent,
    });

    const subscription = session.subscription;
    if (subscription && typeof subscription !== "string") {
      await applySubscription(result.userId, {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd:
          (subscription as unknown as { current_period_end?: number })
            .current_period_end ??
          (subscription.items?.data?.[0] as { current_period_end?: number } | undefined)
            ?.current_period_end ??
          null,
      });

      const invoice = subscription.latest_invoice;
      if (invoice && typeof invoice !== "string") {
        await recordCommissionForInvoice(invoice);
      }
    }

    if (!result.created) {
      return {
        status: "exists",
        message: "You already have an account with this email — sign in with your existing password.",
      };
    }

    // nextCookies() lets this set the session cookie from a server action, so
    // they land signed in rather than at a login form seconds after paying.
    await getAuth().api.signInEmail({
      body: { email, password: loginPassword },
      headers: await headers(),
    });

    // ---- Communications (fire-and-forget style: never roll back signup) ----
    try {
      await notifyWelcome({
        userId: result.userId,
        email,
        name,
        phone: rawPhone || null,
      });
    } catch {
      // Swallowed: welcome comms are best-effort.
    }

    // When SMS consent was given, deliver the temporary password by SMS only.
    // Never email it, never show it to the admin.
    if (smsConsent && tempPassword && normalizedPhone) {
      try {
        await notifyTempPasswordSms({
          userId: result.userId,
          email,
          name,
          phone: normalizedPhone,
          tempPassword,
        });
      } catch {
        // Swallowed: temp password SMS is best-effort.
      }
    }

    try {
      await notifyAdminNewMember({
        adminEmail: site.email,
        adminPhone: (typeof process !== "undefined" && process.env
          ? ((process.env as Record<string, string | undefined>).ADMIN_PHONE_NUMBER ?? null)
          : null),
        memberName: name,
        memberEmail: email,
        memberPhone: rawPhone || null,
      });
    } catch {
      // Swallowed: admin notification is best-effort.
    }

    return { status: "done" };
  } catch (error) {
    return { status: "error", message: friendlyStripeError(error) };
  }
}
