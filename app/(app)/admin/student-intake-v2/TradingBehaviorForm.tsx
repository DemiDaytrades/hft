"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { StudentSectionsV2 } from "@/lib/student-intake-v2/contracts";
import { mergeReconciledValues, shouldApplyServerValues, type IntakeSaveResult } from "@/lib/student-intake-v2/autosave";
import { PF_PNTS_ANSWER } from "@/lib/student-intake-v2/trading-behavior-registry";
import { TRADING_BEHAVIOR_FIELDS } from "./trading-behavior";
import { AutosaveStatus, fetchLatestIntake, useIntakeAutosave, type AutosaveFlush } from "./IntakeAutosave";

function fv<T>(v: T | undefined) { return v === undefined ? undefined : { value: v }; }
function val<T>(field: { value: T } | undefined): T | undefined { return field?.value; }

function FieldLabel({ label, question, pfId }: { label: string; question?: string; pfId?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">{pfId ? `${pfId} · ${label}` : label}</label>
      {question && <p className="mt-0.5 text-[12px] leading-relaxed text-white/70">{question}</p>}
    </div>
  );
}
function Helper({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-[11px] leading-relaxed text-white/45">{text}</p>;
}
function Select({ value, onChange, options, disabled }: { value: string; onChange: (v: string) => void; options: readonly string[]; disabled?: boolean }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white focus:border-brand-600 focus:outline-none disabled:opacity-50">
      <option value="">Select…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function TradingBehaviorForm({
  intakeId,
  studentUserId,
  sections,
  readOnly,
  missingOnly, missingKeys, correctionReason, evidenceKind,
  onSaved,
  onDirty,
  onSaving,
  snapshotVersion,
  fieldKeys,
  onReloadLatest,
  onRegisterFlush,
  autosaveEnabled = true,
}: {
  intakeId: string;
  studentUserId: string;
  sections: StudentSectionsV2;
  readOnly: boolean;
  missingOnly?:boolean; missingKeys?:string[]; fieldKeys?:readonly string[]; correctionReason?:string; evidenceKind?:"STUDENT_REPORTED"|"INSTRUCTOR_OVERRIDE";
  onSaved: (intake: any) => void;
  onDirty: (dirty:boolean) => void;
  onSaving: (saving:boolean) => void;
  snapshotVersion: number;
  onReloadLatest?: () => void | Promise<void>;
  onRegisterFlush?: (flush: AutosaveFlush | null) => void;
  autosaveEnabled?: boolean;
}) {
  const visibleFields = useMemo(
    () => (fieldKeys ? TRADING_BEHAVIOR_FIELDS.filter((field) => fieldKeys.includes(field.key)) : TRADING_BEHAVIOR_FIELDS),
    [fieldKeys],
  );
  const initial = useMemo(() => {
    const out: Record<string, any> = {};
    for (const f of visibleFields) out[f.key] = val((sections as any)[f.key]);
    return out;
  }, [sections, visibleFields]);
  const [draft, setDraft] = useState<Record<string, any>>(initial);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  const [reconcileError, setReconcileError] = useState("");
  const draftRef = useRef(draft);
  const expectedVersion = useRef(snapshotVersion);
  const editVersion = useRef(0);
  const editedKeys = useRef(new Set<string>());
  useEffect(() => { draftRef.current = draft; }, [draft]);
  const dirty = JSON.stringify(draft) !== baseline;

  useEffect(()=>{onDirty(dirty)},[dirty,onDirty]);
  useEffect(() => {
    if (!dirty) expectedVersion.current = snapshotVersion;
  }, [dirty, snapshotVersion]);

  function setField(key: string, value: any) {
    editVersion.current += 1;
    editedKeys.current.add(key);
    setDraft((d) => ({ ...d, [key]: value }));
    setReconcileError("");
  }

  function valuesFromIntake(intake: any) {
    const next: Record<string, any> = {};
    for (const f of visibleFields) next[f.key] = val(intake?.student_sections_json?.[f.key]);
    return next;
  }

  async function persist(draftToSave = draftRef.current, version = expectedVersion.current): Promise<IntakeSaveResult> {
    const payloadSections: Partial<StudentSectionsV2> = {};
    for (const f of visibleFields) {
      const v = draftToSave[f.key];
      if (v === undefined) continue;
      (payloadSections as any)[f.key] = fv(v);
    }
    const versionAtStart = editVersion.current;
    const res = await fetch("/api/admin/student-intake-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({ action: "save-student", correctionReason, evidenceKind, expectedSnapshotVersion: version, intakeId, studentUserId, mode: "instructor_entered_for_student", sections: payloadSections }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string; intake?: any };
    if (!res.ok) return { ok: false, status: res.status, error: json.error || "Save failed" };
    const intake = json.intake;
    expectedVersion.current = intake.snapshot_version;
    const next = valuesFromIntake(intake);
    if (shouldApplyServerValues(versionAtStart, editVersion.current)) {
      setDraft(next);
      setBaseline(JSON.stringify(next));
      editedKeys.current.clear();
    } else {
      setBaseline(JSON.stringify(next));
    }
    onSaved(intake);
    if (!shouldApplyServerValues(versionAtStart, editVersion.current)) onDirty(true);
    return { ok: true, intake };
  }

  const autosave = useIntakeAutosave({
    enabled: autosaveEnabled && !readOnly && evidenceKind !== "INSTRUCTOR_OVERRIDE",
    dirty,
    signature: JSON.stringify(draft),
    save: () => persist(),
    onSuccess: () => {},
    onSaving,
    onRegisterFlush,
  });

  async function reconcile() {
    setReconcileError("");
    try {
      const latest = await fetchLatestIntake(intakeId, studentUserId);
      const latestValues = valuesFromIntake(latest);
      const merged = mergeReconciledValues(latestValues, draftRef.current, editedKeys.current);
      expectedVersion.current = latest.snapshot_version;
      setDraft(merged);
      setBaseline(JSON.stringify(latestValues));
      onSaved(latest);
      onDirty(true);
      await autosave.retry(() => persist(merged, latest.snapshot_version));
    } catch (caught) {
      setReconcileError(caught instanceof Error ? caught.message : "Unable to reconcile the latest answers.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-sm border border-white/8 bg-ink-950/30 p-3 text-[12px] leading-relaxed text-white/55">
        Trading Behavior, Psychology &amp; Discipline (Phase 3F, local additive). Structured self-reported behavior facts only — not a mental-health assessment; no clinical labels; non-shaming. PF-05 collects loss-limit stop adherence and does not set/recommend a loss limit; PF-06 is separate (pause live trading/return to demo or education). Beginner/no-experience/no-rules/no-setups/no-live-trading responses are legitimate. “{PF_PNTS_ANSWER}” is a valid response and does not itself indicate high risk, lack of discipline, unsafe behavior, unsuitability, or unwillingness to learn. No trading-plan calculations or recommendations.
      </div>
      {readOnly && <div className="rounded-sm border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-200">Completed snapshot — read only. Trading Behavior, Psychology &amp; Discipline cannot be edited.</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {visibleFields.filter(f=>!missingOnly||missingKeys?.includes(f.key)).map((f) => (
          <div key={f.key} data-field-key={f.key}>
            <FieldLabel pfId={f.pfId} label={f.label} question={f.question} />
            <Select value={typeof draft[f.key] === "string" ? draft[f.key] : ""} onChange={(nv) => setField(f.key, nv)} options={f.control.options} disabled={readOnly} />
            <Helper text={(f as any).helperText} />
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-white/8 pt-3">
        <div className="flex flex-wrap items-center gap-3">
          {!readOnly && (
            <button type="button" onClick={() => void autosave.retry(() => persist())} disabled={autosave.status === "saving" || autosave.conflict || (!dirty && autosave.status !== "error")} className="rounded-sm bg-brand-600 px-5 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-brand-500 disabled:opacity-40">
              {autosave.status === "saving" ? "Saving..." : "Save Trading Behavior"}
            </button>
          )}
          <AutosaveStatus status={autosave.status} error={autosave.error || reconcileError} dirty={dirty} conflict={autosave.conflict} onReloadLatest={onReloadLatest} onReconcile={reconcile} />
        </div>
      </div>
    </div>
  );
}
