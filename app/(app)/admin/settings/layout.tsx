import Link from "next/link";

import { requireAdmin } from "@/lib/dal";

const TABS = [
  { href: "/admin/settings/payments", label: "Payments" },
  { href: "/admin/settings/pricing", label: "Pricing" },
  { href: "/admin/settings/affiliates", label: "Affiliates" },
  { href: "/admin/communications-test", label: "Communications Test" },
];

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <nav className="flex gap-1 border-b border-white/8">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="-mb-px border-b-2 border-transparent px-4 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/55 transition-colors hover:border-white/20 hover:text-white"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
