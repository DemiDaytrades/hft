import {reviewIsCurrent,type SmartReview} from "../consultation-review/model";
import {
  ACKNOWLEDGMENT_KEYS, KNOWLEDGE_MATRIX_TOPICS, BEHAVIOR_MATRIX_DIMENSIONS,
  type AcknowledgmentKey,
  type AckAudit,
  type AckAuditRecord,
  type ExplainableFlag,
  type IntakeV2Status,
  type InstructorAssessmentV2,
  type StudentSectionsV2,
  INTAKE_V2_FORM_VERSION,
  INTAKE_V2_SCHEMA_VERSION,
  PREFER_NOT_TO_SAY,
} from "./contracts";
import { evaluateExplainableFlags, hasBlockingHighRiskFlags } from "./flags";
import { FH_PNTS } from "./financial-health-registry";

export const PHASE3D_FORM_VERSION = "hft_intake_v2_form.2026-11-05_phase3d" as const;
export const PHASE3E_FORM_VERSION = "hft_intake_v2_form.2026-11-05_phase3e" as const;
export const PHASE3F_FORM_VERSION = "hft_intake_v2_form.2026-11-05_phase3f" as const;
import { DC_HARDSHIP_NOTE_MAX, DC_NOT_SURE, DC_PNTS, isDebtCreditHiddenForHasDebt, isDebtCreditMutexSelection } from "./debt-credit-registry";
import {
  MO_HOUSING_RANGE_REQUIRED_STATUSES,
  MO_NOT_SURE,
  MO_OTHER_NOTE_MAX,
  MO_PNTS,
  MO_PNTS_ANSWER,
  isMoIncomeSourcesMutexInvalid,
  isMoPnTSEquivalent,
} from "./monthly-obligations-registry";
import {
  TC_NOT_SURE,
  TC_OPTIONS,
  TC_PNTS_ANSWER,
  isTcMutexSelectionInvalid,
  isTcPnTSEquivalent,
} from "./trading-capital-readiness-registry";
import { PF_PNTS_ANSWER, TRADING_BEHAVIOR_KEY_ORDER, isValidPfValue } from "./trading-behavior-registry";

export type ValidationIssue = { path: string; message: string; code: string };
export type ValidationResult = { ok: boolean; issues: ValidationIssue[] };

const REQUIRED_INSTRUCTOR_MINIMUM = [
  "instructorSummary",
  "assessedExperienceLevel",
  "assessedKnowledgeLevel",
  "instructorStrengths",
  "instructorWeaknesses",
  "recommendedStartingLevel",
  "recommendedAcademyTrack",
  "recommendedFirstLesson",
  "firstHomework",
  "recommendedPracticeFrequency",
  "recommendedCoachingFrequency",
  "immediateActionItems",
] as const;

const CONDITIONAL_INSTRUCTOR_HIGH_RISK = [
  "behavioralConcerns",
  "financialRiskConcerns",
  "riskRestrictions",
] as const;

function val<T>(field: { value: T } | undefined | null): T | undefined {
  return field?.value;
}

function hasText(v: unknown): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

function hasSelection(v: unknown): boolean {
  if (v == null) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim().length > 0 && v !== "";
  return true;
}

function isPreferNotToSay(v: unknown): boolean {
  return v === PREFER_NOT_TO_SAY || v === FH_PNTS;
}

/** "Prefer not to say" satisfies a required financial response. */
export function isValidFinancialResponse(v: unknown): boolean {
  if (isPreferNotToSay(v)) return true;
  return hasSelection(v);
}

/** Text prompt that allows explicit Prefer not to say (owner-approved). */
export function isValidTextOrPreferNotToSay(v: unknown): boolean {
  if (isPreferNotToSay(v)) return true;
  return hasText(v);
}

function push(issues: ValidationIssue[], path: string, message: string, code: string) {
  issues.push({ path, message, code });
}

function debtHasYes(student: StudentSectionsV2): boolean {
  return val(student.debtStatusTypes)?.hasDebt === "Yes";
}

function liveHasExperience(student: StudentSectionsV2): boolean {
  const live = val(student.demoLiveExperience)?.live;
  return Boolean(live && live !== "No");
}

function brokerHasExperience(student: StudentSectionsV2): boolean {
  const b = val(student.platformsBrokerExperience)?.brokerExperience;
  return Boolean(b && b !== "No");
}

function priorEdHasYes(student: StudentSectionsV2): boolean {
  const t = val(student.priorEducation)?.type;
  return Boolean(t && t !== "No");
}

function negativeExpHasDetail(student: StudentSectionsV2): boolean {
  const t = val(student.majorNegativeExperience)?.type;
  return Boolean(t && t !== "No" && t !== "Prefer not to say");
}

