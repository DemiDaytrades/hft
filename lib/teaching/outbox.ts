import 'server-only';
import {expireTeachingRequests} from './service';

// Phase A deliberately has no delivery adapter, provider import or callback.
// This eligibility predicate is evaluated by SQLite in the claiming UPDATE,
// rather than trusting the earlier candidate read.
const eligible = `EXISTS (
 SELECT 1 FROM teaching_session s JOIN user u ON u.id=teaching_outbox.recipient_id
 WHERE s.id=teaching_outbox.session_id AND s.revision=teaching_outbox.revision
 AND s.status='CONFIRMED' AND julianday(s.start_at)>julianday('now')
 AND u.lifecycle_status='ACTIVE' AND COALESCE(u.banned,0)=0 AND COALESCE(u.must_change_password,0)=0
 AND (
  (u.id=s.instructor_id AND u.role='admin' AND EXISTS(SELECT 1 FROM teaching_config c WHERE c.id='primary' AND c.instructor_id=u.id))
  OR (u.role='student' AND EXISTS(SELECT 1 FROM teaching_enrollment e WHERE e.session_id=s.id AND e.student_id=u.id AND e.status='ENROLLED')
   AND (u.subscriptionStatus IN ('active','trialing') OR
    (u.complimentaryAccessRevokedAt IS NULL AND julianday(u.complimentaryAccessExpiresAt)>julianday('now')
     AND (u.complimentaryAccessStartsAt IS NULL OR julianday(u.complimentaryAccessStartsAt)<=julianday('now')))))
 )
 AND ((teaching_outbox.channel='email' AND COALESCE(u.email_opted_in,1)=1 AND length(trim(u.email))>0)
  OR (teaching_outbox.channel='sms' AND u.sms_opted_in=1 AND length(trim(u.phone_number))>0))
) AND teaching_outbox.type IN ('CONFIRMATION','REMINDER_24H','REMINDER_1H')
AND NOT EXISTS (SELECT 1 FROM communication_log l WHERE l.idempotency_key=
 'teaching:'||json_array(teaching_outbox.session_id,teaching_outbox.revision,teaching_outbox.recipient_id,teaching_outbox.channel,teaching_outbox.type))`;

/** Atomically persists mock outcomes only. No production delivery is available. */
export async function processTeachingOutboxMock(db:D1Database, limit=50):Promise<{mocked:number;skipped:number}>{
 if(!Number.isInteger(limit)||limit<1||limit>500)throw new Error('Outbox limit must be a whole number between 1 and 500.');
 // Pending alternatives pause reminders until a decision or durable expiry.
 // Run expiry here as well so restoration never depends on a dashboard visit.
 await expireTeachingRequests(db);
 const rows=(await db.prepare(`SELECT id,attempts FROM teaching_outbox WHERE status='PENDING' AND julianday(due_at)<=julianday('now') ORDER BY due_at,id LIMIT ?`).bind(limit).all<{id:string;attempts:number}>()).results;
 const total={mocked:0,skipped:0};
 for(const row of rows){
  const at=new Date().toISOString();
  // D1 batch is transactional: a failure rolls back both outcome and log.
  // changes() ties the log to this worker's immediately preceding atomic claim.
  // Competing workers cannot repeat that transition, and no PROCESSING lease
  // can be stranded between runs. The key includes the complete job identity.
  const results=await db.batch([
   db.prepare(`UPDATE teaching_outbox SET status='MOCKED',attempts=attempts+1 WHERE id=? AND status='PENDING' AND attempts=? AND julianday(due_at)<=julianday('now') AND (${eligible})`).bind(row.id,row.attempts),
   db.prepare(`INSERT INTO communication_log(id,user_id,channel,event_type,idempotency_key,status,created_at,updated_at)
    SELECT 'teaching_mock_'||id,recipient_id,channel,'teaching_'||type,
     'teaching:'||json_array(session_id,revision,recipient_id,channel,type),'mocked',?,?
    FROM teaching_outbox WHERE id=? AND status='MOCKED' AND changes()=1`).bind(at,at,row.id),
   db.prepare(`UPDATE teaching_outbox SET status='SKIPPED',attempts=attempts+1 WHERE id=? AND status='PENDING' AND attempts=? AND julianday(due_at)<=julianday('now') AND NOT (${eligible})`).bind(row.id,row.attempts),
  ]);
  total.mocked+=Number(results[0].meta.changes??0);total.skipped+=Number(results[2].meta.changes??0);
 }
 return total;
}
