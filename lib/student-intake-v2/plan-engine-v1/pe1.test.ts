import { describe, it } from "node:test";
import assert from "node:assert";
import { INTAKE_V2_SCHEMA_VERSION } from "../contracts";
import {
  type PlanEngineInput,
  runPlanEngineV1Pe1,
  deriveDemoFirstReadinessAdvisory,
} from "./index";

const CTX = { computed_at: "2026-11-05T00:00:00.000Z" };
const REF = (form: string) => ({ intake_id: "i1", form_version: form, schema_version: INTAKE_V2_SCHEMA_VERSION, status: "completed" as const, student_user_id: "s1" });

function fv<T>(value: T) { return { value, provenance: { source: "student_reported" as const, entered_by_user_id: "u1", entered_at: "2026-11-05T00:00:00.000Z" } }; }
function baseSections(overrides: Record<string, any> = {}) {
  return {
    monthlyTakeHomeRange: fv("$3,000–$4,999"), additionalIncome: fv({ hasAdditional: "No" }), incomeConsistencyPay: fv({ consistency: "Very consistent", payFrequency: "Monthly" }), disposableIncomeRange: fv("$500–$999"), recurringObligationsRange: fv("$1,000–$1,999"), variableExpensesRange: fv("$250–$499"), upcomingMajorExpenses: fv({ hasUpcoming: "No" }), savingsEmergencyRanges: fv({ savings: "$1,000–$2,499", emergencyFund: "$1,000–$2,499" }), unexpectedExpenseAbility: fv("I could cover it from cash/savings without hardship"), debtStatusTypes: fv({ hasDebt: "No" }), availableTradingCapitalRange: fv("$500–$999"), affordableLossRange: fv("$100–$249"), pressureToMakeMoneyQuickly: fv("No urgency right now"), desiredAdditionalMonthlyIncomeRange: fv("$500–$999"), financialReasonForTrading: fv("Build skill"),
    marketsExperience: fv(["None yet"]), demoLiveExperience: fv({ demo: "No", live: "No" }), knowledgeMatrix: fv(Object.fromEntries(["buy_sell_direction","stop_loss","take_profit","lot_size","pips","leverage","spread_fees","candlesticks","support_resistance","trend","market_structure_basics","risk_management","position_sizing"].map(k=>[k,"Heard of it"]))), platformsBrokerExperience: fv({ platforms: ["None yet"], brokerExperience: "No" }), priorEducation: fv({ type: "No" }), majorNegativeExperience: fv({ type: "No" }), biggestTradingConfusion: fv("Risk"),
    behaviorMatrix: fv({ fomo:"Sometimes", revenge_trading:"Unlikely", impulsiveness:"Rarely", patience:"Moderate", rule_consistency:"Usually" }), behaviorTendencies: fv(["Not applicable yet"]), reactionToLoss: fv("Pause"), reactionToWin: fv("Calm"), willingDemoFirst: fv("Yes"), willingRiskLimits: fv("Yes"),
    weeklyAvailability: fv({ monday: { windows: ["Evening"] } }), unavailableDays: fv(["None"]), weeklyHoursRange: fv("5–7 hours"), windowsAndConsistency: fv({ preferredWindows: ["Weekday evenings"], consistencyExpectation: "Mostly consistent" }),
    householdIncomeSources: fv(["Primary employment"]), reliableMonthlyIncomePlanningRange: fv("$3,000–$4,999"), housingSituationPayment: fv({ status: "Rent", monthlyRange: "$1,000–$1,499" }), utilitiesHouseholdNecessitiesRange: fv("$250–$499"), transportationObligationRange: fv({ hasTransportationCost: "Yes", monthlyRange: "$250–$499" }), foodGroceriesRange: fv("$400–$599"), insuranceMedicalRecurringRange: fv("$100–$249"), dependentSupportObligation: fv({ hasDependentSupportCost: "No / none" }), subscriptionsDiscretionaryRecurringRange: fv("$50–$99"), otherRecurringObligations: fv({ hasOtherObligations: "No / none" }), monthlySavingsContributionRange: fv("$100–$249"), remainingDiscretionaryCashFlowRange: fv("$250–$499"), cashFlowVariabilityConfidence: fv("Mostly predictable"), billsMoneyUsedForTradingFrequency: fv("Never"),
    liveTradingFundingStatus: fv("Demo/paper trading only"), tradingCapitalSources: fv(["Not funded yet"]), tradingCapitalSeparation: fv("Not funded yet"), lossOfTradingCapitalImpact: fv(["Not funded yet"]), tradingCapitalReplacementExpectation: fv("Not funded yet"), tradingCapitalTimeHorizon: fv("Not funded yet"), emergencyFundProtectionIntent: fv("Not funding live trading yet"), borrowedCreditFundingIntent: fv("Not funding live trading yet"), tradingProfitsForEssentialExpensesExpectation: fv("Not live trading yet"), liveTradingReadinessSelfAssessment: fv("Prefer demo trading for now"),
    situationalLossResponse: fv("Follow my plan and review before the next decision"), situationalWinStreakResponse: fv("Continue following my normal plan/rules"), missedTradeFomoResponse: fv("Comfortable missing it and wait for the next valid setup"), unplannedTradeFrequency: fv("Rarely"), plannedLossLimitStopAdherence: fv("Very likely"), willingToPauseLiveTradingAndReturnToDemo: fv("Yes, willing and able"), protectiveExitBehavior: fv("I follow the protective exit as planned"), noTradeDayAcceptance: fv("Usually comfortable"), journalReviewPractice: fv("I do not currently journal/review, but I am willing to start"),
    ...overrides,
  };
}
function input(form: string, sectionOverrides: Record<string, any> = {}, extra: Partial<PlanEngineInput> = {}): PlanEngineInput {
  return { intake_id: "i1", student_user_id: "s1", status: "completed", snapshot_version: 1, completed_at: "2026-11-05T00:00:00.000Z", form_version: form, schema_version: INTAKE_V2_SCHEMA_VERSION, student_sections_json: baseSections(sectionOverrides) as any, system_flags_json: [], provenance_json: {}, ...extra };
}

