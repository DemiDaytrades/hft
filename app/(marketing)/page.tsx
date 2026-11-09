import Link from "next/link";
import TerminalChart from "@/components/TerminalChart";
import { CandleChart } from "@/components/Candles";
import {
  Accent,
  CTA,
  Eyebrow,
  Fineprint,
  Panel,
  RuledTitle,
} from "@/components/ui";
import {
  CheckIcon,
  DiscordIcon,
  Icon,
  LockIcon,
  QuoteIcon,
  TelegramIcon,
  MoneyIcon,
  RocketIcon,
  TargetIcon,
} from "@/components/icons";
import {
  becomeList,
  discordUrl,
  features,
  membership,
  site,
  telegramUrl,
  testimonials,
} from "@/lib/site";
import {
  consolidationSeries,
  rejectionSeries,
  reversalSeries,
} from "@/lib/candles";

/** Rotated across the feature tiles so no two thumbnails look alike. */
const tileCharts = [reversalSeries, consolidationSeries, rejectionSeries];

export default function HomePage() {
  return (
    <>
      <Hero />
      <BookDemiSection />
      <FeatureGrid />
      {/* Pricing sits after the value, not beside the headline: the hero sells
          the idea, this asks for the money. */}
      <MembershipSection />
      <CommunityRow />
      <ClosingBand />
    </>
  );
}

/* ── Hero ───────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-36 lg:pb-24">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-brand-700/12 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
      </div>

      {/* Two columns, not three. Copy gets room to breathe and the chart has
          space to read as a chart rather than a thumbnail. */}
      <div className="container-page relative grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
        {/* Copy */}
        <div className="reveal lg:col-span-6">
          <Eyebrow rule>{site.tagline}</Eyebrow>

          <h1 className="mt-6 text-[clamp(2.6rem,5.2vw,4rem)] font-extrabold leading-[0.96] tracking-[-0.015em]">
            Master the markets.
            <br />
            <Accent>Build freedom.</Accent>
            <br />
            <Accent>Live your purpose.</Accent>
          </h1>

          <p className="mt-7 max-w-lg text-[16.5px] leading-relaxed text-white/65">
            High Frequency Talent is more than a trading community—it&apos;s a
            movement of disciplined traders and creators building financial
            freedom and a life of meaning.
          </p>

          {/* One ask in the hero. The membership section further down is where
              price and the full feature list live. */}
          <div className="mt-9 flex flex-col items-start gap-4">
            <CTA size="lg" />
            <Fineprint />
          </div>
        </div>

        {/* Terminal */}
        <div className="reveal lg:col-span-6">
          <TerminalChart />
        </div>
      </div>
    </section>
  );
}

/* ── Book Demi ──────────────────────────────────────────────────── */

