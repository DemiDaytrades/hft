export type GuidedRenderer =
  | "welcome"
  | "capture"
  | "financial-health"
  | "monthly-obligations"
  | "debt-credit"
  | "trading-capital"
  | "trading-behavior"
  | "acknowledgments"
  | "review"
  | "instructor-review";

export type GuidedSectionId =
  | "about"
  | "schedule"
  | "money"
  | "monthly"
  | "debt"
  | "capital"
  | "experience"
  | "behavior"
  | "goals"
  | "acknowledgments"
  | "review"
  | "instructor";

export type GuidedScreen = {
  id: string;
  section: GuidedSectionId;
  title: string;
  description: string;
  renderer: GuidedRenderer;
  captureSectionId?: string;
  fields?: readonly string[];
  parts?: Readonly<Record<string, readonly string[]>>;
  ackKeys?: readonly string[];
};

export type AssessmentStageId = "questions" | "readiness" | "instructor" | "plans";

export type AssessmentStage = {
  id: AssessmentStageId;
  label: string;
  description: string;
};

export const ASSESSMENT_STAGES: readonly AssessmentStage[] = [
  {
    id: "questions",
    label: "Student Questions",
    description: "Capture the approved questionnaire in short, related screens.",
  },
  {
    id: "readiness",
    label: "Readiness Review",
    description: "Read the derived financial, trading, and learning readiness evidence.",
  },
  {
    id: "instructor",
    label: "Instructor Review",
    description: "Record human judgment, observations, and review status.",
  },
  {
    id: "plans",
    label: "Plans & Decisions",
    description: "Open the authoritative financial and learning-path workspaces.",
  },
];

export function stageById(id: string | null | undefined): AssessmentStage | undefined {
  return ASSESSMENT_STAGES.find((stage) => stage.id === id);
}

export const GUIDED_SECTIONS: readonly { id: GuidedSectionId; label: string }[] = [
  { id: "about", label: "About You" },
  { id: "schedule", label: "Your Schedule" },
  { id: "money", label: "Money Snapshot" },
  { id: "monthly", label: "Monthly Obligations" },
  { id: "debt", label: "Debt & Credit" },
  { id: "capital", label: "Trading Capital" },
  { id: "experience", label: "Trading Experience" },
  { id: "behavior", label: "Trading Behavior" },
  { id: "goals", label: "Goals & Support" },
  { id: "acknowledgments", label: "Acknowledgments" },
  { id: "review", label: "Review & Submit" },
  { id: "instructor", label: "Instructor Review" },
];

