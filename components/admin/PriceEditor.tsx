"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  changePriceAction,
  migrateMembersAction,
  type MigrateState,
  type PriceState,
} from "@/app/(app)/admin/settings/pricing/actions";

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function MigrateButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm border border-zone-sell/50 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-zone-sell transition-colors hover:bg-zone-sell/10 disabled:opacity-50"
    >
      {pending ? "Moving members…" : "Move existing members to the new price"}
    </button>
  );
}

export default function PriceEditor({
  currentPriceCents,
  activeMemberCount,
  onOlderPriceCount,
}: {
  currentPriceCents: number;
  activeMemberCount: number;
  onOlderPriceCount: number;
}) {
  const [priceState, priceAction] = useActionState<PriceState, FormData>(
    changePriceAction,
    { status: "idle" },
  );
  const [migrateState, migrateAction] = useActionState<MigrateState, FormData>(
    migrateMembersAction,
    { status: "idle" },
  );
  const [draft, setDraft] = useState(String(currentPriceCents / 100));
  const [confirmingMigrate, setConfirmingMigrate] = useState(false);

  const draftCents = Math.round(Number(draft.replace(/[^0-9.]/g, "")) * 100);
  const changed = Number.isFinite(draftCents) && draftCents !== currentPriceCents;

  const memberWord = activeMemberCount === 1 ? "member" : "members";

  return (
    <div className="space-y-10">
      <form action={priceAction} className="max-w-md space-y-5">
        <div>
          <label
            htmlFor="price"
            className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55"
          >
            Monthly price
          </label>
          <div className="flex items-center gap-3">
            <span className="text-[18px] text-white/50">$</span>
            <input
              id="price"
              name="price"
              inputMode="decimal"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="w-40 rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[18px] text-white outline-none transition-colors focus:border-brand-600"
            />
            <span className="text-[14px] text-white/45">per month</span>
          </div>
        </div>

        {/* The consequence, in real numbers, before she commits. */}
        {changed && (
          <div className="rounded-sm border border-white/12 bg-white/5 px-4 py-4 text-[13.5px] leading-relaxed text-white/75">
            <p className="font-semibold text-white">Here&apos;s what will happen:</p>
            <ul className="mt-2 space-y-1.5">
              <li>
                New members will pay{" "}
                <span className="text-white">{money(draftCents)}</span> per month.
              </li>
              <li>
                Your {activeMemberCount} current {memberWord} keep paying what they
                signed up at — nothing changes for them.
              </li>
            </ul>
          </div>
        )}

        {priceState.status === "error" && (
          <p
            role="alert"
            className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85"
          >
            {priceState.message}
          </p>
        )}

        {priceState.status === "changed" && (
          <p
            role="status"
            className="rounded-sm border border-zone-buy/40 bg-zone-buy/10 px-4 py-3 text-[13.5px] text-white/85"
          >
            Saved. New members now pay {money(priceState.newPriceCents)} per month.
          </p>
        )}

        <SaveButton label="Save price" />
      </form>

      {onOlderPriceCount > 0 && (
        <section className="max-w-2xl rounded-lg border border-zone-sell/25 bg-zone-sell/5 p-6">
          <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.16em] text-white/80">
            Existing members
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-white/70">
            {onOlderPriceCount}{" "}
            {onOlderPriceCount === 1 ? "member is" : "members are"} still paying an
            older price. That&apos;s usually what you want — people tend to cancel
            when their price goes up without warning.
          </p>

          {!confirmingMigrate ? (
            <button
              type="button"
              onClick={() => setConfirmingMigrate(true)}
              className="mt-5 text-[13px] text-white/50 underline underline-offset-4 hover:text-white/80"
            >
              I still want to change what they pay
            </button>
          ) : (
            <form action={migrateAction} className="mt-5 space-y-4">
              <p className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] leading-relaxed text-white/85">
                This changes the price for {onOlderPriceCount} existing{" "}
                {onOlderPriceCount === 1 ? "member" : "members"}. They&apos;ll be
                charged the new amount from their next renewal — no immediate charge.
                Consider telling them first.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <MigrateButton />
                <button
                  type="button"
                  onClick={() => setConfirmingMigrate(false)}
                  className="text-[13px] text-white/50 hover:text-white/80"
                >
                  Never mind
                </button>
              </div>
            </form>
          )}

          {migrateState.status === "error" && (
            <p
              role="alert"
              className="mt-4 rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85"
            >
              {migrateState.message}
            </p>
          )}

          {migrateState.status === "progress" && (
            <p
              role="status"
              className="mt-4 rounded-sm border border-white/12 bg-white/5 px-4 py-3 text-[13.5px] text-white/80"
            >
              Moved {migrateState.migrated}.{" "}
              {migrateState.done
                ? "That's everyone."
                : `${migrateState.remaining} still to go — press the button again to continue.`}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
