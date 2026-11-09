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
      {pending ? "Taking you to checkout…" : "Continue to secure Stripe checkout"}
    </button>
  );
}

export type JoinFormPlan = {
  key: "legacy" | "student_250";
  label: string;
  displayPrice: string;
  description?: string;
};

export default function JoinForm({
  plans,
  defaultPlan,
}: {
  plans: JoinFormPlan[];
  defaultPlan: "legacy" | "student_250";
}) {
  const [state, formAction] = useActionState<JoinState, FormData>(
    startCheckoutAction,
    { status: "idle" },
  );
  const single = plans.length === 1 ? plans[0] : null;

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {single ? (
        <div className="rounded-sm border border-brand-600/50 bg-brand-600/10 px-4 py-3">
          <p className="font-semibold text-white">{single.label}</p>
          <p className="text-[14px] text-white/75">
            <strong>{single.displayPrice}</strong> — recurring monthly Stripe subscription (not a one-time payment).
          </p>
          <input type="hidden" name="plan" value={single.key} />
        </div>
      ) : (
        <fieldset className="space-y-2">
          <legend className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">
            Membership option
          </legend>
          {plans.map((p) => (
            <label key={p.key} className="flex cursor-pointer items-start gap-3 rounded-sm border border-white/12 bg-ink-950/50 px-4 py-3 text-[14px] text-white/85 has-[:checked]:border-brand-600">
              <input type="radio" name="plan" value={p.key} defaultChecked={p.key === defaultPlan} className="mt-0.5" />
              <span><span className="block font-semibold text-white">{p.label}</span><span className="block text-white/60">{p.displayPrice} — recurring monthly Stripe subscription.</span></span>
            </label>
          ))}
        </fieldset>
      )}
      <p className="text-[12px] text-white/40">Recurring monthly membership. Not a one-time payment.</p>

      <div>
        <label htmlFor="email" className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600" />
        <p className="mt-2 text-[13px] text-white/40">You&apos;ll choose a password after payment.</p>
      </div>

      {state.status === "error" && (
        <p role="alert" className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85">{state.message}</p>
      )}
      <SubmitButton />
    </form>
  );
}
