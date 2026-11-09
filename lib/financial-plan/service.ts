import {assertLifecycleActive} from '../student-lifecycle';
import {getIntakeById,getLatestCompletedIntake,type IntakeActor} from '../student-intake-v2/service';
import {validateFinalCompletion} from '../student-intake-v2/validation';
import {ACKNOWLEDGMENT_REGISTRY} from '../student-intake-v2/acknowledgments';
import {composeFinancial,EMPTY_INSTRUCTOR,studentContent} from './compose';
import {FINANCIAL_ENGINE_VERSION,type StaffPlan,type InstructorContent,type StudentPlan} from './contracts';
const id=()=>crypto.randomUUID().replaceAll('-','');
const stamp=()=>new Date().toISOString();
const fail=(message:string,status=400):never=>{throw Object.assign(new Error(message),{status});};
export function canonical(value:unknown):string{
 if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;
 if(value&&typeof value==='object')return `{${Object.entries(value).filter(([,v])=>v!==undefined).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
 return JSON.stringify(value)??'null';
}
async function digest(value:unknown){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(value))))).map(v=>v.toString(16).padStart(2,'0')).join('');}
async function staff(db:D1Database,actor:IntakeActor,studentId?:string){
 await assertLifecycleActive(db,actor.userId);
 const u=await db.prepare('SELECT role,banned,must_change_password FROM user WHERE id=?').bind(actor.userId).first<any>();
 if(u?.role!=='admin'||u.banned||u.must_change_password||actor.userId===studentId)fail('Forbidden: authorized staff required.',403);
}
function view(row:any):StaffPlan{
 const financial=JSON.parse(row.financial_json),instructor=JSON.parse(row.instructor_json);
 return {id:row.id,seriesId:row.series_id,studentId:row.student_id,version:row.version,status:row.status,editRevision:row.edit_revision,source:JSON.parse(row.source_json),sourceDigest:row.source_digest,engineVersion:row.engine_version,engine:JSON.parse(row.engine_json),financial,instructor,studentPreview:row.student_json?JSON.parse(row.student_json):studentContent(financial,instructor),createdAt:row.created_at,generatedAt:row.generated_at,reviewedAt:row.reviewed_at,approvedAt:row.approved_at,publishedAt:row.published_at,supersededAt:row.superseded_at,actors:{created:row.created_by,updated:row.updated_by,reviewed:row.reviewed_by,approved:row.approved_by,published:row.published_by}};
}
async function staffPlan(db:D1Database,actor:IntakeActor,planId:string){
 await staff(db,actor);
 const row=await db.prepare('SELECT v.*,s.student_id FROM financial_plan_version v JOIN financial_plan_series s ON s.id=v.series_id WHERE v.id=?').bind(planId).first<any>();
 if(!row)fail('Plan unavailable.',404);await staff(db,actor,row.student_id);return view(row);
}
export async function getStaffPlans(db:D1Database,actor:IntakeActor,studentId:string){
 await staff(db,actor,studentId);
 const series=await db.prepare('SELECT * FROM financial_plan_series WHERE student_id=?').bind(studentId).first<any>();
 const rows=series?(await db.prepare('SELECT v.*,s.student_id FROM financial_plan_version v JOIN financial_plan_series s ON s.id=v.series_id WHERE s.id=? ORDER BY v.version DESC').bind(series.id).all<any>()).results:[];
 const events=series?(await db.prepare('SELECT e.* FROM financial_plan_event e JOIN financial_plan_version v ON v.id=e.plan_id WHERE v.series_id=? ORDER BY e.rowid').bind(series.id).all<any>()).results:[];
 const latest=await getLatestCompletedIntake(db,studentId);
 return {versions:rows.map(view),seriesRevision:series?.revision??0,publishedId:series?.published_version_id??null,latestCompletedIntakeId:latest?.id??null,events};
}
export async function generatePlan(db:D1Database,actor:IntakeActor,studentId:string,intakeId:string,requestKey?:string){
 await staff(db,actor,studentId);
 const source=await getIntakeById(db,intakeId,studentId);
 if(!source||source.status!=='completed'||!source.completed_at||!source.completed_by_user_id)fail('An exact completed Intake V2 source is required.');
 const validation=validateFinalCompletion({student_sections:source!.student_sections_json,instructor_assessment:source!.instructor_assessment_json,acknowledgments:source!.acknowledgments_json,ack_audit:source!.ack_audit_json,intake_id:source!.id,form_version:source!.form_version,schema_version:source!.schema_version,snapshot_version:source!.snapshot_version,instructor_review:source!.system_meta_json?.captureWorkflow==='canonical_review_v1'?source!.system_meta_json.smart_review:undefined});
 if(!validation.ok)fail('Completed source fails intake validation. Complete a corrected new intake.');
 if(!source!.ack_audit_json.records.every(a=>a.form_version===source!.form_version&&a.schema_version===source!.schema_version&&a.intake_id===source!.id&&a.ack_text_version_id===ACKNOWLEDGMENT_REGISTRY[a.ack_key]?.version_id))fail('Source acknowledgment versions require review.');
 const hash=await digest(source), key=requestKey??`${hash}:${FINANCIAL_ENGINE_VERSION}`;
 if(typeof key!=='string'||key.length<1||key.length>200)fail('Invalid generation request key.');
 await db.prepare('INSERT INTO financial_plan_series(id,student_id) VALUES(?,?) ON CONFLICT(student_id) DO NOTHING').bind(id(),studentId).run();
 const series=await db.prepare('SELECT id FROM financial_plan_series WHERE student_id=?').bind(studentId).first<any>();
 const previous=await db.prepare('SELECT id,source_digest FROM financial_plan_version WHERE series_id=? AND request_key=?').bind(series.id,key).first<any>();
 if(previous){if(previous.source_digest!==hash)fail('Request key belongs to a different source.',409);return staffPlan(db,actor,previous.id);}
 const at=stamp(), generated=composeFinancial(source!,at), planId=id();
 await db.prepare(`INSERT INTO financial_plan_version(id,series_id,version,request_key,source_intake_id,source_version,source_digest,source_json,engine_version,engine_json,financial_json,instructor_json,created_at,generated_at,updated_at,created_by,updated_by)
 SELECT ?,?,COALESCE(MAX(version),0)+1,?,?,?,?,?,?,?,?,?,?,?,?,?,? FROM financial_plan_version WHERE series_id=? ON CONFLICT(series_id,request_key) DO NOTHING`).bind(planId,series.id,key,source!.id,source!.snapshot_version,hash,canonical(source),FINANCIAL_ENGINE_VERSION,JSON.stringify(generated.engine),JSON.stringify(generated.financial),JSON.stringify(EMPTY_INSTRUCTOR),at,at,at,actor.userId,actor.userId,series.id).run();
 const row=await db.prepare('SELECT id,source_digest FROM financial_plan_version WHERE series_id=? AND request_key=?').bind(series.id,key).first<any>();
 if(row.source_digest!==hash)fail('Concurrent request used a different source.',409);
 return staffPlan(db,actor,row.id);
}
function validateContent(value:unknown):InstructorContent{
 if(!value||typeof value!=='object'||Array.isArray(value))return fail('Invalid instructor content.');
 const v=value as InstructorContent;
 if(Object.keys(v).some(k=>!['privateNotes','explanation','actions','reason','reviewResolution'].includes(k))||['privateNotes','explanation','reason','reviewResolution'].some(k=>typeof v[k as keyof InstructorContent]!=='string'||String(v[k as keyof InstructorContent]).length>8000)||!v.reason.trim()||!Array.isArray(v.actions)||v.actions.length>20)fail('Provide bounded instructor content and a change reason.');
 for(const a of v.actions)if(!a||Object.keys(a).some(k=>!['text','rationale','priority','status','evidence'].includes(k))||typeof a.text!=='string'||a.text.trim().length<5||a.text.length>2000||typeof a.rationale!=='string'||!a.rationale.trim()||a.rationale.length>2000||!['normal','high'].includes(a.priority)||!['open','in_progress','done'].includes(a.status)||!Array.isArray(a.evidence)||a.evidence.some(k=>typeof k!=='string'||k.length>150))fail('Every instructor action needs rationale, evidence, priority and status.');
 return {privateNotes:v.privateNotes,explanation:v.explanation,reason:v.reason,reviewResolution:v.reviewResolution,actions:v.actions.map(a=>({text:a.text,rationale:a.rationale,priority:a.priority,status:a.status,evidence:[...a.evidence]}))};
}
const latestClause='AND version=(SELECT MAX(x.version) FROM financial_plan_version x WHERE x.series_id=financial_plan_version.series_id)';
export async function editPlan(db:D1Database,actor:IntakeActor,planId:string,expectedRevision:number,content:unknown){
 const p=await staffPlan(db,actor,planId);if(expectedRevision!==p.editRevision)fail('Plan revision changed; reload.',409);const safe=validateContent(content);
 if(!['DRAFT','REVIEW'].includes(p.status))fail('Approved plan is immutable; create a revision.');
 const r=await db.prepare(`UPDATE financial_plan_version SET instructor_json=?,status='DRAFT',reviewed_at=NULL,reviewed_by=NULL,updated_at=?,updated_by=?,edit_revision=edit_revision+1 WHERE id=? AND edit_revision=? AND status IN ('DRAFT','REVIEW') ${latestClause}`).bind(JSON.stringify(safe),stamp(),actor.userId,planId,expectedRevision).run();
 if(!r.meta.changes)fail('Plan changed or a newer version exists; reload.',409);return staffPlan(db,actor,planId);
}
export async function transitionPlan(db:D1Database,actor:IntakeActor,planId:string,expectedRevision:number,action:'review'|'approve'|'return'){
 const p=await staffPlan(db,actor,planId),at=stamp();
 if(expectedRevision!==p.editRevision)fail('Plan revision changed; reload.',409);
 if(!['review','approve','return'].includes(action))fail('Invalid lifecycle action.');
 if(p.instructor.explanation.trim().length<10||p.instructor.reviewResolution.trim().length<10)fail('Explain student guidance and explicitly resolve missing information/conflicts for review.');
 const expected=action==='review'?'DRAFT':'REVIEW',next=action==='review'?'REVIEW':action==='approve'?'APPROVED':'DRAFT';
 const updates=action==='review'?'reviewed_at=?,reviewed_by=?':action==='approve'?'approved_at=?,approved_by=?,student_json=?':'reviewed_at=NULL,reviewed_by=NULL';
 const args:any[]=action==='return'?[]:[at,actor.userId];
 if(action==='approve')args.push(JSON.stringify(studentContent(p.financial,p.instructor)));
 const r=await db.prepare(`UPDATE financial_plan_version SET status=?,${updates},updated_at=?,updated_by=?,edit_revision=edit_revision+1 WHERE id=? AND edit_revision=? AND status=? ${latestClause}`).bind(next,...args,at,actor.userId,planId,expectedRevision,expected).run();
 if(!r.meta.changes)fail('Plan changed, not reviewed, or newer version exists; reload.',409);return staffPlan(db,actor,planId);
}
export async function publishPlan(db:D1Database,actor:IntakeActor,planId:string,expectedRevision:number,expectedSeriesRevision:number){
 const p=await staffPlan(db,actor,planId);if(expectedRevision!==p.editRevision)fail('Plan revision changed; reload.',409);if(p.status!=='APPROVED')fail('Only an approved version can publish.');
 const r=await db.prepare(`UPDATE financial_plan_series SET published_version_id=?,published_at=?,published_by=?,revision=revision+1 WHERE id=? AND revision=? AND EXISTS(SELECT 1 FROM financial_plan_version v WHERE v.id=? AND v.edit_revision=? AND v.status='APPROVED' AND v.version=(SELECT MAX(version) FROM financial_plan_version WHERE series_id=v.series_id))`).bind(planId,stamp(),actor.userId,p.seriesId,expectedSeriesRevision,planId,expectedRevision).run();
 if(!r.meta.changes)fail('Publication changed or a newer version exists; reload.',409);return staffPlan(db,actor,planId);
}
/** Caller supplies the authenticated user's ID, never a student ID from query/body. */
export async function getStudentPlan(db:D1Database,authenticatedUserId:string):Promise<StudentPlan|null>{
 await assertLifecycleActive(db,authenticatedUserId);
 const u=await db.prepare('SELECT banned,must_change_password FROM user WHERE id=?').bind(authenticatedUserId).first<any>();
 if(!u||u.banned||u.must_change_password)fail('Forbidden.',403);
 const row=await db.prepare("SELECT v.id,v.version,v.published_at,v.student_json,v.source_intake_id,v.source_version FROM financial_plan_series s JOIN financial_plan_version v ON v.id=s.published_version_id AND v.series_id=s.id WHERE s.student_id=? AND v.status='PUBLISHED'").bind(authenticatedUserId).first<any>();
 if(!row)return null;
 const latest=await getLatestCompletedIntake(db,authenticatedUserId);
 return {plan:{id:row.id,version:row.version,publishedAt:row.published_at,content:JSON.parse(row.student_json)},sourceOutdated:!!latest&&(latest.id!==row.source_intake_id||latest.snapshot_version!==row.source_version)};
}