function assertNoRawMutation(before: any, afterInput: PlanEngineInput) {
  assert.deepEqual(afterInput.student_sections_json, before);
}
function assertNoForbiddenOutput(obj: unknown) {
  const forbiddenKeys = new Set(["live_trading_approved","approved_for_live_trading","recommended_account_size","recommended_deposit","recommended_funding_amount","risk_per_trade","risk_percentage","daily_loss_limit","lot_size_recommendation","position_size_recommendation","leverage_recommendation","profit_target","expected_return","required_return","income_projection","account_size"]);
  const forbiddenResultValues = new Set(["APPROVED_FOR_LIVE_TRADING","READY_FOR_LIVE_TRADING","CLEARED_FOR_LIVE_TRADING","SAFE_TO_FUND","SAFE_TO_TRADE"]);
  function walk(v: unknown, path: string) {
    if (v == null) return;
    if (Array.isArray(v)) { v.forEach((x,i)=>walk(x,`${path}[${i}]`)); return; }
    if (typeof v === "object") {
      for (const [k,val] of Object.entries(v as any)) {
        if (forbiddenKeys.has(k)) throw new Error(`forbidden engine output key ${path}.${k}`);
        // allow legitimate source-key references in explanation.reason.source_key (leverage/lot_size/position_sizing are KM topics)
        if ((k === "result" || k.endsWith("_result")) && typeof val === "string" && forbiddenResultValues.has(val)) throw new Error(`forbidden approval result ${val} at ${path}.${k}`);
        walk(val, `${path}.${k}`);
      }
      return;
    }
    if (typeof v === "string" && forbiddenResultValues.has(v)) throw new Error(`forbidden approval value ${v} at ${path}`);
  }
  walk(obj, "root");
}

