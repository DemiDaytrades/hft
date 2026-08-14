import type { Metadata } from "next";
import Link from "next/link";

import SetupChecklist from "@/components/admin/SetupChecklist";
import { requireAdmin } from "@/lib/dal";
import { getSetupStatus } from "@/lib/setup-status";
import { getMemberStats, getRecentMembers } from "@/lib/members";

export const metadata: Metadata = {
  title: "Admin overview",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [stats, recent, setup] = await Promise.all([
    getMemberStats(),
    getRecentMembers(8),
    getSetupStatus(),
  ]);

  const tiles = [
    { label: "Total members", value: stats.total },
    { label: "Students", value: stats.students },
    { label: "Admins", value: stats.admins },
    { label: "Banned", value: stats.banned },
    { label: "New this week", value: stats.newThisWeek },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
          Overview
        </h1>
        <p className="mt-1 text-[14px] text-white/45">
          Membership at a glance.
        </p>
      </div>

      <SetupChecklist status={setup} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-lg border border-white/8 bg-ink-900/80 p-5"
          >
            <p className="font-display text-[34px] font-bold leading-none text-white">
              {tile.value.toLocaleString()}
            </p>
            <p className="mt-2 font-display text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/45">
              {tile.label}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-white/8 bg-ink-900/80">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <h2 className="font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/80">
            Newest members
          </h2>
          <Link
            href="/admin/users"
            className="font-display text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-500 hover:text-brand-400"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-6 py-10 text-center text-[14px] text-white/40">
            No members yet.
          </p>
        ) : (
          <ul className="divide-y divide-white/6">
            {recent.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-[15px] text-white">
                    {member.name || "—"}
                  </p>
                  <p className="truncate text-[13px] text-white/45">
                    {member.email}
                  </p>
                </div>
                <time
                  dateTime={new Date(member.createdAt).toISOString()}
                  className="shrink-0 text-[13px] text-white/40"
                >
                  {new Date(member.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
