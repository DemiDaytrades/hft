"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  saveAffiliateSettingsAction,
  type AffiliateSettingsState,
} from "@/app/(app)/admin/settings/affiliates/actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export default function AffiliateSettingsForm({
  defaultPercent,
  holdDays,
}: {
  defaultPercent: number;
  holdDays: number;
}) {
  const [state, formAction] = useActionState<AffiliateSettingsState, FormData>(
    saveAffiliateSettingsAction,
    { status: "idle" },
  );

  const field =
    "w-28 rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[16px] text-white outline-none transition-colors focus:border-brand-600";
  const labelClass =
    "mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55";

  return (
    <form action={formAction} className="max-w-xl space-y-8">
      <div>
        <label htmlFor="percent" className={labelClass}>
          Default commission
        </label>
        <div className="flex items-center gap-3">
          <input
            id="percent"
            name="percent"
            inputMode="decimal"
            defaultValue={defaultPercent}
            className={field}
          />
          <span className="text-[14px] text-white/45">
            % of every payment their referrals make
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-white/40">
          Used for new affiliates. You can give any individual affiliate a
          different rate on the Affiliates page.
        </p>
      </div>

      <div>
        <label htmlFor="holdDays" className={labelClass}>
          Hold before paying out
        </label>
        <div className="flex items-center gap-3">
          <input
            id="holdDays"
            name="holdDays"
            inputMode="numeric"
            defaultValue={holdDays}
            className={field}
          />
          <span className="text-[14px] text-white/45">days</span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-white/40">
          Earnings are held this long before being sent, so that if a member
          gets a refund you haven&apos;t already paid commission on it. Once
          money leaves for an affiliate&apos;s bank it can&apos;t be pulled back
          automatically.
        </p>
      </div>

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85"
        >
          {state.message}
        </p>
      )}

      {state.status === "saved" && (
        <p
          role="status"
          className="rounded-sm border border-zone-buy/40 bg-zone-buy/10 px-4 py-3 text-[13.5px] text-white/85"
        >
          Saved.
        </p>
      )}

      <SaveButton />
    </form>
  );
}
