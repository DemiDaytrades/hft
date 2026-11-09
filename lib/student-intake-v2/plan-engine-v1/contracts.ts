/**
 * PE-1 Plan Engine V1 contracts/types (pure, no persistence).
 * Advisory, explainable, instructor-reviewed. NO automatic live-trading approval.
 * NO return/profit/leverage/lot/position-size/funding-amount calculations.
 */
import type { ExplainableFlag, InstructorAssessmentV2, IntakeV2Status, StudentSectionsV2 } from "../contracts";

export type PlanEngineValueStatus =
  | "KNOWN"
  | "UNKNOWN"
  | "NOT_APPLICABLE"
  | "INSUFFICIENT_INFORMATION"
  | "NOT_COLLECTED_FOR_VERSION";

export type SourceValueCategory =
  | "EXACT_CATEGORY"
  | "RANGE_SELECTED"
  | "PNTS"
  | "NOT_SURE"
  | "BEGINNER_NO_EXPERIENCE"
  | "MISSING"
  | "NOT_COLLECTED_FOR_VERSION"
  | "CONFLICTING";

export type ExplanationContribution = "SUPPORTS" | "CONTEXT" | "REQUIRES_REVIEW" | "MISSING_INFO";

export type ConflictType = "SELF_REPORT_TRIANGULATION" | "STUDENT_INSTRUCTOR_DIFFERENCE" | "VERSION_GAP";

export type PlanEngineDimension =
  | "DIM_FINANCIAL_CAPACITY_CAPITAL_SAFETY_V1"
  | "DIM_BEHAVIORAL_READINESS_PROCESS_DISCIPLINE_V1"
  | "DIM_KNOWLEDGE_SKILL_READINESS_V1";

export type ProvenanceReference = {
  intake_id: string;
  field: string;
  source?: "student_reported" | "instructor_entered_for_student" | "instructor_assessment" | "system_derived";
  entered_by_user_id?: string | null;
  entered_at?: string | null;
};

export type ExplanationReason = {
  source_key: string;
  source_owner: "student" | "instructor" | "system";
  source_value_category: SourceValueCategory;
  display_value?: string;
  provenance_reference?: ProvenanceReference;
  contribution: ExplanationContribution;
  note: string;
};

export type ConflictEnvelope = {
  conflict_id: string;
  type: ConflictType;
  source_keys: string[];
  summary: string;
  resolution: "NONE_PRESERVE_ALL";
  instructor_review_required: boolean;
  provenance_references?: ProvenanceReference[];
};

export type MissingInformationEnvelope = {
  source_key: string;
  reason: PlanEngineValueStatus | "PNTS";
  impact: string;
};

export type SourceSnapshotReference = {
  intake_id: string;
  snapshot_version?: number;
  completed_at?: string | null;
  form_version: string;
  schema_version: string;
  status?: IntakeV2Status | string;
};

export type DerivedFeatureCommonEnvelope<TResult extends string = string> = {
  derived_id: string;
  version: "v1";
  dimension: PlanEngineDimension;
  result: TResult;
  status: PlanEngineValueStatus;
  reasons: ExplanationReason[];
  conflicts: ConflictEnvelope[];
  missing_information: MissingInformationEnvelope[];
  safety_notes: string[];
  source_snapshot_reference: SourceSnapshotReference;
  computed_at: string;
  deterministic: true;
  instructor_review_required: boolean;
};

export type PlanEngineInput = {
  intake_id: string;
  student_user_id?: string;
  status?: IntakeV2Status | string;
  snapshot_version?: number;
  completed_at?: string | null;
  form_version: string;
  schema_version: string;
  student_sections_json: StudentSectionsV2;
  instructor_assessment_json?: InstructorAssessmentV2 | Record<string, unknown> | null;
  system_flags_json?: ExplainableFlag[] | null;
  acknowledgments_json?: Record<string, boolean> | null;
  ack_audit_json?: { records?: unknown[] } | null;
  provenance_json?: Record<string, any> | null;
};

export type PlanEngineContext = {
  computed_at: string;
  source_snapshot_reference?: SourceSnapshotReference;
};

