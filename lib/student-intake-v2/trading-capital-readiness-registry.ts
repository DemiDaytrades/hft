/**
 * Authoritative Trading Capital, Risk Capacity & Funding Readiness registry
 * (Phase 3E, owner-approved). Additive. Collects structured facts only.
 * Do NOT calculate trading-plan parameters. Do NOT activate/persist review indicators or new flags.
 */
import { PREFER_NOT_TO_SAY } from "./contracts";

export const TC_PNTS = PREFER_NOT_TO_SAY;
export const TC_PNTS_ANSWER = "Prefer not to answer";
export const TC_NOT_SURE = "Not sure yet";

export const TC_OPTIONS = {
  fundingStatus: [
    "No money allocated for live trading",
    "Saving toward future trading capital",
    "Money set aside but account not funded",
    "Live trading account funded but not actively trading",
    "Currently trading with personal funds",
    "Demo/paper trading only",
    TC_NOT_SURE,
    TC_PNTS_ANSWER,
  ],
  capitalSources: [
    "Discretionary income",
    "Dedicated savings specifically for trading",
    "General savings",
    "Prior trading profits",
    "Business/self-employment income",
    "Gift",
    "Household/partner contribution",
    "Borrowed money",
    "Credit card / credit line",
    "Retirement funds",
    "Emergency savings",
    "Money normally used for bills/living expenses",
    "Other source",
    "Not funded yet",
    TC_NOT_SURE,
    TC_PNTS_ANSWER,
  ],
  separation: [
    "Yes, fully separate",
    "Mostly separate",
    "Partially separate",
    "No",
    "Not funded yet",
    TC_NOT_SURE,
    TC_PNTS_ANSWER,
  ],
  lossImpact: [
    "Ability to pay bills",
    "Debt payments",
    "Groceries/basic living",
    "Transportation",
    "Emergency preparedness",
    "Savings goals",
    "None of these",
    "Not funded yet",
    TC_NOT_SURE,
    TC_PNTS_ANSWER,
  ],
  replacementExpectation: [
    "Pause live trading and continue demo/education while rebuilding",
    "Stop live trading and rebuild discretionary savings first",
    "Replace from future discretionary income only when affordable",
    "Replace from general savings not needed for essentials",
    "Use money needed for bills or essential expenses",
    "Borrow money or use credit",
    "Not replace it",
    "Not funded yet",
    TC_NOT_SURE,
    TC_PNTS_ANSWER,
  ],
  timeHorizon: [
    "Not needed for another purpose / truly discretionary",
    "May be needed within 1 month",
    "May be needed in 1–3 months",
    "May be needed in 3–6 months",
    "May be needed in 6–12 months",
    "May be needed in more than 12 months",
    "Not funded yet",
    TC_NOT_SURE,
    TC_PNTS_ANSWER,
  ],
  emergencyProtection: [
    "Yes",
    "Mostly",
    "No",
    "I do not currently have emergency savings",
    "Not funding live trading yet",
    TC_NOT_SURE,
    TC_PNTS_ANSWER,
  ],
  borrowedCreditIntent: [
    "No",
    "Possibly",
    "Yes",
    "Already have",
    "Not funding live trading yet",
    TC_NOT_SURE,
    TC_PNTS_ANSWER,
  ],
  profitsForEssentialsExpectation: [
    "No",
    "Maybe occasionally",
    "Yes, for some expenses",
    "Yes, expected to cover major essential expenses",
    "Not live trading yet",
    TC_NOT_SURE,
    TC_PNTS_ANSWER,
  ],
  readinessSelfAssessment: [
    "Ready now",
    "Almost ready",
    "Need to build savings first",
    "Need to stabilize monthly cash flow first",
    "Need to address debt/obligations first",
    "Prefer demo trading for now",
    TC_NOT_SURE,
    TC_PNTS_ANSWER,
  ],
} as const;

export type TradingCapitalReadinessRegistryField = {
  key: string;
  tcId: string;
  question: string;
  helperText?: string;
  control: "select" | "multiselect";
  requiredAtCompletion: boolean;
  pntsAllowed: boolean;
  options: readonly string[];
  mutexValues?: readonly string[];
};

