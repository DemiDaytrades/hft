import Link from "next/link";

export function CourseCard({
  href,
  title,
  description,
  track,
  progress,
  status,
}: {
  href: string;
  title: string;
  description: string;
  track?: string;
  progress?: number;
  status?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 via-ink-950 to-black transition-all duration-300 hover:-translate-y-1 hover:border-brand-600/60 hover:shadow-[0_40px_80px_-60px_rgba(227,69,9,0.9)]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
      <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-brand-600/10 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />
      <div className="relative flex h-full flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-sm border border-brand-600/60 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-400">
            {track || "Foundations"}
          </span>
          {typeof progress === "number" && (
            <span className="font-display text-[11px] uppercase tracking-[0.24em] text-white/40">
              {progress}% Complete
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-[26px] font-bold uppercase tracking-[0.03em] text-white sm:text-[32px]">
            {title}
          </h3>
          <p className="max-w-2xl text-[15px] leading-relaxed text-white/60">{description}</p>
        </div>
        <div className="mt-auto space-y-4">
          {typeof progress === "number" && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-display text-[12px] uppercase tracking-[0.24em] text-white/40">
              {status === "completed" ? "Completed" : progress && progress > 0 ? "In Progress" : "Start Learning"}
            </span>
            <span className="flex items-center gap-2 font-display text-[12px] uppercase tracking-[0.24em] text-brand-400 transition-transform duration-300 group-hover:translate-x-1">
              Continue <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
