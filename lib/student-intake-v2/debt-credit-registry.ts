/**
 * Authoritative Debt & Credit spec registry (Phase 3C, owner-approved controlled local implementation).
 * Additive to Intake V2 Financial Health; follows Financial Health registry pattern.
 * Field keys are additive and must not rename/remove existing keys.
 * DC-01..DC-12. Risk-flag triggers/thresholds unchanged; no educational indicators activated.
 */
import { PREFER_NOT_TO_SAY } from "./contracts";
import { FH_NOT_SURE } from "./financial-health-registry";

export const DC_PNTS = PREFER_NOT_TO_SAY;
export const DC_NOT_SURE = FH_NOT_SURE;

export const DC_OPTIONS = {
  confidence: [
    "Very confident",
    "Mostly confident",
    "Somewhat confident",
    "Not very confident",
    "Not confident at all",
    DC_PNTS,
  ],
  manageability: [
    "Manageable without difficulty",
    "Manageable but tight",
    "Sometimes difficult to manage",
    "Often difficult to manage",
    "Not manageable right now",
    DC_PNTS,
  ],
  utilizationAwareness: [
    "I usually keep balances low compared to limits",
    "Balances are sometimes moderate",
    "Balances are often high compared to limits",
    "I am close to or at credit limits",
    "I don't have revolving credit / not applicable to me",
    DC_NOT_SURE,
    DC_PNTS,
  ],
  paymentHistory: [
    "I consistently pay on time",
    "I usually pay on time with occasional late payments",
    "I have missed payments more than occasionally",
    "I am currently behind on payments",
    DC_NOT_SURE,
    DC_PNTS,
  ],
  stress: [
    "No stress",
    "A little stress",
    "Moderate stress",
    "High stress",
    "Very high stress",
    DC_PNTS,
  ],
  reductionStrategy: [
    "Paying more than minimums when possible",
    "Following a structured payoff plan (snowball/avalanche or similar)",
    "Consolidating or refinancing (exploring or in progress)",
    "Making minimum payments only right now",
    "Not currently using a specific strategy",
    DC_NOT_SURE,
    DC_PNTS,
  ],
  creditGoals: [
    "Improve payment consistency",
    "Lower credit utilization",
    "Pay down debt balances",
    "Build or rebuild credit history",
    "Understand my credit reports/scores better",
    "No specific credit goal right now",
    DC_NOT_SURE,
    DC_PNTS,
  ],
  hardshipStatus: [
    "No recent financial hardship",
    "Yes, within the last 3 months",
    "Yes, within the last 4–12 months",
    "Yes, more than 12 months ago",
    DC_NOT_SURE,
    DC_PNTS,
  ],
  borrowingReliance: [
    "Never / rarely",
    "Occasionally",
    "Sometimes",
    "Often",
    "Very often",
    DC_PNTS,
  ],
  payoffPriorities: [
    "Highest interest first",
    "Smallest balance first",
    "Most urgent/past-due first",
    "Whatever I can pay right now",
    "No clear priority yet",
    DC_NOT_SURE,
    DC_PNTS,
  ],
  educationInterest: [
    "Very interested",
    "Somewhat interested",
    "A little interested",
    "Not interested right now",
    DC_PNTS,
  ],
  improvementGoals612: [
    "Pay down debt",
    "Build emergency savings",
    "Improve credit habits/score over time",
    "Reduce monthly payment pressure",
    "Increase income or income stability",
    "Create a realistic budget/spending plan",
    "Prepare for future major expenses",
    "Learn more about debt and credit",
    DC_NOT_SURE,
    DC_PNTS,
  ],
} as const;

export type DebtCreditRegistryField = {
  key: string;
  dcId: string;
  question: string;
  helperText?: string;
  control: "select" | "multiselect" | "composite";
  requiredAtCompletion: boolean | "conditional";
  pntsAllowed: boolean;
  conditional?: string;
  options?: readonly string[];
  maxNoteLength?: number;
};

