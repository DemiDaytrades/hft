import type { Metadata } from "next";
import ZoneChart from "@/components/ZoneChart";
import { CandleChart } from "@/components/Candles";
import {
  Accent,
  CTA,
  Eyebrow,
  Panel,
  RuledTitle,
} from "@/components/ui";
import {
  BoltIcon,
  ChartIcon,
  CheckIcon,
  ClockIcon,
  CrossIcon,
  Icon,
  QuoteIcon,
  ShieldIcon,
  TargetIcon,
  UsersIcon,
} from "@/components/icons";
import {
  commonMistakes,
  edgeTraits,
  howItWorks,
  keyRules,
  whyItWorks,
  zones,
} from "@/lib/site";
import {
  consolidationSeries,
  rejectionSeries,
  reversalSeries,
} from "@/lib/candles";

export const metadata: Metadata = {
  title: "The 3ZS Strategy — Three Zones. One Edge.",
  description:
    "3ZS (Three Zone Strategy) is the core framework HFT uses to read the market, time high-probability entries, and manage risk with precision.",
};

const toneClasses = {
  sell: {
    text: "text-zone-sell",
    border: "border-zone-sell/40",
    bg: "bg-zone-sell",
    dot: "bg-zone-sell",
  },
  hold: {
    text: "text-zone-hold",
    border: "border-zone-hold/40",
    bg: "bg-zone-hold",
    dot: "bg-zone-hold",
  },
  buy: {
    text: "text-zone-buy",
    border: "border-zone-buy/40",
    bg: "bg-zone-buy",
    dot: "bg-zone-buy",
  },
} as const;

const zoneCharts = [rejectionSeries, consolidationSeries, reversalSeries];

export default function ThreeZSPage() {
  return (
    <>
      <StrategyHero />
      <ZonesExplained />
      <HowItWorks />
      <RulesGrid />
      <ClosingBand />
    </>
  );
}

/* ── Hero ───────────────────────────────────────────────────────── */

function StrategyHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-14 lg:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[480px] w-[820px] rounded-full bg-brand-700/12 blur-[130px]" />
      </div>

      <div className="container-page relative grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="reveal lg:col-span-4">
          <Eyebrow>The HFT edge</Eyebrow>

          <h1 className="mt-4 text-[clamp(2.6rem,6vw,3.9rem)] font-extrabold leading-[0.9]">
            The <Accent>3ZS</Accent>
            <br />
            Strategy
          </h1>

          <p className="mt-5 font-display text-[clamp(1rem,1.7vw,1.2rem)] font-bold uppercase leading-tight tracking-[0.06em] text-brand-500">
            Three zones. One edge.
            <br />
            Endless opportunities.
          </p>

          <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-white/65">
            3ZS (Three Zone Strategy) is the core framework we use to read the
            market, time high-probability entries, and manage risk with
            precision. It keeps trading simple, repeatable, and profitable.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-2">
            {edgeTraits.map((t) => (
              <div key={t.title}>
                <Icon name={t.icon} className="h-8 w-8 text-brand-500" />
                <h3 className="mt-2.5 text-[13.5px] font-bold tracking-[0.08em]">
                  {t.title}
                </h3>
                <p className="mt-1 text-[12.5px] leading-snug text-white/50">
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal lg:col-span-8">
          <Panel className="overflow-hidden p-0">
            <div className="border-b border-white/8 bg-ink-850 px-5 py-3">
              <p className="font-display text-[14px] font-bold uppercase tracking-[0.18em] text-white/85">
                The 3ZS Framework
              </p>
            </div>
            <div className="p-4">
              <ZoneChart title="The 3ZS Framework" />
            </div>
          </Panel>

          <div className="reveal mt-4 flex items-start gap-4 rounded-md border border-brand-600/45 bg-brand-600/6 p-5">
            <UsersIcon className="mt-0.5 h-7 w-7 shrink-0 text-brand-500" />
            <p className="text-[14.5px] leading-relaxed text-white/75">
              The conference zone is where buyers and sellers meet.
              <br className="hidden sm:block" /> Liquidity builds. Institutions
              position. The market prepares for its next move.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── The three zones ────────────────────────────────────────────── */

function ZonesExplained() {
  return (
    <section className="container-page py-14">
      <div className="reveal">
        <RuledTitle>
          The <Accent>3 zones</Accent> explained
        </RuledTitle>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {zones.map((z, i) => {
          const t = toneClasses[z.tone];
          return (
            <article
              key={z.n}
              className={`reveal rounded-lg border bg-ink-900/70 p-6 ${t.border}`}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-extrabold text-ink-950 ${t.bg}`}
                >
                  {z.n}
                </span>
                <h3 className={`text-[16.5px] font-bold leading-tight ${t.text}`}>
                  {z.name}
                  {/* Zone 2's name already carries its qualifier, so only
                      zones 1 and 3 append the subtitle. */}
                  {z.tone !== "hold" && (
                    <span className="opacity-70"> ({z.sub})</span>
                  )}
                </h3>
              </div>

              <p className="mt-4 text-[14.5px] leading-relaxed text-white/70">
                {z.lead}
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <ul className="space-y-2">
                  {z.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2.5 text-[13.5px] text-white/65"
                    >
                      <span
                        className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${t.dot}`}
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="relative h-28 overflow-hidden rounded-md border border-white/8 bg-ink-950/80">
                  <CandleChart
                    data={zoneCharts[i]}
                    className="h-full w-full"
                    up="#22c55e"
                    down="#e0342b"
                  />
                  {/* Highlighted reaction zone */}
                  <span
                    className={`absolute inset-x-0 h-8 opacity-20 ${t.bg} ${
                      z.tone === "sell"
                        ? "top-2"
                        : z.tone === "buy"
                          ? "bottom-2"
                          : "top-1/2 -translate-y-1/2"
                    }`}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ── How it works + live example ────────────────────────────────── */

function HowItWorks() {
  return (
    <section className="container-page grid gap-4 pb-14 lg:grid-cols-12">
      <Panel className="reveal p-6 lg:col-span-4">
        <h2 className="text-[17px] font-bold tracking-[0.06em] text-brand-500">
          How 3ZS works{" "}
          <span className="text-[13px] text-white/45">(step-by-step)</span>
        </h2>

        <ol className="mt-6 space-y-5">
          {howItWorks.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-600/60 font-display text-[13px] font-bold text-brand-500">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[14.5px] font-bold tracking-[0.05em]">
                  {s.title}
                </h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-white/55">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel className="reveal overflow-hidden p-0 lg:col-span-8">
        <div className="border-b border-white/8 bg-ink-850 px-5 py-3">
          <p className="font-display text-[14px] font-bold uppercase tracking-[0.18em] text-white/85">
            Live example (NAS100 · 5M)
          </p>
        </div>

        <div className="p-4">
          <ZoneChart variant="live" title="Live example: NAS100 5 minute" />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/8 bg-ink-900/60 px-5 py-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { Icon: TargetIcon, a: "High-probability", b: "zones" },
            { Icon: ClockIcon, a: "Wait for", b: "confirmation" },
            { Icon: ChartIcon, a: "Execute with", b: "precision" },
            { Icon: ShieldIcon, a: "Manage risk", b: "always" },
            { Icon: BoltIcon, a: "Consistent profits", b: "over time" },
          ].map(({ Icon: I, a, b }) => (
            <div key={a} className="flex items-center gap-2.5">
              <I className="h-6 w-6 shrink-0 text-brand-500" />
              <p className="font-display text-[12px] font-semibold uppercase leading-tight tracking-[0.1em] text-white/70">
                {a}
                <br />
                <span className="text-white/45">{b}</span>
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

/* ── Why / rules / mistakes ─────────────────────────────────────── */

function RulesGrid() {
  return (
    <section className="container-page grid gap-4 pb-14 lg:grid-cols-12">
      <Panel className="reveal p-6 lg:col-span-4">
        <h2 className="text-[17px] font-bold tracking-[0.06em] text-brand-500">
          Why 3ZS works
        </h2>
        <ul className="mt-5 space-y-3">
          {whyItWorks.map((w) => (
            <li key={w} className="flex items-start gap-3 text-[14px] text-white/70">
              <CheckIcon className="mt-0.5 h-[17px] w-[17px] shrink-0 text-brand-500" />
              {w}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-md border border-brand-600/30 bg-brand-600/6 p-5">
          <QuoteIcon className="h-5 w-5 text-brand-600/70" />
          <p className="mt-2.5 text-[14px] italic leading-relaxed text-white/75">
            The goal isn&apos;t to be right every time. The goal is to make the
            right trades count.
          </p>
          <p className="mt-3 text-right font-display text-[12px] uppercase tracking-[0.2em] text-brand-500">
            — HFT
          </p>
        </div>
      </Panel>

      <Panel className="reveal p-6 lg:col-span-4">
        <h2 className="text-[17px] font-bold tracking-[0.06em] text-brand-500">
          Key rules
        </h2>
        <ul className="mt-5 space-y-3">
          {keyRules.map((r) => (
            <li key={r} className="flex items-start gap-3 text-[14px] text-white/70">
              <CheckIcon className="mt-0.5 h-[17px] w-[17px] shrink-0 text-brand-500" />
              {r}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-4 rounded-md border border-brand-600/40 bg-brand-600/6 p-5">
          <BoltIcon className="h-7 w-7 shrink-0 text-brand-500" />
          <div>
            <p className="font-display text-[14px] font-bold uppercase tracking-[0.12em] text-brand-500">
              Discipline in. Freedom out.
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/60">
              Stay in the process. The results take care of themselves.
            </p>
          </div>
        </div>
      </Panel>

      <Panel className="reveal p-6 lg:col-span-4">
        <h2 className="text-[17px] font-bold tracking-[0.06em] text-brand-500">
          Common mistakes
        </h2>
        <ul className="mt-5 space-y-3">
          {commonMistakes.map((m) => (
            <li key={m} className="flex items-start gap-3 text-[14px] text-white/70">
              <CrossIcon className="mt-0.5 h-[17px] w-[17px] shrink-0 text-zone-sell" />
              {m}
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-white/8 pt-5">
          <p className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-500">
            You weren&apos;t born to just survive.
          </p>
          <h3 className="mt-2 text-[clamp(1.2rem,2.2vw,1.5rem)] font-extrabold leading-tight">
            You were born to thrive.
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-white/60">
            Find your purpose. Master your craft. Create freedom. Make an
            impact.
          </p>
          <p className="mt-3 font-display text-[15px] font-medium italic text-brand-500">
            This is the HFT way.
          </p>
        </div>
      </Panel>
    </section>
  );
}

/* ── Closing ────────────────────────────────────────────────────── */

function ClosingBand() {
  return (
    <section className="container-page pb-16">
      <div className="reveal flex flex-col items-center justify-between gap-6 rounded-lg border border-brand-600/45 bg-ink-900/80 p-6 lg:flex-row lg:p-8">
        <div className="flex items-center gap-4">
          <UsersIcon className="hidden h-9 w-9 shrink-0 text-brand-500 sm:block" />
          <p className="text-center font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/85 lg:text-left">
            Join a community of traders and creators building freedom together.
          </p>
        </div>
        <CTA size="lg" className="w-full justify-center lg:w-auto" />
      </div>
    </section>
  );
}
