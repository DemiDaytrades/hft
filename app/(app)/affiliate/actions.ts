"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createOnboardingLink, refreshPayoutStatus } from "@/lib/affiliate-payouts";
import { getAffiliateByUserId, setPayoutsEnabled } from "@/lib/affiliates";
import { requirePasswordReadyUser } from "@/lib/dal";
import { friendlyStripeError } from "@/lib/stripe";

async function currentOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto =
    h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export type PayoutSetupState =
  | { status: "idle" }
  | { status: "error"; message: string };

export async function startPayoutSetupAction(
  _prev: PayoutSetupState,
  _formData: FormData,
): Promise<PayoutSetupState> {
  const user = await requirePasswordReadyUser();
  const affiliate = await getAffiliateByUserId(user.id);
  if (!affiliate) {
    return { status: "error", message: "You're not set up as an affiliate yet." };
  }

  let url: string;
  try {
    url = await createOnboardingLink({
      affiliateId: affiliate.id,
      email: user.email,
      origin: await currentOrigin(),
    });
  } catch (error) {
    return { status: "error", message: friendlyStripeError(error) };
  }

  // redirect() throws, so it must sit outside the try.
  redirect(url);
}

/** Called when they return from Stripe, so the page is right straight away
 *  instead of waiting on the account.updated webhook. */
export async function syncPayoutStatusAction(): Promise<void> {
  const user = await requirePasswordReadyUser();
  const affiliate = await getAffiliateByUserId(user.id);
  if (!affiliate?.stripeAccountId) return;

  try {
    const enabled = await refreshPayoutStatus(affiliate.stripeAccountId);
    await setPayoutsEnabled(affiliate.stripeAccountId, enabled);
    revalidatePath("/affiliate");
  } catch {
    // Non-fatal: the webhook will correct this shortly.
  }
}
