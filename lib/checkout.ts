import "server-only";

import { getStripe } from "./stripe";
import { PRICE_LOOKUP_KEY } from "./stripe-setup";
import { getMembershipPlan, resolveMembershipPriceId, type MembershipPlanKey } from "./membership-plans";

/**
 * Membership checkout resolves server-authorized recurring prices by lookup key.
 * Legacy/default membership keeps existing behavior (PRICE_LOOKUP_KEY / hft_membership).
 * New plans (e.g. $250/month student membership) are resolved by their own lookup key.
 */
export async function createCheckoutSession(options: {
  origin: string;
  email?: string;
  customerId?: string | null;
  referralCode?: string | null;
  planKey?: MembershipPlanKey | string | null;
}): Promise<string> {
  const stripe = await getStripe();
  const selectedPlan = getMembershipPlan(options.planKey);

  let priceId: string;
  if (selectedPlan) {
    ({ id: priceId } = await resolveMembershipPriceId(selectedPlan));
  } else {
    // Backward-compatible default path.
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
    priceId = price.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${options.origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${options.origin}/join?cancelled=1`,
    // Carries the affiliate through checkout so the webhook can attribute the
    // signup without trusting anything the browser sends back afterwards.
    client_reference_id: options.referralCode ?? undefined,
    allow_promotion_codes: true,
    ...(options.customerId
      ? { customer: options.customerId }
      : { customer_email: options.email }),
    subscription_data: {
      metadata: {
        referral_code: options.referralCode ?? "",
        membership_plan: selectedPlan?.key ?? "legacy",
        membership_lookup_key: selectedPlan?.lookupKey ?? PRICE_LOOKUP_KEY,
      },
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
