"use client";

import { useEffect, useMemo, useState } from "react";

type Recipient = { id: string; name: string; maskedPhone: string };
type LoadState = { recipients: Recipient[]; body: string } | null;
type SendResult = {
  recipient?: { name: string; maskedPhone: string };
  result?: {
    channel: string;
    status: string;
    provider?: string;
    providerMessageId: string | null;
    error: string | null;
    idempotencyKey: string | null;
  };
  error?: string;
};

function newConfirmationId() {
  return `ct_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function errorMessage(value: unknown, fallback: string): string {
  if (value && typeof value === "object" && "error" in value && typeof (value as { error?: unknown }).error === "string") {
    return (value as { error: string }).error;
  }
  return fallback;
}

export default function CommunicationsTestClient() {
  const [data, setData] = useState<LoadState>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentConfirmations, setSentConfirmations] = useState<Set<string>>(new Set());
  const [confirmationId, setConfirmationId] = useState<string | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/communications-test", { cache: "no-store" });
        const json: unknown = await res.json();
        if (!res.ok) throw new Error(errorMessage(json, "Failed to load recipients."));
        const obj = json && typeof json === "object" ? (json as Record<string, unknown>) : {};
        const recipients = Array.isArray(obj.recipients) ? (obj.recipients as Recipient[]) : [];
        const body = typeof obj.body === "string" ? obj.body : "";
        if (!cancelled) {
          setData({ recipients, body });
          if (recipients.length === 1) setSelectedId(recipients[0].id);
        }
      } catch (e: unknown) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Failed to load.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () => data?.recipients.find((r) => r.id === selectedId) ?? null,
    [data, selectedId],
  );

  function beginConfirm() {
    if (!selected || sending) return;
    setConfirmationId(newConfirmationId());
    setConfirming(true);
    setResult(null);
  }

  async function sendTest() {
    if (sending || !selected || !confirmationId) return;
    if (sentConfirmations.has(confirmationId)) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/communications-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selected.id, confirmed: true, confirmationId }),
      });
      const json: unknown = await res.json();
      if (!res.ok) {
        setResult({ error: errorMessage(json, "Send failed.") });
      } else if (json && typeof json === "object") {
        setSentConfirmations((prev) => new Set(prev).add(confirmationId));
        setResult(json as SendResult);
      } else {
        setResult({ error: "Unexpected response." });
      }
    } catch (e: unknown) {
      setResult({ error: e instanceof Error ? e.message : "Unknown error" });
    } finally {
      setSending(false);
      setConfirming(false);
      setConfirmationId(null);
    }
  }

  if (loadError) {
    return <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-sm text-red-300">{loadError}</div>;
  }
  if (!data) {
    return <div className="text-sm text-white/60">Loading eligible test recipients…</div>;
  }

  return (
    <div className="space-y-6 rounded-lg border border-white/10 bg-ink-900/60 p-6">
      <div>
        <h2 className="font-display text-[18px] font-semibold uppercase tracking-[0.03em]">
          Eligible Recipient (opted-in, ends in 5070)
        </h2>
        {data.recipients.length === 0 ? (
          <p className="mt-2 text-sm text-yellow-300/90">
            No eligible opted-in recipient with a phone number ending in 5070 was found. This screen will not send to
            anyone else.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            <label className="block text-sm text-white/60" htmlFor="ct-recipient">
              Select recipient
            </label>
            <select
              id="ct-recipient"
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setConfirming(false);
                setResult(null);
              }}
              disabled={sending}
              className="w-full max-w-xl rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            >
              <option value="">Select…</option>
              {data.recipients.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.maskedPhone}
                </option>
              ))}
            </select>
            {selected && (
              <div className="mt-2 rounded border border-white/10 bg-black/30 p-3 text-sm text-white/85">
                <div>
                  <span className="text-white/50">Name:</span> {selected.name}
                </div>
                <div>
                  <span className="text-white/50">Phone:</span> {selected.maskedPhone}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-[18px] font-semibold uppercase tracking-[0.03em]">Exact SMS Body</h2>
        <div className="mt-2 rounded border border-white/10 bg-black/40 p-3 text-sm text-white/90">{data.body}</div>
      </div>

      <div className="text-sm text-white/60">
        Admin-only. Uses existing production <code>lib/communications.ts</code> path (<code>sendSms</code>, Telnyx
        preferred when configured, Twilio fallback). Respects <code>sms_opted_in</code> consent rules. No direct
        Telnyx calls from the UI. Each confirmation sends exactly one SMS and records the attempt in{" "}
        <code>communication_log</code>.
      </div>

      {!confirming && !sending && (
        <button
          onClick={beginConfirm}
          disabled={!selected}
          className="rounded-sm bg-brand-600 px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prepare to Send (1 SMS)
        </button>
      )}

      {confirming && !sending && selected && (
        <div className="space-y-3 rounded border border-yellow-500/30 bg-yellow-950/20 p-4">
          <div className="text-sm text-yellow-200">
            Confirm: send exactly <strong>ONE</strong> SMS to <strong>{selected.name}</strong> ({selected.maskedPhone})
            with the body shown above?
          </div>
          <div className="flex gap-3">
            <button
              onClick={sendTest}
              className="rounded-sm bg-brand-600 px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500"
            >
              Confirm Send
            </button>
            <button
              onClick={() => {
                setConfirming(false);
                setConfirmationId(null);
              }}
              className="rounded-sm bg-white/10 px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {sending && <div className="text-sm text-white/70">Sending exactly one SMS…</div>}

      {result && (
        <div className="space-y-2">
          <h2 className="font-display text-[18px] font-semibold uppercase tracking-[0.03em]">Result</h2>
          {result.error ? (
            <div className="rounded border border-red-500/30 bg-red-950/20 p-3 text-sm text-red-200">{result.error}</div>
          ) : (
            <div className="rounded border border-white/10 bg-black/50 p-4 text-sm text-white/90">
              <div className="grid gap-1 sm:grid-cols-2">
                <div><span className="text-white/50">Recipient:</span> {result.recipient?.name} ({result.recipient?.maskedPhone})</div>
                <div><span className="text-white/50">Channel:</span> {result.result?.channel ?? "—"}</div>
                <div><span className="text-white/50">Provider:</span> {result.result?.provider ?? "—"}</div>
                <div><span className="text-white/50">Status:</span> {result.result?.status ?? "—"}</div>
                <div className="sm:col-span-2 break-all"><span className="text-white/50">Provider message ID:</span> {result.result?.providerMessageId ?? "—"}</div>
                <div className="sm:col-span-2 break-all"><span className="text-white/50">Error:</span> {result.result?.error ?? "—"}</div>
                <div className="sm:col-span-2 break-all"><span className="text-white/50">Idempotency key:</span> {result.result?.idempotencyKey ?? "—"}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
