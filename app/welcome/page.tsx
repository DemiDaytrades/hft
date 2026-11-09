import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import Logo from "@/components/Logo";
import WelcomeForm from "@/components/WelcomeForm";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Welcome",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Landing spot straight after a successful checkout. The Stripe session id in
 * the URL is the proof of payment -- it is verified here and again in the
 * server action before any account is created.
 */
export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/join");

  let email: string | null = null;
  let paid = false;

  try {
    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paid = session.payment_status === "paid";
    email = session.customer_details?.email ?? session.customer_email ?? null;
  } catch {
    // Falls through to the "can't find that payment" state below.
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Link href="/" aria-label="High Frequency Trading — home">
            <Logo />
          </Link>
        </div>

        <div className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
          {paid && email ? (
            <>
              <h1 className="font-display text-[26px] font-bold uppercase tracking-[0.04em]">
                You&apos;re in
              </h1>
              <p className="mt-2 text-[14px] text-white/45">
                Payment received. Set a password and your account is ready.
              </p>
              <WelcomeForm sessionId={sessionId} email={email} />
            </>
          ) : (
            <>
              <h1 className="font-display text-[24px] font-bold uppercase tracking-[0.04em]">
                We can&apos;t find that payment
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-white/60">
                If you just paid, wait a few seconds and refresh this page —
                Stripe can take a moment. If you were charged and this keeps
                happening, contact us and we&apos;ll sort it out straight away.
              </p>
              <Link
                href="/join"
                className="mt-6 inline-block text-[14px] text-brand-500 hover:text-brand-400"
              >
                Back to join
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
