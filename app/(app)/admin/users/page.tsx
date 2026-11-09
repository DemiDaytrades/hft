import type { Metadata } from "next";

import MemberTable from "@/components/admin/MemberTable";
import MemberSearch from "@/components/admin/MemberSearch";
import InviteUserForm from "@/components/admin/InviteUserForm";
import { requireAdmin } from "@/lib/dal";
import { listMembers } from "@/lib/members";

export const metadata: Metadata = {
  title: "Members",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; view?: string }>;
}) {
  const admin = await requireAdmin();
  const { q = "", page = "1", view = "active" } = await searchParams;

  const result = await listMembers({
    lifecycle: view === "former" ? "former" : "active",
    roleFilter: view === "staff" ? "staff" : "students",
    search: q,
    page: Number.parseInt(page, 10) || 1,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
            {view === "former" ? "Former / Inactive Students" : view === "staff" ? "Active Staff" : "Active Students"}
          </h1>
          <p className="mt-1 text-[14px] text-white/45">
            {result.total.toLocaleString()}{" "}
            {result.total === 1 ? "member" : "members"}
            {q && ` matching “${q}”`}
          </p>
        </div>
        <MemberSearch initialQuery={q} />
      </div>

      <nav aria-label="Member lifecycle filters" className="flex flex-wrap gap-4 text-sm text-brand-300"><a href="/admin/users" aria-current={view === "active" ? "page" : undefined}>Active Students</a><a href="/admin/users?view=former" aria-current={view === "former" ? "page" : undefined}>Former / Inactive Students</a><a href="/admin/users?view=staff" aria-current={view === "staff" ? "page" : undefined}>Active Staff</a></nav>

      <section className="rounded-lg border border-white/8 bg-ink-900/80 p-6">
        <h2 className="mb-4 font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/80">
          Invite someone
        </h2>
        <InviteUserForm />
      </section>

      <MemberTable
        members={result.members}
        currentAdminId={admin.id}
        page={result.page}
        pageCount={result.pageCount}
        query={q}
        view={view}
      />
    </div>
  );
}
