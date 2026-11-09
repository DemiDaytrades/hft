"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PREFER_NOT_TO_SAY, type StudentSectionsV2 } from "@/lib/student-intake-v2/contracts";
import { mergeReconciledValues, shouldApplyServerValues, type IntakeSaveResult } from "@/lib/student-intake-v2/autosave";
import { FH_ENUM } from "@/lib/student-intake-v2/financial-health-registry";
import { FINANCIAL_HEALTH_FIELDS } from "./financial-health";
import { AutosaveStatus, fetchLatestIntake, useIntakeAutosave, type AutosaveFlush } from "./IntakeAutosave";

function fv<T>(v: T | undefined) {
  return v === undefined ? undefined : { value: v };
}
function val<T>(field: { value: T } | undefined): T | undefined {
  return field?.value;
}

const P = PREFER_NOT_TO_SAY;

function FieldLabel({ label, question }: { label: string; question?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">{label}</label>
      {question && <p className="mt-0.5 text-[12px] leading-relaxed text-white/70">{question}</p>}
    </div>
  );
}
function Helper({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-[11px] leading-relaxed text-white/45">{text}</p>;
}
function Select({ value, onChange, options, disabled, displayLabels }: { value: string; onChange: (v: string) => void; options: readonly string[]; disabled?: boolean; displayLabels?: Record<string, string> }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white focus:border-brand-600 focus:outline-none disabled:opacity-50">
      <option value="">Select…</option>
      {options.map((o) => <option key={o} value={o}>{displayLabels?.[o] || o}</option>)}
    </select>
  );
}
function TogglePills({ value, onChange, options, disabled }: { value: string; onChange: (v: string) => void; options: readonly string[]; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = value === o;
        return (
          <button key={o} type="button" disabled={disabled} onClick={() => onChange(o)} className={`rounded-sm border px-2.5 py-1 text-[11px] transition-colors disabled:opacity-50 ${active ? "border-brand-600 bg-brand-600/20 text-white" : "border-white/12 text-white/60 hover:text-white"}`}>{o}</button>
        );
      })}
    </div>
  );
}

