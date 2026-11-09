import Link from "next/link";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { instructorStudents } from "@/lib/academy/instructor/service";
import StudentSelector from "@/components/academy/instructor/StudentSelector";
import { requireAdmin } from "@/lib/dal";
import ReviewWorkspace from "@/components/financial-plan/ReviewWorkspace";

export const dynamic = "force-dynamic";

export default async function FinancialReviewPage({ searchParams }: { searchParams: Promise<{ studentId?: string }> }) {
  const instructor = await requireAdmin();
  const { studentId } = await searchParams;
  const students = await instructorStudents(getCloudflareContext().env.DB, instructor.id);

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-4 sm:p-8">
      <Link href="/admin" className="text-sm text-brand-300">← Administration</Link>
      <header>
        <p className="text-xs uppercase tracking-widest text-brand-400">Instructor workflow</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Financial / Trading Readiness Plans</h1>
      </header>
      <StudentSelector students={students} selected={studentId} action="/admin/financial-plan" label="Student financial readiness review" buttonLabel="Open student plans" />
      {studentId && <ReviewWorkspace key={studentId} studentId={studentId} />}
    </main>
  );
}
