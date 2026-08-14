"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { connectStripeAction, type ConnectState } from "@/app/(app)/admin/settings/payments/actions";

function SubmitButton({ connected }: { connected: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending
        ? "Setting everything up…"
        : connected
          ? "Update key"
          : "Connect payments"}
    </button>
  );
}

export default function ConnectStripeForm({
  connected,
  keyHint,
}: {
  connected: boolean;
  keyHint: string | null;
}) {
  const [state, formAction] = useActionState<ConnectState, FormData>(
    connectStripeAction,
    { status: "idle" },
  );

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div>
        <label
          htmlFor="apiKey"
          className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55"
        >
          Your Stripe secret key
        </label>
        <input
          id="apiKey"
          name="apiKey"
          type="password"
          autoComplete="off"
          spellCheck={false}
          required
          placeholder={connected && keyHint ? `••••${keyHint}` : "sk_live_…"}
          className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 font-mono text-[14px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600"
        />
        <p className="mt-2 text-[13px] leading-relaxed text-white/45">
          In Stripe, go to <span className="text-white/70">Developers → API keys</span> and
          copy your secret key. We&apos;ll set up your product, pricing, and everything
          else automatically — you don&apos;t need to configure anything else in Stripe.
        </p>
      </div>

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] leading-relaxed text-white/85"
        >
          {state.message}
        </p>
      )}

      {state.status === "success" && (
        <div
          role="status"
          className="space-y-3 rounded-sm border border-zone-buy/40 bg-zone-buy/10 px-4 py-4 text-[13.5px] leading-relaxed text-white/85"
        >
          <p className="font-semibold">
            Payments are connected{state.accountName ? ` to ${state.accountName}` : ""}.
            Members can now be charged{" "}
            {(state.priceCents / 100).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}{" "}
            per month.
          </p>

          {!state.livemode && (
            <p className="text-white/70">
              This is a <span className="text-white">test</span> key, so no real money will
              move. When you&apos;re ready to take real payments, come back and paste your
              live key.
            </p>
          )}

          {state.payouts.state !== "ready" && state.payouts.message && (
            <p className="text-white/70">{state.payouts.message}</p>
          )}
        </div>
      )}

      <SubmitButton connected={connected} />
    </form>
  );
}