export default function FinancialHealthForm({
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
    () => (fieldKeys ? FINANCIAL_HEALTH_FIELDS.filter((field) => fieldKeys.includes(field.key)) : FINANCIAL_HEALTH_FIELDS),
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
  function setSub(key: string, sub: string, value: any) {
    setDraft((d) => {
      const prev = d[key] && typeof d[key] === "object" ? { ...d[key] } : {};
      const next = { ...prev, [sub]: value };
      // 4A: if hasDebt becomes No or Prefer not to say, hide/clear burden-related type detail is kept in shape but burden fields are separate keys handled by UI visibility.
      if (key === "debtStatusTypes" && sub === "hasDebt" && value !== "Yes") {
        next.types = undefined;
      }
      // 4A: PNTS in debt types is mutually exclusive with named types.
      if (key === "debtStatusTypes" && sub === "types" && Array.isArray(value) && value.includes(P) && value.length > 1) {
        next.types = [P];
      }
      return { ...d, [key]: next };
    });
    editVersion.current += 1;
    editedKeys.current.add(key);
    setReconcileError("");
  }
  function toggleDebtType(type: string) {
    const cur = Array.isArray(draft.debtStatusTypes?.types) ? [...draft.debtStatusTypes.types] : [];
    let next: string[];
    if (type === P) next = cur.includes(P) ? [] : [P]; // mutually exclusive
    else {
      const withoutPnts = cur.filter((t) => t !== P);
      next = withoutPnts.includes(type) ? withoutPnts.filter((t) => t !== type) : [...withoutPnts, type];
    }
    setSub("debtStatusTypes", "types", next);
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

  const hasDebtYes = draft.debtStatusTypes?.hasDebt === "Yes";
  const fhIsPnts = typeof draft.financialReasonForTrading === "string" && draft.financialReasonForTrading === P;

  return (
    <div className="space-y-4">
      <div className="rounded-sm border border-white/8 bg-ink-950/30 p-3 text-[12px] leading-relaxed text-white/55">
        Financial Health (owner-approved spec lock). Answers are saved as <span className="text-white/75">instructor entered for student</span>. “{P}” is available for sensitive questions and is not treated as a negative answer. This section stays high-level; detailed debt records belong in Debt & Credit. HFT does not guarantee trading income; goals do not justify unsafe risk.
      </div>
      {readOnly && <div className="rounded-sm border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-200">Completed snapshot — read only. Financial Health cannot be edited.</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {visibleFields.filter(f=>!missingOnly||missingKeys?.includes(f.key)).map((f) => {
          const v = draft[f.key];
          // 4A: hide debt burden fields when hasDebt is not Yes.
          if ((f.key === "totalDebtRange" || f.key === "monthlyDebtPaymentsRange") && !hasDebtYes) {
            return (
              <div key={f.key} data-field-key={f.key} className="rounded-sm border border-white/6 bg-ink-950/20 p-3 opacity-70">
                <FieldLabel label={f.label} question={f.question} />
                <p className="text-[12px] text-white/45">Shown when debt/repayment obligations = Yes (high-level estimate only).</p>
              </div>
            );
          }
          if (f.control.kind === "select") {
            return (
              <div key={f.key} data-field-key={f.key}>
                <FieldLabel label={f.label} question={f.question} />
                <Select value={typeof v === "string" ? v : ""} onChange={(nv) => setField(f.key, nv)} options={f.control.options} disabled={readOnly} displayLabels={(f.control as any).displayLabels} />
                <Helper text={(f as any).helperText} />
              </div>
            );
          }
          if (f.control.kind === "text") {
            return (
              <div key={f.key} data-field-key={f.key} className="md:col-span-2">
                <FieldLabel label={f.label} question={f.question} />
                <textarea value={fhIsPnts ? "" : typeof v === "string" ? v : ""} onChange={(e) => setField(f.key, e.target.value)} rows={3} disabled={readOnly || fhIsPnts} placeholder={fhIsPnts ? "Prefer not to say selected" : "Share a brief, meaningful response (or select Prefer not to say)"} className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white focus:border-brand-600 focus:outline-none disabled:opacity-50" />
                <div className="mt-2">
                  <button type="button" disabled={readOnly} onClick={() => setField(f.key, fhIsPnts ? "" : P)} className={`rounded-sm border px-2.5 py-1 text-[11px] ${fhIsPnts ? "border-brand-600 bg-brand-600/20 text-white" : "border-white/12 text-white/60 hover:text-white"}`}>{P}</button>
                </div>
                <Helper text={(f as any).helperText} />
              </div>
            );
          }
          if (f.key === "additionalIncome") {
            const has = v?.hasAdditional || "";
            return (
              <div key={f.key} data-field-key={f.key} className="space-y-2">
                <FieldLabel label={f.label} question={f.question} />
                <TogglePills value={has} onChange={(nv) => setSub(f.key, "hasAdditional", nv)} options={f.sub!.hasAdditional.options} disabled={readOnly} />
                {has === "Yes" && <div><div className="mb-1 text-[11px] text-white/45">About how much additional monthly income?</div><Select value={v?.range || ""} onChange={(nv) => setSub(f.key, "range", nv)} options={f.sub!.range.options} disabled={readOnly} /></div>}
              </div>
            );
          }
          if (f.key === "incomeConsistencyPay") {
            return (
              <div key={f.key} data-field-key={f.key} className="space-y-2">
                <FieldLabel label={f.label} question={f.question} />
                <div><div className="mb-1 text-[11px] text-white/45">Income consistency</div><Select value={v?.consistency || ""} onChange={(nv) => setSub(f.key, "consistency", nv)} options={f.sub!.consistency.options} disabled={readOnly} /></div>
                <div><div className="mb-1 text-[11px] text-white/45">Pay frequency</div><Select value={v?.payFrequency || ""} onChange={(nv) => setSub(f.key, "payFrequency", nv)} options={f.sub!.payFrequency.options} disabled={readOnly} /></div>
              </div>
            );
          }
          if (f.key === "upcomingMajorExpenses") {
            const has = v?.hasUpcoming || "";
            return (
              <div key={f.key} data-field-key={f.key} className="space-y-2 md:col-span-2">
                <FieldLabel label={f.label} question={f.question} />
                <TogglePills value={has} onChange={(nv) => setSub(f.key, "hasUpcoming", nv)} options={f.sub!.hasUpcoming.options} disabled={readOnly} />
                {has === "Yes" && <textarea value={v?.note || ""} onChange={(e) => setSub(f.key, "note", e.target.value)} rows={2} placeholder="Briefly describe (high level)" disabled={readOnly} className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white focus:border-brand-600 focus:outline-none disabled:opacity-50" />}
              </div>
            );
          }
          if (f.key === "savingsEmergencyRanges") {
            return (
              <div key={f.key} data-field-key={f.key} className="space-y-2 md:col-span-2">
                <FieldLabel label={f.label} question={f.question} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><div className="mb-1 text-[11px] text-white/55">General savings (not reserved only for emergencies)</div><Select value={v?.savings || ""} onChange={(nv) => setSub(f.key, "savings", nv)} options={f.sub!.savings.options} disabled={readOnly} /></div>
                  <div><div className="mb-1 text-[11px] text-white/55">Emergency fund (set aside for unexpected essential expenses)</div><Select value={v?.emergencyFund || ""} onChange={(nv) => setSub(f.key, "emergencyFund", nv)} options={f.sub!.emergencyFund.options} disabled={readOnly} /></div>
                </div>
                <Helper text={(f as any).helperText} />
              </div>
            );
          }
          if (f.key === "debtStatusTypes") {
            const has = v?.hasDebt || "";
            const types: string[] = Array.isArray(v?.types) ? v.types : [];
            return (
              <div key={f.key} data-field-key={f.key} className="space-y-2 md:col-span-2">
                <FieldLabel label={f.label} question={f.question} />
                <TogglePills value={has} onChange={(nv) => setSub(f.key, "hasDebt", nv)} options={f.sub!.hasDebt.options} disabled={readOnly} />
                {has === "Yes" && (
                  <>
                    <div className="text-[11px] text-white/55">Which types apply? (high-level only)</div>
                    <div className="flex flex-wrap gap-1.5">
                      {FH_ENUM.debtTypes.map((t) => {
                        const active = types.includes(t);
                        return <button key={t} type="button" disabled={readOnly} onClick={() => toggleDebtType(t)} className={`rounded-sm border px-2.5 py-1 text-[11px] transition-colors disabled:opacity-50 ${active ? "border-brand-600 bg-brand-600/20 text-white" : "border-white/12 text-white/60 hover:text-white"}`}>{t}</button>;
                      })}
                    </div>
                    <Helper text={(f as any).helperText} />
                  </>
                )}
                {has && has !== "Yes" && <p className="text-[12px] text-white/45">Debt burden details are not required when debt status is No or Prefer not to say.</p>}
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
              {autosave.status === "saving" ? "Saving..." : "Save Financial Health"}
            </button>
          )}
          <AutosaveStatus status={autosave.status} error={autosave.error || reconcileError} dirty={dirty} conflict={autosave.conflict} onReloadLatest={onReloadLatest} onReconcile={reconcile} />
        </div>
      </div>
    </div>
  );
}
