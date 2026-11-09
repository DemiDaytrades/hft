/** PE-1 deterministic conflict detection (explainable). No active flags, no persistence. */
import type { ConflictEnvelope, PlanEngineInput } from "./contracts";
import { fv, isMissing, isPnTS, snapshotRef } from "./normalization";

function conflict(id: string, type: ConflictEnvelope["type"], source_keys: string[], summary: string, instructor = true): ConflictEnvelope {
  return { conflict_id: id, type, source_keys, summary, resolution: "NONE_PRESERVE_ALL", instructor_review_required: instructor };
}

export function detectConflicts(input: PlanEngineInput): ConflictEnvelope[] {
  const s = input.student_sections_json || {};
  const out: ConflictEnvelope[] = [];
  const unplanned = fv<string>(s, "unplannedTradeFrequency");
  if (unplanned === "Often") {
    out.push(conflict("PF04_FREQUENT_UNPLANNED_TRADES", "SELF_REPORT_TRIANGULATION", ["unplannedTradeFrequency", "behaviorMatrix", "willingRiskLimits"], "Self-reported frequent unplanned/rule-mismatched trades may warrant checklist and instructor review support. Responses are preserved as reported."));
  }
  const demoWilling = fv<string>(s, "willingDemoFirst");
  const pauseWilling = fv<string>(s, "willingToPauseLiveTradingAndReturnToDemo");
  const profitsEssentials = fv<string>(s, "tradingProfitsForEssentialExpensesExpectation");
  const billsMoney = fv<string>(s, "billsMoneyUsedForTradingFrequency");
  const demoPausePositive = demoWilling === "Yes" || pauseWilling === "Yes, willing and able" || pauseWilling === "Willing, but it may be difficult";
  if (demoPausePositive && (profitsEssentials === "Yes, expected to cover major essential expenses" || profitsEssentials === "Yes, for some expenses" || billsMoney === "Often" || billsMoney === "Sometimes")) {
    out.push(conflict("DEMO_WILLINGNESS_VS_DEPENDENCY_CONTEXT", "SELF_REPORT_TRIANGULATION", ["willingDemoFirst", "willingToPauseLiveTradingAndReturnToDemo", "tradingProfitsForEssentialExpensesExpectation", "billsMoneyUsedForTradingFrequency"], "Demo/pause willingness appears alongside essential-expense dependency or bills-money-for-trading context. Educational review may help align expectations and safeguards. All answers preserved."));
  }
  const separation = fv<string>(s, "tradingCapitalSeparation");
  const impact = fv<string[]>(s, "lossOfTradingCapitalImpact");
  const essentialImpact = Array.isArray(impact) && impact.some((v) => ["Ability to pay bills", "Debt payments", "Groceries/basic living", "Transportation", "Emergency preparedness"].includes(v));
  if ((separation === "Yes, fully separate" || separation === "Mostly separate") && essentialImpact) {
    out.push(conflict("CAPITAL_SEPARATION_VS_ESSENTIAL_IMPACT", "SELF_REPORT_TRIANGULATION", ["tradingCapitalSeparation", "lossOfTradingCapitalImpact"], "Capital reported as separate/mostly separate while potential loss impact includes essential areas. Instructor review can clarify capital-safety context. All answers preserved."));
  }
  const affordable = fv<string>(s, "affordableLossRange");
  const funding = fv<string>(s, "liveTradingFundingStatus");
  const fundedLive = funding === "Live trading account funded but not actively trading" || funding === "Currently trading with personal funds";
  if (affordable === "$0" && fundedLive) {
    out.push(conflict("AFFORDABLE_LOSS_ZERO_WITH_FUNDED_CONTEXT", "SELF_REPORT_TRIANGULATION", ["affordableLossRange", "liveTradingFundingStatus"], "Affordable loss reported as $0 while live-trading funding context is reported. Education/demo-first and instructor capital-safety review are appropriate. All answers preserved."));
  }
  const readiness = fv<string>(s, "liveTradingReadinessSelfAssessment");
  const sources = fv<string[]>(s, "tradingCapitalSources");
  const borrowedIntent = fv<string>(s, "borrowedCreditFundingIntent");
  const unsafeSource = Array.isArray(sources) && sources.some((v) => ["Borrowed money", "Credit card / credit line", "Emergency savings", "Money normally used for bills/living expenses"].includes(v));
  if (readiness === "Ready now" && (unsafeSource || borrowedIntent === "Yes" || borrowedIntent === "Already have")) {
    out.push(conflict("READINESS_SELF_ASSESSMENT_VS_FUNDING_CONTEXT", "SELF_REPORT_TRIANGULATION", ["liveTradingReadinessSelfAssessment", "tradingCapitalSources", "borrowedCreditFundingIntent"], "Self-assessed readiness appears alongside borrowed/credit, emergency, or essential-money funding context. Self-assessment is not authoritative; instructor review is required before any progression consideration."));
  }
  const ia = input.instructor_assessment_json as any;
  const instKnowledge = ia?.assessedKnowledgeLevel?.value || ia?.assessedKnowledgeLevel;
  const km = fv<Record<string, string>>(s, "knowledgeMatrix");
  const selfHigh = km && typeof km === "object" && Object.values(km).filter((v) => /confident|strong|advanced|good/i.test(String(v))).length >= 8;
  const instLow = typeof instKnowledge === "string" && /gap|foundational gap|beginner|low|limited/i.test(instKnowledge);
  if (selfHigh && instLow) {
    out.push(conflict("SELF_KNOWLEDGE_VS_INSTRUCTOR_ASSESSMENT", "STUDENT_INSTRUCTOR_DIFFERENCE", ["knowledgeMatrix", "instructor_assessment.assessedKnowledgeLevel"], "Self-reported knowledge appears higher than instructor-assessed knowledge. Instructor assessment may guide sequencing; both sources preserved."));
  }
  return out;
}
