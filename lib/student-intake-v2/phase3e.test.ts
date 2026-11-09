import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ACKNOWLEDGMENT_KEYS,
  INTAKE_V2_FORM_VERSION,
  INTAKE_V2_SCHEMA_VERSION,
  INTAKE_V2_STUDENT_KEYS,
  PREFER_NOT_TO_SAY,
  type AckAudit,
  type InstructorAssessmentV2,
  type StudentSectionsV2,
} from "./contracts";
import { evaluateExplainableFlags } from "./flags";
import { TC_OPTIONS, TC_PNTS_ANSWER, TRADING_CAPITAL_READINESS_KEY_ORDER } from "./trading-capital-readiness-registry";
import { PHASE3D_FORM_VERSION, PHASE3E_FORM_VERSION, requiresTradingCapitalReadinessAtCompletion, validateFinalCompletion } from "./validation";

function fv<T>(value: T) { return { value }; }
const LEGACY_PRE3D_FORM = "hft_intake_v2_form.2026-11-05";

function baseStudent(overrides: Partial<StudentSectionsV2> = {}): StudentSectionsV2 {
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
    debtRepaymentConfidence: fv(PREFER_NOT_TO_SAY), creditUtilizationAwareness: fv("Not sure yet"), paymentHistoryConsistency: fv("Not sure yet"), debtRelatedStress: fv(PREFER_NOT_TO_SAY), creditBuildingGoals: fv("Not sure yet"), recentFinancialHardship: fv({ status: "No recent financial hardship" }), emergencyBorrowingReliance: fv(PREFER_NOT_TO_SAY), creditEducationInterest: fv(PREFER_NOT_TO_SAY), financialImprovementGoals612: fv(["Learn more about debt and credit"]),
    householdIncomeSources: fv(["Primary employment"]), reliableMonthlyIncomePlanningRange: fv("$3,000–$4,999"), housingSituationPayment: fv({ status: "Rent", monthlyRange: "$1,000–$1,499" }), utilitiesHouseholdNecessitiesRange: fv("$250–$499"), transportationObligationRange: fv({ hasTransportationCost: "Yes", monthlyRange: "$250–$499" }), foodGroceriesRange: fv("$400–$599"), insuranceMedicalRecurringRange: fv("$100–$249"), dependentSupportObligation: fv({ hasDependentSupportCost: "No / none" }), subscriptionsDiscretionaryRecurringRange: fv("$50–$99"), otherRecurringObligations: fv({ hasOtherObligations: "No / none" }), monthlySavingsContributionRange: fv("$100–$249"), remainingDiscretionaryCashFlowRange: fv("$250–$499"), cashFlowVariabilityConfidence: fv("Mostly predictable"), billsMoneyUsedForTradingFrequency: fv("Never"),
    ackChecklist: fv(Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k=>[k,true])) as any),
    ...overrides,
  } as StudentSectionsV2;
}
function tcAnswers(overrides: Partial<StudentSectionsV2> = {}): Partial<StudentSectionsV2> {
  return {
    liveTradingFundingStatus: fv("Demo/paper trading only"),
    tradingCapitalSources: fv(["Not funded yet"]),
    tradingCapitalSeparation: fv("Not funded yet"),
    lossOfTradingCapitalImpact: fv(["Not funded yet"]),
    tradingCapitalReplacementExpectation: fv("Not funded yet"),
    tradingCapitalTimeHorizon: fv("Not funded yet"),
    emergencyFundProtectionIntent: fv("Not funding live trading yet"),
    borrowedCreditFundingIntent: fv("Not funding live trading yet"),
    tradingProfitsForEssentialExpensesExpectation: fv("Not live trading yet"),
    liveTradingReadinessSelfAssessment: fv("Prefer demo trading for now"),
    ...overrides,
  };
}
function instructor(): InstructorAssessmentV2 {
  return { instructorSummary:fv("s"), assessedExperienceLevel:fv("Beginner"), assessedKnowledgeLevel:fv("Gaps"), instructorStrengths:fv("x"), instructorWeaknesses:fv("y"), recommendedStartingLevel:fv("F"), recommendedAcademyTrack:fv("T"), recommendedFirstLesson:fv("L"), firstHomework:fv("H"), recommendedPracticeFrequency:fv("4–5x/week"), recommendedCoachingFrequency:fv("Weekly"), immediateActionItems:fv("A") } as any;
}
function audit(formVersion: string): AckAudit {
  return { records: ACKNOWLEDGMENT_KEYS.map((ack_key) => ({ ack_key, ack_text_version_id:"ack_v1", confirmed:true as const, confirmed_at:"2026-01-01T00:00:00.000Z", confirmed_by_user_id:"u", confirmed_by_role:"admin", intake_id:"i", form_version:formVersion, schema_version:INTAKE_V2_SCHEMA_VERSION, capture_mode:"student_reported" as const })) };
}
function complete(student: StudentSectionsV2, formVersion: string) {
  return validateFinalCompletion({ student_sections: student, instructor_assessment: instructor(), ack_audit: audit(formVersion), intake_id: "i", form_version: formVersion, schema_version: INTAKE_V2_SCHEMA_VERSION });
}

