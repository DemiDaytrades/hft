/** PE-1 deterministic derived-feature functions (pure). No DB/persistence/side effects. */
import type { InstructorAssessmentV2 } from "../contracts";
import type {
  BehavioralDisciplineSupportBandResult,
  CapitalSafetyReviewResult,
  CurriculumStartingLevelResult,
  DemoFirstReadinessAdvisoryResult,
  DerivedFeatureCommonEnvelope,
  EmergencyResilienceBandResult,
  FinancialStabilityBandResult,
  FundingSourceSafetyReviewResult,
  InstructorReviewPriorityResult,
  PlanEngineContext,
  PlanEngineInput,
  ScheduleRealismBandResult,
  TradingProfitDependencyReviewResult,
} from "./contracts";
import { detectConflicts } from "./conflicts";
import {
  FH_AFFORDABLE_LOSS_ZERO_VALUES,
  FH_AVAILABLE_CAPITAL_ZERO_VALUES,
  FH_EMERGENCY_FUND_ZERO_VALUES,
  FH_PRESSURE_MODERATE_OR_STRONG,
  FH_PRESSURE_STRONG,
  FH_UNEXPECTED_NEEDS_BORROW_OR_CANNOT,
  collectedFor,
  fv,
  isBeginnerNoExperience,
  isMissing,
  isNotSure,
  isPnTS,
  reason,
  snapshotRef,
} from "./normalization";

const SAFETY_FIN = ["Advisory educational output only; not financial, investment, legal, or tax advice.", "Low income, debt, poor credit, dependents, assistance, PNTS, and beginner/no-experience states alone are not risk labels.", "Never increase trading risk to meet an income goal."];
const SAFETY_CAP = [...SAFETY_FIN, "$0 available trading capital and education/demo-only are valid outcomes.", "No automatic live-trading approval, no funding/account-size/risk/leverage/lot/position-size recommendations."];
const SAFETY_BEH = ["Advisory educational/process support only; no diagnosis or punitive labels.", "Beginner/no-experience/no-rules/no-setups and PNTS answers alone are not negative behavioral findings."];
const SAFETY_DEMO = [...SAFETY_CAP, ...SAFETY_BEH, "Instructor review is required before any live-progression consideration. This output never approves live trading."];

function base<T extends string>(input: PlanEngineInput, ctx: PlanEngineContext, derived_id: string, dimension: DerivedFeatureCommonEnvelope<T>["dimension"], result: T, status: DerivedFeatureCommonEnvelope<T>["status"], reasons: DerivedFeatureCommonEnvelope<T>["reasons"], conflicts: DerivedFeatureCommonEnvelope<T>["conflicts"], missing: DerivedFeatureCommonEnvelope<T>["missing_information"], safety: string[], instructor_review_required: boolean): DerivedFeatureCommonEnvelope<T> {
  return { derived_id, version: "v1", dimension, result, status, reasons, conflicts, missing_information: missing, safety_notes: safety, source_snapshot_reference: ctx.source_snapshot_reference || snapshotRef(input, ctx.computed_at), computed_at: ctx.computed_at, deterministic: true, instructor_review_required: instructor_review_required || status!=="KNOWN" || missing.length>0 };
}

function usable(v: unknown, collected = true): boolean { return collected && !isMissing(v) && !isPnTS(v) && !isNotSure(v); }
function pushMissing(missing: any[], key: string, collected: boolean, v: unknown, impact: string) {
  if (!collected) missing.push({ source_key: key, reason: "NOT_COLLECTED_FOR_VERSION", impact });
  else if (isMissing(v)) missing.push({ source_key: key, reason: "INSUFFICIENT_INFORMATION", impact });
  else if (isPnTS(v)) missing.push({ source_key: key, reason: "PNTS", impact });
  else if (isNotSure(v)) missing.push({ source_key: key, reason: "UNKNOWN", impact });
}

