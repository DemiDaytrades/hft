import {
  PF_OPTIONS,
  TRADING_BEHAVIOR_KEY_ORDER,
  TRADING_BEHAVIOR_REGISTRY,
} from "@/lib/student-intake-v2/trading-behavior-registry";

export type PfControlType = { kind: "select"; options: readonly string[] };

export const TRADING_BEHAVIOR_FIELDS = [
  { key: "situationalLossResponse", pfId: "PF-01", label: "Situational loss response", question: TRADING_BEHAVIOR_REGISTRY[0].question, control: { kind: "select", options: PF_OPTIONS.lossResponse } as PfControlType },
  { key: "situationalWinStreakResponse", pfId: "PF-02", label: "Situational win-streak response", question: TRADING_BEHAVIOR_REGISTRY[1].question, control: { kind: "select", options: PF_OPTIONS.winStreakResponse } as PfControlType },
  { key: "missedTradeFomoResponse", pfId: "PF-03", label: "Missed-trade / FOMO response", question: TRADING_BEHAVIOR_REGISTRY[2].question, control: { kind: "select", options: PF_OPTIONS.missedTradeFomo } as PfControlType },
  { key: "unplannedTradeFrequency", pfId: "PF-04", label: "Unplanned-trade frequency", question: TRADING_BEHAVIOR_REGISTRY[3].question, control: { kind: "select", options: PF_OPTIONS.unplannedTradeFrequency } as PfControlType },
  { key: "plannedLossLimitStopAdherence", pfId: "PF-05", label: "Planned loss-limit stop adherence", question: TRADING_BEHAVIOR_REGISTRY[4].question, helperText: "Collects adherence behavior only. This does not set or recommend a loss limit.", control: { kind: "select", options: PF_OPTIONS.lossLimitStopAdherence } as PfControlType },
  { key: "willingToPauseLiveTradingAndReturnToDemo", pfId: "PF-06", label: "Pause live trading / return to demo or education", question: TRADING_BEHAVIOR_REGISTRY[5].question, helperText: "Distinct from PF-05 session loss-limit adherence.", control: { kind: "select", options: PF_OPTIONS.pauseLiveReturnToDemo } as PfControlType },
  { key: "protectiveExitBehavior", pfId: "PF-07", label: "Protective-exit behavior", question: TRADING_BEHAVIOR_REGISTRY[6].question, helperText: "No strategy or stop-placement advice is implied.", control: { kind: "select", options: PF_OPTIONS.protectiveExitBehavior } as PfControlType },
  { key: "noTradeDayAcceptance", pfId: "PF-08", label: "No-trade-day acceptance", question: TRADING_BEHAVIOR_REGISTRY[7].question, control: { kind: "select", options: PF_OPTIONS.noTradeDayAcceptance } as PfControlType },
  { key: "journalReviewPractice", pfId: "PF-09", label: "Journaling / review practice", question: TRADING_BEHAVIOR_REGISTRY[8].question, control: { kind: "select", options: PF_OPTIONS.journalReviewPractice } as PfControlType },
] as const;

export type TradingBehaviorKey = (typeof TRADING_BEHAVIOR_FIELDS)[number]["key"];
export { TRADING_BEHAVIOR_KEY_ORDER };
