"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createInviteAction } from "@/app/(app)/admin/users/invite-actions";
import type { InviteKind } from "@/lib/invites";

const KINDS: { value: InviteKind; label: string; help: string }[] = [
  {
    value: "admin",
    label: "Staff",
    help: "Full access — can change pricing, see every member, and pay affiliates.",
  },
  {
    value: "member",
    label: "Free member",
    help: "A member account without payment. Use this to comp someone.",
  },
];

export default function InviteUserForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState<InviteKind>("admin");
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<{ url: string; email: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const active = KINDS.find((k) => k.value === kind);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInvite(null);
    setCopied(false);

    startTransition(async () => {
      const result = await createInviteAction(email, kind);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setInvite({ url: result.inviteUrl, email: result.email });
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
            onChange={(e) => setEmail(e.target.value)}
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
            disabled={isPending}
            className="rounded-sm bg-brand-600 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
          >
            {isPending ? "Creating…" : "Create invite"}
          </button>
        </div>
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
            Send this link to {invite.email}
          </p>
          <p className="mt-1 text-[13px] text-white/55">
            They set their own password. Works once, expires in 14 days.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
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
          </div>
        </div>
      )}
    </div>
  );
}
