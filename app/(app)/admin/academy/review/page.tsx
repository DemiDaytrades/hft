import { requireAdmin } from "@/lib/dal";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { reviewLink } from "@/lib/academy/learning/review-link";

export const dynamic = "force-dynamic";

export default async function AcademyReviewCenterPage() {
  await requireAdmin();
  const db = (await getCloudflareContext()).env.DB;
  
  const quizAttempts = await db.prepare(`SELECT a.*, CASE WHEN a.learning_version IS NOT NULL THEN q.lesson_id END AS learning_lesson_id FROM student_quiz_attempt a LEFT JOIN academy_quiz q ON q.id=a.quiz_id WHERE a.instructor_review_required = 1 OR a.status = 'instructor_review_required' ORDER BY a.started_at DESC LIMIT 50;`).all<any>();
  const assignments = await db.prepare(`SELECT s.*, CASE WHEN s.learning_attempt_id IS NOT NULL THEN a.lesson_id END AS learning_lesson_id FROM student_assignment_submission s LEFT JOIN academy_assignment a ON a.id=s.assignment_id WHERE s.status IN ('submitted','under_review','revision_required') ORDER BY s.submitted_at DESC NULLS LAST LIMIT 50;`).all<any>();
  
  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 via-ink-950 to-black">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
        <div className="relative p-6 sm:p-8">
          <p className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40">Admin / Instructor</p>
          <h1 className="mt-2 font-display text-[34px] font-bold uppercase tracking-[0.03em] text-white sm:text-[44px]">Academy Review Center</h1>
          <p className="mt-2 text-[14px] text-white/60">Review quizzes, homework, chart demonstrations, and checkpoints</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950">
          <div className="border-b border-white/8 p-6">
            <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Awaiting Review - Quizzes</p>
            <h2 className="mt-2 font-display text-[20px] font-bold uppercase tracking-[0.03em] text-white">Knowledge Checks Requiring Review</h2>
          </div>
          <div className="divide-y divide-white/5">
            {(quizAttempts.results || []).map((a: any) => (
              <div key={a.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-[14px] text-white">Attempt {a.attempt_number} • {a.score_percent === null ? "Score pending review" : `Score ${a.score_percent}%`}</p>
                  <p className="text-[12px] text-white/50">Status: {a.status}</p>
                </div>
                <a href={reviewLink(a)} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[10px] uppercase tracking-[0.24em] text-white/70">Review</a>
              </div>
            ))}
            {(quizAttempts.results || []).length === 0 && <div className="p-6 text-center text-white/40">None</div>}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950">
          <div className="border-b border-white/8 p-6">
            <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Awaiting Review - Assignments</p>
            <h2 className="mt-2 font-display text-[20px] font-bold uppercase tracking-[0.03em] text-white">Homework & Chart Demos</h2>
          </div>
          <div className="divide-y divide-white/5">
            {(assignments.results || []).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-[14px] text-white">Assignment Submission</p>
                  <p className="text-[12px] text-white/50">Status: {s.status} • Rev {s.attempt_number}</p>
                </div>
                <a href={reviewLink(s)} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[10px] uppercase tracking-[0.24em] text-white/70">Review</a>
              </div>
            ))}
            {(assignments.results || []).length === 0 && <div className="p-6 text-center text-white/40">None</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