function upcomingHasYes(student: StudentSectionsV2): boolean {
  return val(student.upcomingMajorExpenses)?.hasUpcoming === "Yes";
}

function additionalIncomeHasYes(student: StudentSectionsV2): boolean {
  return val(student.additionalIncome)?.hasAdditional === "Yes";
}


export function requiresMonthlyObligationsAtCompletion(formVersion?: string | null): boolean {
  // Phase 3D-era and later drafts (including phase3e/phase3f) require MO-01..MO-14. Pre-3D known/legacy drafts are grandfathered.
  // Fail-safe (owner-confirmed): unexpected/custom form_version does NOT block completion solely for missing MO.
  if (!formVersion) return false;
  return formVersion === PHASE3D_FORM_VERSION || formVersion === PHASE3E_FORM_VERSION || formVersion === PHASE3F_FORM_VERSION;
}


export function requiresTradingCapitalReadinessAtCompletion(formVersion?: string | null): boolean {
  // Phase 3E-era and later drafts (including phase3f) require TC-01..TC-10. Pre-3E drafts (including phase3d and earlier known versions) are grandfathered.
  // Unknown/custom form_version fail-safe (non-punitive): do NOT block completion solely for missing TC.
  if (!formVersion) return false;
  return formVersion === PHASE3E_FORM_VERSION || formVersion === PHASE3F_FORM_VERSION;
}

export function requiresTradingBehaviorAtCompletion(formVersion?: string | null): boolean {
  // Phase 3F-era drafts require PF-01..PF-09. Pre-3F drafts (including phase3e, phase3d, and earlier known versions) are grandfathered.
  // Unknown/custom/null/empty form_version fail-safe (non-punitive): do NOT block completion solely for missing PF.
  if (!formVersion) return false;
  return formVersion === PHASE3F_FORM_VERSION;
}

function isValidPfResponse(key: (typeof TRADING_BEHAVIOR_KEY_ORDER)[number], v: unknown): boolean {
  if (v === PF_PNTS_ANSWER) return true; // stored as-is, legitimate completion
  return isValidPfValue(key, v);
}

function isValidTcResponse(v: unknown): boolean {
  if (isTcPnTSEquivalent(v)) return true;
  if (v === TC_NOT_SURE) return true;
  if (isPreferNotToSay(v)) return true;
  return hasSelection(v);
}

function isValidMoResponse(v: unknown): boolean {
  if (isMoPnTSEquivalent(v)) return true;
  if (v === MO_NOT_SURE || v === DC_NOT_SURE) return true;
  if (isPreferNotToSay(v)) return true;
  return hasSelection(v);
}

export function validateDraft(input: {
  student_sections?: StudentSectionsV2;
  instructor_assessment?: InstructorAssessmentV2;
  ack_audit?: AckAudit;
}): ValidationResult {
  // Draft/in-progress: permissive. No full required enforcement.
  const issues: ValidationIssue[] = [];
  if (input.student_sections && typeof input.student_sections !== "object") {
    push(issues, "student_sections", "student_sections must be an object", "schema");
  }
  return { ok: issues.length === 0, issues };
}

