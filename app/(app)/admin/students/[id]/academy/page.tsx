import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { db, newId, nowIso } from "@/lib/academy";
import { getPlacement } from "@/lib/student-placement";
import { instructorPlacementStatus, learningPathStatus } from "@/lib/student-profile-summary";
import { redirect } from "next/navigation";
import { Panel } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function StudentAcademyPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const user = await db().prepare(`SELECT id, name, email FROM "user" WHERE id = ?;`).bind(id).first<any>();
  const placement = await getPlacement(id);
  const learningPath = await db()
    .prepare(
      `SELECT v.version, v.status, v.student_json, v.approved_at FROM learning_path_series s JOIN learning_path_version v ON v.id = s.current_version_id AND v.series_id = s.id WHERE s.student_id = ?;`
    )
    .bind(id)
    .first<any>();
  const { results: courses } = await db().prepare(`SELECT * FROM "academy_course" WHERE status = 'published' ORDER BY sort_order ASC;`).all<any>();
  const { results: assignments } = await db().prepare(`SELECT a.*, c.title FROM "student_course_assignment" a JOIN "academy_course" c ON c.id = a.course_id WHERE a.user_id = ?;`).bind(id).all<any>();

  const placementStatus = instructorPlacementStatus(learningPath, placement);
  const pathStatus = learningPathStatus(learningPath);

  async function assign(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const courseId = formData.get("course_id") as string;
    const existing = await db().prepare(`SELECT id FROM "student_course_assignment" WHERE user_id = ? AND course_id = ?;`).bind(id, courseId).first<any>();
    if (existing) redirect(`/admin/students/${id}/academy`);
    const now = nowIso();
    await db().prepare(`INSERT INTO "student_course_assignment" (id, user_id, course_id, assigned_by, status, assigned_at) VALUES (?, ?, ?, ?, 'assigned', ?);`).bind(newId(), id, courseId, admin.id, now).run();
    redirect(`/admin/students/${id}/academy`);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/admin/students/${id}`} className="text-white/60 hover:text-white text-sm">← Back to Student Profile</Link>
        <h1 className="mt-2 font-display text-[30px] font-bold uppercase tracking-[0.03em]">Academy Assignments</h1>
        <p className="mt-1 text-sm text-white/60">{user?.name ?? "Student"} • {user?.email}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/70">
          <span className="rounded border border-white/10 bg-ink-950/40 px-2.5 py-1">
            Learning Path: <strong className="text-white">{pathStatus.label}</strong>
          </span>
          <span className="rounded border border-white/10 bg-ink-950/40 px-2.5 py-1">
            Placement: <strong className="text-white">{placementStatus.label}</strong>
          </span>
          {placement?.instructorTrack && !learningPath?.approved_at && (
            <span className="text-amber-300/80">Historical placement only (current review pending)</span>
          )}
          <Link href={`/admin/learning-path?studentId=${encodeURIComponent(id)}`} className="text-brand-300 hover:text-brand-200">
            Review learning path →
          </Link>
        </div>
        <p className="mt-2 text-xs text-white/45">
          Course assignment provides access to course material and is separate from instructor placement approval.
        </p>
      </div>
      <Panel>
        <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em] mb-3">Assigned Courses</h2>
        <div className="space-y-2">
          {assignments.map((a: any) => (
            <div key={a.id} className="flex justify-between border-b border-white/5 pb-2">
              <p className="text-white">{a.title}</p>
              <p className="text-white/40 text-sm">{a.status}</p>
            </div>
          ))}
          {assignments.length === 0 && <p className="text-white/50">None</p>}
        </div>
      </Panel>
      <Panel>
        <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em] mb-3">Assign Published Course</h2>
        <form action={assign} className="flex gap-3">
          <select name="course_id" className="flex-1 rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white">
            {courses.map((c: any) => (
              <option key={c.id} value={c.id}>{c.title} ({c.track})</option>
            ))}
          </select>
          <button className="rounded-sm bg-brand-600 px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">Assign</button>
        </form>
      </Panel>
    </div>
  );
}
