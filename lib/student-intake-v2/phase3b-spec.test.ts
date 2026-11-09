import { describe, it } from "node:test";
import assert from "node:assert";
import { FINANCIAL_HEALTH_REGISTRY, FINANCIAL_HEALTH_KEY_ORDER, FH_RANGE, FH_ENUM, isPressureStrong, isAvailableCapitalZero, isUnexpectedExpenseFragile } from "./financial-health-registry";
import { validateFinalCompletion } from "./validation";
import { evaluateExplainableFlags } from "./flags";
import { ACKNOWLEDGMENT_KEYS, PREFER_NOT_TO_SAY, type AckAudit, type InstructorAssessmentV2, type StudentSectionsV2 } from "./contracts";

function fv<T>(value: T) { return { value }; }
function minimalStudent(overrides: Partial<StudentSectionsV2> = {}): StudentSectionsV2 {
  return {
    preferredName: fv("A"), location: fv("X"), timeZone: fv("UTC"), occupation: fv("W"), employmentType: fv("Full-time employee"), workScheduleSummary: fv("9-5"), majorResponsibilities: fv(["None"]),
    currentLifeGoal: fv("G"), motivationAndWhyNow: fv("M"),
    monthlyTakeHomeRange: fv("$3,000–$4,999"), additionalIncome: fv({ hasAdditional: "No" }), incomeConsistencyPay: fv({ consistency: "Very consistent", payFrequency: "Monthly" }), disposableIncomeRange: fv("$500–$999"), recurringObligationsRange: fv("$1,000–$1,999"), variableExpensesRange: fv("$250–$499"), upcomingMajorExpenses: fv({ hasUpcoming: "No" }), savingsEmergencyRanges: fv({ savings: "$500–$999", emergencyFund: "$500–$999" }), unexpectedExpenseAbility: fv("I could cover it, but it would be difficult"), debtStatusTypes: fv({ hasDebt: "No" }),
    availableTradingCapitalRange: fv("$500–$999"), affordableLossRange: fv("$100–$249"), pressureToMakeMoneyQuickly: fv("A little urgency"), desiredAdditionalMonthlyIncomeRange: fv("$500–$999"), financialReasonForTrading: fv("Build a skill"),
    marketsExperience: fv(["None yet"]), demoLiveExperience: fv({ demo: "No", live: "No" }), knowledgeMatrix: fv(Object.fromEntries(["buy_sell_direction","stop_loss","take_profit","lot_size","pips","leverage","spread_fees","candlesticks","support_resistance","trend","market_structure_basics","risk_management","position_sizing"].map(k=>[k,"Heard of it"]))),
    platformsBrokerExperience: fv({ platforms: ["None yet"], brokerExperience: "No" }), priorEducation: fv({ type: "No" }), majorNegativeExperience: fv({ type: "No" }), biggestTradingConfusion: fv("Risk"),
    behaviorMatrix: fv({ fomo:"Sometimes", revenge_trading:"Unlikely", impulsiveness:"Rarely", patience:"Moderate", rule_consistency:"Usually" }), behaviorTendencies: fv(["Not applicable yet"]), reactionToLoss: fv("Pause"), reactionToWin: fv("Calm"), willingDemoFirst: fv("Yes"), willingRiskLimits: fv("Yes"),
    goalImmediate: fv("Start"), goals30_60_90: fv({ goal30:"a", goal60:"b", goal90:"c" }), goals6_12: fv({ goal6:"d" }), goalBig: fv("e"), goalWhy: fv("f"), successDefinition: fv("g"), desiredTradingIncomeRange: fv("$500–$999"), membershipValue: fv("h"),
    learningStyles: fv(["Videos"]), paceAndQuestionComfort: fv({ pace: "Moderate/steady", questionComfort: "Comfortable" }), homeworkPreference: fv(["Chart markup exercises"]), accountabilityFeedback: fv({ accountability: "Weekly check-ins", feedbackFrequency: "Weekly" }),
    weeklyAvailability: fv({ monday: { windows: ["Evening"] } }), unavailableDays: fv(["None"]), weeklyHoursRange: fv("2–4 hours"), windowsAndConsistency: fv({ preferredWindows: ["Weekday evenings"], consistencyExpectation: "Mostly consistent" }),
    devicesInternet: fv({ devices: ["Computer/laptop"], internetReliability: "Mostly reliable" }), platformAccess: fv({ tradingView: "Yes", mt5: "No", demoAccount: "No", liveAccount: "No" }), supportTechReadiness: fv({ canScreenShare: "Yes", softwareComfort: "Comfortable" }),
    // Phase 3C defaults (additive). hasDebt defaults No so DC-02/06/10 not required.
    debtRepaymentConfidence: fv(PREFER_NOT_TO_SAY),
    creditUtilizationAwareness: fv("Not sure yet"),
    paymentHistoryConsistency: fv("Not sure yet"),
    debtRelatedStress: fv(PREFER_NOT_TO_SAY),
    creditBuildingGoals: fv("Not sure yet"),
    recentFinancialHardship: fv({ status: "No recent financial hardship" }),
    emergencyBorrowingReliance: fv(PREFER_NOT_TO_SAY),
    creditEducationInterest: fv(PREFER_NOT_TO_SAY),
    financialImprovementGoals612: fv(["Learn more about debt and credit"]),
    ackChecklist: fv(Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k=>[k,true])) as any),
    ...overrides,
  } as StudentSectionsV2;
}
function instructor(): InstructorAssessmentV2 {
  return { instructorSummary:fv("s"), assessedExperienceLevel:fv("Beginner"), assessedKnowledgeLevel:fv("Gaps"), instructorStrengths:fv("x"), instructorWeaknesses:fv("y"), recommendedStartingLevel:fv("F"), recommendedAcademyTrack:fv("T"), recommendedFirstLesson:fv("L"), firstHomework:fv("H"), recommendedPracticeFrequency:fv("4–5x/week"), recommendedCoachingFrequency:fv("Weekly"), immediateActionItems:fv("A") } as any;
}
function audit(): AckAudit {
  return { records: ACKNOWLEDGMENT_KEYS.map((ack_key) => ({ ack_key, ack_text_version_id:"ack_v1", confirmed:true as const, confirmed_at:"2026-01-01T00:00:00.000Z", confirmed_by_user_id:"u", confirmed_by_role:"admin", intake_id:"i", form_version:"f", schema_version:"s", capture_mode:"student_reported" as const })) };
}

