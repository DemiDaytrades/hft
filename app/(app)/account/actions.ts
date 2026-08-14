"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createPortalSession } from "@/lib/checkout";
import { requireUser } from "@/lib/dal";
import { getMembership } from "@/lib/membership";

/**
 * Hands the member to Stripe's own billing portal to update a card, see
 * invoices, or cancel. Keeps card details entirely out of this app.
 */
export async function openBillingPortalAction(): Promise<void> {
  const user = await requireUser();
  const membership = await getMembership(user.id);

  if (!membership?.stripeCustomerId) redirect("/join");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto =
    h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");

  const url = await createPortalSession({
    customerId: membership.stripeCustomerId,
    returnUrl: `${proto}://${host}/account`,
  });

  redirect(url);
}
