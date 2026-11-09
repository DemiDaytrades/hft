/**
 * Authoritative Monthly Obligations & Cash Flow registry (Phase 3D, owner-approved).
 * Additive to Intake V2. Collects structured facts for future planning/consistency engines.
 * Do NOT activate/persist review indicators or new risk flags in Phase 3D.
 * Field keys are additive; existing Q1-Q74/FH/DC keys unchanged.
 */
import { PREFER_NOT_TO_SAY } from "./contracts";

export const MO_PNTS = PREFER_NOT_TO_SAY;
export const MO_PNTS_ANSWER = "Prefer not to answer";
export const MO_NOT_SURE = "Not sure yet";

export const MO_OPTIONS = {
  incomeSources: [
    "Primary employment",
    "Self-employment/business",
    "Side work/gig income",
    "Investment/passive income",
    "Benefits/assistance",
    "Household/partner contribution",
    "Other income source",
    "No regular income source right now",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  reliableMonthlyIncome: [
    "$0",
    "Under $500",
    "$500–$999",
    "$1,000–$1,999",
    "$2,000–$2,999",
    "$3,000–$4,999",
    "$5,000–$7,499",
    "$7,500+",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  housingStatus: [
    "Rent",
    "Mortgage payment",
    "Housing contribution to household",
    "No current housing payment",
    "Other housing arrangement",
    MO_PNTS,
  ],
  housingRange: [
    "$0",
    "Under $500",
    "$500–$999",
    "$1,000–$1,499",
    "$1,500–$1,999",
    "$2,000–$2,999",
    "$3,000+",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  utilitiesRange: [
    "$0",
    "Under $100",
    "$100–$249",
    "$250–$499",
    "$500–$749",
    "$750–$999",
    "$1,000+",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  transportationStatus: ["Yes", "No / not applicable", MO_PNTS],
  transportationRange: [
    "$0",
    "Under $100",
    "$100–$249",
    "$250–$499",
    "$500–$749",
    "$750–$999",
    "$1,000+",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  foodRange: [
    "$0",
    "Under $200",
    "$200–$399",
    "$400–$599",
    "$600–$799",
    "$800–$999",
    "$1,000+",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  insuranceMedicalRange: [
    "$0 / none",
    "Under $50",
    "$50–$99",
    "$100–$249",
    "$250–$499",
    "$500+",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  dependentStatus: ["Yes", "No / none", "Not applicable", MO_PNTS],
  dependentRange: [
    "$0",
    "Under $100",
    "$100–$249",
    "$250–$499",
    "$500–$999",
    "$1,000+",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  subscriptionsRange: [
    "$0 / none",
    "Under $25",
    "$25–$49",
    "$50–$99",
    "$100–$199",
    "$200–$499",
    "$500+",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  otherObligationsStatus: ["Yes", "No / none", MO_PNTS],
  otherObligationsRange: [
    "$0",
    "Under $100",
    "$100–$249",
    "$250–$499",
    "$500–$999",
    "$1,000+",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  savingsContributionRange: [
    "$0 / not currently saving",
    "Under $50",
    "$50–$99",
    "$100–$249",
    "$250–$499",
    "$500–$999",
    "$1,000+",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  remainingCashFlowRange: [
    "$0",
    "Under $100",
    "$100–$249",
    "$250–$499",
    "$500–$999",
    "$1,000–$1,999",
    "$2,000+",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  variabilityConfidence: [
    "Very predictable",
    "Mostly predictable",
    "Somewhat unpredictable",
    "Very unpredictable",
    "Changes too much to estimate",
    MO_NOT_SURE,
    MO_PNTS,
  ],
  billsMoneyForTrading: [
    "Never",
    "Rarely",
    "Sometimes",
    "Often",
    "Not applicable / I have not traded or invested with personal funds",
    MO_NOT_SURE,
    MO_PNTS_ANSWER,
  ],
} as const;

export type MonthlyObligationsRegistryField = {
  key: string;
  moId: string;
  question: string;
  helperText?: string;
  control: "select" | "multiselect" | "composite";
  requiredAtCompletion: boolean | "conditional";
  pntsAllowed: boolean;
  conditional?: string;
  options?: readonly string[];
  noteMaxLength?: number;
};

export const MONTHLY_OBLIGATIONS_REGISTRY: MonthlyObligationsRegistryField[] = [
  { key: "householdIncomeSources", moId: "MO-01", question: "Which sources contribute to the money used for household needs?", helperText: "Household-level context only. No employer/account details. Benefits/assistance are not treated as a risk factor.", control: "multiselect", options: MO_OPTIONS.incomeSources, requiredAtCompletion: true, pntsAllowed: true, conditional: "No regular income source right now / Not sure yet / Prefer not to say are mutually exclusive with specific sources." },
  { key: "reliableMonthlyIncomePlanningRange", moId: "MO-02", question: "For planning purposes, what is the most reliable amount of monthly take-home money available for household needs?", helperText: "Additive to Financial Health monthly take-home range. This captures reliable planning income; answers are not overwritten or synchronized.", control: "select", options: MO_OPTIONS.reliableMonthlyIncome, requiredAtCompletion: true, pntsAllowed: true },
  { key: "housingSituationPayment", moId: "MO-03", question: "What best describes your current housing situation and monthly housing payment or contribution?", helperText: "No landlord, mortgage company, account number, address, or loan details.", control: "composite", options: MO_OPTIONS.housingStatus, requiredAtCompletion: "conditional", pntsAllowed: true, conditional: "If status is Rent/Mortgage payment/Housing contribution to household/Other housing arrangement, monthly range is required. If No current housing payment or Prefer not to say, monthly range is omitted (not required)." },
  { key: "utilitiesHouseholdNecessitiesRange", moId: "MO-04", question: "About how much do utilities and household necessities cost each month (electric, water/gas, internet/phone as needed, basic household essentials)?", control: "select", options: MO_OPTIONS.utilitiesRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "transportationObligationRange", moId: "MO-05", question: "About how much do transportation costs or obligations total each month (car payment, insurance, fuel/transit, maintenance as applicable)?", helperText: "No vehicle loan account, VIN, insurer policy, or lender details.", control: "composite", options: MO_OPTIONS.transportationStatus, requiredAtCompletion: "conditional", pntsAllowed: true, conditional: "If Yes, monthly range is required. If No / not applicable or Prefer not to say, monthly range is omitted." },
  { key: "foodGroceriesRange", moId: "MO-06", question: "About how much do food and groceries typically cost each month for the household?", control: "select", options: MO_OPTIONS.foodRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "insuranceMedicalRecurringRange", moId: "MO-07", question: "About how much do recurring insurance or medical costs total each month (premiums, prescriptions, routine care payments not already counted elsewhere)?", helperText: "No diagnoses, insurer/policy/account numbers, or medical records.", control: "select", options: MO_OPTIONS.insuranceMedicalRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "dependentSupportObligation", moId: "MO-08", question: "Do you have recurring childcare or dependent-support costs each month?", helperText: "Inclusive and nonjudgmental. Dependents are not treated as a risk factor.", control: "composite", options: MO_OPTIONS.dependentStatus, requiredAtCompletion: "conditional", pntsAllowed: true, conditional: "If Yes, monthly range is required. If No / none, Not applicable, or Prefer not to say, monthly range is omitted." },
  { key: "subscriptionsDiscretionaryRecurringRange", moId: "MO-09", question: "About how much do subscriptions and recurring discretionary expenses cost each month (streaming, memberships, apps, non-essential recurring spending)?", control: "select", options: MO_OPTIONS.subscriptionsRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "otherRecurringObligations", moId: "MO-10", question: "Are there other recurring monthly obligations not already covered?", helperText: "Do not re-enter individual debt accounts (use Debt & Credit/Financial Health). Optional note is high-level only (max 140 chars). Do not enter creditor names, account numbers, medical details, legal case details, or other unnecessary sensitive information.", control: "composite", options: MO_OPTIONS.otherObligationsStatus, requiredAtCompletion: "conditional", pntsAllowed: true, noteMaxLength: 140, conditional: "If Yes, monthly range is required and note is optional (max 140 chars). If No / none or Prefer not to say, monthly range/note are omitted." },
  { key: "monthlySavingsContributionRange", moId: "MO-11", question: "About how much do you typically set aside for savings each month right now (if any)?", helperText: "$0 / not currently saving is a valid answer.", control: "select", options: MO_OPTIONS.savingsContributionRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "remainingDiscretionaryCashFlowRange", moId: "MO-12", question: "After regular obligations and necessities, about how much money is typically left each month that is not committed to bills, debt payments, or essential needs?", helperText: "$0 is a valid answer and does not automatically create a punitive flag.", control: "select", options: MO_OPTIONS.remainingCashFlowRange, requiredAtCompletion: true, pntsAllowed: true },
  { key: "cashFlowVariabilityConfidence", moId: "MO-13", question: "How predictable is your month-to-month cash flow after obligations?", helperText: "Unpredictability alone is not a high-risk designation.", control: "select", options: MO_OPTIONS.variabilityConfidence, requiredAtCompletion: true, pntsAllowed: true },
  { key: "billsMoneyUsedForTradingFrequency", moId: "MO-14", question: "How often, if ever, has money needed for bills, debt payments, or essential living expenses been used for trading or investing?", helperText: "Neutral, non-shaming educational planning question. Non-disclosure is valid and does not create an automatic high-risk designation.", control: "select", options: MO_OPTIONS.billsMoneyForTrading, requiredAtCompletion: true, pntsAllowed: true },
];

export const MONTHLY_OBLIGATIONS_KEY_ORDER = MONTHLY_OBLIGATIONS_REGISTRY.map((f) => f.key);
export const MO_OTHER_NOTE_MAX = 140;

export const MO_HOUSING_RANGE_REQUIRED_STATUSES = new Set(["Rent", "Mortgage payment", "Housing contribution to household", "Other housing arrangement"]);
export const MO_HOUSING_HIDE_RANGE_STATUSES = new Set(["No current housing payment", MO_PNTS]);

export function isMoPnTSEquivalent(value: unknown): boolean {
  return value === MO_PNTS || value === MO_PNTS_ANSWER;
}

export function isMoIncomeSourcesMutexInvalid(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  const mutex = new Set<string>(["No regular income source right now", MO_NOT_SURE, MO_PNTS]);
  const hasMutex = value.some((v) => mutex.has(String(v)));
  const hasSpecific = value.some((v) => !mutex.has(String(v)));
  return hasMutex && hasSpecific;
}
