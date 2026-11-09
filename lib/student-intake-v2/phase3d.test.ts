import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ACKNOWLEDGMENT_KEYS,
  INTAKE_V2_FORM_VERSION,
  INTAKE_V2_STUDENT_KEYS,
  PREFER_NOT_TO_SAY,
  type AckAudit,
  type InstructorAssessmentV2,
  type StudentSectionsV2,
} from "./contracts";
import {
  MO_OPTIONS,
  MO_OTHER_NOTE_MAX,
  MO_PNTS_ANSWER,
  MONTHLY_OBLIGATIONS_KEY_ORDER,
} from "./monthly-obligations-registry";
import { evaluateExplainableFlags } from "./flags";
import { PHASE3D_FORM_VERSION, requiresMonthlyObligationsAtCompletion, validateFinalCompletion } from "./validation";

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
    ackChecklist: fv(Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k=>[k,true])) as any),
    ...overrides,
  } as StudentSectionsV2;
}
function moAnswers(overrides: Partial<StudentSectionsV2> = {}): Partial<StudentSectionsV2> {
  return {
    householdIncomeSources: fv(["Primary employment"]),
    reliableMonthlyIncomePlanningRange: fv("$3,000–$4,999"),
    housingSituationPayment: fv({ status: "Rent", monthlyRange: "$1,000–$1,499" }),
    utilitiesHouseholdNecessitiesRange: fv("$250–$499"),
    transportationObligationRange: fv({ hasTransportationCost: "Yes", monthlyRange: "$250–$499" }),
    foodGroceriesRange: fv("$400–$599"),
    insuranceMedicalRecurringRange: fv("$100–$249"),
    dependentSupportObligation: fv({ hasDependentSupportCost: "No / none" }),
    subscriptionsDiscretionaryRecurringRange: fv("$50–$99"),
    otherRecurringObligations: fv({ hasOtherObligations: "No / none" }),
    monthlySavingsContributionRange: fv("$100–$249"),
    remainingDiscretionaryCashFlowRange: fv("$250–$499"),
    cashFlowVariabilityConfidence: fv("Mostly predictable"),
    billsMoneyUsedForTradingFrequency: fv("Never"),
    ...overrides,
  };
}
function instructor(): InstructorAssessmentV2 {
  return { instructorSummary:fv("s"), assessedExperienceLevel:fv("Beginner"), assessedKnowledgeLevel:fv("Gaps"), instructorStrengths:fv("x"), instructorWeaknesses:fv("y"), recommendedStartingLevel:fv("F"), recommendedAcademyTrack:fv("T"), recommendedFirstLesson:fv("L"), firstHomework:fv("H"), recommendedPracticeFrequency:fv("4–5x/week"), recommendedCoachingFrequency:fv("Weekly"), immediateActionItems:fv("A") } as any;
}
function audit(): AckAudit {
  return { records: ACKNOWLEDGMENT_KEYS.map((ack_key) => ({ ack_key, ack_text_version_id:"ack_v1", confirmed:true as const, confirmed_at:"2026-01-01T00:00:00.000Z", confirmed_by_user_id:"u", confirmed_by_role:"admin", intake_id:"i", form_version:PHASE3D_FORM_VERSION, schema_version:"hft_intake_v2.0", capture_mode:"student_reported" as const })) };
}
function complete(student: StudentSectionsV2, formVersion: string) {
  return validateFinalCompletion({ student_sections: student, instructor_assessment: instructor(), ack_audit: audit(), intake_id: "i", form_version: formVersion, schema_version: "hft_intake_v2.0" });
}

