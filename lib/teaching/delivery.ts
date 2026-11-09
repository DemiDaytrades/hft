import 'server-only';
import type {SendResult} from '../communications';
import {expireTeachingRequests} from './service';
import {teachingMessage,type TeachingMessageType} from './messages';
export type TeachingDeliveryPayload={idempotencyKey:string;recipientId:string;to:string;channel:'email'|'sms';message:{subject:string;html:string;text:string;body:string}};
type Options={enabled:boolean;deliver:(payload:TeachingDeliveryPayload)=>Promise<SendResult>;baseUrl:string;limit?:number};
const kinds="('REQUEST_RECEIVED','CONFIRMATION','ALTERNATIVE_PROPOSED','ALTERNATIVE_ACCEPTED','RESCHEDULED','CANCELED','REMINDER_24H','REMINDER_1H')";
const eligibility=`EXISTS(SELECT 1 FROM teaching_session s JOIN user u ON u.id=teaching_outbox.recipient_id
 WHERE s.id=teaching_outbox.session_id AND s.revision=teaching_outbox.revision
 AND ((teaching_outbox.type='REQUEST_RECEIVED' AND s.status='REQUESTED' AND julianday(s.expires_at)>julianday('now'))
 OR (teaching_outbox.type='ALTERNATIVE_PROPOSED' AND s.status='ALTERNATIVE_PROPOSED' AND julianday(s.proposed_expires_at)>julianday('now'))
 OR (teaching_outbox.type='CANCELED' AND s.status IN ('CANCELED_BY_STUDENT','CANCELED_BY_INSTRUCTOR','DECLINED'))
 OR (teaching_outbox.type IN ('CONFIRMATION','ALTERNATIVE_ACCEPTED','RESCHEDULED','REMINDER_24H','REMINDER_1H') AND s.status='CONFIRMED'))
 AND (teaching_outbox.type='CANCELED' OR julianday(s.start_at)>julianday('now'))
 AND EXISTS(SELECT 1 FROM user su WHERE su.id=s.student_id AND su.role='student' AND su.lifecycle_status='ACTIVE' AND COALESCE(su.banned,0)=0 AND COALESCE(su.must_change_password,0)=0
 AND (su.subscriptionStatus IN ('active','trialing') OR (su.complimentaryAccessRevokedAt IS NULL AND julianday(su.complimentaryAccessExpiresAt)>julianday('now') AND (su.complimentaryAccessStartsAt IS NULL OR julianday(su.complimentaryAccessStartsAt)<=julianday('now'))))
 AND EXISTS(SELECT 1 FROM teaching_enrollment se WHERE se.session_id=s.id AND se.student_id=su.id AND (se.status='ENROLLED' OR teaching_outbox.type='CANCELED')))
 AND u.lifecycle_status='ACTIVE' AND COALESCE(u.banned,0)=0 AND COALESCE(u.must_change_password,0)=0
 AND ((u.id=s.instructor_id AND u.role='admin' AND EXISTS(SELECT 1 FROM teaching_config c WHERE c.id='primary' AND c.instructor_id=u.id))
 OR (u.id=s.student_id AND u.role='student' AND EXISTS(SELECT 1 FROM teaching_enrollment e WHERE e.session_id=s.id AND e.student_id=u.id AND (e.status='ENROLLED' OR teaching_outbox.type='CANCELED'))
 AND (u.subscriptionStatus IN ('active','trialing') OR (u.complimentaryAccessRevokedAt IS NULL AND julianday(u.complimentaryAccessExpiresAt)>julianday('now') AND (u.complimentaryAccessStartsAt IS NULL OR julianday(u.complimentaryAccessStartsAt)<=julianday('now'))))))
 AND ((teaching_outbox.channel='email' AND COALESCE(u.email_opted_in,1)=1 AND length(trim(u.email))>0) OR (teaching_outbox.channel='sms' AND u.sms_opted_in=1 AND length(trim(u.phone_number))>0)))
 AND teaching_outbox.type IN ${kinds}
 AND (teaching_outbox.type NOT IN ('REMINDER_24H','REMINDER_1H') OR julianday(teaching_outbox.due_at)>=julianday('now','-2 minutes'))`;
