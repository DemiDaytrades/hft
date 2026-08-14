import type { Metadata } from "next";
import Link from "next/link";

import PriceEditor from "@/components/admin/PriceEditor";
import { requireAdmin } from "@/lib/dal";
import { getPricingOverview } from "@/lib/pricing";
import { StripeNotConfiguredError } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Pricing",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PricingSettingsPage() {
  await requireAdmin();

  let overview;
  try {
    overview = await getPricingOverview();
  } catch (error) {
    if (error instanceof StripeNotConfiguredError) {
      return (
        <div className="space-y-6">
          <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
            Pricing
          </h1>
          <div className="max-w-xl rounded-lg border border-white/8 bg-ink-900/80 p-8">
            <p className="text-[15px] leading-relaxed text-white/70">
              Connect your Stripe account first, then you can set what members pay.
            </p>
            <Link
              href="/admin/settings/payments"
              className="mt-6 inline-block rounded-sm bg-brand-600 px-6 py-3 font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500"
            >
              Connect payments
            </Link>
          </div>
        </div>
      );
    }
    throw error;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
          Pricing
        </h1>
        <p className="mt-1 text-[14px] text-white/45">
          What new members pay to join.
        </p>
      </div>

      <section className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
        <PriceEditor
          currentPriceCents={overview.currentPriceCents}
          activeMemberCount={overview.activeMemberCount}
          onOlderPriceCount={overview.onOlderPriceCount}
        />
      </section>
    </div>
  );
}