export type FinancialStabilityBandResult = "STABLE_ENOUGH_TO_PLAN" | "MIXED_VARIABILITY" | "CASH_FLOW_PRESSURE_REVIEW" | "INSUFFICIENT_INFORMATION";
export type EmergencyResilienceBandResult = "BUFFER_PRESENT" | "LIMITED_BUFFER" | "FRAGILE_BUFFER_REVIEW" | "INSUFFICIENT_INFORMATION";
export type CapitalSafetyReviewResult = "EDUCATION_DEMO_ONLY_CONTEXT" | "LIMITED_DISCRETIONARY_CONTEXT_REVIEW" | "CAPITAL_SEPARATION_REVIEW" | "INSUFFICIENT_INFORMATION";
export type FundingSourceSafetyReviewResult = "NO_CONCERNING_SOURCES_REPORTED" | "BORROWED_OR_CREDIT_CONTEXT_REPORTED" | "ESSENTIAL_OR_EMERGENCY_SOURCE_REVIEW" | "INSUFFICIENT_INFORMATION";
export type TradingProfitDependencyReviewResult = "NO_DEPENDENCY_REPORTED" | "MIXED_OR_UNCLEAR" | "DEPENDENCY_REVIEW" | "INSUFFICIENT_INFORMATION";
export type BehavioralDisciplineSupportBandResult = "FOUNDATION_SUPPORT" | "MODERATE_STRUCTURE_SUPPORT" | "HIGH_STRUCTURE_AND_REVIEW_SUPPORT" | "INSUFFICIENT_INFORMATION";
export type DemoFirstReadinessAdvisoryResult = "EDUCATION_DEMO_FIRST_SUPPORTED" | "INSTRUCTOR_REVIEW_BEFORE_PROGRESSION_CONSIDERATION" | "INSUFFICIENT_INFORMATION";
export type ScheduleRealismBandResult = "REALISTIC_STEADY_PACE" | "LIMITED_TIME_MINIMUM_PLAN" | "CONSISTENCY_REVIEW" | "INSUFFICIENT_INFORMATION";
export type CurriculumStartingLevelResult = "FOUNDATIONS" | "RISK_AND_PROCESS_FOUNDATIONS" | "PLATFORM_AND_DEMO_PRACTICE" | "GUIDED_REVIEW_PATH" | "INSTRUCTOR_DEFINED" | "INSUFFICIENT_INFORMATION";
export type InstructorReviewPriorityResult = "ROUTINE" | "REVIEW_RECOMMENDED" | "HIGH_ATTENTION_REVIEW" | "INSUFFICIENT_INFORMATION";

export type Pe1DerivedFeatures = {
  financial_stability_band_v1: DerivedFeatureCommonEnvelope<FinancialStabilityBandResult>;
  emergency_resilience_band_v1: DerivedFeatureCommonEnvelope<EmergencyResilienceBandResult>;
  capital_safety_review_v1: DerivedFeatureCommonEnvelope<CapitalSafetyReviewResult>;
  funding_source_safety_review_v1: DerivedFeatureCommonEnvelope<FundingSourceSafetyReviewResult>;
  trading_profit_dependency_review_v1: DerivedFeatureCommonEnvelope<TradingProfitDependencyReviewResult>;
  behavioral_discipline_support_band_v1: DerivedFeatureCommonEnvelope<BehavioralDisciplineSupportBandResult>;
  demo_first_readiness_advisory_v1: DerivedFeatureCommonEnvelope<DemoFirstReadinessAdvisoryResult>;
  schedule_realism_band_v1: DerivedFeatureCommonEnvelope<ScheduleRealismBandResult>;
  curriculum_starting_level_v1: DerivedFeatureCommonEnvelope<CurriculumStartingLevelResult>;
  instructor_review_priority_v1: DerivedFeatureCommonEnvelope<InstructorReviewPriorityResult>;
};

export type Pe1Output = {
  engine: "plan_engine_v1_pe1";
  version: "v1";
  source_snapshot_reference: SourceSnapshotReference;
  computed_at: string;
  derived_features: Pe1DerivedFeatures;
};


// ===================== PE-2 (pure, in-memory) =====================

