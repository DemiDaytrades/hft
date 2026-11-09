import { getCloudflareContext } from "@opennextjs/cloudflare";
import { instructorStudents } from "@/lib/academy/instructor/service";
import StudentSelector from "@/components/academy/instructor/StudentSelector";
import Review from "@/components/learning-path/Review";
import { requireAdmin } from "@/lib/dal";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: {
  searchParams: Promise<{
    studentId?: string;
  }>;
}) {
  const instructor = await requireAdmin();
  const { studentId } = await searchParams;
  const students = await instructorStudents(getCloudflareContext().env.DB, instructor.id);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Personalized learning paths</h1>
        <p className="text-sm text-white/60">Choose a student to review the instructor-approved learning path. Historical paths remain available for former students.</p>
      </header>
      <StudentSelector students={students} selected={studentId} action="/admin/learning-path" label="Student learning path" buttonLabel="Open learning path" />
      {studentId && <Review key={studentId} studentId={studentId} />}
    </main>
  );
}
