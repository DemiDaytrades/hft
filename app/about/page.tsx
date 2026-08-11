import type { Metadata } from "next";
import Image from "next/image";
import {
  Accent,
  CTA,
  Divider,
  Eyebrow,
  Panel,
  RuledTitle,
} from "@/components/ui";
import { CandleChart } from "@/components/Candles";
import { CheckIcon, Icon, QuoteIcon } from "@/components/icons";
import Logo from "@/components/Logo";
import {
  creatorPillars,
  frequencyList,
  purposePillars,
  site,
  values,
} from "@/lib/site";
import { heroSeries } from "@/lib/candles";

export const metadata: Metadata = {
  title: "About — More Than Trading",
  description:
    "High Frequency Talent is a movement built to help traders and creators master their craft, build wealth, and live a life of meaning.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <PurposeSection />
      <QuoteBand />
      <CreatorsSection />
      <ValuesSection />
      <FounderSection />
    </>
  );
}

/* ── Hero ───────────────────────────────────────────────────────── */

function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 lg:pt-36 lg:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[520px] w-[720px] rounded-full bg-brand-700/12 blur-[120px]" />
      </div>

      <div className="container-page relative grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="reveal">
          <Eyebrow rule>About HFT</Eyebrow>

          <h1 className="mt-6 text-[clamp(2.4rem,5.4vw,3.4rem)] font-extrabold leading-[0.94]">
            More than trading.
            <br />
            <Accent>It&apos;s a frequency of purpose.</Accent>
          </h1>

          <span className="mt-6 block h-0.5 w-20 bg-brand-600" />

          <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/65">
            High Frequency Talent (HFT) is more than a trading education
            company. It&apos;s a movement built to help traders and creators
            master their craft, build wealth, and live a life of meaning.
          </p>
          <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-white/65">
            We combine a proven trading edge, real market experience, and a
            powerful community to help you turn your skill into freedom and your
            dreams into reality.
          </p>

          <CTA size="lg" className="mt-9" />
        </div>

        {/* Neon-sign panel standing in for the mockup's studio photography */}
        <div className="reveal relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-8 lg:p-12">
          <CandleChart
            data={heroSeries}
            className="absolute inset-x-0 bottom-0 h-2/3 w-full opacity-25"
            up="#e8551c"
            down="#8f2c05"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(227,69,9,0.28),transparent_60%)]"
          />

          <div className="relative flex flex-col items-end gap-1 text-right">
            {["Discipline", "Purpose", "Freedom"].map((word, i) => (
              <span
                key={word}
                className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-medium italic leading-tight text-brand-400"
                style={{
                  textShadow:
                    "0 0 10px rgba(255,111,44,0.85), 0 0 34px rgba(227,69,9,0.6)",
                  animationDelay: `${i * 400}ms`,
                }}
              >
                {word}
              </span>
            ))}
          </div>

          <p className="relative mt-10 font-display text-[13px] uppercase tracking-[0.3em] text-white/40">
            {site.strapline}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Purpose + frequency ────────────────────────────────────────── */

