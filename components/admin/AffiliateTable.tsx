"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  toggleAffiliateStatusAction,
  updateCommissionAction,
} from "@/app/(app)/admin/affiliates/actions";
import type { AffiliateWithStats } from "@/lib/affiliates";

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

/** Plain-language payout state -- never a Stripe status string. */
function payoutText(row: AffiliateWithStats): { text: string; tone: string } {
  if (!row.stripeAccountId) {
    return { text: "Hasn't set up payouts", tone: "text-white/40" };
  }
  if (!row.payoutsEnabled) {
    return { text: "Waiting on their details", tone: "text-zone-hold" };
  }
  return { text: "Ready to be paid", tone: "text-zone-buy" };
}

export default function AffiliateTable({
  affiliates,
}: {
  affiliates: AffiliateWithStats[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  function run(id: string, action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const result = await action();
      setBusyId(null);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    });
  }

  if (affiliates.length === 0) {
    return (
      <div className="rounded-lg border border-white/8 bg-ink-900/80 px-6 py-14 text-center">
        <p className="mx-auto max-w-md text-[15px] leading-relaxed text-white/55">
          No affiliates yet. An affiliate gets a link to share, and you pay them
          a share of whatever their referrals pay you — automatically, every
          month, for as long as those members stay.
        </p>
        <p className="mt-3 text-[13.5px] text-white/40">
          Add your first one above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p
          role="alert"
          className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85"
        >
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-white/8 bg-ink-900/80">
        <table className="w-full min-w-[880px] text-left">
          <thead>
            <tr className="border-b border-white/8">
              {["Affiliate", "Their cut", "Clicks", "Members", "Owed", "Paid", "Payouts", ""].map(
                (heading, i) => (
                  <th
                    key={heading || i}
                    scope="col"
                    className="px-5 py-4 font-display text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/45"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {affiliates.map((row) => {
              const busy = busyId === row.id && isPending;
              const paused = row.status === "paused";
              const payout = payoutText(row);
              const draft = drafts[row.id] ?? String(row.commissionPercent);

              return (
                <tr key={row.id} className={busy ? "opacity-50" : ""}>
                  <td className="px-5 py-4">
                    <p className="text-[15px] text-white">{row.name || "—"}</p>
                    <p className="text-[13px] text-white/45">{row.email}</p>
                    <p className="mt-1 font-mono text-[12px] text-white/30">
                      /r/{row.code}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <input
                        aria-label={`Commission percent for ${row.email}`}
                        inputMode="decimal"
                        value={draft}
                        disabled={busy}
                        onChange={(e) =>
                          setDrafts((d) => ({ ...d, [row.id]: e.target.value }))
                        }
                        onBlur={() => {
                          const next = Number(draft);
                          if (!Number.isFinite(next) || next === row.commissionPercent) {
                            return;
                          }
                          run(row.id, () => updateCommissionAction(row.id, next));
                        }}
                        className="w-16 rounded-sm border border-white/12 bg-ink-950 px-2 py-1.5 text-[13.5px] text-white outline-none focus:border-brand-600 disabled:opacity-50"
                      />
                      <span className="text-[13.5px] text-white/45">%</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-[14px] text-white/70">{row.clicks}</td>
                  <td className="px-5 py-4 text-[14px] text-white/70">
                    {row.referredMembers}
                  </td>
                  <td className="px-5 py-4 text-[14px] text-white">
                    {money(row.pendingCents)}
                  </td>
                  <td className="px-5 py-4 text-[14px] text-white/70">
                    {money(row.paidCents)}
                  </td>

                  <td className={`px-5 py-4 text-[13px] ${payout.tone}`}>
                    {payout.text}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        run(row.id, () =>
                          toggleAffiliateStatusAction(row.id, !paused),
                        )
                      }
                      className="rounded-sm border border-white/15 px-3 py-1.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/35 hover:text-white disabled:opacity-40"
                    >
                      {paused ? "Resume" : "Pause"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[13px] leading-relaxed text-white/40">
        Changing someone&apos;s cut only affects future earnings — what they&apos;ve
        already earned stays at the rate it was earned at.
      </p>
    </div>
  );
}
