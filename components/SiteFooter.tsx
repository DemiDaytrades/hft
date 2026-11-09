import Link from "next/link";
import Logo from "./Logo";
import { Divider } from "./ui";
import {
  InstagramIcon,
  TiktokIcon,
  XIcon,
  YoutubeIcon,
} from "./icons";
import { nav, site } from "@/lib/site";

const socials = [
  { label: "YouTube", href: "#", Icon: YoutubeIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "TikTok", href: "#", Icon: TiktokIcon },
  { label: "X", href: "#", Icon: XIcon },
];

export default function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-white/8 bg-ink-950">
      <div className="container-page py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Logo size="md" />
            <span className="hidden h-14 w-px bg-white/10 sm:block" />
            <p className="font-display text-[15px] font-semibold uppercase tracking-[0.2em] text-brand-500">
              {site.tagline}
            </p>
          </div>

          <p className="font-display text-[13.5px] uppercase tracking-[0.22em] text-white/55 xl:whitespace-nowrap">
            {site.strapline}
          </p>

          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-sm border border-white/12 text-white/70 transition-colors hover:border-brand-600/70 hover:text-brand-500"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="my-10">
          <Divider />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <nav className="flex flex-wrap gap-x-7 gap-y-3">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-brand-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/privacy"
              className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-brand-500"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-brand-500"
            >
              Terms & Conditions
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="text-[14px] text-white/60 transition-colors hover:text-brand-500"
            >
              {site.email}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/6 pt-8 text-[12.5px] leading-relaxed text-white/35 lg:flex-row lg:items-start lg:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="max-w-3xl lg:text-right">
            Trading involves substantial risk of loss and is not suitable for
            every investor. {site.shortName} provides educational content only
            and does not provide personalised financial advice. Past performance
            is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
