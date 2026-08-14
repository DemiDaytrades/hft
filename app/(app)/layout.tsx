import Link from "next/link";

import Logo from "@/components/Logo";
import SignOutButton from "@/components/SignOutButton";
import { requireUser } from "@/lib/dal";
import { ROLES } from "@/lib/auth";
import { getAffiliateByUserId } from "@/lib/affiliates";

// Every page under this shell is per-session, so there is nothing to prerender
// and no Cloudflare bindings exist at build time.
export const dynamic = "force-dynamic";

/**
 * Shell for every signed-in area. `requireUser()` runs here so an unauthenticated
 * request never renders a child page, but each page re-asserts its own
 * requirement (layouts do not re-run on every child navigation).
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const isAdmin = user.role === ROLES.admin;

  // Only surfaced to people who actually are affiliates -- an empty tab would
  // just prompt "what's this?" questions.
  const affiliate = await getAffiliateByUserId(user.id);

  const links = [
    ...(isAdmin
      ? [
          { href: "/admin", label: "Overview" },
          { href: "/admin/users", label: "Members" },
          { href: "/admin/affiliates", label: "Affiliates" },
          { href: "/admin/settings/payments", label: "Settings" },
        ]
      : [{ href: "/dashboard", label: "Dashboard" }]),
    ...(affiliate ? [{ href: "/affiliate", label: "Affiliate" }] : []),
    { href: "/account", label: "Account" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/8 bg-ink-900/80 backdrop-blur-xl">
        {/* h-20 to match the marketing header, so the seal has the same room
            in both and the two bars line up visually. */}
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link href={isAdmin ? "/admin" : "/dashboard"} aria-label="HFT home">
              <Logo />
            </Link>
            <nav className="flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-sm px-3 py-2 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-[13px] text-white/45 sm:inline">
              {user.email}
            </span>
            {isAdmin && (
              <span className="rounded-sm border border-brand-600/60 px-2 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-500">
                Admin
              </span>
            )}
            <SignOutButton />
          </div>
        </div>
      </header>

      <main id="main" className="container-page flex-1 py-10">
        {children}
      </main>
    </div>
  );
}
