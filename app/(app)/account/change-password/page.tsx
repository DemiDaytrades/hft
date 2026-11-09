"use client";

import { useActionState } from "react";

import { changePasswordAction, type ChangePasswordState } from "./actions";

export default function ChangePasswordPage() {
  const [state, formAction, isPending] = useActionState<ChangePasswordState, FormData>(
    changePasswordAction,
    { status: "idle" },
  );

  const field =
    "w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600";
  const labelClass =
    "mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55";

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <form action={formAction} className="rounded-lg border border-white/8 bg-ink-900/80 p-8 space-y-5">
          <h1 className="font-display text-[26px] font-bold uppercase tracking-[0.04em]">
            Set your password
          </h1>
          <p className="mt-2 text-[14px] text-white/45">
            Choose a new
            permanent password to continue.
          </p>

          <div>
            <label
              htmlFor="currentPassword"
              className={labelClass}
            >
              Current (temporary) password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              className={field}
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className={labelClass}>
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className={field}
              placeholder="••••••••••••"
            />
            <p className="mt-2 text-[13px] text-white/40">
              At least 8 characters.
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className={field}
            />
          </div>

          {state.status === "error" && (
            <p
              role="alert"
              className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85"
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Setting password…" : "Set password & enter dashboard"}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-white/40">
          Didn&apos;t receive a temporary password? Use the{" "}
          <a
            href="/login"
            className="text-brand-500 hover:text-brand-400"
          >
            Forgot Password
          </a>{" "}
          link on the sign-in page.
        </p>
      </div>
    </div>
  );
}