describe("Financial Health spec lock (1A-10A)", () => {
  it("authoritative registry contains exact 18 keys in order", () => {
    assert.deepEqual(FINANCIAL_HEALTH_KEY_ORDER, ["monthlyTakeHomeRange","additionalIncome","incomeConsistencyPay","disposableIncomeRange","recurringObligationsRange","variableExpensesRange","upcomingMajorExpenses","savingsEmergencyRanges","unexpectedExpenseAbility","debtStatusTypes","totalDebtRange","monthlyDebtPaymentsRange","creditScoreRange","availableTradingCapitalRange","affordableLossRange","pressureToMakeMoneyQuickly","desiredAdditionalMonthlyIncomeRange","financialReasonForTrading"]);
    assert.equal(FINANCIAL_HEALTH_REGISTRY.length, 18);
  });

  it("2A savings/emergency separate bands include $500+ and PNTS", () => {
    assert.ok(FH_RANGE.savingsEmergency.includes("$5,000+"));
    assert.ok(FH_RANGE.savingsEmergency.includes(PREFER_NOT_TO_SAY));
  });

  it("3A variableExpensesRange required at completion (PNTS allowed)", () => {
    const missing = minimalStudent(); delete (missing as any).variableExpensesRange;
    const r = validateFinalCompletion({ student_sections: missing, instructor_assessment: instructor(), ack_audit: audit(), intake_id: "i" });
    assert.ok(r.issues.some(i => i.path.includes("variableExpensesRange")));
    const pnts = minimalStudent({ variableExpensesRange: fv(PREFER_NOT_TO_SAY) });
    const ok = validateFinalCompletion({ student_sections: pnts, instructor_assessment: instructor(), ack_audit: audit(), intake_id: "i" });
    assert.ok(!ok.issues.some(i => i.path.includes("variableExpensesRange")), JSON.stringify(ok.issues));
  });

  it("4A debt burden not forced when hasDebt is No or Prefer not to say", () => {
    const no = minimalStudent({ debtStatusTypes: fv({ hasDebt: "No" }) });
    const r1 = validateFinalCompletion({ student_sections: no, instructor_assessment: instructor(), ack_audit: audit(), intake_id: "i" });
    assert.ok(!r1.issues.some(i => i.path.includes("totalDebtRange") || i.path.includes("monthlyDebtPaymentsRange") || i.path.includes("debtStatusTypes.types")));
    const pnts = minimalStudent({ debtStatusTypes: fv({ hasDebt: PREFER_NOT_TO_SAY }) });
    const r2 = validateFinalCompletion({ student_sections: pnts, instructor_assessment: instructor(), ack_audit: audit(), intake_id: "i" });
    assert.ok(!r2.issues.some(i => i.path.includes("totalDebtRange") || i.path.includes("monthlyDebtPaymentsRange")));
  });

  it("4A debt types are high-level and PNTS is present; validation requires types when Yes", () => {
    assert.ok(FH_ENUM.debtTypes.includes("Tax debt"));
    assert.ok(FH_ENUM.debtTypes.includes("Buy Now Pay Later / installment debt"));
    const yesNoTypes = minimalStudent({ debtStatusTypes: fv({ hasDebt: "Yes", types: [] }), totalDebtRange: fv("$1,000–$4,999"), monthlyDebtPaymentsRange: fv("$100–$249") });
    const r = validateFinalCompletion({ student_sections: yesNoTypes, instructor_assessment: instructor(), ack_audit: audit(), intake_id: "i" });
    assert.ok(r.issues.some(i => i.path.includes("debtStatusTypes.types")));
  });

  it("5A credit score remains optional", () => {
    assert.ok(FH_RANGE.creditScoreRange.includes("580–669"));
    assert.ok(FH_RANGE.creditScoreRange.includes("I don't know"));
    const s = minimalStudent(); delete (s as any).creditScoreRange;
    const r = validateFinalCompletion({ student_sections: s, instructor_assessment: instructor(), ack_audit: audit(), intake_id: "i" });
    assert.ok(!r.issues.some(i => i.path.includes("creditScoreRange")));
  });

  it("6A available trading capital keeps $0 concept and flag mapping", () => {
    assert.ok(FH_RANGE.availableTradingCapitalRange.includes("$0 (not available now)"));
    assert.ok(isAvailableCapitalZero("$0 (not available now)"));
    assert.ok(isAvailableCapitalZero("$0 — no trading capital available right now"));
  });

  it("7A urgency/resilience labels map to preserved flag semantics", () => {
    assert.ok(isPressureStrong("High urgency"));
    assert.ok(isUnexpectedExpenseFragile("I would likely not be able to cover it right now"));
    const flags = evaluateExplainableFlags(minimalStudent({ pressureToMakeMoneyQuickly: fv("High urgency"), unexpectedExpenseAbility: fv("I would likely not be able to cover it right now"), affordableLossRange: fv("$0") }));
    assert.ok(flags.some(f => f.rule_id === "RISK_HIGH_FINANCIAL_PRESSURE_V1"));
    assert.ok(flags.some(f => f.rule_id === "RISK_DEMO_FIRST_V1"));
  });

  it("8A desired additional monthly income is goal-framed (no $0, includes Not sure yet)", () => {
    assert.ok(!(FH_RANGE.desiredAdditionalMonthlyIncomeRange as readonly string[]).includes("$0"));
    assert.ok(FH_RANGE.desiredAdditionalMonthlyIncomeRange.includes("Not sure yet"));
  });

  it("9A financialReasonForTrading accepts meaningful text OR Prefer not to say", () => {
    const textOk = minimalStudent({ financialReasonForTrading: fv("Build savings") });
    const r1 = validateFinalCompletion({ student_sections: textOk, instructor_assessment: instructor(), ack_audit: audit(), intake_id: "i" });
    assert.ok(!r1.issues.some(i => i.path.includes("financialReasonForTrading")));
    const pntsOk = minimalStudent({ financialReasonForTrading: fv(PREFER_NOT_TO_SAY) });
    const r2 = validateFinalCompletion({ student_sections: pntsOk, instructor_assessment: instructor(), ack_audit: audit(), intake_id: "i" });
    assert.ok(!r2.issues.some(i => i.path.includes("financialReasonForTrading")), JSON.stringify(r2.issues));
  });

  it("10A income consistency/pay frequency enums updated", () => {
    assert.ok(FH_ENUM.incomeConsistency.includes("Very inconsistent / unpredictable"));
    assert.ok(FH_ENUM.payFrequency.includes("Twice a month"));
    assert.ok(FH_ENUM.payFrequency.includes("Irregular / varies"));
  });
});