export const GUIDED_SCREENS: readonly GuidedScreen[] = [
  {
    id: "welcome",
    section: "about",
    title: "Guided consultation intake",
    description: "Capture the approved Intake V2 responses in short, related groups. Unknown answers stay blank. No answer is inferred.",
    renderer: "welcome",
  },
  {
    id: "about-identity",
    section: "about",
    title: "Identity and time zone",
    description: "Confirm how the student should be addressed and where they are located.",
    renderer: "capture",
    captureSectionId: "about-student",
    fields: ["preferredName", "location", "timeZone"],
  },
  {
    id: "about-work",
    section: "about",
    title: "Work and responsibilities",
    description: "Understand the student's working context and weekly responsibilities.",
    renderer: "capture",
    captureSectionId: "about-student",
    fields: ["occupation", "employmentType", "workScheduleSummary", "majorResponsibilities"],
  },
  {
    id: "about-life",
    section: "about",
    title: "Life context and motivation",
    description: "Capture what the student is working toward and what currently gets in the way.",
    renderer: "capture",
    captureSectionId: "about-student",
    fields: ["dependentsRange", "majorObligations90d", "currentLifeGoal", "motivationAndWhyNow", "currentObstacle"],
  },
  {
    id: "schedule-availability",
    section: "schedule",
    title: "Weekly availability",
    description: "Map the student's available study and practice time.",
    renderer: "capture",
    captureSectionId: "schedule-tech",
    fields: ["weeklyAvailability", "unavailableDays", "weeklyHoursRange"],
  },
  {
    id: "schedule-consistency",
    section: "schedule",
    title: "Time and consistency",
    description: "Capture preferred windows, consistency expectations, and schedule obligations.",
    renderer: "capture",
    captureSectionId: "schedule-tech",
    fields: ["windowsAndConsistency", "scheduleObligationsNote"],
    parts: { windowsAndConsistency: ["preferredWindows", "consistencyExpectation"] },
  },
  {
    id: "schedule-tech",
    section: "schedule",
    title: "Devices and technology",
    description: "Confirm devices, platform access, and technical readiness.",
    renderer: "capture",
    captureSectionId: "schedule-tech",
    fields: ["devicesInternet", "platformAccess", "supportTechReadiness", "techLimitations"],
  },
  {
    id: "money-income",
    section: "money",
    title: "Income",
    description: "Capture take-home income, additional income, and income consistency.",
    renderer: "financial-health",
    fields: ["monthlyTakeHomeRange", "additionalIncome", "incomeConsistencyPay", "desiredAdditionalMonthlyIncomeRange"],
  },
  {
    id: "money-cash-flow",
    section: "money",
    title: "Monthly cash flow",
    description: "Capture what remains after essentials and how urgent the financial pressure feels.",
    renderer: "financial-health",
    fields: ["disposableIncomeRange", "recurringObligationsRange", "variableExpensesRange", "pressureToMakeMoneyQuickly"],
  },
  {
    id: "money-reserves",
    section: "money",
    title: "Reserves and financial reason",
    description: "Capture savings, upcoming expenses, and the financial reason for learning trading.",
    renderer: "financial-health",
    fields: ["upcomingMajorExpenses", "savingsEmergencyRanges", "unexpectedExpenseAbility", "financialReasonForTrading"],
  },
  {
    id: "monthly-income-housing",
    section: "monthly",
    title: "Income sources and housing",
    description: "Capture household income sources, reliable planning income, and housing.",
    renderer: "monthly-obligations",
    fields: ["householdIncomeSources", "reliableMonthlyIncomePlanningRange", "housingSituationPayment"],
  },
  {
    id: "monthly-essentials",
    section: "monthly",
    title: "Essential monthly costs",
    description: "Capture utilities, transportation, food, and recurring insurance or medical costs.",
    renderer: "monthly-obligations",
    fields: ["utilitiesHouseholdNecessitiesRange", "transportationObligationRange", "foodGroceriesRange", "insuranceMedicalRecurringRange"],
  },
  {
    id: "monthly-dependents",
    section: "monthly",
    title: "Dependents and other obligations",
    description: "Capture dependent support, subscriptions, and other recurring obligations.",
    renderer: "monthly-obligations",
    fields: ["dependentSupportObligation", "subscriptionsDiscretionaryRecurringRange", "otherRecurringObligations"],
  },
  {
    id: "monthly-savings",
    section: "monthly",
    title: "Savings and remaining cash flow",
    description: "Capture monthly savings behavior, remaining cash flow, and predictability.",
    renderer: "monthly-obligations",
    fields: ["monthlySavingsContributionRange", "remainingDiscretionaryCashFlowRange", "cashFlowVariabilityConfidence", "billsMoneyUsedForTradingFrequency"],
  },
  {
    id: "debt-status",
    section: "debt",
    title: "Debt status",
    description: "Capture high-level debt types, total debt, and monthly debt payments.",
    renderer: "financial-health",
    fields: ["debtStatusTypes", "totalDebtRange", "monthlyDebtPaymentsRange"],
  },
  {
    id: "debt-repayment",
    section: "debt",
    title: "Repayment and priorities",
    description: "Capture repayment confidence, payment manageability, and payoff priorities.",
    renderer: "debt-credit",
    fields: ["debtRepaymentConfidence", "minimumPaymentManageability", "paymentHistoryConsistency", "debtPayoffPriorities"],
  },
  {
    id: "debt-credit",
    section: "debt",
    title: "Credit awareness",
    description: "Capture credit score range, utilization awareness, and credit goals.",
    renderer: "debt-credit",
    fields: ["creditScoreRange", "creditUtilizationAwareness", "creditBuildingGoals", "creditEducationInterest"],
  },
  {
    id: "debt-stress",
    section: "debt",
    title: "Stress, hardship, and strategy",
    description: "Capture debt-related stress, recent hardship, borrowing reliance, and reduction strategy.",
    renderer: "debt-credit",
    fields: ["debtRelatedStress", "recentFinancialHardship", "emergencyBorrowingReliance", "debtReductionStrategy", "financialImprovementGoals612"],
  },
  {
    id: "capital-available",
    section: "capital",
    title: "Capital available",
    description: "Capture available trading capital, affordable loss, funding status, and capital sources.",
    renderer: "trading-capital",
    fields: ["availableTradingCapitalRange", "affordableLossRange", "liveTradingFundingStatus", "tradingCapitalSources"],
  },
  {
    id: "capital-protection",
    section: "capital",
    title: "Separation and protection",
    description: "Capture capital separation, loss impact, replacement expectations, and time horizon.",
    renderer: "trading-capital",
    fields: ["tradingCapitalSeparation", "lossOfTradingCapitalImpact", "tradingCapitalReplacementExpectation", "tradingCapitalTimeHorizon"],
  },
  {
    id: "capital-expectations",
    section: "capital",
    title: "Protection and expectations",
    description: "Capture emergency-fund protection, borrowed funding, income expectations, and readiness.",
    renderer: "trading-capital",
    fields: ["emergencyFundProtectionIntent", "borrowedCreditFundingIntent", "tradingProfitsForEssentialExpensesExpectation", "liveTradingReadinessSelfAssessment"],
  },
  {
    id: "experience-markets",
    section: "experience",
    title: "Markets and experience",
    description: "Capture markets traded, demo/live experience, and live account size where applicable.",
    renderer: "capture",
    captureSectionId: "trading-experience",
    fields: ["marketsExperience", "demoLiveExperience", "liveAccountSizeRange"],
  },
  {
    id: "experience-knowledge-1",
    section: "experience",
    title: "Knowledge self-report 1",
    description: "Capture self-reported familiarity with order basics and trade mechanics.",
    renderer: "capture",
    captureSectionId: "trading-experience",
    fields: ["knowledgeMatrix"],
    parts: { knowledgeMatrix: ["buy_sell_direction", "stop_loss", "take_profit", "lot_size", "pips"] },
  },
  {
    id: "experience-knowledge-2",
    section: "experience",
    title: "Knowledge self-report 2",
    description: "Capture self-reported familiarity with leverage, costs, charts, and market structure.",
    renderer: "capture",
    captureSectionId: "trading-experience",
    fields: ["knowledgeMatrix"],
    parts: { knowledgeMatrix: ["leverage", "spread_fees", "candlesticks", "support_resistance", "trend"] },
  },
  {
    id: "experience-knowledge-3",
    section: "experience",
    title: "Knowledge self-report 3",
    description: "Capture the remaining knowledge topics and platform/broker experience.",
    renderer: "capture",
    captureSectionId: "trading-experience",
    fields: ["knowledgeMatrix", "platformsBrokerExperience"],
    parts: { knowledgeMatrix: ["market_structure_basics", "risk_management", "position_sizing"] },
  },
  {
    id: "experience-education",
    section: "experience",
    title: "Education and reflections",
    description: "Capture prior education, negative experiences, confusion, and beliefs about results.",
    renderer: "capture",
    captureSectionId: "trading-experience",
    fields: ["priorEducation", "majorNegativeExperience", "biggestTradingConfusion", "resultsDrivers", "lossCauseBelief"],
  },
  {
    id: "behavior-patterns",
    section: "behavior",
    title: "Self-reported patterns",
    description: "Capture general behavior patterns and reactions to losses and wins.",
    renderer: "capture",
    captureSectionId: "risk-profile",
    fields: ["behaviorMatrix", "behaviorTendencies", "reactionToLoss", "reactionToWin"],
  },
  {
    id: "behavior-willingness",
    section: "behavior",
    title: "Willingness and discipline",
    description: "Capture demo-first willingness, risk-limit willingness, and discipline context.",
    renderer: "capture",
    captureSectionId: "risk-profile",
    fields: ["willingDemoFirst", "willingRiskLimits", "disciplineBreakers", "selfStrength"],
  },
  {
    id: "behavior-situational-1",
    section: "behavior",
    title: "Situational behavior 1",
    description: "Capture likely responses to losses, wins, missed trades, and unplanned trades.",
    renderer: "trading-behavior",
    fields: ["situationalLossResponse", "situationalWinStreakResponse", "missedTradeFomoResponse", "unplannedTradeFrequency"],
  },
  {
    id: "behavior-situational-2",
    section: "behavior",
    title: "Situational behavior 2",
    description: "Capture stop adherence, pause/return behavior, protective exits, and review habits.",
    renderer: "trading-behavior",
    fields: ["plannedLossLimitStopAdherence", "willingToPauseLiveTradingAndReturnToDemo", "protectiveExitBehavior", "noTradeDayAcceptance", "journalReviewPractice"],
  },
  {
    id: "goals-horizons",
    section: "goals",
    title: "Goals and horizons",
    description: "Capture immediate, 30/60/90-day, 6/12-month, and big-picture goals.",
    renderer: "capture",
    captureSectionId: "income-goal",
    fields: ["goalImmediate", "goals30_60_90", "goals6_12", "goalBig"],
  },
  {
    id: "goals-success",
    section: "goals",
    title: "Success and membership",
    description: "Capture why the goal matters, what success looks like, and what membership would change.",
    renderer: "capture",
    captureSectionId: "income-goal",
    fields: ["goalWhy", "successDefinition", "desiredTradingIncomeRange", "membershipValue", "disengageRisk"],
  },
  {
    id: "goals-learning",
    section: "goals",
    title: "Learning preferences",
    description: "Capture preferred learning styles, pace, and question comfort.",
    renderer: "capture",
    captureSectionId: "learning-support",
    fields: ["learningStyles", "paceAndQuestionComfort", "homeworkPreference"],
  },
  {
    id: "goals-support",
    section: "goals",
    title: "Support and accountability",
    description: "Capture accountability, feedback, overwhelm triggers, and what helps concepts click.",
    renderer: "capture",
    captureSectionId: "learning-support",
    fields: ["accountabilityFeedback", "overwhelmTriggers", "whatHelpsClick", "chartFeedbackHelpful"],
  },
  {
    id: "acknowledgments-1",
    section: "acknowledgments",
    title: "Acknowledgments 1",
    description: "Record only the acknowledgments the student has actually confirmed.",
    renderer: "acknowledgments",
    ackKeys: ["ackRiskOfLoss", "ackEducationOnly", "ackNoGuarantees", "ackPastPerformance"],
  },
  {
    id: "acknowledgments-2",
    section: "acknowledgments",
    title: "Acknowledgments 2",
    description: "Record the remaining acknowledgments only after genuine confirmation.",
    renderer: "acknowledgments",
    ackKeys: ["ackEssentialFunds", "ackDemoMayBeRequired", "ackPersonalResponsibility"],
  },
  {
    id: "review",
    section: "review",
    title: "Review and submit",
    description: "Check required information, review missing items, and finalize the immutable snapshot.",
    renderer: "review",
  },
  {
    id: "instructor-review",
    section: "instructor",
    title: "Instructor review",
    description: "Review evidence, missing information, conflicts, and instructor judgment separately from student answers.",
    renderer: "instructor-review",
  },
];

