"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel } from "@/components/ui";
import type { getReviewWorkspace } from "@/lib/consultation-review/service";
import type { CanonicalFact } from "@/lib/consultation-review/canonical";
import { judgmentFields } from "@/lib/consultation-review/model";

type Workspace = Awaited<ReturnType<typeof getReviewWorkspace>>;

const label = (value: string) => value.replaceAll("_", " ").replace(/([a-z])([A-Z])/g, "$1 $2");

function display(value: unknown): string {
  if (value == null) return "Not collected";
  if (Array.isArray(value)) return value.map(display).join(", ");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => `${label(key)}: ${display(item)}`)
      .join("; ");
  }
  return String(value);
}

const READINESS_GROUPS: Array<{ title: string; keys: string[] }> = [
  {
    title: "Background and life context",
    keys: [
      "preferredName",
      "location",
      "timeZone",
      "occupation",
      "employmentType",
      "workScheduleSummary",
      "majorResponsibilities",
      "dependentsRange",
      "majorObligations90d",
    ],
  },
  {
    title: "Goals and motivation",
    keys: [
      "currentLifeGoal",
      "motivationAndWhyNow",
      "currentObstacle",
      "goalImmediate",
      "goals30_60_90",
      "goals6_12",
      "goalBig",
      "goalWhy",
      "successDefinition",
      "desiredTradingIncomeRange",
      "financialReasonForTrading",
      "membershipValue",
      "disengageRisk",
    ],
  },
  {
    title: "Schedule and availability",
    keys: ["weeklyAvailability", "unavailableDays", "weeklyHoursRange", "windowsAndConsistency", "scheduleObligationsNote"],
  },
  {
    title: "Trading experience and knowledge",
    keys: [
      "marketsExperience",
      "demoLiveExperience",
      "liveAccountSizeRange",
      "knowledgeMatrix",
      "platformsBrokerExperience",
      "priorEducation",
      "majorNegativeExperience",
      "biggestTradingConfusion",
      "resultsDrivers",
      "lossCauseBelief",
    ],
  },
  {
    title: "Behavior and discipline",
    keys: [
      "behaviorMatrix",
      "behaviorTendencies",
      "reactionToLoss",
      "reactionToWin",
      "willingDemoFirst",
      "willingRiskLimits",
      "disciplineBreakers",
      "selfStrength",
      "liveTradingReadinessSelfAssessment",
      "situationalLossResponse",
      "situationalWinStreakResponse",
      "missedTradeFomoResponse",
      "unplannedTradeFrequency",
      "plannedLossLimitStopAdherence",
      "willingToPauseLiveTradingAndReturnToDemo",
      "protectiveExitBehavior",
      "noTradeDayAcceptance",
      "journalReviewPractice",
    ],
  },
  {
    title: "Learning needs and support",
    keys: [
      "learningStyles",
      "paceAndQuestionComfort",
      "homeworkPreference",
      "accountabilityFeedback",
      "overwhelmTriggers",
      "whatHelpsClick",
      "chartFeedbackHelpful",
      "devicesInternet",
      "platformAccess",
      "supportTechReadiness",
      "techLimitations",
    ],
  },
];

const FINANCIAL_SUMMARY_KEYS = [
  "monthlyTakeHomeRange",
  "disposableIncomeRange",
  "savingsEmergencyRanges",
  "debtStatusTypes",
  "availableTradingCapitalRange",
  "affordableLossRange",
  "pressureToMakeMoneyQuickly",
  "liveTradingFundingStatus",
  "borrowedCreditFundingIntent",
  "tradingProfitsForEssentialExpensesExpectation",
];