export type PlanDraftStatus = "DRAFT_GENERATED" | "INSTRUCTOR_REVIEW_REQUIRED";
export type RecommendationOrigin = "ENGINE_DERIVED" | "INSTRUCTOR_SET" | "INSTRUCTOR_CONFIRMED" | "INSTRUCTOR_ADJUSTED";
export type ReviewItemPriority = "ROUTINE" | "REVIEW_RECOMMENDED" | "HIGH_ATTENTION_REVIEW";
export type AuditConfidence = "COMPLETE" | "INCOMPLETE" | "UNKNOWN";
export type CapabilityCode =
  | "CAP_FOUNDATIONS_TERMINOLOGY"
  | "CAP_MARKET_STRUCTURE_PRICE_ACTION_BASICS"
  | "CAP_RISK_MANAGEMENT_CONCEPTS"
  | "CAP_ORDER_MECHANICS_CONCEPTS"
  | "CAP_PLATFORM_ONBOARDING"
  | "CAP_GUIDED_DEMO_PRACTICE"
  | "CAP_JOURNAL_AND_REVIEW"
  | "CAP_CHECKLIST_AND_SESSION_RULES"
  | "CAP_PSYCHOLOGY_PROCESS_DISCIPLINE"
  | "CAP_FINANCIAL_SAFETY_EDUCATION"
  | "CAP_INSTRUCTOR_REVIEW";

export type DimensionSummary<TResult extends string = string> = {
  dimension: PlanEngineDimension;
  derived_feature_ids: string[];
  headline_result: TResult | string;
  status: PlanEngineValueStatus;
  reasons: ExplanationReason[];
  conflicts: ConflictEnvelope[];
  missing_information: MissingInformationEnvelope[];
  instructor_review_required: boolean;
};

export type OwnedRecommendation<T> = { value: T; origin: RecommendationOrigin; source?: string; note?: string };

export type ScheduleSummary = {
  schedule_realism_band: ScheduleRealismBandResult;
  advisory_cadence: string;
  preferred_windows?: string[];
  consistency_context?: string;
  reasons: ExplanationReason[];
  missing_information: MissingInformationEnvelope[];
};

export type InstructorReviewItem = {
  id: string;
  priority: ReviewItemPriority;
  source: string;
  summary: string;
  classification: "student_safe" | "instructor_internal";
  status: "OPEN";
  related_source_keys?: string[];
};

export type ProcessMilestone = {
  id: string;
  type: "PROCESS_EDUCATIONAL";
  capability_focus?: CapabilityCode[];
  title: string;
  description: string;
  completion_signal: string;
};

export type AcknowledgmentContext = {
  all_required_confirmed: boolean;
  audit_confidence: AuditConfidence;
  note: string;
};

export type ProvenanceSummary = {
  student_source_fields: string[];
  instructor_source_fields: string[];
  system_derived_features: string[];
  system_flags_context: string[];
};

export type PlanEngineV1Draft = {
  source_snapshot_reference: SourceSnapshotReference;
  engine_version: "plan_engine_v1";
  schema_version: string;
  form_version: string;
  generated_at: string;
  dimensions: {
    financial_capacity_capital_safety: DimensionSummary<FinancialStabilityBandResult | EmergencyResilienceBandResult | CapitalSafetyReviewResult | FundingSourceSafetyReviewResult | TradingProfitDependencyReviewResult>;
    behavioral_readiness_process_discipline: DimensionSummary<BehavioralDisciplineSupportBandResult | DemoFirstReadinessAdvisoryResult>;
    knowledge_skill_readiness: DimensionSummary<CurriculumStartingLevelResult>;
  };
  schedule_summary: ScheduleSummary;
  recommendations: {
    recommended_starting_level: OwnedRecommendation<CurriculumStartingLevelResult | string>;
    recommended_education_track: OwnedRecommendation<string>;
    priority_capabilities: OwnedRecommendation<CapabilityCode[]>;
    practice_plan: OwnedRecommendation<string[]>;
    study_schedule: OwnedRecommendation<string[]>;
    journal_plan: OwnedRecommendation<string[]>;
    checklist_plan: OwnedRecommendation<string[]>;
    demo_first_advisory: OwnedRecommendation<DemoFirstReadinessAdvisoryResult>;
  };
  instructor_review_items: InstructorReviewItem[];
  milestones: ProcessMilestone[];
  missing_information: MissingInformationEnvelope[];
  explanations: { derived_features: Pe1DerivedFeatures };
  acknowledgment_context: AcknowledgmentContext;
  provenance_summary: ProvenanceSummary;
  draft_status: PlanDraftStatus;
  instructor_review_status: "INSTRUCTOR_REVIEW_REQUIRED" | "NOT_REQUIRED";
};

export type PlanComposerContext = PlanEngineContext & { generated_at?: string };
