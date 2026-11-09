"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ComplimentaryDeliveryPanel from "./ComplimentaryDeliveryPanel";

import {
  grantComplimentaryAccess,
  revokeComplimentaryAccess,
} from "@/app/(app)/admin/users/actions";

type Status = { ok: true } | { ok: false; error: string };

function formatRemaining(expiresAt: string | null): string | null {
  if (!expiresAt) return null;
  const end = new Date(expiresAt);
  if (Number.isNaN(end.getTime())) return null;
  const now = new Date();
  const ms = end.getTime() - now.getTime();
  if (ms <= 0) return null;
  const days = Math.ceil(ms / 86400000);
  const fmt = end.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
  return `${days} day${days === 1 ? "" : "s"} remaining — Expires ${fmt}`;
}

export default function ComplimentaryControls({
  userId,
  email,
  expiresAt,
  revokedAt = null,
}: {
  userId: string;
  email: string;
  expiresAt: string | null;
  revokedAt?: string | null;
}) {
  const router = useRouter();
  const [permitted, setPermitted] = useState<{ email: boolean; sms: boolean } | null>(null);
  const [delivery, setDelivery] = useState<("email" | "sms")[]>(["email"]);
  useEffect(() => { let live = true; fetch(`/api/admin/complimentary-invitation?email=${encodeURIComponent(email)}`, { cache: "no-store" }).then(async response => { if (!response.ok) throw new Error("Unable to check delivery policy."); const data = await response.json() as { permitted: { email: boolean; sms: boolean } }; if (live) { setPermitted(data.permitted); setDelivery(data.permitted.email ? ["email"] : data.permitted.sms ? ["sms"] : []); } }).catch(() => { if (live) setMsg({ ok: false, error: "Unable to check delivery policy. Refresh before granting access." }); }); return () => { live = false; }; }, [email]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Status | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const daysRef = useRef<HTMLSelectElement>(null);
  const customRef = useRef<HTMLInputElement>(null);

  // Reset the grant inputs to their defaults. Called after a successful grant
  // so the dropdown is never left showing a stale/meaningless duration.
  function resetGrantInputs() {
    if (daysRef.current) daysRef.current.value = "30";
    if (customRef.current) customRef.current.value = today;
  }

  async function grant() {
    const days = daysRef.current?.value ?? "30";
    const customDate = customRef.current?.value ?? "";
    setBusy(true);
    setMsg(null);
    try {
      const res = await grantComplimentaryAccess(
        userId,
        days === "custom" ? undefined : Number(days),
        days === "custom" && customDate ? `${customDate}T23:59:59` : undefined,
        delivery,
      );
      setMsg(res);
      if (res.ok) {
        resetGrantInputs();
        router.refresh();
      }
    } catch (e) {
      setMsg({ ok: false, error: e instanceof Error ? e.message : "Grant failed." });
    } finally {
      setBusy(false);
    }
  }

  async function revoke() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await revokeComplimentaryAccess(userId);
      setMsg(res);
      if (res.ok) router.refresh();
    } catch (e) {
      setMsg({ ok: false, error: e instanceof Error ? e.message : "Revoke failed." });
    } finally {
      setBusy(false);
    }
  }

  const remaining = revokedAt ? null : formatRemaining(expiresAt);

  return (
    <div className="mt-3 flex flex-wrap items-end gap-3 rounded border border-white/10 bg-ink-950/40 p-3">
      <div className="flex flex-1 min-w-[220px] flex-col">
        <span className="text-xs font-semibold text-white/80">
          Complimentary Access{remaining ? ` — ${remaining}` : ""}
        </span>
        {!remaining && (
          <span className="text-[11px] text-white/40">No active complimentary access.</span>
        )}
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-xs text-white/50">Grant for</label>
        <select
          id="comp-days"
          ref={daysRef}
          className="rounded border border-white/12 bg-ink-950 px-2 py-1.5 text-xs text-white"
          defaultValue="30"
        >
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">
            30 days
          </option>
          <option value="60">60 days</option>
          <option value="90">90 days</option>
          <option value="custom">Custom date</option>
        </select>
        <input
          id="comp-custom-date"
          ref={customRef}
          type="date"
          className="rounded border border-white/12 bg-ink-950 px-2 py-1.5 text-xs text-white"
          defaultValue={today}
        />
        <button
          type="button"
          disabled={busy || !permitted}
          onClick={grant}
          className="rounded bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-500 disabled:opacity-50"
        >
          Grant
        </button>
      </div>
      <fieldset className="w-full text-xs text-white/60"><legend>Automatic access notice</legend>{(["email", "sms"] as const).map(channel => <label key={channel} className="mr-4 inline-flex items-center gap-2"><input type="checkbox" checked={delivery.includes(channel)} disabled={busy || !permitted?.[channel]} onChange={e => setDelivery(current => e.target.checked ? [...current, channel] : current.filter(c => c !== channel))}/>{channel === "email" ? "Email" : "SMS"}{!permitted?.[channel] && " — Not Available"}</label>)}<p className="mt-1 text-white/35">Delivery results and secure copy-link fallback appear below. No selection grants access without sending.</p></fieldset>
      <button
        type="button"
        disabled={busy || !expiresAt}
        onClick={revoke}
        className="rounded border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Revoke
      </button>
      <div className="w-full"><ComplimentaryDeliveryPanel key={`${expiresAt}:${revokedAt}`} email={email}/></div>
      {msg && !msg.ok && (
        <p className="w-full text-xs text-zone-sell">{msg.error}</p>
      )}
    </div>
  );
}
