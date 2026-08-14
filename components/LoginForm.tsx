"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signInError) {
      // Deliberately vague: never reveal whether the address has an account.
      setError(signInError.message ?? "Invalid email or password.");
      setBusy(false);
      return;
    }

    // Always land on /dashboard; that page reads the role server-side and
    // forwards staff to /admin. The client never decides this.
    router.push(next ?? "/dashboard");
    router.refresh();
  }

  const field =
    "w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white placeholder-white/25 outline-none transition-colors focus:border-brand-600";

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={field}
          placeholder="••••••••••••"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