export function deriveFinancialStabilityBand(input: PlanEngineInput, ctx: PlanEngineContext): DerivedFeatureCommonEnvelope<FinancialStabilityBandResult> {
  const s = input.student_sections_json || {}; const prov = input.provenance_json; const mo = collectedFor(input.form_version, "MO"); const reasons: any[] = []; const missing: any[] = [];
  const keys: Array<[string, boolean, string]> = [["monthlyTakeHomeRange",true,"income context"],["incomeConsistencyPay",true,"income consistency"],["remainingDiscretionaryCashFlowRange",mo,"cash-flow context"],["cashFlowVariabilityConfidence",mo,"variability context"],["monthlyDebtPaymentsRange",true,"debt payment context"]];
  for (const [k,c,impact] of keys) { const v=fv(s,k); reasons.push(reason(input.intake_id,k,"student",v,input.form_version,c,usable(v,c)?"SUPPORTS":"MISSING_INFO",`${impact} (advisory).`,prov)); pushMissing(missing,k,c,v,impact); }
  const consistency = (fv<any>(s,"incomeConsistencyPay")?.consistency) as string | undefined;
  const variability = fv<string>(s,"cashFlowVariabilityConfidence");
  const remaining = fv<string>(s,"remainingDiscretionaryCashFlowRange");
  let pressure = 0; let stableSignals = 0; let known = 0;
  if (typeof consistency === "string" && usable(consistency)) { known++; if (/very inconsistent|somewhat inconsistent|unpredictable/i.test(consistency)) pressure++; if (/very consistent|mostly consistent/i.test(consistency)) stableSignals++; }
  if (typeof variability === "string" && usable(variability,mo)) { known++; if (/very unpredictable|somewhat unpredictable|changes too much/i.test(variability)) pressure++; if (/very predictable|mostly predictable/i.test(variability)) stableSignals++; }
  if (typeof remaining === "string" && usable(remaining,mo)) { known++; if (remaining === "$0" || remaining === "Under $100") pressure++; if (/^\$1,000|\$500|\$250/.test(remaining)) stableSignals++; }
  if (usable(fv(s,"monthlyTakeHomeRange"))) known++;
  let result: FinancialStabilityBandResult = "INSUFFICIENT_INFORMATION"; let status: any = "INSUFFICIENT_INFORMATION";
  if (known >= 2) { status = "KNOWN"; if (pressure >= 2) result = "CASH_FLOW_PRESSURE_REVIEW"; else if (pressure === 1 || stableSignals === 1) result = "MIXED_VARIABILITY"; else if (stableSignals >= 2) result = "STABLE_ENOUGH_TO_PLAN"; else result = "MIXED_VARIABILITY"; }
  return base(input,ctx,"financial_stability_band_v1","DIM_FINANCIAL_CAPACITY_CAPITAL_SAFETY_V1",result,status,reasons,detectConflicts(input).filter(c=>c.source_keys.some(k=>keys.some(x=>x[0]===k))),missing,SAFETY_FIN,result==="CASH_FLOW_PRESSURE_REVIEW");
}

export function deriveEmergencyResilienceBand(input: PlanEngineInput, ctx: PlanEngineContext): DerivedFeatureCommonEnvelope<EmergencyResilienceBandResult> {
  const s=input.student_sections_json||{}; const prov=input.provenance_json; const reasons:any[]=[]; const missing:any[]=[];
  const savings=fv<any>(s,"savingsEmergencyRanges"); const unexpected=fv<string>(s,"unexpectedExpenseAbility");
  for (const [k,v] of [["savingsEmergencyRanges",savings],["unexpectedExpenseAbility",unexpected]] as any) { reasons.push(reason(input.intake_id,k,"student",v,input.form_version,true,usable(v)?"SUPPORTS":"MISSING_INFO","Resilience context (advisory).",prov)); pushMissing(missing,k,true,v,"resilience"); }
  let fragile=0; let buffer=0; let known=0;
  if (savings && typeof savings==="object") {
    const efv = typeof savings.emergencyFund === "string" ? savings.emergencyFund : undefined;
    if (efv !== undefined && usable(efv)) { known++; if (FH_EMERGENCY_FUND_ZERO_VALUES.has(efv)) fragile++; else buffer++; }
    const svv = typeof savings.savings === "string" ? savings.savings : undefined;
    if (svv !== undefined && usable(svv)) { known++; if (FH_EMERGENCY_FUND_ZERO_VALUES.has(svv)) fragile++; else buffer++; }
  }
  if (usable(unexpected)) { known++; if (FH_UNEXPECTED_NEEDS_BORROW_OR_CANNOT.has(unexpected!)) fragile++; else buffer++; }
  let result: EmergencyResilienceBandResult="INSUFFICIENT_INFORMATION"; let status:any="INSUFFICIENT_INFORMATION";
  if (known>=2) { status="KNOWN"; if (fragile>=2) result="FRAGILE_BUFFER_REVIEW"; else if (fragile===1) result="LIMITED_BUFFER"; else result="BUFFER_PRESENT"; }
  return base(input,ctx,"emergency_resilience_band_v1","DIM_FINANCIAL_CAPACITY_CAPITAL_SAFETY_V1",result,status,reasons,[],missing,SAFETY_FIN,result==="FRAGILE_BUFFER_REVIEW");
}

