import type { Metadata } from "next";

import ConnectStripeForm from "@/components/admin/ConnectStripeForm";
import { requireAdmin } from "@/lib/dal";
import { SETTING_KEYS, getSetting } from "@/lib/settings";
import { isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Payments",
  robots: { index: false, follow: false },
};

export default async function PaymentsSettingsPage() {
  await requireAdmin();

  const [connected, keyHint, priceCents] = await Promise.all([
    isStripeConfigured(),
    getSetting(SETTING_KEYS.stripeKeyHint),
    getSetting(SETTING_KEYS.membershipPriceCents),
  ]);

  const price = Number(priceCents ?? 15000) / 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
          Payments
        </h1>
        <p className="mt-1 text-[14px] text-white/45">
          {connected
            ? "Your Stripe account is connected. Members are charged automatically each month."
            : "Connect Stripe once, and members can start joining."}
        </p>
      </div>

      <section className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
        <ConnectStripeForm connected={connected} keyHint={keyHint} />
      </section>

      {connected && (
        <section className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
          <h2 className="font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/80">
            What members pay
          </h2>
          <p className="mt-3 text-[15px] text-white">
            {price.toLocaleString("en-US", { style: "currency", currency: "USD" })} per
            month
          </p>
          <p className="mt-2 text-[13px] text-white/45">
            You can change this any time in Settings → Pricing. Members who already joined
            keep the price they signed up at.
          </p>
        </section>
      )}
    </div>
  );
}
