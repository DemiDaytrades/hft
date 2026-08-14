import "server-only";

import { getStripe } from "./stripe";
import { PRICE_LOOKUP_KEY } from "./stripe-setup";

/**
 * Checkout always resolves the price through the lookup key rather than a
 * stored price id. When the owner changes the price a brand new Price object is
 * created and the lookup key moves to it, so this keeps working with no deploy
 * and no settings update.
 */
export async function createCheckoutSession(options: {
  origin: string;
  email?: string;
  customerId?: string | null;
  referralCode?: string | null;
}): Promise<string> {
  const stripe = await getStripe();

  const prices = await stripe.prices.list({
    lookup_keys: [PRICE_LOOKUP_KEY],
    limit: 1,
  });
  const price = prices.data[0];
  if (!price) {
    throw new Error(
      "No membership price is set up yet. Connect payments in Settings first.",
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: price.id, quantity: 1 }],
    success_url: `${options.origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${options.origin}/join?cancelled=1`,
    // Carries the affiliate through checkout so the webhook can attribute the
    // signup without trusting anything the browser sends back afterwards.
    client_reference_id: options.referralCode ?? undefined,
    allow_promotion_codes: true,
    ...(options.customerId
      ? { customer: options.customerId }
      : {
          customer_email: options.email,
          customer_creation: "always" as const,
        }),
    subscription_data: {
      metadata: { referral_code: options.referralCode ?? "" },
    },
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return session.url;
}

/** Stripe-hosted billing management for an existing member. */
export async function createPortalSession(options: {
  customerId: string;
  returnUrl: string;
}): Promise<string> {
  const stripe = await getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: options.customerId,
    return_url: options.returnUrl,
  });
  return session.url;
}