export function deriveCapitalSafetyReview(input: PlanEngineInput, ctx: PlanEngineContext): DerivedFeatureCommonEnvelope<CapitalSafetyReviewResult> {
  const s=input.student_sections_json||{}; const prov=input.provenance_json; const tc=collectedFor(input.form_version,"TC"); const reasons:any[]=[]; const missing:any[]=[];
  for (const [k,c] of [["availableTradingCapitalRange",true],["affordableLossRange",true],["liveTradingFundingStatus",tc],["tradingCapitalSeparation",tc],["lossOfTradingCapitalImpact",tc]] as [string,boolean][]) { const v=fv(s,k); reasons.push(reason(input.intake_id,k,"student",v,input.form_version,c,usable(v,c)?"SUPPORTS":"MISSING_INFO","Capital safety context (advisory).",prov)); pushMissing(missing,k,c,v,"capital safety"); }
  const avail=fv<string>(s,"availableTradingCapitalRange"); const affordable=fv<string>(s,"affordableLossRange"); const funding=fv<string>(s,"liveTradingFundingStatus"); const sep=fv<string>(s,"tradingCapitalSeparation"); const impact=fv<string[]>(s,"lossOfTradingCapitalImpact");
  const noCapital = FH_AVAILABLE_CAPITAL_ZERO_VALUES.has(String(avail||"")) || FH_AFFORDABLE_LOSS_ZERO_VALUES.has(String(affordable||""));
  const demoOnly = funding==="Demo/paper trading only" || funding==="No money allocated for live trading" || isBeginnerNoExperience(funding);
  const essentialImpact = Array.isArray(impact) && impact.some(v=>["Ability to pay bills","Debt payments","Groceries/basic living","Transportation","Emergency preparedness"].includes(v));
  const separationConcern = sep==="No" || sep==="Partially separate" || essentialImpact;
  let result: CapitalSafetyReviewResult="INSUFFICIENT_INFORMATION"; let status:any="INSUFFICIENT_INFORMATION";
  const knownCount=[avail,affordable,funding,sep].filter(v=>usable(v, tc ? true : !["liveTradingFundingStatus","tradingCapitalSeparation"].includes(String(v)) ) || (v!==undefined && !tc && typeof v==="string")).length;
  if (usable(avail)||usable(affordable)||usable(funding,tc)) {
    status = !tc && isMissing(funding) ? "KNOWN" : "KNOWN";
    if (noCapital || demoOnly) result="EDUCATION_DEMO_ONLY_CONTEXT";
    else if (separationConcern && tc) result="CAPITAL_SEPARATION_REVIEW";
    else if (usable(funding,tc) || usable(avail)) result="LIMITED_DISCRETIONARY_CONTEXT_REVIEW";
  }
  if (!tc && status==="KNOWN" && !noCapital && !demoOnly && !usable(funding,false)) status="KNOWN";
  return base(input,ctx,"capital_safety_review_v1","DIM_FINANCIAL_CAPACITY_CAPITAL_SAFETY_V1",result,status,reasons,detectConflicts(input).filter(c=>c.source_keys.some(k=>["availableTradingCapitalRange","affordableLossRange","liveTradingFundingStatus","tradingCapitalSeparation","lossOfTradingCapitalImpact"].includes(k))),missing,SAFETY_CAP,result!=="EDUCATION_DEMO_ONLY_CONTEXT");
}

