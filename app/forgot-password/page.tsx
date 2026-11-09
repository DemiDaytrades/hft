import type { Metadata } from "next";
import Link from "next/link";

import Logo from "@/components/Logo";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
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
            Reset your password
          </h1>
          <p className="mt-2 text-[14px] text-white/45">
            Enter your email and we’ll send a secure reset link if an account exists.
          </p>
          <ForgotPasswordForm />
        </div>
        <p className="mt-8 text-center text-[13px] text-white/40">
          Remembered it?{" "}
          <Link href="/login" className="text-brand-500 hover:text-brand-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
