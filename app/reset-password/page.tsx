import type { Metadata } from "next";
import Link from "next/link";

import Logo from "@/components/Logo";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Link href="/" aria-label="High Frequency Trading — home">
            <Logo />
          </Link>
        </div>
        <div className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
          <h1 className="font-display text-[26px] font-bold uppercase tracking-[0.04em]">
            Choose a new password
          </h1>
          {error === "INVALID_TOKEN" || (!token && !error) ? (
            <>
              <p className="mt-3 text-[14px] leading-relaxed text-white/60">
                This reset link is invalid or has expired. Request a new one to continue.
              </p>
              <Link href="/forgot-password" className="mt-6 inline-block rounded-sm bg-brand-600 px-6 py-3 font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500">
                Request new link
              </Link>
            </>
          ) : token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <p className="mt-3 text-[14px] text-white/60">This reset link is not valid.</p>
          )}
        </div>
      </div>
    </div>
  );
}
