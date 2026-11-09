import type {TeachingMessageType} from './messages';
export function teachingNotificationStatements(db:D1Database,sid:string,revision:number,at:string,types:TeachingMessageType[],eventId:string|null=null){
 const statements:D1PreparedStatement[]=[];
 for(const channel of ['email','sms'])for(const type of types){
  const minutes=type==='REMINDER_24H'?1440:type==='REMINDER_1H'?60:0;
  statements.push(db.prepare(`INSERT INTO teaching_outbox(id,session_id,revision,recipient_id,channel,type,due_at,status,attempts)
   SELECT lower(hex(randomblob(16))),s.id,s.revision,u.id,?,?,CASE WHEN ?=0 THEN ? ELSE strftime('%Y-%m-%dT%H:%M:%fZ',s.start_at,?) END,'PENDING',0
   FROM teaching_session s JOIN user u ON u.id=s.student_id OR u.id=s.instructor_id
   WHERE s.id=? AND s.revision=? AND (? IS NULL OR EXISTS(SELECT 1 FROM teaching_event WHERE id=?)) AND (?=0 OR julianday(s.start_at,?)>julianday(?))`).bind(channel,type,minutes,at,`-${minutes} minutes`,sid,revision,eventId,eventId,minutes,`-${minutes} minutes`,at));
 }
 return statements;
}
