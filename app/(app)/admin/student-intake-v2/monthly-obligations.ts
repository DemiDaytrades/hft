import {
  MO_OPTIONS,
  MO_OTHER_NOTE_MAX,
  MONTHLY_OBLIGATIONS_KEY_ORDER,
  MONTHLY_OBLIGATIONS_REGISTRY,
} from "@/lib/student-intake-v2/monthly-obligations-registry";

export type MOControlType =
  | { kind: "select"; options: readonly string[] }
  | { kind: "multiselect"; options: readonly string[] }
  | { kind: "composite"; shape: "housingSituationPayment" | "transportationObligationRange" | "dependentSupportObligation" | "otherRecurringObligations" };

export const MONTHLY_OBLIGATIONS_FIELDS = [
  { key: "householdIncomeSources", moId: "MO-01", label: "Household income sources", question: MONTHLY_OBLIGATIONS_REGISTRY[0].question, helperText: MONTHLY_OBLIGATIONS_REGISTRY[0].helperText, control: { kind: "multiselect", options: MO_OPTIONS.incomeSources } as MOControlType },
  { key: "reliableMonthlyIncomePlanningRange", moId: "MO-02", label: "Reliable monthly planning income", question: MONTHLY_OBLIGATIONS_REGISTRY[1].question, helperText: MONTHLY_OBLIGATIONS_REGISTRY[1].helperText, control: { kind: "select", options: MO_OPTIONS.reliableMonthlyIncome } as MOControlType },
  { key: "housingSituationPayment", moId: "MO-03", label: "Housing situation and payment", question: MONTHLY_OBLIGATIONS_REGISTRY[2].question, helperText: MONTHLY_OBLIGATIONS_REGISTRY[2].helperText, control: { kind: "composite", shape: "housingSituationPayment" } as MOControlType },
  { key: "utilitiesHouseholdNecessitiesRange", moId: "MO-04", label: "Utilities / household necessities", question: MONTHLY_OBLIGATIONS_REGISTRY[3].question, control: { kind: "select", options: MO_OPTIONS.utilitiesRange } as MOControlType },
  { key: "transportationObligationRange", moId: "MO-05", label: "Transportation costs / obligations", question: MONTHLY_OBLIGATIONS_REGISTRY[4].question, helperText: MONTHLY_OBLIGATIONS_REGISTRY[4].helperText, control: { kind: "composite", shape: "transportationObligationRange" } as MOControlType },
  { key: "foodGroceriesRange", moId: "MO-06", label: "Food / groceries", question: MONTHLY_OBLIGATIONS_REGISTRY[5].question, control: { kind: "select", options: MO_OPTIONS.foodRange } as MOControlType },
  { key: "insuranceMedicalRecurringRange", moId: "MO-07", label: "Insurance / medical recurring costs", question: MONTHLY_OBLIGATIONS_REGISTRY[6].question, helperText: MONTHLY_OBLIGATIONS_REGISTRY[6].helperText, control: { kind: "select", options: MO_OPTIONS.insuranceMedicalRange } as MOControlType },
  { key: "dependentSupportObligation", moId: "MO-08", label: "Childcare / dependent support", question: MONTHLY_OBLIGATIONS_REGISTRY[7].question, helperText: MONTHLY_OBLIGATIONS_REGISTRY[7].helperText, control: { kind: "composite", shape: "dependentSupportObligation" } as MOControlType },
  { key: "subscriptionsDiscretionaryRecurringRange", moId: "MO-09", label: "Subscriptions / discretionary recurring", question: MONTHLY_OBLIGATIONS_REGISTRY[8].question, control: { kind: "select", options: MO_OPTIONS.subscriptionsRange } as MOControlType },
  { key: "otherRecurringObligations", moId: "MO-10", label: "Other recurring obligations", question: MONTHLY_OBLIGATIONS_REGISTRY[9].question, helperText: MONTHLY_OBLIGATIONS_REGISTRY[9].helperText, control: { kind: "composite", shape: "otherRecurringObligations" } as MOControlType, noteMaxLength: MO_OTHER_NOTE_MAX },
  { key: "monthlySavingsContributionRange", moId: "MO-11", label: "Monthly savings contribution", question: MONTHLY_OBLIGATIONS_REGISTRY[10].question, helperText: MONTHLY_OBLIGATIONS_REGISTRY[10].helperText, control: { kind: "select", options: MO_OPTIONS.savingsContributionRange } as MOControlType },
  { key: "remainingDiscretionaryCashFlowRange", moId: "MO-12", label: "Remaining discretionary cash flow", question: MONTHLY_OBLIGATIONS_REGISTRY[11].question, helperText: MONTHLY_OBLIGATIONS_REGISTRY[11].helperText, control: { kind: "select", options: MO_OPTIONS.remainingCashFlowRange } as MOControlType },
  { key: "cashFlowVariabilityConfidence", moId: "MO-13", label: "Cash-flow predictability", question: MONTHLY_OBLIGATIONS_REGISTRY[12].question, helperText: MONTHLY_OBLIGATIONS_REGISTRY[12].helperText, control: { kind: "select", options: MO_OPTIONS.variabilityConfidence } as MOControlType },
  { key: "billsMoneyUsedForTradingFrequency", moId: "MO-14", label: "Bills/essential money used for trading or investing", question: MONTHLY_OBLIGATIONS_REGISTRY[13].question, helperText: MONTHLY_OBLIGATIONS_REGISTRY[13].helperText, control: { kind: "select", options: MO_OPTIONS.billsMoneyForTrading } as MOControlType },
] as const;

export type MonthlyObligationsKey = (typeof MONTHLY_OBLIGATIONS_FIELDS)[number]["key"];
export { MONTHLY_OBLIGATIONS_KEY_ORDER, MO_OTHER_NOTE_MAX };
