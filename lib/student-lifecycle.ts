import 'server-only';
import {LIFECYCLE_REASONS,type LifecycleStatus} from './student-lifecycle-contracts';
export {LIFECYCLE_REASONS,type LifecycleStatus} from './student-lifecycle-contracts';
export type LifecycleActor={userId:string;role?:string};
export type LifecycleChange={action:'deactivate'|'reactivate';revision:number;confirmation:string;reason?:string;note?:string;billingChoice?:'access_only'|'cancel_and_deactivate';paidAcknowledged?:boolean};
const uid=()=>crypto.randomUUID().replaceAll('-','');
const fail=(message:string,status=400):never=>{throw Object.assign(new Error(message),{status});};
export async function assertLifecycleActive(db:D1Database,userId:string){
 const row=await db.prepare('SELECT lifecycle_status,banned,role FROM user WHERE id=?').bind(userId).first<{lifecycle_status:string;banned:number;role:string|null}>();
 if(!row||row.lifecycle_status!=='ACTIVE'||row.banned)return fail('Account deactivated or unavailable.',403);
 return row;
}
async function staff(db:D1Database,actor:LifecycleActor){
 const row=await db.prepare('SELECT role,lifecycle_status,banned,must_change_password FROM user WHERE id=?').bind(actor.userId).first<any>();
 if(row?.role!=='admin'||row.lifecycle_status!=='ACTIVE'||row.banned||row.must_change_password)fail('Forbidden: authorized active admin required.',403);
}
async function target(db:D1Database,studentId:string){
 const row=await db.prepare('SELECT id,name,email,role,lifecycle_status,lifecycle_revision,lifecycle_changed_at,subscriptionId,subscriptionStatus,currentPeriodEnd,stripeCustomerId,complimentaryAccessStartsAt,complimentaryAccessExpiresAt,complimentaryAccessRevokedAt FROM user WHERE id=?').bind(studentId).first<any>();
 if(!row)return fail('Student not found.',404);return row;
}
function billing(row:any){return {status:row.subscriptionStatus??null,periodEnd:row.currentPeriodEnd??null,customerLinked:!!row.stripeCustomerId,subscriptionLinked:!!row.subscriptionId,mayContinueCharging:['active','trialing','past_due','unpaid','incomplete'].includes(row.subscriptionStatus)||!!row.subscriptionId&&!['canceled','incomplete_expired'].includes(row.subscriptionStatus),combinedCancellationAvailable:false};}
export async function getLifecycle(db:D1Database,actor:LifecycleActor,studentId:string){
 await staff(db,actor);const row=await target(db,studentId);
 const academyProgress=(await db.prepare('SELECT p.lesson_id,l.title,p.status,p.completed_at,p.updated_at FROM student_lesson_progress p LEFT JOIN academy_lesson l ON l.id=p.lesson_id WHERE p.user_id=? ORDER BY p.updated_at DESC LIMIT 100').bind(studentId).all<any>()).results;
 const events=(await db.prepare('SELECT id,event_type,actor_id,created_at,reason,private_note,previous_state,resulting_state,safe_metadata_json FROM student_lifecycle_event WHERE student_id=? ORDER BY rowid').bind(studentId).all<any>()).results;
 return {student:{id:row.id,name:row.name,email:row.email,role:row.role},status:row.lifecycle_status as LifecycleStatus,revision:row.lifecycle_revision,changedAt:row.lifecycle_changed_at,billing:billing(row),complimentary:{startsAt:row.complimentaryAccessStartsAt,expiresAt:row.complimentaryAccessExpiresAt,revokedAt:row.complimentaryAccessRevokedAt},academyProgress,events};
}
export async function changeLifecycle(db:D1Database,actor:LifecycleActor,studentId:string,input:LifecycleChange){
 await staff(db,actor);const row=await target(db,studentId);
 if(row.role==='admin'||actor.userId===studentId)fail('Cannot change your own or another staff account through student lifecycle.');
 if(!input||!['deactivate','reactivate'].includes(input.action)||!Number.isSafeInteger(input.revision))fail('Invalid lifecycle action/revision.');
 const next=input.action==='deactivate'?'DEACTIVATED':'ACTIVE',previous=input.action==='deactivate'?'ACTIVE':'DEACTIVATED';
 const confirmation=`${input.action==='deactivate'?'DEACTIVATE':'REACTIVATE'} ${row.email}`;
 if(input.confirmation!==confirmation)fail('Type the exact confirmation phrase.');
 if(input.reason&&!LIFECYCLE_REASONS.includes(input.reason as any)||input.note!==undefined&&(typeof input.note!=='string'||input.note.length>4000))fail('Invalid reason or private note.');
 if(input.action==='deactivate'){
  if(input.billingChoice!=='access_only')fail('Combined billing cancellation is unavailable; explicitly choose HFT access only.');
  if(billing(row).mayContinueCharging&&input.paidAcknowledged!==true)fail('Acknowledge that paid billing is unchanged and may continue charging.');
 }
 if(row.lifecycle_status!==previous||row.lifecycle_revision!==input.revision)fail('Lifecycle changed; reload the current revision.',409);
 const operation=uid(),at=new Date().toISOString();
 const condition='EXISTS(SELECT 1 FROM user WHERE id=? AND lifecycle_operation_id=?)';
 const statements=[db.prepare(`UPDATE user SET lifecycle_status=?,lifecycle_revision=lifecycle_revision+1,lifecycle_changed_at=?,lifecycle_changed_by=?,lifecycle_operation_id=?,updatedAt=? WHERE id=? AND lifecycle_status=? AND lifecycle_revision=? AND COALESCE(role,'student')<>'admin' AND subscriptionStatus IS ? AND subscriptionId IS ? AND EXISTS(SELECT 1 FROM user actor WHERE actor.id=? AND actor.role='admin' AND actor.lifecycle_status='ACTIVE' AND COALESCE(actor.banned,0)=0 AND COALESCE(actor.must_change_password,0)=0)`).bind(next,at,actor.userId,operation,at,studentId,previous,input.revision,row.subscriptionStatus,row.subscriptionId,actor.userId)];
 if(next==='DEACTIVATED'){
  statements.push(db.prepare(`DELETE FROM session WHERE userId=? AND ${condition}`).bind(studentId,studentId,operation));
  statements.push(db.prepare(`UPDATE invite SET expiresAt=? WHERE usedAt IS NULL AND (email=? OR userId=?) AND ${condition}`).bind(at,row.email,studentId,studentId,operation));
 }
 statements.push(db.prepare(`INSERT INTO student_lifecycle_event(id,student_id,actor_id,event_type,created_at,reason,private_note,previous_state,resulting_state,safe_metadata_json) SELECT ?,?,?,?,?,?,?,?,?,? WHERE ${condition}`).bind(operation,studentId,actor.userId,next==='DEACTIVATED'?'STUDENT_DEACTIVATED':'STUDENT_REACTIVATED',at,input.reason??null,input.note??'',previous,next,JSON.stringify({billing:'UNCHANGED',subscriptionStatus:row.subscriptionStatus??null,complimentaryExpiresAt:row.complimentaryAccessExpiresAt??null,membershipType:[row.subscriptionId||row.subscriptionStatus?'Paid membership':null,row.complimentaryAccessExpiresAt?'Complimentary grant':null].filter(Boolean).join(' + ')||'No entitlement record',entitlement:'PRESERVED'}),studentId,operation));
 const results=await db.batch(statements);
 if(!results[0].meta.changes)fail('Lifecycle changed; reload.',409);
 return getLifecycle(db,actor,studentId);
}
export type DeletionImpact={label:string;count:number|null;category:'CAN DELETE'|'MUST RETAIN'|'REQUIRES POLICY DECISION'|'EXTERNAL SYSTEM / STRIPE';note:string};
/** Read-only impact inventory. There is deliberately no hard-delete executor. */
export async function previewDeletion(db:D1Database,actor:LifecycleActor,studentId:string){
 await staff(db,actor);const user=await target(db,studentId);
 const entries:Array<[string,string,unknown[],DeletionImpact['category']]>=[
 ['Account identity','SELECT COUNT(*) AS n FROM user WHERE id=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Credential records (no secrets shown)','SELECT COUNT(*) AS n FROM account WHERE userId=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Sessions','SELECT COUNT(*) AS n FROM session WHERE userId=?',[studentId],'CAN DELETE'],
 ['Complimentary grant','SELECT COUNT(*) AS n FROM user WHERE id=? AND complimentaryAccessExpiresAt IS NOT NULL',[studentId],'MUST RETAIN'],
 ['Invitations','SELECT COUNT(*) AS n FROM invite WHERE email=? OR userId=?',[user.email,studentId],'REQUIRES POLICY DECISION'],
 ['Academy course assignments','SELECT COUNT(*) AS n FROM student_course_assignment WHERE user_id=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Academy lesson progress','SELECT COUNT(*) AS n FROM student_lesson_progress WHERE user_id=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Learning activity evidence','SELECT COUNT(*) AS n FROM academy_learning_event WHERE user_id=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Quiz attempts','SELECT COUNT(*) AS n FROM student_quiz_attempt WHERE user_id=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Quiz responses','SELECT COUNT(*) AS n FROM student_quiz_response WHERE attempt_id IN(SELECT id FROM student_quiz_attempt WHERE user_id=?)',[studentId],'REQUIRES POLICY DECISION'],
 ['Quiz topic aggregates','SELECT COUNT(*) AS n FROM quiz_topic_aggregate WHERE user_id=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Homework submissions','SELECT COUNT(*) AS n FROM student_assignment_submission WHERE user_id=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Homework review/revision history','SELECT COUNT(*) AS n FROM assignment_submission_history WHERE submission_id IN(SELECT id FROM student_assignment_submission WHERE user_id=?)',[studentId],'REQUIRES POLICY DECISION'],
 ['Checkpoint progress','SELECT COUNT(*) AS n FROM student_checkpoint_progress WHERE user_id=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Instructor sessions','SELECT COUNT(*) AS n FROM instructor_session WHERE student_id=? OR instructor_id=?',[studentId,studentId],'REQUIRES POLICY DECISION'],
 ['Legacy intake','SELECT COUNT(*) AS n FROM student_intake WHERE userId=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Intake V2 sources','SELECT COUNT(*) AS n FROM student_intake_v2 WHERE student_user_id=?',[studentId],'MUST RETAIN'],
 ['Intake V2 audit events','SELECT COUNT(*) AS n FROM student_intake_v2_event WHERE intake_id IN(SELECT id FROM student_intake_v2 WHERE student_user_id=?) OR actor_user_id=?',[studentId,studentId],'MUST RETAIN'],
 ['Consultation questionnaires','SELECT COUNT(*) AS n FROM consultation_questionnaire WHERE user_id=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Questionnaire revisions','SELECT COUNT(*) AS n FROM consultation_questionnaire_revision WHERE user_id=?',[studentId],'MUST RETAIN'],
 ['Financial plan series','SELECT COUNT(*) AS n FROM financial_plan_series WHERE student_id=?',[studentId],'MUST RETAIN'],
 ['Financial plan versions','SELECT COUNT(*) AS n FROM financial_plan_version WHERE series_id IN(SELECT id FROM financial_plan_series WHERE student_id=?)',[studentId],'MUST RETAIN'],
 ['Financial plan lifecycle events','SELECT COUNT(*) AS n FROM financial_plan_event WHERE plan_id IN(SELECT v.id FROM financial_plan_version v JOIN financial_plan_series s ON s.id=v.series_id WHERE s.student_id=?) OR actor_id=?',[studentId,studentId],'MUST RETAIN'],
 ['Legacy Game Plan series','SELECT COUNT(*) AS n FROM consultation_game_plan_series WHERE user_id=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Legacy Game Plan versions','SELECT COUNT(*) AS n FROM consultation_game_plan_version WHERE user_id=?',[studentId],'MUST RETAIN'],
 ['Legacy Training Plans','SELECT COUNT(*) AS n FROM student_training_plan WHERE userId=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Placement assessment attempts','SELECT COUNT(*) AS n FROM placement_assessment_attempt WHERE userId=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Student placement','SELECT COUNT(*) AS n FROM student_placement WHERE userId=?',[studentId],'REQUIRES POLICY DECISION'],
 ['Consultations','SELECT COUNT(*) AS n FROM consultation_booking WHERE user_id=? OR customer_email=?',[studentId,user.email],'MUST RETAIN'],
 ['Communications metadata','SELECT COUNT(*) AS n FROM communication_log WHERE user_id=? OR idempotency_key IN(SELECT communication_key FROM complimentary_invite_delivery WHERE email=? OR user_id=?)',[studentId,user.email,studentId],'MUST RETAIN'],
 ['Invitation delivery attempts','SELECT COUNT(*) AS n FROM complimentary_invite_delivery WHERE email=? OR user_id=?',[user.email,studentId],'MUST RETAIN'],
 ['Lifecycle audit events','SELECT COUNT(*) AS n FROM student_lifecycle_event WHERE student_id=? OR actor_id=?',[studentId,studentId],'MUST RETAIN'],
 ['Affiliate commissions','SELECT COUNT(*) AS n FROM commission WHERE memberId=? OR affiliateId IN(SELECT id FROM affiliate WHERE userId=?)',[studentId,studentId],'MUST RETAIN'],
 ];
 const items:DeletionImpact[]=[];
 for(const [label,sql,args,category] of entries){const row=await db.prepare(sql).bind(...args as any[]).first<{n:number}>();items.push({label,count:row?.n??0,category,note:category==='CAN DELETE'?'Session revocation is supported; no permanent data deletion executes here.':category==='MUST RETAIN'?'Retain until an explicit approved retention policy resolves payment/audit/history obligations.':'Ownership, retention, anonymization and relational policy must be approved first.'});}
 items.push({label:'Stripe customer/subscription/payment records',count:null,category:'EXTERNAL SYSTEM / STRIPE',note:'No live lookup or cancellation. Linked billing must be reviewed separately; deactivation never changes Stripe.'});
 return {student:{id:user.id,name:user.name,email:user.email},executionEnabled:false,items,blockers:['No approved financial/payment/audit/communications retention policy.','No approved anonymization/cascade/external-system deletion plan.','No permanent deletion executor is enabled.']};
}
export async function requestDeletionPreview(db:D1Database,actor:LifecycleActor,studentId:string,confirmation:string){
 await staff(db,actor);const user=await target(db,studentId);
 if(user.role==='admin'||actor.userId===studentId)fail('Staff/self deletion is not supported by student lifecycle.');
 if(confirmation!==`PREVIEW PERMANENT DELETE ${user.email}`)fail('Type the exact deletion-preview confirmation phrase.');
 const preview=await previewDeletion(db,actor,studentId);
 await db.prepare('INSERT INTO student_lifecycle_event(id,student_id,actor_id,event_type,created_at,reason,previous_state,resulting_state,safe_metadata_json) VALUES(?,?,?,?,?,?,?,?,?)').bind(uid(),studentId,actor.userId,'PERMANENT_DELETION_REQUESTED',new Date().toISOString(),'Impact preview only',user.lifecycle_status,user.lifecycle_status,JSON.stringify({executionEnabled:false})).run();
 return preview;
}