function PurposeSection() {
  return (
    <section className="border-y border-white/8 bg-ink-900/50 py-16 lg:py-20">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="reveal">
          <Eyebrow>We believe</Eyebrow>

          <h2 className="mt-5 text-[clamp(1.7rem,3.4vw,2.4rem)] font-extrabold leading-[0.98]">
            You were born
            <br />
            <Accent>on purpose.</Accent>
          </h2>

          <p className="mt-6 max-w-lg text-[15.5px] leading-relaxed text-white/65">
            You weren&apos;t placed here by accident. You were created with a
            purpose—to discover your gifts, pursue your calling, and make an
            impact on the people around you who love, care, and support you.
          </p>

          <span className="mt-8 block h-0.5 w-16 bg-brand-600" />

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {purposePillars.map((p) => (
              <div key={p.label} className="text-center sm:text-left">
                <Icon
                  name={p.icon}
                  className="mx-auto h-9 w-9 text-brand-500 sm:mx-0"
                />
                <p className="mt-3 font-display text-[12.5px] font-semibold uppercase leading-snug tracking-[0.12em] text-white/80">
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal lg:border-l lg:border-white/8 lg:pl-16">
          <h2 className="text-[clamp(1.3rem,2.4vw,1.7rem)] font-bold tracking-[0.04em] text-brand-500">
            Stay on a high frequency
          </h2>

          <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-white/65">
            Your frequency is your mindset, your environment, your discipline,
            and your daily decisions. When you stay on a high frequency, you
            attract better opportunities, become your highest self, and move
            with clarity and confidence.
          </p>

          <ul className="mt-8 space-y-6">
            {frequencyList.map((f) => (
              <li key={f.title} className="flex gap-4">
                <CheckIcon className="mt-0.5 h-6 w-6 shrink-0 text-brand-500" />
                <div>
                  <h3 className="text-[15.5px] font-bold tracking-[0.05em]">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-white/60">
                    {f.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── Quote band ─────────────────────────────────────────────────── */

function QuoteBand() {
  return (
    <section className="relative overflow-hidden py-14">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(227,69,9,0.22),transparent_65%)]"
      />
      <div className="container-page relative flex items-start gap-6">
        <QuoteIcon className="hidden h-10 w-10 shrink-0 text-brand-600/70 sm:block" />
        <div>
          <p className="text-[clamp(1.05rem,2.2vw,1.5rem)] font-medium italic leading-snug text-white">
            Self worth comes from becoming who you know you&apos;re capable of
            becoming.
          </p>
          <p className="mt-2 text-[clamp(1.05rem,2.2vw,1.5rem)] font-medium italic leading-snug text-brand-500">
            Your worth isn&apos;t found in money—it&apos;s found in alignment
            with your purpose.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── For creators ───────────────────────────────────────────────── */

function CreatorsSection() {
  return (
    <section
      id="creators"
      className="scroll-mt-24 border-y border-white/8 bg-ink-900/50 py-16 lg:py-20"
    >
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* pb reserves the strip the waveform occupies so the neon words
            never sit on top of it. */}
        <div className="reveal relative order-2 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-8 pb-32 lg:order-1 lg:p-12 lg:pb-36">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(227,69,9,0.25),transparent_60%)]"
          />
          {/* Waveform, echoing the studio imagery in the brand mockups */}
          <svg
            viewBox="0 0 400 120"
            className="absolute inset-x-0 bottom-8 h-20 w-full opacity-45"
            aria-hidden="true"
          >
            {Array.from({ length: 48 }, (_, i) => {
              const h = 8 + Math.abs(Math.sin(i * 0.7)) * 78;
              return (
                <rect
                  key={i}
                  x={i * 8.3 + 2}
                  y={60 - h / 2}
                  width="3.4"
                  height={h}
                  rx="1.7"
                  fill="var(--color-brand-600)"
                />
              );
            })}
          </svg>

          <div className="relative flex flex-col items-start gap-1">
            {["Create", "Inspire", "Impact"].map((word) => (
              <span
                key={word}
                className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-medium italic leading-tight text-brand-400"
                style={{
                  textShadow:
                    "0 0 10px rgba(255,111,44,0.8), 0 0 32px rgba(227,69,9,0.55)",
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="reveal order-1 lg:order-2">
          <Eyebrow>For creators. By a creator.</Eyebrow>

          <h2 className="mt-5 text-[clamp(1.6rem,3.2vw,2.2rem)] font-extrabold leading-[0.98]">
            Trading fuels freedom.
            <br />
            <Accent>Freedom fuels creativity.</Accent>
          </h2>

          <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/65">
            As a trader and musical artist, I know what it&apos;s like to chase
            a dream. HFT was built to give creators the financial freedom, time,
            and mental clarity to focus on their art while building
            generational wealth.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {creatorPillars.map((p) => (
              <div key={p.title} className="text-center sm:text-left">
                <Icon
                  name={p.icon}
                  className="mx-auto h-9 w-9 text-brand-500 sm:mx-0"
                />
                <p className="mt-3 font-display text-[12.5px] font-semibold uppercase leading-snug tracking-[0.12em] text-white/80">
                  {p.title}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[15.5px] leading-relaxed text-white/65">
            You don&apos;t have to choose between your passion and your future.{" "}
            <span className="text-brand-500">You can build both.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Values ─────────────────────────────────────────────────────── */

function ValuesSection() {
  return (
    <section className="container-page py-16 lg:py-20">
      <div className="reveal">
        <RuledTitle>
          <Accent>What we stand for</Accent>
        </RuledTitle>
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-5">
        {values.map((v) => (
          <div
            key={v.title}
            className="reveal group bg-ink-950 p-7 text-center transition-colors duration-300 hover:bg-ink-900"
          >
            <Icon
              name={v.icon}
              className="mx-auto h-11 w-11 text-brand-500 transition-transform duration-300 group-hover:scale-110"
            />
            <h3 className="mt-4 text-[16px] font-bold tracking-[0.08em]">
              {v.title}
            </h3>
            <span className="mx-auto mt-3 block h-0.5 w-8 bg-brand-600" />
            <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">
              {v.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Founder ────────────────────────────────────────────────────── */

function FounderSection() {
  return (
    <section className="border-t border-white/8 bg-ink-900/50 py-16">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="reveal">
          <Eyebrow>Founded by</Eyebrow>

          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold">
            {site.founder}
          </h2>
          <span className="mt-4 block h-0.5 w-24 bg-brand-600" />

          <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/65">
            HFT was founded by {site.founder}, a trader, entrepreneur, and
            musical artist passionate about the markets, education, and creating
            opportunities for others.
          </p>
          <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-white/65">
            Her mission is simple: teach the right way, build a strong
            community, and help you unlock your full potential.
          </p>

          <p className="mt-6 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-brand-500">
            You have the talent. We provide the frequency.
          </p>
        </div>

        <div className="reveal flex flex-col items-center gap-8">
          <Image
            src="/hft-seal.png"
            alt="High Frequency Talent seal — Master Your Frequency. Keep Climbing."
            width={280}
            height={280}
            className="h-auto w-[220px] lg:w-[280px]"
          />
          <Logo size="lg" />
          <p className="font-display text-[13px] uppercase tracking-[0.32em] text-white/50">
            Educate. Execute. Elevate.
          </p>
        </div>
      </div>

      <div className="container-page mt-14">
        <Divider />
        <Panel className="mt-8 flex flex-col items-center justify-between gap-5 border-brand-600/45 p-6 lg:flex-row">
          <p className="text-center font-display text-[15px] font-semibold uppercase tracking-[0.18em] text-white/85 lg:text-left">
            Join a community of traders and creators building freedom together.
          </p>
          <CTA size="md" className="shrink-0" />
        </Panel>
      </div>
    </section>
  );
}
