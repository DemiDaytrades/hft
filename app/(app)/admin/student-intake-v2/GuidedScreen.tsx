import type { ReactNode } from "react";
import { Panel } from "@/components/ui";
import type { GuidedScreen } from "./guided-config";

export default function GuidedScreenShell({
  screen,
  sectionLabel,
  questionCount,
  missingCount,
  children,
}: {
  screen: GuidedScreen;
  sectionLabel: string;
  questionCount: number;
  missingCount: number;
  children: ReactNode;
}) {
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/8 pb-4">
        <div>
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-300">
            {sectionLabel}
          </p>
          <h2 className="mt-1 font-display text-[20px] font-bold uppercase tracking-[0.03em] text-white">
            {screen.title}
          </h2>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-white/55">{screen.description}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          {questionCount > 0 && (
            <span className="rounded-sm border border-white/12 bg-ink-950/60 px-2 py-1 text-white/60">
              {questionCount} {questionCount === 1 ? "question" : "questions"}
            </span>
          )}
          {missingCount > 0 && (
            <span className="rounded-sm border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-amber-200">
              {missingCount} missing
            </span>
          )}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </Panel>
  );
}
