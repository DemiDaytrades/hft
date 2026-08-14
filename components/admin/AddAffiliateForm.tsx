"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { addAffiliateAction } from "@/app/(app)/admin/affiliates/actions";

type Invite = { url: string; email: string };

export default function AddAffiliateForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<Invite | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInvite(null);
    setCopied(false);

    startTransition(async () => {
      const result = await addAffiliateAction(email);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.kind === "invited") {
        setInvite({ url: result.inviteUrl, email: result.email });
      }

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
    <div className="max-w-2xl space-y-5">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="their@email.com"
            required
            className="min-w-[220px] flex-1 rounded-sm border border-white/12 bg-ink-950/80 px-4 py-2.5 text-[14px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-sm bg-brand-600 px-5 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
          >
            {isPending ? "Adding…" : "Add affiliate"}
          </button>
        </div>
        <p className="text-[13px] leading-relaxed text-white/40">
          They don&apos;t need an account yet. If they&apos;re new, you&apos;ll get
          a link to send them — they set their own password and their bank details
          go straight to Stripe.
        </p>
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
            It works once and expires in 14 days. We don&apos;t email it — copy it
            and send it however you normally talk to them.
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
