/**
 * Intake V2 foundational contracts (Phase 1, additive).
 * Source of truth: approved revised Intake V2 specification.
 * Do NOT rename approved field keys.
 */

export const INTAKE_V2_SCHEMA_VERSION = "hft_intake_v2.0" as const;
export const INTAKE_V2_FORM_VERSION = "hft_intake_v2_form.2026-11-05_phase3f" as const;

export type IntakeV2Status = "draft" | "in_progress" | "completed" | "superseded" | "archived";

export type CaptureMode =
  | "student_reported"
  | "instructor_entered_for_student";

export type ProvenanceSource =
  | "student_reported"
  | "instructor_entered_for_student"
  | "instructor_assessment"
  | "system_derived";

export type Provenance = {
  source: ProvenanceSource;
  entered_by_user_id?: string | null;
  entered_at?: string | null;
  rule_ids?: string[];
  source_fields?: string[];
  explanation?: string | null;
};

export type FieldValue<T = unknown> = {
  value: T;
  provenance?: Provenance;
};

export const PREFER_NOT_TO_SAY = "Prefer not to say" as const;
export type PreferNotToSay = typeof PREFER_NOT_TO_SAY;

/**
 * Student-facing controls: Q1-Q74 (revised spec, preserved) plus additive Phase 3C
 * Debt & Credit keys (DC-01..DC-12). Existing Q1-Q74 keys/meanings/shapes must not
 * be renamed or removed. New keys are additive only.
 */
