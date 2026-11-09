import { TeachingDashboardCard } from "@/components/teaching/DashboardCard";
import { teachingSnapshot } from "@/lib/teaching/service";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireActiveMember, requireUser } from "@/lib/dal";
import { ROLES } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Student area -- currently a placeholder. This is also the post-login landing
 * spot for everyone, so staff get forwarded to /admin from here; that keeps the
 * role decision on the server rather than in the login form.
 *
 * Members provisioned with a temporary password (must_change_password = 1) are
 * redirected to /account/change-password before they can see the dashboard.
 */
export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role === ROLES.admin) redirect("/admin");

  // Members with a temporary password must set a permanent one first.
  const dbUser = await getCloudflareContext()
    .env.DB.prepare(
      `SELECT "must_change_password" FROM "user" WHERE id = ?;`,
    )
    .bind(user.id)
    .first<{ must_change_password: number }>();

  if (dbUser?.must_change_password === 1) {
    redirect("/account/change-password");
  }

  // Members without a live subscription get sent to /join rather than seeing
  // an empty dashboard.
  await requireActiveMember();

  const teaching = await teachingSnapshot(getCloudflareContext().env.DB, user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
          Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-[14px] text-white/45">
          Your training, alerts and community access will appear here.
        </p>
      </div>

      <TeachingDashboardCard sessions={teaching.sessions as any} timezone={teaching.config?.timezone ?? "America/Chicago"} />

      <div className="rounded-lg border border-white/8 bg-ink-900/80 px-6 py-16 text-center">
        <p className="text-[15px] text-white/50">
          The student area is being built out next.
        </p>
      </div>
    </div>
  );
}
