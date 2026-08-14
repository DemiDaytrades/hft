import type { Metadata } from "next";

import AffiliateSettingsForm from "@/components/admin/AffiliateSettingsForm";
import { requireAdmin } from "@/lib/dal";
import { SETTING_KEYS, getSettingNumber } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Affiliate settings",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AffiliateSettingsPage() {
  await requireAdmin();

  const [percent, holdDays] = await Promise.all([
    getSettingNumber(SETTING_KEYS.defaultCommissionPercent),
    getSettingNumber(SETTING_KEYS.commissionHoldDays),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
          Affiliate settings
        </h1>
        <p className="mt-1 text-[14px] text-white/45">
          How much affiliates earn, and when they get paid.
        </p>
      </div>

      <section className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
        <AffiliateSettingsForm
          defaultPercent={percent ?? 20}
          holdDays={holdDays ?? 7}
        />
      </section>
    </div>
  );
}
