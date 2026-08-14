"use client";

import { useEffect, useState } from "react";

/** The affiliate's shareable link, with a copy button. */
export default function ReferralLink({ code }: { code: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  // Read on the client so the link shows the host they're actually on.
  useEffect(() => setOrigin(window.location.origin), []);

  const url = origin ? `${origin}/r/${code}` : `/r/${code}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-lg border border-white/8 bg-ink-900/80 p-6">
      <h2 className="font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/80">
        Your link
      </h2>
      <p className="mt-2 text-[13.5px] text-white/45">
        Share this anywhere. Anyone who joins through it counts as yours.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <code className="flex-1 overflow-x-auto whitespace-nowrap rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 font-mono text-[14px] text-white">
          {url}
        </code>
        <button
          type="button"
          onClick={copy}
          className="rounded-sm bg-brand-600 px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </section>
  );
}
