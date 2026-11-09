/**
 * Authoritative Financial Health spec registry (owner-approved 1A-10A + overrides).
 * Single source for question text, options, UI mapping, validation-compatible values,
 * and flag-semantic mappings. Field keys and object shapes remain unchanged.
 */
import { PREFER_NOT_TO_SAY } from "./contracts";

export const FH_PNTS = PREFER_NOT_TO_SAY;
export const FH_NOT_SURE = "Not sure yet";
export const FH_I_DONT_KNOW = "I don't know";

export const FH_RANGE = {
  monthlyTakeHomeRange: ["$0", "Under $1,000", "$1,000–$1,999", "$2,000–$2,999", "$3,000–$4,999", "$5,000–$7,499", "$7,500–$9,999", "$10,000+", FH_PNTS],
  additionalIncomeRange: ["Under $250", "$250–$499", "$500–$999", "$1,000–$2,499", "$2,500+", FH_PNTS],
  disposableIncomeRange: ["$0", "Under $250", "$250–$499", "$500–$999", "$1,000–$1,999", "$2,000+", FH_PNTS],
  recurringObligationsRange: ["Under $500", "$500–$999", "$1,000–$1,999", "$2,000–$2,999", "$3,000–$4,999", "$5,000+", FH_PNTS],
  variableExpensesRange: ["Under $250", "$250–$499", "$500–$999", "$1,000–$1,999", "$2,000+", FH_PNTS],
  savingsEmergency: ["$0", "Under $500", "$500–$999", "$1,000–$2,499", "$2,500–$4,999", "$5,000+", FH_PNTS],
  totalDebtRange: ["Under $1,000", "$1,000–$4,999", "$5,000–$9,999", "$10,000–$24,999", "$25,000–$49,999", "$50,000+", FH_PNTS],
  monthlyDebtPaymentsRange: ["Under $100", "$100–$249", "$250–$499", "$500–$999", "$1,000–$1,999", "$2,000+", FH_PNTS],
  creditScoreRange: ["Below 580", "580–669", "670–739", "740–799", "800+", FH_I_DONT_KNOW, FH_PNTS],
  // Keep stored compatibility value for existing flag logic; label is clarified in UI text/question.
  // Phase 3C: 6A display-only label "$0 — no trading capital available right now" is used in UI;
  // stored value remains "$0 (not available now)" for flag/provenance compatibility.
  availableTradingCapitalRange: ["$0 (not available now)", "Under $250", "$250–$499", "$500–$999", "$1,000–$2,499", "$2,500–$4,999", "$5,000+", FH_PNTS],
  affordableLossRange: ["$0", "Under $100", "$100–$249", "$250–$499", "$500–$999", "$1,000+", FH_PNTS],
  desiredAdditionalMonthlyIncomeRange: ["Under $250", "$250–$499", "$500–$999", "$1,000–$2,499", "$2,500–$4,999", "$5,000+", FH_NOT_SURE, FH_PNTS],
} as const;

export const FH_ENUM = {
  yesNoPnts: ["Yes", "No", FH_PNTS],
  upcoming: ["Yes", "No", "Not sure", FH_PNTS],
  incomeConsistency: ["Very consistent", "Mostly consistent", "Somewhat inconsistent", "Very inconsistent / unpredictable", FH_PNTS],
  payFrequency: ["Weekly", "Every 2 weeks", "Twice a month", "Monthly", "Irregular / varies", "Other", FH_PNTS],
  unexpectedExpenseAbility: [
    "I could cover it from cash/savings without hardship",
    "I could cover it, but it would be difficult",
    "I would likely need to use credit, borrow, or delay other bills",
    "I would likely not be able to cover it right now",
    FH_PNTS,
  ],
  pressureToMakeMoneyQuickly: ["No urgency right now", "A little urgency", "Moderate urgency", "High urgency", FH_PNTS],
  debtTypes: [
    "Credit cards",
    "Auto loan",
    "Student loans",
    "Personal loans",
    "Medical debt",
    "Mortgage / housing debt",
    "Tax debt",
    "Buy Now Pay Later / installment debt",
    "Other",
    FH_PNTS,
  ],
} as const;

