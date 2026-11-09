import {teachingAccess,deny} from './access';
import {hasStudentAccess} from '../../membership-access';
import {isLearningGateSatisfied} from '../../academy/learning/service';
import {isPlacementSkipApproved} from '../../learning-path/access';
type Row=Record<string,any>;
export interface FollowupContent {feedback:string;decision:'REVIEW'|'REINFORCEMENT'|'PRACTICE'|'PRACTICAL_DEMONSTRATION'|'NO_ADDITIONAL_WORK';task?:string;lessonId?:string}
async function member(db:D1Database,id:string){const u=await db.prepare('SELECT * FROM user WHERE id=?').bind(id).first<Row>();if(!u||u.lifecycle_status!=='ACTIVE'||u.banned||u.must_change_password||!hasStudentAccess(u))deny('Active student access required.');}
const authority=`EXISTS(SELECT 1 FROM teaching_session s JOIN user u ON u.id=s.instructor_id JOIN teaching_enrollment e ON e.session_id=s.id WHERE s.id=? AND s.instructor_id=? AND u.role='admin' AND u.lifecycle_status='ACTIVE' AND COALESCE(u.banned,0)=0 AND COALESCE(u.must_change_password,0)=0 AND s.status='CONFIRMED' AND e.student_id=? AND e.status='ENROLLED')`;
async function target(db:D1Database,actor:string,sid:string,student:string){await teachingAccess(db,actor,sid,true);if(!await db.prepare("SELECT 1 FROM teaching_enrollment WHERE session_id=? AND student_id=? AND status='ENROLLED'").bind(sid,student).first())deny('Student unavailable.',404);}
function content(value:FollowupContent):FollowupContent {if(!value||typeof value.feedback!=='string'||!value.feedback.trim()||value.feedback.length>5000||!['REVIEW','REINFORCEMENT','PRACTICE','PRACTICAL_DEMONSTRATION','NO_ADDITIONAL_WORK'].includes(value.decision)||value.task!==undefined&&(typeof value.task!=='string'||!value.task.trim()||value.task.length>5000)||value.lessonId!==undefined&&(typeof value.lessonId!=='string'||value.lessonId.length>100))deny('Invalid follow-up.',400);return {feedback:value.feedback.trim(),decision:value.decision,...(value.task?{task:value.task.trim()}:{}),...(value.lessonId?{lessonId:value.lessonId}:{})};}
export async function saveFollowup(db:D1Database,actor:string,sid:string,student:string,value:FollowupContent){
 await target(db,actor,sid,student);const handoff=await prepareHandoff(db,actor,sid);if(!handoff.handoffVersionId)deny('End class before preparing follow-up.',409);const c=content(value),id=crypto.randomUUID();
 try{await db.prepare(`INSERT INTO classroom_followup(id,session_id,student_id,version,content_json,created_at,handoff_id) SELECT ?,?,?,COALESCE((SELECT MAX(version) FROM classroom_followup WHERE session_id=? AND student_id=?),0)+1,?,?,? WHERE ${authority}`).bind(id,sid,student,sid,student,JSON.stringify(c),new Date().toISOString(),handoff.handoffVersionId,sid,actor,student).run();}catch{deny('Follow-up changed. Refresh and retry.',409);}
 const row=await db.prepare('SELECT * FROM classroom_followup WHERE id=?').bind(id).first<Row>();if(!row)deny('Authority changed.',409);return row;
}
export async function approveFollowup(db:D1Database,actor:string,sid:string,id:string){
 const row=await db.prepare('SELECT * FROM classroom_followup WHERE id=? AND session_id=?').bind(id,sid).first<Row>();if(!row)deny('Follow-up unavailable.',404);await target(db,actor,sid,row.student_id);
 if(row.approved_at)return row;
 const {snapshot}=await teachingAccess(db,actor,sid,true);if(snapshot.state!=='ENDED')deny('End class before approving follow-up.',409);
 const handoff=await db.prepare('SELECT snapshot_json FROM classroom_handoff_version WHERE id=? AND session_id=?').bind(row.handoff_id,sid).first<Row>();if(!handoff)deny('Reviewed handoff required.',409);
 const basis=JSON.parse(handoff.snapshot_json).students.find((s:any)=>s.id===row.student_id);
 const refs={handoffId:row.handoff_id,evidenceIds:basis?.evidence?.map((e:any)=>e.id)??[],responseVersions:basis?.responses?.map((r:any)=>({runId:r.run_id,revision:r.revision}))??[]};
 const result=await db.prepare(`UPDATE classroom_followup SET approved_by=?,approved_at=?,approved_evidence_json=? WHERE id=? AND approved_at IS NULL AND ${authority} AND EXISTS(SELECT 1 FROM classroom_room WHERE session_id=classroom_followup.session_id AND json_extract(state_json,'$.state')='ENDED') AND NOT EXISTS(SELECT 1 FROM classroom_followup newer WHERE newer.session_id=? AND newer.student_id=? AND newer.version>?)`).bind(actor,new Date().toISOString(),JSON.stringify(refs),id,sid,actor,row.student_id,sid,row.student_id,row.version).run();if(!result.meta.changes)deny('Follow-up changed. Refresh and retry.',409);return db.prepare('SELECT * FROM classroom_followup WHERE id=?').bind(id).first<Row>();
}
export async function eligibleLesson(db:D1Database,student:string,id:string){
 const lesson=await db.prepare("SELECT l.*,m.course_id FROM academy_lesson l JOIN academy_module m ON m.id=l.module_id JOIN academy_course c ON c.id=m.course_id JOIN student_course_assignment a ON a.course_id=c.id AND a.user_id=? AND a.status='assigned' WHERE l.id=? AND l.status='published' AND m.status='published' AND c.status='published'").bind(student,id).first<Row>();if(!lesson)return false;
 const ordered=(await db.prepare("SELECT l.* FROM academy_lesson l JOIN academy_module m ON m.id=l.module_id WHERE m.course_id=? AND m.status='published' AND l.status='published' ORDER BY m.sort_order,m.id,l.sort_order,l.id").bind(lesson.course_id).all<Row>()).results;
 for(const previous of ordered.slice(0,ordered.findIndex(l=>l.id===id))){if(await isPlacementSkipApproved(db,student,previous.id))continue;const p=await db.prepare("SELECT 1 FROM student_lesson_progress WHERE user_id=? AND lesson_id=? AND status='completed'").bind(student,previous.id).first();if(!p||!await isLearningGateSatisfied(db,student,previous))return false;}
 return true;
}
export async function studentFollowups(db:D1Database,student:string){
 await member(db,student);
 const rows=(await db.prepare(`SELECT f.* FROM classroom_followup f JOIN teaching_enrollment e ON e.session_id=f.session_id AND e.student_id=f.student_id AND e.status='ENROLLED' WHERE f.student_id=? AND f.approved_at IS NOT NULL AND NOT EXISTS(SELECT 1 FROM classroom_followup n WHERE n.session_id=f.session_id AND n.student_id=f.student_id AND n.approved_at IS NOT NULL AND n.version>f.version) ORDER BY f.approved_at DESC,f.id`).bind(student).all<Row>()).results;
 return Promise.all(rows.map(async r=>{const c=JSON.parse(r.content_json) as FollowupContent;const submissions=(await db.prepare('SELECT id,revision,body,submitted_at,review_json FROM classroom_followup_submission WHERE followup_id=? AND student_id=? ORDER BY revision DESC').bind(r.id,student).all<Row>()).results;return {id:r.id,sessionId:r.session_id,version:r.version,approvedAt:r.approved_at,content:c,lessonAvailable:c.lessonId?await eligibleLesson(db,student,c.lessonId):false,submissions:submissions.map(s=>({id:s.id,revision:s.revision,body:s.body,submittedAt:s.submitted_at,review:s.review_json?JSON.parse(s.review_json):null}))};}));
}
export async function submitFollowup(db:D1Database,student:string,id:string,body:string){
 const list=await studentFollowups(db,student),f=list.find(f=>f.id===id);if(!f?.content.task)deny('Task unavailable.',404);
 if(typeof body!=='string'||!body.trim()||body.length>5000)deny('Response required (maximum 5000 characters).',400);
 const latest=f.submissions[0];if(latest&&latest.review?.decision!=='NEEDS_REINFORCEMENT')deny('Task awaiting review or approved.',409);
 const submissionId=crypto.randomUUID(),revision=(latest?.revision??0)+1;
 const result=await db.prepare(`INSERT INTO classroom_followup_submission(id,followup_id,student_id,revision,body,submitted_at) SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM classroom_followup f JOIN user u ON u.id=f.student_id JOIN teaching_enrollment e ON e.session_id=f.session_id AND e.student_id=u.id WHERE f.id=? AND f.student_id=? AND f.approved_at IS NOT NULL AND e.status='ENROLLED' AND u.lifecycle_status='ACTIVE' AND COALESCE(u.banned,0)=0 AND COALESCE(u.must_change_password,0)=0 AND (u.subscriptionStatus IN ('active','trialing') OR (u.complimentaryAccessRevokedAt IS NULL AND julianday(u.complimentaryAccessExpiresAt)>julianday('now') AND (u.complimentaryAccessStartsAt IS NULL OR julianday(u.complimentaryAccessStartsAt)<=julianday('now'))))) AND NOT EXISTS(SELECT 1 FROM classroom_followup n JOIN classroom_followup f ON n.session_id=f.session_id AND n.student_id=f.student_id WHERE f.id=? AND n.approved_at IS NOT NULL AND n.version>f.version)`).bind(submissionId,id,student,revision,body.trim(),new Date().toISOString(),id,student,id).run();if(!result.meta.changes)deny('Task access changed.',409);return {id:submissionId,revision};
}
export async function reviewFollowup(db:D1Database,actor:string,id:string,decision:string,feedback:string){
 const row=await db.prepare('SELECT s.*,f.session_id FROM classroom_followup_submission s JOIN classroom_followup f ON f.id=s.followup_id WHERE s.id=?').bind(id).first<Row>();if(!row)deny('Submission unavailable.',404);await target(db,actor,row.session_id,row.student_id);
 if(!['APPROVED','NEEDS_REINFORCEMENT'].includes(decision)||typeof feedback!=='string'||feedback.length>5000)deny('Invalid review.',400);
 const review={decision,feedback,reviewedBy:actor,reviewedAt:new Date().toISOString()};const result=await db.prepare(`UPDATE classroom_followup_submission SET review_json=? WHERE id=? AND review_json IS NULL AND ${authority}`).bind(JSON.stringify(review),id,row.session_id,actor,row.student_id).run();if(!result.meta.changes)deny('Review already recorded or access changed.',409);
}
export async function prepareHandoff(db:D1Database,actor:string,sid:string){
 const {snapshot}=await teachingAccess(db,actor,sid,true);const roster=(await db.prepare("SELECT u.id,u.name FROM teaching_enrollment e JOIN user u ON u.id=e.student_id WHERE e.session_id=? AND e.status='ENROLLED' ORDER BY u.id").bind(sid).all<Row>()).results;
 const runs=(await db.prepare('SELECT * FROM classroom_activity_run WHERE session_id=? ORDER BY launched_at,id').bind(sid).all<Row>()).results;
 const sessionContext=await db.prepare('SELECT s.lesson_id,s.start_at,s.end_at,l.title AS lesson_title FROM teaching_session s LEFT JOIN academy_lesson l ON l.id=s.lesson_id WHERE s.id=?').bind(sid).first<Row>();
 const guideContext=await db.prepare('SELECT id,version FROM classroom_teaching_guide WHERE session_id=? ORDER BY version DESC LIMIT 1').bind(sid).first<Row>();
 const summary={lessonId:sessionContext?.lesson_id??null,lessonTitle:sessionContext?.lesson_title??null,scheduledStart:sessionContext?.start_at??null,scheduledEnd:sessionContext?.end_at??null,guideVersion:guideContext??null,sessionId:sid,title:snapshot.title,state:snapshot.state,activities:runs.length,students:await Promise.all(roster.map(async u=>{
  const responses=(await db.prepare('SELECT a.*,r.snapshot_json FROM classroom_activity_response a JOIN classroom_activity_run r ON r.id=a.run_id WHERE r.session_id=? AND a.student_id=?').bind(sid,u.id).all<Row>()).results;
  const attendance=(await db.prepare('SELECT * FROM classroom_attendance WHERE session_id=? AND user_id=? ORDER BY joined_at').bind(sid,u.id).all<Row>()).results;
  const followups=(await db.prepare('SELECT * FROM classroom_followup WHERE session_id=? AND student_id=? ORDER BY version DESC').bind(sid,u.id).all<Row>()).results;
  const observations=(await db.prepare("SELECT * FROM classroom_learning_evidence WHERE session_id=? AND student_id=? AND source='INSTRUCTOR_OBSERVATION'").bind(sid,u.id).all<Row>()).results;
  const submissions=(await db.prepare('SELECT s.* FROM classroom_followup_submission s JOIN classroom_followup f ON f.id=s.followup_id WHERE f.session_id=? AND s.student_id=? ORDER BY s.submitted_at DESC').bind(sid,u.id).all<Row>()).results;
  const evidence=(await db.prepare('SELECT id,source,reference,evidence_json,recorded_at,reviewed_by FROM classroom_learning_evidence WHERE session_id=? AND student_id=? ORDER BY recorded_at,id').bind(sid,u.id).all<Row>()).results;
  const durationMinutes=attendance.length?attendance.reduce((sum,a)=>sum+Math.max(0,Date.parse(a.left_at??new Date().toISOString())-Date.parse(a.joined_at))/60000,0):null;
  const concepts=(items:Row[])=>[...new Set(items.map(a=>JSON.parse(a.snapshot_json).conceptId).filter(Boolean))];
  const strengths=concepts(responses.filter(a=>a.correct===1||a.review_json&&JSON.parse(a.review_json).decision==='APPROVED'&&JSON.parse(a.snapshot_json).kind==='WRITTEN'));
  const developmentAreas=concepts(responses.filter(a=>a.correct===0||a.review_json&&JSON.parse(a.review_json).decision==='NEEDS_REINFORCEMENT'));
  const missingEvidence=[...new Set(runs.filter(r=>!responses.some(a=>a.run_id===r.id)||responses.some(a=>a.run_id===r.id&&JSON.parse(r.snapshot_json).kind==='WRITTEN'&&!a.review_json)).map(r=>JSON.parse(r.snapshot_json).conceptId).filter(Boolean))];
  return {id:u.id,name:u.name,attendance,durationMinutes,submissions,evidence,strengths,developmentAreas,missingEvidence,responded:responses.length,missing:Math.max(0,runs.length-responses.length),correct:responses.filter(a=>a.correct===1).length,incorrect:responses.filter(a=>a.correct===0).length,reviewRequired:responses.filter(a=>a.correct===null&&!a.review_json).length,responses,observations,followups,recommendation:responses.some(a=>a.correct===0)?'Review incorrect concepts with the instructor.':responses.length<runs.length?'Missing evidence: further review may be appropriate.':'Instructor review required before follow-up.'};
 }))};
 let handoffVersionId:string|null=null,handoffVersion:number|null=null;
 if(snapshot.state==='ENDED'){
  const source={...summary,students:summary.students.map(({followups,submissions,...stable})=>stable)};
  const serialized=JSON.stringify(source),digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(serialized)))).map(b=>b.toString(16).padStart(2,'0')).join('');
  await db.prepare(`INSERT OR IGNORE INTO classroom_handoff_version(id,session_id,version,source_digest,snapshot_json,created_by,created_at) SELECT ?,?,COALESCE((SELECT MAX(version) FROM classroom_handoff_version WHERE session_id=?),0)+1,?,?,?,? WHERE EXISTS(SELECT 1 FROM teaching_session s JOIN user u ON u.id=s.instructor_id WHERE s.id=? AND u.id=? AND u.role='admin' AND u.lifecycle_status='ACTIVE' AND COALESCE(u.banned,0)=0 AND COALESCE(u.must_change_password,0)=0 AND s.status='CONFIRMED')`).bind(crypto.randomUUID(),sid,sid,digest,serialized,actor,new Date().toISOString(),sid,actor).run();
  const saved=await db.prepare('SELECT id,version FROM classroom_handoff_version WHERE session_id=? AND source_digest=?').bind(sid,digest).first<Row>();if(!saved)deny('Handoff authority changed.',409);handoffVersionId=saved.id;handoffVersion=saved.version;
 }
 return {...summary,handoffVersionId,handoffVersion};
}
