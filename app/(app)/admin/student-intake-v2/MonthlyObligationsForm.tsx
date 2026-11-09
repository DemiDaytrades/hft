"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { type StudentSectionsV2 } from "@/lib/student-intake-v2/contracts";
import { mergeReconciledValues, shouldApplyServerValues, type IntakeSaveResult } from "@/lib/student-intake-v2/autosave";
import {
  MO_HOUSING_HIDE_RANGE_STATUSES,
  MO_HOUSING_RANGE_REQUIRED_STATUSES,
  MO_NOT_SURE,
  MO_OPTIONS,
  MO_OTHER_NOTE_MAX,
  MO_PNTS,
} from "@/lib/student-intake-v2/monthly-obligations-registry";
import { MONTHLY_OBLIGATIONS_FIELDS } from "./monthly-obligations";
import { AutosaveStatus, fetchLatestIntake, useIntakeAutosave, type AutosaveFlush } from "./IntakeAutosave";
function fv<T>(v: T | undefined) { return v === undefined ? undefined : { value: v }; }
function val<T>(field: { value: T } | undefined): T | undefined { return field?.value; }

function FieldLabel({ label, question, moId }: { label: string; question?: string; moId?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">{moId ? `${moId} · ${label}` : label}</label>
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

export default function MonthlyObligationsForm({
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
    () => (fieldKeys ? MONTHLY_OBLIGATIONS_FIELDS.filter((field) => fieldKeys.includes(field.key)) : MONTHLY_OBLIGATIONS_FIELDS),
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
  function setObj(key: string, patch: Record<string, any>, omitWhen?: (next: Record<string, any>) => Record<string, any>) {
    setDraft((d) => {
      const prev = d[key] && typeof d[key] === "object" ? { ...d[key] } : {};
      let next = { ...prev, ...patch };
      if (omitWhen) next = omitWhen(next);
      return { ...d, [key]: next };
    });
    editVersion.current += 1;
    editedKeys.current.add(key);
    setReconcileError("");
  }
  function toggleIncomeSource(option: string) {
    const cur = Array.isArray(draft.householdIncomeSources) ? [...draft.householdIncomeSources] : [];
    const mutex = new Set([MO_PNTS, MO_NOT_SURE, "No regular income source right now"]);
    let next: string[];
    if (mutex.has(option)) next = cur.includes(option) ? [] : [option];
    else {
      const noMutex = cur.filter((v) => !mutex.has(v));
      next = noMutex.includes(option) ? noMutex.filter((v) => v !== option) : [...noMutex, option];
    }
    setField("householdIncomeSources", next.filter((v) => MO_OPTIONS.incomeSources.includes(v as any)));
  }

  function cleanForSave(key: string, value: any): any {
    if (value === undefined) return undefined;
    if (key === "housingSituationPayment" && value && typeof value === "object") {
      const status = value.status;
      if (!status) return value;
      if (MO_HOUSING_HIDE_RANGE_STATUSES.has(status) || !MO_HOUSING_RANGE_REQUIRED_STATUSES.has(status)) return { status };
      return value.monthlyRange ? { status, monthlyRange: value.monthlyRange } : { status };
    }
    if (key === "transportationObligationRange" && value && typeof value === "object") {
      const has = value.hasTransportationCost;
      if (has !== "Yes") return has ? { hasTransportationCost: has } : value;
      return value.monthlyRange ? { hasTransportationCost: has, monthlyRange: value.monthlyRange } : { hasTransportationCost: has };
    }
    if (key === "dependentSupportObligation" && value && typeof value === "object") {
      const has = value.hasDependentSupportCost;
      if (has !== "Yes") return has ? { hasDependentSupportCost: has } : value;
      return value.monthlyRange ? { hasDependentSupportCost: has, monthlyRange: value.monthlyRange } : { hasDependentSupportCost: has };
    }
    if (key === "otherRecurringObligations" && value && typeof value === "object") {
      const has = value.hasOtherObligations;
      if (has !== "Yes") return has ? { hasOtherObligations: has } : value;
      const next: any = { hasOtherObligations: has };
      if (value.monthlyRange) next.monthlyRange = value.monthlyRange;
      if (typeof value.note === "string" && value.note.trim()) next.note = value.note.slice(0, MO_OTHER_NOTE_MAX);
      return next;
    }
    return value;
  }

  function valuesFromIntake(intake: any) {
    const next: Record<string, any> = {};
    for (const f of visibleFields) next[f.key] = val(intake?.student_sections_json?.[f.key]);
    return next;
  }

  async function persist(draftToSave = draftRef.current, version = expectedVersion.current): Promise<IntakeSaveResult> {
    const payloadSections: Partial<StudentSectionsV2> = {};
    for (const f of visibleFields) {
      const v = cleanForSave(f.key, draftToSave[f.key]);
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

  const incomeSources: string[] = Array.isArray(draft.householdIncomeSources) ? draft.householdIncomeSources : [];

  return (
    <div className="space-y-4">
      <div className="rounded-sm border border-white/8 bg-ink-950/30 p-3 text-[12px] leading-relaxed text-white/55">
        Monthly Obligations &amp; Cash Flow (Phase 3D, local additive). Educational planning/decision support only. This collects facts for future recommendations and does not decide how much a student should trade. Non-disclosure and $0/None/Not applicable answers are valid where specified and do not automatically indicate high risk, instability, or unsuitability. Conditional fields are omitted when not applicable (no fake values).
      </div>
      {readOnly && <div className="rounded-sm border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-200">Completed snapshot — read only. Monthly Obligations cannot be edited.</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {visibleFields.filter(f=>!missingOnly||missingKeys?.includes(f.key)).map((f) => {
          const v = draft[f.key];
          if (f.control.kind === "multiselect") {
            return (
              <div key={f.key} data-field-key={f.key} className="md:col-span-2">
                <FieldLabel moId={f.moId} label={f.label} question={f.question} />
                <div className="flex flex-wrap gap-1.5">
                  {f.control.options.map((o) => {
                    const active = incomeSources.includes(o);
                    return <button key={o} type="button" disabled={readOnly} onClick={() => toggleIncomeSource(o)} className={`rounded-sm border px-2.5 py-1 text-[11px] transition-colors disabled:opacity-50 ${active ? "border-brand-600 bg-brand-600/20 text-white" : "border-white/12 text-white/60 hover:text-white"}`}>{o}</button>;
                  })}
                </div>
                <Helper text={(f as any).helperText} />
              </div>
            );
          }
          if (f.control.kind === "select") {
            return (
              <div key={f.key} data-field-key={f.key}>
                <FieldLabel moId={f.moId} label={f.label} question={f.question} />
                <Select value={typeof v === "string" ? v : ""} onChange={(nv) => setField(f.key, nv)} options={f.control.options} disabled={readOnly} />
                <Helper text={(f as any).helperText} />
              </div>
            );
          }
          if (f.key === "housingSituationPayment") {
            const status = v?.status || "";
            const showRange = MO_HOUSING_RANGE_REQUIRED_STATUSES.has(status);
            return (
              <div key={f.key} data-field-key={f.key} className="space-y-2 md:col-span-2">
                <FieldLabel moId={f.moId} label={f.label} question={f.question} />
                <Select value={status} onChange={(nv) => setObj(f.key, { status: nv }, (n) => (MO_HOUSING_HIDE_RANGE_STATUSES.has(n.status) || !MO_HOUSING_RANGE_REQUIRED_STATUSES.has(n.status)) ? { status: n.status } : n)} options={MO_OPTIONS.housingStatus} disabled={readOnly} />
                {showRange && <div><div className="mb-1 text-[11px] text-white/45">Monthly housing payment/contribution range</div><Select value={v?.monthlyRange || ""} onChange={(nv) => setObj(f.key, { monthlyRange: nv })} options={MO_OPTIONS.housingRange} disabled={readOnly} /></div>}
                {!showRange && status && <p className="text-[12px] text-white/45">Monthly housing range is omitted when not applicable.</p>}
                <Helper text={(f as any).helperText} />
              </div>
            );
          }
          if (f.key === "transportationObligationRange") {
            const has = v?.hasTransportationCost || "";
            return (
              <div key={f.key} data-field-key={f.key} className="space-y-2">
                <FieldLabel moId={f.moId} label={f.label} question={f.question} />
                <Select value={has} onChange={(nv) => setObj(f.key, { hasTransportationCost: nv }, (n) => n.hasTransportationCost !== "Yes" ? { hasTransportationCost: n.hasTransportationCost } : n)} options={MO_OPTIONS.transportationStatus} disabled={readOnly} />
                {has === "Yes" && <div><div className="mb-1 text-[11px] text-white/45">Monthly transportation range</div><Select value={v?.monthlyRange || ""} onChange={(nv) => setObj(f.key, { monthlyRange: nv })} options={MO_OPTIONS.transportationRange} disabled={readOnly} /></div>}
                <Helper text={(f as any).helperText} />
              </div>
            );
          }
          if (f.key === "dependentSupportObligation") {
            const has = v?.hasDependentSupportCost || "";
            return (
              <div key={f.key} data-field-key={f.key} className="space-y-2">
                <FieldLabel moId={f.moId} label={f.label} question={f.question} />
                <Select value={has} onChange={(nv) => setObj(f.key, { hasDependentSupportCost: nv }, (n) => n.hasDependentSupportCost !== "Yes" ? { hasDependentSupportCost: n.hasDependentSupportCost } : n)} options={MO_OPTIONS.dependentStatus} disabled={readOnly} />
                {has === "Yes" && <div><div className="mb-1 text-[11px] text-white/45">Monthly dependent-support range</div><Select value={v?.monthlyRange || ""} onChange={(nv) => setObj(f.key, { monthlyRange: nv })} options={MO_OPTIONS.dependentRange} disabled={readOnly} /></div>}
                <Helper text={(f as any).helperText} />
              </div>
            );
          }
          if (f.key === "otherRecurringObligations") {
            const has = v?.hasOtherObligations || "";
            const note = typeof v?.note === "string" ? v.note : "";
            return (
              <div key={f.key} data-field-key={f.key} className="space-y-2 md:col-span-2">
                <FieldLabel moId={f.moId} label={f.label} question={f.question} />
                <Select value={has} onChange={(nv) => setObj(f.key, { hasOtherObligations: nv }, (n) => n.hasOtherObligations !== "Yes" ? { hasOtherObligations: n.hasOtherObligations } : n)} options={MO_OPTIONS.otherObligationsStatus} disabled={readOnly} />
                {has === "Yes" && (
                  <>
                    <div><div className="mb-1 text-[11px] text-white/45">Monthly range for other recurring obligations</div><Select value={v?.monthlyRange || ""} onChange={(nv) => setObj(f.key, { monthlyRange: nv })} options={MO_OPTIONS.otherObligationsRange} disabled={readOnly} /></div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-[11px] text-white/45"><span>Optional high-level note (no creditor names, account numbers, medical/legal/sensitive details)</span><span>{note.length}/{MO_OTHER_NOTE_MAX}</span></div>
                      <textarea value={note} onChange={(e) => setObj(f.key, { note: e.target.value.slice(0, MO_OTHER_NOTE_MAX) })} rows={2} maxLength={MO_OTHER_NOTE_MAX} disabled={readOnly} placeholder="Optional: brief, high-level only (max 140 characters)" className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white focus:border-brand-600 focus:outline-none disabled:opacity-50" />
                    </div>
                  </>
                )}
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
              {autosave.status === "saving" ? "Saving..." : "Save Monthly Obligations"}
            </button>
          )}
          <AutosaveStatus status={autosave.status} error={autosave.error || reconcileError} dirty={dirty} conflict={autosave.conflict} onReloadLatest={onReloadLatest} onReconcile={reconcile} />
        </div>
      </div>
    </div>
  );
}
