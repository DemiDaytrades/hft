"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const redirectTo = `${window.location.origin}/reset-password`;
    try {
      // Enumeration-safe: Better Auth returns a generic success message even
      // when the email does not exist (see server route). Always show success.
      await authClient.requestPasswordReset({ email: email.trim().toLowerCase(), redirectTo });
    } catch {
      // Intentionally ignored: never reveal account existence or provider state.
    } finally {
      setBusy(false);
      setSent(true);
    }
  }

  const field =
    "w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600";

  if (sent) {
    return (
      <p role="status" className="mt-8 rounded-sm border border-white/12 bg-white/5 px-4 py-3 text-[14px] leading-relaxed text-white/80">
        If an account exists for that email, a password reset link has been sent. The link expires in 1 hour.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="you@example.com" />
      </div>
      <button type="submit" disabled={busy} className="w-full rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
