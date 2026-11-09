"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { createInviteAction } from "@/app/(app)/admin/users/invite-actions";
import ComplimentaryDeliveryPanel from "./ComplimentaryDeliveryPanel";
import type { ComplimentaryInvitationStatus, DeliveryChoice } from "@/lib/complimentary-invitation";
import type { InviteKind } from "@/lib/invites";

const KINDS: { value: InviteKind; label: string; help: string }[] = [
  {
    value: "admin",
    label: "Staff",
    help: "Full access — can change pricing, see every member, and pay affiliates.",
  },
  {
    value: "member",
    label: "Complimentary Student",
    help: "A member account without payment. Use this to comp someone.",
  },
];

export default function InviteUserForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState<InviteKind>("admin");
  const [duration, setDuration] = useState("30");
  const [customDate, setCustomDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<{ url: string; email: string; delivery?: ComplimentaryInvitationStatus } | null>(null);
  const [policy, setPolicy] = useState<ComplimentaryInvitationStatus | null>(null);
  const [channels, setChannels] = useState<DeliveryChoice[]>(["email"]);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let live = true;
    setPolicy(null);
    if (kind !== "member" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    const timer = setTimeout(() => fetch(`/api/admin/complimentary-invitation?email=${encodeURIComponent(email)}`, { cache: "no-store" }).then(async response => {
      const value = await response.json() as ComplimentaryInvitationStatus & { error?: string };
      if (!response.ok) throw new Error(value.error || "Unable to check channels.");
      if (live) { setPolicy(value); setChannels(current => { const allowed = current.filter(c => value.permitted[c]); return allowed.length ? allowed : value.permitted.email ? ["email"] : value.permitted.sms ? ["sms"] : []; }); }
    }).catch(cause => { if (live) setError(cause.message); }), 250);
    return () => { live = false; clearTimeout(timer); };
  }, [email, kind]);

  const active = KINDS.find((k) => k.value === kind);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInvite(null);
    setCopied(false);

    startTransition(async () => {
      const result = await createInviteAction(
        email,
        kind,
        kind === "member" ? duration : undefined,
        kind === "member" && duration === "custom" ? customDate : undefined,
        channels,
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setInvite({ url: result.inviteUrl, email: result.email, delivery: result.delivery });
      setEmail("");
      router.refresh();
    });
  }

  async function copyLink() {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(invite.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setPolicy(null); }}
            placeholder="their@email.com"
            required
            className="min-w-[200px] flex-1 rounded-sm border border-white/12 bg-ink-950/80 px-4 py-2.5 text-[14px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600"
          />
          <select
            aria-label="Invite type"
            value={kind}
            onChange={(e) => setKind(e.target.value as InviteKind)}
            className="rounded-sm border border-white/12 bg-ink-950 px-3 py-2.5 text-[14px] text-white outline-none focus:border-brand-600"
          >
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isPending || (kind === "member" && !policy)}
            className="rounded-sm bg-brand-600 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
          >
            {isPending ? "Creating…" : "Create invite"}
          </button>
        </div>
        {kind === "member" && (
          <div className="mt-3 space-y-2">
            <select
              aria-label="Complimentary duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="rounded-sm border border-white/12 bg-ink-950 px-3 py-2.5 text-[14px] text-white outline-none focus:border-brand-600"
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
              <option value="custom">Custom Expiration Date</option>
            </select>
            {duration === "custom" && (
              <input
                type="date"
                required
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="rounded-sm border border-white/12 bg-ink-950 px-3 py-2.5 text-[14px] text-white outline-none focus:border-brand-600"
              />
            )}
          </div>
        )}
        {kind === "member" && <fieldset className="space-y-2 border-t border-white/10 pt-3"><legend className="text-sm text-white/70">Automatic delivery</legend>{(["email", "sms"] as const).map(channel => <label key={channel} className="mr-5 inline-flex items-center gap-2 text-sm text-white/65"><input type="checkbox" disabled={!policy?.permitted[channel] || isPending} checked={channels.includes(channel)} onChange={event => setChannels(current => event.target.checked ? [...current, channel] : current.filter(c => c !== channel))}/>{channel === "email" ? "Email" : "SMS"}{!policy?.permitted[channel] && " — Not Available"}</label>)}<p className="text-xs leading-5 text-white/40">Select both for email + SMS. SMS requires an existing recorded phone and opt-in. Email identity is required for account setup even with SMS-only delivery. If no channels are selected, the secure copy-link fallback remains available.</p></fieldset>}
        {active && (
          <p className="text-[13px] leading-relaxed text-white/40">{active.help}</p>
        )}
      </form>

      {error && (
        <p
          role="alert"
          className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85"
        >
          {error}
        </p>
      )}

      {invite && (
        <div
          role="status"
          className="rounded-sm border border-zone-buy/40 bg-zone-buy/8 p-5"
        >
          <p className="text-[14px] font-semibold text-white">
            {invite.delivery ? `Complimentary access / invitation created for ${invite.email}` : `Send this link to ${invite.email}`}
          </p>
          <p className="mt-1 text-[13px] text-white/55">
            {invite.delivery ? "Selected permitted channels were processed. Check the individual results below." : "They set their own password. Works once, expires in 14 days."}
          </p>
          {invite.delivery ? <ComplimentaryDeliveryPanel key={invite.email} email={invite.email} initial={invite.delivery}/> : <div className="mt-4 flex flex-wrap items-center gap-3">
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 font-mono text-[13px] text-white">
              {invite.url}
            </code>
            <button
              type="button"
              onClick={copyLink}
              className="rounded-sm bg-brand-600 px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>}
        </div>
      )}
    </div>
  );
}
