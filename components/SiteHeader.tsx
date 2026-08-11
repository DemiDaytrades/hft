"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { CTA } from "./ui";
import { nav } from "@/lib/site";

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

  // Close the drawer on navigation and lock scroll while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Anchor links (e.g. "/#community") are never highlighted — otherwise
  // every on-page section link would light up alongside "Home".
  const isActive = (href: string) =>
    !href.includes("#") && pathname === href;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/8 bg-ink-950/92 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-ink-950 to-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link href="/" className="py-2" aria-label="High Frequency Talent — home">
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative font-display text-[14px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                isActive(item.href)
                  ? "text-brand-500"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-brand-600" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CTA variant="outline" size="sm" className="hidden sm:inline-flex" />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-sm border border-white/15 text-white transition-colors hover:border-brand-600/70 xl:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  open ? "top-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  open ? "top-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-t border-white/8 bg-ink-950/98 backdrop-blur-xl transition-[max-height] duration-400 xl:hidden ${
          open ? "max-h-[32rem]" : "max-h-0 border-t-transparent"
        }`}
      >
        <nav className="container-page flex flex-col py-4">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="border-b border-white/6 py-4 font-display text-[16px] font-semibold uppercase tracking-[0.16em] text-white/85 transition-colors hover:text-brand-500"
            >
              {item.label}
            </Link>
          ))}
          <CTA size="md" className="mt-6 mb-2 w-full" />
        </nav>
      </div>
    </header>
  );
}