export function deriveFundingSourceSafetyReview(input: PlanEngineInput, ctx: PlanEngineContext): DerivedFeatureCommonEnvelope<FundingSourceSafetyReviewResult> {
  const s=input.student_sections_json||{}; const prov=input.provenance_json; const tc=collectedFor(input.form_version,"TC"); const mo=collectedFor(input.form_version,"MO"); const reasons:any[]=[]; const missing:any[]=[];
  for (const [k,c] of [["tradingCapitalSources",tc],["borrowedCreditFundingIntent",tc],["billsMoneyUsedForTradingFrequency",mo]] as [string,boolean][]) { const v=fv(s,k); reasons.push(reason(input.intake_id,k,"student",v,input.form_version,c,usable(v,c)?"SUPPORTS":"MISSING_INFO","Funding/bills-money context (advisory).",prov)); pushMissing(missing,k,c,v,"funding source review"); }
  const sources=fv<string[]>(s,"tradingCapitalSources"); const borrowed=fv<string>(s,"borrowedCreditFundingIntent"); const bills=fv<string>(s,"billsMoneyUsedForTradingFrequency");
  if (sources != null && !Array.isArray(sources)) missing.push({source_key:"tradingCapitalSources",reason:"INSUFFICIENT_INFORMATION",impact:"Expected the approved source selection array."});
  if (!tc) return base(input,ctx,"funding_source_safety_review_v1","DIM_FINANCIAL_CAPACITY_CAPITAL_SAFETY_V1","INSUFFICIENT_INFORMATION","NOT_COLLECTED_FOR_VERSION",reasons,[],missing,SAFETY_CAP,true);
  const essential = Array.isArray(sources) && sources.some(v=>["Emergency savings","Money normally used for bills/living expenses"].includes(v));
  const borrowish = (Array.isArray(sources) && sources.some(v=>["Borrowed money","Credit card / credit line"].includes(v))) || borrowed==="Yes" || borrowed==="Already have";
  const billsRisk = bills==="Often" || bills==="Sometimes";
  let result: FundingSourceSafetyReviewResult="INSUFFICIENT_INFORMATION"; let status:any="INSUFFICIENT_INFORMATION";
  if (usable(sources,tc) || usable(borrowed,tc) || usable(bills,mo) || (Array.isArray(sources)&&sources.includes("Not funded yet"))) {
    status="KNOWN";
    if (essential || bills==="Often") result="ESSENTIAL_OR_EMERGENCY_SOURCE_REVIEW";
    else if (borrowish || billsRisk) result="BORROWED_OR_CREDIT_CONTEXT_REPORTED";
    else if (Array.isArray(sources) && sources.every(v=>typeof v==="string") && usable(sources,tc) && typeof borrowed==="string" && usable(borrowed,tc) && typeof bills==="string" && usable(bills,mo)) result="NO_CONCERNING_SOURCES_REPORTED";
    else status="INSUFFICIENT_INFORMATION";
  }
  return base(input,ctx,"funding_source_safety_review_v1","DIM_FINANCIAL_CAPACITY_CAPITAL_SAFETY_V1",result,status,reasons,[],missing,SAFETY_CAP,result!=="NO_CONCERNING_SOURCES_REPORTED");
}