export function validateFinalCompletion(input: {
  student_sections: StudentSectionsV2;
  instructor_assessment: InstructorAssessmentV2;
  acknowledgments?: Record<string, boolean>;
  ack_audit: AckAudit;
  intake_id: string;
  form_version?: string;
  schema_version?: string;
  snapshot_version?: number;
  instructor_review?: unknown;
}): ValidationResult {
  const issues: ValidationIssue[] = [];
  const s = input.student_sections || ({} as StudentSectionsV2);
  const ia = input.instructor_assessment || ({} as InstructorAssessmentV2);

  // Required student controls (visible branch). Financial "Prefer not to say" valid.
  const reqText: Array<[string, string]> = [
    ["preferredName", "Preferred name is required."],
    ["location", "Location is required."],
    ["timeZone", "Time zone is required."],
    ["occupation", "Occupation is required."],
    ["employmentType", "Employment situation is required."],
    ["workScheduleSummary", "Typical work schedule is required."],
    ["currentLifeGoal", "Current life goal is required."],
    ["motivationAndWhyNow", "Motivation and why now are required."],
    ["biggestTradingConfusion", "What confuses you most is required."],
    ["reactionToLoss", "Reaction to loss is required."],
    ["reactionToWin", "Reaction to win is required."],
    ["goalImmediate", "Immediate goal is required."],
    ["goalBig", "Big long-term goal is required."],
    ["goalWhy", "Why goals matter is required."],
    ["successDefinition", "Success definition is required."],
    ["membershipValue", "Membership value is required."],
  ];
  for (const [key, msg] of reqText) {
    if(input.instructor_review && ["reactionToLoss","reactionToWin"].includes(key) && val(s.demoLiveExperience)?.demo==="No" && val(s.demoLiveExperience)?.live==="No")continue;
    if (!hasText(val((s as any)[key]) as unknown)) push(issues, `student_sections.${key}`, msg, "required");
  }
  // Owner-approved 9A: meaningful text OR explicit Prefer not to say.
  if (!isValidTextOrPreferNotToSay(val(s.financialReasonForTrading) as unknown)) {
    push(issues, "student_sections.financialReasonForTrading", "Financial reason for learning trading is required (or Prefer not to say).", "required");
  }

  if (!hasSelection(val(s.majorResponsibilities))) push(issues, "student_sections.majorResponsibilities", "Major responsibilities selection is required.", "required");

  // Financial: response required; Prefer not to say valid
  const financialReq: Array<[string, string]> = [
    ["monthlyTakeHomeRange", "Monthly take-home income response is required."],
    ["disposableIncomeRange", "Disposable income response is required."],
    ["recurringObligationsRange", "Recurring obligations response is required."],
    ["savingsEmergencyRanges", "Savings and emergency fund responses are required."],
    ["unexpectedExpenseAbility", "Unexpected expense response is required."],
    ["availableTradingCapitalRange", "Trading capital availability response is required."],
    ["affordableLossRange", "Affordable loss response is required."],
    ["pressureToMakeMoneyQuickly", "Financial urgency response is required."],
    ["desiredAdditionalMonthlyIncomeRange", "Desired additional monthly income goal response is required."],
  ];
  for (const [key, msg] of financialReq) {
    const v = val((s as any)[key]) as unknown;
    if (key === "savingsEmergencyRanges") {
      const sv = v as { savings?: string; emergencyFund?: string } | undefined;
      if (!isValidFinancialResponse(sv?.savings) || !isValidFinancialResponse(sv?.emergencyFund)) push(issues, `student_sections.${key}`, msg, "required");
    } else if (!isValidFinancialResponse(v)) {
      push(issues, `student_sections.${key}`, msg, "required");
    }
  }
  // Owner-approved 3A: variable expenses required at completion (PNTS allowed).
  if (!isValidFinancialResponse(val(s.variableExpensesRange))) push(issues, "student_sections.variableExpensesRange", "Variable monthly expenses response is required.", "required");

  const icp = val(s.incomeConsistencyPay);
  if (!hasSelection(icp?.consistency) || !hasSelection(icp?.payFrequency)) push(issues, "student_sections.incomeConsistencyPay", "Income consistency and pay frequency are required.", "required");
  if (!hasSelection(val(s.additionalIncome)?.hasAdditional)) push(issues, "student_sections.additionalIncome", "Additional income response is required.", "required");
  if (additionalIncomeHasYes(s) && !isValidFinancialResponse(val(s.additionalIncome)?.range)) push(issues, "student_sections.additionalIncome.range", "Additional income range is required when additional income is Yes.", "conditional_required");
  if (!hasSelection(val(s.upcomingMajorExpenses)?.hasUpcoming)) push(issues, "student_sections.upcomingMajorExpenses", "Upcoming major expenses response is required.", "required");
  if (upcomingHasYes(s) && !hasText(val(s.upcomingMajorExpenses)?.note)) push(issues, "student_sections.upcomingMajorExpenses.note", "Major expense note is required when Yes.", "conditional_required");
  if (!hasSelection(val(s.debtStatusTypes)?.hasDebt)) push(issues, "student_sections.debtStatusTypes", "Debt status response is required.", "required");
  if (debtHasYes(s)) {
    if (!hasSelection(val(s.debtStatusTypes)?.types)) push(issues, "student_sections.debtStatusTypes.types", "High-level debt types are required when debt is Yes.", "conditional_required");
    if (!isValidFinancialResponse(val(s.totalDebtRange))) push(issues, "student_sections.totalDebtRange", "Total debt range is required when debt is Yes.", "conditional_required");
    if (!isValidFinancialResponse(val(s.monthlyDebtPaymentsRange))) push(issues, "student_sections.monthlyDebtPaymentsRange", "Monthly debt payments range is required when debt is Yes.", "conditional_required");
  }
  // hasDebt No/Prefer not to say: do not force burden disclosures (owner 4A).

  // Section 3
  if (!hasSelection(val(s.marketsExperience))) push(issues, "student_sections.marketsExperience", "Markets experience is required.", "required");
  const dl = val(s.demoLiveExperience);
  if (!hasSelection(dl?.demo) || !hasSelection(dl?.live)) push(issues, "student_sections.demoLiveExperience", "Demo and live experience are required.", "required");
  if (liveHasExperience(s) && !isValidFinancialResponse(val(s.liveAccountSizeRange))) push(issues, "student_sections.liveAccountSizeRange", "Live account size range is required when live experience is reported.", "conditional_required");
  const km = val(s.knowledgeMatrix);
  if (!km || typeof km !== "object" || Object.keys(km).length < 13) push(issues, "student_sections.knowledgeMatrix", "Knowledge matrix must be completed for all topics.", "required");
  for(const topic of KNOWLEDGE_MATRIX_TOPICS)if(!hasText(km?.[topic]))push(issues,`student_sections.knowledgeMatrix.${topic}`,`Self-reported knowledge response missing for ${topic}. Unknown/not familiar is valid evidence; do not invent a rating.`,"required");
  const pbe = val(s.platformsBrokerExperience);
  if (!hasSelection(pbe?.platforms) || !hasSelection(pbe?.brokerExperience)) push(issues, "student_sections.platformsBrokerExperience", "Platforms/tools and broker experience are required.", "required");
  if (!hasSelection(val(s.priorEducation)?.type)) push(issues, "student_sections.priorEducation", "Prior education response is required.", "required");
  if (priorEdHasYes(s) && !hasText(val(s.priorEducation)?.notes)) push(issues, "student_sections.priorEducation.notes", "Prior education notes are required when prior education is reported.", "conditional_required");
  if (!hasSelection(val(s.majorNegativeExperience)?.type)) push(issues, "student_sections.majorNegativeExperience", "Negative experience response is required.", "required");

  // Section 4
  const bm = val(s.behaviorMatrix);
  if (!bm || typeof bm !== "object" || Object.keys(bm).length < 5) push(issues, "student_sections.behaviorMatrix", "Behavior matrix must be completed.", "required");
  for(const dimension of BEHAVIOR_MATRIX_DIMENSIONS)if(!hasText(bm?.[dimension]))push(issues,`student_sections.behaviorMatrix.${dimension}`,`Self-reported behavior response missing for ${dimension}.`,"required");
  if (!hasSelection(val(s.behaviorTendencies))) push(issues, "student_sections.behaviorTendencies", "Behavior tendencies selection is required.", "required");
  if (!hasSelection(val(s.willingDemoFirst))) push(issues, "student_sections.willingDemoFirst", "Demo-first willingness is required.", "required");
  if (!hasSelection(val(s.willingRiskLimits))) push(issues, "student_sections.willingRiskLimits", "Risk-limits willingness is required.", "required");

  // Section 5
  const g30 = val(s.goals30_60_90);
  if (!hasText(g30?.goal30) || !hasText(g30?.goal60) || !hasText(g30?.goal90)) push(issues, "student_sections.goals30_60_90", "30, 60, and 90-day goals are required.", "required");
  if (!hasText(val(s.goals6_12)?.goal6)) push(issues, "student_sections.goals6_12.goal6", "6-month goal is required.", "required");
  if (!hasSelection(val(s.desiredTradingIncomeRange))) push(issues, "student_sections.desiredTradingIncomeRange", "Desired trading income range is required.", "required");

  // Section 6
  if (!hasSelection(val(s.learningStyles))) push(issues, "student_sections.learningStyles", "Learning styles are required.", "required");
  const pc = val(s.paceAndQuestionComfort);
  if (!hasSelection(pc?.pace) || !hasSelection(pc?.questionComfort)) push(issues, "student_sections.paceAndQuestionComfort", "Pace and question comfort are required.", "required");
  if (!hasSelection(val(s.homeworkPreference))) push(issues, "student_sections.homeworkPreference", "Homework preference is required.", "required");
  const af = val(s.accountabilityFeedback);
  if (!hasSelection(af?.accountability) || !hasSelection(af?.feedbackFrequency)) push(issues, "student_sections.accountabilityFeedback", "Accountability and feedback preferences are required.", "required");

  // Section 7
  const wa = val(s.weeklyAvailability);
  if (!wa || typeof wa !== "object" || Object.keys(wa).length === 0) push(issues, "student_sections.weeklyAvailability", "Weekly availability schedule is required.", "required");
  if (!hasSelection(val(s.unavailableDays))) push(issues, "student_sections.unavailableDays", "Unavailable days selection is required.", "required");
  if (!hasSelection(val(s.weeklyHoursRange))) push(issues, "student_sections.weeklyHoursRange", "Weekly hours range is required.", "required");
  const wc = val(s.windowsAndConsistency);
  if (!hasSelection(wc?.preferredWindows) || !hasSelection(wc?.consistencyExpectation)) push(issues, "student_sections.windowsAndConsistency", "Preferred windows and consistency expectation are required.", "required");

  // Section 8
  const di = val(s.devicesInternet);
  if (!hasSelection(di?.devices) || !hasSelection(di?.internetReliability)) push(issues, "student_sections.devicesInternet", "Devices and internet reliability are required.", "required");
  const pa = val(s.platformAccess);
  if (!hasSelection(pa?.tradingView) || !hasSelection(pa?.mt5) || !hasSelection(pa?.demoAccount) || !hasSelection(pa?.liveAccount)) push(issues, "student_sections.platformAccess", "Platform access responses are required.", "required");
  const st = val(s.supportTechReadiness);
  if (!hasSelection(st?.canScreenShare) || !hasSelection(st?.softwareComfort)) push(issues, "student_sections.supportTechReadiness", "Screen share and software comfort are required.", "required");

  // Phase 3C Debt & Credit (owner-approved, additive). DC-02/06/10 hidden unless hasDebt === Yes.
  // Hidden conditional fields: omit active answers; no artificial Not applicable. Debt/credit/PNTS
  // do not activate new risk indicators (existing flag triggers/thresholds preserved).
  const hasDebt = val(s.debtStatusTypes)?.hasDebt;
  const dcHidden = isDebtCreditHiddenForHasDebt(hasDebt);
  const dcSelectReq: Array<[string, string]> = [
    ["debtRepaymentConfidence", "Debt repayment confidence response is required (or Prefer not to say)."],
    ["creditUtilizationAwareness", "Credit utilization awareness response is required (or Prefer not to say / Not sure yet)."],
    ["paymentHistoryConsistency", "Payment history consistency response is required (or Prefer not to say / Not sure yet)."],
    ["debtRelatedStress", "Debt-related stress response is required (or Prefer not to say)."],
    ["creditBuildingGoals", "Credit-building goals response is required (or Prefer not to say / Not sure yet)."],
    ["emergencyBorrowingReliance", "Emergency borrowing reliance response is required (or Prefer not to say)."],
    ["creditEducationInterest", "Credit education interest response is required (or Prefer not to say)."],
  ];
  for (const [key, msg] of dcSelectReq) {
    if (!isValidFinancialResponse(val((s as any)[key]) as unknown)) push(issues, `student_sections.${key}`, msg, "required");
  }
  const dcConditional: Array<[string, string]> = [
    ["minimumPaymentManageability", "Minimum payment manageability is required when debt status is Yes (or Prefer not to say)."],
    ["debtReductionStrategy", "Debt reduction strategy is required when debt status is Yes (or Prefer not to say / Not sure yet)."],
    ["debtPayoffPriorities", "Debt payoff priorities response is required when debt status is Yes (or Prefer not to say / Not sure yet)."],
  ];
  for (const [key, msg] of dcConditional) {
    const v = val((s as any)[key]) as unknown;
    if (dcHidden) {
      // Omit active answers when hidden; if stale data exists, do not fail completion solely on hidden legacy value.
      continue;
    }
    if (!isValidFinancialResponse(v)) push(issues, `student_sections.${key}`, msg, "conditional_required");
  }
  // DC-08: status required (PNTS valid); note optional, max 280 chars, no sensitive details required.
  const hardship = val(s.recentFinancialHardship) as { status?: string; note?: string } | undefined;
  if (!isValidFinancialResponse(hardship?.status)) push(issues, "student_sections.recentFinancialHardship.status", "Recent financial hardship status is required (or Prefer not to say / Not sure yet).", "required");
  if (typeof hardship?.note === "string" && hardship.note.length > DC_HARDSHIP_NOTE_MAX) push(issues, "student_sections.recentFinancialHardship.note", `Recent financial hardship note must be ${DC_HARDSHIP_NOTE_MAX} characters or fewer.`, "invalid");
  // DC-12: multiselect, no Other free-text; Prefer not to say / Not sure yet mutually exclusive with specific goals.
  const goals612 = val(s.financialImprovementGoals612) as unknown;
  if (!hasSelection(goals612)) push(issues, "student_sections.financialImprovementGoals612", "6–12 month financial improvement goals selection is required.", "required");
  else if (isDebtCreditMutexSelection(goals612)) push(issues, "student_sections.financialImprovementGoals612", "Prefer not to say and Not sure yet must be selected alone.", "invalid");


  // Phase 3D Monthly Obligations & Cash Flow (owner-approved, additive, version-gated).
  // Required at completion for Phase 3D-era and later drafts (including phase3f); legacy/pre-3D drafts grandfathered.
  // Unknown/custom form_version fail-safe: do not require MO. Hidden conditionals omitted (no fake values).
  // No consistency checks, no new flags/indicators, no auto high-risk from MO-14/non-disclosure.
  if (requiresMonthlyObligationsAtCompletion(input.form_version)) {
    // MO-01: required, mutex
    const incomeSources = val(s.householdIncomeSources) as unknown;
    if (!Array.isArray(incomeSources) || incomeSources.length === 0) push(issues, "student_sections.householdIncomeSources", "Household income sources selection is required.", "required");
    else if (isMoIncomeSourcesMutexInvalid(incomeSources)) push(issues, "student_sections.householdIncomeSources", "No regular income source right now, Not sure yet, and Prefer not to say must be selected alone.", "invalid");

    const moSelectReq: Array<[keyof StudentSectionsV2, string]> = [
      ["reliableMonthlyIncomePlanningRange", "Reliable monthly planning income response is required."],
      ["utilitiesHouseholdNecessitiesRange", "Utilities/household necessities response is required."],
      ["foodGroceriesRange", "Food/groceries response is required."],
      ["insuranceMedicalRecurringRange", "Insurance/medical recurring costs response is required."],
      ["subscriptionsDiscretionaryRecurringRange", "Subscriptions/discretionary recurring expenses response is required."],
      ["monthlySavingsContributionRange", "Monthly savings contribution response is required."],
      ["remainingDiscretionaryCashFlowRange", "Remaining discretionary cash flow response is required."],
      ["cashFlowVariabilityConfidence", "Cash-flow variability/predictability response is required."],
      ["billsMoneyUsedForTradingFrequency", "Bills/essential-money-used-for-trading response is required."],
    ];
    for (const [key, msg] of moSelectReq) {
      if (!isValidMoResponse(val((s as any)[key]) as unknown)) push(issues, `student_sections.${String(key)}`, msg, "required");
    }

    // MO-03 housing
    const housing = val(s.housingSituationPayment) as { status?: string; monthlyRange?: string } | undefined;
    if (!isValidMoResponse(housing?.status)) push(issues, "student_sections.housingSituationPayment.status", "Housing situation is required.", "required");
    if (housing?.status && MO_HOUSING_RANGE_REQUIRED_STATUSES.has(housing.status) && !isValidMoResponse(housing?.monthlyRange)) {
      push(issues, "student_sections.housingSituationPayment.monthlyRange", "Monthly housing payment/contribution range is required for the selected housing situation.", "conditional_required");
    }

    // MO-05 transportation
    const transport = val(s.transportationObligationRange) as { hasTransportationCost?: string; monthlyRange?: string } | undefined;
    if (!isValidMoResponse(transport?.hasTransportationCost)) push(issues, "student_sections.transportationObligationRange.hasTransportationCost", "Transportation cost/obligation response is required.", "required");
    if (transport?.hasTransportationCost === "Yes" && !isValidMoResponse(transport?.monthlyRange)) {
      push(issues, "student_sections.transportationObligationRange.monthlyRange", "Monthly transportation range is required when transportation costs apply.", "conditional_required");
    }

    // MO-08 dependent support
    const dep = val(s.dependentSupportObligation) as { hasDependentSupportCost?: string; monthlyRange?: string } | undefined;
    if (!isValidMoResponse(dep?.hasDependentSupportCost)) push(issues, "student_sections.dependentSupportObligation.hasDependentSupportCost", "Dependent-support cost response is required.", "required");
    if (dep?.hasDependentSupportCost === "Yes" && !isValidMoResponse(dep?.monthlyRange)) {
      push(issues, "student_sections.dependentSupportObligation.monthlyRange", "Monthly dependent-support range is required when dependent-support costs apply.", "conditional_required");
    }

    // MO-10 other obligations
    const other = val(s.otherRecurringObligations) as { hasOtherObligations?: string; monthlyRange?: string; note?: string } | undefined;
    if (!isValidMoResponse(other?.hasOtherObligations)) push(issues, "student_sections.otherRecurringObligations.hasOtherObligations", "Other recurring obligations response is required.", "required");
    if (other?.hasOtherObligations === "Yes" && !isValidMoResponse(other?.monthlyRange)) {
      push(issues, "student_sections.otherRecurringObligations.monthlyRange", "Other recurring obligations monthly range is required when other obligations apply.", "conditional_required");
    }
    if (typeof other?.note === "string" && other.note.length > MO_OTHER_NOTE_MAX) {
      push(issues, "student_sections.otherRecurringObligations.note", `Other recurring obligations note must be ${MO_OTHER_NOTE_MAX} characters or fewer.`, "invalid");
    }
  }


  // Phase 3E Trading Capital, Risk Capacity & Funding Readiness (owner-approved, additive, version-gated).
  // Required at completion for Phase 3E-era and later drafts (including phase3f); all known pre-Phase-3E drafts (incl. phase3d) grandfathered.
  // Unknown/custom form_version fail-safe (non-punitive): do not block completion solely for missing TC.
  // No trading-plan calculations. No review indicators/flags activated. TC-11 deferred (not implemented).
  if (requiresTradingCapitalReadinessAtCompletion(input.form_version)) {
    const tcSelectReq: Array<[keyof StudentSectionsV2, string]> = [
      ["liveTradingFundingStatus", "Live-trading funding status is required."],
      ["tradingCapitalSeparation", "Trading capital separation response is required."],
      ["tradingCapitalReplacementExpectation", "Trading capital replacement expectation is required."],
      ["tradingCapitalTimeHorizon", "Trading capital time horizon is required."],
      ["emergencyFundProtectionIntent", "Emergency fund protection intent is required."],
      ["borrowedCreditFundingIntent", "Borrowed/credit funding intent is required."],
      ["tradingProfitsForEssentialExpensesExpectation", "Trading-profits-for-essential-expenses expectation is required."],
      ["liveTradingReadinessSelfAssessment", "Live-trading readiness self-assessment is required."],
    ];
    for (const [key, msg] of tcSelectReq) {
      if (!isValidTcResponse(val((s as any)[key]) as unknown)) push(issues, `student_sections.${String(key)}`, msg, "required");
    }
    const sources = val(s.tradingCapitalSources) as unknown;
    if (!Array.isArray(sources) || sources.length === 0) push(issues, "student_sections.tradingCapitalSources", "Trading capital sources selection is required.", "required");
    else if (isTcMutexSelectionInvalid(sources, ["Not funded yet", TC_NOT_SURE, TC_PNTS_ANSWER])) push(issues, "student_sections.tradingCapitalSources", "Not funded yet, Not sure yet, and Prefer not to answer must be selected alone.", "invalid");

    const impact = val(s.lossOfTradingCapitalImpact) as unknown;
    if (!Array.isArray(impact) || impact.length === 0) push(issues, "student_sections.lossOfTradingCapitalImpact", "Loss-of-trading-capital impact selection is required.", "required");
    else if (isTcMutexSelectionInvalid(impact, ["None of these", "Not funded yet", TC_NOT_SURE, TC_PNTS_ANSWER])) push(issues, "student_sections.lossOfTradingCapitalImpact", "None of these, Not funded yet, Not sure yet, and Prefer not to answer must be selected alone.", "invalid");
  }

  // Phase 3F Trading Behavior, Psychology & Discipline (owner-approved, additive, version-gated).
  // Required at completion for Phase 3F-era drafts only. Pre-3F drafts (including phase3e/phase3d/earlier known) grandfathered.
  // Unknown/custom/null/empty form_version fail-safe (non-punitive): do NOT block completion solely for missing PF.
  // PF-01..PF-09: single-select FieldValue<string>, no multiselect/mutex/free text. "Prefer not to answer" stored as-is and valid.
  // Beginner/no-experience answers are legitimate; no auto high-risk designation. No flags/review indicators/planning calculations.
  // Existing Q39–Q46 contracts/semantics unchanged. TC-11 (canPauseLiveTradingIfNeeded) NOT implemented.
  if (requiresTradingBehaviorAtCompletion(input.form_version)) {
    const pfReq: Array<[(typeof TRADING_BEHAVIOR_KEY_ORDER)[number], string]> = [
      ["situationalLossResponse", "Situational loss response is required."],
      ["situationalWinStreakResponse", "Situational win-streak response is required."],
      ["missedTradeFomoResponse", "Missed-trade/FOMO response is required."],
      ["unplannedTradeFrequency", "Unplanned-trade frequency response is required."],
      ["plannedLossLimitStopAdherence", "Planned loss-limit stop adherence response is required."],
      ["willingToPauseLiveTradingAndReturnToDemo", "Willingness/ability to pause live trading and return to demo/education is required."],
      ["protectiveExitBehavior", "Protective-exit behavior response is required."],
      ["noTradeDayAcceptance", "No-trade-day acceptance response is required."],
      ["journalReviewPractice", "Trade journaling/review practice response is required."],
    ];
    for (const [key, msg] of pfReq) {
      if (!isValidPfResponse(key, val((s as any)[key]) as unknown)) push(issues, `student_sections.${String(key)}`, msg, "required");
    }
  }

  // Section 9: all 7 acknowledgments + audit
  const ackState = input.acknowledgments || (val(s.ackChecklist) as Record<string, boolean> | undefined);
  validateAcknowledgments(ackState, input.ack_audit, input.intake_id, issues);

  // Optional canonical-review workflow changes instructor requirements only; old snapshots retain the approved legacy minimum.
  if(input.instructor_review){
    if(!reviewIsCurrent(input.instructor_review,input.snapshot_version))push(issues,"instructor_review","Confirm the concise instructor review for the current saved answers.","review_required");
    validateInstructorAssessment(ia,s,issues,false);
  }else validateInstructorAssessment(ia, s, issues);

  return { ok: issues.length === 0, issues };
}

