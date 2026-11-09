import type {LegacySource} from './canonical';
import {FH_RANGE} from '../student-intake-v2/financial-health-registry';
export const NUMBERED_FORM_VERSION='student_intake_numbered.worker_v39';
export const NUMBERED_MAPPING_VERSION='numbered_compat_v1';
export type HistoricalClass='EXACT MATCH'|'SAFE COMPATIBLE MATCH'|'PARTIAL / REQUIRES REVIEW'|'NO CANONICAL EQUIVALENT';
export type NumberedField={key:string;question:string;type:string;options?:readonly string[];classification:HistoricalClass;target?:string;categories:string[];private?:boolean;rule:string};
const info=['INFORMATIONAL_ONLY'],edu=['EDUCATIONAL_PLACEMENT_INPUT','LEARNING_PATH_INPUT'],support=['SUPPORT_PREFERENCE','LEARNING_PATH_INPUT'],finance=['FINANCIAL_READINESS_INPUT'];
const review='Retain original context; no unsupported modern answer is inferred.';
export const NUMBERED_FIELDS:readonly NumberedField[]=[
 {key:'q1',question:'Why do you want to learn trading?',type:'textarea',classification:'PARTIAL / REQUIRES REVIEW',target:'motivationAndWhyNow',categories:info,rule:'Motivation is known; the newer why-now scope is not established.'},
 {key:'q2',question:'What do you want trading education to help you accomplish?',type:'textarea',classification:'PARTIAL / REQUIRES REVIEW',target:'goalImmediate',categories:info,rule:'No immediate timeframe was asked.'},
 {key:'q3',question:'What would you like to accomplish in the next 90 days?',type:'textarea',classification:'EXACT MATCH',target:'goals30_60_90.goal90',categories:info,rule:'Copy only the 90-day goal; never fill the 30/60-day goals.'},
 {key:'q4',question:'What are your longer-term goals?',type:'textarea',classification:'SAFE COMPATIBLE MATCH',target:'goalBig',categories:info,rule:'Retain the original long-term narrative without inventing dates.'},
 {key:'q5',question:'Have you traded before?',type:'select',options:['Yes','No'],classification:'NO CANONICAL EQUIVALENT',categories:edu,rule:'Overall historical use does not identify demo/live history or proficiency.'},
 {key:'q6',question:'Which markets have you traded or are interested in?',type:'multiselect',options:['Forex','Indices','Crypto','Stocks','Options','Futures','Other'],classification:'PARTIAL / REQUIRES REVIEW',target:'marketsExperience',categories:edu,rule:'Interest cannot be promoted to actual markets traded.'},
 {key:'q7',question:'Which platforms have you used?',type:'multiselect',options:['MT4','MT5','TradingView','Other','None'],classification:'EXACT MATCH',target:'platformsBrokerExperience.platforms',categories:[...edu,'ACADEMY_READINESS'],rule:'Literal approved historical array only; no access, broker or proficiency inference.'},
 {key:'q8',question:'Have you traded demo, live, both, or neither?',type:'select',options:['Demo','Live','Both','Neither'],classification:'SAFE COMPATIBLE MATCH',target:'demoLiveExperience',categories:edu,rule:'Translate only the four explicit exclusive history choices to demo/live Yes/No.'},
 {key:'q9',question:'Have you taken trading courses/coaching before?',type:'select',options:['Yes','No'],classification:'SAFE COMPATIBLE MATCH',target:'priorEducation.type',categories:edu,rule:'Yes/No history only. Missing details remain required for Yes; no course proficiency is inferred.'},
 {key:'q10',question:'Have you experienced a significant trading/investment loss or scam?',type:'select',options:['Yes','No'],classification:'SAFE COMPATIBLE MATCH',target:'majorNegativeExperience.type',categories:info,rule:'Yes/No reported history only. A required reflection remains unanswered; optional old notes do not imply reflection.'},
 {key:'q11',question:'Preferred learning methods',type:'multiselect',options:['Hands-on','Video','Reading','Notes','Quizzes','Repetition','Other'],classification:'SAFE COMPATIBLE MATCH',target:'learningStyles',categories:support,rule:'Preserve literal preferences; no conflicting enum translation.'},
 {key:'q12',question:'Patience (1–10)',type:'number-string, min 1 max 10',classification:'PARTIAL / REQUIRES REVIEW',categories:edu,rule:'No conversion from a numeric self-rating to a behavioral enum or demonstrated skill.'},
 {key:'q13',question:'Discipline (1–10)',type:'number-string, min 1 max 10',classification:'PARTIAL / REQUIRES REVIEW',categories:edu,rule:review},
 {key:'q14',question:'What areas do you struggle with most?',type:'textarea',classification:'PARTIAL / REQUIRES REVIEW',categories:support,rule:'Broad barriers are not automatically knowledge gaps, discipline or financial pressure.'},
 {key:'q15',question:'Preferred coaching/session availability',type:'textarea',classification:'PARTIAL / REQUIRES REVIEW',target:'weeklyAvailability',categories:support,rule:'Retain scheduling narrative without inventing days, hours, timezone or consistency.'},
 {key:'q16',question:'Approximate monthly take-home income',type:'free-text input (approximate dollar amounts)',classification:'SAFE COMPATIBLE MATCH',target:'monthlyTakeHomeRange',categories:finance,rule:'Identity reuse only if already exactly an approved modern range; raw amounts require confirmation, no bucketing.'},
 {key:'q17',question:'Approximate monthly essential expenses',type:'free-text input (approximate dollar amounts)',classification:'PARTIAL / REQUIRES REVIEW',categories:finance,rule:'Essential expenses do not equal all recurring/variable obligations.'},
 {key:'q18',question:'Monthly family/support obligations',type:'free-text input (approximate dollar amounts)',classification:'PARTIAL / REQUIRES REVIEW',target:'dependentSupportObligation',categories:finance,rule:'Family support does not establish dependent status or a modern range.'},
 {key:'q19',question:'Savings/emergency reserves',type:'free-text input (approximate dollar amounts)',classification:'PARTIAL / REQUIRES REVIEW',categories:finance,rule:'Combined amounts cannot fill separate savings/emergency fields.'},
 {key:'q20',question:'Investments/assets',type:'free-text input (approximate dollar amounts)',classification:'NO CANONICAL EQUIVALENT',categories:finance,rule:review},
 {key:'q21',question:'Debt balances',type:'free-text input (approximate dollar amounts)',classification:'SAFE COMPATIBLE MATCH',target:'totalDebtRange',categories:finance,rule:'Identity reuse only for an exact approved modern debt range, never infer debt status or payments.'},
 {key:'q22',question:'Vehicle payment and remaining balance, if applicable',type:'free-text input (approximate dollar amounts)',classification:'PARTIAL / REQUIRES REVIEW',categories:finance,rule:'Do not split payment and balance into invented values.'},
 {key:'q23',question:'Approximate monthly disposable income',type:'free-text input (approximate dollar amounts)',classification:'PARTIAL / REQUIRES REVIEW',target:'disposableIncomeRange',categories:finance,rule:'The old prompt did not specify after essential bills/obligations; confirm that scope before treating it as modern remaining cash flow.'},
 {key:'q24',question:'Amount that could responsibly be allocated to trading/trading education without affecting necessities',type:'free-text input (approximate dollar amounts)',classification:'PARTIAL / REQUIRES REVIEW',categories:finance,rule:'Combined education/trading allocation is not available trading capital or affordable loss.'},
 {key:'q25',question:'Risk comfort',type:'select',options:['Low','Moderate','High'],classification:'NO CANONICAL EQUIVALENT',categories:info,rule:'Comfort is not financial risk capacity, competence or permission for live trading.'},
 ...[['q26','Instructor notes'],['q27','Recommended HFT track/level'],['q28','Primary focus areas'],['q29','Risks/concerns'],['q30','Next steps']].map(([key,question])=>({key,question,type:key==='q27'?'input':'textarea',classification:'NO CANONICAL EQUIVALENT' as const,categories:['INSTRUCTOR_PRIVATE'],private:true,rule:'Historical instructor context only; never student report, current placement authority or automatic approval.'})),
 {key:'q9details',question:'Details (prior trading courses/coaching)',type:'textarea',classification:'SAFE COMPATIBLE MATCH',target:'priorEducation.notes',categories:edu,rule:'Copy details only when the same source explicitly reports prior education Yes.'},
 {key:'q10notes',question:'Optional notes (significant loss or scam)',type:'textarea',classification:'PARTIAL / REQUIRES REVIEW',categories:info,rule:'Notes do not necessarily answer the newer reflection question.'},
 {key:'whyJoin',question:'Why join HFT?',type:'textarea; adjacent worker_v38 form',classification:'PARTIAL / REQUIRES REVIEW',categories:info,rule:'Retain the known adjacent-form prompt; HFT membership motivation does not answer why trading now.'},
];
export function resolveNumberedForm(source:LegacySource):string|null {
 if(source.kind!=='legacy_intake')return null;
 if(source.formVersion)return source.formVersion===NUMBERED_FORM_VERSION?NUMBERED_FORM_VERSION:null;
 // There is no stored form-version column: row.version is a revision, NOT a form ID.
 // Fail closed outside the independently recovered v39 capture window; no answer-text inference.
 const at=Date.parse(source.completedAt??source.capturedAt??'');
 return at>=Date.parse('2026-11-03T05:06:55.653582Z')&&at<Date.parse('2026-11-03T05:22:12.813100Z')&&Object.keys(source.data).some(k=>/^q(?:[1-9]|[12][0-9]|30)$/.test(k))?NUMBERED_FORM_VERSION:null;
}
export function numberedMapping(field:NumberedField,value:unknown,source:LegacySource):{path:string;value:unknown}|null{
 if(!field.target||!['EXACT MATCH','SAFE COMPATIBLE MATCH'].includes(field.classification))return null;
 if(field.key==='q8'){const pairs:Record<string,{demo:string;live:string}>={Demo:{demo:'Yes',live:'No'},Live:{demo:'No',live:'Yes'},Both:{demo:'Yes',live:'Yes'},Neither:{demo:'No',live:'No'}};return typeof value==='string'&&Object.hasOwn(pairs,value)?{path:field.target,value:pairs[value]}:null}
 if(field.type==='multiselect')return Array.isArray(value)&&value.length>0&&value.every(v=>typeof v==='string'&&field.options?.includes(v))&&!(value.includes('None')&&value.length>1)?{path:field.target,value:[...value]}:null;
 if(field.key==='q9details'&&source.data.q9!=='Yes')return null;
 const ranges:Record<string,readonly string[]>={q16:FH_RANGE.monthlyTakeHomeRange,q21:FH_RANGE.totalDebtRange};
 if(ranges[field.key])return typeof value==='string'&&ranges[field.key].includes(value)?{path:field.target,value}:null;
 if(field.options)return typeof value==='string'&&field.options.includes(value)?{path:field.target,value}:null;
 return typeof value==='string'&&value.trim()?{path:field.target,value}:null;
}
export const NUMBERED_CANONICAL_KEYS=NUMBERED_FIELDS.filter(f=>['EXACT MATCH','SAFE COMPATIBLE MATCH'].includes(f.classification)).map(f=>f.key);
export function protectedNumberedChanges(previous:Record<string,unknown>,next:Record<string,unknown>):boolean{return NUMBERED_CANONICAL_KEYS.some(k=>JSON.stringify(previous[k])!==JSON.stringify(next[k]))}
