/**
 * Phase 3F Trading Behavior, Psychology & Discipline — authoritative registry (additive).
 * PF-01..PF-09. Owner-approved, locked. NO mental-health diagnosis/labels; non-shaming.
 * PNTS = "Prefer not to answer" (stored as-is). Beginner/no-experience answers are legitimate
 * and MUST NOT themselves create a high-risk designation. No active flags/review indicators.
 * TC-11 (canPauseLiveTradingIfNeeded) NOT implemented — represented by PF-05/PF-06.
 * Existing Q39–Q46 keys/options/semantics remain unchanged.
 */

export const PF_PNTS_ANSWER = "Prefer not to answer" as const;
export type PfPntsAnswer = typeof PF_PNTS_ANSWER;

export const TRADING_BEHAVIOR_KEY_ORDER = [
  "situationalLossResponse",
  "situationalWinStreakResponse",
  "missedTradeFomoResponse",
  "unplannedTradeFrequency",
  "plannedLossLimitStopAdherence",
  "willingToPauseLiveTradingAndReturnToDemo",
  "protectiveExitBehavior",
  "noTradeDayAcceptance",
  "journalReviewPractice",
] as const;

export type TradingBehaviorKey = (typeof TRADING_BEHAVIOR_KEY_ORDER)[number];

export const PF_OPTIONS = {
  lossResponse: [
    "Follow my plan and review before the next decision",
    "Stop trading for the session/day",
    "Feel an urge to recover the loss quickly, but I try to follow my plan",
    "Take another trade quickly without my usual setup",
    "Increase size or take extra risk to try to recover faster",
    "I do not have a defined trading plan yet",
    "I have not traded enough to know",
    PF_PNTS_ANSWER,
  ],
  winStreakResponse: [
    "Continue following my normal plan/rules",
    "Become more selective and wait for valid setups",
    "Feel more confident but I try to keep my normal rules",
    "Trade more frequently than usual",
    "Loosen my entry criteria",
    "Increase size outside my normal plan",
    "I do not have a defined trading plan yet",
    "I have not traded enough to know",
    PF_PNTS_ANSWER,
  ],
  missedTradeFomo: [
    "Comfortable missing it and wait for the next valid setup",
    "Review why I missed it, but do not enter late",
    "Feel urgency/FOMO but try to wait for a valid setup",
    "Enter late or chase price",
    "Lower my setup standards to get in",
    "Take an unrelated trade because I missed the move",
    "I do not have defined setups yet",
    "I have not traded enough to know",
    PF_PNTS_ANSWER,
  ],
  unplannedTradeFrequency: [
    "Never",
    "Rarely",
    "Sometimes",
    "Often",
    "I do not have defined trading rules yet",
    "I have not traded enough to know",
    PF_PNTS_ANSWER,
  ],
  lossLimitStopAdherence: [
    "Very likely",
    "Likely",
    "Unsure",
    "Unlikely",
    "Very unlikely",
    "I do not currently use a planned loss limit",
    "I have not traded live yet",
    PF_PNTS_ANSWER,
  ],
  pauseLiveReturnToDemo: [
    "Yes, willing and able",
    "Willing, but it may be difficult",
    "Unsure",
    "No",
    "I am not trading live",
    PF_PNTS_ANSWER,
  ],
  protectiveExitBehavior: [
    "I follow the protective exit as planned",
    "I occasionally move it farther away from my plan",
    "I sometimes remove it",
    "I sometimes add to a losing position instead of taking the planned exit",
    "My behavior varies depending on the setup, but I aim to follow a predefined plan",
    "I do not currently use planned protective exits",
    "I have not traded enough to know",
    PF_PNTS_ANSWER,
  ],
  noTradeDayAcceptance: [
    "Completely comfortable",
    "Usually comfortable",
    "Sometimes difficult",
    "Very difficult",
    "I do not have defined setups yet",
    "I have not traded enough to know",
    PF_PNTS_ANSWER,
  ],
  journalReviewPractice: [
    "I journal/review consistently",
    "I journal/review sometimes",
    "I do not currently journal/review, but I am willing to start",
    "I do not currently journal/review and I am unsure about starting",
    "I do not currently journal/review and I prefer not to use it",
    "I do not know how to journal/review trades yet",
    "I have not traded enough to establish a journal/review practice yet",
    PF_PNTS_ANSWER,
  ],
} as const;

