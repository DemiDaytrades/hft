import Link from "next/link";

export default function TrainingPlanWorkspace({ userId, data, planStatus }: { userId: string; data: any; planStatus: string; }) {
  const show = (value: unknown) => Array.isArray(value) ? value.join(', ') : typeof value === 'string' ? value : '—';
  const rows = [['Starting Level', 'level'], ['HFT Track', 'track'], ['Starting Summary', 'startingSummary'], ['Training Priorities', 'priorities'], ['Goal 1', 'goal1'], ['Goal 2', 'goal2'], ['Goal 3', 'goal3'], ['30 Days', 'milestone30'], ['60 Days', 'milestone60'], ['90 Days', 'milestone90'], ['First Lesson', 'firstLessonTitle'], ['First Lesson Objective', 'firstLessonObjective'], ['Learning Methods', 'methods'], ['Risk Focus', 'riskFocus'], ['Support Plan', 'supportPlan']];
  return <div className="space-y-6">
    <h1 className="font-display text-2xl font-bold uppercase">Historical Training Plan</h1>
    <Link href={`/admin/students/${userId}`} className="text-brand-400">← Back to Student Profile</Link>
    <p className="text-white/70">This manual plan is retained as a read-only historical record. Use the reviewed Personalized Learning Path and Financial Readiness Plan for current guidance.</p>
    <div className="flex flex-wrap gap-4 text-brand-400">
      <Link href={`/admin/student-intake-v2?studentUserId=${encodeURIComponent(userId)}`}>Canonical consultation review</Link>
      <Link href={`/admin/learning-path?studentId=${encodeURIComponent(userId)}`}>Personalized Learning Path</Link>
      <Link href={`/admin/financial-plan?studentId=${encodeURIComponent(userId)}`}>Financial Readiness</Link>
    </div>
    <p className="text-sm text-white/60">Historical status: {planStatus || 'No historical plan'}</p>
    <dl className="space-y-3 rounded border border-white/10 p-5">{rows.map(([label, key]) => <div key={key}><dt className="text-sm text-white/50">{label}</dt><dd className="whitespace-pre-wrap text-white/80">{show(data[key])}</dd></div>)}</dl>
    <section className="rounded border border-white/10 p-5"><h2 className="font-bold text-white">Private Instructor Notes (Admin Only)</h2><p className="whitespace-pre-wrap text-white/60">{show(data.instructorNotes)}</p></section>
  </div>;
}
