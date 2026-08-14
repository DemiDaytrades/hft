"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { createCheckoutSession } from "@/lib/checkout";
import { getSession } from "@/lib/dal";
import { getMembership } from "@/lib/membership";
import { REFERRAL_COOKIE } from "@/lib/referral";
import { friendlyStripeError } from "@/lib/stripe";

export type JoinState = { status: "idle" } | { status: "error"; message: string };

async function currentOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto =
    h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function startCheckoutAction(
  _prev: JoinState,
  formData: FormData,
): Promise<JoinState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { status: "error", message: "Enter your email to continue." };

  let url: string;
  try {
    const origin = await currentOrigin();
    const session = await getSession();
    const membership = session ? await getMembership(session.user.id) : null;
    const referral = (await cookies()).get(REFERRAL_COOKIE)?.value ?? null;

    url = await createCheckoutSession({
      origin,
      email: session?.user.email ?? email,
      customerId: membership?.stripeCustomerId ?? null,
      referralCode: referral,
    });
  } catch (error) {
    return { status: "error", message: friendlyStripeError(error) };
  }

  // redirect() throws, so it must sit outside the try or it gets swallowed as
  // a Stripe failure.
  redirect(url);
}
