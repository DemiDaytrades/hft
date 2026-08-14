import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import Logo from "@/components/Logo";
import LoginForm from "@/components/LoginForm";
import { getSession } from "@/lib/dal";
import { ROLES } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

// Reads the session to bounce already-signed-in visitors, so it cannot be
// prerendered.
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect(session.user.role === ROLES.admin ? "/admin" : "/dashboard");
  }

  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Link href="/" aria-label="High Frequency Talent — home">
            <Logo />
          </Link>
        </div>

        <div className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
          <h1 className="font-display text-[26px] font-bold uppercase tracking-[0.04em]">
            Member sign in
          </h1>
          <p className="mt-2 text-[14px] text-white/45">
            Access your dashboard, alerts and training.
          </p>

          <LoginForm next={next} />
        </div>

        <p className="mt-8 text-center text-[13px] text-white/40">
          Not a member yet?{" "}
          <Link href="/join" className="text-brand-500 hover:text-brand-400">
            Join the Frequency
          </Link>
        </p>
      </div>
    </div>
  );
}
