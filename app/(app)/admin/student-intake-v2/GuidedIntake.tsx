"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Panel } from "@/components/ui";
import { CAPTURE_SECTIONS } from "@/lib/student-intake-v2/workflow-fields";
import CaptureForm from "./CaptureForm";
import CompletionPanel from "./CompletionPanel";
import DebtCreditForm from "./DebtCreditForm";
import FinancialHealthForm from "./FinancialHealthForm";
import GuidedScreenShell from "./GuidedScreen";
import MonthlyObligationsForm from "./MonthlyObligationsForm";
import SmartInstructorReview from "./SmartInstructorReview";
import TradingBehaviorForm from "./TradingBehaviorForm";
import TradingCapitalReadinessForm from "./TradingCapitalReadinessForm";
import type { AutosaveFlush } from "./IntakeAutosave";
import {
  GUIDED_SCREENS,
  GUIDED_SECTIONS,
  fieldKeyForIssuePath,
  firstMissingScreen,
  screenById,
  screenForIssuePath,
  screenQuestionCount,
  type GuidedScreen,
} from "./guided-config";

type EvidenceKind = "STUDENT_REPORTED" | "INSTRUCTOR_OVERRIDE";

export type GuidedIntakeHandle = {
  flush: () => Promise<boolean>;
};

const TRACKED_SCREENS = GUIDED_SCREENS.filter((item) => item.renderer !== "welcome");

function pathLabel(path: string): string {
  return path
    .replace(/^student_sections\./, "")
    .replace(/^acknowledgments\./, "")
    .replace(/^ack_audit\./, "")
    .replace(/^instructor_assessment\./, "")
    .replace(/^instructor_review$/, "Instructor review")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replaceAll(".", " › ")
    .replace(/^./, (character) => character.toUpperCase());
}

