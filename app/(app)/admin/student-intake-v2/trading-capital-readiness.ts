import {
  TC_OPTIONS,
  TRADING_CAPITAL_READINESS_KEY_ORDER,
  TRADING_CAPITAL_READINESS_REGISTRY,
} from "@/lib/student-intake-v2/trading-capital-readiness-registry";

export type TCControlType = { kind: "select" | "multiselect"; options: readonly string[] };

export const TRADING_CAPITAL_READINESS_FIELDS = [
  { key: "liveTradingFundingStatus", tcId: "TC-01", label: "Live-trading funding status", question: TRADING_CAPITAL_READINESS_REGISTRY[0].question, control: { kind: "select", options: TC_OPTIONS.fundingStatus } as TCControlType },
  { key: "tradingCapitalSources", tcId: "TC-02", label: "Trading capital sources", question: TRADING_CAPITAL_READINESS_REGISTRY[1].question, helperText: TRADING_CAPITAL_READINESS_REGISTRY[1].helperText, control: { kind: "multiselect", options: TC_OPTIONS.capitalSources } as TCControlType },
  { key: "tradingCapitalSeparation", tcId: "TC-03", label: "Capital separation from essentials", question: TRADING_CAPITAL_READINESS_REGISTRY[2].question, control: { kind: "select", options: TC_OPTIONS.separation } as TCControlType },
  { key: "lossOfTradingCapitalImpact", tcId: "TC-04", label: "Impact if trading capital were lost", question: TRADING_CAPITAL_READINESS_REGISTRY[3].question, helperText: TRADING_CAPITAL_READINESS_REGISTRY[3].helperText, control: { kind: "multiselect", options: TC_OPTIONS.lossImpact } as TCControlType },
  { key: "tradingCapitalReplacementExpectation", tcId: "TC-05", label: "Replacement expectation after loss", question: TRADING_CAPITAL_READINESS_REGISTRY[4].question, helperText: TRADING_CAPITAL_READINESS_REGISTRY[4].helperText, control: { kind: "select", options: TC_OPTIONS.replacementExpectation } as TCControlType },
  { key: "tradingCapitalTimeHorizon", tcId: "TC-06", label: "Trading capital time horizon", question: TRADING_CAPITAL_READINESS_REGISTRY[5].question, control: { kind: "select", options: TC_OPTIONS.timeHorizon } as TCControlType },
  { key: "emergencyFundProtectionIntent", tcId: "TC-07", label: "Emergency fund protection intent", question: TRADING_CAPITAL_READINESS_REGISTRY[6].question, helperText: TRADING_CAPITAL_READINESS_REGISTRY[6].helperText, control: { kind: "select", options: TC_OPTIONS.emergencyProtection } as TCControlType },
  { key: "borrowedCreditFundingIntent", tcId: "TC-08", label: "Borrowed/credit funding intent", question: TRADING_CAPITAL_READINESS_REGISTRY[7].question, helperText: TRADING_CAPITAL_READINESS_REGISTRY[7].helperText, control: { kind: "select", options: TC_OPTIONS.borrowedCreditIntent } as TCControlType },
  { key: "tradingProfitsForEssentialExpensesExpectation", tcId: "TC-09", label: "Expected trading profits for essential expenses", question: TRADING_CAPITAL_READINESS_REGISTRY[8].question, helperText: TRADING_CAPITAL_READINESS_REGISTRY[8].helperText, control: { kind: "select", options: TC_OPTIONS.profitsForEssentialsExpectation } as TCControlType },
  { key: "liveTradingReadinessSelfAssessment", tcId: "TC-10", label: "Live-trading readiness self-assessment", question: TRADING_CAPITAL_READINESS_REGISTRY[9].question, helperText: TRADING_CAPITAL_READINESS_REGISTRY[9].helperText, control: { kind: "select", options: TC_OPTIONS.readinessSelfAssessment } as TCControlType },
] as const;

export type TradingCapitalReadinessKey = (typeof TRADING_CAPITAL_READINESS_FIELDS)[number]["key"];
export { TRADING_CAPITAL_READINESS_KEY_ORDER };