function BookDemiSection() {
  return (
    <section className="container-page py-12 lg:py-16">
      <div className="reveal mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
          Book a Call with Demi
        </h2>
        <p className="mt-3 text-white/65">
          Have a trading question or want to learn more about HFT? Book private
          time with Demi starting at $10.
        </p>
        <div className="mt-6">
          <Link
            href="/book"
            className="inline-block rounded-full bg-brand-600 px-6 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-500"
          >
            Book Demi
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Membership ─────────────────────────────────────────────────── */

function MembershipSection() {
  return (
    <section className="container-page py-16 lg:py-20">
      <div className="reveal grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <MembershipCard />
        <InPersonMembershipCard />
      </div>
    </section>
  );
}

function MembershipCard() {
  return (
    <Panel glow id="membership" className="scroll-mt-28 flex h-full flex-col p-7">
      <p className="font-display text-[19px] font-bold uppercase tracking-[0.12em] text-brand-500">
        HFT Membership
      </p>

      <p className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-[62px] font-extrabold leading-none text-white">
          {membership.currency}
          {membership.price}
        </span>
        <span className="font-display text-[19px] font-semibold uppercase tracking-[0.1em] text-white/55">
          /{membership.interval}
        </span>
      </p>

      <p className="mt-5 font-display text-[17px] font-bold uppercase tracking-[0.08em] text-brand-500">
        {membership.headline}
      </p>
      <p className="font-display text-[17px] font-bold uppercase tracking-[0.08em] text-white">
        {membership.subhead}
      </p>

      <ul className="mt-6 space-y-3">
        {membership.includes.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[15px] text-white/80">
            <CheckIcon className="h-[18px] w-[18px] shrink-0 text-brand-500" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <CTA size="md" className="w-full" />
        <Fineprint className="mt-4 justify-center" />
      </div>
    </Panel>
  );
}

function InPersonMembershipCard() {
  return (
    <Panel id="in-person-membership" className="scroll-mt-28 flex h-full flex-col p-7">
      <p className="font-display text-[19px] font-bold uppercase tracking-[0.12em] text-brand-500">
        HFT In-Person Student Membership
      </p>

      <p className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-[62px] font-extrabold leading-none text-white">
          $250
        </span>
        <span className="font-display text-[19px] font-semibold uppercase tracking-[0.1em] text-white/55">
          /month
        </span>
      </p>

      <p className="mt-5 font-display text-[17px] font-bold uppercase tracking-[0.08em] text-brand-500">
        Train in person.
      </p>
      <p className="font-display text-[17px] font-bold uppercase tracking-[0.08em] text-white">
        Build with the community.
      </p>

      <ul className="mt-6 space-y-3">
        {[
          "In-person student training membership",
          "Structured HFT education and strategy development",
          "Hands-on guidance in a live learning environment",
          "Community access with traders and creators",
          "Recurring monthly membership access",
        ].map((item) => (
          <li key={item} className="flex items-center gap-3 text-[15px] text-white/80">
            <CheckIcon className="h-[18px] w-[18px] shrink-0 text-brand-500" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <CTA href="/join?plan=student_250" size="md" className="w-full">
          JOIN IN-PERSON
        </CTA>
        <p className="mt-4 flex items-center justify-center gap-2 text-[12.5px] text-white/45">
          <LockIcon className="h-3.5 w-3.5" />
          {membership.fineprint}
        </p>
      </div>
    </Panel>
  );
}

/* ── Features ───────────────────────────────────────────────────── */

function FeatureGrid() {
  return (
    <section className="container-page py-16 lg:py-20">
      <div className="reveal">
        <RuledTitle>
          You get access to everything you need <Accent>to win</Accent>
        </RuledTitle>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {features.map((f, i) => (
          <article
            key={f.title}
            className="reveal group relative overflow-hidden rounded-md border border-white/8 bg-ink-900/70 transition-colors duration-300 hover:border-brand-600/55"
            style={{ transitionDelay: `${i * 55}ms` }}
          >
            {/* Visual header — stands in for the mockup's photography */}
            <div className="relative h-24 overflow-hidden border-b border-white/6 bg-gradient-to-br from-ink-800 to-ink-950">
              <CandleChart
                data={tileCharts[i % tileCharts.length]}
                className="absolute inset-0 h-full w-full opacity-35"
                up="#22c55e"
                down="#e0342b"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
              <Icon
                name={f.icon}
                className="absolute -right-3 -top-2 h-20 w-20 text-brand-600/18"
              />
            </div>

            {/* pt-8 (not mt-8 on the title) so the h3 margin can't collapse
                out of this box and drag the absolute badge down with it. */}
            <div className="relative px-4 pb-5 pt-8">
              <span className="absolute -top-5 left-4 flex h-10 w-10 items-center justify-center rounded-sm border border-brand-600/60 bg-ink-850 text-brand-500 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={f.icon} className="h-5 w-5" />
              </span>

              <h3 className="text-[15.5px] font-bold tracking-[0.04em]">
                {f.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/55">
                {f.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Community / become / testimonials ──────────────────────────── */

function CommunityRow() {
  return (
    <section
      id="community"
      className="container-page grid scroll-mt-24 gap-4 py-8 lg:grid-cols-12"
    >
      {/* Connect */}
      <Panel className="reveal p-6 lg:col-span-3">
        <p className="font-display text-[17px] font-bold uppercase tracking-[0.14em] text-brand-500">
          Connect. Learn. Grow.
        </p>

        <div className="mt-6 space-y-4">
          <ChannelCard
            href={discordUrl}
            tone="discord"
            title="Discord Community"
            body="Join our private server with a growing community of motivated traders and creators."
            cta="Join Discord"
          />
          <ChannelCard
            href={telegramUrl}
            tone="telegram"
            title="Telegram Channel"
            body="Get real-time alerts, important updates, and market insights delivered instantly."
            cta="Join Telegram"
          />
        </div>
      </Panel>

      {/* What you'll become */}
      <Panel className="reveal p-6 lg:col-span-4">
        <p className="font-display text-[17px] font-bold uppercase tracking-[0.14em] text-brand-500">
          What you&apos;ll become
        </p>

        <ul className="mt-6 space-y-3.5">
          {becomeList.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[14.5px] text-white/80">
              <CheckIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-500" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-7 rounded-md border border-brand-600/30 bg-brand-600/6 p-5">
          <QuoteIcon className="h-6 w-6 text-brand-600/70" />
          <p className="mt-3 text-[14.5px] italic leading-relaxed text-white/75">
            We weren&apos;t born on accident. We were born on purpose to find our
            purpose and help those around us who love, care, and work hard for us.
          </p>
          <p className="mt-4 font-display text-[12.5px] font-semibold uppercase tracking-[0.18em] text-brand-500">
            Trade your purpose. Live your frequency.
          </p>
        </div>
      </Panel>

      {/* Testimonials */}
      <div className="reveal lg:col-span-5">
        <Panel className="h-full p-6">
          <p className="font-display text-[17px] font-bold uppercase tracking-[0.1em] text-white">
            Real traders. <Accent>Real results.</Accent>
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex h-full flex-col rounded-md border border-white/8 bg-ink-850/70 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-600/55 bg-brand-600/12 font-display text-[15px] font-bold text-brand-400">
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <span className="text-[12px] tracking-[0.1em] text-brand-500">
                    ★★★★★
                  </span>
                </div>

                <blockquote className="mt-4 flex-1 text-[13.5px] leading-relaxed text-white/70">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-4 border-t border-white/8 pt-3">
                  <p className="font-display text-[14px] font-bold uppercase tracking-[0.08em] text-white">
                    {t.name}
                  </p>
                  <p className="text-[12.5px] text-white/45">{t.role}</p>
                  <p className="mt-1 text-[12.5px] text-brand-500">{t.tenure}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function ChannelCard({
  href,
  tone,
  title,
  body,
  cta,
}: {
  href: string;
  tone: "discord" | "telegram";
  title: string;
  body: string;
  cta: string;
}) {
  const brand =
    tone === "discord"
      ? { bg: "bg-[#5865F2]", hover: "hover:bg-[#4752c4]", ring: "border-[#5865F2]/35" }
      : { bg: "bg-[#229ED9]", hover: "hover:bg-[#1b87ba]", ring: "border-[#229ED9]/35" };
  const Glyph = tone === "discord" ? DiscordIcon : TelegramIcon;
  const external = href.startsWith("http");

  return (
    <div className={`rounded-md border bg-ink-850/70 p-4 ${brand.ring}`}>
      <div className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${brand.bg}`}
        >
          <Glyph className="h-6 w-6 text-white" />
        </span>
        <div>
          <h3 className="text-[14.5px] font-bold tracking-[0.04em]">{title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/55">{body}</p>
        </div>
      </div>

      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-sm px-4 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors ${brand.bg} ${brand.hover}`}
      >
        {cta}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

/* ── Closing band ───────────────────────────────────────────────── */

function ClosingBand() {
  const pillars = [
    { Icon: RocketIcon, a: "Master the markets", b: "with the 3ZS edge" },
    { Icon: MoneyIcon, a: "Build financial", b: "freedom and self worth" },
    { Icon: TargetIcon, a: "Live your purpose", b: "and make an impact" },
  ];

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="reveal relative overflow-hidden rounded-lg border border-brand-600/45 bg-ink-900/80 p-8 lg:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-brand-700/18 blur-[90px]"
        />

        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <h2 className="text-[clamp(1.6rem,2.8vw,2.05rem)] font-extrabold leading-[1.02]">
              This is your time.
              <br />
              <Accent>Join the frequency.</Accent>
            </h2>
            <svg
              viewBox="0 0 240 32"
              className="mt-4 h-8 w-full max-w-[240px]"
              aria-hidden="true"
            >
              <polyline
                points="0,16 24,16 36,4 48,28 60,10 72,22 84,2 96,30 108,12 120,20 132,8 144,24 156,14 168,18 240,16"
                fill="none"
                stroke="var(--color-brand-600)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 lg:col-span-5">
            {pillars.map(({ Icon: I, a, b }) => (
              <div key={a} className="text-center">
                <I className="mx-auto h-10 w-10 text-brand-500" />
                <p className="mt-3 font-display text-[13.5px] font-semibold uppercase leading-snug tracking-[0.12em] text-white/85">
                  {a}
                  <br />
                  <span className="text-white/55">{b}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-4 lg:col-span-3 lg:items-end">
            <CTA size="lg" className="w-full justify-center lg:w-auto" />
            <Fineprint />
            <Link
              href="/3zs-strategy"
              className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
            >
              See how the 3ZS strategy works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