export type PfFieldRegistryEntry = {
  id: string;
  key: TradingBehaviorKey;
  question: string;
  controlType: "single_select";
  options: readonly string[];
  requiredAtCompletion: boolean; // Phase 3F-era only
  pntsAllowed: true;
  dataShape: "FieldValue<string>";
};

export const TRADING_BEHAVIOR_REGISTRY: readonly PfFieldRegistryEntry[] = [
  { id: "PF-01", key: "situationalLossResponse", question: "After a losing trade, which response best describes what you are most likely to do?", controlType: "single_select", options: PF_OPTIONS.lossResponse, requiredAtCompletion: true, pntsAllowed: true, dataShape: "FieldValue<string>" },
  { id: "PF-02", key: "situationalWinStreakResponse", question: "After a strong win or a winning streak, which response best describes what you are most likely to do?", controlType: "single_select", options: PF_OPTIONS.winStreakResponse, requiredAtCompletion: true, pntsAllowed: true, dataShape: "FieldValue<string>" },
  { id: "PF-03", key: "missedTradeFomoResponse", question: "When you miss a trade or a strong move, what are you most likely to do?", controlType: "single_select", options: PF_OPTIONS.missedTradeFomo, requiredAtCompletion: true, pntsAllowed: true, dataShape: "FieldValue<string>" },
  { id: "PF-04", key: "unplannedTradeFrequency", question: "How often do you knowingly take a trade that does not meet your trading rules or planned setup criteria?", controlType: "single_select", options: PF_OPTIONS.unplannedTradeFrequency, requiredAtCompletion: true, pntsAllowed: true, dataShape: "FieldValue<string>" },
  { id: "PF-05", key: "plannedLossLimitStopAdherence", question: "If you reach a planned daily or session loss limit, how likely are you to stop live trading for that session?", controlType: "single_select", options: PF_OPTIONS.lossLimitStopAdherence, requiredAtCompletion: true, pntsAllowed: true, dataShape: "FieldValue<string>" },
  { id: "PF-06", key: "willingToPauseLiveTradingAndReturnToDemo", question: "If losses continue or your financial circumstances worsen, are you willing and able to pause live trading and return to demo or education?", controlType: "single_select", options: PF_OPTIONS.pauseLiveReturnToDemo, requiredAtCompletion: true, pntsAllowed: true, dataShape: "FieldValue<string>" },
  { id: "PF-07", key: "protectiveExitBehavior", question: "When you use a planned protective exit (such as a predefined stop), what best describes your typical behavior?", controlType: "single_select", options: PF_OPTIONS.protectiveExitBehavior, requiredAtCompletion: true, pntsAllowed: true, dataShape: "FieldValue<string>" },
  { id: "PF-08", key: "noTradeDayAcceptance", question: "How comfortable are you taking zero trades on a day when no valid setup appears?", controlType: "single_select", options: PF_OPTIONS.noTradeDayAcceptance, requiredAtCompletion: true, pntsAllowed: true, dataShape: "FieldValue<string>" },
  { id: "PF-09", key: "journalReviewPractice", question: "Which best describes your current trade journaling or trade-review practice?", controlType: "single_select", options: PF_OPTIONS.journalReviewPractice, requiredAtCompletion: true, pntsAllowed: true, dataShape: "FieldValue<string>" },
] as const;

export function isPfPnTSEquivalent(v: unknown): boolean {
  return v === PF_PNTS_ANSWER;
}

export function isValidPfValue(key: TradingBehaviorKey, v: unknown): boolean {
  if (typeof v !== "string" || v.length === 0) return false;
  const entry = TRADING_BEHAVIOR_REGISTRY.find((r) => r.key === key);
  return Boolean(entry && entry.options.includes(v as any));
}
