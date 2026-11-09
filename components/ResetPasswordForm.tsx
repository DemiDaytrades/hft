"use client";

import Link from "next/link";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

const MIN = 8;

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password.length < MIN) { setError(`Password must be at least ${MIN} characters.`); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setBusy(true);
    const { error: err } = await authClient.resetPassword({ newPassword: password, token });
    setBusy(false);
    if (err) { setError("This reset link is invalid or has expired. Request a new one."); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mt-6 space-y-4">
        <p role="status" className="rounded-sm border border-zone-buy/40 bg-zone-buy/10 px-4 py-3 text-[14px] text-white/85">Your password has been updated. You can sign in now.</p>
        <Link href="/login" className="inline-block rounded-sm bg-brand-600 px-6 py-3 font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500">Sign in</Link>
      </div>
    );
  }

  const field = "w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600";

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label htmlFor="newPassword" className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">New password</label>
        <div className="relative">
          <input id="newPassword" type={show ? "text" : "password"} autoComplete="new-password" required minLength={MIN} value={password} onChange={(e)=>setPassword(e.target.value)} className={`${field} pr-20`} />
          <button type="button" onClick={()=>setShow((s)=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white/55 hover:text-white" aria-label={show ? "Hide password" : "Show password"}>{show ? "Hide" : "Show"}</button>
        </div>
        <p className="mt-2 text-[13px] text-white/40">At least {MIN} characters.</p>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Confirm password</label>
        <input id="confirmPassword" type={show ? "text" : "password"} autoComplete="new-password" required value={confirm} onChange={(e)=>setConfirm(e.target.value)} className={field} />
      </div>
      {error && <p role="alert" className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85">{error}</p>}
      <button type="submit" disabled={busy} className="w-full rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Updating…" : "Set new password"}</button>
    </form>
  );
}