const GuidedIntake = forwardRef<GuidedIntakeHandle, {
  record: any;
  readOnly: boolean;
  missingPaths: string[];
  missingOnly?: boolean;
  correctionReason?: string;
  evidenceKind?: EvidenceKind;
  onSaved: (intake: any) => void;
  onDirty: (dirty: boolean) => void;
  onSaving: (saving: boolean) => void;
  onMissing: (paths: string[]) => void;
  onSwitchToAdvanced?: () => void;
  initialScreen?: string | null;
  reloadNonce?: number;
  onScreenChange?: (id: string) => void;
  onReloadLatest?: () => void | Promise<void>;
}>(function GuidedIntake({
  record,
  readOnly,
  missingPaths,
  missingOnly = false,
  correctionReason,
  evidenceKind,
  onSaved,
  onDirty,
  onSaving,
  onMissing,
  onSwitchToAdvanced,
  initialScreen,
  reloadNonce = 0,
  onScreenChange,
  onReloadLatest,
}, ref) {
  const initialScreenId = initialScreen && screenById(initialScreen) ? initialScreen : GUIDED_SCREENS[0].id;
  const [screenId, setScreenId] = useState(initialScreenId);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingIssue, setPendingIssue] = useState<string | null>(null);
  const initialized = useRef(Boolean(initialScreen && screenById(initialScreen)));
  const flushRef = useRef<AutosaveFlush | null>(null);
  const navigatingRef = useRef(false);
  const registerFlush = useCallback((flush: AutosaveFlush | null) => {
    flushRef.current = flush;
  }, []);

  useImperativeHandle(ref, () => ({
    flush: async () => {
      const flush = flushRef.current;
      if (flush) return flush();
      if (saving) return false;
      if (dirty) return window.confirm("Discard unsaved changes on this screen?");
      return true;
    },
  }), [dirty, saving]);

  const screen = screenById(screenId) ?? GUIDED_SCREENS[0];
  const screenIndex = GUIDED_SCREENS.findIndex((candidate) => candidate.id === screen.id);
  const section = GUIDED_SECTIONS.find((candidate) => candidate.id === screen.section);
  const screenMissing = useMemo(
    () => missingPaths.filter((path) => screenForIssuePath(path) === screen.id),
    [missingPaths, screen.id],
  );
  const missingFieldKeys = useMemo(
    () =>
      [
        ...new Set(
          missingPaths
            .filter((path) => path.startsWith("student_sections."))
            .map((path) => path.split(".")[1])
            .filter(Boolean),
        ),
      ],
    [missingPaths],
  );
  const missingAckKeys = useMemo(
    () =>
      missingPaths
        .filter((path) => path.startsWith("acknowledgments.") || path.startsWith("ack_audit."))
        .map((path) => path.split(".")[1])
        .filter(Boolean),
    [missingPaths],
  );
  const sectionStats = useMemo(
    () =>
      GUIDED_SECTIONS.map((candidate) => {
        const screens = TRACKED_SCREENS.filter((item) => item.section === candidate.id);
        const complete = screens.filter(
          (item) => !missingPaths.some((path) => screenForIssuePath(path) === item.id),
        ).length;
        return { ...candidate, complete, total: screens.length };
      }),
    [missingPaths],
  );
  const completedScreens = sectionStats.reduce((sum, item) => sum + item.complete, 0);
  const progress = Math.round((completedScreens / TRACKED_SCREENS.length) * 100);
  const currentSection = sectionStats.find((candidate) => candidate.id === screen.section);

  useEffect(() => {
    if (initialized.current || missingPaths.length === 0) return;
    const first = firstMissingScreen(missingPaths);
    if (first) {
      setScreenId(first);
      initialized.current = true;
    }
  }, [missingPaths]);

  useEffect(
    () => () => {
      onDirty(false);
      onSaving(false);
    },
    [onDirty, onSaving],
  );

  function handleDirty(next: boolean) {
    setDirty(next);
    onDirty(next);
  }

  function handleSaving(next: boolean) {
    setSaving(next);
    onSaving(next);
  }

  function handleSaved(intake: any) {
    setDirty(false);
    onDirty(false);
    onSaved(intake);
  }

  const focusIssue = useCallback((path: string) => {
    const key = fieldKeyForIssuePath(path);
    if (!key) return;
    const node = Array.from(document.querySelectorAll<HTMLElement>("[data-field-key]")).find(
      (candidate) => candidate.dataset.fieldKey === key,
    );
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    node.classList.add("outline", "outline-2", "outline-brand-500");
    const focusable = node.querySelector<HTMLElement>("select, textarea, input, button");
    focusable?.focus({ preventScroll: true });
    setTimeout(() => node.classList.remove("outline", "outline-2", "outline-brand-500"), 2200);
  }, []);

  useEffect(() => {
    if (!pendingIssue) return;
    const timer = setTimeout(() => {
      focusIssue(pendingIssue);
      setPendingIssue(null);
    }, 80);
    return () => clearTimeout(timer);
  }, [focusIssue, pendingIssue, screenId]);

  async function goTo(id: string) {
    if (id === screen.id || navigatingRef.current) return;
    navigatingRef.current = true;
    try {
      const flush = flushRef.current;
      if (flush) {
        const saved = await flush();
        if (!saved) return;
      } else {
        if (saving) return;
        if (dirty && !window.confirm("Discard unsaved changes on this screen?")) return;
      }
      setDirty(false);
      onDirty(false);
      initialized.current = true;
      setScreenId(id);
      onScreenChange?.(id);
    } finally {
      navigatingRef.current = false;
    }
  }

  function goToIssue(path: string) {
    if (path === "review-complete") {
      void goTo("review");
      return;
    }
    const id = screenForIssuePath(path);
    if (!id) return;
    if (id === screen.id) {
      focusIssue(path);
      return;
    }
    setPendingIssue(path);
    void goTo(id);
  }

  function goToSection(id: string) {
    const first =
      TRACKED_SCREENS.find((candidate) => candidate.section === id) ??
      GUIDED_SCREENS.find((candidate) => candidate.section === id);
    if (first) void goTo(first.id);
  }

  function back() {
    if (screenIndex > 0) void goTo(GUIDED_SCREENS[screenIndex - 1].id);
  }

  function next() {
    if (screenIndex < GUIDED_SCREENS.length - 1) void goTo(GUIDED_SCREENS[screenIndex + 1].id);
  }

  async function openAdvanced() {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    try {
      const flush = flushRef.current;
      if (flush) {
        const saved = await flush();
        if (!saved) return;
      } else {
        if (saving) return;
        if (dirty && !window.confirm("Discard unsaved changes on this screen?")) return;
      }
      setDirty(false);
      onDirty(false);
      onSwitchToAdvanced?.();
    } finally {
      navigatingRef.current = false;
    }
  }

  function renderScreen(current: GuidedScreen) {
    const key = `${record.id}-${current.id}-${reloadNonce}`;
    if (
      missingOnly &&
      !["welcome", "review", "instructor-review"].includes(current.renderer) &&
      screenMissing.length === 0
    ) {
      return (
        <p className="text-[13px] text-white/55">
          No missing required items map to this screen. Turn off Missing only to review or edit optional answers.
        </p>
      );
    }
    if (current.renderer === "welcome") {
      return (
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-white/65">
            This guided view keeps related questions together and uses the existing approved Intake V2 fields.
            Factual answers save automatically after you pause, and you can still use the save button on each screen.
            Unknown information stays blank.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {sectionStats.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void goToSection(item.id)}
                className="rounded-sm border border-white/10 bg-ink-950/40 px-3 py-2 text-left text-[12px] text-white/70 transition-colors hover:border-white/25 hover:text-white"
              >
                <span className="block font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-white/45">
                  {item.complete} of {item.total} screens complete
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void next()}
              className="rounded-sm bg-brand-600 px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-brand-500"
            >
              Start guided intake
            </button>
            {missingPaths.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const first = firstMissingScreen(missingPaths);
                  if (first) void goTo(first);
                }}
                className="rounded-sm border border-white/15 px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 hover:text-white"
              >
                Jump to first missing item
              </button>
            )}
          </div>
        </div>
      );
    }

    if (current.renderer === "capture") {
      const captureSection = CAPTURE_SECTIONS.find((candidate) => candidate.id === current.captureSectionId);
      if (!captureSection) return <p className="text-red-300">Unknown capture section.</p>;
      return (
        <CaptureForm
          key={key}
          fields={captureSection.fields}
          fieldKeys={current.fields}
          missingOnly={missingOnly}
          missingKeys={missingFieldKeys}
          partKeys={current.parts}
          record={record}
          readOnly={readOnly}
          correctionReason={correctionReason}
          evidenceKind={evidenceKind}
          onSaved={handleSaved}
          onDirty={handleDirty}
          onSaving={handleSaving}
          onReloadLatest={onReloadLatest}
          onRegisterFlush={registerFlush}
        />
      );
    }

    if (current.renderer === "financial-health") {
      return (
        <FinancialHealthForm
          key={key}
          intakeId={record.id}
          studentUserId={record.student_user_id}
          snapshotVersion={record.snapshot_version}
          sections={record.student_sections_json || {}}
          fieldKeys={current.fields}
          missingOnly={missingOnly}
          missingKeys={missingFieldKeys}
          readOnly={readOnly}
          correctionReason={correctionReason}
          evidenceKind={evidenceKind}
          onSaved={handleSaved}
          onDirty={handleDirty}
          onSaving={handleSaving}
          onReloadLatest={onReloadLatest}
          onRegisterFlush={registerFlush}
        />
      );
    }

    if (current.renderer === "monthly-obligations") {
      return (
        <MonthlyObligationsForm
          key={key}
          intakeId={record.id}
          studentUserId={record.student_user_id}
          snapshotVersion={record.snapshot_version}
          sections={record.student_sections_json || {}}
          fieldKeys={current.fields}
          missingOnly={missingOnly}
          missingKeys={missingFieldKeys}
          readOnly={readOnly}
          correctionReason={correctionReason}
          evidenceKind={evidenceKind}
          onSaved={handleSaved}
          onDirty={handleDirty}
          onSaving={handleSaving}
          onReloadLatest={onReloadLatest}
          onRegisterFlush={registerFlush}
        />
      );
    }

    if (current.renderer === "debt-credit") {
      return (
        <DebtCreditForm
          key={key}
          intakeId={record.id}
          studentUserId={record.student_user_id}
          snapshotVersion={record.snapshot_version}
          sections={record.student_sections_json || {}}
          fieldKeys={current.fields}
          missingOnly={missingOnly}
          missingKeys={missingFieldKeys}
          readOnly={readOnly}
          correctionReason={correctionReason}
          evidenceKind={evidenceKind}
          onSaved={handleSaved}
          onDirty={handleDirty}
          onSaving={handleSaving}
          onReloadLatest={onReloadLatest}
          onRegisterFlush={registerFlush}
        />
      );
    }

    if (current.renderer === "trading-capital") {
      return (
        <TradingCapitalReadinessForm
          key={key}
          intakeId={record.id}
          studentUserId={record.student_user_id}
          snapshotVersion={record.snapshot_version}
          sections={record.student_sections_json || {}}
          fieldKeys={current.fields}
          missingOnly={missingOnly}
          missingKeys={missingFieldKeys}
          readOnly={readOnly}
          correctionReason={correctionReason}
          evidenceKind={evidenceKind}
          onSaved={handleSaved}
          onDirty={handleDirty}
          onSaving={handleSaving}
          onReloadLatest={onReloadLatest}
          onRegisterFlush={registerFlush}
        />
      );
    }

    if (current.renderer === "trading-behavior") {
      return (
        <TradingBehaviorForm
          key={key}
          intakeId={record.id}
          studentUserId={record.student_user_id}
          snapshotVersion={record.snapshot_version}
          sections={record.student_sections_json || {}}
          fieldKeys={current.fields}
          missingOnly={missingOnly}
          missingKeys={missingFieldKeys}
          readOnly={readOnly}
          correctionReason={correctionReason}
          evidenceKind={evidenceKind}
          onSaved={handleSaved}
          onDirty={handleDirty}
          onSaving={handleSaving}
          onReloadLatest={onReloadLatest}
          onRegisterFlush={registerFlush}
        />
      );
    }

    if (current.renderer === "acknowledgments") {
      const ackKeys = missingOnly
        ? (current.ackKeys ?? []).filter((ackKey) => missingAckKeys.includes(ackKey))
        : current.ackKeys;
      if (missingOnly && ackKeys?.length === 0) {
        return <p className="text-[13px] text-white/55">No missing acknowledgments on this screen.</p>;
      }
      return (
        <CompletionPanel
          key={key}
          record={record}
          mode="acknowledgments"
          ackKeys={ackKeys}
          readOnly={readOnly}
          onSaved={handleSaved}
          onDirty={handleDirty}
          onSaving={handleSaving}
          onGoToIssue={goToIssue}
          onReloadLatest={onReloadLatest}
        />
      );
    }

    if (current.renderer === "review") {
      return (
        <CompletionPanel
          key={key}
          record={record}
          mode="review-complete"
          readOnly={readOnly}
          onSaved={handleSaved}
          onDirty={handleDirty}
          onSaving={handleSaving}
          onGoToIssue={goToIssue}
          onReloadLatest={onReloadLatest}
        />
      );
    }

    if (current.renderer === "instructor-review") {
      return (
        <SmartInstructorReview
          key={key}
          studentId={record.student_user_id}
          record={record}
          onSaved={handleSaved}
          onDirty={handleDirty}
          onSaving={handleSaving}
          onEdit={goToIssue}
          onMissing={onMissing}
        />
      );
    }

    return <p className="text-red-300">Unknown guided screen.</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_280px]">
      <Panel className="hidden h-fit p-3 lg:sticky lg:top-4 lg:block">
        <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
          Guided sections
        </p>
        <nav className="space-y-1">
          {sectionStats.map((item) => {
            const active = item.id === screen.section;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => void goToSection(item.id)}
                className={`w-full rounded-sm px-2 py-1.5 text-left text-[12px] transition-colors ${
                  active ? "bg-brand-600/20 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span>{item.label}</span>
                  <span className="text-[10px] text-white/40">
                    {item.complete}/{item.total}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-white/8 pt-3">
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-white/40">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded bg-white/8">
            <div className="h-2 rounded bg-brand-600" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-white/40">
            {completedScreens} of {TRACKED_SCREENS.length} screens clear of missing required items.
          </p>
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel className="p-3 lg:hidden">
          <label className="block font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
            Section
          </label>
          <select
            aria-label="Guided section"
            value={screen.section}
            onChange={(event) => void goToSection(event.target.value)}
            className="mt-1 w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white focus:border-brand-600 focus:outline-none"
          >
            {GUIDED_SECTIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Panel>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/45">
          <span>
            Screen {screenIndex + 1} of {GUIDED_SCREENS.length}
            {currentSection ? ` · ${currentSection.label}` : ""}
          </span>
          <span>{completedScreens} of {TRACKED_SCREENS.length} clear</span>
        </div>
        <div className="h-2 rounded bg-white/8">
          <div className="h-2 rounded bg-brand-600" style={{ width: `${progress}%` }} />
        </div>

        <GuidedScreenShell
          screen={screen}
          sectionLabel={section?.label ?? screen.section}
          questionCount={screenQuestionCount(screen)}
          missingCount={screenMissing.length}
        >
          {renderScreen(screen)}
        </GuidedScreenShell>

        <Panel className="sticky bottom-2 z-10 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md lg:static lg:shadow-none lg:backdrop-blur-none">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div role="status" aria-live="polite" className="text-[11px] text-white/50">
              {saving
                ? "Saving…"
                : dirty
                  ? "Unsaved changes on this screen."
                  : "No unsaved changes on this screen."}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void back()}
                disabled={screenIndex === 0 || saving}
                className="rounded-sm border border-white/15 px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 hover:text-white disabled:opacity-40"
              >
                Back
              </button>
              {screenIndex < GUIDED_SCREENS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => void next()}
                  disabled={saving}
                  className="rounded-sm bg-brand-600 px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-brand-500 disabled:opacity-40"
                >
                  Continue
                </button>
              ) : onSwitchToAdvanced ? (
                <button
                  type="button"
                  onClick={() => void openAdvanced()}
                  disabled={saving}
                  className="rounded-sm border border-white/15 px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75 hover:text-white disabled:opacity-40"
                >
                  Open advanced editor
                </button>
              ) : null}
            </div>
          </div>
        </Panel>
      </div>

      <div className="hidden space-y-4 xl:block">
        <Panel className="p-4">
          <h3 className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
            On this screen
          </h3>
          <p className="mt-1 text-[12px] text-white/45">
            {screenMissing.length === 0
              ? "No missing required items map to this screen."
              : `${screenMissing.length} missing required item${screenMissing.length === 1 ? "" : "s"}.`}
          </p>
          {screenMissing.length > 0 && (
            <>
              <ul className="mt-3 space-y-2">
                {screenMissing.map((path) => (
                  <li key={path}>
                    <button
                      type="button"
                      onClick={() => goToIssue(path)}
                      className="text-left text-[12px] text-brand-200 underline decoration-brand-600/40 underline-offset-2 hover:text-brand-100"
                    >
                      {pathLabel(path)}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => goToIssue(screenMissing[0])}
                className="mt-3 rounded-sm border border-white/15 px-3 py-1.5 text-[11px] text-white/75 hover:text-white"
              >
                Go to first missing item
              </button>
            </>
          )}
        </Panel>

        <Panel className="p-4">
          <h3 className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
            Section progress
          </h3>
          <div className="mt-3 space-y-2">
            {sectionStats.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between text-[11px] text-white/55">
                  <span>{item.label}</span>
                  <span>
                    {item.complete}/{item.total}
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded bg-white/8">
                  <div
                    className="h-1.5 rounded bg-brand-600"
                    style={{ width: `${item.total === 0 ? 0 : Math.round((item.complete / item.total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {(record.system_flags_json || []).length > 0 && (
          <Panel className="p-4">
            <h3 className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
              Advisory flags
            </h3>
            <div className="mt-2 space-y-2">
              {(record.system_flags_json || []).slice(0, 3).map((flag: any, index: number) => (
                <div key={flag.rule_id || index} className="rounded-sm border border-white/8 bg-ink-950/40 p-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
                    {flag.flag_name || flag.rule_id || "Flag"}
                  </p>
                  {flag.explanation && <p className="mt-1 text-[11px] text-white/55">{flag.explanation}</p>}
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
});

export default GuidedIntake;
