"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import SmartInstructorReview from "./SmartInstructorReview";
import CaptureForm from "./CaptureForm";
import CompletionPanel from "./CompletionPanel";
import GuidedIntake, { type GuidedIntakeHandle } from "./GuidedIntake";
import ReadinessReview from "./ReadinessReview";
import { ASSESSMENT_STAGES, screenForIssuePath, stageById, type AssessmentStageId } from "./guided-config";
import type { AutosaveFlush } from "./IntakeAutosave";
import { CAPTURE_SECTIONS, INSTRUCTOR_CAPTURE_FIELDS } from "@/lib/student-intake-v2/workflow-fields";
import { Panel } from "@/components/ui";
import { INTAKE_V2_STUDENT_KEYS } from "@/lib/student-intake-v2/contracts";
import { FINANCIAL_HEALTH_FIELDS } from "./financial-health";
import FinancialHealthForm from "./FinancialHealthForm";
import { DEBT_CREDIT_FIELDS } from "./debt-credit";
import DebtCreditForm from "./DebtCreditForm";
import { MONTHLY_OBLIGATIONS_FIELDS } from "./monthly-obligations";
import MonthlyObligationsForm from "./MonthlyObligationsForm";
import { TRADING_CAPITAL_READINESS_FIELDS } from "./trading-capital-readiness";
import TradingCapitalReadinessForm from "./TradingCapitalReadinessForm";
import { TRADING_BEHAVIOR_FIELDS } from "./trading-behavior";
import TradingBehaviorForm from "./TradingBehaviorForm";

type Member = { id: string; name: string | null; email: string };
type IntakeRecord = {
  id: string;
  student_user_id: string;
  booking_id: string | null;
  schema_version: string;
  form_version: string;
  status: string;
  snapshot_version: number;
  student_sections_json?: Record<string, unknown>;
  instructor_assessment_json?: Record<string, unknown>;
  acknowledgments_json?: Record<string, boolean>;
  ack_audit_json?: { records?: unknown[] };
  system_flags_json?: Array<{ rule_id?: string; flag_name?: string; explanation?: string; suggested_instructor_action?: string; source_fields?: string[]; triggering_values?: Array<{ field: string; label?: string; value?: unknown }> }>;
  system_meta_json?: Record<string, unknown>;
  provenance_json?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  completed_at?: string | null;
};

const SECTIONS = [
  {id:"smart-review",label:"Facts, analysis & instructor review"},
  {id:"financial-health",label:"Financial Health"}, {id:"debt-credit",label:"Debt & Credit"},
  {id:"monthly-obligations",label:"Monthly Obligations"}, {id:"trading-capital",label:"Trading Capital, Risk Capacity & Funding Readiness"},
  {id:"trading-behavior",label:"Trading Behavior, Psychology & Discipline"},
  ...CAPTURE_SECTIONS.map(s=>({id:s.id,label:s.label})),
  {id:"acknowledgments",label:"Acknowledgments"}, {id:"review-complete",label:"Review & Complete"},
];

function fmtDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString();
}
function prettyValue(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(prettyValue).join(", ");
  if (typeof v === "object") {
    const obj = v as Record<string, unknown>;
    if ("value" in obj) return prettyValue(obj.value);
    return JSON.stringify(obj, null, 2);
  }
  return String(v);
}

