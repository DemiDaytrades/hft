/** PE-2 pure composer (in-memory). Composes PE-1 derived features; no persistence/API/UI/DB. */
import { ACKNOWLEDGMENT_KEYS } from "../contracts";
import type { InstructorAssessmentV2 } from "../contracts";
import type {
  CapabilityCode,
  DimensionSummary,
  InstructorReviewItem,
  MissingInformationEnvelope,
  OwnedRecommendation,
  PlanComposerContext,
  PlanEngineInput,
  PlanEngineV1Draft,
  ProcessMilestone,
  RecommendationOrigin,
  ReviewItemPriority,
  ScheduleSummary,
} from "./contracts";
import { runPlanEngineV1Pe1 } from "./index";
import { fv, snapshotRef } from "./normalization";

function dedupeMissing(items: MissingInformationEnvelope[]): MissingInformationEnvelope[] {
  const seen = new Set<string>(); const out: MissingInformationEnvelope[] = [];
  for (const i of items) { const k = `${i.source_key}|${i.reason}`; if (seen.has(k)) continue; seen.add(k); out.push(i); }
  return out;
}
function dim<T extends string>(dimension: DimensionSummary<T>["dimension"], ids: string[], features: { result: string; status: any; reasons: any[]; conflicts: any[]; missing_information: any[]; instructor_review_required: boolean }[], headline: T | string): DimensionSummary<T> {
  const reasons = features.flatMap((f) => f.reasons); const conflicts = features.flatMap((f) => f.conflicts);
  const missing = dedupeMissing(features.flatMap((f) => f.missing_information));
  const status = features.some((f) => f.status === "KNOWN") ? (features.some((f) => ["INSUFFICIENT_INFORMATION","UNKNOWN"].includes(f.status)) ? "INSUFFICIENT_INFORMATION" : "KNOWN") : features.find((f) => f.status === "NOT_COLLECTED_FOR_VERSION")?.status || "INSUFFICIENT_INFORMATION";
  return { dimension, derived_feature_ids: ids, headline_result: headline, status: status as any, reasons, conflicts, missing_information: missing, instructor_review_required: features.some((f) => f.instructor_review_required || f.conflicts.length > 0) };
}
function asText(v: unknown): string | undefined {
  if (typeof v === "string" && v.trim()) return v.trim();
  if (Array.isArray(v)) return v.map(String).filter(Boolean).join(", ");
  return undefined;
}
function instructorOwned<T>(value: T, source: string): OwnedRecommendation<T> { return { value, origin: "INSTRUCTOR_SET" as RecommendationOrigin, source, note: "Instructor-owned recommendation from Intake V2 assessment; engine does not override it." }; }
function engineOwned<T>(value: T, note?: string): OwnedRecommendation<T> { return { value, origin: "ENGINE_DERIVED", source: "plan_engine_v1_pe1", note }; }

