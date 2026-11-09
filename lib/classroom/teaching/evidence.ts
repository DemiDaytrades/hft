import {DOMAINS,type Evidence,type Domain} from '../../learning-path/contracts';
import {teachingAccess,deny} from './access';
type Row=Record<string,any>;
export async function reviewActivityResponse(db:D1Database,actor:string,sid:string,runId:string,student:string,decision:string,feedback:string){
 await teachingAccess(db,actor,sid,true);
 if(!['APPROVED','NEEDS_REINFORCEMENT'].includes(decision)||typeof feedback!=='string'||feedback.length>5000)deny('Invalid review.',400);
 const row=await db.prepare('SELECT a.*,r.snapshot_json,r.closed_at,r.closes_at FROM classroom_activity_response a JOIN classroom_activity_run r ON r.id=a.run_id WHERE r.id=? AND r.session_id=? AND a.student_id=?').bind(runId,sid,student).first<Row>();if(!row)deny('Response unavailable.',404);
 const snapshot=await teachingAccess(db,actor,sid,true);if(snapshot.snapshot.state!=='ENDED'&&!row.closed_at&&(!row.closes_at||Date.parse(row.closes_at)>Date.now()))deny('Close activity before reviewing.',409);
 if(row.review_json)deny('Response already reviewed.',409);
 const def=JSON.parse(row.snapshot_json),review={decision,feedback,reviewedBy:actor,reviewedAt:new Date().toISOString(),responseRevision:row.revision};
 const contextOnly=def.kind==='POLL'||decision!=='APPROVED'||row.correct===0;
 const e={id:`live:${runId}:${student}`,source:def.kind==='POLL'?'LIVE_CLASS_POLL':def.kind==='WRITTEN'?'LIVE_CLASS_WRITTEN_RESPONSE':'LIVE_CLASS_POP_QUIZ',domain:def.domain,scope:'CONCEPT',level:def.kind==='WRITTEN'&&decision==='APPROVED'?'CAN_APPLY_CONCEPT':'KNOWS_CONCEPT',reference:runId,summary:feedback||`${def.prompt}: ${decision}`,recordedAt:review.reviewedAt,verifiedBy:actor,contextOnly,result:decision==='NEEDS_REINFORCEMENT'||row.correct===0?'NEEDS_REINFORCEMENT':'POSITIVE',provenance:{sessionId:sid,runId,studentId:student,conceptId:def.conceptId??null,stage:def.stage??null,sourceId:def.sourceId??'AD_HOC',sourceVersion:def.sourceVersion??'1',evaluation:def.kind==='WRITTEN'?'INSTRUCTOR_REVIEW':def.kind==='POLL'?'UNSCORED':'EXACT_SET',responseRevision:row.revision}};
 const authority=`EXISTS(SELECT 1 FROM teaching_session s JOIN user u ON u.id=s.instructor_id JOIN teaching_enrollment t ON t.session_id=s.id AND t.student_id=? AND t.status='ENROLLED' WHERE s.id=? AND u.id=? AND u.role='admin' AND u.lifecycle_status='ACTIVE' AND COALESCE(u.banned,0)=0 AND COALESCE(u.must_change_password,0)=0 AND s.status='CONFIRMED')`;
 try{await db.batch([
 db.prepare(`INSERT INTO classroom_learning_evidence(id,session_id,student_id,source,reference,evidence_json,recorded_at,reviewed_by) VALUES(?,?,?,?,?,CASE WHEN ${authority} AND EXISTS(SELECT 1 FROM classroom_activity_response WHERE run_id=? AND student_id=? AND revision=? AND review_json IS NULL) THEN ? ELSE NULL END,?,?)`).bind(e.id,sid,student,e.source,runId,student,sid,actor,runId,student,row.revision,JSON.stringify(e),review.reviewedAt,actor),
 db.prepare('UPDATE classroom_activity_response SET review_json=? WHERE run_id=? AND student_id=? AND revision=? AND review_json IS NULL').bind(JSON.stringify(review),runId,student,row.revision),
 ]);}catch{deny('Review changed. Refresh and retry.',409);}
 const written=await db.prepare('SELECT review_json FROM classroom_activity_response WHERE run_id=? AND student_id=?').bind(runId,student).first<Row>();if(written?.review_json!==JSON.stringify(review))deny('Review authority changed.',409);
}
export async function readLiveEvidence(db:D1Database,student:string):Promise<Evidence[]>{
 const rows=(await db.prepare('SELECT e.* FROM classroom_learning_evidence e JOIN user u ON u.id=e.reviewed_by WHERE e.student_id=? AND e.reviewed_by IS NOT NULL AND u.role=\'admin\' ORDER BY e.recorded_at,e.id').bind(student).all<Row>()).results;
 return rows.map(r=>JSON.parse(r.evidence_json)).filter(e=>DOMAINS.includes(e.domain as Domain)).map(e=>({...e,contextOnly:e.contextOnly===true||['LIVE_CLASS_POLL','INSTRUCTOR_OBSERVATION'].includes(e.source)||e.result!=='POSITIVE'}));
}
