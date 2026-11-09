"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PREFER_NOT_TO_SAY, type StudentSectionsV2 } from "@/lib/student-intake-v2/contracts";
import { mergeReconciledValues, shouldApplyServerValues, type IntakeSaveResult } from "@/lib/student-intake-v2/autosave";
import { DC_HARDSHIP_NOTE_MAX, DC_NOT_SURE, DC_OPTIONS, DC_PNTS } from "@/lib/student-intake-v2/debt-credit-registry";
import { DEBT_CREDIT_FIELDS } from "./debt-credit";
import { AutosaveStatus, fetchLatestIntake, useIntakeAutosave, type AutosaveFlush } from "./IntakeAutosave";

function fv<T>(v: T | undefined) { return v === undefined ? undefined : { value: v }; }
function val<T>(field: { value: T } | undefined): T | undefined { return field?.value; }

function FieldLabel({ label, question, dcId }: { label: string; question?: string; dcId?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">{dcId ? `${dcId} · ${label}` : label}</label>
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

export default function DebtCreditForm({
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
    () => (fieldKeys ? DEBT_CREDIT_FIELDS.filter((field) => fieldKeys.includes(field.key)) : DEBT_CREDIT_FIELDS),
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
  const hasDebt = (val(draft.debtStatusTypes) as { hasDebt?: string } | undefined)?.hasDebt ?? val(sections.debtStatusTypes)?.hasDebt;
  const showConditional = hasDebt === "Yes";

  function setField(key: string, value: any) {
    editVersion.current += 1;
    editedKeys.current.add(key);
    setDraft((d) => ({ ...d, [key]: value }));
    setReconcileError("");
  }
  function setHardship(sub: "status" | "note", value: string) {
    setDraft((d) => {
      const prev = d.recentFinancialHardship && typeof d.recentFinancialHardship === "object" ? { ...d.recentFinancialHardship } : {};
      const next = { ...prev, [sub]: sub === "note" ? value.slice(0, DC_HARDSHIP_NOTE_MAX) : value };
      if (sub === "note" && !String(value || "").trim()) delete next.note;
      return { ...d, recentFinancialHardship: next };
    });
    editVersion.current += 1;
    editedKeys.current.add("recentFinancialHardship");
    setReconcileError("");
  }
  function toggleMulti(key: string, option: string, options: readonly string[]) {
    const cur = Array.isArray(draft[key]) ? [...draft[key]] : [];
    let next: string[];
    const mutex = [DC_PNTS, DC_NOT_SURE];
    if (mutex.includes(option)) {
      next = cur.includes(option) ? [] : [option];
    } else {
      const withoutMutex = cur.filter((v) => !mutex.includes(v));
      next = withoutMutex.includes(option) ? withoutMutex.filter((v) => v !== option) : [...withoutMutex, option];
    }
    // keep only known options where possible
    next = next.filter((v) => options.includes(v as any));
    setField(key, next);
  }

  function valuesFromIntake(intake: any) {
    const next: Record<string, any> = {};
    for (const f of visibleFields) next[f.key] = val(intake?.student_sections_json?.[f.key]);
    return next;
  }

  async function persist(draftToSave = draftRef.current, version = expectedVersion.current): Promise<IntakeSaveResult> {
    const payloadSections: Partial<StudentSectionsV2> = {};
    for (const f of visibleFields) {
      if ((f as any).conditionalHasDebtYes && !showConditional) {
        continue;
      }
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
      body: JSON.stringify({
        action: "save-student", correctionReason, evidenceKind, expectedSnapshotVersion: version,
        intakeId,
        studentUserId,
        mode: "instructor_entered_for_student",
        sections: payloadSections,
      }),
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
        Debt &amp; Credit (Phase 3C, local additive). Answers help personalize education, not evaluate credit eligibility or guarantee financial outcomes. Students are not being evaluated for credit eligibility. Debt, credit score, and non-disclosure alone do not create high-risk designations. Do not share sensitive personal, medical, legal, or account details. “{PREFER_NOT_TO_SAY}” is a valid response and is not treated as negative.
      </div>
      {!showConditional && (
        <div className="rounded-sm border border-white/10 bg-ink-950/40 px-3 py-2 text-[12px] text-white/60">
          Financial Health debt status is <span className="text-white/85">{String(hasDebt || "not set")}</span>. DC-02 (payment affordability/manageability), DC-06 (debt reduction strategy), and DC-10 (debt payoff priorities) are hidden unless debt status is Yes. Hidden answers are omitted on save; no artificial “Not applicable” value is stored.
        </div>
      )}
      {readOnly && <div className="rounded-sm border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-200">Completed snapshot — read only. Debt &amp; Credit cannot be edited.</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {visibleFields.filter(f=>!missingOnly||missingKeys?.includes(f.key)).map((f) => {
          if ((f as any).conditionalHasDebtYes && !showConditional) {
            return (
              <div key={f.key} data-field-key={f.key} className="rounded-sm border border-white/6 bg-ink-950/20 p-3 opacity-70">
                <FieldLabel dcId={f.dcId} label={f.label} question={f.question} />
                <p className="text-[12px] text-white/45">Hidden unless Financial Health debt status is Yes.</p>
              </div>
            );
          }
          const v = draft[f.key];
          if (f.control.kind === "select") {
            return (
              <div key={f.key} data-field-key={f.key}>
                <FieldLabel dcId={f.dcId} label={f.label} question={f.question} />
                <Select value={typeof v === "string" ? v : ""} onChange={(nv) => setField(f.key, nv)} options={f.control.options} disabled={readOnly} />
                <Helper text={(f as any).helperText} />
              </div>
            );
          }
          if (f.control.kind === "multiselect") {
            const selected: string[] = Array.isArray(v) ? v : [];
            return (
              <div key={f.key} data-field-key={f.key} className="md:col-span-2">
                <FieldLabel dcId={f.dcId} label={f.label} question={f.question} />
                <div className="flex flex-wrap gap-1.5">
                  {f.control.options.map((o) => {
                    const active = selected.includes(o);
                    return <button key={o} type="button" disabled={readOnly} onClick={() => toggleMulti(f.key, o, f.control.kind === "multiselect" ? f.control.options : [])} className={`rounded-sm border px-2.5 py-1 text-[11px] transition-colors disabled:opacity-50 ${active ? "border-brand-600 bg-brand-600/20 text-white" : "border-white/12 text-white/60 hover:text-white"}`}>{o}</button>;
                  })}
                </div>
                <Helper text={(f as any).helperText} />
              </div>
            );
          }
          if (f.key === "recentFinancialHardship") {
            const status = v?.status || "";
            const note = typeof v?.note === "string" ? v.note : "";
            return (
              <div key={f.key} data-field-key={f.key} className="space-y-2 md:col-span-2">
                <FieldLabel dcId={f.dcId} label={f.label} question={f.question} />
                <Select value={status} onChange={(nv) => setHardship("status", nv)} options={DC_OPTIONS.hardshipStatus} disabled={readOnly} />
                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px] text-white/45"><span>Optional high-level note (no sensitive details)</span><span>{note.length}/{DC_HARDSHIP_NOTE_MAX}</span></div>
                  <textarea value={note} onChange={(e) => setHardship("note", e.target.value)} rows={2} maxLength={DC_HARDSHIP_NOTE_MAX} disabled={readOnly} placeholder="Optional: brief, high-level context only (max 280 characters)" className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white focus:border-brand-600 focus:outline-none disabled:opacity-50" />
                </div>
                <Helper text={(f as any).helperText} />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="space-y-2 border-t border-white/8 pt-3">
        <div className="flex flex-wrap items-center gap-3">
          {!readOnly && (
            <button type="button" onClick={() => void autosave.retry(() => persist())} disabled={autosave.status === "saving" || autosave.conflict || (!dirty && autosave.status !== "error")} className="rounded-sm bg-brand-600 px-5 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-brand-500 disabled:opacity-40">
              {autosave.status === "saving" ? "Saving..." : "Save Debt & Credit"}
            </button>
          )}
          <AutosaveStatus status={autosave.status} error={autosave.error || reconcileError} dirty={dirty} conflict={autosave.conflict} onReloadLatest={onReloadLatest} onReconcile={reconcile} />
        </div>
      </div>
    </div>
  );
}