export function composePlanEngineV1Draft(input: PlanEngineInput, ctx: PlanComposerContext): PlanEngineV1Draft {
  const generated_at = ctx.generated_at || ctx.computed_at;
  const pe1 = runPlanEngineV1Pe1(input, { computed_at: ctx.computed_at, source_snapshot_reference: ctx.source_snapshot_reference });
  const d = pe1.derived_features;
  const s = input.student_sections_json || {};
  const ia = (input.instructor_assessment_json || {}) as Partial<InstructorAssessmentV2> | Record<string, any>;

  const financial = dim("DIM_FINANCIAL_CAPACITY_CAPITAL_SAFETY_V1", ["financial_stability_band_v1","emergency_resilience_band_v1","capital_safety_review_v1","funding_source_safety_review_v1","trading_profit_dependency_review_v1"], [d.financial_stability_band_v1,d.emergency_resilience_band_v1,d.capital_safety_review_v1,d.funding_source_safety_review_v1,d.trading_profit_dependency_review_v1], d.capital_safety_review_v1.result);
  const behavioral = dim("DIM_BEHAVIORAL_READINESS_PROCESS_DISCIPLINE_V1", ["behavioral_discipline_support_band_v1","demo_first_readiness_advisory_v1"], [d.behavioral_discipline_support_band_v1,d.demo_first_readiness_advisory_v1], d.demo_first_readiness_advisory_v1.result);
  const knowledge = dim("DIM_KNOWLEDGE_SKILL_READINESS_V1", ["curriculum_starting_level_v1"], [d.curriculum_starting_level_v1], d.curriculum_starting_level_v1.result);

  const schedule: ScheduleSummary = {
    schedule_realism_band: d.schedule_realism_band_v1.result,
    advisory_cadence: d.schedule_realism_band_v1.result === "CONSISTENCY_REVIEW" ? "Use a limited, flexible educational cadence and confirm a realistic study/check-in rhythm in instructor review." : d.schedule_realism_band_v1.result === "LIMITED_TIME_MINIMUM_PLAN" ? "Use a minimum viable educational cadence focused on consistency over volume." : d.schedule_realism_band_v1.result === "REALISTIC_STEADY_PACE" ? "Use a steady educational cadence aligned with reported availability." : "Availability is insufficiently known; confirm a realistic educational cadence during instructor review.",
    preferred_windows: (fv<any>(s, "windowsAndConsistency")?.preferredWindows) || undefined,
    consistency_context: (fv<any>(s, "windowsAndConsistency")?.consistencyExpectation) || undefined,
    reasons: d.schedule_realism_band_v1.reasons,
    missing_information: d.schedule_realism_band_v1.missing_information,
  };

  const instStarting = asText(fv(ia, "recommendedStartingLevel") ?? (ia as any)?.recommendedStartingLevel?.value ?? (ia as any)?.assessedExperienceLevel?.value);
  const instTrack = asText(fv(ia, "recommendedAcademyTrack") ?? (ia as any)?.recommendedAcademyTrack?.value);
  const instModules = fv(ia, "recommendedModules") ?? (ia as any)?.recommendedModules?.value;
  const instFirst = asText(fv(ia, "recommendedFirstLesson") ?? (ia as any)?.recommendedFirstLesson?.value);

  const caps = new Set<CapabilityCode>();
  if (["FOUNDATIONS"].includes(d.curriculum_starting_level_v1.result) || instStarting) caps.add("CAP_FOUNDATIONS_TERMINOLOGY");
  if (d.curriculum_starting_level_v1.result !== "FOUNDATIONS") caps.add("CAP_MARKET_STRUCTURE_PRICE_ACTION_BASICS");
  caps.add("CAP_RISK_MANAGEMENT_CONCEPTS"); caps.add("CAP_PLATFORM_ONBOARDING"); caps.add("CAP_GUIDED_DEMO_PRACTICE"); caps.add("CAP_JOURNAL_AND_REVIEW"); caps.add("CAP_CHECKLIST_AND_SESSION_RULES");
  if (d.behavioral_discipline_support_band_v1.result !== "FOUNDATION_SUPPORT") caps.add("CAP_PSYCHOLOGY_PROCESS_DISCIPLINE");
  if (d.capital_safety_review_v1.result !== "EDUCATION_DEMO_ONLY_CONTEXT" || d.funding_source_safety_review_v1.instructor_review_required || d.trading_profit_dependency_review_v1.instructor_review_required) caps.add("CAP_FINANCIAL_SAFETY_EDUCATION");
  caps.add("CAP_INSTRUCTOR_REVIEW");

  const practice: string[] = ["Use demo/paper practice and process-focused review before any live-progression consideration.", "Complete a pre-trade checklist and post-trade review for practice sessions.", "Practice missed-trade/no-chase and no-trade-day patience as educational exercises."];
  if (d.behavioral_discipline_support_band_v1.result === "HIGH_STRUCTURE_AND_REVIEW_SUPPORT") practice.push("Use tighter session-stop/cooldown process practice and more frequent instructor check-ins.");
  if (d.curriculum_starting_level_v1.result === "FOUNDATIONS") practice.unshift("Complete platform/demo onboarding and foundational concept study before advanced practice.");

  const journalField = fv<string>(s, "journalReviewPractice");
  const journal: string[] = [];
  if (typeof journalField === "string" && /do not know how/i.test(journalField)) journal.push("Teach a simple journaling/review process and start with a short post-session template.");
  else if (typeof journalField === "string" && /not currently journal\/review, but i am willing to start/i.test(journalField)) journal.push("Start an introductory journal/review routine focused on process observations.");
  else if (typeof journalField === "string" && /journal\/review occasionally/i.test(journalField)) journal.push("Increase consistency of journaling/review using a fixed post-session checklist.");
  else if (typeof journalField === "string" && /journal\/review consistently/i.test(journalField)) journal.push("Maintain current journaling/review routine and review patterns in instructor check-ins.");
  else if (typeof journalField === "string" && /prefer not to answer/i.test(journalField)) journal.push("Offer optional journaling/review education without interpreting non-response negatively.");
  else journal.push("Introduce or maintain an educational journaling/review routine appropriate to the student's experience.");

  const checklist = ["Pre-trade setup criteria (educational/process).","Protective-exit process understanding (no stop-distance/risk/size calculation).","Session-stop/cooldown process.","Missed-trade/no-chase process.","Post-trade review.","No-trade-day discipline."];
  const study = [schedule.advisory_cadence, "Prioritize process, risk concepts, and demo practice; do not set profit/performance targets.", "Use instructor check-ins to confirm pacing and next educational steps."];

  const items: InstructorReviewItem[] = [];
  const addItem = (id: string, priority: ReviewItemPriority, source: string, summary: string, classification: InstructorReviewItem["classification"], related?: string[]) => items.push({ id, priority, source, summary, classification, status: "OPEN", related_source_keys: related });
  for (const c of [...d.capital_safety_review_v1.conflicts, ...d.behavioral_discipline_support_band_v1.conflicts, ...d.demo_first_readiness_advisory_v1.conflicts]) addItem(`conflict:${c.conflict_id}`, c.conflict_id.includes("READINESS") || c.conflict_id.includes("AFFORDABLE_LOSS") || c.conflict_id.includes("CAPITAL_SEPARATION") ? "HIGH_ATTENTION_REVIEW" : "REVIEW_RECOMMENDED", c.conflict_id, c.summary, "instructor_internal", c.source_keys);
  if (d.capital_safety_review_v1.instructor_review_required) addItem("capital_safety_review", d.capital_safety_review_v1.result.includes("SEPARATION") ? "HIGH_ATTENTION_REVIEW" : "REVIEW_RECOMMENDED", "capital_safety_review_v1", `Capital safety context requires instructor review (${d.capital_safety_review_v1.result}).`, "instructor_internal", ["availableTradingCapitalRange","affordableLossRange","liveTradingFundingStatus","tradingCapitalSeparation"]);
  if (d.funding_source_safety_review_v1.instructor_review_required) addItem("funding_source_review", d.funding_source_safety_review_v1.result.includes("ESSENTIAL") ? "HIGH_ATTENTION_REVIEW" : "REVIEW_RECOMMENDED", "funding_source_safety_review_v1", `Funding-source context requires instructor review (${d.funding_source_safety_review_v1.result}).`, "instructor_internal");
  if (d.trading_profit_dependency_review_v1.result === "DEPENDENCY_REVIEW") addItem("dependency_review", "HIGH_ATTENTION_REVIEW", "trading_profit_dependency_review_v1", "Dependency/essential-expense expectation context requires instructor review. Aspirations are not promises or readiness signals.", "instructor_internal");
  if (d.instructor_review_priority_v1.instructor_review_required && !items.length) addItem("routine_review", d.instructor_review_priority_v1.result as ReviewItemPriority, "instructor_review_priority_v1", "Instructor review recommended based on available intake context.", "instructor_internal");

  const milestones: ProcessMilestone[] = [
    { id: "m-foundations", type: "PROCESS_EDUCATIONAL", capability_focus: ["CAP_FOUNDATIONS_TERMINOLOGY","CAP_RISK_MANAGEMENT_CONCEPTS"], title: "Complete foundational education review", description: "Review foundational terminology and risk/process concepts with instructor guidance.", completion_signal: "Instructor confirms foundational concepts were reviewed." },
    { id: "m-demo", type: "PROCESS_EDUCATIONAL", capability_focus: ["CAP_PLATFORM_ONBOARDING","CAP_GUIDED_DEMO_PRACTICE"], title: "Complete guided demo-practice reviews", description: "Practice in demo/paper context and review process decisions.", completion_signal: "Demo practice sessions and reviews are completed with instructor feedback." },
    { id: "m-checklist", type: "PROCESS_EDUCATIONAL", capability_focus: ["CAP_CHECKLIST_AND_SESSION_RULES"], title: "Demonstrate checklist use in demo", description: "Use pre-trade/post-trade and session-process checklists during demo practice.", completion_signal: "Checklist use is observed in educational/demo review." },
    { id: "m-journal", type: "PROCESS_EDUCATIONAL", capability_focus: ["CAP_JOURNAL_AND_REVIEW"], title: "Establish journal/review routine", description: "Maintain an educational journal/review routine appropriate to experience level.", completion_signal: "A repeatable journal/review routine is demonstrated." },
    { id: "m-review", type: "PROCESS_EDUCATIONAL", capability_focus: ["CAP_INSTRUCTOR_REVIEW"], title: "Complete instructor review", description: "Instructor reviews the draft, conflicts, missing information, and next educational steps.", completion_signal: "Instructor review is completed." },
  ];

  const acks = input.acknowledgments_json || {};
  const ackConfirmed = ACKNOWLEDGMENT_KEYS.every((k) => (acks as any)[k] === true);
  const auditRecords = Array.isArray((input.ack_audit_json as any)?.records) ? (input.ack_audit_json as any).records : [];
  const auditConfidence = !input.ack_audit_json && !Object.keys(acks).length ? "UNKNOWN" : ackConfirmed && auditRecords.length >= ACKNOWLEDGMENT_KEYS.length ? "COMPLETE" : ackConfirmed ? "INCOMPLETE" : "UNKNOWN";

  const missing = dedupeMissing([...financial.missing_information, ...behavioral.missing_information, ...knowledge.missing_information, ...schedule.missing_information]);
  const provenance = {
    student_source_fields: Array.from(new Set([...d.financial_stability_band_v1.reasons, ...d.behavioral_discipline_support_band_v1.reasons, ...d.capital_safety_review_v1.reasons, ...d.funding_source_safety_review_v1.reasons, ...d.trading_profit_dependency_review_v1.reasons, ...d.schedule_realism_band_v1.reasons].filter(r=>r.source_owner==="student").map(r=>r.source_key))),
    instructor_source_fields: Array.from(new Set(Object.keys(ia || {}).filter((k)=>k !== "instructorPrivateNotes" && (fv(ia,k) !== undefined || (ia as any)[k]?.value !== undefined)))),
    system_derived_features: Object.keys(d),
    system_flags_context: (input.system_flags_json || []).map((f) => f.rule_id),
  };

  const instructorReviewStatus = d.demo_first_readiness_advisory_v1.instructor_review_required || items.length > 0 || financial.instructor_review_required || behavioral.instructor_review_required || knowledge.instructor_review_required ? "INSTRUCTOR_REVIEW_REQUIRED" : "NOT_REQUIRED";
  const draftStatus = instructorReviewStatus === "INSTRUCTOR_REVIEW_REQUIRED" ? "INSTRUCTOR_REVIEW_REQUIRED" : "DRAFT_GENERATED";

  return {
    source_snapshot_reference: ctx.source_snapshot_reference || snapshotRef(input, generated_at),
    engine_version: "plan_engine_v1",
    schema_version: input.schema_version,
    form_version: input.form_version,
    generated_at,
    dimensions: { financial_capacity_capital_safety: financial, behavioral_readiness_process_discipline: behavioral, knowledge_skill_readiness: knowledge },
    schedule_summary: schedule,
    recommendations: {
      recommended_starting_level: instStarting ? instructorOwned(instStarting, "instructor_assessment") : engineOwned(d.curriculum_starting_level_v1.result, "Derived from PE-1 curriculum starting level; instructor confirms."),
      recommended_education_track: instTrack ? instructorOwned(instTrack, "instructor_assessment") : engineOwned("INSTRUCTOR_REVIEW_EDUCATION_TRACK", "Abstract educational track placeholder; instructor confirms. No Academy module IDs."),
      priority_capabilities: engineOwned(Array.from(caps), "Abstract capability categories only; no Academy module IDs."),
      practice_plan: engineOwned(practice, "Educational/process practice only."),
      study_schedule: engineOwned(study, "Advisory educational cadence only; no appointments, no performance targets."),
      journal_plan: engineOwned(journal, "Educational journaling/review support; PNTS/non-use is not punitive."),
      checklist_plan: engineOwned(checklist, "Educational checklist focus; no stop/risk/lot/size/dollar-loss calculations."),
      demo_first_advisory: engineOwned(d.demo_first_readiness_advisory_v1.result, "Advisory only. Instructor review required before any live-progression consideration. Never approves live trading."),
    },
    instructor_review_items: items,
    milestones,
    missing_information: missing,
    explanations: { derived_features: d },
    acknowledgment_context: { all_required_confirmed: ackConfirmed, audit_confidence: auditConfidence, note: "Acknowledgments are educational/risk disclosures and are not proof of trading readiness, skill, or safe live-trading execution." },
    provenance_summary: provenance,
    draft_status: draftStatus,
    instructor_review_status: instructorReviewStatus,
  };
}