// Flag-semantic mappings (preserve existing flag trigger semantics/behavior).
export const FH_AVAILABLE_CAPITAL_ZERO_VALUES = new Set(["$0 (not available now)", "$0 — no trading capital available right now", "$0"]);
export const FH_AFFORDABLE_LOSS_ZERO_VALUES = new Set(["$0"]);
export const FH_EMERGENCY_FUND_ZERO_VALUES = new Set(["$0"]);
export const FH_PRESSURE_MODERATE_OR_STRONG = new Set(["Moderate urgency", "High urgency", "Moderately", "Strongly"]);
export const FH_PRESSURE_STRONG = new Set(["High urgency", "Strongly"]);
export const FH_UNEXPECTED_NEEDS_BORROW_OR_CANNOT = new Set([
  "I would likely need to use credit, borrow, or delay other bills",
  "I would likely not be able to cover it right now",
  "Would need to borrow/use credit",
  "Would not be able to cover it",
]);

export function isAvailableCapitalZero(v: unknown): boolean { return typeof v === "string" && FH_AVAILABLE_CAPITAL_ZERO_VALUES.has(v); }
export function isAffordableLossZero(v: unknown): boolean { return typeof v === "string" && FH_AFFORDABLE_LOSS_ZERO_VALUES.has(v); }
export function isEmergencyFundZero(v: unknown): boolean { return typeof v === "string" && FH_EMERGENCY_FUND_ZERO_VALUES.has(v); }
export function isPressureModerateOrStrong(v: unknown): boolean { return typeof v === "string" && FH_PRESSURE_MODERATE_OR_STRONG.has(v); }
export function isPressureStrong(v: unknown): boolean { return typeof v === "string" && FH_PRESSURE_STRONG.has(v); }
export function isUnexpectedExpenseFragile(v: unknown): boolean { return typeof v === "string" && FH_UNEXPECTED_NEEDS_BORROW_OR_CANNOT.has(v); }

export type FinancialHealthRegistryField = {
  key: string;
  question: string;
  helperText?: string;
  control: "select" | "composite" | "text";
  requiredAtCompletion: boolean | "conditional";
  pntsAllowed: boolean;
  conditional?: string;
  options?: readonly string[];
  subfields?: Record<string, { label: string; options?: readonly string[]; control?: string }>;
};