export type StudentSectionsV2 = {
  // Section 1
  preferredName?: FieldValue<string>;
  location?: FieldValue<string>;
  timeZone?: FieldValue<string>;
  occupation?: FieldValue<string>;
  employmentType?: FieldValue<string>;
  workScheduleSummary?: FieldValue<string>;
  majorResponsibilities?: FieldValue<string[]>;
  dependentsRange?: FieldValue<string>;
  majorObligations90d?: FieldValue<string>;
  currentLifeGoal?: FieldValue<string>;
  motivationAndWhyNow?: FieldValue<string>;
  currentObstacle?: FieldValue<string>;
  // Section 2
  monthlyTakeHomeRange?: FieldValue<string>;
  additionalIncome?: FieldValue<{ hasAdditional: string; range?: string }>;
  incomeConsistencyPay?: FieldValue<{ consistency: string; payFrequency: string }>;
  disposableIncomeRange?: FieldValue<string>;
  recurringObligationsRange?: FieldValue<string>;
  variableExpensesRange?: FieldValue<string>;
  upcomingMajorExpenses?: FieldValue<{ hasUpcoming: string; note?: string }>;
  savingsEmergencyRanges?: FieldValue<{ savings: string; emergencyFund: string }>;
  unexpectedExpenseAbility?: FieldValue<string>;
  debtStatusTypes?: FieldValue<{ hasDebt: string; types?: string[] }>;
  totalDebtRange?: FieldValue<string>;
  monthlyDebtPaymentsRange?: FieldValue<string>;
  creditScoreRange?: FieldValue<string>;
  availableTradingCapitalRange?: FieldValue<string>;
  affordableLossRange?: FieldValue<string>;
  pressureToMakeMoneyQuickly?: FieldValue<string>;
  desiredAdditionalMonthlyIncomeRange?: FieldValue<string>;
  financialReasonForTrading?: FieldValue<string>;
  // Section 3
  marketsExperience?: FieldValue<string[]>;
  demoLiveExperience?: FieldValue<{ demo: string; live: string }>;
  liveAccountSizeRange?: FieldValue<string>;
  knowledgeMatrix?: FieldValue<Record<string, string>>; // 13 topics
  platformsBrokerExperience?: FieldValue<{ platforms: string[]; brokerExperience: string; brokerNames?: string }>;
  priorEducation?: FieldValue<{ type: string; notes?: string }>;
  majorNegativeExperience?: FieldValue<{ type: string; reflection?: string }>;
  biggestTradingConfusion?: FieldValue<string>;
  resultsDrivers?: FieldValue<string>;
  lossCauseBelief?: FieldValue<string>;
  // Section 4
  behaviorMatrix?: FieldValue<Record<string, string>>; // 5 dimensions
  behaviorTendencies?: FieldValue<string[]>;
  reactionToLoss?: FieldValue<string>;
  reactionToWin?: FieldValue<string>;
  willingDemoFirst?: FieldValue<string>;
  willingRiskLimits?: FieldValue<string>;
  disciplineBreakers?: FieldValue<string>;
  selfStrength?: FieldValue<string>;
  // Section 5
  goalImmediate?: FieldValue<string>;
  goals30_60_90?: FieldValue<{ goal30: string; goal60: string; goal90: string }>;
  goals6_12?: FieldValue<{ goal6: string; goal12?: string }>;
  goalBig?: FieldValue<string>;
  goalWhy?: FieldValue<string>;
  successDefinition?: FieldValue<string>;
  desiredTradingIncomeRange?: FieldValue<string>;
  membershipValue?: FieldValue<string>;
  disengageRisk?: FieldValue<string>;
  // Section 6
  learningStyles?: FieldValue<string[]>;
  paceAndQuestionComfort?: FieldValue<{ pace: string; questionComfort: string }>;
  homeworkPreference?: FieldValue<string[]>;
  accountabilityFeedback?: FieldValue<{ accountability: string; feedbackFrequency: string }>;
  overwhelmTriggers?: FieldValue<string>;
  whatHelpsClick?: FieldValue<string>;
  chartFeedbackHelpful?: FieldValue<string>;
  // Section 7
  weeklyAvailability?: FieldValue<Record<string, { windows: string[]; note?: string }>>;
  unavailableDays?: FieldValue<string[]>;
  weeklyHoursRange?: FieldValue<string>;
  windowsAndConsistency?: FieldValue<{ preferredWindows: string[]; consistencyExpectation: string }>;
  scheduleObligationsNote?: FieldValue<string>;
  // Section 8
  devicesInternet?: FieldValue<{ devices: string[]; internetReliability: string }>;
  platformAccess?: FieldValue<{ tradingView: string; mt5: string; demoAccount: string; liveAccount: string }>;
  supportTechReadiness?: FieldValue<{ canScreenShare: string; softwareComfort: string }>;
  techLimitations?: FieldValue<string>;
  // Section 9
  ackChecklist?: FieldValue<Record<AcknowledgmentKey, boolean>>;
  // Section 3C Debt & Credit (additive, owner-approved DC-01..DC-12)
  debtRepaymentConfidence?: FieldValue<string>;
  minimumPaymentManageability?: FieldValue<string>; // conditional: hasDebt === "Yes"
  creditUtilizationAwareness?: FieldValue<string>;
  paymentHistoryConsistency?: FieldValue<string>;
  debtRelatedStress?: FieldValue<string>;
  debtReductionStrategy?: FieldValue<string>; // conditional: hasDebt === "Yes"
  creditBuildingGoals?: FieldValue<string>;
  recentFinancialHardship?: FieldValue<{ status: string; note?: string }>; // note optional, max 280 chars
  emergencyBorrowingReliance?: FieldValue<string>;
  debtPayoffPriorities?: FieldValue<string>; // conditional: hasDebt === "Yes"
  creditEducationInterest?: FieldValue<string>;
  financialImprovementGoals612?: FieldValue<string[]>; // multiselect; PNTS/Not sure yet mutually exclusive
  // Section 3D Monthly Obligations & Cash Flow (additive, owner-approved MO-01..MO-14)
  householdIncomeSources?: FieldValue<string[]>;
  reliableMonthlyIncomePlanningRange?: FieldValue<string>;
  housingSituationPayment?: FieldValue<{ status: string; monthlyRange?: string }>;
  utilitiesHouseholdNecessitiesRange?: FieldValue<string>;
  transportationObligationRange?: FieldValue<{ hasTransportationCost: string; monthlyRange?: string }>;
  foodGroceriesRange?: FieldValue<string>;
  insuranceMedicalRecurringRange?: FieldValue<string>;
  dependentSupportObligation?: FieldValue<{ hasDependentSupportCost: string; monthlyRange?: string }>;
  subscriptionsDiscretionaryRecurringRange?: FieldValue<string>;
  otherRecurringObligations?: FieldValue<{ hasOtherObligations: string; monthlyRange?: string; note?: string }>;
  monthlySavingsContributionRange?: FieldValue<string>;
  remainingDiscretionaryCashFlowRange?: FieldValue<string>;
  cashFlowVariabilityConfidence?: FieldValue<string>;
  billsMoneyUsedForTradingFrequency?: FieldValue<string>; // "Prefer not to answer" is PNTS-equivalent
  // Section 3E Trading Capital, Risk Capacity & Funding Readiness (additive, owner-approved TC-01..TC-10)
  // TC-11 (canPauseLiveTradingIfNeeded) intentionally deferred to behavioral/risk phase — NOT implemented.
  liveTradingFundingStatus?: FieldValue<string>;
  tradingCapitalSources?: FieldValue<string[]>;
  tradingCapitalSeparation?: FieldValue<string>;
  lossOfTradingCapitalImpact?: FieldValue<string[]>;
  tradingCapitalReplacementExpectation?: FieldValue<string>;
  tradingCapitalTimeHorizon?: FieldValue<string>;
  emergencyFundProtectionIntent?: FieldValue<string>;
  borrowedCreditFundingIntent?: FieldValue<string>;
  tradingProfitsForEssentialExpensesExpectation?: FieldValue<string>;
  liveTradingReadinessSelfAssessment?: FieldValue<string>;
  // Section 3F Trading Behavior, Psychology & Discipline (additive, owner-approved PF-01..PF-09).
  // TC-11 (canPauseLiveTradingIfNeeded) NOT implemented — represented by PF-05/PF-06. No multiselect/mutex/free text.
  // PNTS-equivalent "Prefer not to answer" stored as-is. Beginner/no-experience answers valid; not risk designations.
  // Existing Q39–Q46 (behaviorMatrix/behaviorTendencies/reactionToLoss/reactionToWin/willingDemoFirst/willingRiskLimits/disciplineBreakers/selfStrength) unchanged.
  situationalLossResponse?: FieldValue<string>;
  situationalWinStreakResponse?: FieldValue<string>;
  missedTradeFomoResponse?: FieldValue<string>;
  unplannedTradeFrequency?: FieldValue<string>;
  plannedLossLimitStopAdherence?: FieldValue<string>;
  willingToPauseLiveTradingAndReturnToDemo?: FieldValue<string>;
  protectiveExitBehavior?: FieldValue<string>;
  noTradeDayAcceptance?: FieldValue<string>;
  journalReviewPractice?: FieldValue<string>;
};