describe("PE-1 Plan Engine V1 (pure, deterministic, no persistence)", () => {
  it("runs all 10 derived features deterministically with injected timestamp and no raw mutation", () => {
    const inp = input("hft_intake_v2_form.2026-11-05_phase3f");
    const before = JSON.parse(JSON.stringify(inp.student_sections_json));
    const out = runPlanEngineV1Pe1(inp, CTX);
    assert.equal(out.computed_at, CTX.computed_at);
    assert.equal(Object.keys(out.derived_features).length, 10);
    assertNoRawMutation(before, inp);
    assertNoForbiddenOutput(out);
  });

  it("1) $0 available trading capital -> education/demo-only context, valid", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { availableTradingCapitalRange: fv("$0 (not available now)") }), CTX);
    assert.equal(out.derived_features.capital_safety_review_v1.result, "EDUCATION_DEMO_ONLY_CONTEXT");
    assertNoForbiddenOutput(out);
  });
  it("2) $0 affordable loss -> education/demo-only context, valid", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { affordableLossRange: fv("$0") }), CTX);
    assert.equal(out.derived_features.capital_safety_review_v1.result, "EDUCATION_DEMO_ONLY_CONTEXT");
  });
  it("3) PNTS-heavy intake never independently causes punitive/negative review", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { monthlyTakeHomeRange: fv("Prefer not to say"), disposableIncomeRange: fv("Prefer not to say"), savingsEmergencyRanges: fv({ savings: "Prefer not to say", emergencyFund: "Prefer not to say" }), unexpectedExpenseAbility: fv("Prefer not to say"), availableTradingCapitalRange: fv("Prefer not to say"), affordableLossRange: fv("Prefer not to say"), pressureToMakeMoneyQuickly: fv("Prefer not to say") }), CTX);
    assert.notEqual(out.derived_features.financial_stability_band_v1.result, "CASH_FLOW_PRESSURE_REVIEW");
    assert.notEqual(out.derived_features.emergency_resilience_band_v1.result, "FRAGILE_BUFFER_REVIEW");
    assertNoForbiddenOutput(out);
  });
  it("4) beginner/no-experience answers are valid and do not independently cause negative behavioral review", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { marketsExperience: fv(["None yet"]), demoLiveExperience: fv({ demo:"No", live:"No" }), unplannedTradeFrequency: fv("I have not traded enough to know"), plannedLossLimitStopAdherence: fv("I have not traded live yet"), protectiveExitBehavior: fv("I have not traded enough to know"), journalReviewPractice: fv("I have not traded enough to establish a journal/review practice yet"), willingToPauseLiveTradingAndReturnToDemo: fv("I am not trading live") }), CTX);
    assert.notEqual(out.derived_features.behavioral_discipline_support_band_v1.result, "HIGH_STRUCTURE_AND_REVIEW_SUPPORT");
  });
  it("5) stable financial + beginner knowledge", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f"), CTX);
    assert.ok(["STABLE_ENOUGH_TO_PLAN","MIXED_VARIABILITY"].includes(out.derived_features.financial_stability_band_v1.result));
    assert.ok(["FOUNDATIONS","RISK_AND_PROCESS_FOUNDATIONS"].includes(out.derived_features.curriculum_starting_level_v1.result));
  });
  it("6) constrained financial context + experienced trader", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { monthlyTakeHomeRange: fv("Under $1,000"), incomeConsistencyPay: fv({ consistency:"Very inconsistent / unpredictable", payFrequency:"Irregular / varies" }), remainingDiscretionaryCashFlowRange: fv("$0"), cashFlowVariabilityConfidence: fv("Very unpredictable"), savingsEmergencyRanges: fv({ savings:"$0", emergencyFund:"$0" }), unexpectedExpenseAbility: fv("I would likely not be able to cover it right now"), marketsExperience: fv(["Forex"]), demoLiveExperience: fv({ demo:"Yes", live:"Yes" }) }), CTX);
    assert.equal(out.derived_features.financial_stability_band_v1.result, "CASH_FLOW_PRESSURE_REVIEW");
  });
  it("7) strong knowledge + higher behavioral support need", () => {
    const km = Object.fromEntries(["buy_sell_direction","stop_loss","take_profit","lot_size","pips","leverage","spread_fees","candlesticks","support_resistance","trend","market_structure_basics","risk_management","position_sizing"].map(k=>[k,"Confident"]));
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { knowledgeMatrix: fv(km), unplannedTradeFrequency: fv("Often"), plannedLossLimitStopAdherence: fv("Unlikely"), protectiveExitBehavior: fv("I sometimes remove it"), journalReviewPractice: fv("I do not currently journal/review and I prefer not to use it") }), CTX);
    assert.equal(out.derived_features.behavioral_discipline_support_band_v1.result, "HIGH_STRUCTURE_AND_REVIEW_SUPPORT");
  });
  it("8) weak knowledge + strong discipline", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { unplannedTradeFrequency: fv("Never"), plannedLossLimitStopAdherence: fv("Very likely"), protectiveExitBehavior: fv("I follow the protective exit as planned"), journalReviewPractice: fv("I journal/review consistently") }), CTX);
    assert.equal(out.derived_features.behavioral_discipline_support_band_v1.result, "FOUNDATION_SUPPORT");
    assert.equal(out.derived_features.curriculum_starting_level_v1.result, "FOUNDATIONS");
  });
  it("9) borrowed/credit funding context", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { tradingCapitalSources: fv(["Borrowed money"]), borrowedCreditFundingIntent: fv("Yes"), liveTradingFundingStatus: fv("Money set aside but account not funded") }), CTX);
    assert.ok(["BORROWED_OR_CREDIT_CONTEXT_REPORTED","ESSENTIAL_OR_EMERGENCY_SOURCE_REVIEW"].includes(out.derived_features.funding_source_safety_review_v1.result));
  });
  it("10) emergency/essential-money funding context", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { tradingCapitalSources: fv(["Emergency savings","Money normally used for bills/living expenses"]), billsMoneyUsedForTradingFrequency: fv("Often") }), CTX);
    assert.equal(out.derived_features.funding_source_safety_review_v1.result, "ESSENTIAL_OR_EMERGENCY_SOURCE_REVIEW");
  });
  it("11) profits expected for essential expenses", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { tradingProfitsForEssentialExpensesExpectation: fv("Yes, expected to cover major essential expenses"), pressureToMakeMoneyQuickly: fv("High urgency") }), CTX);
    assert.equal(out.derived_features.trading_profit_dependency_review_v1.result, "DEPENDENCY_REVIEW");
    assertNoForbiddenOutput(out);
  });
  it("12) capital separation conflict", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { tradingCapitalSeparation: fv("Yes, fully separate"), lossOfTradingCapitalImpact: fv(["Groceries/basic living","Ability to pay bills"]) }), CTX);
    assert.ok(out.derived_features.capital_safety_review_v1.conflicts.some(c=>c.conflict_id==="CAPITAL_SEPARATION_VS_ESSENTIAL_IMPACT"));
  });
  it("13) affordable loss $0 + funded/live conflict", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { affordableLossRange: fv("$0"), liveTradingFundingStatus: fv("Live trading account funded but not actively trading") }), CTX);
    assert.ok(out.derived_features.capital_safety_review_v1.conflicts.some(c=>c.conflict_id==="AFFORDABLE_LOSS_ZERO_WITH_FUNDED_CONTEXT"));
    assert.equal(out.derived_features.demo_first_readiness_advisory_v1.instructor_review_required, true);
  });
  it("14) readiness self-assessment vs unsafe funding context", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { liveTradingReadinessSelfAssessment: fv("Ready now"), tradingCapitalSources: fv(["Borrowed money"]), borrowedCreditFundingIntent: fv("Yes") }), CTX);
    assert.ok(out.derived_features.demo_first_readiness_advisory_v1.conflicts.some(c=>c.conflict_id==="READINESS_SELF_ASSESSMENT_VS_FUNDING_CONTEXT"));
  });
  it("15) Phase 3F input fully supported", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f"), CTX);
    assert.notEqual(out.derived_features.behavioral_discipline_support_band_v1.status, "NOT_COLLECTED_FOR_VERSION");
  });
  it("16) Phase 3E grandfathered: PF not collected by version", () => {
    const inp = input("hft_intake_v2_form.2026-11-05_phase3e"); delete (inp.student_sections_json as any).situationalLossResponse;
    const out = runPlanEngineV1Pe1(inp, CTX);
    assert.equal(out.derived_features.behavioral_discipline_support_band_v1.status, "NOT_COLLECTED_FOR_VERSION");
  });
  it("17) Phase 3D grandfathered: TC/PF not collected by version", () => {
    const inp = input("hft_intake_v2_form.2026-11-05_phase3d"); delete (inp.student_sections_json as any).liveTradingFundingStatus; delete (inp.student_sections_json as any).situationalLossResponse;
    const out = runPlanEngineV1Pe1(inp, CTX);
    assert.equal(out.derived_features.funding_source_safety_review_v1.status, "NOT_COLLECTED_FOR_VERSION");
  });
  it("18) earlier known version handled safely", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05"), CTX);
    assert.ok(["NOT_COLLECTED_FOR_VERSION","KNOWN","INSUFFICIENT_INFORMATION"].includes(out.derived_features.funding_source_safety_review_v1.status));
  });
  it("19) unknown/custom version fails safely without pretending data exists", () => {
    const out = runPlanEngineV1Pe1(input("custom_unknown_form"), CTX);
    assert.notEqual(out.derived_features.behavioral_discipline_support_band_v1.status, "KNOWN");
  });
  it("20) missing instructor assessment -> insufficient/engine path, no invention", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", {}, { instructor_assessment_json: null }), CTX);
    assert.notEqual(out.derived_features.curriculum_starting_level_v1.result, "INSTRUCTOR_DEFINED");
  });
  it("21) instructor-defined curriculum override input", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", {}, { instructor_assessment_json: { recommendedStartingLevel: { value: "Foundations" } } as any }), CTX);
    assert.equal(out.derived_features.curriculum_starting_level_v1.result, "INSTRUCTOR_DEFINED");
  });
  it("22) PNTS never independently causes negative review", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { unplannedTradeFrequency: fv("Prefer not to answer"), pressureToMakeMoneyQuickly: fv("Prefer not to say") }), CTX);
    assert.notEqual(out.derived_features.behavioral_discipline_support_band_v1.result, "HIGH_STRUCTURE_AND_REVIEW_SUPPORT");
  });
  it("23) beginner state never independently causes negative behavioral review", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { unplannedTradeFrequency: fv("I have not traded enough to know") }), CTX);
    assert.notEqual(out.derived_features.behavioral_discipline_support_band_v1.result, "HIGH_STRUCTURE_AND_REVIEW_SUPPORT");
  });
  it("24) low income alone never causes punitive result", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { monthlyTakeHomeRange: fv("Under $1,000") }), CTX);
    assert.notEqual(out.derived_features.financial_stability_band_v1.result, "CASH_FLOW_PRESSURE_REVIEW");
  });
  it("25) debt alone never causes punitive result", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { debtStatusTypes: fv({ hasDebt: "Yes", types: ["Credit cards"] }), totalDebtRange: fv("$50,000+"), monthlyDebtPaymentsRange: fv("$2,000+") }), CTX);
    assert.notEqual(out.derived_features.financial_stability_band_v1.result, "CASH_FLOW_PRESSURE_REVIEW");
  });
  it("26) dependents alone never causes punitive result", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f", { dependentSupportObligation: fv({ hasDependentSupportCost: "Yes", monthlyRange: "$1,000+" }) }), CTX);
    assert.notEqual(out.derived_features.emergency_resilience_band_v1.result, "FRAGILE_BUFFER_REVIEW");
  });
  it("27) no active flag mutation", () => {
    const flags = [{ rule_id:"RISK_DEMO_FIRST_V1", flag_name:"Demo-first recommendation", source_fields:["affordableLossRange"], triggering_values:[{field:"affordableLossRange",value:"$0"}], explanation:"x", suggested_instructor_action:"y", severity:"high" as const }];
    const inp = input("hft_intake_v2_form.2026-11-05_phase3f", {}, { system_flags_json: flags as any });
    const before = JSON.stringify(inp.system_flags_json);
    runPlanEngineV1Pe1(inp, CTX);
    assert.equal(JSON.stringify(inp.system_flags_json), before);
  });
  it("28) no raw student answer mutation", () => {
    const inp = input("hft_intake_v2_form.2026-11-05_phase3f");
    const before = JSON.stringify(inp.student_sections_json);
    runPlanEngineV1Pe1(inp, CTX);
    assert.equal(JSON.stringify(inp.student_sections_json), before);
  });
  it("29) deterministic output with injected timestamp", () => {
    const inp = input("hft_intake_v2_form.2026-11-05_phase3f");
    assert.deepEqual(runPlanEngineV1Pe1(inp, CTX), runPlanEngineV1Pe1(inp, CTX));
  });
  it("30) forbidden output/property guard and demo-first never approves", () => {
    const out = runPlanEngineV1Pe1(input("hft_intake_v2_form.2026-11-05_phase3f"), CTX);
    assertNoForbiddenOutput(out);
    assert.equal(out.derived_features.demo_first_readiness_advisory_v1.instructor_review_required, true);
    assert.ok(["EDUCATION_DEMO_FIRST_SUPPORTED","INSTRUCTOR_REVIEW_BEFORE_PROGRESSION_CONSIDERATION","INSUFFICIENT_INFORMATION"].includes(out.derived_features.demo_first_readiness_advisory_v1.result));
  });
});
