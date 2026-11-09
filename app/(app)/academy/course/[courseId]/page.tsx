import { requireActiveMember } from "@/lib/dal";
import { getCourseWithStructure, isCourseAssigned, getUserLessonProgress } from "@/lib/academy";
import { ProgressBar } from "@/components/academy/ProgressBar";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const user = await requireActiveMember();
  const { courseId } = await params;
  const assigned = await isCourseAssigned(user.id, courseId);
  if (!assigned) redirect("/academy");
  if(courseId==='hft-school-foundations')redirect('/academy/school');
  const structure = await getCourseWithStructure(courseId);
  if (!structure) redirect("/academy");
  const { course, modules, lessons } = structure;

  const lessonsByModule: Record<string, any[]> = {};
  for (const l of lessons) {
    if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
    lessonsByModule[l.module_id].push(l);
  }

  const progressMap: Record<string, any> = {};
  for (const l of lessons) {
    const p = await getUserLessonProgress(user.id, l.id);
    progressMap[l.id] = p;
  }

  const orderedLessons = lessons;
  const availability: Record<string, boolean> = {};
  for (let i = 0; i < orderedLessons.length; i++) {
    const l = orderedLessons[i];
    if (i === 0) {
      availability[l.id] = true;
      continue;
    }
    availability[l.id] = orderedLessons.slice(0, i).every((previous: any) => progressMap[previous.id]?.status === "completed");
  }

  const totalLessons = lessons.length;
  let completed = 0;
  for (const l of lessons) {
    if (progressMap[l.id]?.status === "completed") completed++;
  }
  const progressPct = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);

  return (
    <div className="space-y-10">
      <header className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 via-ink-950 to-black">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
        <div className="absolute -top-32 right-[-5%] h-72 w-72 rounded-full bg-brand-600/10 blur-3xl" />
        <div className="relative flex flex-col gap-8 p-6 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <a href="/academy" className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40 transition-colors hover:text-white">
                  ← Academy
                </a>
                <span className="rounded-sm border border-brand-600/60 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-400">
                  {course.track}
                </span>
                <span className="rounded-sm border border-white/12 px-3 py-1 font-display text-[11px] uppercase tracking-[0.28em] text-white/40">
                  {modules.length} Modules • {totalLessons} Lessons
                </span>
              </div>
              <div className="space-y-3">
                <h1 className="font-display text-[38px] font-bold uppercase tracking-[0.03em] text-white sm:text-[52px]">
                  {course.title}
                </h1>
                <p className="max-w-3xl text-[16px] leading-relaxed text-white/60">{course.description}</p>
              </div>
            </div>
            <div className="w-full max-w-sm space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Course Progress</p>
                <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white">{progressPct}%</p>
              </div>
              <ProgressBar value={progressPct} />
              <p className="text-[13px] text-white/50">{completed} of {totalLessons} lessons completed</p>
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-6">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Curriculum Roadmap</p>
          <h2 className="mt-2 font-display text-[28px] font-bold uppercase tracking-[0.03em] text-white sm:text-[36px]">
            Modules & Lessons
          </h2>
        </div>
        <div className="space-y-6">
          {modules.sort((a: any, b: any) => a.sort_order - b.sort_order).map((m: any, mIdx: number) => (
            <div key={m.id} className="overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950">
              <div className="flex flex-col gap-4 border-b border-white/8 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-600/60 font-display text-[13px] text-brand-400">
                      {mIdx + 1}
                    </span>
                    <h3 className="font-display text-[22px] font-bold uppercase tracking-[0.03em] text-white sm:text-[26px]">
                      {m.title}
                    </h3>
                  </div>
                  {m.description && <p className="max-w-2xl text-[14px] text-white/55">{m.description}</p>}
                </div>
                <p className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40">
                  {(lessonsByModule[m.id] || []).length} Lessons
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {(lessonsByModule[m.id] || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((l: any) => {
                  const p = progressMap[l.id];
                  const completed = p?.status === "completed";
                  const locked = !completed && !availability[l.id] && p?.status !== "available" && !(!p && orderedLessons.findIndex((x: any) => x.id === l.id) === 0);
                  // ensure first lesson not locked
                  const idxOrd = orderedLessons.findIndex((x: any) => x.id === l.id);
                  const isLocked = idxOrd === 0 ? false : (!completed && !availability[l.id]);
                  const lockedFinal = isLocked;
                  return (
                    <div key={l.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <span className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full border text-[12px] ${
                          completed
                            ? "border-green-400/60 text-green-400"
                            : lockedFinal
                              ? "border-white/10 text-white/30"
                              : "border-brand-600/60 text-brand-400"
                        }`}>
                          {completed ? "✓" : lockedFinal ? "—" : "•"}
                        </span>
                        <div className="space-y-2">
                          <h4 className="font-display text-[18px] font-semibold uppercase tracking-[0.03em] text-white">{l.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-[12px] uppercase tracking-[0.24em] text-white/40">
                            <span>{l.lesson_type}</span>
                            {l.estimated_minutes && <span>{l.estimated_minutes} Min</span>}
                            <span>{completed ? "Completed" : lockedFinal ? "Locked" : "Available"}</span>
                          </div>
                        </div>
                      </div>
                      {lockedFinal ? (
                        <span className="rounded-sm border border-white/10 px-5 py-2 font-display text-[11px] uppercase tracking-[0.24em] text-white/30">Locked</span>
                      ) : (
                        <a href={`/academy/lesson/${l.id}`} className="rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-2.5 text-center font-display text-[11px] uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90">
                          {completed ? "Review Lesson" : "Start Lesson"}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