export const ACKNOWLEDGMENT_KEYS = [
  "ackRiskOfLoss",
  "ackEducationOnly",
  "ackNoGuarantees",
  "ackPastPerformance",
  "ackEssentialFunds",
  "ackDemoMayBeRequired",
  "ackPersonalResponsibility",
] as const;
export type AcknowledgmentKey = (typeof ACKNOWLEDGMENT_KEYS)[number];

export type AckAuditRecord = {
  ack_key: AcknowledgmentKey;
  ack_text_version_id: string;
  ack_text_hash?: string;
  confirmed: true;
  confirmed_at: string;
  confirmed_by_user_id: string;
  confirmed_by_role: string;
  intake_id: string;
  form_version: string;
  schema_version: string;
  capture_mode: CaptureMode;
};

export type AckAudit = {
  records: AckAuditRecord[];
};

/** Instructor-only fields I1-I19. Never student-visible in raw/private form. */
export type InstructorAssessmentV2 = {
  instructorSummary?: FieldValue<string>; // I1 required
  assessedExperienceLevel?: FieldValue<string>; // I2
  assessedKnowledgeLevel?: FieldValue<string>; // I3
  instructorStrengths?: FieldValue<string>; // I4
  instructorWeaknesses?: FieldValue<string>; // I5
  behavioralConcerns?: FieldValue<string>; // I6 conditional
  financialRiskConcerns?: FieldValue<string>; // I7 conditional
  scheduleConcerns?: FieldValue<string>; // I8
  learningStyleObservations?: FieldValue<string>; // I9
  recommendedStartingLevel?: FieldValue<string>; // I10
  recommendedAcademyTrack?: FieldValue<string>; // I11
  recommendedModules?: FieldValue<string[] | string>; // I12
  recommendedFirstLesson?: FieldValue<string>; // I13
  firstHomework?: FieldValue<string>; // I14
  recommendedPracticeFrequency?: FieldValue<string>; // I15
  recommendedCoachingFrequency?: FieldValue<string>; // I16
  riskRestrictions?: FieldValue<string>; // I17 conditional
  instructorPrivateNotes?: FieldValue<string>; // I18 never student-visible
  immediateActionItems?: FieldValue<string>; // I19
};

