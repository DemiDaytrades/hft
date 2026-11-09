"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  sendMemberPasswordReset,
  setUserBanned,
  setUserRole,
} from "@/app/(app)/admin/users/actions";
import type { Member } from "@/lib/members";
import MemberRecoveryPanel from "@/components/admin/MemberRecoveryPanel";
import LifecycleControls from "@/components/admin/LifecycleControls";
import ComplimentaryControls from "@/components/admin/ComplimentaryControls";
import { isActive, isComplimentaryActive } from "@/lib/membership-access";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  student: "Student",
};

export default function MemberTable({
  members,
  currentAdminId,
  page,
  pageCount,
  query,
  view = "active",
}: {
  members: Member[];
  currentAdminId: string;
  page: number;
  pageCount: number;
  query: string;
  view?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Tracks which row is mid-request so only that row's controls disable.
  const [busyId, setBusyId] = useState<string | null>(null);
  // Which row has the password field open, and its draft value.
  const [pwFor, setPwFor] = useState<string | null>(null);
  // Which row has the complimentary grant/revoke panel open.
  const [lifecycleFor, setLifecycleFor] = useState<string | null>(null);
  const [compFor, setCompFor] = useState<string | null>(null);
  // Shown once after a successful set -- the password is never displayed;
  // the member uses Forgot Password to set their own via a secure link.
  const [savedPw, setSavedPw] = useState<{ email: string } | null>(null);

  function run(userId: string, action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    setBusyId(userId);
    startTransition(async () => {
      const result = await action();
      setBusyId(null);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    });
  }

  function pageHref(target: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (view !== "active") params.set("view", view);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/admin/users?${qs}` : "/admin/users";
  }

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-white/8 bg-ink-900/80 px-6 py-16 text-center">
        <p className="text-[15px] text-white/50">
          {query ? "No members match that search." : "No members yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p
          role="alert"
          className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85"
        >
          {error}
        </p>
      )}

      {savedPw && (
        <div role="status" className="rounded-sm border border-zone-buy/40 bg-zone-buy/8 px-4 py-4">
          <p className="text-[14px] text-white">Password action completed for <span className="font-semibold">{savedPw.email}</span>.</p>
          <p className="mt-1 text-[13px] text-white/55">Direct the member to use Forgot Password / the secure reset flow. Admins cannot view or retrieve passwords.</p>
          <button type="button" onClick={() => setSavedPw(null)} className="mt-2 rounded-sm border border-white/15 px-3 py-1.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/60 hover:text-white">Done</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-white/8 bg-ink-900/80">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-white/8">
              {["Member", "Role", "Status", "Joined", ""].map((heading, i) => (
                <th
                  key={heading || i}
                  scope="col"
                  className="px-6 py-4 font-display text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/45"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {members.map((member) => {
              const isSelf = member.id === currentAdminId;
              const isBanned = member.banned === 1;
              const role = member.role ?? "student";
              const rowBusy = busyId === member.id && isPending;

              return (
                <tr key={member.id} className={rowBusy ? "opacity-50" : ""}>
                  <td className="px-6 py-4">
                    <p className="text-[15px] text-white">
                      {member.name || "—"}
                      {isSelf && (
                        <span className="ml-2 text-[12px] text-white/40">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-[13px] text-white/45">{member.email}</p>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      aria-label={`Role for ${member.email}`}
                      value={role}
                      disabled={isSelf || rowBusy}
                      onChange={(event) =>
                        run(member.id, () =>
                          setUserRole(member.id, event.target.value),
                        )
                      }
                      className="rounded-sm border border-white/12 bg-ink-950 px-3 py-1.5 text-[13.5px] text-white outline-none focus:border-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {Object.entries(ROLE_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <p className="mb-2 text-xs font-semibold text-brand-300">{member.lifecycle_status === "DEACTIVATED" ? "Former / Deactivated — HFT access denied" : "Active lifecycle"}</p>
                    {isBanned ? (
                      <span
                        title={member.banReason ?? undefined}
                        className="rounded-sm border border-zone-sell/50 px-2 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-zone-sell"
                      >
                        Banned
                      </span>
                    ) : isActive(member.subscriptionStatus) ? (
                      <span className="rounded-sm border border-zone-buy/40 px-2 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-zone-buy">
                        Paid billing: Active
                      </span>
                    ) : isComplimentaryActive(member) ? (
                      <span className="rounded-sm border border-brand-600/40 px-2 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-400">
                        Complimentary entitlement
                      </span>
                    ) : (
                      <span className="rounded-sm border border-white/12 px-2 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                        No current entitlement
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-[13.5px] text-white/50">
                    {new Date(member.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/students/${member.id}`}
                        className="rounded-sm border border-white/15 px-3 py-1.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/35 hover:text-white"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        disabled={isSelf || rowBusy}
                        onClick={() =>
                          setPwFor(pwFor === member.id ? null : member.id)
                        }
                        className="rounded-sm border border-white/15 px-3 py-1.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Password
                      </button>
                      <button
                        type="button"
                        disabled={isSelf || rowBusy}
                        onClick={() =>
                          setCompFor(compFor === member.id ? null : member.id)
                        }
                        className="rounded-sm border border-white/15 px-3 py-1.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Comp
                      </button>
                      <button
                        type="button"
                        disabled={isSelf || rowBusy}
                        onClick={() =>
                          run(member.id, () =>
                            setUserBanned(member.id, !isBanned),
                          )
                        }
                        className="rounded-sm border border-white/15 px-3 py-1.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isBanned ? "Unban" : "Ban"}
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-brand-300"><Link href={`/admin/students/${member.id}`}>View Student</Link><button type="button" onClick={() => setLifecycleFor(current => current === member.id ? null : member.id)}>{member.lifecycle_status === "DEACTIVATED" ? "Reactivate / history / deletion preview" : "Deactivate / lifecycle / deletion preview"}</button></div>
                    {lifecycleFor === member.id && <LifecycleControls studentId={member.id}/>}
                    {pwFor === member.id && (
                      <div className="mt-3 space-y-2">
                        <MemberRecoveryPanel email={member.email} />
                        <p className="text-[12px] text-white/45">Use &quot;Send reset email&quot; or &quot;Resend invite&quot; above. Admins cannot view, retrieve, or manually set member passwords.</p>
                      </div>
                    )}

                    {compFor === member.id && (
                      <div className="mt-3 space-y-2">
                        <ComplimentaryControls
                          email={member.email}
                          userId={member.id}
                          expiresAt={member.complimentaryAccessExpiresAt ?? null}
                          revokedAt={member.complimentaryAccessRevokedAt ?? null}
                        />
                        <p className="text-[12px] text-white/45">Complimentary access grants non-paid student access. Revoking sets the revoked timestamp; expiry is respected by the access check.</p>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <nav
          aria-label="Member list pages"
          className="flex items-center justify-between"
        >
          <PageLink
            href={pageHref(page - 1)}
            disabled={page <= 1}
            label="Previous"
          />
          <p className="text-[13px] text-white/45">
            Page {page} of {pageCount}
          </p>
          <PageLink
            href={pageHref(page + 1)}
            disabled={page >= pageCount}
            label="Next"
          />
        </nav>
      )}
    </div>
  );
}

function PageLink({
  href,
  disabled,
  label,
}: {
  href: string;
  disabled: boolean;
  label: string;
}) {
  const className =
    "rounded-sm border border-white/15 px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors";

  if (disabled) {
    return (
      <span className={`${className} cursor-not-allowed text-white/25`}>
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`${className} text-white/70 hover:border-white/35 hover:text-white`}
    >
      {label}
    </Link>
  );
}
