import type { ExplainableFlag, StudentSectionsV2 } from "./contracts";
import {
  isAffordableLossZero,
  isAvailableCapitalZero,
  isEmergencyFundZero,
  isPressureModerateOrStrong,
  isPressureStrong,
  isUnexpectedExpenseFragile,
} from "./financial-health-registry";

function val<T>(field: { value: T } | undefined | null): T | undefined {
  return field?.value;
}

export function evaluateExplainableFlags(student: StudentSectionsV2): ExplainableFlag[] {
  const flags: ExplainableFlag[] = [];
  const affordable = val(student.affordableLossRange);
  const pressure = val(student.pressureToMakeMoneyQuickly);
  const emergency = val(student.savingsEmergencyRanges)?.emergencyFund;
  const unexpected = val(student.unexpectedExpenseAbility);
  const willingRisk = val(student.willingRiskLimits);
  const availableCapital = val(student.availableTradingCapitalRange);

  // Demo-first recommendation (explainable, suggestion only)
  const demoReasons: ExplainableFlag["triggering_values"] = [];
  if (isAffordableLossZero(affordable)) demoReasons.push({ field: "affordableLossRange", value: affordable, label: "Affordable loss = $0" });
  if (isPressureModerateOrStrong(pressure)) demoReasons.push({ field: "pressureToMakeMoneyQuickly", value: pressure, label: `Financial urgency = ${pressure}` });
  if (isEmergencyFundZero(emergency)) demoReasons.push({ field: "savingsEmergencyRanges.emergencyFund", value: emergency, label: "Emergency fund = $0" });
  if (isUnexpectedExpenseFragile(unexpected)) demoReasons.push({ field: "unexpectedExpenseAbility", value: unexpected, label: `Unexpected $500 expense = ${unexpected}` });
  if (willingRisk === "No" || willingRisk === "Maybe/depends") demoReasons.push({ field: "willingRiskLimits", value: willingRisk, label: `Willing to follow risk limits = ${willingRisk}` });
  if (isAvailableCapitalZero(availableCapital)) demoReasons.push({ field: "availableTradingCapitalRange", value: availableCapital, label: "No trading capital currently available" });
  if (demoReasons.length >= 2) {
    flags.push({
      rule_id: "RISK_DEMO_FIRST_V1",
      flag_name: "Demo-first recommendation",
      source_fields: demoReasons.map((r) => r.field),
      triggering_values: demoReasons,
      explanation: "Multiple readiness/risk indicators suggest demo-first practice and explicit risk limits may be appropriate before live trading.",
      suggested_instructor_action: "Review demo-first path, confirm risk limits, and document rationale in financial/risk concerns and risk restrictions as appropriate. This is an instructor suggestion, not financial advice or an automatic restriction.",
      severity: "high",
    });
  }

  if (isPressureStrong(pressure)) {
    flags.push({
      rule_id: "RISK_HIGH_FINANCIAL_PRESSURE_V1",
      flag_name: "High financial urgency indicator",
      source_fields: ["pressureToMakeMoneyQuickly"],
      triggering_values: [{ field: "pressureToMakeMoneyQuickly", value: pressure, label: `High financial urgency = ${pressure}` }],
      explanation: "Student reported high financial urgency, which can increase risk-taking behavior.",
      suggested_instructor_action: "Discuss expectations, education timeline, and risk; consider demo-first and stricter risk guardrails. Suggestion only.",
      severity: "high",
    });
  }

  const hours = val(student.weeklyHoursRange);
  const consistency = val(student.windowsAndConsistency)?.consistencyExpectation;
  if (hours === "<2 hours" || consistency === "Hard to predict right now") {
    flags.push({
      rule_id: "SCHEDULE_REALISM_CONCERN_V1",
      flag_name: "Schedule realism concern",
      source_fields: ["weeklyHoursRange", "windowsAndConsistency.consistencyExpectation"].filter((f) => (f.startsWith("weekly") ? hours === "<2 hours" : consistency === "Hard to predict right now")),
      triggering_values: [
        ...(hours === "<2 hours" ? [{ field: "weeklyHoursRange", value: hours }] : []),
        ...(consistency === "Hard to predict right now" ? [{ field: "windowsAndConsistency.consistencyExpectation", value: consistency }] : []),
      ],
      explanation: "Limited weekly time or uncertain consistency may affect progress expectations.",
      suggested_instructor_action: "Set realistic roadmap and check-in cadence; identify minimum viable weekly practice plan.",
      severity: "review",
    });
  }

  return flags;
}

export function hasHighRiskFlags(flags: ExplainableFlag[]): boolean {
  return flags.some((f) => f.severity === "high");
}

const ADVISORY_HIGH_SEVERITY_RULE_IDS = new Set<string>(["RISK_DEMO_FIRST_V1"]);

export function isBlockingHighRiskFlag(flag: ExplainableFlag): boolean {
  return flag.severity === "high" && !ADVISORY_HIGH_SEVERITY_RULE_IDS.has(flag.rule_id);
}

export function hasBlockingHighRiskFlags(flags: ExplainableFlag[]): boolean {
  return flags.some(isBlockingHighRiskFlag);
}
