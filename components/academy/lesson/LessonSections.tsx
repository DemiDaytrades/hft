import React from "react";

export function LessonHeader({
  courseTitle,
  moduleTitle,
  lessonNumber,
  totalLessons,
  title,
  durationMinutes,
  progressPct,
}: {
  courseTitle: string;
  moduleTitle: string;
  lessonNumber: number;
  totalLessons: number;
  title: string;
  durationMinutes?: number | null;
  progressPct: number;
}) {
  return (
    <header className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 via-ink-950 to-black">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
      <div className="absolute -top-32 right-[-5%] h-72 w-72 rounded-full bg-brand-600/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40">
            {courseTitle}
          </span>
          <span className="text-white/20">/</span>
          <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
            {moduleTitle}
          </span>
          <span className="rounded-sm border border-brand-600/60 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-400">
            Lesson {lessonNumber} of {totalLessons}
          </span>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <h1 className="font-display text-[34px] font-bold uppercase tracking-[0.03em] text-white sm:text-[44px] lg:text-[56px]">
              {title}
            </h1>
            <p className="text-[14px] uppercase tracking-[0.24em] text-white/40">
              {durationMinutes ? `${durationMinutes} Minutes` : "Self-Paced"} • Premium HFT Education
            </p>
          </div>
          <div className="w-full max-w-sm space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Course Progress</p>
              <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white">{progressPct}%</p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 transition-all duration-700"
                style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function ObjectivesBlock({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-brand-600/40 bg-gradient-to-br from-brand-600/10 via-ink-900 to-ink-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
      <div className="space-y-4 p-6 sm:p-8">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-brand-400">Learning Objectives</p>
          <h2 className="mt-2 font-display text-[22px] font-bold uppercase tracking-[0.03em] text-white">By the end of this lesson</h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">{children}</ul>
      </div>
    </section>
  );
}

export function ObjectiveItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-sm border border-white/10 bg-black/30 px-4 py-3">
      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500" />
      <span className="text-[15px] leading-relaxed text-white/80">{children}</span>
    </li>
  );
}

export function KeyConceptsBlock({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950">
      <div className="space-y-4 p-6 sm:p-8">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Key Concepts & Terms</p>
          <h2 className="mt-2 font-display text-[22px] font-bold uppercase tracking-[0.03em] text-white">Essential Vocabulary</h2>
        </div>
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
    </section>
  );
}

export function KeyConceptChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm border border-white/12 px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.2em] text-white/70">
      {children}
    </span>
  );
}

export function Callout({ type = "insight", title, children }: { type?: "insight" | "remember" | "example" | "risk"; title: string; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    insight: "border-brand-600/40 from-brand-600/10",
    remember: "border-white/20 from-white/5",
    example: "border-white/15 from-white/3",
    risk: "border-zone-sell/40 from-zone-sell/10",
  };
  return (
    <div className={`relative overflow-hidden rounded-lg border bg-gradient-to-br to-ink-950 ${styles[type]}`}>
      <div className="space-y-3 p-6">
        <div className="flex items-center gap-2">
          <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/70">{title}</span>
        </div>
        <div className="text-[15px] leading-relaxed text-white/80">{children}</div>
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-[26px] font-bold uppercase tracking-[0.03em] text-white sm:text-[32px]">{title}</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-brand-600/60 via-white/10 to-transparent" />
      </div>
      <div className="space-y-4 text-[16px] leading-relaxed text-white/80">{children}</div>
    </section>
  );
}

export function ExerciseBlock({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/15 bg-gradient-to-br from-ink-900 to-ink-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="space-y-4 p-6 sm:p-8">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/50">Your Turn</p>
          <h2 className="mt-2 font-display text-[22px] font-bold uppercase tracking-[0.03em] text-white">Exercise & Reflection</h2>
        </div>
        <div className="space-y-3 text-[15px] leading-relaxed text-white/80">{children}</div>
      </div>
    </section>
  );
}

export function ReviewQuestionsBlock({ questions }: { questions: string[] }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950">
      <div className="space-y-4 p-6 sm:p-8">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Review</p>
          <h2 className="mt-2 font-display text-[22px] font-bold uppercase tracking-[0.03em] text-white">Self-Review Questions</h2>
          <p className="mt-2 text-[14px] text-white/50">Take a moment to answer these in your HFT Trading Journal.</p>
        </div>
        <ol className="space-y-3">
          {questions.map((q, i) => (
            <li key={i} className="flex gap-4 rounded-sm border border-white/10 bg-black/30 p-4">
              <span className="font-display text-[14px] text-brand-400">{i + 1}.</span>
              <span className="text-[15px] leading-relaxed text-white/80">{q}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TakeawaysBlock({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-brand-600/30 bg-gradient-to-br from-brand-600/8 via-ink-900 to-ink-950">
      <div className="space-y-4 p-6 sm:p-8">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-brand-400">Key Takeaways</p>
          <h2 className="mt-2 font-display text-[22px] font-bold uppercase tracking-[0.03em] text-white">Remember These Points</h2>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">{children}</ul>
      </div>
    </section>
  );
}

export function TakeawayItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-sm border border-white/10 bg-black/30 px-4 py-3">
      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500" />
      <span className="text-[15px] leading-relaxed text-white/80">{children}</span>
    </li>
  );
}