export type ExplainableFlag = {
  rule_id: string;
  flag_name: string;
  source_fields: string[];
  triggering_values: Array<{ field: string; value: unknown; label?: string }>;
  explanation: string;
  suggested_instructor_action: string;
  severity?: "info" | "review" | "high";
};

export type ProposedSeedKind =
  | "debt_account"
  | "bill"
  | "income_transaction"
  | "spending_transaction"
  | "savings_balance"
  | "goal"
  | "trading_record"
  | "financial_profile"
  | "mentor_checkin"
  | "trading_plan";

export type ProposedSeed = {
  kind: ProposedSeedKind;
  label: string;
  source_fields: string[];
  intake_v2_id?: string;
  snapshot_date?: string;
  payload: Record<string, unknown>;
  requires_explicit_confirmation: true;
};

export type CallSheetProvenance = "student_reported" | "instructor_entered" | "instructor_assessed" | "system_derived" | "profile" | "system";

export type CallSheetField<T = unknown> = {
  label: string;
  value: T;
  provenance: CallSheetProvenance | CallSheetProvenance[];
  source_fields?: string[];
};

export type CallSheetV2 = {
  studentName: CallSheetField<string>;
  studentNumber: CallSheetField<string | null>;
  consultationDate: CallSheetField<string | null>;
  instructor: CallSheetField<string | null>;
  assessedLevel: CallSheetField<string | null>;
  tradingExperience: CallSheetField<string | null>;
  strongestKnowledgeAreas: CallSheetField<string[]>;
  biggestKnowledgeGaps: CallSheetField<string[]>;
  behavioralRiskFlags: CallSheetField<Array<{ flag: string; reasons: string[] }>>;
  financialReadinessConcerns: CallSheetField<string | null>;
  primaryMotivation: CallSheetField<string | null>;
  immediateGoal: CallSheetField<string | null>;
  goals30_60_90: CallSheetField<string | null>;
  bigGoal: CallSheetField<string | null>;
  learningStyle: CallSheetField<string | null>;
  homeworkPreference: CallSheetField<string[]>;
  weeklyAvailability: CallSheetField<string | null>;
  bestCoachingWindows: CallSheetField<string | null>;
  recommendedAcademyTrack: CallSheetField<string | null>;
  recommendedModules: CallSheetField<string[]>;
  firstLesson: CallSheetField<string | null>;
  firstHomework: CallSheetField<string | null>;
  practiceFrequency: CallSheetField<string | null>;
  coachingFrequency: CallSheetField<string | null>;
  immediateActionItems: CallSheetField<string | null>;
  nextCheckIn: CallSheetField<string | null>;
  instructorPrivate: { instructorPrivateNotes: CallSheetField<string | null> }; // instructor-only subsection
};

