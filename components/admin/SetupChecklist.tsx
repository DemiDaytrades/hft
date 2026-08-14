import Link from "next/link";

import type { SetupStatus } from "@/lib/setup-status";

/**
 * Shown on the admin home until everything is set up, and again if something
 * breaks later. Deliberately not dismissible: an outstanding step means the
 * business cannot take money.
 */
export default function SetupChecklist({ status }: { status: SetupStatus }) {
  if (status.allDone) return null;

  const remaining = status.steps.filter((step) => !step.done).length;

  return (
    <section className="rounded-lg border border-brand-600/40 bg-brand-600/5 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-[16px] font-semibold uppercase tracking-[0.16em] text-white">
          Finish setting up
        </h2>
        <p className="text-[13px] text-white/50">
          {remaining} {remaining === 1 ? "thing" : "things"} left
        </p>
      </div>

      <ol className="mt-5 space-y-3">
        {status.steps.map((step) => (
          <li
            key={step.id}
            className={`flex flex-wrap items-start gap-4 rounded-sm border px-4 py-4 ${
              step.done
                ? "border-white/8 bg-white/[0.02]"
                : "border-white/12 bg-ink-950/50"
            }`}
          >
            <span
              aria-hidden
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                step.done
                  ? "border-zone-buy/60 bg-zone-buy/20 text-zone-buy"
                  : "border-white/25 text-transparent"
              }`}
            >
              ✓
            </span>

            <div className="min-w-0 flex-1">
              <p
                className={`text-[15px] ${
                  step.done ? "text-white/45 line-through" : "text-white"
                }`}
              >
                {step.title}
              </p>
              {!step.done && (
                <p className="mt-1 text-[13.5px] leading-relaxed text-white/55">
                  {step.detail}
                </p>
              )}
            </div>

            {!step.done && (
              <Link
                href={step.href}
                {...(step.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="shrink-0 rounded-sm bg-brand-600 px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500"
              >
                {step.cta}
              </Link>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-5 text-[13px] leading-relaxed text-white/40">
        This box disappears once everything&apos;s done. If it comes back later,
        something needs your attention.
      </p>
    </section>
  );
}
