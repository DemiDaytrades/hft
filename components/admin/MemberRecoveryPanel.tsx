"use client";

import ComplimentaryDeliveryPanel from "./ComplimentaryDeliveryPanel";
import { useState } from "react";

type Status = {
  accountExists: boolean;
  hasCredential: boolean;
  complimentaryActive: boolean;
  complimentaryExpiresAt: string | null;
  invitationRedeemed: boolean | null;
  invitationExpiresAt: string | null;
  invitationKind: string | null;
  role: string | null;
};

export default function MemberRecoveryPanel({ email }: { email: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function run(action: "status" | "send_reset" | "resend_invite") {
    setBusy(action); setMsg(null);
    if (action !== "resend_invite") setInviteUrl(null);
    try {
      const res = await fetch("/api/admin/member-recovery", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, email, kind: "member", duration: "30" }) });
      const data = (await res.json()) as { ok?: boolean; error?: string; status?: Status; message?: string; inviteUrl?: string };
      if (!res.ok || !data.ok) setMsg(data.error || "Request failed.");
      else {
        if (data.status) setStatus(data.status);
        if (data.message) setMsg(data.message);
        if (data.inviteUrl) setInviteUrl(data.inviteUrl);
      }
    } catch { setMsg("Request failed."); }
    finally { setBusy(null); }
  }

  return (
    <div className="mt-3 rounded-sm border border-white/10 bg-ink-950/60 p-3 text-[12.5px] text-white/75">
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={!!busy} onClick={() => run("status")} className="rounded-sm border border-white/15 px-2.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.12em] hover:border-white/35 disabled:opacity-50">{busy==="status"?"…":"Check status"}</button>
        <button type="button" disabled={!!busy} onClick={() => run("send_reset")} className="rounded-sm border border-white/15 px-2.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.12em] hover:border-white/35 disabled:opacity-50">{busy==="send_reset"?"…":"Send reset email"}</button>

      </div>
      {status && (
        <ul className="mt-2 space-y-0.5 text-white/65">
          <li>Account exists: <strong className="text-white/85">{String(status.accountExists)}</strong> · Role: <strong className="text-white/85">{status.role ?? "—"}</strong> · Credential: <strong className="text-white/85">{String(status.hasCredential)}</strong></li>
          <li>Complimentary active: <strong className="text-white/85">{String(status.complimentaryActive)}</strong>{status.complimentaryExpiresAt ? ` (expires ${new Date(status.complimentaryExpiresAt).toLocaleDateString()})` : ""}</li>
          <li>Invitation redeemed: <strong className="text-white/85">{status.invitationRedeemed == null ? "—" : String(status.invitationRedeemed)}</strong>{status.invitationKind ? ` · Kind: ${status.invitationKind}` : ""}</li>
        </ul>
      )}
      {msg && <p className="mt-2 text-white/70">{msg}</p>}
      {inviteUrl && <p className="mt-2 break-all font-mono text-[11px] text-white/60">Invite URL (share securely): {inviteUrl}</p>}
      <ComplimentaryDeliveryPanel email={email}/>
      <p className="mt-2 text-[11px] text-white/40">Admins cannot view or retrieve passwords.</p>
    </div>
  );
}
