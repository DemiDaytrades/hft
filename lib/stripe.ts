import "server-only";

import Stripe from "stripe";

import { SETTING_KEYS, getSecret } from "./settings";

/**
 * Stripe client built from the key the owner saved in /admin/settings/payments,
 * so she can rotate it without a deploy.
 *
 * Built per request rather than at module load: the key lives in D1, and the
 * binding only exists inside a request (same constraint as getAuth()).
 */

/** Thrown when Stripe has not been connected yet -- callers turn this into a
 *  "connect your payments" prompt rather than a 500. */
export class StripeNotConfiguredError extends Error {
  constructor() {
    super("Stripe has not been connected yet.");
    this.name = "StripeNotConfiguredError";
  }
}

function build(apiKey: string): Stripe {
  return new Stripe(apiKey, {
    // Workers has no Node http module. Passing the fetch client explicitly
    // rather than relying on the bundler picking Stripe's "worker" export
    // condition, which we do not control through the Next/OpenNext build.
    httpClient: Stripe.createFetchHttpClient(),
    appInfo: { name: "HFT Membership" },
  });
}

export async function tryGetStripe(): Promise<Stripe | null> {
  const apiKey = await getSecret(SETTING_KEYS.stripeSecretKey);
  return apiKey ? build(apiKey) : null;
}

export async function getStripe(): Promise<Stripe> {
  const stripe = await tryGetStripe();
  if (!stripe) throw new StripeNotConfiguredError();
  return stripe;
}

/** Client from an explicit key -- used by the setup wizard to validate a key
 *  the owner just pasted, before anything is saved. */
export function stripeFromKey(apiKey: string): Stripe {
  return build(apiKey);
}

export async function isStripeConfigured(): Promise<boolean> {
  return (await getSecret(SETTING_KEYS.stripeSecretKey)) !== null;
}

/**
 * Turns a Stripe error into something the owner can act on. She should never
 * see a raw Stripe error code.
 */
export function friendlyStripeError(error: unknown): string {
  if (error instanceof StripeNotConfiguredError) {
    return "Payments aren't connected yet. Add your Stripe key in Settings → Payments.";
  }
  if (error instanceof Stripe.errors.StripeAuthenticationError) {
    return "That Stripe key was rejected. Check you copied the whole key, and that it hasn't been revoked in Stripe.";
  }
  if (error instanceof Stripe.errors.StripePermissionError) {
    return "That Stripe key doesn't have enough access. Create a key with write access to products, prices, and webhooks.";
  }
  if (error instanceof Stripe.errors.StripeConnectionError) {
    return "Couldn't reach Stripe just then. Try again in a moment.";
  }
  if (error instanceof Stripe.errors.StripeError) {
    return error.message;
  }
  return "Something went wrong talking to Stripe. Try again.";
}