describe("Phase 3D Monthly Obligations & Cash Flow (owner-approved, additive, version-gated)", () => {
  it("locks Phase 3D MO form-version constant and MO keys/order; current form/total reflect additive Phase 3F", () => {
    assert.equal(PHASE3D_FORM_VERSION, "hft_intake_v2_form.2026-11-05_phase3d");
    assert.equal(INTAKE_V2_FORM_VERSION, "hft_intake_v2_form.2026-11-05_phase3f");
    assert.deepEqual(MONTHLY_OBLIGATIONS_KEY_ORDER, ["householdIncomeSources","reliableMonthlyIncomePlanningRange","housingSituationPayment","utilitiesHouseholdNecessitiesRange","transportationObligationRange","foodGroceriesRange","insuranceMedicalRecurringRange","dependentSupportObligation","subscriptionsDiscretionaryRecurringRange","otherRecurringObligations","monthlySavingsContributionRange","remainingDiscretionaryCashFlowRange","cashFlowVariabilityConfidence","billsMoneyUsedForTradingFrequency"]);
    assert.equal(INTAKE_V2_STUDENT_KEYS.length, 119); // additive Phase 3F appended PF-01..PF-09
    for (const k of MONTHLY_OBLIGATIONS_KEY_ORDER) assert.ok(INTAKE_V2_STUDENT_KEYS.includes(k as any));
    assert.equal(INTAKE_V2_STUDENT_KEYS[86], "householdIncomeSources");
    assert.equal(INTAKE_V2_STUDENT_KEYS[99], "billsMoneyUsedForTradingFrequency");
    assert.equal(INTAKE_V2_STUDENT_KEYS[100], "liveTradingFundingStatus");
    assert.equal(INTAKE_V2_STUDENT_KEYS[110], "situationalLossResponse");
    assert.equal(INTAKE_V2_STUDENT_KEYS[118], "journalReviewPractice");
  });

  it("legacy/pre-3D drafts are grandfathered: completable without MO answers", () => {
    assert.equal(requiresMonthlyObligationsAtCompletion(LEGACY_PRE3D_FORM), false);
    const r = complete(baseStudent(), LEGACY_PRE3D_FORM);
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("unknown/custom form_version fail-safe: does NOT block completion solely for missing MO", () => {
    assert.equal(requiresMonthlyObligationsAtCompletion("custom_unknown_form"), false);
    assert.equal(requiresMonthlyObligationsAtCompletion(null), false);
    const r = complete(baseStudent(), "custom_unknown_form");
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("Phase 3D-era drafts require MO-01..MO-14 at completion", () => {
    assert.equal(requiresMonthlyObligationsAtCompletion(PHASE3D_FORM_VERSION), true);
    const r = complete(baseStudent(), PHASE3D_FORM_VERSION);
    assert.equal(r.ok, false);
    assert.ok(r.issues.some(i => i.path.includes("householdIncomeSources")));
    assert.ok(r.issues.some(i => i.path.includes("billsMoneyUsedForTradingFrequency")));
  });

  it("Phase 3D-era draft completes with valid MO answers and conditionals", () => {
    const r = complete(baseStudent(moAnswers()), PHASE3D_FORM_VERSION);
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("MO-01 mutex: Not sure yet / PNTS / No regular income source alone; specific sources allowed", () => {
    const ok = complete(baseStudent(moAnswers({ householdIncomeSources: fv(["Primary employment", "Side work/gig income"]) })), PHASE3D_FORM_VERSION);
    assert.equal(ok.ok, true, JSON.stringify(ok.issues));
    const bad = complete(baseStudent(moAnswers({ householdIncomeSources: fv(["Prefer not to say", "Primary employment"]) })), PHASE3D_FORM_VERSION);
    assert.ok(bad.issues.some(i => i.path.includes("householdIncomeSources")));
  });

  it("$0 / None / Not applicable / no housing payment are valid legitimate outcomes", () => {
    const r = complete(baseStudent(moAnswers({
      reliableMonthlyIncomePlanningRange: fv("$0"),
      housingSituationPayment: fv({ status: "No current housing payment" }),
      utilitiesHouseholdNecessitiesRange: fv("$0"),
      transportationObligationRange: fv({ hasTransportationCost: "No / not applicable" }),
      foodGroceriesRange: fv("$0"),
      insuranceMedicalRecurringRange: fv("$0 / none"),
      dependentSupportObligation: fv({ hasDependentSupportCost: "Not applicable" }),
      subscriptionsDiscretionaryRecurringRange: fv("$0 / none"),
      otherRecurringObligations: fv({ hasOtherObligations: "No / none" }),
      monthlySavingsContributionRange: fv("$0 / not currently saving"),
      remainingDiscretionaryCashFlowRange: fv("$0"),
    })), PHASE3D_FORM_VERSION);
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("Prefer not to say / Not sure yet / Prefer not to answer valid where specified", () => {
    const r = complete(baseStudent(moAnswers({
      householdIncomeSources: fv([PREFER_NOT_TO_SAY]),
      reliableMonthlyIncomePlanningRange: fv(PREFER_NOT_TO_SAY),
      housingSituationPayment: fv({ status: PREFER_NOT_TO_SAY }),
      utilitiesHouseholdNecessitiesRange: fv("Not sure yet"),
      transportationObligationRange: fv({ hasTransportationCost: PREFER_NOT_TO_SAY }),
      foodGroceriesRange: fv(PREFER_NOT_TO_SAY),
      insuranceMedicalRecurringRange: fv(PREFER_NOT_TO_SAY),
      dependentSupportObligation: fv({ hasDependentSupportCost: PREFER_NOT_TO_SAY }),
      subscriptionsDiscretionaryRecurringRange: fv(PREFER_NOT_TO_SAY),
      otherRecurringObligations: fv({ hasOtherObligations: PREFER_NOT_TO_SAY }),
      monthlySavingsContributionRange: fv(PREFER_NOT_TO_SAY),
      remainingDiscretionaryCashFlowRange: fv("Not sure yet"),
      cashFlowVariabilityConfidence: fv(PREFER_NOT_TO_SAY),
      billsMoneyUsedForTradingFrequency: fv(MO_PNTS_ANSWER),
    })), PHASE3D_FORM_VERSION);
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("MO-10 note optional, max 140 chars; sensitive details not required", () => {
    assert.equal(MO_OTHER_NOTE_MAX, 140);
    const ok = complete(baseStudent(moAnswers({ otherRecurringObligations: fv({ hasOtherObligations: "Yes", monthlyRange: "$100–$249", note: "high level only" }) })), PHASE3D_FORM_VERSION);
    assert.equal(ok.ok, true, JSON.stringify(ok.issues));
    const bad = complete(baseStudent(moAnswers({ otherRecurringObligations: fv({ hasOtherObligations: "Yes", monthlyRange: "$100–$249", note: "x".repeat(141) }) })), PHASE3D_FORM_VERSION);
    assert.ok(bad.issues.some(i => i.path.includes("otherRecurringObligations.note")));
  });

  it("MO-14 alone does not create automatic high-risk designation; existing flags unchanged", () => {
    const baseline = evaluateExplainableFlags(baseStudent(moAnswers()));
    const withOften = evaluateExplainableFlags(baseStudent(moAnswers({ billsMoneyUsedForTradingFrequency: fv("Often") })));
    const withPnTA = evaluateExplainableFlags(baseStudent(moAnswers({ billsMoneyUsedForTradingFrequency: fv(MO_PNTS_ANSWER) })));
    assert.deepEqual(withOften.map(f=>f.rule_id), baseline.map(f=>f.rule_id));
    assert.deepEqual(withPnTA.map(f=>f.rule_id), baseline.map(f=>f.rule_id));
  });

  it("no new active flags/review indicators added (flag rule IDs remain known set)", () => {
    const flags = evaluateExplainableFlags(baseStudent(moAnswers({ pressureToMakeMoneyQuickly: fv("High urgency"), affordableLossRange: fv("$0"), billsMoneyUsedForTradingFrequency: fv("Often"), remainingDiscretionaryCashFlowRange: fv("$0") })));
    for (const f of flags) assert.ok(["RISK_DEMO_FIRST_V1","RISK_HIGH_FINANCIAL_PRESSURE_V1","SCHEDULE_REALISM_CONCERN_V1"].includes(f.rule_id), `unexpected ${f.rule_id}`);
    assert.ok(!MO_OPTIONS.billsMoneyForTrading.includes("CASHFLOW_OBLIGATIONS_MISMATCH_REVIEW" as any));
  });
});
