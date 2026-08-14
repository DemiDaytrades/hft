"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  setMemberPassword,
  setUserBanned,
  setUserRole,
} from "@/app/(app)/admin/users/actions";
import type { Member } from "@/lib/members";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  student: "Student",
};

/** Readable, unambiguous characters only -- these get read aloud or retyped. */
function suggestPassword(): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export default function MemberTable({
  members,
  currentAdminId,
  page,
  pageCount,
  query,
}: {
  members: Member[];
  currentAdminId: string;
  page: number;
  pageCount: number;
  query: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Tracks which row is mid-request so only that row's controls disable.
  const [busyId, setBusyId] = useState<string | null>(null);
  // Which row has the password field open, and its draft value.
  const [pwFor, setPwFor] = useState<string | null>(null);
  const [pwDraft, setPwDraft] = useState("");
  // Shown once after a successful set -- the only chance to copy it, since
  // passwords are hashed and can never be read back.
  const [savedPw, setSavedPw] = useState<{ email: string; pw: string } | null>(
    null,
  );

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
        <div
          role="status"
          className="flex flex-wrap items-center gap-4 rounded-sm border border-zone-buy/40 bg-zone-buy/8 px-4 py-4"
        >
          <div className="min-w-0">
            <p className="text-[14px] text-white">
              New password for{" "}
              <span className="font-semibold">{savedPw.email}</span>
            </p>
            <p className="mt-1 text-[13px] text-white/55">
              Send it to them now — it can&apos;t be shown again. Ask them to
              change it under Account.
            </p>
          </div>
          <code className="rounded-sm border border-white/12 bg-ink-950/80 px-4 py-2 font-mono text-[14px] text-white">
            {savedPw.pw}
          </code>
          <button
            type="button"
            onClick={() => setSavedPw(null)}
            className="ml-auto rounded-sm border border-white/15 px-3 py-1.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/60 hover:text-white"
          >
            Done
          </button>
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
                    {isBanned ? (
                      <span
                        title={member.banReason ?? undefined}
                        className="rounded-sm border border-zone-sell/50 px-2 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-zone-sell"
                      >
                        Banned
                      </span>
                    ) : (
                      <span className="rounded-sm border border-zone-buy/40 px-2 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-zone-buy">
                        Active
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
                          run(member.id, () =>
                            setUserBanned(member.id, !isBanned),
                          )
                        }
                        className="rounded-sm border border-white/15 px-3 py-1.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isBanned ? "Unban" : "Ban"}
                      </button>
                    </div>

                    {pwFor === member.id && (
                      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                        <input
                          type="text"
                          value={pwDraft}
                          onChange={(e) => setPwDraft(e.target.value)}
                          placeholder="New password (12+ chars)"
                          aria-label={`New password for ${member.email}`}
                          className="w-56 rounded-sm border border-white/12 bg-ink-950 px-3 py-1.5 font-mono text-[13px] text-white placeholder-white/25 outline-none focus:border-brand-600"
                        />
                        <button
                          type="button"
                          onClick={() => setPwDraft(suggestPassword())}
                          className="rounded-sm border border-white/15 px-3 py-1.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white/60 hover:text-white"
                        >
                          Suggest
                        </button>
                        <button
                          type="button"
                          disabled={pwDraft.length < 12 || rowBusy}
                          onClick={() =>
                            run(member.id, async () => {
                              const res = await setMemberPassword(
                                member.id,
                                pwDraft,
                              );
                              if (res.ok) {
                                setSavedPw({ email: member.email, pw: pwDraft });
                                setPwFor(null);
                                setPwDraft("");
                              }
                              return res;
                            })
                          }
                          className="rounded-sm bg-brand-600 px-4 py-1.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500 disabled:opacity-40"
                        >
                          Set
                        </button>
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
