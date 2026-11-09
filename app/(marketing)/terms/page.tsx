import type { Metadata } from "next";
import Link from "next/link";

import { Accent, Divider, Eyebrow } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms governing use of ${site.name}'s website, memberships, and services.`,
  alternates: { canonical: "/terms" },
};

const updated = "November 5, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ink-950 text-white">
      <section className="container-page pt-16 pb-10 lg:pt-24">
        <Eyebrow rule>Legal</Eyebrow>
        <h1 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold uppercase leading-[1.05] tracking-[0.02em]">
          Terms & <Accent>Conditions</Accent>
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/65">
          These Terms & Conditions (“Terms”) govern your access to and use of the {site.name} website, memberships, consultations,
          educational content, and related services provided by {site.legalName} (“{site.shortName},” “we,” “us,” or “our”).
          By using our services, you agree to these Terms.
        </p>
        <p className="mt-2 text-[13px] text-white/45">Last updated: {updated}</p>
      </section>

      <div className="container-page"><Divider /></div>

      <section className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-4xl space-y-10 text-[15px] leading-relaxed text-white/75">
          <TermSection title="Acceptance of Terms">
            <p>By accessing or using our website, creating an account, purchasing a membership, booking a consultation, or participating in our services, you agree to these Terms and our <Link href="/privacy" className="text-brand-500 hover:text-brand-400 underline decoration-brand-700/60 underline-offset-2">Privacy Policy</Link>. If you do not agree, do not use our services.</p>
          </TermSection>

          <TermSection title="Eligibility & Account Responsibilities">
            <p>You must be legally able to enter into these Terms and use our services in your jurisdiction. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate information and to notify us of unauthorized use of your account.</p>
          </TermSection>

          <TermSection title="Memberships & Subscriptions">
            <p>{site.shortName} offers memberships and educational access as described on our website or checkout pages. Membership features, pricing, and availability may change. Your access may depend on an active subscription, successful payment, or other eligibility requirements.</p>
          </TermSection>

          <TermSection title="Consultations & Bookings">
            <p>Consultations and bookings are subject to availability, scheduling rules, and the specific terms presented at the time of booking. You are responsible for providing accurate contact and scheduling information. Missed appointments, rescheduling, and related policies may be governed by the booking flow or communications provided for that service.</p>
          </TermSection>

          <TermSection title="Payments & Billing">
            <p>Payments are processed through third-party payment processors. By purchasing a membership or booking, you authorize applicable charges according to the pricing and billing terms presented at checkout. Taxes, fees, and processor terms may apply. If a payment fails or is reversed, we may suspend or limit access to paid services.</p>
          </TermSection>

          <TermSection title="Cancellations & Refunds">
            <p>Cancellation and refund terms, if any, are governed by the specific policies presented at the time of purchase or booking and by applicable law. If no separate written refund or cancellation policy is provided for a particular purchase, please contact us at <a href={`mailto:${site.email}`} className="text-brand-500 hover:text-brand-400 underline decoration-brand-700/60 underline-offset-2">{site.email}</a> for assistance. We may update or clarify purchase-specific terms in the checkout or booking flow.</p>
          </TermSection>

          <TermSection title="Educational Nature of HFT Content">
            <p>{site.shortName} provides educational content, coaching, community resources, and informational materials. Our content is intended for educational purposes only and should not be interpreted as personalized financial, investment, legal, or tax advice.</p>
          </TermSection>

          <TermSection title="Trading & Investment Risk">
            <p>Trading involves substantial risk of loss and is not suitable for every investor. Market conditions can change rapidly, and you are solely responsible for your trading decisions, risk management, and use of any strategies or information discussed through our services.</p>
          </TermSection>

          <TermSection title="No Guarantee of Profits or Financial Results">
            <p>{site.shortName} does not guarantee profits, income, performance, or any specific financial outcome. Past performance, examples, testimonials, or case studies are not indicative of future results.</p>
          </TermSection>

          <TermSection title="User Conduct">
            <p>You agree not to misuse our services, interfere with site operations, attempt unauthorized access, harass others, violate applicable laws, or copy, redistribute, or exploit our content or systems except as permitted by us in writing.</p>
          </TermSection>

          <TermSection title="Intellectual Property">
            <p>All site content, branding, materials, text, graphics, videos, training resources, and other intellectual property provided by {site.shortName} are owned by or licensed to us and are protected by applicable laws. You may not reproduce, distribute, modify, or create derivative works without our prior written permission, except as allowed by law.</p>
          </TermSection>

          <TermSection title="Service Availability & Changes">
            <p>We may modify, suspend, or discontinue any part of our website or services at any time, including features, pricing, schedules, or content. We do not guarantee uninterrupted or error-free operation.</p>
          </TermSection>

          <TermSection title="SMS Terms">
            <p>SMS communications from {site.shortName} are optional. If you opt in, you may receive messages related to your account, membership, consultations, bookings, scheduling, reminders, transaction/payment confirmations, and customer support.</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-white">SMS communications are optional.</strong></li>
              <li><strong className="text-white">Consent to receive SMS messages is not a condition of purchase.</strong></li>
              <li><strong className="text-white">Message frequency varies.</strong></li>
              <li><strong className="text-white">Message and data rates may apply.</strong></li>
              <li>Reply <strong className="text-white">STOP</strong> to opt out.</li>
              <li>Reply <strong className="text-white">HELP</strong> for assistance.</li>
              <li>Opting out of SMS does not cancel your {site.shortName} account, membership, booking, or other services.</li>
              <li><strong className="text-white">Carriers are not liable for delayed or undelivered messages.</strong></li>
            </ul>
            <p>For more information about how we handle mobile information, see our <Link href="/privacy" className="text-brand-500 hover:text-brand-400 underline decoration-brand-700/60 underline-offset-2">Privacy Policy</Link>.</p>
          </TermSection>

          <TermSection title="Limitation of Liability">
            <p>To the fullest extent permitted by law, {site.legalName} and its owners, affiliates, team members, and service providers will not be liable for indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, revenue, data, or goodwill arising from or related to your use of our services. Our total liability for any claim arising out of or relating to the services will be limited to the amount you paid to us for the service giving rise to the claim during the applicable period, to the extent permitted by law.</p>
          </TermSection>

          <TermSection title="Termination">
            <p>We may suspend or terminate access to our services if you violate these Terms, misuse the services, fail to pay applicable fees, or if we reasonably determine it is necessary to protect our users, systems, or business. You may stop using our services at any time, subject to any applicable billing or booking terms.</p>
          </TermSection>

          <TermSection title="Changes to Terms">
            <p>We may update these Terms from time to time. The updated version will be posted on this page with a revised “Last updated” date. Your continued use of the services after changes become effective constitutes acceptance of the updated Terms.</p>
          </TermSection>

          <TermSection title="Contact Information">
            <p>
              Questions about these Terms? Contact us at{" "}
              <a href={`mailto:${site.email}`} className="text-brand-500 hover:text-brand-400 underline decoration-brand-700/60 underline-offset-2">
                {site.email}
              </a>.
            </p>
          </TermSection>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/privacy"
              className="inline-flex items-center rounded-sm border border-brand-600/60 px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-brand-500 hover:bg-brand-600/10"
            >
              View Privacy Policy
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-sm border border-white/15 px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/85 transition-colors hover:border-white/30 hover:text-white"
            >
              ← Back to {site.shortName}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function TermSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/8 bg-ink-900/50 p-6">
      <h2 className="font-display text-[20px] font-bold uppercase tracking-[0.03em] text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