const keySQL="'teaching:'||json_array(session_id,revision,recipient_id,channel,type)";
const at=()=>new Date().toISOString();
/** Claims are durable BEFORE provider invocation. Unknown outcomes never retry. */
export async function processTeachingDelivery(db:D1Database,options:Options){
 const total={sent:0,skipped:0,failed:0,uncertain:0,disabled:!options.enabled};if(!options.enabled)return total;
 const limit=options.limit??25;if(!Number.isInteger(limit)||limit<1||limit>50)throw new Error('Invalid teaching delivery batch limit.');
 // Templates enforce the trusted HFT/local origins and safe route; fail before claims.
 teachingMessage('CONFIRMATION',{recipientName:'',instructorName:'',topic:'',startAt:'2099-01-01T00:00:00Z',timezone:'UTC',dashboardUrl:options.baseUrl.replace(/\/$/,'')+'/lessons'});
 await db.batch([
  db.prepare("UPDATE teaching_delivery_attempt SET state='UNCERTAIN',finished_at=?,error_code='ABANDONED_CLAIM' WHERE state='CLAIMED' AND julianday(created_at)<julianday('now','-5 minutes')").bind(at()),
  db.prepare("UPDATE teaching_outbox SET status='UNCERTAIN' WHERE status='DELIVERING' AND id IN(SELECT job_id FROM teaching_delivery_attempt WHERE state='UNCERTAIN')"),
 ]);
 await expireTeachingRequests(db);
 const rows=(await db.prepare("SELECT id FROM teaching_outbox WHERE status='PENDING' AND julianday(due_at)<=julianday('now') ORDER BY due_at,id LIMIT ?").bind(limit).all<{id:string}>()).results;
 for(const row of rows){
  const token=crypto.randomUUID();const keyRow=await db.prepare(`SELECT ${keySQL} AS key FROM teaching_outbox WHERE id=?`).bind(row.id).first<{key:string}>();if(!keyRow)continue;
  const key=keyRow.key;
  const claim=await db.batch([
   db.prepare(`INSERT INTO teaching_delivery_attempt(job_id,token,state,created_at) SELECT id,?,'CLAIMED',? FROM teaching_outbox WHERE id=? AND status='PENDING' AND (${eligibility}) AND NOT EXISTS(SELECT 1 FROM teaching_delivery_attempt a WHERE a.job_id=teaching_outbox.id) AND NOT EXISTS(SELECT 1 FROM communication_log WHERE idempotency_key=?) ON CONFLICT(job_id) DO NOTHING`).bind(token,at(),row.id,key),
   db.prepare("UPDATE teaching_outbox SET status='DELIVERING',attempts=attempts+1 WHERE id=? AND status='PENDING' AND EXISTS(SELECT 1 FROM teaching_delivery_attempt WHERE job_id=? AND token=? AND state='CLAIMED')").bind(row.id,row.id,token),
  ]);
  if(!claim[0].meta.changes){
   const skipped=await db.prepare("UPDATE teaching_outbox SET status='SKIPPED',attempts=attempts+1 WHERE id=? AND status='PENDING'").bind(row.id).run();total.skipped+=Number(skipped.meta.changes??0);continue;
  }
  // A second eligibility read immediately precedes the external boundary.
  const job=await db.prepare(`SELECT o.recipient_id,o.channel,o.type,u.name AS recipient_name,u.email,u.phone_number,h.name AS instructor_name,s.instructor_id,s.title,s.start_at,s.timezone,s.proposed_start_at,s.status FROM teaching_outbox o JOIN teaching_session s ON s.id=o.session_id JOIN user u ON u.id=o.recipient_id JOIN user h ON h.id=s.instructor_id WHERE o.id=? AND o.status='DELIVERING' AND EXISTS(SELECT 1 FROM teaching_delivery_attempt a WHERE a.job_id=o.id AND a.token=? AND a.state='CLAIMED') AND EXISTS(SELECT 1 FROM teaching_outbox WHERE id=o.id AND (${eligibility}))`).bind(row.id,token).first<Record<string,any>>();
  let state:'SENT'|'SKIPPED'|'FAILED'|'UNCERTAIN'='SKIPPED',providerId:string|null=null,errorCode:string|null=null;
  if(job){
   try{
    const message=teachingMessage(job.type as TeachingMessageType,{recipientName:job.recipient_name,instructorName:job.instructor_name,topic:job.title??'Weekly HFT lesson',startAt:job.start_at,timezone:job.timezone,proposedStartAt:job.proposed_start_at,status:job.status,dashboardUrl:options.baseUrl.replace(/\/$/,'')+(job.recipient_id===job.instructor_id?'/admin/teaching':'/lessons')});
    const result=await options.deliver({idempotencyKey:key,recipientId:job.recipient_id,to:job.channel==='email'?job.email:job.phone_number,channel:job.channel,message});
    providerId=result.providerMessageId??null;
    state=result.uncertain||result.status==='sent'&&!providerId?'UNCERTAIN':result.status==='sent'?'SENT':result.status==='skipped'?'SKIPPED':'FAILED';errorCode=state==='UNCERTAIN'?'PROVIDER_OUTCOME_UNKNOWN':state==='FAILED'?'PROVIDER_REJECTED':null;
   }catch{state='UNCERTAIN';errorCode='DELIVERY_OUTCOME_UNKNOWN';}
  }
  const completed=at();await db.batch([
   db.prepare("UPDATE teaching_delivery_attempt SET state=?,finished_at=?,provider_message_id=?,error_code=? WHERE job_id=? AND token=? AND state='CLAIMED'").bind(state,completed,providerId,errorCode,row.id,token),
   db.prepare("UPDATE teaching_outbox SET status=? WHERE id=? AND status='DELIVERING' AND EXISTS(SELECT 1 FROM teaching_delivery_attempt WHERE job_id=? AND token=? AND state=?)").bind(state,row.id,row.id,token,state),
   db.prepare(`INSERT INTO communication_log(id,user_id,channel,event_type,idempotency_key,provider_message_id,status,error_message,created_at,updated_at) SELECT ?,recipient_id,channel,'teaching',?, ?,?,?,?,? FROM teaching_outbox WHERE id=? AND NOT EXISTS(SELECT 1 FROM communication_log WHERE idempotency_key=?)`).bind(crypto.randomUUID(),key,providerId,state.toLowerCase(),errorCode,completed,completed,row.id,key),
  ]);
  if(state==='SENT')total.sent++;else if(state==='SKIPPED')total.skipped++;else if(state==='FAILED')total.failed++;else total.uncertain++;
 }
 return total;
}