export function deriveTradingProfitDependencyReview(input: PlanEngineInput, ctx: PlanEngineContext): DerivedFeatureCommonEnvelope<TradingProfitDependencyReviewResult> {
  const s=input.student_sections_json||{}; const prov=input.provenance_json; const tc=collectedFor(input.form_version,"TC"); const mo=collectedFor(input.form_version,"MO"); const reasons:any[]=[]; const missing:any[]=[];
  for (const [k,c] of [["pressureToMakeMoneyQuickly",true],["tradingProfitsForEssentialExpensesExpectation",tc],["billsMoneyUsedForTradingFrequency",mo]] as [string,boolean][]) { const v=fv(s,k); reasons.push(reason(input.intake_id,k,"student",v,input.form_version,c,usable(v,c)?"SUPPORTS":"MISSING_INFO","Dependency/expectation context (advisory). Aspirations are not promises.",prov)); pushMissing(missing,k,c,v,"dependency review"); }
  const pressure=fv<string>(s,"pressureToMakeMoneyQuickly"); const expects=fv<string>(s,"tradingProfitsForEssentialExpensesExpectation"); const bills=fv<string>(s,"billsMoneyUsedForTradingFrequency");
  let score=0; let known=0;
  if (usable(pressure)) { known++; if (FH_PRESSURE_STRONG.has(pressure!)) score+=2; else if (FH_PRESSURE_MODERATE_OR_STRONG.has(pressure!)) score+=1; }
  if (usable(expects,tc)) { known++; if (/major essential expenses|for some expenses/i.test(expects!)) score+=2; else if (/occasionally/i.test(expects!)) score+=1; }
  if (usable(bills,mo)) { known++; if (bills==="Often") score+=2; else if (bills==="Sometimes") score+=1; }
  let result: TradingProfitDependencyReviewResult="INSUFFICIENT_INFORMATION"; let status:any="INSUFFICIENT_INFORMATION";
  if (known>=1) { status="KNOWN"; if (score>=3) result="DEPENDENCY_REVIEW"; else if (score>=1) result="MIXED_OR_UNCLEAR"; else if (usable(pressure) && usable(expects,tc) && usable(bills,mo)) result="NO_DEPENDENCY_REPORTED"; else status="INSUFFICIENT_INFORMATION"; }
  return base(input,ctx,"trading_profit_dependency_review_v1","DIM_FINANCIAL_CAPACITY_CAPITAL_SAFETY_V1",result,status,reasons,[],missing,[...SAFETY_CAP,"Trading income/returns are not promised, forecast, or required."],result!=="NO_DEPENDENCY_REPORTED");
}

export function deriveBehavioralDisciplineSupportBand(input: PlanEngineInput, ctx: PlanEngineContext): DerivedFeatureCommonEnvelope<BehavioralDisciplineSupportBandResult> {
  const s=input.student_sections_json||{}; const prov=input.provenance_json; const pf=collectedFor(input.form_version,"PF"); const reasons:any[]=[]; const missing:any[]=[];
  for (const [k,c] of [["unplannedTradeFrequency",pf],["plannedLossLimitStopAdherence",pf],["journalReviewPractice",pf],["protectiveExitBehavior",pf],["willingRiskLimits",true]] as [string,boolean][]) { const v=fv(s,k); reasons.push(reason(input.intake_id,k,"student",v,input.form_version,c,usable(v,c)?"SUPPORTS":"MISSING_INFO","Behavior/process support context (advisory).",prov)); pushMissing(missing,k,c,v,"behavioral support"); }
  const unplanned=fv<string>(s,"unplannedTradeFrequency"); const lossLimit=fv<string>(s,"plannedLossLimitStopAdherence"); const journal=fv<string>(s,"journalReviewPractice"); const protective=fv<string>(s,"protectiveExitBehavior");
  let support=0; let known=0;
  if (pf && usable(unplanned,true)) { known++; if (unplanned==="Often"||unplanned==="Sometimes") support+=2; else if (unplanned==="Rarely") support+=1; }
  if (pf && usable(lossLimit,true)) { known++; if (lossLimit==="Unlikely"||lossLimit==="Very unlikely"||lossLimit==="Unsure") support+=1; }
  if (pf && usable(journal,true)) { known++; if (/do not currently journal\/review/i.test(journal!) && !/willing to start/i.test(journal!)) support+=1; if (/willing to start|do not know how/i.test(journal!)) support+=1; }
  if (pf && usable(protective,true)) { known++; if (/move it farther|remove it|add to a losing position/i.test(protective!)) support+=1; }
  if (usable(fv(s,"willingRiskLimits"))) { known++; const w=fv<string>(s,"willingRiskLimits"); if (w==="No"||w==="Maybe/depends") support+=1; }
  let result: BehavioralDisciplineSupportBandResult="INSUFFICIENT_INFORMATION"; let status:any="INSUFFICIENT_INFORMATION";
  if (!pf) {
    status = "NOT_COLLECTED_FOR_VERSION";
  } else if (known>=2) {
    status="KNOWN";
    if (support>=4) result="HIGH_STRUCTURE_AND_REVIEW_SUPPORT"; else if (support>=2) result="MODERATE_STRUCTURE_SUPPORT"; else result="FOUNDATION_SUPPORT";
  }
  return base(input,ctx,"behavioral_discipline_support_band_v1","DIM_BEHAVIORAL_READINESS_PROCESS_DISCIPLINE_V1",result,status,reasons,pf?detectConflicts(input).filter(c=>c.source_keys.some(k=>["unplannedTradeFrequency","plannedLossLimitStopAdherence","journalReviewPractice","protectiveExitBehavior","willingRiskLimits","behaviorMatrix"].includes(k))):[],missing,SAFETY_BEH,result!=="FOUNDATION_SUPPORT" && status==="KNOWN");
}