export type IntakeV2Record = {
  id: string;
  student_user_id: string;
  booking_id: string | null;
  legacy_consultation_questionnaire_id: string | null;
  schema_version: string;
  form_version: string;
  status: IntakeV2Status;
  snapshot_version: number;
  student_sections_json: StudentSectionsV2;
  acknowledgments_json: Record<AcknowledgmentKey, boolean> | Record<string, boolean>;
  ack_audit_json: AckAudit;
  instructor_assessment_json: InstructorAssessmentV2;
  system_flags_json?: ExplainableFlag[];
  proposed_seeds_json?: ProposedSeed[];
  system_meta_json?: Record<string, unknown>;
  provenance_json?: Record<string, Provenance>;
  created_by_user_id: string | null;
  updated_by_user_id: string | null;
  completed_by_user_id: string | null;
  instructor_user_id: string | null;
  started_at: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

export const INTAKE_V2_STUDENT_KEYS = [
  // Q1-Q74 preserved (order/meanings unchanged)
  "preferredName","location","timeZone","occupation","employmentType","workScheduleSummary","majorResponsibilities","dependentsRange","majorObligations90d","currentLifeGoal","motivationAndWhyNow","currentObstacle",
  "monthlyTakeHomeRange","additionalIncome","incomeConsistencyPay","disposableIncomeRange","recurringObligationsRange","variableExpensesRange","upcomingMajorExpenses","savingsEmergencyRanges","unexpectedExpenseAbility","debtStatusTypes","totalDebtRange","monthlyDebtPaymentsRange","creditScoreRange","availableTradingCapitalRange","affordableLossRange","pressureToMakeMoneyQuickly","desiredAdditionalMonthlyIncomeRange","financialReasonForTrading",
  "marketsExperience","demoLiveExperience","liveAccountSizeRange","knowledgeMatrix","platformsBrokerExperience","priorEducation","majorNegativeExperience","biggestTradingConfusion","resultsDrivers","lossCauseBelief",
  "behaviorMatrix","behaviorTendencies","reactionToLoss","reactionToWin","willingDemoFirst","willingRiskLimits","disciplineBreakers","selfStrength",
  "goalImmediate","goals30_60_90","goals6_12","goalBig","goalWhy","successDefinition","desiredTradingIncomeRange","membershipValue","disengageRisk",
  "learningStyles","paceAndQuestionComfort","homeworkPreference","accountabilityFeedback","overwhelmTriggers","whatHelpsClick","chartFeedbackHelpful",
  "weeklyAvailability","unavailableDays","weeklyHoursRange","windowsAndConsistency","scheduleObligationsNote",
  "devicesInternet","platformAccess","supportTechReadiness","techLimitations",
  "ackChecklist",
  // Phase 3C Debt & Credit (additive, owner-approved DC-01..DC-12)
  "debtRepaymentConfidence","minimumPaymentManageability","creditUtilizationAwareness","paymentHistoryConsistency","debtRelatedStress","debtReductionStrategy","creditBuildingGoals","recentFinancialHardship","emergencyBorrowingReliance","debtPayoffPriorities","creditEducationInterest","financialImprovementGoals612",
  // Phase 3D Monthly Obligations & Cash Flow (additive, owner-approved MO-01..MO-14)
  "householdIncomeSources","reliableMonthlyIncomePlanningRange","housingSituationPayment","utilitiesHouseholdNecessitiesRange","transportationObligationRange","foodGroceriesRange","insuranceMedicalRecurringRange","dependentSupportObligation","subscriptionsDiscretionaryRecurringRange","otherRecurringObligations","monthlySavingsContributionRange","remainingDiscretionaryCashFlowRange","cashFlowVariabilityConfidence","billsMoneyUsedForTradingFrequency",
  // Phase 3E Trading Capital, Risk Capacity & Funding Readiness (additive, TC-01..TC-10; TC-11 deferred)
  "liveTradingFundingStatus","tradingCapitalSources","tradingCapitalSeparation","lossOfTradingCapitalImpact","tradingCapitalReplacementExpectation","tradingCapitalTimeHorizon","emergencyFundProtectionIntent","borrowedCreditFundingIntent","tradingProfitsForEssentialExpensesExpectation","liveTradingReadinessSelfAssessment",
  // Phase 3F Trading Behavior, Psychology & Discipline (additive, PF-01..PF-09; TC-11 NOT implemented)
  "situationalLossResponse","situationalWinStreakResponse","missedTradeFomoResponse","unplannedTradeFrequency","plannedLossLimitStopAdherence","willingToPauseLiveTradingAndReturnToDemo","protectiveExitBehavior","noTradeDayAcceptance","journalReviewPractice",
] as const;

export const INTAKE_V2_STUDENT_KEY_COUNT = INTAKE_V2_STUDENT_KEYS.length;

export const INTAKE_V2_INSTRUCTOR_KEYS = [
  "instructorSummary","assessedExperienceLevel","assessedKnowledgeLevel","instructorStrengths","instructorWeaknesses","behavioralConcerns","financialRiskConcerns","scheduleConcerns","learningStyleObservations","recommendedStartingLevel","recommendedAcademyTrack","recommendedModules","recommendedFirstLesson","firstHomework","recommendedPracticeFrequency","recommendedCoachingFrequency","riskRestrictions","instructorPrivateNotes","immediateActionItems",
] as const;

export const INTAKE_V2_INSTRUCTOR_PRIVATE_KEYS = ["instructorPrivateNotes"] as const;

export const KNOWLEDGE_MATRIX_TOPICS = [
  "buy_sell_direction","stop_loss","take_profit","lot_size","pips","leverage","spread_fees","candlesticks","support_resistance","trend","market_structure_basics","risk_management","position_sizing",
] as const;

export const BEHAVIOR_MATRIX_DIMENSIONS = [
  "fomo","revenge_trading","impulsiveness","patience","rule_consistency",
] as const;
