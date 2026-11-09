"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { acceptInviteAction, type AcceptState } from "@/app/invite/[token]/actions";

function SubmitButton({ existingAccount }: { existingAccount: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Redeeming invitation…" : existingAccount ? "Redeem invitation" : "Create my account"}
    </button>
  );
}

export default function InviteForm({
  token,
  email,
  existingAccount = false,
}: {
  token: string;
  email: string;
  existingAccount?: boolean;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState<AcceptState, FormData>(
    acceptInviteAction,
    { status: "idle" },
  );

  useEffect(() => {
    if (state.status === "done") {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state, router]);

  const field =
    "w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600";
  const labelClass =
    "mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55";

  if (state.status === "recovery") {
    return (
      <div className="mt-8 space-y-4">
        <p role="status" className="rounded-sm border border-white/12 bg-white/5 px-4 py-3 text-[14px] leading-relaxed text-white/80">
          {state.message}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/login" className="rounded-sm bg-brand-600 px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500">Sign in</Link>
          <Link href="/forgot-password" className="rounded-sm border border-white/15 px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/85 transition-colors hover:border-white/35 hover:text-white">Forgot password</Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="email-display" className={labelClass}>
          Email
        </label>
        <input
          id="email-display"
          value={email}
          readOnly
          className={`${field} cursor-not-allowed text-white/60`}
        />
      </div>

      {!existingAccount && <><div>
        <label htmlFor="name" className={labelClass}>
          Your name
        </label>
        <input id="name" name="name" type="text" autoComplete="name" className={field} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="password" className={labelClass + " mb-0"}>
            Choose a password
          </label>
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/55 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          className={field}
        />
        <p className="mt-2 text-[13px] text-white/40">At least 8 characters.</p>
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Mobile number (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 (555) 000-0000"
          className={field}
        />
        <p className="mt-2 text-[13px] text-white/40">
          Used for important membership and payment notices only.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <input
            id="sms_consent"
            name="sms_consent"
            type="checkbox"
            className="mt-1.5 rounded border-white/12 bg-ink-950 text-brand-600 focus:ring-brand-600"
          />
          <label
            htmlFor="sms_consent"
            className="text-[13px] leading-relaxed text-white/60 cursor-pointer select-none"
          >
            I agree to receive SMS messages from High Frequency Trading about my membership, including account notifications, membership and payment/transaction updates, appointment or class reminders, and customer support. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase.
          </label>
        </div>
        <p className="pl-7 text-[13px] text-white/50">
          See{" "}
          <a href="/terms" className="text-brand-500 hover:text-brand-400 underline decoration-brand-700/60 underline-offset-2">
            Terms &amp; Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-brand-500 hover:text-brand-400 underline decoration-brand-700/60 underline-offset-2">
            Privacy Policy
          </a>.
        </p>
      </div>

      </>}
      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] leading-relaxed text-white/85"
        >
          {state.message}
        </p>
      )}

      <SubmitButton existingAccount={existingAccount} />
    </form>
  );
}
