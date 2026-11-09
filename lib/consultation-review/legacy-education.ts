import 'server-only';
import {NUMBERED_FIELDS,NUMBERED_MAPPING_VERSION,resolveNumberedForm} from './numbered';
/** Legacy-owned self-report context; never score or convert these to demonstrated skill. */
export type LegacyEducationalContext={key:string;label?:string;value:unknown;reference:string;recordedAt:string|null};
const keys=new Set(['experienceLevel','expLevel','tradedBefore','experienceLength','yearsTrading','mt45','mt4Exp','mt5Exp','mt5Installed','mt5Installed2','brokerCurrent','brokerName','broker','hasBrokerAccount','knowledgeCandlesticks','knowledgeSupportResistance','knowledgeTrend','knowledgeRiskMgmt','knowledgeOrders','knowledgeMarketStructure','knowledgePsychology']);
export async function readLegacyEducationalContext(db:D1Database,studentId:string):Promise<LegacyEducationalContext[]>{
 const q=await db.prepare('SELECT id,data,updated_at FROM consultation_questionnaire WHERE user_id=? ORDER BY updated_at DESC,id DESC LIMIT 1').bind(studentId).first<any>();
 const old=await db.prepare('SELECT id,data,version,"updatedAt","completedAt" FROM student_intake WHERE "userId"=? ORDER BY version DESC,"updatedAt" DESC,id DESC LIMIT 1').bind(studentId).first<any>();
 const context:LegacyEducationalContext[]=[];
 for(const [kind,row] of [['consultation_questionnaire',q],['legacy_intake',old]] as const){if(!row)continue;let data:Record<string,unknown>;try{data=JSON.parse(row.data||'{}')}catch{continue}
 const formVersion=kind==='legacy_intake'?resolveNumberedForm({kind,id:row.id,revision:row.version,capturedAt:row.completedAt??row.updatedAt,completedAt:row.completedAt,data}):null;
 if(formVersion)for(const field of NUMBERED_FIELDS){const value=data[field.key];if(!field.private&&field.categories.some(c=>['EDUCATIONAL_PLACEMENT_INPUT','SUPPORT_PREFERENCE'].includes(c))&&value!==null&&value!==undefined&&value!=='')context.push({key:field.key,label:field.question,value,reference:`${kind}:${row.id}:revision:${row.version}:${field.key}:form:${formVersion}:mapping:${NUMBERED_MAPPING_VERSION}:HISTORICAL_STUDENT_REPORTED`,recordedAt:row.completedAt??row.updatedAt??null})}
 for(const [key,value] of Object.entries(data))if(keys.has(key)&&value!==null&&value!==undefined&&value!=='')context.push({key,value,reference:`${kind}:${row.id}:revision:${row.version??row.updated_at}:${key}`,recordedAt:row.updated_at??row.updatedAt??null})}
 return context;
}
