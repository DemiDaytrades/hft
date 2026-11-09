"use client";

import { useRef } from "react";
import { Panel } from "@/components/ui";
import { SECTIONS } from "./questionnaireFields";

type Props = {
  userId: string;
  userName: string;
  questionnaire: any;
  onEdit: () => void;
};

export default function StrategyConsultationReport({ userName, questionnaire, onEdit }: Props) {
  const data = questionnaire?.data || {};
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollTo = (id: string) => refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-white/10 bg-ink-900/60 p-4">
        <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Strategy Consultation Report</p>
        <p className="mt-1 text-[14px] text-white">{userName}</p>
        <p className="text-[12px] text-white/50">Status: {questionnaire?.status === "submitted" ? "Completed" : questionnaire?.status === "in_progress" ? "In Progress" : "Not Started"}</p>
        {questionnaire?.updatedAt && <p className="text-[12px] text-white/50">Last updated: {new Date(questionnaire.updatedAt).toLocaleString()}</p>}
        <button onClick={onEdit} className="mt-2 rounded-sm border border-white/12 px-4 py-2 font-display text-[11px] uppercase tracking-[0.24em] text-white/70">Edit Consultation</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <Panel className="sticky top-4">
            <nav className="space-y-1">
              {SECTIONS.map((s) => (
                <button key={s.id} type="button" onClick={() => scrollTo(s.id)} className="w-full rounded-sm px-2 py-1.5 text-left text-[12px] text-white/70 hover:bg-white/5 hover:text-white">
                  {s.id}. {s.label}
                </button>
              ))}
            </nav>
          </Panel>
        </div>
        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <div key={s.id} ref={(el) => { refs.current[s.id] = el; }} className="rounded-lg border border-white/10 bg-ink-900/60 p-4">
              <h2 className="font-display text-[16px] font-bold uppercase tracking-[0.03em] text-white mb-3">{s.id} — {s.label}</h2>
              {s.fields.filter((f) => !f.show || f.show(data)).map((f) => {
                const val = data[f.key];
                const display = Array.isArray(val) ? val.join(", ") : (val ?? "");
                return (
                  <div key={f.key} className="border-b border-white/5 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">{f.label}</p>
                    <p className="mt-1 text-[13px] text-white">{display !== "" ? display : "Not answered"}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
