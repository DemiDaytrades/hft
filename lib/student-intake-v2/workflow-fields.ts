import { BEHAVIOR_MATRIX_DIMENSIONS, KNOWLEDGE_MATRIX_TOPICS, INTAKE_V2_INSTRUCTOR_KEYS } from './contracts';

// Control metadata follows existing contract keys/shapes. These are staff capture
// labels, not replacement question wording or a second questionnaire contract.
export type CaptureField = { key: string; label: string; kind: 'text'|'list'|'object'|'schedule'; parts?: readonly string[]; lists?: readonly string[] };
const label = (key:string) => key.replace(/([a-z])([A-Z])/g,'$1 $2').replaceAll('_',' ').replace(/^./,c=>c.toUpperCase());
const text=(...keys:string[]):CaptureField[]=>keys.map(key=>({key,label:label(key),kind:'text'}));
const list=(...keys:string[]):CaptureField[]=>keys.map(key=>({key,label:label(key),kind:'list'}));
const object=(key:string,parts:readonly string[],lists:readonly string[]=[]):CaptureField=>({key,label:label(key),kind:'object',parts,lists});
export const CAPTURE_SECTIONS: {id:string;label:string;fields:CaptureField[]}[] = [
 {id:'about-student',label:'About Student',fields:[...text('preferredName','location','timeZone','occupation','employmentType','workScheduleSummary'),...list('majorResponsibilities'),...text('dependentsRange','majorObligations90d','currentLifeGoal','motivationAndWhyNow','currentObstacle')]},
 {id:'trading-experience',label:'Trading Experience',fields:[...list('marketsExperience'),object('demoLiveExperience',['demo','live']),...text('liveAccountSizeRange'),object('knowledgeMatrix',KNOWLEDGE_MATRIX_TOPICS),object('platformsBrokerExperience',['platforms','brokerExperience','brokerNames'],['platforms']),object('priorEducation',['type','notes']),object('majorNegativeExperience',['type','reflection']),...text('biggestTradingConfusion','resultsDrivers','lossCauseBelief')]},
 {id:'risk-profile',label:'Risk Profile',fields:[object('behaviorMatrix',BEHAVIOR_MATRIX_DIMENSIONS),...list('behaviorTendencies'),...text('reactionToLoss','reactionToWin','willingDemoFirst','willingRiskLimits','disciplineBreakers','selfStrength')]},
 {id:'income-goal',label:'Goals',fields:[...text('goalImmediate'),object('goals30_60_90',['goal30','goal60','goal90']),object('goals6_12',['goal6','goal12']),...text('goalBig','goalWhy','successDefinition','desiredTradingIncomeRange','membershipValue','disengageRisk')]},
 {id:'learning-support',label:'Learning & Support',fields:[...list('learningStyles'),object('paceAndQuestionComfort',['pace','questionComfort']),...list('homeworkPreference'),object('accountabilityFeedback',['accountability','feedbackFrequency']),...text('overwhelmTriggers','whatHelpsClick','chartFeedbackHelpful')]},
 {id:'schedule-tech',label:'Schedule & Technology',fields:[{key:'weeklyAvailability',label:'Weekly availability',kind:'schedule'} as CaptureField,...list('unavailableDays'),...text('weeklyHoursRange'),object('windowsAndConsistency',['preferredWindows','consistencyExpectation'],['preferredWindows']),...text('scheduleObligationsNote'),object('devicesInternet',['devices','internetReliability'],['devices']),object('platformAccess',['tradingView','mt5','demoAccount','liveAccount']),object('supportTechReadiness',['canScreenShare','softwareComfort']),...text('techLimitations')]},
];
export const INSTRUCTOR_CAPTURE_FIELDS:CaptureField[]=INTAKE_V2_INSTRUCTOR_KEYS.map(key=>({key,label:label(key),kind:key==='recommendedModules'?'list':'text'}));
export function wrapCaptureValues(values:Record<string,unknown>){return Object.fromEntries(Object.entries(values).map(([key,value])=>[key,{value}]))}
