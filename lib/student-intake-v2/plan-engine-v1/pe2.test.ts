import { describe, it } from "node:test";
import assert from "node:assert";
import { ACKNOWLEDGMENT_KEYS, INTAKE_V2_SCHEMA_VERSION } from "../contracts";
import { composePlanEngineV1Draft, type PlanEngineInput } from "./index";

const CTX = { computed_at: "2026-11-05T00:00:00.000Z", generated_at: "2026-11-05T00:00:00.000Z" };
function fv<T>(value: T, source: any = "student_reported") { return { value, provenance: { source, entered_by_user_id: "u1", entered_at: "2026-11-05T00:00:00.000Z" } }; }
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
  const acks = Object.fromEntries(ACKNOWLEDGMENT_KEYS.map((k)=>[k,true]));
  const audit = { records: ACKNOWLEDGMENT_KEYS.map((k)=>({ ack_key:k, ack_text_version_id:"v1", confirmed:true, confirmed_at:"x", confirmed_by_user_id:"u", confirmed_by_role:"student", intake_id:"i1", form_version:form, schema_version:INTAKE_V2_SCHEMA_VERSION, capture_mode:"student_reported" })) };
  return { intake_id:"i1", student_user_id:"s1", status:"completed", snapshot_version:1, completed_at:"2026-11-05T00:00:00.000Z", form_version:form, schema_version:INTAKE_V2_SCHEMA_VERSION, student_sections_json: baseSections(sectionOverrides) as any, system_flags_json:[], provenance_json:{}, acknowledgments_json: acks as any, ack_audit_json: audit as any, ...extra };
}

function assertNoForbiddenOutput(obj: unknown) {
  const forbiddenKeys = new Set(["live_trading_approved","approved_for_live_trading","recommended_account_size","recommended_deposit","recommended_funding_amount","risk_per_trade","risk_percentage","daily_loss_limit","lot_size_recommendation","position_size_recommendation","leverage_recommendation","profit_target","expected_return","required_return","income_projection","monthly_profit_projection","required_win_rate","account_growth_target","risk_score","readiness_score","trader_score","financial_score","behavior_score"]);
  const forbiddenValues = new Set(["APPROVED_FOR_LIVE_TRADING","READY_FOR_LIVE_TRADING","CLEARED_FOR_LIVE_TRADING","SAFE_TO_FUND","SAFE_TO_TRADE"]);
  function walk(v: unknown, path: string) {
    if (v == null) return;
    if (Array.isArray(v)) { v.forEach((x,i)=>walk(x,`${path}[${i}]`)); return; }
    if (typeof v === "object") {
      for (const [k,val] of Object.entries(v as any)) {
        if (forbiddenKeys.has(k)) throw new Error(`forbidden key ${path}.${k}`);
        if ((k === "result" || k.endsWith("_result")) && typeof val === "string" && forbiddenValues.has(val)) throw new Error(`forbidden approval ${val}`);
        if (typeof val === "string" && /approved for live trading|safe to fund|profit target|expected return|lot size recommendation|position size recommendation|leverage recommendation|risk per trade/i.test(val)) throw new Error(`forbidden phrase in ${path}.${k}`);
        walk(val, `${path}.${k}`);
      }
      return;
    }
    if (typeof v === "string" && forbiddenValues.has(v)) throw new Error(`forbidden value ${v}`);
  }
  walk(obj, "root");
}

