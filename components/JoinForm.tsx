"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { startCheckoutAction, type JoinState } from "@/app/join/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Taking you to checkout…" : "Continue to payment"}
    </button>
  );
}

export default function JoinForm() {
  const [state, formAction] = useActionState<JoinState, FormData>(
    startCheckoutAction,
    { status: "idle" },
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600"
        />
        <p className="mt-2 text-[13px] text-white/40">
          You&apos;ll choose a password after payment.
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

      <SubmitButton />
    </form>
  );
}
