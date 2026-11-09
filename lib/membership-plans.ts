import "server-only";

import { getStripe } from "./stripe";
import { PRICE_LOOKUP_KEY } from "./stripe-setup";

export type MembershipPlanKey = "legacy" | "student_250";

export type MembershipPlan = {
  key: MembershipPlanKey;
  lookupKey: string;
  label: string;
  amountCents: number;
  currency: "usd";
  interval: "month";
  displayPrice: string;
  description: string;
};

/** Server-authorized recurring membership plans. Prices are resolved by lookup key only (no client price IDs). */
export const MEMBERSHIP_PLANS: Record<MembershipPlanKey, MembershipPlan> = {
  legacy: {
    key: "legacy",
    lookupKey: PRICE_LOOKUP_KEY, // hft_membership (existing admin-managed lookup key)
    label: "HFT Membership",
    amountCents: 15000,
    currency: "usd",
    interval: "month",
    displayPrice: "$150/month",
    description: "Existing HFT membership.",
  },
  student_250: {
    key: "student_250",
    lookupKey: "hft_student_membership_250",
    label: "HFT Membership",
    amountCents: 25000,
    currency: "usd",
    interval: "month",
    displayPrice: "$250/month",
    description: "HFT student membership — $250 USD, recurring monthly.",
  },
};

export const DEFAULT_MEMBERSHIP_PLAN: MembershipPlanKey = "legacy";

export function getMembershipPlan(key: unknown): MembershipPlan | null {
  if (key === "student_250") return MEMBERSHIP_PLANS.student_250;
  if (key === "legacy") return MEMBERSHIP_PLANS.legacy;
  return null;
}

export async function resolveMembershipPriceId(plan: MembershipPlan): Promise<{ id: string; unitAmount: number | null }> {
  const stripe = await getStripe();
  const prices = await stripe.prices.list({ lookup_keys: [plan.lookupKey], limit: 1 });
  const price = prices.data[0];
  if (!price) {
    throw new Error(
      plan.key === "student_250"
        ? `The $250/month membership price is not set up in Stripe yet (lookup key: ${plan.lookupKey}). A new Stripe recurring monthly Price is required before live payment.`
        : "No membership price is set up yet. Connect payments in Settings first.",
    );
  }
  if (price.currency !== plan.currency || price.recurring?.interval !== plan.interval) {
    throw new Error("The configured membership price does not match the required recurring monthly USD plan.");
  }
  if (typeof price.unit_amount === "number" && price.unit_amount !== plan.amountCents) {
    throw new Error(`The configured Stripe Price amount does not match ${plan.displayPrice}.`);
  }
  return { id: price.id, unitAmount: price.unit_amount ?? null };
}
