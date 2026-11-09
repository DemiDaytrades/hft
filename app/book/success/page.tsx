import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { Panel } from "@/components/ui";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function BookSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; cancelled?: string }>;
}) {
  const { session_id: sessionId, cancelled } = await searchParams;

  if (cancelled) {
    redirect("/book");
  }

  if (!sessionId) redirect("/book");

  let paid = false;
  let email = null;

  try {
    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paid = session.payment_status === "paid";
    email = session.customer_details?.email ?? session.customer_email ?? null;
  } catch {
    // Falls through to the error state below.
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Link href="/" aria-label="High Frequency Talent — home">
            <Logo />
          </Link>
        </div>

        <div className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
          {paid && email ? (
            <>
              <h1 className="font-display text-[26px] font-bold uppercase tracking-[0.04em] text-center">
                Booking confirmed
              </h1>
              <p className="mt-2 text-[14px] text-white/45 text-center">
                Your payment was received and your consultation is reserved.
                Check your email ( {escapeHtml(email)} ) for confirmation
                details.
              </p>
              <p className="mt-4 text-[13px] text-white/50 text-center">
                A confirmation email with your appointment time and how to join
                the call has been sent. Please check your inbox (and spam
                folder).
              </p>
              <Link
                href="/"
                className="mt-8 block text-center text-[14px] text-brand-500 hover:text-brand-400"
              >
                ← Return home
              </Link>
            </>
          ) : (
            <>
              <h1 className="font-display text-[24px] font-bold uppercase tracking-[0.04em] text-center">
                Payment not confirmed
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-white/60 text-center">
                If you just paid, wait a few seconds and refresh this page.
                Stripe can take a moment to confirm. If you were charged and this
                keeps happening, contact us and we&apos;ll sort it out straight
                away.
              </p>
              <Link
                href="/book"
                className="mt-6 block text-center text-[14px] text-brand-500 hover:text-brand-400"
              >
                ← Back to booking
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
