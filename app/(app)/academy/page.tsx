import {studentCatalog} from '@/lib/academy/school/student';
import {AfterClass} from '@/components/classroom/teaching/AfterClass';
import { requireActiveMember } from "@/lib/dal";
import { getUserAssignments, getCourseWithStructure, getUserLessonProgress } from "@/lib/academy";
import { getPlacement } from "@/lib/student-placement";
import { CourseCard } from "@/components/academy/CourseCard";

import Link from 'next/link';
import {getStudentLearningPath} from '@/lib/learning-path/service';
import {getIntakeV2Db} from '@/lib/student-intake-v2/service';

export const dynamic = "force-dynamic";

export default async function AcademyPage() {
  const user = await requireActiveMember();
  const assignments = (await getUserAssignments(user.id)).filter(a=>a.course_id!=='hft-school-foundations');
  const schoolClasses=await studentCatalog(getIntakeV2Db(),user.id);
  const placement = await getPlacement(user.id);
  const learningPath=await getStudentLearningPath(getIntakeV2Db(),user.id);
  const firstName = user.name?.split(" ")[0] || "Trader";

  let progressMap: Record<string, number> = {};
  for (const a of assignments) {
    const structure = await getCourseWithStructure(a.course_id);
    if (!structure) continue;
    const lessons = structure.lessons || [];
    if (lessons.length === 0) {
      progressMap[a.course_id] = 0;
      continue;
    }
    let completed = 0;
    for (const l of lessons) {
      const p = await getUserLessonProgress(user.id, l.id);
      if (p?.status === "completed") completed++;
    }
    progressMap[a.course_id] = Math.round((completed / lessons.length) * 100);
  }

  const featured = assignments[0];

  return (
    <div className="space-y-10">
      <AfterClass/>
      <div className="flex flex-wrap gap-5 text-brand-300"><Link href="/academy/school">Your learning journey →</Link><Link href="/academy/study-guides">Your permanent Study Guides →</Link></div>
      <Link href="/learning-path" className="text-brand-300 underline">View your instructor-approved learning path →</Link>
      {schoolClasses.map(c=><section key={c.enrollment} className="rounded border border-brand-400/40 bg-ink-900 p-6"><p className="text-xs uppercase text-brand-300">Your assigned class</p><h2 className="mt-3 text-2xl font-semibold">{c.title}</h2><p className="mt-2 text-white/60">{c.completed?'Completed · your work is preserved':'Explore, practise and learn with instructor feedback'}</p><Link href={c.href} className="mt-4 inline-block text-brand-300 underline">{c.completed?'Review class':'Continue class'} →</Link></section>)}
      <header className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 via-ink-950 to-black">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
        <div className="absolute -top-40 right-[-10%] h-80 w-80 rounded-full bg-brand-600/10 blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-10%] h-72 w-72 rounded-full bg-brand-500/5 blur-3xl" />
        <div className="relative flex flex-col gap-8 p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-sm border border-brand-600/60 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-400">
                  HFT Academy
                </span>
                <span className="rounded-sm border border-white/12 px-3 py-1 font-display text-[11px] uppercase tracking-[0.28em] text-white/40">
                  Placement: {learningPath ? learningPath.path.overall?.replaceAll("_"," ") || "Not assessed" : placement?.instructorTrack || "Pending Instructor Review"}
                </span>
              </div>
              <div className="space-y-3">
                <h1 className="font-display text-[38px] font-bold uppercase tracking-[0.03em] text-white sm:text-[52px] lg:text-[64px]">
                  Welcome back, {firstName}
                </h1>
                <p className="max-w-2xl text-[16px] leading-relaxed text-white/60">
                  A premium, disciplined approach to mastering Forex fundamentals. Build precision, risk awareness, and consistency one lesson at a time.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-right">
              <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Assigned Courses</p>
              <p className="font-display text-[48px] font-bold text-white sm:text-[64px]">{assignments.length}</p>
            </div>
          </div>
          {featured && (
            <CourseCard
              href={`/academy/course/${featured.course_id}`}
              title={featured.course_title}
              description={featured.course_description}
              track={featured.course_track}
              progress={progressMap[featured.course_id] ?? 0}
              status={featured.status}
            />
          )}
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Your Curriculum</p>
            <h2 className="mt-2 font-display text-[28px] font-bold uppercase tracking-[0.03em] text-white sm:text-[36px]">
              Continue Learning
            </h2>
          </div>
          <p className="text-[14px] text-white/50">Progress is tracked lesson by lesson with server-enforced sequencing.</p>
        </div>
        {assignments.length === 0 ? (
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-8 text-center sm:p-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
            <div className="mx-auto max-w-xl space-y-4">
              <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Awaiting Assignment</p>
              <h3 className="font-display text-[28px] font-bold uppercase tracking-[0.03em] text-white">No courses assigned yet</h3>
              <p className="text-[15px] leading-relaxed text-white/60">
                An authorized instructor will assign your curriculum based on your final placement. Your progress will appear here once a course is assigned.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {assignments.map((a: any) => (
              <CourseCard
                key={a.id}
                href={`/academy/course/${a.course_id}`}
                title={a.course_title}
                description={a.course_description}
                track={a.course_track}
                progress={progressMap[a.course_id] ?? 0}
                status={a.status}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
