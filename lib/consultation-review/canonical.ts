import {NUMBERED_FIELDS,NUMBERED_MAPPING_VERSION,resolveNumberedForm,numberedMapping} from './numbered';
import {LEGACY_FIELD_METADATA} from './legacy-labels';
import { INTAKE_V2_STUDENT_KEYS, type IntakeV2Record, type StudentSectionsV2 } from '../student-intake-v2/contracts';

export type EvidenceKind = 'STUDENT_REPORTED'|'INSTRUCTOR_OBSERVED'|'ASSESSMENT_DEMONSTRATED'|'SYSTEM_DERIVED'|'INSTRUCTOR_OVERRIDE';
export type SourceRef = {kind:'consultation_questionnaire'|'legacy_intake'|'student_intake_v2';id:string;revision:string|number|null;path:string;capturedAt:string|null;historicalFormVersion?:string;mappingVersion?:string;canonicalPath?:string;evidenceKind?:'HISTORICAL_STUDENT_REPORTED'};
export type LegacySource = {kind:'consultation_questionnaire'|'legacy_intake';id:string;revision:string|number|null;capturedAt:string|null;data:Record<string,unknown>;formVersion?:string;completedAt?:string|null};
export type CanonicalFact = {key:string;label:string;value:unknown;kind:EvidenceKind;sources:SourceRef[];categories:string[];reviewReason?:string;historicalClassification?:string};
export const CANONICAL_FIELD_CATEGORIES:Record<string,string[]> = {
  "preferredName": [
    "INFORMATIONAL_ONLY"
  ],
  "location": [
    "INFORMATIONAL_ONLY"
  ],
  "timeZone": [
    "INFORMATIONAL_ONLY"
  ],
  "occupation": [
    "INFORMATIONAL_ONLY"
  ],
  "employmentType": [
    "INFORMATIONAL_ONLY"
  ],
  "workScheduleSummary": [
    "INFORMATIONAL_ONLY"
  ],
  "majorResponsibilities": [
    "INFORMATIONAL_ONLY"
  ],
  "dependentsRange": [
    "INFORMATIONAL_ONLY"
  ],
  "majorObligations90d": [
    "INFORMATIONAL_ONLY"
  ],
  "currentLifeGoal": [
    "INFORMATIONAL_ONLY"
  ],
  "motivationAndWhyNow": [
    "INFORMATIONAL_ONLY"
  ],
  "currentObstacle": [
    "INFORMATIONAL_ONLY"
  ],
  "monthlyTakeHomeRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "additionalIncome": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "incomeConsistencyPay": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "disposableIncomeRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "recurringObligationsRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "variableExpensesRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "upcomingMajorExpenses": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "savingsEmergencyRanges": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "unexpectedExpenseAbility": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "debtStatusTypes": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "totalDebtRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "monthlyDebtPaymentsRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "creditScoreRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "availableTradingCapitalRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "affordableLossRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "pressureToMakeMoneyQuickly": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "desiredAdditionalMonthlyIncomeRange": [
    "FINANCIAL_READINESS_INPUT",
    "INFORMATIONAL_ONLY"
  ],
  "financialReasonForTrading": [
    "FINANCIAL_READINESS_INPUT",
    "INFORMATIONAL_ONLY"
  ],
  "marketsExperience": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "demoLiveExperience": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "liveAccountSizeRange": [
    "INFORMATIONAL_ONLY"
  ],
  "knowledgeMatrix": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "platformsBrokerExperience": [
    "ACADEMY_READINESS",
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "priorEducation": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "majorNegativeExperience": [
    "INFORMATIONAL_ONLY"
  ],
  "biggestTradingConfusion": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "resultsDrivers": [
    "INFORMATIONAL_ONLY"
  ],
  "lossCauseBelief": [
    "INFORMATIONAL_ONLY"
  ],
  "behaviorMatrix": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "behaviorTendencies": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "reactionToLoss": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "reactionToWin": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "willingDemoFirst": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "willingRiskLimits": [
    "FINANCIAL_READINESS_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "disciplineBreakers": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "selfStrength": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "goalImmediate": [
    "FINANCIAL_READINESS_INPUT",
    "INFORMATIONAL_ONLY"
  ],
  "goals30_60_90": [
    "INFORMATIONAL_ONLY"
  ],
  "goals6_12": [
    "INFORMATIONAL_ONLY"
  ],
  "goalBig": [
    "INFORMATIONAL_ONLY"
  ],
  "goalWhy": [
    "INFORMATIONAL_ONLY"
  ],
  "successDefinition": [
    "INFORMATIONAL_ONLY"
  ],
  "desiredTradingIncomeRange": [
    "FINANCIAL_READINESS_INPUT",
    "INFORMATIONAL_ONLY"
  ],
  "membershipValue": [
    "INFORMATIONAL_ONLY"
  ],
  "disengageRisk": [
    "INFORMATIONAL_ONLY"
  ],
  "learningStyles": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "paceAndQuestionComfort": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "homeworkPreference": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "accountabilityFeedback": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "overwhelmTriggers": [
    "INFORMATIONAL_ONLY"
  ],
  "whatHelpsClick": [
    "INFORMATIONAL_ONLY"
  ],
  "chartFeedbackHelpful": [
    "INFORMATIONAL_ONLY"
  ],
  "weeklyAvailability": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "unavailableDays": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "weeklyHoursRange": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "windowsAndConsistency": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "scheduleObligationsNote": [
    "INFORMATIONAL_ONLY"
  ],
  "devicesInternet": [
    "ACADEMY_READINESS",
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "platformAccess": [
    "ACADEMY_READINESS",
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "supportTechReadiness": [
    "ACADEMY_READINESS",
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "techLimitations": [
    "INFORMATIONAL_ONLY"
  ],
  "ackChecklist": [
    "INFORMATIONAL_ONLY"
  ],
  "debtRepaymentConfidence": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "minimumPaymentManageability": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "creditUtilizationAwareness": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "paymentHistoryConsistency": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "debtRelatedStress": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "debtReductionStrategy": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "creditBuildingGoals": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "recentFinancialHardship": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "emergencyBorrowingReliance": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "debtPayoffPriorities": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "creditEducationInterest": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "financialImprovementGoals612": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "householdIncomeSources": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "reliableMonthlyIncomePlanningRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "housingSituationPayment": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "utilitiesHouseholdNecessitiesRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "transportationObligationRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "foodGroceriesRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "insuranceMedicalRecurringRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "dependentSupportObligation": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "subscriptionsDiscretionaryRecurringRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "otherRecurringObligations": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "monthlySavingsContributionRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "remainingDiscretionaryCashFlowRange": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "cashFlowVariabilityConfidence": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "billsMoneyUsedForTradingFrequency": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "liveTradingFundingStatus": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "tradingCapitalSources": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "tradingCapitalSeparation": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "lossOfTradingCapitalImpact": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "tradingCapitalReplacementExpectation": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "tradingCapitalTimeHorizon": [
    "FINANCIAL_READINESS_INPUT",
    "INFORMATIONAL_ONLY"
  ],
  "emergencyFundProtectionIntent": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "borrowedCreditFundingIntent": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "tradingProfitsForEssentialExpensesExpectation": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "liveTradingReadinessSelfAssessment": [
    "FINANCIAL_READINESS_INPUT"
  ],
  "situationalLossResponse": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "situationalWinStreakResponse": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "missedTradeFomoResponse": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "unplannedTradeFrequency": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "plannedLossLimitStopAdherence": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "willingToPauseLiveTradingAndReturnToDemo": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "protectiveExitBehavior": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "noTradeDayAcceptance": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "LEARNING_PATH_INPUT"
  ],
  "journalReviewPractice": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "instructorSummary": [
    "FINANCIAL_READINESS_INPUT",
    "INSTRUCTOR_PRIVATE"
  ],
  "assessedExperienceLevel": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "assessedKnowledgeLevel": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "instructorStrengths": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "instructorWeaknesses": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "behavioralConcerns": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "financialRiskConcerns": [
    "FINANCIAL_READINESS_INPUT",
    "INSTRUCTOR_PRIVATE"
  ],
  "scheduleConcerns": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "learningStyleObservations": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT",
    "SUPPORT_PREFERENCE"
  ],
  "recommendedStartingLevel": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "recommendedAcademyTrack": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "recommendedModules": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "recommendedFirstLesson": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "firstHomework": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "recommendedPracticeFrequency": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "recommendedCoachingFrequency": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ],
  "riskRestrictions": [
    "FINANCIAL_READINESS_INPUT",
    "INSTRUCTOR_PRIVATE"
  ],
  "instructorPrivateNotes": [
    "INSTRUCTOR_PRIVATE"
  ],
  "immediateActionItems": [
    "EDUCATIONAL_PLACEMENT_INPUT",
    "FINANCIAL_READINESS_INPUT",
    "INSTRUCTOR_PRIVATE",
    "LEARNING_PATH_INPUT"
  ]
};