function Facts({ facts, showSources = false }: { facts: CanonicalFact[]; showSources?: boolean }) {
  return (
    <dl className="grid gap-3 md:grid-cols-2">
      {facts.map((fact, index) => (
        <div className="rounded-sm border border-white/10 bg-ink-950/30 p-3" key={`${fact.key}-${index}`}>
          <dt className="font-semibold text-white">{fact.label}</dt>
          <dd className="mt-1 whitespace-pre-wrap text-[13px] text-white/70">{display(fact.value)}</dd>
          <dd className="mt-2 break-words text-[11px] text-white/40">
            {fact.kind}
            {fact.sources.some((source) => source.evidenceKind === "HISTORICAL_STUDENT_REPORTED")
              ? " · HISTORICAL_STUDENT_REPORTED"
              : ""}
          </dd>
          {showSources && fact.sources.length > 0 && (
            <dd className="mt-1 break-words text-[10px] text-white/30">
              {fact.sources
                .map(
                  (source) =>
                    `${source.kind}:${source.path}${source.revision == null ? "" : `@${source.revision}`}`,
                )
                .join(" / ")}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}

export default function ReadinessReview({
  studentId,
  record,
  onEdit,
  onMissing,
}: {
  studentId: string;
  record: any;
  onEdit: (path: string) => void;
  onMissing: (paths: string[]) => void;
}) {
  const [data, setData] = useState<Workspace | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setData(null);
    setError("");
    fetch(`/api/admin/consultation-review?studentId=${encodeURIComponent(studentId)}`, { cache: "no-store" })
      .then(async (response) => {
        const body = (await response.json()) as Workspace & { error?: string };
        if (!response.ok) throw new Error(body.error || "Unable to load readiness review.");
        if (!active) return;
        setData(body);
        onMissing(body.validation.issues.map((issue) => issue.path));
      })
      .catch((caught) => {
        if (active) setError(caught instanceof Error ? caught.message : "Unable to load readiness review.");
      });
    return () => {
      active = false;
    };
  }, [onMissing, record?.id, record?.snapshot_version, studentId]);

  const instructorNotes = useMemo(
    () =>
      judgmentFields
        .map((key) => ({ key, value: record?.instructor_assessment_json?.[key]?.value }))
        .filter((item) => item.value != null && String(item.value).trim()),
    [record?.instructor_assessment_json],
  );

  if (!studentId) {
    return <p className="text-[13px] text-white/55">Select a student to review readiness evidence.</p>;
  }
  if (!data) {
    return (
      <Panel className="p-4">
        {error ? (
          <p role="alert" className="text-red-300">
            {error}
          </p>
        ) : (
          <p className="text-[13px] text-white/55">Preparing the readiness review from saved evidence…</p>
        )}
      </Panel>
    );
  }

  const requiredMissing = data.validation.issues;
  const factByKey = new Map(data.projection.facts.map((fact) => [fact.key, fact]));
  const factsFor = (keys: string[]) => keys.flatMap((key) => (factByKey.has(key) ? [factByKey.get(key)!] : []));
  const readinessGroups = READINESS_GROUPS.map((group) => ({ ...group, facts: factsFor(group.keys) }));
  const financialSummaryFacts = factsFor(FINANCIAL_SUMMARY_KEYS);
  const financialFacts = data.projection.facts.filter((fact) => fact.categories.includes("FINANCIAL_READINESS_INPUT"));
  const status = record?.status ?? data.intake?.status ?? "No active assessment";
  const nextAction = requiredMissing.length
    ? `Complete ${requiredMissing.length} required question${requiredMissing.length === 1 ? "" : "s"}.`
    : "Review the readiness evidence and confirm the instructor judgment.";
  const privateLegacy = data.projection.unmapped.filter((fact) => fact.categories.includes("INSTRUCTOR_PRIVATE"));
  const studentLegacy = data.projection.unmapped.filter((fact) => !fact.categories.includes("INSTRUCTOR_PRIVATE"));

  return (
    <div className="space-y-4">
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-300">
              Readiness Review
            </p>
            <h2 className="mt-1 font-display text-[20px] font-bold uppercase tracking-[0.03em] text-white">
              What the evidence shows
            </h2>
            <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-white/55">
              Derived from saved student answers. Unknown remains unknown. Financial and educational analysis is
              advisory and does not approve live trading or certify mastery.
            </p>
          </div>
          <div className="rounded-sm border border-white/12 bg-ink-950/50 px-3 py-2 text-right">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">Current assessment</p>
            <p className="mt-1 text-[12px] font-semibold uppercase text-white">{status}</p>
          </div>
        </div>
        <div className="mt-4 rounded-sm border border-brand-500/25 bg-brand-600/5 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-200">Next action</p>
          <p className="mt-1 text-[13px] text-white/75">{nextAction}</p>
          {requiredMissing.length > 0 && (
            <button
              type="button"
              onClick={() => onEdit(requiredMissing[0].path)}
              className="mt-3 rounded-sm border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-white/80 hover:text-white"
            >
              Open first missing question
            </button>
          )}
        </div>
      </Panel>

      <Panel className="p-4 sm:p-5">
        <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white">
          Background, goals, and schedule
        </h3>
        <div className="mt-3 space-y-4">
          {readinessGroups.slice(0, 3).map((group) =>
            group.facts.length ? (
              <section key={group.title}>
                <h4 className="font-semibold text-white">{group.title}</h4>
                <div className="mt-2">
                  <Facts facts={group.facts} />
                </div>
              </section>
            ) : null,
          )}
          {!readinessGroups.slice(0, 3).some((group) => group.facts.length) && (
            <p className="text-[13px] text-white/55">
              No canonical responses recorded yet. Unknown is not No, zero, None, or mastery.
            </p>
          )}
        </div>
      </Panel>

      <Panel className="p-4 sm:p-5">
        <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white">
          Trading experience, behavior, and learning needs
        </h3>
        <div className="mt-3 space-y-4">
          {readinessGroups.slice(3).map((group) =>
            group.facts.length ? (
              <section key={group.title}>
                <h4 className="font-semibold text-white">{group.title}</h4>
                <div className="mt-2">
                  <Facts facts={group.facts} />
                </div>
              </section>
            ) : null,
          )}
          {!readinessGroups.slice(3).some((group) => group.facts.length) && (
            <p className="text-[13px] text-white/55">No trading experience, behavior, or learning-needs answers recorded yet.</p>
          )}
        </div>
      </Panel>

      <Panel className="p-4 sm:p-5">
        <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white">
          Financial considerations
        </h3>
        {financialSummaryFacts.length > 0 && (
          <div className="mt-3">
            <Facts facts={financialSummaryFacts} />
          </div>
        )}
        {financialFacts.length > 0 && (
          <details className="mt-3 rounded-sm border border-white/10 bg-ink-950/30 p-3">
            <summary className="cursor-pointer text-[12px] font-semibold text-brand-200">
              All financial inputs ({financialFacts.length})
            </summary>
            <div className="mt-3">
              <Facts facts={financialFacts} />
            </div>
          </details>
        )}
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <article className="rounded-sm border border-white/10 bg-ink-950/30 p-3">
            <h4 className="font-semibold text-white">Educational readiness</h4>
            <p className="mt-2 text-[13px] text-white/75">
              {data.recommendation.overall ?? "INSUFFICIENT EVIDENCE"} — {data.recommendation.reason}
            </p>
            <p className="mt-2 text-[11px] text-white/45">
              Self-report, instructor observation, and demonstrated evidence remain separate.
            </p>
          </article>
          <article className="rounded-sm border border-white/10 bg-ink-950/30 p-3">
            <h4 className="font-semibold text-white">Missing before finalization</h4>
            <p className="mt-2 text-[13px] text-white/75">
              {requiredMissing.length
                ? `${requiredMissing.length} required item${requiredMissing.length === 1 ? "" : "s"} remain.`
                : "No blocking required items in the current saved source."}
            </p>
            <p className="mt-2 text-[11px] text-white/45">
              Advisory unknowns: {data.financial.missing.length}. Optional or declined context is not a finalization
              blocker.
            </p>
          </article>
        </div>

        <div className="mt-4 space-y-2">
          {Object.entries(
            data.financial.findings as Record<
              string,
              { result: string; status: string; reasons: Array<{ source_key: string; display_value?: unknown }> }
            >,
          ).map(([key, finding]) => (
            <article key={key} className="rounded-sm border border-white/10 bg-ink-950/30 p-3">
              <p className="font-semibold text-white">{label(key)}</p>
              <p className="mt-1 text-[13px] text-white/70">
                {label(finding.result)} · {finding.status}
              </p>
              <p className="mt-1 text-[11px] text-white/45">
                {finding.reasons
                  .map((reason) => `${reason.source_key}: ${display(reason.display_value)}`)
                  .join(" / ")}
              </p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel className="p-4 sm:p-5">
        <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white">
          Required information
        </h3>
        {requiredMissing.length ? (
          <ul className="mt-3 space-y-2">
            {requiredMissing.map((issue, index) => (
              <li key={`${issue.path}-${index}`} className="rounded-sm border border-amber-400/20 p-3">
                <p className="text-[13px] text-white/75">{issue.message}</p>
                <button
                  type="button"
                  onClick={() => onEdit(issue.path)}
                  className="mt-1 text-left text-[11px] text-brand-200 underline"
                >
                  {issue.path}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[13px] text-emerald-300">All saved information passes completion validation.</p>
        )}
      </Panel>

      <Panel className="p-4 sm:p-5">
        <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white">
          Historical questionnaire context
        </h3>
        <p className="mt-1 text-[12px] text-white/50">
          Historical questionnaire status is separate from the current assessment status. Original answers remain
          unchanged and are reused only where their meaning is verified.
        </p>
        {data.legacyCompleted && (
          <p className="mt-3 rounded-sm border border-amber-400/30 bg-amber-500/10 p-3 text-[12px] text-amber-100">
            A legacy questionnaire is completed. This does not establish Intake V2 completeness.
          </p>
        )}
        <details className="mt-3 rounded-sm border border-white/10 bg-ink-950/30 p-3">
          <summary className="cursor-pointer text-[12px] font-semibold text-brand-200">
            Known historical answers and confirmation needs
          </summary>
          {studentLegacy.some((fact) => fact.reviewReason) && (
            <div className="mt-3 space-y-2">
              {studentLegacy
                .filter((fact) => fact.reviewReason)
                .map((fact, index) => (
                  <div key={`${fact.key}-${index}`} className="rounded-sm border border-amber-300/20 p-2">
                    <Facts facts={[fact]} />
                    <p className="mt-2 text-[12px] text-amber-100">
                      {fact.historicalClassification}: {fact.reviewReason}
                    </p>
                  </div>
                ))}
            </div>
          )}
          <div className="mt-3">
            <Facts facts={studentLegacy} />
          </div>
        </details>
      </Panel>

      <details className="rounded-lg border border-white/10 bg-ink-900/80 p-4">
        <summary className="cursor-pointer font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
          Instructor-only evidence and source references
        </summary>
        <p className="mt-2 text-[12px] text-white/50">
          Protected review context. Keep these observations and technical references separate from student-reported
          answers.
        </p>
        <div className="mt-4 space-y-4">
          <section>
            <h4 className="font-semibold text-white">Review flags ({data.intake?.system_flags_json?.length ?? 0})</h4>
            {data.intake?.system_flags_json?.length ? (
              <ul className="mt-2 space-y-2">
                {data.intake.system_flags_json.map((flag: any, index: number) => (
                  <li key={flag.rule_id ?? index} className="rounded-sm border border-white/10 p-2 text-[12px]">
                    <strong>{flag.flag_name ?? flag.rule_id ?? "Flag"}</strong>
                    {flag.explanation && <span className="block text-white/55">{flag.explanation}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-[12px] text-white/45">No explainable flags loaded.</p>
            )}
          </section>

          {!!data.projection.conflicts.length && (
            <section>
              <h4 className="font-semibold text-white">Conflicts requiring review</h4>
              <div className="mt-2 space-y-2">
                {data.projection.conflicts.map((conflict, index) => (
                  <div key={`${conflict.key}-${index}`} className="rounded-sm border border-amber-400/25 p-2 text-[12px]">
                    <strong>{conflict.key}</strong>
                    <p>Canonical: {display(conflict.canonical)}</p>
                    <p>Other recorded evidence: {display(conflict.reported)}</p>
                    <p className="text-white/55">{conflict.reason}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h4 className="font-semibold text-white">Instructor observations and private notes</h4>
            {instructorNotes.length ? (
              <ul className="mt-2 space-y-2">
                {instructorNotes.map((note) => (
                  <li key={note.key} className="rounded-sm border border-white/10 p-2 text-[12px]">
                    <strong>{label(note.key)}:</strong> {display(note.value)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-[12px] text-white/45">No instructor observations saved yet.</p>
            )}
          </section>

          <section>
            <h4 className="font-semibold text-white">All canonical facts and source references</h4>
            <div className="mt-2">
              <Facts facts={data.projection.facts} showSources />
            </div>
          </section>

          {privateLegacy.length > 0 && (
            <section>
              <h4 className="font-semibold text-white">Private historical context</h4>
              <div className="mt-2">
                <Facts facts={privateLegacy} />
              </div>
            </section>
          )}

          {data.history.length > 0 && (
            <section>
              <h4 className="font-semibold text-white">Correction history</h4>
              <div className="mt-2 space-y-2">
                {data.history.map((event) => (
                  <article key={event.id} className="rounded-sm border border-white/10 p-2 text-[11px]">
                    <p>
                      {event.event_type} · {event.actor_user_id} · {event.created_at}
                    </p>
                    <pre className="mt-2 overflow-auto whitespace-pre-wrap">{JSON.stringify(event.payload, null, 2)}</pre>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </details>
    </div>
  );
}
