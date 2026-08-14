import type { ReactNode } from "react";
import { ArrowRight, LockIcon } from "./icons";
import { checkoutUrl, membership } from "@/lib/site";

/* ── CTA ────────────────────────────────────────────────────────── */

type CTAProps = {
  children?: ReactNode;
  href?: string;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const ctaSizes = {
  sm: "px-5 py-2.5 text-[13px] tracking-[0.14em]",
  md: "px-7 py-3.5 text-[15px] tracking-[0.14em]",
  lg: "px-9 py-4.5 text-[17px] tracking-[0.12em]",
};

/**
 * Primary conversion button. Defaults to `checkoutUrl` (/join), which runs the
 * real checkout: referral attribution, Stripe customer, then account creation.
 */
export function CTA({
  children = "Join the Frequency",
  href = checkoutUrl,
  variant = "solid",
  size = "md",
  className = "",
}: CTAProps) {
  const external = href.startsWith("http");
  const styles =
    variant === "solid"
      ? "bg-brand-600 text-white shadow-[0_0_0_0_rgba(227,69,9,0.6)] hover:bg-brand-500 hover:shadow-[0_10px_40px_-8px_rgba(227,69,9,0.75)]"
      : variant === "outline"
        ? "border border-brand-600/70 text-white hover:border-brand-500 hover:bg-brand-600/12"
        : "border border-white/15 text-white hover:border-white/35 hover:bg-white/5";

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-sm font-display font-semibold uppercase transition-all duration-300 ${ctaSizes[size]} ${styles} ${className}`}
    >
      {children}
      <ArrowRight className="h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

/** "Cancel anytime" reassurance line that sits under the CTAs. */
export function Fineprint({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-center gap-2 text-[12.5px] text-white/45 ${className}`}
    >
      <LockIcon className="h-3.5 w-3.5" />
      {membership.fineprint}
    </p>
  );
}

/* ── Type ───────────────────────────────────────────────────────── */

export function Eyebrow({
  children,
  className = "",
  rule = false,
}: {
  children: ReactNode;
  className?: string;
  rule?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-4 font-display text-[13px] font-semibold uppercase tracking-[0.28em] text-brand-500 ${className}`}
    >
      {children}
      {rule && <span className="h-px w-16 bg-brand-700/80" />}
    </p>
  );
}

/** Section heading with the mockup's white-line / orange-line pairing. */
export function SectionTitle({
  children,
  align = "center",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <h2
      className={`text-[clamp(1.6rem,3.4vw,2.5rem)] font-bold ${
        align === "center" ? "text-center" : ""
      } ${className}`}
    >
      {children}
    </h2>
  );
}

/** Centered heading flanked by hairlines, as used across the mockups. */
export function RuledTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <span className="h-px flex-1 rule-brand" />
      <h2 className="text-center text-[clamp(1.5rem,3vw,2.15rem)] font-bold tracking-[0.02em]">
        {children}
      </h2>
      <span className="h-px flex-1 rule-brand" />
    </div>
  );
}

export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-brand-500">{children}</span>;
}

/* ── Surfaces ───────────────────────────────────────────────────── */

export function Panel({
  children,
  className = "",
  glow = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`relative rounded-lg border bg-ink-900/80 ${
        glow
          ? "border-brand-600/55 shadow-[0_0_60px_-25px_rgba(227,69,9,0.85)]"
          : "border-white/8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Thin gradient divider between full-width sections. */
export function Divider() {
  return <div className="h-px w-full rule-brand" />;
}