// Deliberately narrative-only aliases and exact historical Yes/No. No inferred
// financial ranges, current access, competency ratings, consent or combined goals.
const NARRATIVE_MAP:Record<string,string> = {
 preferredName:'preferredName',location:'location',timeZone:'timeZone',jobTitle:'occupation',work:'occupation',job:'occupation',workSchedule:'workScheduleSummary',
 workingTowardLife:'currentLifeGoal',decisionNow:'motivationAndWhyNow',confuses:'biggestTradingConfusion',confusingConcepts:'biggestTradingConfusion',reactToLosses:'reactionToLoss',
 smallGoal:'goalImmediate',goalImportance:'goalWhy',goalWhy:'goalWhy',successLooksLike:'successDefinition',successLook:'successDefinition',gtk16:'membershipValue',worth150:'membershipValue',
 overwhelmCauses:'overwhelmTriggers',techLimitations:'techLimitations',commitments:'scheduleObligationsNote',goal30Day:'goals30_60_90.goal30',goal30:'goals30_60_90.goal30',
 goal90Day:'goals30_60_90.goal90',goal90:'goals30_60_90.goal90',goal6Month:'goals6_12.goal6',goal6:'goals6_12.goal6',goal12Month:'goals6_12.goal12',goal12:'goals6_12.goal12',
};
const HISTORICAL_MAP:Record<string,string> = {demoExperience:'demoLiveExperience.demo',demoAccount:'demoLiveExperience.demo',tradedDemo:'demoLiveExperience.demo',liveExperience:'demoLiveExperience.live',realMoney:'demoLiveExperience.live',tradedLive:'demoLiveExperience.live'};
const QUESTIONNAIRE_ALIASES=new Set(['preferredName','location','timeZone','jobTitle','workSchedule','workingTowardLife','decisionNow','reactToLosses','goalImportance','successLooksLike','overwhelmCauses','techLimitations','commitments','goal30Day','goal90Day','goal6Month','goal12Month','demoExperience','liveExperience']);
const INTAKE_ALIASES=new Set(['preferredName','location','timeZone','work','job','confuses','confusingConcepts','smallGoal','goalWhy','successLook','gtk16','worth150','goal30','goal90','goal6','goal12','demoAccount','tradedDemo','realMoney','tradedLive']);
const ARRAY_MAP:Record<string,string>={marketsTraded:"marketsExperience",platformsUsed:"platformsBrokerExperience.platforms",learningPrefs:"learningStyles",devices:"devicesInternet.devices"};
export const CANONICAL_LEGACY_KEYS:readonly string[] = Object.freeze(Object.keys({...NARRATIVE_MAP,...HISTORICAL_MAP,...ARRAY_MAP}));
const EVIDENCE_LABELS:Record<string,string> = {
 mt45:'Reported MT4 or MT5 use (platform unspecified)',mt4Exp:'Reported historical MT4 use',mt5Exp:'Reported historical MT5 use',
 mt5Installed:'MT5 installed (reported)',mt5Installed2:'MT5 installed (reported)',platformsUsed:'Platforms previously used',
 experienceLevel:'Self-reported trading level',expLevel:'Self-reported trading level',tradedBefore:'Has traded before (reported)',
 brokerCurrent:'Reported broker name / choice',brokerName:'Reported broker name',broker:'Reported current broker account',hasBrokerAccount:'Reported broker account status',
 goal612Month:'Original combined 6–12 month vision',financial612:'Original financial 6–12 month vision',
 marketsTraded:'Reported markets traded',tradedMarkets:'Reported markets traded',hoursPerWeek:'Legacy hours (work/study meaning unresolved)',
 monthlyTakeHomeIncome:'Reported exact monthly take-home',monthlyIncome:'Reported exact monthly take-home',
 approximateSavings:'Reported savings',savings:'Reported savings',financialPressures:'Reported financial pressures',
 instructorNotes:'Private historical instructor notes',strengthsIdentified:'Historical instructor strengths observation',areasToFocus:'Historical instructor development observation',
 recommendedStart:'Historical manual placement recommendation',personalizedPlan:'Historical manual training recommendation',actionItems:'Historical instructor action items',
};
const PRIVATE_KEYS = new Set(['instructorNotes','strengthsIdentified','areasToFocus','recommendedStart','personalizedPlan','actionItems']);
const FINANCIAL_KEYS = new Set(['financialGoal','bigGoal','biggestFinancialGoal','monthlyTakeHomeIncome','monthlyIncome','approximateSavings','savings','financialPressures','financial612']);
const present=(value:unknown):boolean=>value!==undefined&&value!==null&&(typeof value!=='string'||value.trim().length>0)&&(!Array.isArray(value)||value.length>0);
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const clone=<T>(v:T):T=>structuredClone(v);
const equal=(a:unknown,b:unknown):boolean=>JSON.stringify(a)===JSON.stringify(b);
const label=(key:string)=>key.replace(/([a-z])([A-Z])/g,'$1 $2').replaceAll('_',' ').replace(/^./,c=>c.toUpperCase());
function kindFor(provenance:unknown):EvidenceKind {const p=object(provenance)?provenance:{};if(['STUDENT_REPORTED','INSTRUCTOR_OBSERVED','ASSESSMENT_DEMONSTRATED','SYSTEM_DERIVED','INSTRUCTOR_OVERRIDE'].includes(String(p.evidenceKind)))return p.evidenceKind as EvidenceKind;return p.source==='system_derived'?'SYSTEM_DERIVED':p.source==='instructor_assessment'?'INSTRUCTOR_OBSERVED':'STUDENT_REPORTED'}
export type CanonicalProjection = {sections:StudentSectionsV2;facts:CanonicalFact[];adoptable:Record<string,{value:unknown}>;sourceRefs:Record<string,SourceRef[]>;conflicts:{key:string;canonical:unknown;reported:unknown;sources:SourceRef[];reason:string}[];unmapped:CanonicalFact[]};
export function projectCanonical(intake:IntakeV2Record|null,sources:LegacySource[]):CanonicalProjection {
 const sections:Record<string,{value:unknown;provenance?:unknown}>={};
 const adoptable:Record<string,{value:unknown}>={};const sourceRefs:Record<string,SourceRef[]>={};
 const conflicts:CanonicalProjection['conflicts']=[];const unmapped:CanonicalFact[]=[];
 const ref=(source:LegacySource,path:string):SourceRef=>({kind:source.kind,id:source.id,revision:source.revision,path,capturedAt:source.capturedAt});
 for(const key of INTAKE_V2_STUDENT_KEYS){
  const wrapped=intake?.student_sections_json?.[key];
  if(!wrapped||!present(wrapped.value))continue;
  sections[key]=clone(wrapped);
  const saved=(intake!.provenance_json as any)?.[key];
  sourceRefs[key]=[...(Array.isArray(saved?.sourceRefs)?saved.sourceRefs:[]),{kind:'student_intake_v2',id:intake!.id,revision:intake!.snapshot_version,path:`student_sections_json.${key}.value`,capturedAt:intake!.updated_at??null}];
 }
 function offer(path:string,value:unknown,source:SourceRef){
  const [key,part]=path.split('.');const current=part?(object(sections[key]?.value)?sections[key].value[part]:undefined):sections[key]?.value;
  // A malformed/non-object canonical value is still canonical and cannot be replaced.
  const blocked=!!part&&present(sections[key]?.value)&&!object(sections[key]?.value);
  if(present(current)||blocked){
   if(!equal(current,value)||blocked)conflicts.push({key:path,canonical:clone(blocked?sections[key].value:current),reported:clone(value),sources:[...(sourceRefs[key]??[]),source],reason:'Existing canonical/earlier reported evidence differs; no overwrite performed.'});
   else sourceRefs[key]=[...(sourceRefs[key]??[]),source];
   return;
  }
  if(part){const base=object(sections[key]?.value)?clone(sections[key].value):{};base[part]=clone(value);sections[key]={...sections[key],value:base};}
  else sections[key]={value:clone(value)};
  sourceRefs[key]=[...(sourceRefs[key]??[]),source];adoptable[key]={value:clone(sections[key].value)};
 }
 for(const source of sources){
  if(!object(source.data))continue;
  const historicalForm=resolveNumberedForm(source);
  for(const [key,value] of Object.entries(source.data)){
   const historicalField=historicalForm?NUMBERED_FIELDS.find(f=>f.key===key):undefined;
   if(historicalField&&present(value)){
    const mapping=numberedMapping(historicalField,value,source);
    const historicalRef={...ref(source,key),historicalFormVersion:key==='whyJoin'?'student_intake_named.worker_v38':historicalForm!,mappingVersion:NUMBERED_MAPPING_VERSION,...(!historicalField.private?{evidenceKind:'HISTORICAL_STUDENT_REPORTED' as const}:{}),...(mapping?{canonicalPath:mapping.path}:{})};
    if(mapping){
     if(mapping.path==='demoLiveExperience'){for(const part of ['demo','live'] as const)offer(`${mapping.path}.${part}`,(mapping.value as {demo:string;live:string})[part],{...historicalRef,canonicalPath:`${mapping.path}.${part}`});}
     else offer(mapping.path,mapping.value,historicalRef);continue;
    }
    unmapped.push({key,label:historicalField.question,value:clone(value),kind:historicalField.private?'INSTRUCTOR_OBSERVED':'STUDENT_REPORTED',sources:[historicalRef],categories:[...historicalField.categories],historicalClassification:historicalField.classification,...(!historicalField.private?{reviewReason:historicalField.rule}: {})});continue;
   }
   const allowed=source.kind==='consultation_questionnaire'?QUESTIONNAIRE_ALIASES:INTAKE_ALIASES;
   const narrative=allowed.has(key)&&Object.hasOwn(NARRATIVE_MAP,key)?NARRATIVE_MAP[key]:undefined;
   const historical=allowed.has(key)&&Object.hasOwn(HISTORICAL_MAP,key)?HISTORICAL_MAP[key]:undefined;
   if(source.kind==='consultation_questionnaire'&&Object.hasOwn(ARRAY_MAP,key)&&Array.isArray(value)&&value.length&&value.every(v=>typeof v==='string'&&v.trim()))offer(ARRAY_MAP[key],value,ref(source,key));
   else if(narrative&&typeof value==='string'&&present(value))offer(narrative,value,ref(source,key));
   else if(historical&&(value==='Yes'||value==='No'))offer(historical,value,ref(source,key));
   else if(present(value)){
    const metadata=LEGACY_FIELD_METADATA[source.kind]?.[key];const privateField=PRIVATE_KEYS.has(key)||metadata?.private||!metadata;
    unmapped.push({key,label:EVIDENCE_LABELS[key]??metadata?.question??label(key)+' (unclassified retained legacy evidence)',value:clone(value),kind:PRIVATE_KEYS.has(key)?'INSTRUCTOR_OBSERVED':privateField?'SYSTEM_DERIVED':'STUDENT_REPORTED',sources:[ref(source,key)],categories:privateField?['INSTRUCTOR_PRIVATE']:FINANCIAL_KEYS.has(key)?['FINANCIAL_READINESS_INPUT']:['INFORMATIONAL_ONLY']});
   }
  }
 }
 const facts:CanonicalFact[]=Object.entries(sections).map(([key,field])=>({key,label:label(key),value:clone(field.value),kind:kindFor((intake?.provenance_json as any)?.[key]??field.provenance),sources:sourceRefs[key]??[],categories:CANONICAL_FIELD_CATEGORIES[key]??['INFORMATIONAL_ONLY']}));
 return {sections:sections as StudentSectionsV2,facts,adoptable,sourceRefs,conflicts,unmapped};
}