export function validateAcknowledgments(
  acknowledgments: Record<string, boolean> | undefined,
  ackAudit: AckAudit | undefined,
  intakeId: string,
  issues: ValidationIssue[] = [],
): ValidationResult {
  for (const key of ACKNOWLEDGMENT_KEYS) {
    if (acknowledgments?.[key] !== true) {
      push(issues, `acknowledgments.${key}`, `Acknowledgment ${key} is required.`, "ack_required");
    }
  }
  const records = ackAudit?.records || [];
  for (const key of ACKNOWLEDGMENT_KEYS) {
    const r = records.find((x) => x.ack_key === key);
    if (!r) {
      push(issues, `ack_audit.${key}`, `Acknowledgment audit record missing for ${key}.`, "ack_audit_required");
      continue;
    }
    if (r.confirmed !== true) push(issues, `ack_audit.${key}.confirmed`, "confirmed must be true", "ack_audit");
    if (!r.ack_text_version_id) push(issues, `ack_audit.${key}.ack_text_version_id`, "ack_text_version_id required", "ack_audit");
    if (!r.confirmed_at) push(issues, `ack_audit.${key}.confirmed_at`, "confirmed_at required", "ack_audit");
    if (!r.confirmed_by_user_id) push(issues, `ack_audit.${key}.confirmed_by_user_id`, "confirmed_by_user_id required", "ack_audit");
    if (!r.confirmed_by_role) push(issues, `ack_audit.${key}.confirmed_by_role`, "confirmed_by_role required", "ack_audit");
    if (!r.intake_id || (intakeId && r.intake_id !== intakeId)) push(issues, `ack_audit.${key}.intake_id`, "intake_id required and must match", "ack_audit");
    if (!r.form_version) push(issues, `ack_audit.${key}.form_version`, "form_version required", "ack_audit");
    if (!r.schema_version) push(issues, `ack_audit.${key}.schema_version`, "schema_version required", "ack_audit");
  }
  return { ok: issues.length === 0, issues };
}

