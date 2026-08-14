import "server-only";

import { getAffiliateById, linkStripeAccount } from "./affiliates";
import { getStripe } from "./stripe";

/**
 * Stripe Express onboarding for affiliates.
 *
 * Stripe collects their bank details, identity and tax forms on its own hosted
 * pages -- none of it touches this app, and the owner never has to chase anyone
 * for a bank account number.
 */

/**
 * Returns a Stripe-hosted onboarding URL for this affiliate, creating their
 * connected account on first use.
 *
 * Account links are single-use and short-lived, so this is called fresh each
 * time they press the button rather than stored.
 */
export async function createOnboardingLink(params: {
  affiliateId: string;
  email: string;
  origin: string;
}): Promise<string> {
  const stripe = await getStripe();
  const affiliate = await getAffiliateById(params.affiliateId);
  if (!affiliate) throw new Error("Affiliate not found.");

  let accountId = affiliate.stripeAccountId;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: params.email,
      capabilities: { transfers: { requested: true } },
      business_type: "individual",
      metadata: { affiliate_id: affiliate.id },
    });
    accountId = account.id;
    await linkStripeAccount(affiliate.id, accountId);
  }

  const link = await stripe.accountLinks.create({
    account: accountId,
    // Stripe sends them back here whether they finish or bail, and the
    // account.updated webhook is what actually flips payoutsEnabled.
    refresh_url: `${params.origin}/affiliate?setup=refresh`,
    return_url: `${params.origin}/affiliate?setup=done`,
    type: "account_onboarding",
  });

  return link.url;
}

/**
 * Re-reads payout readiness straight from Stripe. Used when they land back on
 * the dashboard, so the page is correct immediately rather than waiting for the
 * account.updated webhook to arrive.
 */
export async function refreshPayoutStatus(
  stripeAccountId: string,
): Promise<boolean> {
  const stripe = await getStripe();
  const account = await stripe.accounts.retrieve(stripeAccountId);
  return Boolean(account.payouts_enabled);
}
