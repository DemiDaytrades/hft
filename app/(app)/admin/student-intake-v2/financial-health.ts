import {
  FH_ENUM,
  FH_RANGE,
  FINANCIAL_HEALTH_KEY_ORDER,
  FINANCIAL_HEALTH_REGISTRY,
} from "@/lib/student-intake-v2/financial-health-registry";

export type ControlType =
  | { kind: "select"; options: readonly string[]; displayLabels?: Record<string, string> }
  | { kind: "yesno"; options: readonly string[] }
  | { kind: "composite"; shape: "additionalIncome" | "incomeConsistencyPay" | "upcomingMajorExpenses" | "savingsEmergencyRanges" | "debtStatusTypes" }
  | { kind: "text" };

export const FINANCIAL_HEALTH_FIELDS = [
  { key: "monthlyTakeHomeRange", label: "Monthly take-home income (after taxes)", question: FINANCIAL_HEALTH_REGISTRY[0].question, control: { kind: "select", options: FH_RANGE.monthlyTakeHomeRange } as ControlType },
  { key: "additionalIncome", label: "Additional monthly income", question: FINANCIAL_HEALTH_REGISTRY[1].question, control: { kind: "composite", shape: "additionalIncome" } as ControlType, sub: { hasAdditional: { kind: "yesno", options: FH_ENUM.yesNoPnts }, range: { kind: "select", options: FH_RANGE.additionalIncomeRange } } },
  { key: "incomeConsistencyPay", label: "Income consistency and pay frequency", question: FINANCIAL_HEALTH_REGISTRY[2].question, control: { kind: "composite", shape: "incomeConsistencyPay" } as ControlType, sub: { consistency: { kind: "select", options: FH_ENUM.incomeConsistency }, payFrequency: { kind: "select", options: FH_ENUM.payFrequency } } },
  { key: "disposableIncomeRange", label: "Money left after essentials (monthly)", question: FINANCIAL_HEALTH_REGISTRY[3].question, control: { kind: "select", options: FH_RANGE.disposableIncomeRange } as ControlType },
  { key: "recurringObligationsRange", label: "Recurring monthly obligations", question: FINANCIAL_HEALTH_REGISTRY[4].question, control: { kind: "select", options: FH_RANGE.recurringObligationsRange } as ControlType },
  { key: "variableExpensesRange", label: "Variable monthly expenses", question: FINANCIAL_HEALTH_REGISTRY[5].question, control: { kind: "select", options: FH_RANGE.variableExpensesRange } as ControlType },
  { key: "upcomingMajorExpenses", label: "Major expenses in next 90 days", question: FINANCIAL_HEALTH_REGISTRY[6].question, control: { kind: "composite", shape: "upcomingMajorExpenses" } as ControlType, sub: { hasUpcoming: { kind: "yesno", options: FH_ENUM.upcoming }, note: { kind: "text" } } },
  { key: "savingsEmergencyRanges", label: "General savings and emergency fund", question: FINANCIAL_HEALTH_REGISTRY[7].question, helperText: FINANCIAL_HEALTH_REGISTRY[7].helperText, control: { kind: "composite", shape: "savingsEmergencyRanges" } as ControlType, sub: { savings: { kind: "select", options: FH_RANGE.savingsEmergency }, emergencyFund: { kind: "select", options: FH_RANGE.savingsEmergency } } },
  { key: "unexpectedExpenseAbility", label: "Unexpected $500 essential expense", question: FINANCIAL_HEALTH_REGISTRY[8].question, control: { kind: "select", options: FH_ENUM.unexpectedExpenseAbility } as ControlType },
  { key: "debtStatusTypes", label: "Debt / repayment obligations (high level)", question: FINANCIAL_HEALTH_REGISTRY[9].question, helperText: FINANCIAL_HEALTH_REGISTRY[9].helperText, control: { kind: "composite", shape: "debtStatusTypes" } as ControlType, sub: { hasDebt: { kind: "yesno", options: FH_ENUM.yesNoPnts }, types: { kind: "multiselect", options: FH_ENUM.debtTypes } } },
  { key: "totalDebtRange", label: "Total outstanding debt (approx.)", question: FINANCIAL_HEALTH_REGISTRY[10].question, helperText: FINANCIAL_HEALTH_REGISTRY[10].helperText, control: { kind: "select", options: FH_RANGE.totalDebtRange } as ControlType },
  { key: "monthlyDebtPaymentsRange", label: "Total monthly debt payments (approx.)", question: FINANCIAL_HEALTH_REGISTRY[11].question, helperText: FINANCIAL_HEALTH_REGISTRY[11].helperText, control: { kind: "select", options: FH_RANGE.monthlyDebtPaymentsRange } as ControlType },
  { key: "creditScoreRange", label: "Approximate credit score range (optional)", question: FINANCIAL_HEALTH_REGISTRY[12].question, helperText: FINANCIAL_HEALTH_REGISTRY[12].helperText, control: { kind: "select", options: FH_RANGE.creditScoreRange } as ControlType },
  { key: "availableTradingCapitalRange", label: "Money currently available for trading (separate from essentials)", question: FINANCIAL_HEALTH_REGISTRY[13].question, helperText: FINANCIAL_HEALTH_REGISTRY[13].helperText, control: { kind: "select", options: FH_RANGE.availableTradingCapitalRange, displayLabels: { "$0 (not available now)": "$0 — no trading capital available right now" } } as ControlType },
  { key: "affordableLossRange", label: "Money you could afford to lose", question: FINANCIAL_HEALTH_REGISTRY[14].question, helperText: FINANCIAL_HEALTH_REGISTRY[14].helperText, control: { kind: "select", options: FH_RANGE.affordableLossRange } as ControlType },
  { key: "pressureToMakeMoneyQuickly", label: "Financial urgency", question: FINANCIAL_HEALTH_REGISTRY[15].question, control: { kind: "select", options: FH_ENUM.pressureToMakeMoneyQuickly } as ControlType },
  { key: "desiredAdditionalMonthlyIncomeRange", label: "Goal: additional monthly income (not promised)", question: FINANCIAL_HEALTH_REGISTRY[16].question, helperText: FINANCIAL_HEALTH_REGISTRY[16].helperText, control: { kind: "select", options: FH_RANGE.desiredAdditionalMonthlyIncomeRange } as ControlType },
  { key: "financialReasonForTrading", label: "What trading would help you accomplish financially", question: FINANCIAL_HEALTH_REGISTRY[17].question, helperText: FINANCIAL_HEALTH_REGISTRY[17].helperText, control: { kind: "text" } as ControlType },
] as const;

export type FinancialHealthKey = (typeof FINANCIAL_HEALTH_FIELDS)[number]["key"];
export { FINANCIAL_HEALTH_KEY_ORDER };