export function deriveDemoFirstReadinessAdvisory(input: PlanEngineInput, ctx: PlanEngineContext): DerivedFeatureCommonEnvelope<DemoFirstReadinessAdvisoryResult> {
  const s=input.student_sections_json||{}; const fin=deriveFinancialStabilityBand(input,ctx); const res=deriveEmergencyResilienceBand(input,ctx); const cap=deriveCapitalSafetyReview(input,ctx); const fund=deriveFundingSourceSafetyReview(input,ctx); const dep=deriveTradingProfitDependencyReview(input,ctx); const beh=deriveBehavioralDisciplineSupportBand(input,ctx);
  const reasons:any[]=[
    reason(input.intake_id,"availableTradingCapitalRange","student",fv(s,"availableTradingCapitalRange"),input.form_version,true,"SUPPORTS","Capital context (advisory).",input.provenance_json),
    reason(input.intake_id,"affordableLossRange","student",fv(s,"affordableLossRange"),input.form_version,true,"SUPPORTS","Affordable-loss context (advisory).",input.provenance_json),
    reason(input.intake_id,"pressureToMakeMoneyQuickly","student",fv(s,"pressureToMakeMoneyQuickly"),input.form_version,true,"SUPPORTS","Financial urgency context (advisory).",input.provenance_json),
  ];
  const conflicts=[...cap.conflicts,...beh.conflicts,...detectConflicts(input).filter(c=>c.source_keys.some(k=>["tradingProfitsForEssentialExpensesExpectation","willingToPauseLiveTradingAndReturnToDemo","liveTradingReadinessSelfAssessment","tradingCapitalSources","borrowedCreditFundingIntent"].includes(k)))].filter((c,i,a)=>a.findIndex(x=>x.conflict_id===c.conflict_id)===i);
  const capConcern = /SEPARATION_REVIEW|ESSENTIAL/.test(cap.result);
  const fundConcern = /ESSENTIAL_OR_EMERGENCY_SOURCE_REVIEW|BORROWED_OR_CREDIT_CONTEXT_REPORTED/.test(fund.result);
  const depConcern = /DEPENDENCY_REVIEW/.test(dep.result);
  const concern = capConcern || fundConcern || depConcern || fin.result==="CASH_FLOW_PRESSURE_REVIEW" || res.result==="FRAGILE_BUFFER_REVIEW" || beh.result==="HIGH_STRUCTURE_AND_REVIEW_SUPPORT" || conflicts.length>0;
  const knownEnough = [cap,beh].some(f=>f.status==="KNOWN") || usable(fv(s,"availableTradingCapitalRange")) || usable(fv(s,"affordableLossRange"));
  let result: DemoFirstReadinessAdvisoryResult = knownEnough ? (concern ? "INSTRUCTOR_REVIEW_BEFORE_PROGRESSION_CONSIDERATION" : "EDUCATION_DEMO_FIRST_SUPPORTED") : "INSUFFICIENT_INFORMATION";
  if (!knownEnough) result="INSUFFICIENT_INFORMATION";
  // Always advisory; never approved. Always require instructor review for progression-relevant output.
  return base(input,ctx,"demo_first_readiness_advisory_v1","DIM_BEHAVIORAL_READINESS_PROCESS_DISCIPLINE_V1",result,knownEnough?"KNOWN":"INSUFFICIENT_INFORMATION",reasons,conflicts,[],SAFETY_DEMO,true);
}

