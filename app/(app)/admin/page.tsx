import type { Metadata } from "next";
import Link from "next/link";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { TeachingDashboardCard } from "@/components/teaching/DashboardCard";
import { teachingSnapshot } from "@/lib/teaching/service";

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
  const instructor = await requireAdmin();

  const [stats, recent, setup] = await Promise.all([
    getMemberStats(),
    getRecentMembers(8),
    getSetupStatus(),
  ]);

  const teachingOwner = await getCloudflareContext().env.DB.prepare("SELECT instructor_id FROM teaching_config WHERE id='primary'").first<{ instructor_id: string }>();
  const teaching = !teachingOwner || teachingOwner.instructor_id === instructor.id ? await teachingSnapshot(getCloudflareContext().env.DB, instructor.id) : null;

  const tiles = [
    { label: "Total members", value: stats.total },
    { label: "Students", value: stats.students },
    { label: "Admins", value: stats.admins },
    { label: "Banned", value: stats.banned },
    { label: "New this week", value: stats.newThisWeek },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
            Overview
          </h1>
          <p className="mt-1 text-[14px] text-white/45">
            Membership at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/teaching" className="rounded-sm border border-brand-600/40 px-4 py-2 text-sm text-brand-500">Teaching: calendar and pending requests</Link>
          <Link href="/admin/financial-plan" className="rounded-sm border border-white/12 px-4 py-2 text-sm text-white/70 hover:text-white">Financial Readiness Plans</Link>
          <Link
            href="/admin/student-intake-v2"
            className="rounded-sm border border-brand-600/40 px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-500 transition-colors hover:text-brand-400"
          >
            Student Assessment &amp; Consultation
          </Link>
          <Link
            href="/admin/communications-test"
            className="rounded-sm border border-white/12 px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
          >
            Communications Test
          </Link>
        </div>
      </div>

      {teaching && <TeachingDashboardCard admin sessions={teaching.sessions as any} timezone={teaching.config?.timezone ?? "America/Chicago"} />}

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
