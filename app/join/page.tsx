import type { Metadata } from "next";
import Link from "next/link";

import JoinForm from "@/components/JoinForm";
import Logo from "@/components/Logo";
import { MEMBERSHIP_PLANS } from "@/lib/membership-plans";
import { SETTING_KEYS, getSetting } from "@/lib/settings";
import { isStripeConfigured } from "@/lib/stripe";
import { membership } from "@/lib/site";

export const metadata: Metadata = { title: "Join" };
export const dynamic = "force-dynamic";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string; plan?: string }>;
}) {
  const { cancelled, plan } = await searchParams;
  const [configured, priceCents] = await Promise.all([
    isStripeConfigured(),
    getSetting(SETTING_KEYS.membershipPriceCents),
  ]);

  const legacyPrice = Number(priceCents ?? 15000) / 100;
  const showStudentPlan = plan === "student_250";
  const plans = showStudentPlan
    ? [{
        key: "student_250" as const,
        label: MEMBERSHIP_PLANS.student_250.label,
        displayPrice: MEMBERSHIP_PLANS.student_250.displayPrice,
      }]
    : [{
        key: "legacy" as const,
        label: MEMBERSHIP_PLANS.legacy.label,
        displayPrice: legacyPrice.toLocaleString("en-US", { style: "currency", currency: "USD" }) + "/month",
      }];

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
            {showStudentPlan ? "Join HFT In-Person" : "Join the Frequency"}
          </h1>
          <p className="mt-2 text-[14px] text-white/45">
            {showStudentPlan ? (
              <>
                <strong className="text-white/80">$250/month</strong> — HFT In-Person Student Membership, $250 USD, recurring monthly (Stripe subscription). {membership.fineprint}
              </>
            ) : (
              <>
                {legacyPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })} per
                month. {membership.fineprint}
              </>
            )}
          </p>

          {cancelled && (
            <p className="mt-6 rounded-sm border border-white/12 bg-white/5 px-4 py-3 text-[13.5px] text-white/70">
              No payment was taken. You can pick up where you left off whenever
              you&apos;re ready.
            </p>
          )}

          {configured ? (
            <JoinForm plans={plans} defaultPlan={showStudentPlan ? "student_250" : "legacy"} />
          ) : (
            <p className="mt-6 rounded-sm border border-white/12 bg-white/5 px-4 py-3 text-[13.5px] leading-relaxed text-white/70">
              Memberships aren&apos;t open just yet. Check back shortly.
            </p>
          )}

          <ul className="mt-8 space-y-2 border-t border-white/8 pt-6">
            {membership.includes.slice(0, 5).map((item) => (
              <li key={item} className="flex gap-3 text-[14px] text-white/70">
                <span className="text-brand-500">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center text-[13px] text-white/40">
          Already a member?{" "}
          <Link href="/login" className="text-brand-500 hover:text-brand-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
