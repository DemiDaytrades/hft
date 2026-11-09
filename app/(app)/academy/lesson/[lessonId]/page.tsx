import {studentRead} from '@/lib/academy/school/student';
import {schoolReference} from '@/lib/academy/school/reference';
import { requireActiveMember } from "@/lib/dal";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getUserLessonProgress, getCourseWithStructure } from "@/lib/academy";
import { ProgressBar } from "@/components/academy/ProgressBar";
import { redirect } from "next/navigation";
import { interactiveLesson } from "@/lib/academy/learning/policy";
import InteractiveLessonPlayer from "@/components/academy/learning/InteractiveLessonPlayer";
import { getLearningState } from "@/lib/academy/learning/service";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const user = await requireActiveMember();
  const { lessonId } = await params;
  const db = (await getCloudflareContext()).env.DB;
  const lesson = await db.prepare(`SELECT * FROM "academy_lesson" WHERE id = ?;`).bind(lessonId).first<any>();
  if (!lesson) redirect("/academy");
  const classId=schoolReference(lesson.content);if(classId){try{await studentRead(db,user.id,classId);}catch{redirect('/academy');}redirect(`/academy/school/${classId}`);}
  const { requireLessonAccess } = await import("@/lib/academy");
  let context;
  try { context = await requireLessonAccess(user.id, lessonId); }
  catch { redirect("/academy"); }
  const module = context.module;
  if(interactiveLesson(lesson.content))return <InteractiveLessonPlayer initialState={await getLearningState(user.id,lessonId)} />;
  const course = await db.prepare(`SELECT * FROM "academy_course" WHERE id = ?;`).bind(module.course_id).first<any>();
  const progress = await getUserLessonProgress(user.id, lessonId);
  const structure = await getCourseWithStructure(course.id);
  const lessons = (structure?.lessons || []);
  const idx = lessons.findIndex((l: any) => l.id === lessonId);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null;

  const totalLessons = lessons.length;
  let completed = 0;
  for (const l of lessons) {
    const p = await getUserLessonProgress(user.id, l.id);
    if (p?.status === "completed") completed++;
  }
  const progressPct = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 via-ink-950 to-black">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <a href={`/academy/course/${course.id}`} className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40 transition-colors hover:text-white">
              ← {course.title}
            </a>
            <span className="rounded-sm border border-white/12 px-3 py-1 font-display text-[11px] uppercase tracking-[0.28em] text-white/40">
              {module.title}
            </span>
            <span className="rounded-sm border border-brand-600/60 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-400">
              Lesson {idx + 1} of {totalLessons}
            </span>
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h1 className="font-display text-[34px] font-bold uppercase tracking-[0.03em] text-white sm:text-[44px] lg:text-[56px]">
                {lesson.title}
              </h1>
              <p className="text-[14px] uppercase tracking-[0.24em] text-white/40">
                {lesson.lesson_type} {lesson.estimated_minutes ? `• ${lesson.estimated_minutes} Minutes` : ""} • Status: {progress?.status || "available"}
              </p>
            </div>
            <div className="w-full max-w-sm space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Course Progress</p>
                <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white">{progressPct}%</p>
              </div>
              <ProgressBar value={progressPct} />
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          {lesson.video_url && (
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-black to-ink-950">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
              <div className="flex aspect-video w-full items-center justify-center text-center">
                <div className="space-y-2">
                  <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Video Placeholder</p>
                  <p className="text-[14px] text-white/50">{lesson.video_url}</p>
                </div>
              </div>
            </div>
          )}
          <section className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
            <div className="space-y-6 p-6 sm:p-10">
              <div>
                <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Lesson Content</p>
                <h2 className="mt-2 font-display text-[26px] font-bold uppercase tracking-[0.03em] text-white">Instruction & Guidance</h2>
              </div>
              {lesson.content ? (
                <div>
                  {require("@/components/academy/lesson/LessonContentRenderer").LessonContentRenderer({ content: lesson.content })}
                </div>
              ) : (
                <div className="text-[16px] leading-relaxed text-white/80">Content coming soon.</div>
              )}
            </div>
          </section>
          <section className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Next Step</p>
                <p className="mt-2 text-[15px] text-white/70">Mark this lesson complete to unlock the next lesson in sequence.</p>
              </div>
              <form action={async () => {
                "use server";
                const { requireActiveMember } = await import("@/lib/dal");
                const user2 = await requireActiveMember();
                const { markLessonComplete, requireLessonAccess } = await import("@/lib/academy");
                const { module: mod2 } = await requireLessonAccess(user2.id, lessonId);
                await markLessonComplete(user2.id, lessonId);
                const { redirect } = await import("next/navigation");
                redirect(`/academy/course/${mod2.course_id}`);
              }}>
                <button type="submit" className="rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-3 font-display text-[12px] uppercase tracking-[0.28em] text-white transition-opacity hover:opacity-90">
                  Mark Lesson Complete
                </button>
              </form>
            </div>
          </section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {prev ? (
              <a href={`/academy/lesson/${prev.id}`} className="rounded-sm border border-white/12 px-6 py-2.5 text-center font-display text-[11px] uppercase tracking-[0.24em] text-white/70 transition-colors hover:text-white">
                ← Previous Lesson
              </a>
            ) : <span />}
            <a href={`/academy/course/${course.id}`} className="rounded-sm border border-white/12 px-6 py-2.5 text-center font-display text-[11px] uppercase tracking-[0.24em] text-white/70 transition-colors hover:text-white">
              Back to Course
            </a>
            {next ? (
              <a href={`/academy/lesson/${next.id}`} className="rounded-sm border border-white/12 px-6 py-2.5 text-center font-display text-[11px] uppercase tracking-[0.24em] text-white/70 transition-colors hover:text-white">
                Next Lesson →
              </a>
            ) : <span />}
          </div>
        </div>
        <aside className="space-y-6">
          <div className="sticky top-8 space-y-6">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950">
              <div className="border-b border-white/8 p-6">
                <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Curriculum</p>
                <h3 className="mt-2 font-display text-[18px] font-bold uppercase tracking-[0.03em] text-white">{course.title}</h3>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                {(structure?.modules || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((m: any) => (
                  <div key={m.id} className="border-b border-white/5 last:border-b-0">
                    <div className="px-6 py-4">
                      <p className="font-display text-[13px] uppercase tracking-[0.2em] text-white/70">{m.title}</p>
                    </div>
                    <div className="divide-y divide-white/5">
                      {(lessons.filter((l: any) => l.module_id === m.id)).sort((a: any, b: any) => a.sort_order - b.sort_order).map((l: any) => {
                        const lp = lessons.findIndex((x: any) => x.id === l.id);
                        const available = lp === 0 || lessons.slice(0, lp).every(async () => true); // UI hint only
                        const isCurrent = l.id === lessonId;
                        const lp2 = lessons.findIndex((x: any) => x.id === l.id);
                        return (
                          <a
                            key={l.id}
                            href={l.id === lessonId ? "#" : `/academy/lesson/${l.id}`}
                            className={`flex items-center gap-3 px-6 py-3 transition-colors ${isCurrent ? "bg-white/5 text-white" : "text-white/60 hover:bg-white/3 hover:text-white"}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${isCurrent ? "bg-brand-500" : "bg-white/20"}`} />
                            <span className="flex-1 text-[14px]">{l.title}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
              <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Learning Notes</p>
              <p className="mt-3 text-[14px] leading-relaxed text-white/60">
                Focus on understanding concepts, apply them to practice, and build disciplined habits. This is educational content only—no guarantees of financial results.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
