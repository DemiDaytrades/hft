"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  startPayoutSetupAction,
  type PayoutSetupState,
} from "@/app/(app)/affiliate/actions";

function Button({ started }: { started: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending
        ? "Opening…"
        : started
          ? "Finish payout setup"
          : "Set up payouts"}
    </button>
  );
}

export default function PayoutSetupButton({ started }: { started: boolean }) {
  const [state, formAction] = useActionState<PayoutSetupState, FormData>(
    startPayoutSetupAction,
    { status: "idle" },
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85"
        >
          {state.message}
        </p>
      )}
      <Button started={started} />
    </form>
  );
}
