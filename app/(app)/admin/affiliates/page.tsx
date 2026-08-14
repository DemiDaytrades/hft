import type { Metadata } from "next";

import AddAffiliateForm from "@/components/admin/AddAffiliateForm";
import AffiliateTable from "@/components/admin/AffiliateTable";
import { listAffiliates } from "@/lib/affiliates";
import { getCommissionTotals } from "@/lib/commissions";
import { requireAdmin } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Affiliates",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export default async function AdminAffiliatesPage() {
  await requireAdmin();

  const [affiliates, totals] = await Promise.all([
    listAffiliates(),
    getCommissionTotals(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
            Affiliates
          </h1>
          <p className="mt-1 text-[14px] text-white/45">
            People who bring you members, and what you owe them.
          </p>
        </div>

        {(totals.pendingCents > 0 || totals.paidCents > 0) && (
          <div className="flex gap-6">
            <div>
              <p className="font-display text-[22px] font-bold leading-none text-white">
                {money(totals.pendingCents)}
              </p>
              <p className="mt-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                Owed
              </p>
            </div>
            <div>
              <p className="font-display text-[22px] font-bold leading-none text-white/70">
                {money(totals.paidCents)}
              </p>
              <p className="mt-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                Paid out
              </p>
            </div>
          </div>
        )}
      </div>

      <section className="rounded-lg border border-white/8 bg-ink-900/80 p-6">
        <h2 className="mb-4 font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/80">
          Add an affiliate
        </h2>
        <AddAffiliateForm />
      </section>

      <AffiliateTable affiliates={affiliates} />
    </div>
  );
}
