import { requireAdmin } from "@/lib/dal";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

export default async function StudentReviewDetailPage({ params }: { params: Promise<{ studentId: string }> }) {
  await requireAdmin();
  const { studentId } = await params;
  const db = (await getCloudflareContext()).env.DB;
  
  const user = await db.prepare(`SELECT * FROM "user" WHERE id = ?;`).bind(studentId).first<any>();
  const quizAttempts = await db.prepare(`SELECT * FROM "student_quiz_attempt" WHERE user_id = ? ORDER BY quiz_id, attempt_number ASC;`).bind(studentId).all<any>();
  const assignments = await db.prepare(`SELECT * FROM "student_assignment_submission" WHERE user_id = ? ORDER BY assignment_id, attempt_number ASC;`).bind(studentId).all<any>();
  
  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 via-ink-950 to-black">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
        <div className="relative p-6 sm:p-8">
          <a href="/admin/academy/review" className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40">← Back to Review Center</a>
          <h1 className="mt-2 font-display text-[34px] font-bold uppercase tracking-[0.03em] text-white">{user?.name || user?.email}</h1>
          <p className="mt-2 text-[14px] text-white/60">Student Educational Record (Admin/Instructor)</p>
        </div>
      </header>

      <section className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950">
        <div className="border-b border-white/8 p-6">
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Quiz Attempts & Weak Topics</p>
        </div>
        <div className="divide-y divide-white/5">
          {(quizAttempts.results || []).map((a: any) => (
            <div key={a.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-white">Attempt {a.attempt_number} • Score {a.score_percent}% • {a.passed ? "Passed" : "Failed"}</p>
                  <p className="text-[12px] text-white/50">Status: {a.status} {a.instructor_review_required ? "• Instructor Review Required" : ""} {a.instructor_authorized_additional ? "• Additional Authorized" : ""}</p>
                </div>
                {a.instructor_review_required && a.instructor_authorized_additional !== 1 && (
                  <form action={async () => {
                    "use server";
                    const { requireAdmin } = await import("@/lib/dal");
                    const admin = await requireAdmin();
                    const { authorizeAdditionalQuizAttempt } = await import("@/lib/academy");
                    await authorizeAdditionalQuizAttempt(admin.id, studentId, a.quiz_id);
                  }}>
                    <button className="rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 font-display text-[10px] uppercase tracking-[0.24em] text-white">Authorize One Additional Attempt</button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950">
        <div className="border-b border-white/8 p-6">
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Assignments / Homework / Chart Demos (Full History)</p>
        </div>
        <div className="divide-y divide-white/5">
          {(assignments.results || []).map((s: any) => (
            <div key={s.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-white">Submission Rev {s.attempt_number} • {s.status}</p>
                  <p className="text-[12px] text-white/50">{s.submitted_at ? `Submitted: ${s.submitted_at}` : ""} {s.revision_of_id ? `• Revision of ${s.revision_of_id}` : ""}</p>
                </div>
              </div>
              {s.response_text && <div className="rounded-sm border border-white/10 bg-black/40 p-3 text-[13px] text-white/70 whitespace-pre-wrap">{s.response_text}</div>}
              {s.file_urls && s.file_urls !== '[]' && (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">Submitted Files/Charts</p>
                  <div className="text-[12px] text-white/60">Files attached (viewable via secure endpoint)</div>
                </div>
              )}
              <div className="flex gap-2">
                <form action={async (formData: FormData) => {
                  "use server";
                  const { requireAdmin } = await import("@/lib/dal");
                  const admin = await requireAdmin();
                  const { reviewAssignment } = await import("@/lib/academy");
                  const feedback = formData.get("feedback") as string;
                  await reviewAssignment(s.id, admin.id, "approve", feedback || "");
                }}>
                  <input name="feedback" placeholder="Feedback (optional)" className="mr-2 rounded-sm border border-white/12 bg-black/40 px-3 py-1.5 text-[12px] text-white" />
                  <button className="rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.24em] text-white">Approve</button>
                </form>
                <form action={async (formData: FormData) => {
                  "use server";
                  const { requireAdmin } = await import("@/lib/dal");
                  const admin = await requireAdmin();
                  const { reviewAssignment } = await import("@/lib/academy");
                  const feedback = formData.get("feedback2") as string;
                  await reviewAssignment(s.id, admin.id, "request_revision", feedback || "Please revise with additional details.");
                }}>
                  <input name="feedback2" placeholder="Revision feedback" className="mr-2 rounded-sm border border-white/12 bg-black/40 px-3 py-1.5 text-[12px] text-white" />
                  <button className="rounded-sm border border-white/12 px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.24em] text-white/70">Request Revision</button>
                </form>
              </div>
              {s.instructor_feedback && <div className="rounded-sm border border-white/10 p-3"><p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Instructor Feedback</p><p className="mt-1 text-[13px] text-white/70 whitespace-pre-wrap">{s.instructor_feedback}</p></div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
