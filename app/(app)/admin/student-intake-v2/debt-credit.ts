import {
  DC_OPTIONS,
  DEBT_CREDIT_KEY_ORDER,
  DEBT_CREDIT_REGISTRY,
} from "@/lib/student-intake-v2/debt-credit-registry";

export type DCControlType =
  | { kind: "select"; options: readonly string[] }
  | { kind: "multiselect"; options: readonly string[] }
  | { kind: "composite"; shape: "recentFinancialHardship" };

export const DEBT_CREDIT_FIELDS = [
  { key: "debtRepaymentConfidence", dcId: "DC-01", label: "Repayment confidence", question: DEBT_CREDIT_REGISTRY[0].question, helperText: DEBT_CREDIT_REGISTRY[0].helperText, control: { kind: "select", options: DC_OPTIONS.confidence } as DCControlType },
  { key: "minimumPaymentManageability", dcId: "DC-02", label: "Minimum payment manageability (affordability)", question: DEBT_CREDIT_REGISTRY[1].question, helperText: DEBT_CREDIT_REGISTRY[1].helperText, control: { kind: "select", options: DC_OPTIONS.manageability } as DCControlType, conditionalHasDebtYes: true },
  { key: "creditUtilizationAwareness", dcId: "DC-03", label: "Credit utilization awareness", question: DEBT_CREDIT_REGISTRY[2].question, helperText: DEBT_CREDIT_REGISTRY[2].helperText, control: { kind: "select", options: DC_OPTIONS.utilizationAwareness } as DCControlType },
  { key: "paymentHistoryConsistency", dcId: "DC-04", label: "Payment history consistency", question: DEBT_CREDIT_REGISTRY[3].question, helperText: DEBT_CREDIT_REGISTRY[3].helperText, control: { kind: "select", options: DC_OPTIONS.paymentHistory } as DCControlType },
  { key: "debtRelatedStress", dcId: "DC-05", label: "Debt-related stress", question: DEBT_CREDIT_REGISTRY[4].question, control: { kind: "select", options: DC_OPTIONS.stress } as DCControlType },
  { key: "debtReductionStrategy", dcId: "DC-06", label: "Debt reduction strategy", question: DEBT_CREDIT_REGISTRY[5].question, helperText: DEBT_CREDIT_REGISTRY[5].helperText, control: { kind: "select", options: DC_OPTIONS.reductionStrategy } as DCControlType, conditionalHasDebtYes: true },
  { key: "creditBuildingGoals", dcId: "DC-07", label: "Credit-building goals", question: DEBT_CREDIT_REGISTRY[6].question, control: { kind: "select", options: DC_OPTIONS.creditGoals } as DCControlType },
  { key: "recentFinancialHardship", dcId: "DC-08", label: "Recent financial hardship (optional note)", question: DEBT_CREDIT_REGISTRY[7].question, helperText: DEBT_CREDIT_REGISTRY[7].helperText, control: { kind: "composite", shape: "recentFinancialHardship" } as DCControlType, sub: { status: { kind: "select", options: DC_OPTIONS.hardshipStatus } } },
  { key: "emergencyBorrowingReliance", dcId: "DC-09", label: "Emergency borrowing reliance", question: DEBT_CREDIT_REGISTRY[8].question, control: { kind: "select", options: DC_OPTIONS.borrowingReliance } as DCControlType },
  { key: "debtPayoffPriorities", dcId: "DC-10", label: "Debt payoff priorities", question: DEBT_CREDIT_REGISTRY[9].question, control: { kind: "select", options: DC_OPTIONS.payoffPriorities } as DCControlType, conditionalHasDebtYes: true },
  { key: "creditEducationInterest", dcId: "DC-11", label: "Credit education interest", question: DEBT_CREDIT_REGISTRY[10].question, control: { kind: "select", options: DC_OPTIONS.educationInterest } as DCControlType },
  { key: "financialImprovementGoals612", dcId: "DC-12", label: "6–12 month financial improvement goals", question: DEBT_CREDIT_REGISTRY[11].question, helperText: DEBT_CREDIT_REGISTRY[11].helperText, control: { kind: "multiselect", options: DC_OPTIONS.improvementGoals612 } as DCControlType },
] as const;

export type DebtCreditKey = (typeof DEBT_CREDIT_FIELDS)[number]["key"];
export { DEBT_CREDIT_KEY_ORDER };
