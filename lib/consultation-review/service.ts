import {resolveNumberedForm} from './numbered';
import 'server-only';
import {createHash} from 'node:crypto';
import {projectCanonical,type LegacySource} from './canonical';
import {defaultReview,judgmentFields,reviewIsCurrent,REVIEW_VERSION,type SmartReview,type Match} from './model';
import {getActiveDraftForStudent,getLatestCompletedIntake,getIntakeById,createDraftForStudent,saveStudentAnswers,type IntakeActor} from '../student-intake-v2/service';
import type {IntakeV2Record,InstructorAssessmentV2} from '../student-intake-v2/contracts';
import {validateFinalCompletion} from '../student-intake-v2/validation';
import {composeFinancial} from '../financial-plan/compose';
import {captureEducationalSource} from '../learning-path/source';
import {educationalIntake,recommendLearningPath} from '../learning-path/engine';
const stamp=()=>new Date().toISOString();
const json=(v:unknown)=>JSON.stringify(v);
const parse=(v:unknown,fallback:any)=>{try{return typeof v==='string'?JSON.parse(v):v??fallback}catch{return fallback}};
const fail=(message:string,status=400):never=>{throw Object.assign(new Error(message),{status})};
async function staff(db:D1Database,actor:IntakeActor,studentId:string){
 const user=await db.prepare('SELECT role,lifecycle_status,banned,must_change_password FROM user WHERE id=?').bind(actor.userId).first<any>();
 if(user?.role!=='admin'||user.lifecycle_status!=='ACTIVE'||user.banned||user.must_change_password||actor.userId===studentId)fail('Forbidden: authorized active instructor required.',403);
 const student=await db.prepare('SELECT id,lifecycle_status,banned FROM user WHERE id=?').bind(studentId).first<any>();
 if(!student)fail('Student not found.',404);if(student.lifecycle_status!=='ACTIVE'||student.banned)fail('Student is inactive.',403);
}
async function sources(db:D1Database,studentId:string){
 const q=await db.prepare('SELECT * FROM consultation_questionnaire WHERE user_id=? ORDER BY updated_at DESC,id DESC LIMIT 1').bind(studentId).first<any>();
 const old=await db.prepare('SELECT * FROM student_intake WHERE "userId"=? ORDER BY version DESC,"updatedAt" DESC,id DESC LIMIT 1').bind(studentId).first<any>();
 const list:LegacySource[]=[];
 if(q)list.push({kind:'consultation_questionnaire',id:q.id,revision:q.updated_at,capturedAt:q.submitted_at??q.updated_at,data:parse(q.data,{})});
 if(old)list.push({kind:'legacy_intake',id:old.id,revision:old.version,capturedAt:old.completedAt??old.updatedAt,data:parse(old.data,{}),completedAt:old.completedAt??null});
 return {list,legacyCompleted:q?.status==='submitted'||old?.status==='completed'};
}
const digest=(v:unknown)=>createHash('sha256').update(json(v)).digest('hex');
function validation(record:IntakeV2Record){return validateFinalCompletion({student_sections:record.student_sections_json,instructor_assessment:record.instructor_assessment_json,acknowledgments:record.acknowledgments_json,ack_audit:record.ack_audit_json,intake_id:record.id,form_version:record.form_version,schema_version:record.schema_version,snapshot_version:record.snapshot_version,instructor_review:record.system_meta_json?.captureWorkflow===REVIEW_VERSION?(record.system_meta_json.smart_review??defaultReview(record.snapshot_version)):undefined})}
export async function getReviewWorkspace(db:D1Database,actor:IntakeActor,studentId:string){
 await staff(db,actor,studentId);
 const intake=await getActiveDraftForStudent(db,studentId)??await getLatestCompletedIntake(db,studentId);
 const legacy=await sources(db,studentId),projection=projectCanonical(intake,legacy.list),at=stamp();
 const virtual={id:'provisional:'+studentId,student_user_id:studentId,status:'draft',snapshot_version:0,student_sections_json:projection.sections,instructor_assessment_json:{},acknowledgments_json:{},ack_audit_json:{records:[]},system_meta_json:{captureWorkflow:REVIEW_VERSION},provenance_json:{},form_version:'hft_intake_v2_form.2026-11-05_phase3f',schema_version:'hft_intake_v2.0',updated_at:at,completed_at:null} as unknown as IntakeV2Record;
 const preview={...(intake??virtual),student_sections_json:projection.sections,provenance_json:{...(intake?.provenance_json??{}),...Object.fromEntries(Object.keys(projection.adoptable).map(key=>[key,{source:'system_derived' as const,evidenceKind:'STUDENT_REPORTED',sourceRefs:projection.sourceRefs[key],explanation:'Read-only compatible legacy projection; not yet adopted.'}]))}};
 const educationalSource=await captureEducationalSource(db,studentId);educationalSource.intake=educationalIntake(preview);
 const recommendation=recommendLearningPath(educationalSource),financial=composeFinancial(preview,at).financial;
 const review=(intake?.system_meta_json?.smart_review??defaultReview(intake?.snapshot_version??0)) as SmartReview;
 const findings=validation(intake?.status==='completed'?intake:{...preview,system_meta_json:{...preview.system_meta_json,captureWorkflow:REVIEW_VERSION,smart_review:review}});
 const history=intake?(await db.prepare('SELECT id,event_type,actor_user_id,actor_role,payload_summary_json,created_at FROM student_intake_v2_event WHERE intake_id=? ORDER BY rowid DESC').bind(intake.id).all<any>()).results.map(row=>({...row,payload:parse(row.payload_summary_json,{})})):[];
 const legacyPlacement=await db.prepare('SELECT "instructorLevel","instructorTrack","instructorReason","placedAt" FROM student_placement WHERE "userId"=?').bind(studentId).first<any>();
 return {intake,projection,historicalSources:legacy.list.filter(s=>s.kind==='legacy_intake').map(s=>({id:s.id,formVersion:resolveNumberedForm(s),numberedFields:Object.keys(s.data).filter(k=>/^q[0-9]+$/.test(k)).length})),legacyDigest:digest(legacy.list),legacyCompleted:legacy.legacyCompleted,validation:findings,review,reviewCurrent:reviewIsCurrent(review,intake?.snapshot_version),financial,recommendation,educationalSource,history,legacyPlacement,
  afterCallSummary:{kind:'SYSTEM_DERIVED' as const,provisional:intake?.status!=='completed',facts:['preferredName','marketsExperience','demoLiveExperience','platformsBrokerExperience','platformAccess','goalImmediate','goals30_60_90','goals6_12','goalBig','goalWhy','weeklyHoursRange','learningStyles','accountabilityFeedback'].flatMap(key=>projection.facts.filter(f=>f.key===key)),legacyFacts:projection.unmapped},
  requiredMissing:findings.issues.filter(i=>!i.path.startsWith('instructor_')),analysisIsProvisional:true};
}
async function mutable(db:D1Database,actor:IntakeActor,student:string,id:string,revision:number){
 await staff(db,actor,student);const r=await getIntakeById(db,id,student);if(!r)fail('Intake not found.',404);if(!['draft','in_progress'].includes(r!.status))fail('Completed snapshots are read-only. Start a new revision.');if(r!.snapshot_version!==revision)fail('Intake changed; reload before saving.',409);return r!;
}
export async function beginReviewCapture(db:D1Database,actor:IntakeActor,student:string){
 await staff(db,actor,student);let r=await getActiveDraftForStudent(db,student)??await createDraftForStudent(db,{studentUserId:student,actor,inheritLatest:true});
 if(r.system_meta_json?.captureWorkflow===REVIEW_VERSION)return r;
 const meta={...r.system_meta_json,captureWorkflow:REVIEW_VERSION,smart_review:defaultReview(r.snapshot_version+1)};
 const result=await db.batch([
  db.prepare(`UPDATE student_intake_v2 SET system_meta_json=?,snapshot_version=snapshot_version+1,updated_at=?,updated_by_user_id=? WHERE id=? AND student_user_id=? AND snapshot_version=? AND status IN ('draft','in_progress')`).bind(json(meta),stamp(),actor.userId,r.id,student,r.snapshot_version),
  db.prepare(`INSERT INTO student_intake_v2_event(id,intake_id,event_type,actor_user_id,actor_role,payload_summary_json,created_at) SELECT ?,?,'canonical_workflow_started',?,?,?,? WHERE changes()=1`).bind(crypto.randomUUID(),r.id,actor.userId,actor.role,json({workflow:REVIEW_VERSION,previousMeta:r.system_meta_json}),stamp())]);
 if(!result[0].meta.changes)fail('Intake changed; reload.',409);return (await getIntakeById(db,r.id,student))!;
}
export async function adoptLegacyAnswers(db:D1Database,actor:IntakeActor,student:string,id:string,revision:number,expectedLegacyDigest:string){
 const r=await mutable(db,actor,student,id,revision),legacy=await sources(db,student);if(digest(legacy.list)!==expectedLegacyDigest)fail('Saved legacy evidence changed; reload before adopting.',409);
 const projected=projectCanonical(r,legacy.list);if(!Object.keys(projected.adoptable).length)return r;
 return saveStudentAnswers(db,{intakeId:id,studentUserId:student,actor,mode:'instructor_entered_for_student',expectedSnapshotVersion:revision,sections:projected.adoptable,sourceRefs:projected.sourceRefs,evidenceKind:'STUDENT_REPORTED',correctionReason:'Explicit adoption of compatible saved legacy answers; original records retained.'});
}
export type ReviewInput={matchesSelfReport:Match;contradictions:string;requireAssessment:boolean;requirePractical:boolean;requireChartDemonstration:boolean;reason:string;observations:Record<string,string>};
export async function saveConsultationReview(db:D1Database,actor:IntakeActor,student:string,id:string,revision:number,input:ReviewInput,confirm:boolean){
 const r=await mutable(db,actor,student,id,revision);if(r.system_meta_json?.captureWorkflow!==REVIEW_VERSION)fail('Start canonical review capture first.');
 if(!['MATCHES','PARTIAL','CONTRADICTS','NOT_OBSERVED'].includes(input.matchesSelfReport)||['contradictions','reason'].some(k=>typeof input[k as 'reason']!=='string'||input[k as 'reason'].length>4000)||['requireAssessment','requirePractical','requireChartDemonstration'].some(k=>typeof input[k as 'requireAssessment']!=='boolean'))fail('Invalid instructor review.');
 if(input.matchesSelfReport==='CONTRADICTS'&&!input.contradictions.trim())fail('Explain the observed contradiction; do not replace the original self-report.');
 if(!input.observations||Object.keys(input.observations).some(k=>!judgmentFields.includes(k as any)||typeof input.observations[k]!=='string'||input.observations[k].length>6000))fail('Only instructor observation fields may be saved here.');
 const assessment={...r.instructor_assessment_json},provenance={...r.provenance_json};const at=stamp();
 for(const [key,value] of Object.entries(input.observations))if((value.trim()||Object.hasOwn(assessment,key))&&JSON.stringify((assessment as any)[key]?.value)!==JSON.stringify(value)){(assessment as any)[key]={value};(provenance as any)[key]={source:'instructor_assessment',evidenceKind:'INSTRUCTOR_OBSERVED',entered_by_user_id:actor.userId,entered_at:at}}
 const review:SmartReview={version:REVIEW_VERSION,status:confirm?'reviewed':'draft',sourceRevision:revision+1,reviewedBy:confirm?actor.userId:null,reviewedAt:confirm?at:null,matchesSelfReport:input.matchesSelfReport,contradictions:input.contradictions,requireAssessment:input.requireAssessment,requirePractical:input.requirePractical,requireChartDemonstration:input.requireChartDemonstration,reason:input.reason};
 const meta={...r.system_meta_json,smart_review:review};
 const results=await db.batch([
  db.prepare(`UPDATE student_intake_v2 SET system_meta_json=?,instructor_assessment_json=?,provenance_json=?,snapshot_version=snapshot_version+1,updated_at=?,updated_by_user_id=?,instructor_user_id=? WHERE id=? AND student_user_id=? AND snapshot_version=? AND status IN ('draft','in_progress')`).bind(json(meta),json(assessment),json(provenance),at,actor.userId,actor.userId,id,student,revision),
  db.prepare(`INSERT INTO student_intake_v2_event(id,intake_id,event_type,actor_user_id,actor_role,payload_summary_json,created_at) SELECT ?,?,'instructor_review',?,?,?,? WHERE changes()=1`).bind(crypto.randomUUID(),id,actor.userId,actor.role,json({kind:'INSTRUCTOR_OBSERVED',previousReview:r.system_meta_json?.smart_review??null,newReview:review,previousAssessment:r.instructor_assessment_json,newAssessment:assessment,previousProvenance:r.provenance_json,newProvenance:provenance,reason:input.reason}),at)]);
 if(!results[0].meta.changes)fail('Intake changed; reload.',409);return (await getIntakeById(db,id,student))!;
}