export function validateInstructorAssessment(
  ia: InstructorAssessmentV2,
  student: StudentSectionsV2,
  issues: ValidationIssue[] = [],
  requireMinimum = true,
): ValidationResult {
  for (const key of requireMinimum ? REQUIRED_INSTRUCTOR_MINIMUM : []) {
    if (!hasText(val(ia[key]) as unknown) && !hasSelection(val(ia[key]) as unknown)) {
      push(issues, `instructor_assessment.${key}`, `${key} is required for instructor completion.`, "required");
    }
  }
  const flags = evaluateExplainableFlags(student);
  if (hasBlockingHighRiskFlags(flags)) {
    for (const key of CONDITIONAL_INSTRUCTOR_HIGH_RISK) {
      if (!hasText(val(ia[key]) as unknown)) {
        push(issues, `instructor_assessment.${key}`, `${key} is required when high-risk flags are present.`, "conditional_required");
      }
    }
  }
  return { ok: issues.length === 0, issues };
}

export function validateIntakeWritePayload(payload: Record<string, unknown>): ValidationResult {
  const issues: ValidationIssue[] = [];
  const forbidden = new Set(["id", "student_user_id", "created_at", "started_at", "schema_version", "form_version"]);
  // Completed snapshot protection is enforced separately.
  for (const k of Object.keys(payload)) {
    if (forbidden.has(k)) push(issues, k, `${k} cannot be modified via normal update.`, "immutable");
  }
  return { ok: issues.length === 0, issues };
}

export function canTransitionStatus(from: IntakeV2Status, to: IntakeV2Status): boolean {
  if (from === to) return true;
  const allowed: Record<IntakeV2Status, IntakeV2Status[]> = {
    draft: ["draft", "in_progress", "completed"],
    in_progress: ["in_progress", "completed", "draft"],
    completed: ["completed", "superseded", "archived"],
    superseded: ["superseded", "archived"],
    archived: ["archived"],
  };
  return allowed[from]?.includes(to) ?? false;
}
