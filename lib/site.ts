/**
 * Single source of truth for copy, links and pricing.
 * Swap the env vars in .env.local (see .env.local.example) to point the
 * CTAs at the real Stripe Payment Link and community invites.
 */

export const site = {
  name: "High Frequency Talent",
  shortName: "HFT",
  legalName: "High Frequency Talent LLC",
  tagline: "Discipline. Purpose. Freedom.",
  strapline: "Elevate your frequency. Elevate your life.",
  founder: "Demi Monroe",
  email: "hello@highfrequencytalent.com",
} as const;

/**
 * Where every "Join the Frequency" button sends people.
 *
 * Deliberately NOT overridable by env any more. It used to fall back to a
 * Stripe Payment Link, but /join is now a real checkout that carries the
 * referral code, creates the account and links the Stripe customer. A raw
 * Payment Link would skip all of that -- affiliates would silently stop being
 * credited and buyers would end up paying with no account.
 *
 * It also used to default to "#membership", which did nothing at all on any
 * page that lacks that anchor (i.e. everywhere except the homepage).
 */
export const checkoutUrl = "/join";

/**
 * Real invite links. Kept as the default rather than env-only so the site works
 * from a clean checkout with nothing configured; the env var still wins if the
 * invites ever need swapping without a code change.
 */
export const discordUrl =
  process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/ArywJ9UQ4";

export const telegramUrl =
  process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/+UA9EZye4vloxNTAx";

export const membership = {
  price: 150,
  currency: "$",
  interval: "month",
  headline: "Unlock your potential.",
  subhead: "Join the movement.",
  fineprint: "Cancel Anytime. No Long-Term Contracts.",
  includes: [
    "3ZS Strategy Mastery",
    "Live Trade Alerts",
    "Daily Market Analysis",
    "Weekly Live Sessions",
    "Private Discord Community",
    "Telegram Signal Channel",
    "Trade Journal & Resources",
    "Education & Mindset Training",
    "Community of Winners",
  ],
} as const;

/** Full link set. Used by the footer, where there is room for everything. */
export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "3ZS Strategy", href: "/3zs-strategy" },
  { label: "For Creators", href: "/about#creators" },
  { label: "Community", href: "/#community" },
  { label: "Contact", href: "/#contact" },
] as const;

/**
 * Header split.
 *
 * `primaryNav` is real destinations only -- the two pages someone cannot reach
 * by scrolling. Everything else is a jump to a section they are usually already
 * looking at, so it lives in the menu rather than eating space in the top bar.
 * "Home" is omitted because the logo already does that job.
 */
export const primaryNav = [
  { label: "About", href: "/about" },
  { label: "3ZS Strategy", href: "/3zs-strategy" },
] as const;

/** On-page jumps, surfaced in the menu overlay. */
export const sectionNav = [
  { label: "For Creators", href: "/about#creators" },
  { label: "Community", href: "/#community" },
  { label: "Contact", href: "/#contact" },
] as const;

export type IconName =
  | "bell"
  | "chart"
  | "video"
  | "discord"
  | "telegram"
  | "target"
  | "journal";

export const features: {
  icon: IconName;
  title: string;
  body: string;
}[] = [
  {
    icon: "bell",
    title: "Live Trade Alerts",
    body: "Real-time high-probability setups based on the 3ZS strategy. Know exactly where we're watching and when we're in.",
  },
  {
    icon: "chart",
    title: "Daily Market Analysis",
    body: "Every morning we break down NAS100 and key markets so you start the day with clarity and confidence.",
  },
  {
    icon: "video",
    title: "Weekly Live Sessions",
    body: "Live trading, strategy breakdowns, and Q&A sessions to help you level up faster.",
  },
  {
    icon: "discord",
    title: "Private Discord",
    body: "Connect with a community of disciplined traders and creators. Share ideas, get feedback, and grow together every day.",
  },
  {
    icon: "telegram",
    title: "Telegram Signals",
    body: "Instant trade alerts and important updates delivered directly to your phone. Never miss a high-probability opportunity.",
  },
  {
    icon: "target",
    title: "3ZS Strategy Training",
    body: "Step-by-step training on our proven 3ZS framework. Master the zones. Master the market.",
  },
  {
    icon: "journal",
    title: "Trade Journal",
    body: "Track every trade. Review your performance. Build consistency and long-term profitability.",
  },
];

export const becomeList = [
  "A more disciplined and consistent trader",
  "Confident in your entries and exits",
  "In control of your emotions",
  "Focused on long-term growth",
  "Financially free to live on your terms",
  "A positive impact on the people around you",
];

export const testimonials = [
  {
    quote:
      "HFT changed the way I see the market and myself. The 3ZS strategy finally made everything click. I'm more consistent and more confident than ever.",
    name: "Jaylen R.",
    role: "HFT Member",
    tenure: "8 Months",
  },
  {
    quote:
      "The community is different. Everyone is locked in and wants to win. The support, the education, the mindset — it's everything I needed to level up.",
    name: "Ariana M.",
    role: "HFT Member",
    tenure: "5 Months",
  },
  {
    quote:
      "I went from guessing trades to executing a plan. HFT gave me the tools, structure, and discipline to finally see results.",
    name: "David L.",
    role: "HFT Member",
    tenure: "6 Months",
  },
];