const FIELD_TO_SCREEN = new Map<string, string>();
const ACK_TO_SCREEN = new Map<string, string>();

for (const screen of GUIDED_SCREENS) {
  for (const key of screen.ackKeys ?? []) ACK_TO_SCREEN.set(key, screen.id);
  for (const field of screen.fields ?? []) {
    const parts = screen.parts?.[field];
    if (parts) {
      for (const part of parts) FIELD_TO_SCREEN.set(`${field}.${part}`, screen.id);
    } else {
      FIELD_TO_SCREEN.set(field, screen.id);
    }
  }
}

for (const screen of GUIDED_SCREENS) {
  for (const field of screen.fields ?? []) {
    if (!FIELD_TO_SCREEN.has(field)) FIELD_TO_SCREEN.set(field, screen.id);
  }
}

export function screenForIssuePath(path: string): string | undefined {
  const normalized = path
    .replace(/^student_sections\./, "")
    .replace(/^acknowledgments_json\./, "acknowledgments.")
    .replace(/^acknowledgments\./, "acknowledgments.");

  if (normalized.startsWith("instructor_")) return "instructor-review";
  if (normalized.startsWith("acknowledgments.")) {
    const key = normalized.split(".")[1];
    return ACK_TO_SCREEN.get(key) ?? "review";
  }
  if (normalized.startsWith("ack_audit.")) {
    const key = normalized.split(".")[1];
    return ACK_TO_SCREEN.get(key) ?? "review";
  }

  const exact = FIELD_TO_SCREEN.get(normalized);
  if (exact) return exact;

  const base = normalized.split(".")[0];
  return FIELD_TO_SCREEN.get(base) ?? (base === "student_sections" ? "review" : undefined);
}

