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
import { PF_OPTIONS, PF_PNTS_ANSWER, TRADING_BEHAVIOR_KEY_ORDER } from "./trading-behavior-registry";
import { PHASE3D_FORM_VERSION, PHASE3E_FORM_VERSION, PHASE3F_FORM_VERSION, requiresTradingBehaviorAtCompletion, requiresMonthlyObligationsAtCompletion, requiresTradingCapitalReadinessAtCompletion, validateFinalCompletion } from "./validation";

function fv<T>(value: T) { return { value }; }
const LEGACY_PRE3D_FORM = "hft_intake_v2_form.2026-11-05";

function baseStudent(overrides: Partial<StudentSectionsV2> = {}): StudentSectionsV2 {
  return {
    // Q1-Q74 preserved baseline (uses existing required fields/semantics; Q39-Q46 unchanged)
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
    // DC
    debtRepaymentConfidence: fv(PREFER_NOT_TO_SAY), creditUtilizationAwareness: fv("Not sure yet"), paymentHistoryConsistency: fv("Not sure yet"), debtRelatedStress: fv(PREFER_NOT_TO_SAY), creditBuildingGoals: fv("Not sure yet"), recentFinancialHardship: fv({ status: "No recent financial hardship" }), emergencyBorrowingReliance: fv(PREFER_NOT_TO_SAY), creditEducationInterest: fv(PREFER_NOT_TO_SAY), financialImprovementGoals612: fv(["Learn more about debt and credit"]),
    // MO (required for phase3d/3e/3f-era gates as applicable)
    householdIncomeSources: fv(["Primary employment"]), reliableMonthlyIncomePlanningRange: fv("$3,000–$4,999"), housingSituationPayment: fv({ status: "Rent", monthlyRange: "$1,000–$1,499" }), utilitiesHouseholdNecessitiesRange: fv("$250–$499"), transportationObligationRange: fv({ hasTransportationCost: "Yes", monthlyRange: "$250–$499" }), foodGroceriesRange: fv("$400–$599"), insuranceMedicalRecurringRange: fv("$100–$249"), dependentSupportObligation: fv({ hasDependentSupportCost: "No / none" }), subscriptionsDiscretionaryRecurringRange: fv("$50–$99"), otherRecurringObligations: fv({ hasOtherObligations: "No / none" }), monthlySavingsContributionRange: fv("$100–$249"), remainingDiscretionaryCashFlowRange: fv("$250–$499"), cashFlowVariabilityConfidence: fv("Mostly predictable"), billsMoneyUsedForTradingFrequency: fv("Never"),
    // TC (required for phase3e-era gate; grandfathered pre-3e)
    liveTradingFundingStatus: fv("Demo/paper trading only"), tradingCapitalSources: fv(["Not funded yet"]), tradingCapitalSeparation: fv("Not funded yet"), lossOfTradingCapitalImpact: fv(["Not funded yet"]), tradingCapitalReplacementExpectation: fv("Not funded yet"), tradingCapitalTimeHorizon: fv("Not funded yet"), emergencyFundProtectionIntent: fv("Not funding live trading yet"), borrowedCreditFundingIntent: fv("Not funding live trading yet"), tradingProfitsForEssentialExpensesExpectation: fv("Not live trading yet"), liveTradingReadinessSelfAssessment: fv("Prefer demo trading for now"),
    ackChecklist: fv(Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k=>[k,true])) as any),
    ...overrides,
  } as StudentSectionsV2;
}
function pfAnswers(overrides: Partial<StudentSectionsV2> = {}): Partial<StudentSectionsV2> {
  return {
    situationalLossResponse: fv("Follow my plan and review before the next decision"),
    situationalWinStreakResponse: fv("Continue following my normal plan/rules"),
    missedTradeFomoResponse: fv("Comfortable missing it and wait for the next valid setup"),
    unplannedTradeFrequency: fv("Rarely"),
    plannedLossLimitStopAdherence: fv("Very likely"),
    willingToPauseLiveTradingAndReturnToDemo: fv("Yes, willing and able"),
    protectiveExitBehavior: fv("I follow the protective exit as planned"),
    noTradeDayAcceptance: fv("Usually comfortable"),
    journalReviewPractice: fv("I do not currently journal/review, but I am willing to start"),
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

describe("Phase 3F Trading Behavior, Psychology & Discipline (owner-approved, additive, version-gated)", () => {
  it("sets phase3f form version, keeps schema unchanged, appends PF-01..PF-09 after 110 (indices 110-118), total 119; TC-11 NOT implemented", () => {
    assert.equal(INTAKE_V2_FORM_VERSION, PHASE3F_FORM_VERSION);
    assert.equal(PHASE3F_FORM_VERSION, "hft_intake_v2_form.2026-11-05_phase3f");
    assert.equal(INTAKE_V2_SCHEMA_VERSION, "hft_intake_v2.0");
    assert.deepEqual(TRADING_BEHAVIOR_KEY_ORDER, ["situationalLossResponse","situationalWinStreakResponse","missedTradeFomoResponse","unplannedTradeFrequency","plannedLossLimitStopAdherence","willingToPauseLiveTradingAndReturnToDemo","protectiveExitBehavior","noTradeDayAcceptance","journalReviewPractice"]);
    assert.equal(INTAKE_V2_STUDENT_KEYS.length, 119);
    assert.equal(INTAKE_V2_STUDENT_KEYS[109], "liveTradingReadinessSelfAssessment");
    assert.equal(INTAKE_V2_STUDENT_KEYS[110], "situationalLossResponse");
    assert.equal(INTAKE_V2_STUDENT_KEYS[118], "journalReviewPractice");
    for (const k of TRADING_BEHAVIOR_KEY_ORDER) assert.ok(INTAKE_V2_STUDENT_KEYS.includes(k as any));
    assert.ok(!INTAKE_V2_STUDENT_KEYS.includes("canPauseLiveTradingIfNeeded" as any), "TC-11 must NOT be implemented");
  });

  it("Phase 3F-era drafts require PF-01..PF-09 at completion", () => {
    assert.equal(requiresTradingBehaviorAtCompletion(PHASE3F_FORM_VERSION), true);
    const r = complete(baseStudent(), PHASE3F_FORM_VERSION);
    assert.equal(r.ok, false);
    assert.ok(r.issues.some(i => i.path.includes("situationalLossResponse")));
    assert.ok(r.issues.some(i => i.path.includes("journalReviewPractice")));
  });

  it("Phase 3F-era draft completes with valid PF answers (exact canonical options)", () => {
    const r = complete(baseStudent(pfAnswers()), PHASE3F_FORM_VERSION);
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("Phase 3F-era drafts also require MO-01..MO-14 and TC-01..TC-10 at completion", () => {
    assert.equal(requiresMonthlyObligationsAtCompletion(PHASE3F_FORM_VERSION), true);
    assert.equal(requiresTradingCapitalReadinessAtCompletion(PHASE3F_FORM_VERSION), true);

    const missingMo = complete(baseStudent(pfAnswers({ householdIncomeSources: undefined })), PHASE3F_FORM_VERSION);
    assert.equal(missingMo.ok, false);
    assert.ok(missingMo.issues.some(i => i.path.includes("householdIncomeSources")));

    const missingTc = complete(baseStudent(pfAnswers({
      liveTradingFundingStatus: undefined,
      tradingCapitalSources: undefined,
    })), PHASE3F_FORM_VERSION);
    assert.equal(missingTc.ok, false);
    assert.ok(missingTc.issues.some(i => i.path.includes("liveTradingFundingStatus")));
    assert.ok(missingTc.issues.some(i => i.path.includes("tradingCapitalSources")));
  });

  it("Phase 3E drafts are grandfathered from PF but TC requirements still apply", () => {
    assert.equal(requiresTradingBehaviorAtCompletion(PHASE3E_FORM_VERSION), false);
    assert.equal(requiresTradingCapitalReadinessAtCompletion(PHASE3E_FORM_VERSION), true);
    assert.equal(requiresMonthlyObligationsAtCompletion(PHASE3E_FORM_VERSION), true);
    const ok = complete(baseStudent(), PHASE3E_FORM_VERSION); // has TC+MO, no PF
    assert.equal(ok.ok, true, JSON.stringify(ok.issues));
    const missingTc = complete(baseStudent({ liveTradingFundingStatus: undefined, tradingCapitalSources: undefined }), PHASE3E_FORM_VERSION);
    assert.equal(missingTc.ok, false);
    assert.ok(missingTc.issues.some(i => i.path.includes("liveTradingFundingStatus")));
    assert.ok(!missingTc.issues.some(i => i.path.includes("situationalLossResponse")));
  });

  it("Phase 3D drafts are grandfathered from PF/TC but MO requirements still apply per existing gates", () => {
    assert.equal(requiresTradingBehaviorAtCompletion(PHASE3D_FORM_VERSION), false);
    assert.equal(requiresTradingCapitalReadinessAtCompletion(PHASE3D_FORM_VERSION), false);
    assert.equal(requiresMonthlyObligationsAtCompletion(PHASE3D_FORM_VERSION), true);
    const ok = complete(baseStudent({ liveTradingFundingStatus: undefined, tradingCapitalSources: undefined }), PHASE3D_FORM_VERSION); // TC absent ok
    assert.equal(ok.ok, true, JSON.stringify(ok.issues));
    const missingMo = complete(baseStudent({ householdIncomeSources: undefined }), PHASE3D_FORM_VERSION);
    assert.equal(missingMo.ok, false);
    assert.ok(missingMo.issues.some(i => i.path.includes("householdIncomeSources")));
    assert.ok(!missingMo.issues.some(i => i.path.includes("situationalLossResponse")));
  });

  it("earlier known drafts are grandfathered from PF/TC/MO as applicable; unknown/custom/null fail-safe is non-punitive for PF", () => {
    assert.equal(requiresTradingBehaviorAtCompletion(LEGACY_PRE3D_FORM), false);
    assert.equal(requiresTradingBehaviorAtCompletion("custom_unknown_form"), false);
    assert.equal(requiresTradingBehaviorAtCompletion(null), false);
    assert.equal(requiresTradingBehaviorAtCompletion(undefined), false);
    assert.equal(requiresTradingBehaviorAtCompletion(""), false);
    const legacy = complete(baseStudent({ householdIncomeSources: undefined, liveTradingFundingStatus: undefined, tradingCapitalSources: undefined }), LEGACY_PRE3D_FORM);
    assert.equal(legacy.ok, true, JSON.stringify(legacy.issues));
    const custom = complete(baseStudent({ householdIncomeSources: undefined, liveTradingFundingStatus: undefined, tradingCapitalSources: undefined }), "custom_unknown_form");
    assert.equal(custom.ok, true, JSON.stringify(custom.issues));
  });

  it("accepts PNTS (Prefer not to answer) and beginner/no-experience responses as valid completions", () => {
    const r = complete(baseStudent(pfAnswers({
      situationalLossResponse: fv("I have not traded enough to know"),
      situationalWinStreakResponse: fv("I do not have a defined trading plan yet"),
      missedTradeFomoResponse: fv("I do not have defined setups yet"),
      unplannedTradeFrequency: fv("I do not have defined trading rules yet"),
      plannedLossLimitStopAdherence: fv("I have not traded live yet"),
      willingToPauseLiveTradingAndReturnToDemo: fv("I am not trading live"),
      protectiveExitBehavior: fv("I do not currently use planned protective exits"),
      noTradeDayAcceptance: fv("I have not traded enough to know"),
      journalReviewPractice: fv(PF_PNTS_ANSWER),
    })), PHASE3F_FORM_VERSION);
    assert.equal(r.ok, true, JSON.stringify(r.issues));
  });

  it("PF-09 uses exact revised beginner option and does NOT use the forbidden option", () => {
    assert.ok(PF_OPTIONS.journalReviewPractice.includes("I have not traded enough to establish a journal/review practice yet"));
    assert.ok(!(PF_OPTIONS.journalReviewPractice as readonly string[]).includes("I have not traded enough to need a journal yet"));
    const ok = complete(baseStudent(pfAnswers({ journalReviewPractice: fv("I have not traded enough to establish a journal/review practice yet") })), PHASE3F_FORM_VERSION);
    assert.equal(ok.ok, true, JSON.stringify(ok.issues));
    const bad = complete(baseStudent({ ...pfAnswers(), journalReviewPractice: { value: "I have not traded enough to need a journal yet" } } as any), PHASE3F_FORM_VERSION);
    assert.equal(bad.ok, false);
    assert.ok(bad.issues.some(i => i.path.includes("journalReviewPractice")));
  });

  it("PF-05 and PF-06 remain separate fields; TC-11 key absent; all PF single-select (no multiselect/mutex)", () => {
    assert.ok(TRADING_BEHAVIOR_KEY_ORDER.includes("plannedLossLimitStopAdherence"));
    assert.ok(TRADING_BEHAVIOR_KEY_ORDER.includes("willingToPauseLiveTradingAndReturnToDemo"));
    assert.notEqual(TRADING_BEHAVIOR_KEY_ORDER.indexOf("plannedLossLimitStopAdherence"), TRADING_BEHAVIOR_KEY_ORDER.indexOf("willingToPauseLiveTradingAndReturnToDemo"));
    assert.ok(!INTAKE_V2_STUDENT_KEYS.includes("canPauseLiveTradingIfNeeded" as any));
    // single-select behavior: invalid array not accepted as a canonical string
    const bad = complete(baseStudent(pfAnswers({ unplannedTradeFrequency: fv(["Never"] as any) })), PHASE3F_FORM_VERSION);
    assert.equal(bad.ok, false);
  });

  it("PNTS/beginner/no-experience PF answers do not create automatic high-risk designation; evaluateExplainableFlags unchanged (known IDs only)", () => {
    const baseline = evaluateExplainableFlags(baseStudent(pfAnswers()));
    const withBeginner = evaluateExplainableFlags(baseStudent(pfAnswers({
      situationalLossResponse: fv("Increase size or take extra risk to try to recover faster"),
      unplannedTradeFrequency: fv(PF_PNTS_ANSWER),
      plannedLossLimitStopAdherence: fv("I have not traded live yet"),
      protectiveExitBehavior: fv("I sometimes remove it"),
    })));
    assert.deepEqual(withBeginner.map(f=>f.rule_id), baseline.map(f=>f.rule_id));
    const demoFirst = evaluateExplainableFlags(baseStudent(pfAnswers({ pressureToMakeMoneyQuickly: fv("High urgency"), affordableLossRange: fv("$0") })));
    for (const f of demoFirst) assert.ok(["RISK_DEMO_FIRST_V1","RISK_HIGH_FINANCIAL_PRESSURE_V1","SCHEDULE_REALISM_CONCERN_V1"].includes(f.rule_id));
  });
});
