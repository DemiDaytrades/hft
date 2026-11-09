import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ACKNOWLEDGMENT_KEYS,
  INTAKE_V2_STUDENT_KEYS,
  PREFER_NOT_TO_SAY,
  type AckAudit,
  type InstructorAssessmentV2,
  type StudentSectionsV2,
} from "./contracts";
import { DC_HARDSHIP_NOTE_MAX, DC_OPTIONS, DEBT_CREDIT_KEY_ORDER } from "./debt-credit-registry";
import { evaluateExplainableFlags } from "./flags";
import { validateFinalCompletion } from "./validation";

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
function complete(overrides: Partial<StudentSectionsV2>) {
  return validateFinalCompletion({ student_sections: minimalStudent(overrides), instructor_assessment: instructor(), ack_audit: audit(), intake_id: "i" });
}

describe("Phase 3C Debt & Credit (owner-approved, additive)", () => {
  it("adds 12 approved DC keys additively; existing 74 keys preserved at head (MO/TC/PF keys appended after DC)", () => {
    assert.deepEqual(DEBT_CREDIT_KEY_ORDER, ["debtRepaymentConfidence","minimumPaymentManageability","creditUtilizationAwareness","paymentHistoryConsistency","debtRelatedStress","debtReductionStrategy","creditBuildingGoals","recentFinancialHardship","emergencyBorrowingReliance","debtPayoffPriorities","creditEducationInterest","financialImprovementGoals612"]);
    for (const k of DEBT_CREDIT_KEY_ORDER) assert.ok(INTAKE_V2_STUDENT_KEYS.includes(k as any), `missing ${k}`);
    assert.equal(INTAKE_V2_STUDENT_KEYS.length, 119); // additive Phase 3F appended PF-01..PF-09
    assert.equal(INTAKE_V2_STUDENT_KEYS[0], "preferredName");
    assert.equal(INTAKE_V2_STUDENT_KEYS[73], "ackChecklist"); // 74th original key (0-indexed)
    assert.equal(INTAKE_V2_STUDENT_KEYS[85], "financialImprovementGoals612");
    assert.equal(INTAKE_V2_STUDENT_KEYS[86], "householdIncomeSources");
    assert.equal(INTAKE_V2_STUDENT_KEYS[100], "liveTradingFundingStatus");
    assert.equal(INTAKE_V2_STUDENT_KEYS[110], "situationalLossResponse");
    assert.equal(INTAKE_V2_STUDENT_KEYS[118], "journalReviewPractice");
  });

  it("DC-02 clarifies affordability/manageability; DC-04 clarifies payment consistency/history; no credit-eligibility wording in options", () => {
    assert.ok(DC_OPTIONS.manageability.some(o => /Manageable|difficult/i.test(o)));
    assert.ok(DC_OPTIONS.paymentHistory.some(o => /on time|behind/i.test(o)));
    for (const o of Object.values(DC_OPTIONS).flat()) assert.ok(!/approved|denied|eligible|eligibility decision/i.test(o));
  });

  it("completable when hasDebt is Yes with required conditional DC fields", () => {
    const r = complete({
      debtStatusTypes: fv({ hasDebt: "Yes", types: ["Credit cards"] }),
      totalDebtRange: fv("$1,000–$4,999"), monthlyDebtPaymentsRange: fv("$100–$249"),
      minimumPaymentManageability: fv("Manageable but tight"),
      debtReductionStrategy: fv("Making minimum payments only right now"),
      debtPayoffPriorities: fv("Highest interest first"),
    });
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("completable when hasDebt is No (DC-02/06/10 hidden/not required)", () => {
    const r = complete({ debtStatusTypes: fv({ hasDebt: "No" }) });
    assert.equal(r.ok, true, JSON.stringify(r.issues));
    assert.ok(!r.issues.some(i => /minimumPaymentManageability|debtReductionStrategy|debtPayoffPriorities/.test(i.path)));
  });

  it("completable when hasDebt is Prefer not to say (DC-02/06/10 hidden/not required)", () => {
    const r = complete({ debtStatusTypes: fv({ hasDebt: PREFER_NOT_TO_SAY }) });
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("valid Prefer not to say completes DC required selects", () => {
    const r = complete({
      debtStatusTypes: fv({ hasDebt: PREFER_NOT_TO_SAY }),
      debtRepaymentConfidence: fv(PREFER_NOT_TO_SAY),
      creditUtilizationAwareness: fv(PREFER_NOT_TO_SAY),
      paymentHistoryConsistency: fv(PREFER_NOT_TO_SAY),
      debtRelatedStress: fv(PREFER_NOT_TO_SAY),
      creditBuildingGoals: fv(PREFER_NOT_TO_SAY),
      recentFinancialHardship: fv({ status: PREFER_NOT_TO_SAY }),
      emergencyBorrowingReliance: fv(PREFER_NOT_TO_SAY),
      creditEducationInterest: fv(PREFER_NOT_TO_SAY),
      financialImprovementGoals612: fv([PREFER_NOT_TO_SAY]),
    });
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("DC-08 note is optional, max 280 chars, and not required", () => {
    assert.equal(DC_HARDSHIP_NOTE_MAX, 280);
    const ok = complete({ recentFinancialHardship: fv({ status: "No recent financial hardship" }) });
    assert.equal(ok.ok, true, JSON.stringify(ok.issues));
    const tooLong = complete({ recentFinancialHardship: fv({ status: "Yes, within the last 3 months", note: "x".repeat(281) }) });
    assert.ok(tooLong.issues.some(i => i.path === "student_sections.recentFinancialHardship.note"));
  });

  it("DC-12 Prefer not to say / Not sure yet are mutually exclusive with specific goals", () => {
    const bad = complete({ financialImprovementGoals612: fv([PREFER_NOT_TO_SAY, "Pay down debt"]) });
    assert.ok(bad.issues.some(i => i.path.includes("financialImprovementGoals612")));
    const bad2 = complete({ financialImprovementGoals612: fv(["Not sure yet", "Pay down debt"]) });
    assert.ok(bad2.issues.some(i => i.path.includes("financialImprovementGoals612")));
  });

  it("DC-12 has no Other free-text option", () => {
    assert.ok(!DC_OPTIONS.improvementGoals612.some(o => /^Other/i.test(o)));
  });

  it("existing risk-flag triggers/thresholds preserved (debt/credit/non-disclosure do not add new flags)", () => {
    const baseline = evaluateExplainableFlags(minimalStudent());
    const withDebtPnTS = evaluateExplainableFlags(minimalStudent({
      debtStatusTypes: fv({ hasDebt: PREFER_NOT_TO_SAY }),
      creditScoreRange: fv(PREFER_NOT_TO_SAY),
      debtRepaymentConfidence: fv(PREFER_NOT_TO_SAY),
      recentFinancialHardship: fv({ status: PREFER_NOT_TO_SAY }),
      financialImprovementGoals612: fv([PREFER_NOT_TO_SAY]),
    }));
    assert.deepEqual(withDebtPnTS.map(f=>f.rule_id), baseline.map(f=>f.rule_id));
  });

  it("Phase 3C does not activate proposed educational indicators (flags module unchanged)", () => {
    // Guard: only known risk rule IDs are produced for standard fixture.
    const flags = evaluateExplainableFlags(minimalStudent({ pressureToMakeMoneyQuickly: fv("High urgency"), affordableLossRange: fv("$0") }));
    for (const f of flags) assert.ok(["RISK_DEMO_FIRST_V1","RISK_HIGH_FINANCIAL_PRESSURE_V1","SCHEDULE_REALISM_CONCERN_V1"].includes(f.rule_id), `unexpected ${f.rule_id}`);
  });
});
