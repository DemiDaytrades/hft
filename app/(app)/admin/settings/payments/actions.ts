"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal";
import { SETTING_KEYS, deleteSetting } from "@/lib/settings";
import { friendlyStripeError } from "@/lib/stripe";
import { connectStripe } from "@/lib/stripe-setup";

export type ConnectState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "success";
      livemode: boolean;
      accountName: string | null;
      priceCents: number;
      payouts: { state: string; message?: string };
    };

/**
 * Derives the public origin from the request so the webhook is registered
 * against whatever host this actually runs on. Avoids a "what's your domain?"
 * question the owner cannot answer.
 */
async function currentOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  if (!host) throw new Error("Could not determine the site address.");
  return `${proto}://${host}`;
}

export async function connectStripeAction(
  _prev: ConnectState,
  formData: FormData,
): Promise<ConnectState> {
  await requireAdmin();

  const apiKey = String(formData.get("apiKey") ?? "").trim();

  if (!apiKey) {
    return { status: "error", message: "Paste your Stripe key to continue." };
  }
  if (!apiKey.startsWith("sk_") && !apiKey.startsWith("rk_")) {
    return {
      status: "error",
      message:
        "That doesn't look like a Stripe secret key. It should start with sk_ or rk_ — the publishable key (pk_) won't work.",
    };
  }

  try {
    const origin = await currentOrigin();
    const result = await connectStripe(apiKey, `${origin}/api/stripe/webhook`);

    revalidatePath("/admin");
    revalidatePath("/admin/settings/payments");

    return {
      status: "success",
      livemode: result.livemode,
      accountName: result.accountName,
      priceCents: result.priceCents,
      payouts: result.payouts,
    };
  } catch (error) {
    return { status: "error", message: friendlyStripeError(error) };
  }
}

export async function disconnectStripeAction(): Promise<void> {
  await requireAdmin();

  // Leaves the Stripe-side objects intact -- deleting a product or webhook
  // would break live subscriptions. This only forgets the key locally.
  await Promise.all([
    deleteSetting(SETTING_KEYS.stripeSecretKey),
    deleteSetting(SETTING_KEYS.stripeWebhookSecret),
    deleteSetting(SETTING_KEYS.stripeKeyHint),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/settings/payments");
}