export const DEBT_CREDIT_REGISTRY: DebtCreditRegistryField[] = [
  {
    key: "debtRepaymentConfidence",
    dcId: "DC-01",
    question: "How confident do you feel about managing and making your debt or repayment obligations?",
    helperText: "Your answers help personalize education, not evaluate you for credit eligibility.",
    control: "select",
    options: DC_OPTIONS.confidence,
    requiredAtCompletion: true,
    pntsAllowed: true,
  },
  {
    key: "minimumPaymentManageability",
    dcId: "DC-02",
    question: "How manageable are your minimum required payments right now?",
    helperText: "This asks about payment affordability/manageability (not your payment consistency/history). Answers help personalize education; debt status alone does not create a high-risk designation.",
    control: "select",
    options: DC_OPTIONS.manageability,
    requiredAtCompletion: "conditional",
    pntsAllowed: true,
    conditional: "Shown/required only when Financial Health debt status is Yes. Omit active answer when hidden.",
  },
  {
    key: "creditUtilizationAwareness",
    dcId: "DC-03",
    question: "How would you describe your credit card or revolving balance usage compared to your available limits?",
    helperText: "High-level awareness only. No account numbers or exact balances.",
    control: "select",
    options: DC_OPTIONS.utilizationAwareness,
    requiredAtCompletion: true,
    pntsAllowed: true,
  },
  {
    key: "paymentHistoryConsistency",
    dcId: "DC-04",
    question: "How consistent has your payment history been recently?",
    helperText: "This asks about payment consistency/history (not current affordability/manageability). Your answers help personalize education, not evaluate credit eligibility.",
    control: "select",
    options: DC_OPTIONS.paymentHistory,
    requiredAtCompletion: true,
    pntsAllowed: true,
  },
  {
    key: "debtRelatedStress",
    dcId: "DC-05",
    question: "How much stress do debt or repayment obligations cause you right now?",
    control: "select",
    options: DC_OPTIONS.stress,
    requiredAtCompletion: true,
    pntsAllowed: true,
  },
  {
    key: "debtReductionStrategy",
    dcId: "DC-06",
    question: "What approach, if any, are you using to reduce debt right now?",
    helperText: "Educational context only; no specific financial strategy is required or recommended here.",
    control: "select",
    options: DC_OPTIONS.reductionStrategy,
    requiredAtCompletion: "conditional",
    pntsAllowed: true,
    conditional: "Shown/required only when Financial Health debt status is Yes. Omit active answer when hidden.",
  },
  {
    key: "creditBuildingGoals",
    dcId: "DC-07",
    question: "What credit-related goals matter most to you right now?",
    control: "select",
    options: DC_OPTIONS.creditGoals,
    requiredAtCompletion: true,
    pntsAllowed: true,
  },
  {
    key: "recentFinancialHardship",
    dcId: "DC-08",
    question: "Have you experienced a recent financial hardship that affected your ability to manage bills or debt?",
    helperText: "Optional high-level note only (max 280 characters). Do not share sensitive personal, medical, legal, or account details. Your answers help personalize education, not guarantee outcomes.",
    control: "composite",
    options: DC_OPTIONS.hardshipStatus,
    requiredAtCompletion: true,
    pntsAllowed: true,
    maxNoteLength: 280,
    conditional: "Status required (PNTS valid). Note optional, max 280 chars.",
  },
  {
    key: "emergencyBorrowingReliance",
    dcId: "DC-09",
    question: "How often do you rely on credit, borrowing, or delayed payments to cover essential expenses?",
    control: "select",
    options: DC_OPTIONS.borrowingReliance,
    requiredAtCompletion: true,
    pntsAllowed: true,
  },
  {
    key: "debtPayoffPriorities",
    dcId: "DC-10",
    question: "If you are working on paying down debt, what best describes your current priority?",
    control: "select",
    options: DC_OPTIONS.payoffPriorities,
    requiredAtCompletion: "conditional",
    pntsAllowed: true,
    conditional: "Shown/required only when Financial Health debt status is Yes. Omit active answer when hidden.",
  },
  {
    key: "creditEducationInterest",
    dcId: "DC-11",
    question: "How interested are you in learning more about debt management and credit habits?",
    control: "select",
    options: DC_OPTIONS.educationInterest,
    requiredAtCompletion: true,
    pntsAllowed: true,
  },
  {
    key: "financialImprovementGoals612",
    dcId: "DC-12",
    question: "Over the next 6–12 months, which financial improvements would you like to work toward?",
    helperText: "Select all that apply. Goals are personal and not promised outcomes. Prefer not to say and Not sure yet are mutually exclusive with specific goals. No free-text \"Other\" field.",
    control: "multiselect",
    options: DC_OPTIONS.improvementGoals612,
    requiredAtCompletion: true,
    pntsAllowed: true,
  },
];

export const DEBT_CREDIT_KEY_ORDER = DEBT_CREDIT_REGISTRY.map((f) => f.key);
export const DEBT_CREDIT_CONDITIONAL_KEYS = ["minimumPaymentManageability", "debtReductionStrategy", "debtPayoffPriorities"] as const;
export const DEBT_CREDIT_HARDSHIP_NOTE_MAX = 280;

export function isDebtCreditHiddenForHasDebt(hasDebt: unknown): boolean {
  // Owner-approved: hide DC-02, DC-06, DC-10 unless Financial Health hasDebt === "Yes".
  return hasDebt !== "Yes";
}

export function isDebtCreditMutexSelection(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  const hasPnts = value.includes(DC_PNTS);
  const hasNotSure = value.includes(DC_NOT_SURE);
  const specifics = value.filter((v) => v !== DC_PNTS && v !== DC_NOT_SURE);
  return (hasPnts || hasNotSure) && specifics.length > 0;
}

export const DC_HARDSHIP_NOTE_MAX = DEBT_CREDIT_HARDSHIP_NOTE_MAX;