export function fieldKeyForIssuePath(path: string): string | undefined {
  const normalized = path
    .replace(/^student_sections\./, "")
    .replace(/^acknowledgments_json\./, "acknowledgments.")
    .replace(/^acknowledgments\./, "acknowledgments.");

  if (normalized.startsWith("instructor_")) return undefined;
  if (normalized.startsWith("acknowledgments.") || normalized.startsWith("ack_audit.")) {
    const key = normalized.split(".")[1];
    return key ? `ack:${key}` : undefined;
  }

  const parts = normalized.split(".");
  if (parts[0] === "student_sections") return undefined;
  if (parts.length >= 2) {
    const exact = `${parts[0]}.${parts[1]}`;
    if (FIELD_TO_SCREEN.has(exact)) return exact;
    if (parts[0] === "weeklyAvailability") return exact;
  }
  return parts[0] || undefined;
}

export function screenById(id: string): GuidedScreen | undefined {
  return GUIDED_SCREENS.find((screen) => screen.id === id);
}

export function firstMissingScreen(paths: readonly string[]): string | undefined {
  for (const path of paths) {
    const id = screenForIssuePath(path);
    if (id) return id;
  }
  return undefined;
}

export function screenQuestionCount(screen: GuidedScreen): number {
  if (screen.ackKeys) return screen.ackKeys.length;
  const fields = screen.fields ?? [];
  return fields.reduce((count, field) => count + (screen.parts?.[field]?.length ?? 1), 0);
}
