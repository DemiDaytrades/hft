"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

import { completeSignupAction, type WelcomeState } from "@/app/welcome/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Setting up your account…" : "Create my account"}
    </button>
  );
}

export default function WelcomeForm({
  sessionId,
  email,
}: {
  sessionId: string;
  email: string;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<WelcomeState, FormData>(
    completeSignupAction,
    { status: "idle" },
  );

  useEffect(() => {
    if (state.status === "done") {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state.status, router]);

  const field =
    "w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600";
  const labelClass =
    "mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55";

  if (state.status === "exists") {
    return (
      <div className="mt-8 space-y-5">
        <p className="rounded-sm border border-white/12 bg-white/5 px-4 py-3 text-[13.5px] leading-relaxed text-white/75">
          {state.message}
        </p>
        <Link
          href="/login"
          className="block w-full rounded-sm bg-brand-600 px-7 py-3.5 text-center font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-brand-500"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="sessionId" value={sessionId} />

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

      <div>
        <label htmlFor="name" className={labelClass}>
          Your name
        </label>
        <input id="name" name="name" type="text" autoComplete="name" className={field} />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Choose a password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          className={field}
        />
        <p className="mt-2 text-[13px] text-white/40">At least 12 characters.</p>
      </div>

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] leading-relaxed text-white/85"
        >
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