export function deriveScheduleRealismBand(input: PlanEngineInput, ctx: PlanEngineContext): DerivedFeatureCommonEnvelope<ScheduleRealismBandResult> {
  const s=input.student_sections_json||{}; const prov=input.provenance_json; const reasons:any[]=[]; const missing:any[]=[];
  for (const k of ["weeklyHoursRange","windowsAndConsistency","weeklyAvailability"]) { const v=fv(s,k); reasons.push(reason(input.intake_id,k,"student",v,input.form_version,true,usable(v)?"SUPPORTS":"MISSING_INFO","Schedule realism context (advisory).",prov)); pushMissing(missing,k,true,v,"schedule"); }
  const hours=fv<string>(s,"weeklyHoursRange"); const wc=fv<any>(s,"windowsAndConsistency"); const consistency=wc?.consistencyExpectation as string|undefined;
  let review=0; let known=0;
  if (usable(hours)) { known++; if (hours==="<2 hours" || hours==="2–4 hours") review++; }
  if (usable(consistency)) { known++; if (/hard to predict/i.test(consistency!)) review+=2; else if (/somewhat inconsistent/i.test(consistency!)) review++; }
  let result: ScheduleRealismBandResult="INSUFFICIENT_INFORMATION"; let status:any="INSUFFICIENT_INFORMATION";
  if (known>=1) { status="KNOWN"; if (review>=2) result="CONSISTENCY_REVIEW"; else if (review===1) result="LIMITED_TIME_MINIMUM_PLAN"; else result="REALISTIC_STEADY_PACE"; }
  return base(input,ctx,"schedule_realism_band_v1","DIM_FINANCIAL_CAPACITY_CAPITAL_SAFETY_V1",result,status,reasons,[],missing,["Advisory schedule realism only; adapt pace downward, never increase risk."],result!=="REALISTIC_STEADY_PACE");
}

export function deriveCurriculumStartingLevel(input: PlanEngineInput, ctx: PlanEngineContext): DerivedFeatureCommonEnvelope<CurriculumStartingLevelResult> {
  const s=input.student_sections_json||{}; const ia=(input.instructor_assessment_json||{}) as Partial<InstructorAssessmentV2>|any; const prov=input.provenance_json; const reasons:any[]=[]; const missing:any[]=[];
  const instLevel = ia?.recommendedStartingLevel?.value || ia?.recommendedStartingLevel || ia?.assessedExperienceLevel?.value || ia?.assessedExperienceLevel;
  if (usable(instLevel)) {
    reasons.push(reason(input.intake_id,"instructor_assessment.recommendedStartingLevel","instructor",instLevel,input.form_version,true,"SUPPORTS","Instructor assessment is authoritative for educational sequencing when provided.",prov));
    return base(input,ctx,"curriculum_starting_level_v1","DIM_KNOWLEDGE_SKILL_READINESS_V1","INSTRUCTOR_DEFINED","KNOWN",reasons,[],missing,["Educational sequencing suggestion; instructor confirms. No Academy module IDs invented."],true);
  }
  for (const k of ["knowledgeMatrix","marketsExperience","demoLiveExperience"]) { const v=fv(s,k); reasons.push(reason(input.intake_id,k,"student",v,input.form_version,true,usable(v)?"SUPPORTS":"MISSING_INFO","Knowledge/experience context (self-reported).",prov)); pushMissing(missing,k,true,v,"curriculum"); }
  const km=fv<Record<string,string>>(s,"knowledgeMatrix"); const markets=fv<string[]>(s,"marketsExperience"); const demo=fv<any>(s,"demoLiveExperience");
  const beginner = Array.isArray(markets) && markets.includes("None yet");
  const live = demo && typeof demo.live==="string" && demo.live!=="No" && !isPnTS(demo.live);
  const lowKnowledge = km && typeof km==="object" ? Object.values(km).filter(v=>/not familiar|heard of it|beginner|little/i.test(String(v))).length>=8 : true;
  let result: CurriculumStartingLevelResult="INSUFFICIENT_INFORMATION"; let status:any="INSUFFICIENT_INFORMATION";
  if (km || markets || demo) { status="KNOWN"; if (beginner && lowKnowledge) result="FOUNDATIONS"; else if (!lowKnowledge && !live) result="PLATFORM_AND_DEMO_PRACTICE"; else if (!lowKnowledge && live) result="GUIDED_REVIEW_PATH"; else result="RISK_AND_PROCESS_FOUNDATIONS"; }
  return base(input,ctx,"curriculum_starting_level_v1","DIM_KNOWLEDGE_SKILL_READINESS_V1",result,status,reasons,[],missing,["Educational sequencing suggestion only; instructor confirms. No Academy module IDs invented."],true);
}

