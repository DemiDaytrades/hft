"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

const MIN_LENGTH = 12; // must match emailAndPassword.minPasswordLength

export default function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    { kind: "error" | "success"; message: string } | null
  >(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (newPassword.length < MIN_LENGTH) {
      setStatus({
        kind: "error",
        message: `New password must be at least ${MIN_LENGTH} characters.`,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ kind: "error", message: "New passwords do not match." });
      return;
    }
    if (newPassword === currentPassword) {
      setStatus({
        kind: "error",
        message: "New password must be different from the current one.",
      });
      return;
    }

    setBusy(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      // Signs out every other device. Correct default when rotating away from a
      // temporary or possibly-exposed password.
      revokeOtherSessions: true,
    });
    setBusy(false);

    if (error) {
      setStatus({
        kind: "error",
        message: error.message ?? "Could not change password.",
      });
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setStatus({
      kind: "success",
      message: "Password updated. Other devices have been signed out.",
    });
    router.refresh();
  }

  const field =
    "w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600";
  const labelClass =
    "mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55";

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div>
        <label htmlFor="currentPassword" className={labelClass}>
          Current password
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="newPassword" className={labelClass}>
          New password
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_LENGTH}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={field}
          aria-describedby="password-hint"
        />
        <p id="password-hint" className="mt-2 text-[12.5px] text-white/40">
          At least {MIN_LENGTH} characters.
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={field}
        />
      </div>

      {status && (
        <p
          role={status.kind === "error" ? "alert" : "status"}
          className={`rounded-sm border px-4 py-3 text-[13.5px] text-white/85 ${
            status.kind === "error"
              ? "border-zone-sell/40 bg-zone-sell/10"
              : "border-zone-buy/40 bg-zone-buy/10"
          }`}
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
