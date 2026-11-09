import type { PlanEngineContext, PlanEngineInput, Pe1Output } from "./contracts";
import { snapshotRef } from "./normalization";
import {
  deriveBehavioralDisciplineSupportBand,
  deriveCapitalSafetyReview,
  deriveCurriculumStartingLevel,
  deriveDemoFirstReadinessAdvisory,
  deriveEmergencyResilienceBand,
  deriveFinancialStabilityBand,
  deriveFundingSourceSafetyReview,
  deriveInstructorReviewPriority,
  deriveScheduleRealismBand,
  deriveTradingProfitDependencyReview,
} from "./derived-features";

export * from "./contracts";
export * from "./normalization";
export * from "./conflicts";
export * from "./derived-features";

export function runPlanEngineV1Pe1(input: PlanEngineInput, ctx: PlanEngineContext): Pe1Output {
  return {
    engine: "plan_engine_v1_pe1",
    version: "v1",
    source_snapshot_reference: ctx.source_snapshot_reference || snapshotRef(input, ctx.computed_at),
    computed_at: ctx.computed_at,
    derived_features: {
      financial_stability_band_v1: deriveFinancialStabilityBand(input, ctx),
      emergency_resilience_band_v1: deriveEmergencyResilienceBand(input, ctx),
      capital_safety_review_v1: deriveCapitalSafetyReview(input, ctx),
      funding_source_safety_review_v1: deriveFundingSourceSafetyReview(input, ctx),
      trading_profit_dependency_review_v1: deriveTradingProfitDependencyReview(input, ctx),
      behavioral_discipline_support_band_v1: deriveBehavioralDisciplineSupportBand(input, ctx),
      demo_first_readiness_advisory_v1: deriveDemoFirstReadinessAdvisory(input, ctx),
      schedule_realism_band_v1: deriveScheduleRealismBand(input, ctx),
      curriculum_starting_level_v1: deriveCurriculumStartingLevel(input, ctx),
      instructor_review_priority_v1: deriveInstructorReviewPriority(input, ctx),
    },
  };
}

export * from "./composer";