describe("Phase 3E Trading Capital, Risk Capacity & Funding Readiness (owner-approved, additive, version-gated)", () => {
  it("locks Phase 3E TC form-version constant/TC keys/semantics; current form/total reflect additive Phase 3F", () => {
    assert.equal(PHASE3E_FORM_VERSION, "hft_intake_v2_form.2026-11-05_phase3e");
    assert.equal(INTAKE_V2_FORM_VERSION, "hft_intake_v2_form.2026-11-05_phase3f");
    assert.equal(INTAKE_V2_SCHEMA_VERSION, "hft_intake_v2.0");
    assert.deepEqual(TRADING_CAPITAL_READINESS_KEY_ORDER, ["liveTradingFundingStatus","tradingCapitalSources","tradingCapitalSeparation","lossOfTradingCapitalImpact","tradingCapitalReplacementExpectation","tradingCapitalTimeHorizon","emergencyFundProtectionIntent","borrowedCreditFundingIntent","tradingProfitsForEssentialExpensesExpectation","liveTradingReadinessSelfAssessment"]);
    assert.equal(INTAKE_V2_STUDENT_KEYS.length, 119); // additive Phase 3F appended PF-01..PF-09
    for (const k of TRADING_CAPITAL_READINESS_KEY_ORDER) assert.ok(INTAKE_V2_STUDENT_KEYS.includes(k as any));
    assert.ok(!INTAKE_V2_STUDENT_KEYS.includes("canPauseLiveTradingIfNeeded" as any), "TC-11 must NOT be implemented");
    assert.equal(INTAKE_V2_STUDENT_KEYS[99], "billsMoneyUsedForTradingFrequency");
    assert.equal(INTAKE_V2_STUDENT_KEYS[100], "liveTradingFundingStatus");
    assert.equal(INTAKE_V2_STUDENT_KEYS[109], "liveTradingReadinessSelfAssessment");
    assert.equal(INTAKE_V2_STUDENT_KEYS[110], "situationalLossResponse");
  });

  it("grandfathers all known pre-Phase-3E drafts (incl. phase3d, legacy) from TC completion requirements", () => {
    assert.equal(requiresTradingCapitalReadinessAtCompletion(PHASE3D_FORM_VERSION), false);
    assert.equal(requiresTradingCapitalReadinessAtCompletion(LEGACY_PRE3D_FORM), false);
    const phase3d = complete(baseStudent(), PHASE3D_FORM_VERSION); // has MO answers in base fixture
    assert.equal(phase3d.ok, true, JSON.stringify(phase3d.issues));
  });

  it("unknown/custom form_version fail-safe: does NOT block completion solely for missing TC (non-punitive)", () => {
    assert.equal(requiresTradingCapitalReadinessAtCompletion("custom_unknown_form"), false);
    assert.equal(requiresTradingCapitalReadinessAtCompletion(null), false);
    const r = complete(baseStudent(), "custom_unknown_form");
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("Phase 3E-era drafts require TC-01..TC-10 at completion", () => {
    assert.equal(requiresTradingCapitalReadinessAtCompletion(PHASE3E_FORM_VERSION), true);
    const r = complete(baseStudent(), PHASE3E_FORM_VERSION);
    assert.equal(r.ok, false);
    assert.ok(r.issues.some(i => i.path.includes("liveTradingFundingStatus")));
    assert.ok(r.issues.some(i => i.path.includes("tradingCapitalSources")));
  });

  it("Phase 3E-era draft completes with valid TC answers (Not funded/Not live trading/demo path)", () => {
    const r = complete(baseStudent(tcAnswers()), PHASE3E_FORM_VERSION);
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("accepts Prefer not to answer (PNTS-equivalent), Not sure yet, Not funded/live-trading alternatives", () => {
    const r = complete(baseStudent(tcAnswers({
      liveTradingFundingStatus: fv(TC_PNTS_ANSWER),
      tradingCapitalSources: fv([TC_PNTS_ANSWER]),
      tradingCapitalSeparation: fv("Not sure yet"),
      lossOfTradingCapitalImpact: fv(["Not sure yet"]),
      tradingCapitalReplacementExpectation: fv(TC_PNTS_ANSWER),
      tradingCapitalTimeHorizon: fv("Not sure yet"),
      emergencyFundProtectionIntent: fv("I do not currently have emergency savings"),
      borrowedCreditFundingIntent: fv("Not sure yet"),
      tradingProfitsForEssentialExpensesExpectation: fv("Not live trading yet"),
      liveTradingReadinessSelfAssessment: fv(TC_PNTS_ANSWER),
    })), PHASE3E_FORM_VERSION);
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("TC-02 mutex: Not funded yet / Not sure yet / Prefer not to answer must be selected alone", () => {
    const ok = complete(baseStudent(tcAnswers({ tradingCapitalSources: fv(["Discretionary income", "Dedicated savings specifically for trading"]) })), PHASE3E_FORM_VERSION);
    assert.equal(ok.ok, true, JSON.stringify(ok.issues));
    const bad = complete(baseStudent(tcAnswers({ tradingCapitalSources: fv(["Not funded yet", "Discretionary income"]) })), PHASE3E_FORM_VERSION);
    assert.ok(bad.issues.some(i => i.path.includes("tradingCapitalSources") && /alone/i.test(i.message)));
  });

  it("TC-04 mutex: None of these / Not funded yet / Not sure yet / Prefer not to answer must be selected alone", () => {
    const ok = complete(baseStudent(tcAnswers({ lossOfTradingCapitalImpact: fv(["Ability to pay bills", "Emergency preparedness"]) })), PHASE3E_FORM_VERSION);
    assert.equal(ok.ok, true, JSON.stringify(ok.issues));
    const bad = complete(baseStudent(tcAnswers({ lossOfTradingCapitalImpact: fv(["None of these", "Ability to pay bills"]) })), PHASE3E_FORM_VERSION);
    assert.ok(bad.issues.some(i => i.path.includes("lossOfTradingCapitalImpact") && /alone/i.test(i.message)));
  });

  it("PNTS/non-disclosure/funding facts do not create automatic high-risk designation; flags unchanged", () => {
    const baseline = evaluateExplainableFlags(baseStudent(tcAnswers()));
    const withUnsafeFacts = evaluateExplainableFlags(baseStudent(tcAnswers({
      tradingCapitalSources: fv(["Borrowed money", "Emergency savings"]),
      borrowedCreditFundingIntent: fv("Yes"),
      tradingProfitsForEssentialExpensesExpectation: fv("Yes, expected to cover major essential expenses"),
      liveTradingFundingStatus: fv(TC_PNTS_ANSWER),
      liveTradingReadinessSelfAssessment: fv(TC_PNTS_ANSWER),
    })));
    assert.deepEqual(withUnsafeFacts.map(f=>f.rule_id), baseline.map(f=>f.rule_id));
  });

  it("no review indicators added/activated; evaluateExplainableFlags rule IDs remain known set", () => {
    const flags = evaluateExplainableFlags(baseStudent(tcAnswers({ pressureToMakeMoneyQuickly: fv("High urgency"), affordableLossRange: fv("$0") })));
    for (const f of flags) assert.ok(["RISK_DEMO_FIRST_V1","RISK_HIGH_FINANCIAL_PRESSURE_V1","SCHEDULE_REALISM_CONCERN_V1"].includes(f.rule_id), `unexpected ${f.rule_id}`);
    assert.ok(!TC_OPTIONS.fundingStatus.includes("TC_CAPITAL_VS_DISCRETIONARY_REVIEW" as any));
  });
});