describe("PE-2 pure plan composer (in-memory draft)", () => {
  it("1. complete Phase 3F intake composes full draft", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f"), CTX);
    assert.equal(draft.engine_version, "plan_engine_v1");
    assert.equal(draft.generated_at, CTX.generated_at);
    assert.ok(draft.dimensions.financial_capacity_capital_safety);
    assert.ok(draft.dimensions.behavioral_readiness_process_discipline);
    assert.ok(draft.dimensions.knowledge_skill_readiness);
    assert.ok(draft.recommendations.priority_capabilities.value.includes("CAP_RISK_MANAGEMENT_CONCEPTS"));
    assert.equal(draft.recommendations.demo_first_advisory.origin, "ENGINE_DERIVED");
    assert.equal(draft.instructor_review_status, "INSTRUCTOR_REVIEW_REQUIRED");
    assertNoForbiddenOutput(draft);
  });
  it("2. Phase 3E grandfathered intake produces safe partial draft", () => {
    const inp = input("hft_intake_v2_form.2026-11-05_phase3e"); delete (inp.student_sections_json as any).situationalLossResponse;
    const draft = composePlanEngineV1Draft(inp, CTX);
    assert.ok(draft.missing_information.some(m=>m.reason==="NOT_COLLECTED_FOR_VERSION" || draft.dimensions.behavioral_readiness_process_discipline.status==="NOT_COLLECTED_FOR_VERSION" || draft.explanations.derived_features.behavioral_discipline_support_band_v1.status==="NOT_COLLECTED_FOR_VERSION"));
    assertNoForbiddenOutput(draft);
  });
  it("3. Phase 3D grandfathered intake produces safe partial draft", () => {
    const inp = input("hft_intake_v2_form.2026-11-05_phase3d"); delete (inp.student_sections_json as any).liveTradingFundingStatus; delete (inp.student_sections_json as any).situationalLossResponse;
    const draft = composePlanEngineV1Draft(inp, CTX);
    assert.equal(draft.explanations.derived_features.funding_source_safety_review_v1.status, "NOT_COLLECTED_FOR_VERSION");
    assertNoForbiddenOutput(draft);
  });
  it("4. unknown/custom version fails safe", () => {
    const draft = composePlanEngineV1Draft(input("custom_unknown"), CTX);
    assert.notEqual(draft.explanations.derived_features.behavioral_discipline_support_band_v1.status, "KNOWN");
    assertNoForbiddenOutput(draft);
  });
  it("5. PNTS-heavy draft remains non-punitive", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f", { monthlyTakeHomeRange: fv("Prefer not to say"), savingsEmergencyRanges: fv({ savings:"Prefer not to say", emergencyFund:"Prefer not to say" }), unexpectedExpenseAbility: fv("Prefer not to say"), availableTradingCapitalRange: fv("Prefer not to say"), affordableLossRange: fv("Prefer not to say"), pressureToMakeMoneyQuickly: fv("Prefer not to say"), unplannedTradeFrequency: fv("Prefer not to answer") }), CTX);
    assert.notEqual(draft.dimensions.financial_capacity_capital_safety.headline_result, "CASH_FLOW_PRESSURE_REVIEW");
    assertNoForbiddenOutput(draft);
  });
  it("6. beginner produces foundations/demo educational plan", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f"), CTX);
    assert.ok(["FOUNDATIONS","RISK_AND_PROCESS_FOUNDATIONS"].includes(draft.recommendations.recommended_starting_level.value as string));
    assert.ok(draft.recommendations.practice_plan.value.some(x=>/demo|paper|onboarding|foundational/i.test(x)));
  });
  it("7. financially constrained experienced student keeps dimensions separate", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f", { monthlyTakeHomeRange: fv("Under $1,000"), incomeConsistencyPay: fv({ consistency:"Very inconsistent / unpredictable", payFrequency:"Irregular / varies" }), remainingDiscretionaryCashFlowRange: fv("$0"), cashFlowVariabilityConfidence: fv("Very unpredictable"), savingsEmergencyRanges: fv({ savings:"$0", emergencyFund:"$0" }), unexpectedExpenseAbility: fv("I would likely not be able to cover it right now"), marketsExperience: fv(["Forex"]), demoLiveExperience: fv({ demo:"Yes", live:"Yes" }), knowledgeMatrix: fv(Object.fromEntries(["buy_sell_direction","stop_loss","take_profit","lot_size","pips","leverage","spread_fees","candlesticks","support_resistance","trend","market_structure_basics","risk_management","position_sizing"].map(k=>[k,"Confident"]))) }), CTX);
    assert.equal(draft.dimensions.financial_capacity_capital_safety.derived_feature_ids.includes("financial_stability_band_v1"), true);
    assert.equal(draft.dimensions.knowledge_skill_readiness.derived_feature_ids.includes("curriculum_starting_level_v1"), true);
    assert.notEqual(draft.dimensions.knowledge_skill_readiness.headline_result, draft.dimensions.financial_capacity_capital_safety.headline_result);
    assertNoForbiddenOutput(draft);
  });
  it("8. strong knowledge + behavioral support need remain separated", () => {
    const km = Object.fromEntries(["buy_sell_direction","stop_loss","take_profit","lot_size","pips","leverage","spread_fees","candlesticks","support_resistance","trend","market_structure_basics","risk_management","position_sizing"].map(k=>[k,"Confident"]));
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f", { knowledgeMatrix: fv(km), unplannedTradeFrequency: fv("Often"), plannedLossLimitStopAdherence: fv("Unlikely"), protectiveExitBehavior: fv("I sometimes remove it"), journalReviewPractice: fv("I do not currently journal/review and I prefer not to use it") }), CTX);
    assert.ok(draft.dimensions.behavioral_readiness_process_discipline.instructor_review_required);
    assert.notEqual(draft.dimensions.knowledge_skill_readiness.headline_result, "HIGH_STRUCTURE_AND_REVIEW_SUPPORT");
  });
  it("9. instructor assessment values retain instructor ownership", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f", {}, { instructor_assessment_json: { recommendedStartingLevel: { value: "Foundations" }, recommendedAcademyTrack: { value: "Core Track" } } as any }), CTX);
    assert.equal(draft.recommendations.recommended_starting_level.origin, "INSTRUCTOR_SET");
    assert.equal(draft.recommendations.recommended_education_track.origin, "INSTRUCTOR_SET");
  });
  it("10. missing instructor assessment does not invent instructor values", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f", {}, { instructor_assessment_json: null }), CTX);
    assert.equal(draft.recommendations.recommended_starting_level.origin, "ENGINE_DERIVED");
  });
  it("11. instructorPrivateNotes never appear in serialized output", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f", {}, { instructor_assessment_json: { recommendedStartingLevel: { value: "Foundations" }, instructorPrivateNotes: { value: "SECRET_PRIVATE_NOTE" } } as any }), CTX);
    assert.equal(JSON.stringify(draft).includes("SECRET_PRIVATE_NOTE"), false);
    assert.equal(draft.provenance_summary.instructor_source_fields.includes("instructorPrivateNotes"), false);
  });
  it("12. capital-safety conflict creates instructor review item", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f", { tradingCapitalSeparation: fv("Yes, fully separate"), lossOfTradingCapitalImpact: fv(["Groceries/basic living","Ability to pay bills"]) }), CTX);
    assert.ok(draft.instructor_review_items.some(i=>/capital|separation/i.test(i.summary) || /CAPITAL_SEPARATION/.test(i.source)));
  });
  it("13. dependency review creates appropriate review item", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f", { tradingProfitsForEssentialExpensesExpectation: fv("Yes, expected to cover major essential expenses"), pressureToMakeMoneyQuickly: fv("High urgency") }), CTX);
    assert.ok(draft.instructor_review_items.some(i=>/dependency|essential/i.test(i.summary)));
  });
  it("14. journaling beginner state creates educational support, not negative label", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f", { journalReviewPractice: fv("I do not know how to journal/review trades effectively") }), CTX);
    assert.ok(draft.recommendations.journal_plan.value.some(x=>/teach|simple|template|process/i.test(x)));
    assert.equal(draft.recommendations.journal_plan.value.some(x=>/bad|irresponsible|high risk/i.test(x)), false);
  });
  it("15. schedule-limited student gets slower/limited educational cadence", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f", { weeklyHoursRange: fv("<2 hours"), windowsAndConsistency: fv({ preferredWindows:["Weekday evenings"], consistencyExpectation:"Hard to predict week to week" }) }), CTX);
    assert.ok(/limited|flexible|realistic|slower|minimum/i.test(draft.schedule_summary.advisory_cadence));
  });
  it("16. no generic risk/readiness score exists", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f"), CTX);
    const text = JSON.stringify(draft);
    for (const bad of ["risk_score","readiness_score","trader_score","financial_score","behavior_score"]) assert.equal(text.includes(bad), false);
  });
  it("17. no raw input mutation", () => {
    const inp = input("hft_intake_v2_form.2026-11-05_phase3f");
    const before = JSON.stringify(inp.student_sections_json);
    composePlanEngineV1Draft(inp, CTX);
    assert.equal(JSON.stringify(inp.student_sections_json), before);
  });
  it("18. deterministic output with injected generated_at/computed_at", () => {
    const inp = input("hft_intake_v2_form.2026-11-05_phase3f");
    assert.deepEqual(composePlanEngineV1Draft(inp, CTX), composePlanEngineV1Draft(inp, CTX));
  });
  it("19. acknowledgment context correct", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f"), CTX);
    assert.equal(draft.acknowledgment_context.all_required_confirmed, true);
    assert.equal(draft.acknowledgment_context.audit_confidence, "COMPLETE");
    assert.ok(/not proof of trading readiness/i.test(draft.acknowledgment_context.note));
  });
  it("20. forbidden-output recursive guard", () => {
    assertNoForbiddenOutput(composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f"), CTX));
  });
  it("21. no active flag mutation", () => {
    const flags = [{ rule_id:"RISK_DEMO_FIRST_V1", flag_name:"Demo-first recommendation", source_fields:["affordableLossRange"], triggering_values:[{field:"affordableLossRange",value:"$0"}], explanation:"x", suggested_instructor_action:"y", severity:"high" as const }];
    const inp = input("hft_intake_v2_form.2026-11-05_phase3f", {}, { system_flags_json: flags as any });
    const before = JSON.stringify(inp.system_flags_json);
    composePlanEngineV1Draft(inp, CTX);
    assert.equal(JSON.stringify(inp.system_flags_json), before);
  });
  it("22. no persistence/service/API/UI behavior (pure composition only)", () => {
    const draft = composePlanEngineV1Draft(input("hft_intake_v2_form.2026-11-05_phase3f"), CTX);
    assert.equal((draft as any).id, undefined);
    assert.equal((draft as any).persisted_at, undefined);
    assert.equal((draft as any).published_at, undefined);
    assert.ok(["DRAFT_GENERATED","INSTRUCTOR_REVIEW_REQUIRED"].includes(draft.draft_status));
  });
});