export default function IntakeV2Workspace({
  initialQuery,
  initialMembers,
  initialSelectedStudentId,
  initialScreen,
  initialStage,
}: {
  initialQuery: string;
  initialMembers: Member[];
  initialSelectedStudentId: string;
  initialScreen?: string;
  initialStage?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [studentUserId, setStudentUserId] = useState(initialSelectedStudentId);
  const [screen, setScreen] = useState<string | null>(initialScreen || null);
  const [stage, setStage] = useState<AssessmentStageId>(stageById(initialStage)?.id ?? "questions");
  const [reloadNonce, setReloadNonce] = useState(0);
  const [activeSection, setActiveSection] = useState<(typeof SECTIONS)[number]["id"]>("smart-review");
  const [captureMode, setCaptureMode] = useState<"guided" | "advanced">("guided");
  const [intake, setIntake] = useState<IntakeRecord | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadNote, setLoadNote] = useState<string | null>(null);
  const [noActiveDraft, setNoActiveDraft] = useState(false);
  const [saving,setSaving]=useState(false);
  const [dirty,setDirty]=useState(false);
  const [missingPaths,setMissingPaths]=useState<string[]>([]);
  const [missingOnly,setMissingOnly]=useState(false);
  const [correctionReason,setCorrectionReason]=useState("");
  const [evidenceKind,setEvidenceKind]=useState<"STUDENT_REPORTED"|"INSTRUCTOR_OVERRIDE">("STUDENT_REPORTED");
  const missingKeys=[...new Set(missingPaths.filter(p=>p.startsWith("student_sections.")).map(p=>p.split(".")[1]))];
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const guidedRef = useRef<GuidedIntakeHandle>(null);
  const advancedFlushRef = useRef<AutosaveFlush | null>(null);
  const registerAdvancedFlush = useCallback((flush: AutosaveFlush | null) => {
    advancedFlushRef.current = flush;
  }, []);

  useEffect(()=>{const handler=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue=""}};window.addEventListener("beforeunload",handler);return()=>window.removeEventListener("beforeunload",handler)},[dirty]);
  const selectedIdRef=useRef(studentUserId);
  useEffect(()=>{selectedIdRef.current=studentUserId},[studentUserId]);
  const loadSequence=useRef(0);
  function acceptSaved(next:IntakeRecord){if(next.student_user_id===selectedIdRef.current){setDirty(false);setCorrectionReason("");setEvidenceKind("STUDENT_REPORTED");setIntake(next)}}
  useEffect(()=>{let active=true;if(!intake){setMissingPaths([]);return;}fetch(`/api/admin/student-intake-v2?action=validate&studentUserId=${encodeURIComponent(intake.student_user_id)}&intakeId=${encodeURIComponent(intake.id)}`,{cache:'no-store'}).then(async r=>{const d=await r.json() as {issues?:{path:string}[]};if(active&&r.ok&&Array.isArray(d.issues))setMissingPaths(d.issues.map(i=>i.path))}).catch(()=>{});return()=>{active=false}},[intake?.id,intake?.snapshot_version]);
  const selectedMember = useMemo(() => initialMembers.find((m) => m.id === studentUserId) || null, [initialMembers, studentUserId]);

  function updateScreenUrl(id: string | null, studentId = studentUserId, stageId = stage) {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (studentId) params.set("studentUserId", studentId);
    if (stageId) params.set("stage", stageId);
    if (id) params.set("screen", id);
    const next = params.toString();
    window.history.replaceState(null, "", next ? `${pathname}?${next}` : pathname);
  }

  function handleScreenChange(id: string) {
    setScreen(id);
    updateScreenUrl(id);
  }

  async function switchStage(next: AssessmentStageId) {
    if (next === stage || saving) return;
    if (stage === "questions") {
      if (captureMode === "guided") {
        const flushed = await guidedRef.current?.flush();
        if (flushed === false) return;
      } else if (!(await flushAdvanced())) {
        return;
      }
    }
    setDirty(false);
    setStage(next);
    updateScreenUrl(screen, studentUserId, next);
  }

  function openQuestion(path: string) {
    const target = path === "review-complete" ? "review" : screenForIssuePath(path);
    setCaptureMode("guided");
    setStage("questions");
    setDirty(false);
    if (target) {
      setScreen(target);
      updateScreenUrl(target, studentUserId, "questions");
    } else {
      updateScreenUrl(screen, studentUserId, "questions");
    }
  }

  async function reloadLatest() {
    const id = intake?.id;
    const studentId = intake?.student_user_id;
    if (!id || !studentId) return;
    try {
      const res = await fetch(
        `/api/admin/student-intake-v2?action=get&intakeId=${encodeURIComponent(id)}&studentUserId=${encodeURIComponent(studentId)}`,
        { cache: "no-store", credentials: "same-origin" },
      );
      const json = (await res.json().catch(() => ({}))) as { error?: string; intake?: IntakeRecord };
      if (!res.ok || !json.intake) throw new Error(json.error || "Unable to load the latest saved answers.");
      if (studentId !== selectedIdRef.current) return;
      setDirty(false);
      setSaving(false);
      setLoadError(null);
      setIntake(json.intake);
      setReloadNonce((value) => value + 1);
    } catch (caught) {
      setLoadError(caught instanceof Error ? caught.message : "Unable to load the latest saved answers.");
    }
  }
  const isCompletedReadOnly = intake?.status === "completed" || intake?.status === "superseded" || intake?.status === "archived";
  const progress = useMemo(() => {
    const s = intake?.student_sections_json || {};
    return Math.min(100, Math.round((Object.keys(s).length / INTAKE_V2_STUDENT_KEYS.length) * 100));
  }, [intake]);
  const currentAssessmentStatus = !studentUserId
    ? "Select student"
    : !intake
      ? "No active assessment"
      : noActiveDraft && isCompletedReadOnly
        ? "Historical snapshot — read only"
        : isCompletedReadOnly
          ? "Completed — read only"
          : missingPaths.length > 0
            ? "In progress — questions incomplete"
            : "Questions complete";
  const nextAction = !studentUserId
    ? "Select a student to begin."
    : !intake
      ? "Start a new Intake V2 draft."
      : isCompletedReadOnly
        ? "Review readiness evidence and open the downstream plans."
        : missingPaths.length > 0
          ? `Complete ${missingPaths.length} required question${missingPaths.length === 1 ? "" : "s"}.`
          : "Review readiness and confirm the instructor judgment.";

  async function loadForStudent(id: string) {
    const sequence=++loadSequence.current;
    if (!id) {
      setIntake(null); setLoadState("idle"); setLoadNote(null); setLoadError(null); setNoActiveDraft(false);
      return;
    }
    setIntake(null); setDirty(false);
    setLoadState("loading"); setLoadError(null); setLoadNote(null); setNoActiveDraft(false); setCreateError(null);
    try {
      const draftRes = await fetch(`/api/admin/student-intake-v2?studentUserId=${encodeURIComponent(id)}`, { cache: "no-store", credentials: "same-origin" });
      const draftJson = await draftRes.json().catch(() => ({}));
      if (!draftRes.ok) throw new Error((draftJson as any)?.error || "Failed to load intake");
      if(sequence!==loadSequence.current||id!==selectedIdRef.current)return;
      const active = (draftJson as any)?.intake as IntakeRecord | null;
      if (active) {
        setIntake(active);
        setLoadNote("Loaded active Intake V2 draft.");
        setNoActiveDraft(false);
        setLoadState("loaded");
        setActiveSection("smart-review");
        return;
      }
      const completedRes = await fetch(`/api/admin/student-intake-v2?action=latest-completed&studentUserId=${encodeURIComponent(id)}`, { cache: "no-store", credentials: "same-origin" });
      const completedJson = await completedRes.json().catch(() => ({}));
      if(sequence!==loadSequence.current||id!==selectedIdRef.current)return;
      if (completedRes.ok && (completedJson as any)?.intake) {
        setIntake((completedJson as any).intake);
        setLoadNote("No active draft found; loaded latest completed Intake V2 (read-only). You can start a new Intake V2 if an active draft does not exist.");
        setNoActiveDraft(true); // new draft leaves completed snapshot intact
        setLoadState("loaded");
      } else {
        setIntake(null);
        setLoadNote("No active Intake V2");
        setNoActiveDraft(true);
        setLoadState("loaded");
      }
    } catch (e: any) {
      if(sequence!==loadSequence.current||id!==selectedIdRef.current)return;
      setLoadError(e?.message || "Load failed");
      setLoadState("error");
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => { if (!cancelled) await loadForStudent(studentUserId); })();
    return () => { cancelled = true; };
  }, [studentUserId]);

  async function startIntakeV2() {
    if (!studentUserId || creating) return;
    const targetId=studentUserId;
    setCreating(true); setCreateError(null);
    try {
      const res = await fetch("/api/admin/consultation-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ action: "start", studentId:studentUserId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((json as any)?.error || "Failed to create draft");
      const created = (json as any)?.intake as IntakeRecord;
      if(targetId!==selectedIdRef.current)return;
      setIntake(created); setDirty(false);
      setScreen(null);
      updateScreenUrl(null, targetId);
      setNoActiveDraft(false);
      setLoadState("loaded");
      setLoadNote(created?.id ? `Created/loaded Intake V2 draft (${created.id}, ${created.status}).` : "Draft created.");
      setActiveSection("smart-review");
    } catch (e: any) {
      setCreateError(e?.message || "Failed to create draft");
    } finally {
      setCreating(false);
    }
  }

  async function flushAdvanced(): Promise<boolean> {
    const flush = advancedFlushRef.current;
    if (flush) return flush();
    if (saving) return false;
    if (dirty) return window.confirm("Discard unsaved section changes?");
    return true;
  }
  async function applySearch(e: React.FormEvent) {
    e.preventDefault();
    if(saving)return;
    if(captureMode === "guided") {
      const flushed = await guidedRef.current?.flush();
      if (flushed === false) return;
    } else if(!(await flushAdvanced()))return;
    setDirty(false);
    setScreen(null);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (stage) params.set("stage", stage);
    router.push(`${pathname}?${params.toString()}`);
  }
  async function selectStudent(id: string) {
    if(saving)return;
    if(captureMode === "guided") {
      const flushed = await guidedRef.current?.flush();
      if (flushed === false) return;
    } else if(!(await flushAdvanced()))return;
    setDirty(false);
    setScreen(null);
    selectedIdRef.current=id; loadSequence.current++; setIntake(null);
    setStudentUserId(id);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (id) params.set("studentUserId", id);
    if (stage) params.set("stage", stage);
    router.push(`${pathname}?${params.toString()}`);
  }
  async function switchCaptureMode(mode: "guided" | "advanced") {
    if (mode === captureMode || saving) return;
    if (captureMode === "guided") {
      const flushed = await guidedRef.current?.flush();
      if (flushed === false) return;
    } else if (!(await flushAdvanced())) return;
    setDirty(false);
    setCaptureMode(mode);
  }
  async function selectAdvancedSection(id: string) {
    if (saving || id === activeSection) return;
    if (!(await flushAdvanced())) return;
    setDirty(false);
    setActiveSection(id);
  }

  function editCanonical(path:string){
    if(saving)return;if(dirty&&!window.confirm("Discard unsaved section changes?"))return;
    const key=path.startsWith("student_sections.")?path.split(".")[1]:path;
    let section=path.startsWith("ack")?"acknowledgments":path.startsWith("instructor_")?"smart-review":key;
    const groups:[[string,readonly {key:string}[]],...Array<[string,readonly {key:string}[]]>]=[["financial-health",FINANCIAL_HEALTH_FIELDS],["debt-credit",DEBT_CREDIT_FIELDS],["monthly-obligations",MONTHLY_OBLIGATIONS_FIELDS],["trading-capital",TRADING_CAPITAL_READINESS_FIELDS],["trading-behavior",TRADING_BEHAVIOR_FIELDS]];
    for(const [id,fields] of groups)if(fields.some(f=>f.key===key))section=id;
    for(const group of CAPTURE_SECTIONS)if(group.fields.some(f=>f.key===key))section=group.id;
    setDirty(false);setActiveSection(SECTIONS.some(s=>s.id===section)?section:"smart-review");
  }
  function openAdvancedCanonical(path: string) {
    setStage("questions");
    setCaptureMode("advanced");
    editCanonical(path);
    updateScreenUrl(null, studentUserId, "questions");
  }
  return (
    <div className="space-y-4">
      {dirty&&<p role="status" className="text-amber-300">Unsaved section changes — save before leaving.</p>}
      <Panel>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <form onSubmit={(event) => void applySearch(event)} className="space-y-2">
            <label className="block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">Student selector / search</label>
            <div className="flex gap-2">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or email" className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white focus:border-brand-600 focus:outline-none" />
              <button type="submit" disabled={saving} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 hover:text-white">Search</button>
            </div>
            <select disabled={saving} value={studentUserId} onChange={(e) => void selectStudent(e.target.value)} className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white focus:border-brand-600 focus:outline-none">
              <option value="">Select a student…</option>
              {initialMembers.map((m) => <option key={m.id} value={m.id}>{m.name || "—"} — {m.email}</option>)}
            </select>
          </form>
          <div className="rounded-sm border border-white/8 bg-ink-950/40 p-3 text-[13px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-[11px] uppercase tracking-[0.16em] text-white/45">Status</span>
              <span className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase ${isCompletedReadOnly ? "bg-amber-500/20 text-amber-200" : intake ? "bg-brand-600/20 text-brand-200" : "bg-white/10 text-white/60"}`}>
                {currentAssessmentStatus}
              </span>
              {isCompletedReadOnly && <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-200">COMPLETED — READ ONLY</span>}
            </div>
            <p className="mt-2 text-[12px] text-white/65">
              <span className="font-display text-[10px] uppercase tracking-[0.14em] text-white/45">Next action: </span>
              {nextAction}
            </p>
            {noActiveDraft && intake && (
              <p className="mt-2 text-[12px] text-amber-200/85">
                Historical snapshot loaded read-only.{" "}
                {studentUserId && (
                  <a href={`/admin/students/${encodeURIComponent(studentUserId)}`} className="text-brand-300 underline">
                    View historical questionnaire statuses
                  </a>
                )}
                . Current assessment status is shown separately above.
              </p>
            )}
            <div className="mt-2 grid gap-1 text-white/65 sm:grid-cols-2">
              <div>Student: <span className="text-white">{selectedMember ? `${selectedMember.name || "—"} (${selectedMember.email})` : studentUserId || "—"}</span></div>
              <div>Last saved: <span className="text-white">{fmtDate(intake?.updated_at)}</span></div>
              <div>Intake ID: <span className="font-mono text-[11px] text-white">{intake?.id || "—"}</span></div>
              <div>Schema/Form: <span className="text-white">{intake?.schema_version || "—"} / {intake?.form_version || "—"}</span></div>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-white/45"><span>Captured fields — not validation</span><span>{progress}%</span></div>
              <div className="h-2 rounded bg-white/8"><div className="h-2 rounded bg-brand-600" style={{ width: `${progress}%` }} /></div>
            </div>
            {loadNote && <p className="mt-2 text-[12px] text-white/50">{loadNote}</p>}
            {loadState === "loading" && <p className="mt-2 text-[12px] text-white/50">Loading Intake V2…</p>}
            {loadError && <p className="mt-2 text-[12px] text-red-300">{loadError}</p>}
            {noActiveDraft && studentUserId && (
              <div className="mt-3 rounded-sm border border-white/10 bg-ink-950/60 p-3">
                <p className="text-[13px] text-white/80">No active draft. Completed snapshots remain unchanged.</p>
                <button type="button" disabled={creating||saving} onClick={startIntakeV2} className="mt-2 rounded-sm bg-brand-600 px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-brand-500 disabled:opacity-40">
                  {creating ? "Starting…" : "Start new Intake V2 draft"}
                </button>
                {createError && <p className="mt-2 text-[12px] text-red-300">{createError}</p>}
              </div>
            )}
          </div>
        </div>
      </Panel>

      <Panel className="p-3">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {ASSESSMENT_STAGES.map((item, index) => {
            const active = item.id === stage;
            return (
              <button
                key={item.id}
                type="button"
                disabled={saving}
                aria-current={active ? "step" : undefined}
                onClick={() => void switchStage(item.id)}
                className={`rounded-sm border p-3 text-left transition-colors disabled:opacity-40 ${
                  active
                    ? "border-brand-600 bg-brand-600/20 text-white"
                    : "border-white/10 bg-ink-950/30 text-white/60 hover:border-white/25 hover:text-white"
                }`}
              >
                <span className="block font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-300">
                  Stage {index + 1}
                </span>
                <span className="mt-1 block font-display text-[12px] font-semibold uppercase tracking-[0.08em]">
                  {item.label}
                </span>
                <span className="mt-1 block text-[11px] leading-snug text-white/45">{item.description}</span>
              </button>
            );
          })}
        </div>
      </Panel>

      {stage === "questions" && <Panel className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">Capture mode</p>
            <p className="mt-1 text-[12px] text-white/45">
              Guided intake groups related questions into short screens. Advanced mode keeps the full section editor with the same autosave, conflict, and reload behavior.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {intake && !isCompletedReadOnly && (
              <label className="flex items-center gap-2 text-[12px] text-white/65">
                <input
                  type="checkbox"
                  checked={missingOnly}
                  onChange={(event) => setMissingOnly(event.target.checked)}
                />
                Missing only
              </label>
            )}
            <button
              type="button"
              disabled={saving}
              onClick={() => void switchCaptureMode("guided")}
              className={`rounded-sm border px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] disabled:opacity-40 ${captureMode === "guided" ? "border-brand-600 bg-brand-600/20 text-white" : "border-white/12 text-white/60 hover:text-white"}`}
            >
              Guided intake
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void switchCaptureMode("advanced")}
              className={`rounded-sm border px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] disabled:opacity-40 ${captureMode === "advanced" ? "border-brand-600 bg-brand-600/20 text-white" : "border-white/12 text-white/60 hover:text-white"}`}
            >
              Advanced editor
            </button>
          </div>
        </div>
      </Panel>}

      {stage === "questions" && (captureMode === "guided" ? (
        intake ? (
          <GuidedIntake
            ref={guidedRef}
            key={intake.id}
            record={intake}
            readOnly={isCompletedReadOnly}
            missingPaths={missingPaths}
            missingOnly={missingOnly}
            correctionReason={correctionReason}
            evidenceKind={evidenceKind}
            onSaved={acceptSaved}
            onDirty={setDirty}
            onSaving={setSaving}
            onMissing={setMissingPaths}
            onSwitchToAdvanced={() => setCaptureMode("advanced")}
            initialScreen={screen}
            reloadNonce={reloadNonce}
            onScreenChange={handleScreenChange}
            onReloadLatest={reloadLatest}
          />
        ) : (
          <Panel className="p-4">
            <p className="text-[13px] text-white/60">
              {studentUserId ? "Select or start an Intake V2 draft to begin guided capture." : "Select a student to begin guided intake."}
            </p>
          </Panel>
        )
      ) : (
      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <Panel className="xl:sticky xl:top-4 xl:self-start">
          <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Section Navigation</p>
          <nav className="space-y-1">
            {SECTIONS.map((s) => (
              <button key={s.id} type="button" disabled={saving} onClick={() => void selectAdvancedSection(s.id)} className={`w-full rounded-sm px-2 py-1.5 text-left text-[12px] transition-colors ${activeSection === s.id ? "bg-brand-600/20 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                {s.label}{(s.id === "financial-health" || s.id === "debt-credit" || s.id === "monthly-obligations" || s.id === "trading-capital" || s.id === "trading-behavior") && intake && !isCompletedReadOnly ? " (editable)" : ""}
              </button>
            ))}
          </nav>
          <p className="mt-3 text-[11px] text-white/40">Factual sections save automatically after a pause; the save button saves immediately. Check required information under Review & Complete before finalizing. Approved contracts and prior snapshots are preserved.</p>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em] text-white">{SECTIONS.find((s) => s.id === activeSection)?.label}</h2>
            {intake&&!isCompletedReadOnly&&activeSection!=="smart-review"&&activeSection!=="review-complete"&&activeSection!=="acknowledgments"&&<div className="mt-3 rounded border border-white/15 p-3 text-sm"><label>Evidence source<select className="ml-2 rounded bg-ink-950 p-2" value={evidenceKind} onChange={e=>setEvidenceKind(e.target.value as typeof evidenceKind)}><option value="STUDENT_REPORTED">Student report captured by instructor</option><option value="INSTRUCTOR_OVERRIDE">Instructor correction / override</option></select></label><label className="mt-2 block">Correction/override reason<input className="mt-1 w-full rounded border border-white/20 bg-ink-950 p-2" value={correctionReason} onChange={e=>setCorrectionReason(e.target.value)} placeholder="Required for an instructor override; previous values remain in history"/></label></div>}
            <div className="mt-4">
              {activeSection === "smart-review" || activeSection === "instructor-assessment" ? (
                <SmartInstructorReview key={`${studentUserId}-${reloadNonce}`} studentId={studentUserId} record={intake} onSaved={acceptSaved} onDirty={setDirty} onSaving={setSaving} onEdit={editCanonical} onMissing={setMissingPaths}/>
              ) : activeSection === "financial-health" ? (
                intake ? (
                  <FinancialHealthForm key={`${intake.id}-fh-${reloadNonce}`} intakeId={intake.id} studentUserId={intake.student_user_id} snapshotVersion={intake.snapshot_version} missingOnly={missingOnly} missingKeys={missingKeys} correctionReason={correctionReason} evidenceKind={evidenceKind} onDirty={setDirty} onSaving={setSaving} sections={(intake.student_sections_json || {}) as any} readOnly={isCompletedReadOnly} onSaved={acceptSaved} onReloadLatest={reloadLatest} onRegisterFlush={registerAdvancedFlush} />
                ) : (
                  <p className="text-[13px] text-white/55">{noActiveDraft ? "Start Intake V2 to edit Financial Health." : "Select a student to load or start an Intake V2."}</p>
                )
              ) : activeSection === "debt-credit" ? (
                intake ? (
                  <DebtCreditForm key={`${intake.id}-dc-${reloadNonce}`} intakeId={intake.id} studentUserId={intake.student_user_id} snapshotVersion={intake.snapshot_version} missingOnly={missingOnly} missingKeys={missingKeys} correctionReason={correctionReason} evidenceKind={evidenceKind} onDirty={setDirty} onSaving={setSaving} sections={(intake.student_sections_json || {}) as any} readOnly={isCompletedReadOnly} onSaved={acceptSaved} onReloadLatest={reloadLatest} onRegisterFlush={registerAdvancedFlush} />
                ) : (
                  <p className="text-[13px] text-white/55">{noActiveDraft ? "Start Intake V2 to edit Debt & Credit." : "Select a student to load or start an Intake V2."}</p>
                )
              ) : activeSection === "monthly-obligations" ? (
                intake ? (
                  <MonthlyObligationsForm key={`${intake.id}-mo-${reloadNonce}`} intakeId={intake.id} studentUserId={intake.student_user_id} snapshotVersion={intake.snapshot_version} missingOnly={missingOnly} missingKeys={missingKeys} correctionReason={correctionReason} evidenceKind={evidenceKind} onDirty={setDirty} onSaving={setSaving} sections={(intake.student_sections_json || {}) as any} readOnly={isCompletedReadOnly} onSaved={acceptSaved} onReloadLatest={reloadLatest} onRegisterFlush={registerAdvancedFlush} />
                ) : (
                  <p className="text-[13px] text-white/55">{noActiveDraft ? "Start Intake V2 to edit Monthly Obligations." : "Select a student to load or start an Intake V2."}</p>
                )
              ) : activeSection === "trading-capital" ? (
                intake ? (
                  <TradingCapitalReadinessForm key={`${intake.id}-tc-${reloadNonce}`} intakeId={intake.id} studentUserId={intake.student_user_id} snapshotVersion={intake.snapshot_version} missingOnly={missingOnly} missingKeys={missingKeys} correctionReason={correctionReason} evidenceKind={evidenceKind} onDirty={setDirty} onSaving={setSaving} sections={(intake.student_sections_json || {}) as any} readOnly={isCompletedReadOnly} onSaved={acceptSaved} onReloadLatest={reloadLatest} onRegisterFlush={registerAdvancedFlush} />
                ) : (
                  <p className="text-[13px] text-white/55">{noActiveDraft ? "Start Intake V2 to edit Trading Capital, Risk Capacity & Funding Readiness." : "Select a student to load or start an Intake V2."}</p>
                )
              ) : activeSection === "trading-behavior" ? (
                intake ? (
                  <TradingBehaviorForm key={`${intake.id}-pf-${reloadNonce}`} intakeId={intake.id} studentUserId={intake.student_user_id} snapshotVersion={intake.snapshot_version} missingOnly={missingOnly} missingKeys={missingKeys} correctionReason={correctionReason} evidenceKind={evidenceKind} onDirty={setDirty} onSaving={setSaving} sections={(intake.student_sections_json || {}) as any} readOnly={isCompletedReadOnly} onSaved={acceptSaved} onReloadLatest={reloadLatest} onRegisterFlush={registerAdvancedFlush} />
                ) : (
                  <p className="text-[13px] text-white/55">{noActiveDraft ? "Start Intake V2 to edit Trading Behavior, Psychology & Discipline." : "Select a student to load or start an Intake V2."}</p>
                )
              ) : intake && (activeSection === "review-complete" || activeSection === "acknowledgments") ? (
                <CompletionPanel key={`${intake.id}-${activeSection}-${reloadNonce}`} record={intake} mode={activeSection} readOnly={isCompletedReadOnly} onSaved={acceptSaved} onDirty={setDirty} onSaving={setSaving} onReloadLatest={reloadLatest}/>
              ) : intake ? (
                <CaptureForm missingOnly={missingOnly} missingKeys={missingKeys} correctionReason={correctionReason} evidenceKind={evidenceKind} key={`${intake.id}-${activeSection}-${reloadNonce}`} record={intake} fields={activeSection === "instructor-assessment" ? INSTRUCTOR_CAPTURE_FIELDS : CAPTURE_SECTIONS.find(s=>s.id===activeSection)?.fields || []} instructor={activeSection === "instructor-assessment"} readOnly={isCompletedReadOnly} onSaved={acceptSaved} onDirty={setDirty} onSaving={setSaving} onReloadLatest={reloadLatest} onRegisterFlush={registerAdvancedFlush}/>
              ) : <p>Select a student and open or start an Intake V2 draft.</p>}

            </div>
          </Panel>
          <Panel>
            <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white">Completion / Validation Area</h3>
            <p className="mt-2 text-[13px] text-white/55">Facts, analysis & instructor review derives the summary and lists exact missing items. Save facts and acknowledgments, confirm instructor review, then finalize. Completed snapshots remain immutable.</p>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel className="xl:sticky xl:top-4 xl:self-start">
            <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white">Explainable Flags</h3>
            <p className="mt-1 text-[12px] text-white/45">Staff-only suggestions. No scoring. No automatic restrictions/actions.</p>
            <div className="mt-3 space-y-2">
              {(intake?.system_flags_json || []).length === 0 ? <p className="text-[13px] text-white/40">No flags loaded.</p> : (intake?.system_flags_json || []).map((f, i) => (
                <div key={`${f.rule_id || i}`} className="rounded border border-white/8 bg-ink-950/50 p-3">
                  <div className="font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-white">{f.flag_name || f.rule_id || "Flag"}</div>
                  {f.explanation && <p className="mt-1 text-[12px] text-white/70">{f.explanation}</p>}
                  {!!f.triggering_values?.length && <div className="mt-2 text-[11px] text-white/50"><div className="uppercase tracking-[0.12em]">Triggering/source</div><ul className="mt-1 list-disc pl-4">{f.triggering_values.map((t, j) => <li key={j}>{t.label || t.field}: {prettyValue(t.value)}</li>)}</ul></div>}
                  {f.suggested_instructor_action && <p className="mt-2 text-[12px] text-brand-200/90"><span className="text-white/45">Suggested action: </span>{f.suggested_instructor_action}</p>}
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white">Acknowledgments Panel</h3>
            <p className="mt-1 text-[12px] text-white/45">Capture genuine student confirmations in Acknowledgments. Audit metadata is recorded by the server.</p>
            <div className="mt-3 text-[13px] text-white/70"><div>Records: <span className="text-white">{(intake?.ack_audit_json as any)?.records?.length ?? 0}</span></div><div>Confirmed keys: <span className="text-white">{Object.entries(intake?.acknowledgments_json || {}).filter(([, v]) => v === true).length}</span></div></div>
          </Panel>
        </div>
      </div>
      ))}

      {stage === "readiness" && (
        intake ? (
          <ReadinessReview
            key={`${intake.id}-readiness-${reloadNonce}`}
            studentId={intake.student_user_id}
            record={intake}
            onEdit={openQuestion}
            onMissing={setMissingPaths}
          />
        ) : (
          <Panel className="p-4">
            <p className="text-[13px] text-white/60">
              {studentUserId
                ? "Start or load an Intake V2 assessment to review readiness evidence."
                : "Select a student to review readiness evidence."}
            </p>
          </Panel>
        )
      )}

      {stage === "instructor" && (
        intake ? (
          <SmartInstructorReview
            key={`${intake.id}-instructor-${reloadNonce}`}
            studentId={intake.student_user_id}
            record={intake}
            onSaved={acceptSaved}
            onDirty={setDirty}
            onSaving={setSaving}
            onEdit={openAdvancedCanonical}
            onMissing={setMissingPaths}
          />
        ) : (
          <Panel className="p-4">
            <p className="text-[13px] text-white/60">
              {studentUserId
                ? "Start or load an Intake V2 assessment to record instructor review."
                : "Select a student to record instructor review."}
            </p>
          </Panel>
        )
      )}

      {stage === "plans" && (
        <Panel className="p-4 sm:p-5">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-300">
            Plans & Decisions
          </p>
          <h2 className="mt-1 font-display text-[20px] font-bold uppercase tracking-[0.03em] text-white">
            Authoritative downstream workspaces
          </h2>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-white/55">
            Financial readiness and the personalized learning path remain separate instructor-reviewed workflows.
            This shell links to them without changing their approvals, calculations, or source rules.
          </p>
          {studentUserId ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <a
                href={`/admin/financial-plan?studentId=${encodeURIComponent(studentUserId)}`}
                className="rounded-sm border border-white/12 bg-ink-950/40 p-4 text-white transition-colors hover:border-brand-500/50"
              >
                <span className="block font-display text-[12px] font-semibold uppercase tracking-[0.12em]">
                  Financial Readiness
                </span>
                <span className="mt-1 block text-[12px] text-white/55">
                  Review, approve, and publish the financial / trading readiness plan.
                </span>
              </a>
              <a
                href={`/admin/learning-path?studentId=${encodeURIComponent(studentUserId)}`}
                className="rounded-sm border border-white/12 bg-ink-950/40 p-4 text-white transition-colors hover:border-brand-500/50"
              >
                <span className="block font-display text-[12px] font-semibold uppercase tracking-[0.12em]">
                  Personalized Learning Path
                </span>
                <span className="mt-1 block text-[12px] text-white/55">
                  Review, require demonstration, override with reason, and approve.
                </span>
              </a>
            </div>
          ) : (
            <p className="mt-3 text-[13px] text-white/60">Select a student to open downstream plans.</p>
          )}
        </Panel>
      )}
    </div>
  );
}
