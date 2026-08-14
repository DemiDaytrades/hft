"use server";

import { headers } from "next/headers";

import { getAuth } from "@/lib/auth";
import { applySubscription } from "@/lib/membership";
import { provisionMember } from "@/lib/provision-member";
import { getStripe, friendlyStripeError } from "@/lib/stripe";

const MIN_PASSWORD_LENGTH = 12;

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
 */
export async function completeSignupAction(
  _prev: WelcomeState,
  formData: FormData,
): Promise<WelcomeState> {
  const sessionId = String(formData.get("sessionId") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!sessionId) {
    return { status: "error", message: "That link is missing something. Open it again from your receipt." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      status: "error",
      message: `Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  try {
    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
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
      password,
      name,
      stripeCustomerId: customerId,
      // Carried through Stripe rather than re-read from the browser: the
      // cookie may be gone by now (different device, cleared jar), and Stripe
      // is the one source that survived the redirect.
      referralCode: session.client_reference_id,
    });

    if (!result.created) {
      return {
        status: "exists",
        message: "You already have an account with this email — sign in with your existing password.",
      };
    }

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
    }

    // nextCookies() lets this set the session cookie from a server action, so
    // they land signed in rather than at a login form seconds after paying.
    await getAuth().api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    return { status: "done" };
  } catch (error) {
    return { status: "error", message: friendlyStripeError(error) };
  }
}
