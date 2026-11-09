"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { CTA } from "./ui";
import { DiscordIcon, TelegramIcon } from "./icons";
import {
  discordUrl,
  primaryNav,
  sectionNav,
  site,
  telegramUrl,
} from "@/lib/site";

/**
 * Top bar carries only real destinations: the two pages you cannot reach by
 * scrolling. Section jumps ("Community", "Contact") are already on screen when
 * they matter, so they live in the menu overlay instead of competing with the
 * logo and the CTA.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the overlay -- expected of anything that covers the page.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && pathname === href;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/8 bg-ink-950/85 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-ink-950 to-transparent"
        }`}
      >
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label={`${site.name} — home`} className="shrink-0">
            <Logo size="sm" />
          </Link>

          {/* Segmented pill rather than a row of loose white labels: the group
              reads as one control, and the active page is a filled chip instead
              of a detached underline. */}
          <nav className="hidden lg:block" aria-label="Primary">
            <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md">
              {primaryNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-full px-5 py-2 font-display text-[12.5px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 ${
                        active
                          ? "bg-brand-600/18 text-brand-400 shadow-[inset_0_0_0_1px_rgba(227,69,9,0.35)]"
                          : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Always visible, including on phones. Hiding this behind the
                menu meant existing members had no way to sign in without
                discovering the overlay first. */}
            <Link
              href="/login"
              className="whitespace-nowrap rounded-full px-2 py-2 font-display text-[12.5px] font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white sm:px-4 sm:tracking-[0.18em]"
            >
              Log in
            </Link>

            {/* Short label on purpose: the hero already says "Join the
                Frequency" in full, and two identical buttons in one screen
                reads as repetition rather than emphasis.
                Visible on phones too -- this is the conversion button, and it
                was previously hidden behind the menu on the screens where most
                traffic actually lands. */}
            <CTA
              variant="solid"
              size="sm"
              className="!rounded-full !px-4 sm:!px-5"
            >
              Join
            </CTA>

            <Link
              href="/book"
              className="hidden whitespace-nowrap rounded-full bg-brand-600 px-4 py-2 font-display text-[12.5px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-500 sm:inline-block"
            >
              Book Demi
            </Link>

            <MenuToggle open={open} onToggle={() => setOpen((v) => !v)} />
          </div>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} isActive={isActive} />
    </>
  );
}

/** Two rules that cross into an X. Quieter than a 3-bar hamburger and it reads
 *  as a control rather than an icon. */
function MenuToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="group relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white transition-colors hover:border-brand-600/60 hover:bg-brand-600/10"
    >
      <span className="relative block h-3 w-5">
        <span
          className={`absolute left-0 block h-px w-5 bg-current transition-all duration-300 ${
            open ? "top-1/2 rotate-45" : "top-0"
          }`}
        />
        <span
          className={`absolute left-0 block h-px w-5 bg-current transition-all duration-300 ${
            open ? "top-1/2 -rotate-45" : "bottom-0"
          }`}
        />
      </span>
    </button>
  );
}

function MenuOverlay({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  return (
    <div
      // Kept mounted so it can transition; pointer-events guard stops it
      // swallowing clicks while hidden.
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink-950/95 backdrop-blur-2xl"
      />

      <div className="container-page relative flex h-full flex-col justify-center pt-24 pb-12">
        <nav aria-label="All pages">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-white/30">
            Explore
          </p>
          <ul className="mt-5 space-y-1">
            {[{ label: "Home", href: "/" }, ...primaryNav].map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                  className={`group flex items-baseline gap-4 py-2 font-display text-[clamp(2rem,6vw,3.5rem)] font-bold uppercase leading-[1.05] tracking-[-0.01em] transition-all duration-500 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  } ${isActive(item.href) ? "text-brand-500" : "text-white hover:text-brand-400"}`}
                >
                  <span className="font-body text-[12px] font-medium tracking-[0.2em] text-white/25">
                    0{i + 1}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-12 font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-white/30">
            Jump to
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {sectionNav.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  style={{ transitionDelay: open ? `${240 + i * 45}ms` : "0ms" }}
                  className={`block rounded-full border border-white/12 px-5 py-2.5 font-display text-[12.5px] font-semibold uppercase tracking-[0.18em] text-white/70 transition-all duration-500 hover:border-brand-600/60 hover:bg-brand-600/10 hover:text-white ${
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors hover:border-[#5865F2]/60 hover:text-white"
            >
              <DiscordIcon className="h-5 w-5" />
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors hover:border-[#229ED9]/60 hover:text-white"
            >
              <TelegramIcon className="h-5 w-5" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/login"
              onClick={onClose}
              className="font-display text-[13px] font-semibold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <CTA size="sm" className="!rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
