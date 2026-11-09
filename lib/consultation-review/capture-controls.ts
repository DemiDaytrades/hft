import { SECTIONS } from '../../app/(app)/admin/students/[id]/questionnaire/questionnaireFields';
import { FINANCIAL_HEALTH_REGISTRY } from '../student-intake-v2/financial-health-registry';
import { DEBT_CREDIT_REGISTRY } from '../student-intake-v2/debt-credit-registry';
import { MONTHLY_OBLIGATIONS_REGISTRY } from '../student-intake-v2/monthly-obligations-registry';
import { TRADING_CAPITAL_READINESS_REGISTRY } from '../student-intake-v2/trading-capital-readiness-registry';
import { TRADING_BEHAVIOR_REGISTRY } from '../student-intake-v2/trading-behavior-registry';

export type CaptureControl = {kind:'select'|'multiselect'|'narrative'|'list'; options?:readonly string[]; exclusive?:readonly string[]};
// Exact Yes/No is already used by the approved V2 completion fixtures and the
// historical questionnaire. No experience/proficiency/mastery scale is added.
const YES_NO = ['Yes','No'] as const;
const YES_NO_PATHS = new Set(['demoLiveExperience.demo','demoLiveExperience.live','platformsBrokerExperience.brokerExperience','platformAccess.tradingView','platformAccess.mt5','platformAccess.demoAccount','platformAccess.liveAccount']);
// Reuse existing market names. V2's explicit beginner answer is "None yet"
// (phase1.test.ts and every later completion fixture), never an inferred default.
const MARKET_OPTIONS = [...(SECTIONS.flatMap(section=>section.fields).find(field=>field.key==='marketsTraded')?.options??[]),'None yet'];
export function captureControl(path:string,isList=false):CaptureControl {
 if(YES_NO_PATHS.has(path))return {kind:'select',options:YES_NO};
 if(path==='marketsExperience')return {kind:'multiselect',options:MARKET_OPTIONS,exclusive:['None yet']};
 return {kind:isList?'list':'narrative'};
}
export function optionsWithSaved(options:readonly string[],saved:unknown):string[] {
 const existing=Array.isArray(saved)?saved:typeof saved==='string'&&saved!==''?[saved]:[];
 return [...new Set([...options,...existing.filter((value):value is string=>typeof value==='string')])];
}
export function toggleCaptureOption(saved:unknown,option:string,checked:boolean,exclusive:readonly string[]=[]):string[] {
 const values=Array.isArray(saved)?saved.filter((value):value is string=>typeof value==='string'):[];
 if(!checked)return values.filter(value=>value!==option);
 if(exclusive.includes(option))return [option];
 return [...new Set([...values.filter(value=>!exclusive.includes(value)),option])];
}
function record(value:unknown):Record<string,unknown> {return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{}}
export function isCaptureVisible(path:string,values:Record<string,unknown>,canonicalReview:boolean):boolean {
 const dl=record(values.demoLiveExperience);
 if(path==='liveAccountSizeRange')return dl.live!=='No';
 if(path==='platformsBrokerExperience.brokerNames')return record(values.platformsBrokerExperience).brokerExperience==='Yes';
 if(path==='priorEducation.notes')return record(values.priorEducation).type!=='No';
 if(path==='majorNegativeExperience.reflection')return record(values.majorNegativeExperience).type!=='No';
 if(canonicalReview&&(path==='reactionToLoss'||path==='reactionToWin')&&dl.demo==='No'&&dl.live==='No')return false;
 return true;
}
export function patchScheduleDay(schedule:unknown,day:string,patch:Record<string,unknown>):Record<string,Record<string,unknown>> {
 const current=record(schedule);
 return {...current,[day]:{...record(current[day]),...patch}} as Record<string,Record<string,unknown>>;
}
const PROMPTS = new Map([...FINANCIAL_HEALTH_REGISTRY,...DEBT_CREDIT_REGISTRY,...MONTHLY_OBLIGATIONS_REGISTRY,...TRADING_CAPITAL_READINESS_REGISTRY,...TRADING_BEHAVIOR_REGISTRY].map(field=>[field.key,field.question]));
export function capturePrompt(key:string):string|undefined {return PROMPTS.get(key)}
