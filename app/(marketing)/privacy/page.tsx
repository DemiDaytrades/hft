import type { Metadata } from "next";
import Link from "next/link";

import { Accent, Divider, Eyebrow } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects your information.`,
  alternates: { canonical: "/privacy" },
};

const updated = "November 5, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-ink-950 text-white">
      <section className="container-page pt-16 pb-10 lg:pt-24">
        <Eyebrow rule>Legal</Eyebrow>
        <h1 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold uppercase leading-[1.05] tracking-[0.02em]">
          Privacy <Accent>Policy</Accent>
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/65">
          This Privacy Policy describes how {site.legalName} (“{site.shortName},” “we,” “us,” or “our”) collects, uses, and shares
          information when you visit our website, create an account, purchase a membership, book consultations, or communicate with us.
        </p>
        <p className="mt-2 text-[13px] text-white/45">Last updated: {updated}</p>
      </section>

      <div className="container-page"><Divider /></div>

      <section className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-4xl space-y-10 text-[15px] leading-relaxed text-white/75">
          <PolicySection title="Information We Collect">
            <p>We collect information you provide directly, information generated through your use of our services, and limited technical information from your device or browser.</p>
          </PolicySection>

          <PolicySection title="Account Information">
            <p>When you create an account or become a member, we may collect your name, email address, password (stored in hashed form), role/account details, and preferences you choose to provide.</p>
          </PolicySection>

          <PolicySection title="Contact Information">
            <p>We may collect contact details you submit, such as your email address, phone number, and any information you provide when booking consultations, requesting support, or communicating with us.</p>
          </PolicySection>

          <PolicySection title="Payment Information">
            <p>Payments are processed by third-party payment processors (such as Stripe). We do not store full payment card numbers on our servers. Payment processors may collect and process billing details, card information, and transaction data according to their own privacy and security practices.</p>
          </PolicySection>

          <PolicySection title="Website & Technical Information">
            <p>We may collect technical and usage information such as IP address, browser/device type, pages viewed, approximate location derived from IP, timestamps, and diagnostic logs to operate, secure, and improve our services.</p>
          </PolicySection>

          <PolicySection title="How We Use Information">
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide, maintain, and improve our website, memberships, and educational services</li>
              <li>Process payments, bookings, and account-related requests</li>
              <li>Communicate about your account, consultations, scheduling, reminders, and support</li>
              <li>Send service-related notifications you request or consent to receive</li>
              <li>Monitor for fraud, abuse, security incidents, and technical issues</li>
              <li>Comply with legal obligations and enforce our terms</li>
            </ul>
          </PolicySection>

          <PolicySection title="Service Providers">
            <p>We may share information with trusted service providers who help us operate our business, such as hosting and infrastructure providers, payment processors, communications providers (including email and SMS delivery services), scheduling tools, analytics, and customer support tools. These providers are permitted to process information only as necessary to perform services on our behalf or to comply with legal requirements.</p>
          </PolicySection>

          <PolicySection title="SMS & Mobile Information">
            <p>If you voluntarily provide a mobile number and opt in, you may receive SMS communications related to your {site.shortName} account, membership, consultations, bookings, reminders, payment or transaction confirmations, scheduling updates, and customer support.</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-white">SMS consent is optional.</strong></li>
              <li><strong className="text-white">Consent to receive SMS messages is not a condition of purchase.</strong></li>
              <li><strong className="text-white">Message frequency varies.</strong></li>
              <li><strong className="text-white">Message and data rates may apply.</strong></li>
              <li>You may reply <strong className="text-white">STOP</strong> to opt out of SMS messages.</li>
              <li>You may reply <strong className="text-white">HELP</strong> for assistance.</li>
              <li>Opting out of SMS does not cancel your {site.shortName} account or membership.</li>
              <li><strong className="text-white">Mobile opt-in/consent information will not be sold or shared with third parties for their marketing or promotional purposes.</strong></li>
              <li><strong className="text-white">SMS consent and opt-in data will not be sold or shared with third parties for marketing or promotional purposes.</strong></li>
            </ul>
            <p>We may share mobile information with service providers that deliver SMS messages on our behalf, as needed to provide the communications you requested or consented to receive, and as otherwise required by law.</p>
          </PolicySection>

          <PolicySection title="Data Security">
            <p>We use reasonable administrative, technical, and organizational measures designed to protect information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>
          </PolicySection>

          <PolicySection title="Data Retention">
            <p>We retain information for as long as reasonably necessary to provide services, maintain accounts, comply with legal obligations, resolve disputes, enforce agreements, and support legitimate business purposes. Retention periods may vary depending on the type of information and context.</p>
          </PolicySection>

          <PolicySection title="Your Choices">
            <p>You may update certain account information through your account settings (where available) or by contacting us. You can opt out of marketing emails by using unsubscribe links (if provided) and opt out of SMS by replying STOP. You may also contact us with questions about your information.</p>
          </PolicySection>

          <PolicySection title="Contact & Privacy Questions">
            <p>
              If you have questions about this Privacy Policy or our privacy practices, contact us at{" "}
              <a href={`mailto:${site.email}`} className="text-brand-500 hover:text-brand-400 underline decoration-brand-700/60 underline-offset-2">
                {site.email}
              </a>.
            </p>
          </PolicySection>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-sm border border-brand-600/60 px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-brand-500 hover:bg-brand-600/10"
            >
              ← Back to {site.shortName}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/8 bg-ink-900/50 p-6">
      <h2 className="font-display text-[20px] font-bold uppercase tracking-[0.03em] text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