export const TRADING_CAPITAL_READINESS_REGISTRY: TradingCapitalReadinessRegistryField[] = [
  { key: "liveTradingFundingStatus", tcId: "TC-01", question: "What best describes your current live-trading funding status?", control: "select", options: TC_OPTIONS.fundingStatus, requiredAtCompletion: true, pntsAllowed: true },
  { key: "tradingCapitalSources", tcId: "TC-02", question: "If you have money set aside or funded for live trading now, or plan to fund it, which sources apply?", helperText: "Select all that apply. Not funded yet, Not sure yet, and Prefer not to answer must be selected alone. Unsafe funding sources are captured as facts for educational review, not normalized.", control: "multiselect", options: TC_OPTIONS.capitalSources, requiredAtCompletion: true, pntsAllowed: true, mutexValues: ["Not funded yet", TC_NOT_SURE, TC_PNTS_ANSWER] },
  { key: "tradingCapitalSeparation", tcId: "TC-03", question: "Is money used or planned for live trading kept separate from money needed for essential obligations (housing, utilities, groceries, debt payments, transportation, emergency needs)?", control: "select", options: TC_OPTIONS.separation, requiredAtCompletion: true, pntsAllowed: true },
  { key: "lossOfTradingCapitalImpact", tcId: "TC-04", question: "If the money currently planned or available for live trading were lost, which areas would be affected?", helperText: "Select all that apply. None of these, Not funded yet, Not sure yet, and Prefer not to answer must be selected alone.", control: "multiselect", options: TC_OPTIONS.lossImpact, requiredAtCompletion: true, pntsAllowed: true, mutexValues: ["None of these", "Not funded yet", TC_NOT_SURE, TC_PNTS_ANSWER] },
  { key: "tradingCapitalReplacementExpectation", tcId: "TC-05", question: "If you lost some or all of your live-trading capital, what would you most likely do next?", helperText: "This does not imply that replenishing losses is expected.", control: "select", options: TC_OPTIONS.replacementExpectation, requiredAtCompletion: true, pntsAllowed: true },
  { key: "tradingCapitalTimeHorizon", tcId: "TC-06", question: "When might money potentially used for live trading be needed for another purpose?", control: "select", options: TC_OPTIONS.timeHorizon, requiredAtCompletion: true, pntsAllowed: true },
  { key: "emergencyFundProtectionIntent", tcId: "TC-07", question: "If you fund live trading now or in the future, do you intend to keep emergency savings untouched?", helperText: "Lack of emergency savings alone is not an automatic high-risk designation.", control: "select", options: TC_OPTIONS.emergencyProtection, requiredAtCompletion: true, pntsAllowed: true },
  { key: "borrowedCreditFundingIntent", tcId: "TC-08", question: "Do you plan to use borrowed money or credit to fund or replenish live trading?", helperText: "Neutral, non-shaming. Distinct from reliance on borrowing/credit for essential expenses.", control: "select", options: TC_OPTIONS.borrowedCreditIntent, requiredAtCompletion: true, pntsAllowed: true },
  { key: "tradingProfitsForEssentialExpensesExpectation", tcId: "TC-09", question: "Do you expect near-term trading profits to help pay bills, debt payments, or other essential living expenses?", helperText: "Distinct from whether essential money has been used for trading/investing. Educational planning fact only.", control: "select", options: TC_OPTIONS.profitsForEssentialsExpectation, requiredAtCompletion: true, pntsAllowed: true },
  { key: "liveTradingReadinessSelfAssessment", tcId: "TC-10", question: "How do you currently view your readiness to fund live trading with personal money?", helperText: "Self-assessment is not authoritative; future engine/instructor review may reach a different conclusion.", control: "select", options: TC_OPTIONS.readinessSelfAssessment, requiredAtCompletion: true, pntsAllowed: true },
];

export const TRADING_CAPITAL_READINESS_KEY_ORDER = TRADING_CAPITAL_READINESS_REGISTRY.map((f) => f.key);

export function isTcPnTSEquivalent(value: unknown): boolean {
  return value === TC_PNTS || value === TC_PNTS_ANSWER;
}

export function isTcMutexSelectionInvalid(value: unknown, mutexValues: readonly string[]): boolean {
  if (!Array.isArray(value)) return false;
  const mutex = new Set<string>(mutexValues as string[]);
  const hasMutex = value.some((v) => mutex.has(String(v)));
  const hasSpecific = value.some((v) => !mutex.has(String(v)));
  return hasMutex && hasSpecific;
}
