import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import ReviewWorkspace from "@/components/academy/learning/ReviewWorkspace";

export default async function LearningReviewPage({ searchParams }: { searchParams: Promise<{ studentId?: string; lessonId?: string }> }) {
  await requireAdmin();
  const { studentId, lessonId } = await searchParams;
  return <main className="mx-auto max-w-5xl space-y-8 p-4 sm:p-8"><Link href="/admin/academy/review" className="text-sm text-brand-400">← Academy review</Link><header><p className="text-xs uppercase tracking-widest text-brand-400">Instructor workspace</p><h1 className="mt-2 text-3xl font-bold text-white">Interactive lesson review</h1></header><form method="get" className="flex flex-wrap items-end gap-4 border-y border-white/15 py-5"><label className="text-sm text-white/70">Student ID<input name="studentId" required defaultValue={studentId} className="mt-2 block rounded-lg border border-white/20 bg-ink-900 p-3 text-white"/></label><label className="text-sm text-white/70">Lesson ID<input name="lessonId" required defaultValue={lessonId} className="mt-2 block rounded-lg border border-white/20 bg-ink-900 p-3 text-white"/></label><button className="rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white">Open learning record</button></form>{studentId && lessonId ? <ReviewWorkspace key={`${studentId}:${lessonId}`} studentId={studentId} lessonId={lessonId}/> : <p className="text-sm text-white/55">Choose a student and lesson to inspect attempts, concept mastery, and homework. Opening this workspace does not create learning records.</p>}</main>;
}