export const FINANCIAL_HEALTH_REGISTRY: FinancialHealthRegistryField[] = [
  { key: "monthlyTakeHomeRange", question: "What is your approximate monthly take-home income (after taxes)?", control: "select", options: FH_RANGE.monthlyTakeHomeRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "additionalIncome", question: "Do you have additional monthly income beyond your main take-home pay (side work, benefits, support, etc.)?", control: "composite", requiredAtCompletion: "conditional", pntsAllowed: true, conditional: "If Yes, additional income range is required.", subfields: { hasAdditional: { label: "Additional income", options: FH_ENUM.yesNoPnts, control: "select" }, range: { label: "About how much additional monthly income?", options: FH_RANGE.additionalIncomeRange, control: "select" } } },
  { key: "incomeConsistencyPay", question: "How consistent is your income, and how often are you paid?", control: "composite", requiredAtCompletion: true, pntsAllowed: true, subfields: { consistency: { label: "Income consistency", options: FH_ENUM.incomeConsistency, control: "select" }, payFrequency: { label: "Pay frequency", options: FH_ENUM.payFrequency, control: "select" } } },
  { key: "disposableIncomeRange", question: "After essential bills and obligations, about how much money is typically left over each month?", control: "select", options: FH_RANGE.disposableIncomeRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "recurringObligationsRange", question: "About how much do you pay each month for recurring obligations (rent/mortgage, utilities, insurance, required payments, etc.)?", control: "select", options: FH_RANGE.recurringObligationsRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "variableExpensesRange", question: "About how much do variable expenses typically cost each month (food/groceries, gas/transport, personal spending, etc.)?", control: "select", options: FH_RANGE.variableExpensesRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "upcomingMajorExpenses", question: "Do you expect any major expenses in the next 90 days (repairs, medical, tuition, travel, large bills, etc.)?", control: "composite", requiredAtCompletion: "conditional", pntsAllowed: true, conditional: "If Yes, a brief high-level note is required.", subfields: { hasUpcoming: { label: "Major expenses expected", options: FH_ENUM.upcoming, control: "select" }, note: { label: "Briefly describe (high level)", control: "text" } } },
  { key: "savingsEmergencyRanges", question: "About how much do you have in General savings and in an Emergency fund?", helperText: "General savings and emergency fund are separate. Do not include money needed for essential living expenses as trading capital.", control: "composite", requiredAtCompletion: true, pntsAllowed: true, subfields: { savings: { label: "General savings (not reserved only for emergencies)", options: FH_RANGE.savingsEmergency, control: "select" }, emergencyFund: { label: "Emergency fund (set aside for unexpected essential expenses)", options: FH_RANGE.savingsEmergency, control: "select" } } },
  { key: "unexpectedExpenseAbility", question: "If an unexpected $500 essential expense came up soon, how would you most likely handle it?", control: "select", options: FH_ENUM.unexpectedExpenseAbility, requiredAtCompletion: true, pntsAllowed: true },
  { key: "debtStatusTypes", question: "Do you currently have any debt or required repayment obligations?", control: "composite", requiredAtCompletion: "conditional", pntsAllowed: true, conditional: "If Yes, select high-level debt types and provide total debt/monthly payment ranges. If No or Prefer not to say, debt burden details are not required. No creditor names, APRs, individual balances, delinquency, or account details.", subfields: { hasDebt: { label: "Current debt/repayment obligations", options: FH_ENUM.yesNoPnts, control: "select" }, types: { label: "Which types apply? (high-level only)", options: FH_ENUM.debtTypes, control: "multiselect" } } },
  { key: "totalDebtRange", question: "Approximately what is your total outstanding debt (all debts combined)?", helperText: "High-level estimate only. Detailed account records belong in Debt & Credit.", control: "select", options: FH_RANGE.totalDebtRange, requiredAtCompletion: "conditional", pntsAllowed: true, conditional: "Required only when debt status is Yes." },
  { key: "monthlyDebtPaymentsRange", question: "About how much do you pay toward debt each month (total, all debts combined)?", helperText: "High-level estimate only. No individual minimum payments or accounts.", control: "select", options: FH_RANGE.monthlyDebtPaymentsRange, requiredAtCompletion: "conditional", pntsAllowed: true, conditional: "Required only when debt status is Yes." },
  { key: "creditScoreRange", question: "If you know it, what is your approximate credit score range?", helperText: "Optional self-reported estimate. No exact score required.", control: "select", options: FH_RANGE.creditScoreRange, requiredAtCompletion: false, pntsAllowed: true },
  { key: "availableTradingCapitalRange", question: "If you chose to practice with real funds later, about how much money do you currently have available that is separate from essential living expenses?", helperText: "This does not mean you should fund a trading account. $0 — no trading capital available right now is a valid answer.", control: "select", options: FH_RANGE.availableTradingCapitalRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "affordableLossRange", question: "Realistically, how much money could you afford to lose without affecting rent, food, bills, debt payments, or other essential expenses?", helperText: "Education-only context; no trading outcome is expected or promised.", control: "select", options: FH_RANGE.affordableLossRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "pressureToMakeMoneyQuickly", question: "How much financial urgency do you feel to generate money quickly right now?", control: "select", options: FH_ENUM.pressureToMakeMoneyQuickly, requiredAtCompletion: true, pntsAllowed: true },
  { key: "desiredAdditionalMonthlyIncomeRange", question: "As a personal goal (not an expected or promised result), about how much additional monthly income would you like to work toward over time?", helperText: "HFT does not guarantee trading income. This goal will not be used to justify unsafe risk.", control: "select", options: FH_RANGE.desiredAdditionalMonthlyIncomeRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "financialReasonForTrading", question: "What would you like trading to help you accomplish financially, if anything? This could be extra monthly income, building savings, paying down debt, creating another income stream, or another goal.", helperText: "Share as much as you’re comfortable with. This does not imply trading will accomplish that goal.", control: "text", requiredAtCompletion: true, pntsAllowed: true },
];

export const FINANCIAL_HEALTH_KEY_ORDER = FINANCIAL_HEALTH_REGISTRY.map((f) => f.key);