export function deriveInstructorReviewPriority(input: PlanEngineInput, ctx: PlanEngineContext): DerivedFeatureCommonEnvelope<InstructorReviewPriorityResult> {
  const cap=deriveCapitalSafetyReview(input,ctx); const dep=deriveTradingProfitDependencyReview(input,ctx); const fund=deriveFundingSourceSafetyReview(input,ctx); const beh=deriveBehavioralDisciplineSupportBand(input,ctx); const demo=deriveDemoFirstReadinessAdvisory(input,ctx);
  const flags = Array.isArray(input.system_flags_json) ? input.system_flags_json : [];
  const conflicts = demo.conflicts.length;
  let score=0;
  if (flags.some(f=>f.severity==="high")) score+=2; else if (flags.length) score+=1;
  if (cap.result==="CAPITAL_SEPARATION_REVIEW" || fund.result==="ESSENTIAL_OR_EMERGENCY_SOURCE_REVIEW" || dep.result==="DEPENDENCY_REVIEW") score+=2;
  if (beh.result==="HIGH_STRUCTURE_AND_REVIEW_SUPPORT" || demo.result==="INSTRUCTOR_REVIEW_BEFORE_PROGRESSION_CONSIDERATION") score+=1;
  if (conflicts>0) score+=1;
  let result: InstructorReviewPriorityResult = score>=3 ? "HIGH_ATTENTION_REVIEW" : score>=1 ? "REVIEW_RECOMMENDED" : "ROUTINE";
  const reasons=[{source_key:"system_flags_json",source_owner:"system" as const,source_value_category:flags.length?"EXACT_CATEGORY":"MISSING" as const,contribution:"CONTEXT" as const,note:`Existing explainable flags (read-only): ${flags.length}.`},{source_key:"demo_first_readiness_advisory_v1",source_owner:"system" as const,source_value_category:"EXACT_CATEGORY" as const,contribution:"SUPPORTS" as const,note:`Demo-first advisory: ${demo.result}.`}];
    const reasonList = [
    {source_key:"system_flags_json",source_owner:"system" as const,source_value_category:(flags.length?"EXACT_CATEGORY":"MISSING") as "EXACT_CATEGORY"|"MISSING",contribution:"CONTEXT" as const,note:`Existing explainable flags (read-only): ${flags.length}.`},
    {source_key:"demo_first_readiness_advisory_v1",source_owner:"system" as const,source_value_category:"EXACT_CATEGORY" as const,contribution:"SUPPORTS" as const,note:`Demo-first advisory: ${demo.result}.`},
  ];
  return base(input,ctx,"instructor_review_priority_v1","DIM_FINANCIAL_CAPACITY_CAPITAL_SAFETY_V1",result,"KNOWN",reasonList,demo.conflicts,[],["Review priority is supportive, not punitive. No active flags added/changed."],result!=="ROUTINE");
}