export const closingPillars = [
  {
    icon: "rocket" as const,
    title: "Master the markets",
    body: "with the 3ZS edge",
  },
  {
    icon: "money" as const,
    title: "Build financial",
    body: "freedom and self worth",
  },
  {
    icon: "target" as const,
    title: "Live your purpose",
    body: "and make an impact",
  },
];

/* ── About page ─────────────────────────────────────────────────── */

export const purposePillars = [
  { icon: "target" as const, label: "Discover your purpose" },
  { icon: "heart" as const, label: "Build self worth" },
  { icon: "chart" as const, label: "Create financial freedom" },
  { icon: "users" as const, label: "Help those around you win" },
];

export const frequencyList = [
  {
    title: "Higher Mindset",
    body: "Elevate your thoughts, eliminate doubt, and focus on growth.",
  },
  {
    title: "Higher Discipline",
    body: "Consistent actions create confidence and long-term results.",
  },
  {
    title: "Higher Standards",
    body: "Raise the standard in how you trade, create, and live.",
  },
  {
    title: "Higher Impact",
    body: "When you win, you uplift others and leave a legacy.",
  },
];

export const creatorPillars = [
  { icon: "music" as const, title: "Fund your dreams" },
  { icon: "clock" as const, title: "Buy back your time" },
  { icon: "wave" as const, title: "Create without limits" },
  { icon: "crown" as const, title: "Build your legacy" },
];

export const values = [
  {
    icon: "target" as const,
    title: "Focus",
    body: "We focus on what matters most: price, probability, and execution.",
  },
  {
    icon: "chart" as const,
    title: "Discipline",
    body: "We execute the plan, manage risk, and stay consistent every day.",
  },
  {
    icon: "users" as const,
    title: "Community",
    body: "We grow together. We support, uplift, and celebrate each other's wins.",
  },
  {
    icon: "diamond" as const,
    title: "Integrity",
    body: "We lead with honesty, transparency, and high standards in everything we do.",
  },
  {
    icon: "crown" as const,
    title: "Freedom",
    body: "We trade for freedom. Time freedom. Financial freedom. Life freedom.",
  },
];

/* ── 3ZS page ───────────────────────────────────────────────────── */

export const zones = [
  {
    n: 1,
    name: "Sell Zone",
    sub: "Premium Zone",
    tone: "sell" as const,
    lead: "This is the premium zone where price is likely to react down.",
    points: [
      "Institutions look to sell here",
      "Look for rejection signals",
      "Short opportunities",
      "Tight risk. High reward",
    ],
  },
  {
    n: 2,
    name: "Consolidation (Conference) Zone",
    sub: "Battle Zone",
    tone: "hold" as const,
    lead: "This is the conference zone where the market takes a breath.",
    points: [
      "Price moves sideways",
      "Liquidity is built",
      "Institutions accumulate",
      "Wait for the breakout",
      "Patience creates profits",
    ],
  },
  {
    n: 3,
    name: "Buy Zone",
    sub: "Discount Zone",
    tone: "buy" as const,
    lead: "This is the discount zone where price is likely to react up.",
    points: [
      "Institutions look to buy here",
      "Look for bullish confirmations",
      "Long opportunities",
      "Tight risk. High reward",
    ],
  },
];

export const howItWorks = [
  {
    title: "Identify the zones",
    body: "Mark the key levels on the chart (Sell Zone, Conference Zone, Buy Zone).",
  },
  {
    title: "Wait for price to enter a zone",
    body: "Let price come to you. Don't chase. Wait for high-probability setups.",
  },
  {
    title: "Look for confirmation",
    body: "Use price action, candlestick patterns, and market structure for confirmation.",
  },
  {
    title: "Execute & manage risk",
    body: "Enter the trade, set your stop, and manage the position with a plan.",
  },
  {
    title: "Repeat & improve",
    body: "Review your journal. Refine your execution. Get 1% better every day.",
  },
];

export const whyItWorks = [
  "Aligns with institutional order flow",
  "Keeps you on the right side of the market",
  "Eliminates guesswork and overtrading",
  "Works in all markets and timeframes",
  "Built for consistency, not luck",
];

export const keyRules = [
  "Never enter without confirmation",
  "Always respect your stop loss",
  "Risk 1% or less per trade",
  "Let winners run. Cut losers short.",
  "Trade the zones, not the news",
];

export const commonMistakes = [
  "Trading outside of the zones",
  "Entering without confirmation",
  "Moving stop loss out of fear",
  "Overtrading & revenge trading",
  "Trying to predict instead of react",
];

export const edgeTraits = [
  { icon: "target" as const, title: "Simple", body: "Easy to learn. Powerful to master." },
  { icon: "chart" as const, title: "Repeatable", body: "Same strategy. Different markets." },
  { icon: "shield" as const, title: "Consistent", body: "High-probability setups every day." },
  { icon: "bolt" as const, title: "Freedom", body: "Build wealth. Live your purpose." },
];
