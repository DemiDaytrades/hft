import type { Metadata } from "next";

import PayoutSetupButton from "@/components/affiliate/PayoutSetupButton";
import ReferralLink from "@/components/affiliate/ReferralLink";
import { getAffiliateByUserId } from "@/lib/affiliates";
import { getCommissionTotals } from "@/lib/commissions";
import { requirePasswordReadyUser } from "@/lib/dal";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { syncPayoutStatusAction } from "./actions";

export const metadata: Metadata = {
  title: "Affiliate",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export default async function AffiliatePage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const user = await requirePasswordReadyUser();
  const { setup } = await searchParams;

  const affiliate = await getAffiliateByUserId(user.id);

  if (!affiliate) {
    return (
      <div className="max-w-xl space-y-4">
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
          Affiliate
        </h1>
        <p className="text-[15px] leading-relaxed text-white/60">
          You&apos;re not set up as an affiliate yet. Ask the team to add you and
          you&apos;ll get a link to share.
        </p>
      </div>
    );
  }

  // Coming back from Stripe: re-check now rather than waiting on the webhook.
  if (setup === "done") await syncPayoutStatusAction();

  const [totals, stats] = await Promise.all([
    getCommissionTotals(affiliate.id),
    getAffiliateStats(affiliate.id),
  ]);

  const ready = affiliate.payoutsEnabled === 1;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
          Affiliate
        </h1>
        <p className="mt-1 text-[14px] text-white/45">
          You earn {affiliate.commissionPercent}% of every payment your referrals
          make, for as long as they stay a member.
        </p>
      </div>

      <ReferralLink code={affiliate.code} />

      {!ready && (
        <section className="rounded-lg border border-brand-600/40 bg-brand-600/5 p-6">
          <h2 className="font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/85">
            Set up how you get paid
          </h2>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/65">
            Before we can send you anything, Stripe needs your bank details and a
            few identity questions. It takes a couple of minutes and you only do
            it once. Your earnings keep adding up in the meantime.
          </p>
          <div className="mt-5">
            <PayoutSetupButton
              started={Boolean(affiliate.stripeAccountId)}
            />
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Clicks", value: String(stats.clicks) },
          { label: "Members joined", value: String(stats.referredMembers) },
          { label: "Pending", value: money(totals.pendingCents) },
          { label: "Paid out", value: money(totals.paidCents) },
        ].map((tile) => (
          <div
            key={tile.label}
            className="rounded-lg border border-white/8 bg-ink-900/80 p-5"
          >
            <p className="font-display text-[28px] font-bold leading-none text-white">
              {tile.value}
            </p>
            <p className="mt-2 font-display text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/45">
              {tile.label}
            </p>
          </div>
        ))}
      </div>

      {totals.pendingCents > 0 && (
        <p className="text-[13.5px] leading-relaxed text-white/50">
          Pending earnings are released a few days after each payment clears, in
          case of refunds. Once released they&apos;re sent to your bank
          automatically — you don&apos;t need to invoice anyone.
        </p>
      )}
    </div>
  );
}

async function getAffiliateStats(affiliateId: string) {
  const db = getCloudflareContext().env.DB;
  const row = await db
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM "referral_click" WHERE "affiliateId" = ?1) AS clicks,
         (SELECT COUNT(*) FROM "user" WHERE "referredByAffiliateId" = ?1) AS "referredMembers";`,
    )
    .bind(affiliateId)
    .first<{ clicks: number; referredMembers: number }>();

  return row ?? { clicks: 0, referredMembers: 0 };
}
