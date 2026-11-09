import 'server-only';
import {hasStudentAccess} from '../membership-access';
import {localInstants,localDate,addDays,weekKey} from './time';
import {teachingNotificationStatements} from './notifications';
import type {TeachingMessageType} from './messages';
import {bookingHorizonDate,bookingTimeAllowed} from './booking-window';

type Row = Record<string, any>;
export type TeachingActor = {id:string;role:string;name:string};
const ACTIVE = "('REQUESTED','ALTERNATIVE_PROPOSED','CONFIRMED')";
const stamp=()=>new Date().toISOString();
const uid=()=>crypto.randomUUID();
export function teachingError(message:string,status=400):never {throw Object.assign(new Error(message),{status});}
const num=(v:unknown,min:number,max:number)=>{if(!Number.isInteger(v)||Number(v)<min||Number(v)>max)teachingError(`Enter a whole number between ${min} and ${max}.`);return Number(v);};
const text=(v:unknown,max=200)=>{if(typeof v!=='string'||v.length>max)teachingError('Invalid text.');return v.trim();};
const dateCheck=(s:unknown)=>{const v=text(s,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||new Date(v+'T12:00:00Z').toISOString().slice(0,10)!==v)teachingError('Invalid date.');return v;};
const timeCheck=(s:unknown)=>{const v=text(s,5);if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v))teachingError('Invalid time.');return v;};
export async function teachingActor(db:D1Database,id:string):Promise<TeachingActor>{
 const u=await db.prepare('SELECT * FROM user WHERE id=?').bind(id).first<Row>();
 if(!u||u.lifecycle_status!=='ACTIVE'||u.banned||u.must_change_password)teachingError('Active account and completed password setup required.',403);
 if(u.role!=='admin'&&!hasStudentAccess(u))teachingError('Active membership required.',403);
 return {id:u.id,role:u.role,name:u.name};
}
async function configFor(db:D1Database){return db.prepare("SELECT * FROM teaching_config WHERE id='primary'").first<Row>();}
function ownConfig(actor:TeachingActor,c:Row|null){if(actor.role!=='admin'||(c&&c.instructor_id!==actor.id))teachingError('Assigned instructor only.',403);}
async function sessionFor(db:D1Database,a:TeachingActor,id:unknown){const s=await db.prepare('SELECT * FROM teaching_session WHERE id=?').bind(text(id)).first<Row>();if(!s||(a.id!==s.student_id&&!(a.role==='admin'&&a.id===s.instructor_id)))teachingError('Session unavailable.',404);return s!;}
function isHeld(s:Row,now:string){return s.status==='CONFIRMED'||s.base_status==='CONFIRMED'&&s.status==='ALTERNATIVE_PROPOSED'||ACTIVE.includes(`'${s.status}'`)&&s.expires_at>now;}
function candidateRanges(s:Row,now:string){const ranges:{start:string;end:string}[]=[];if(isHeld(s,now))ranges.push({start:s.start_at,end:s.end_at});if(s.status==='ALTERNATIVE_PROPOSED'&&s.proposed_expires_at>now)ranges.push({start:s.proposed_start_at,end:s.proposed_end_at});return ranges;}

/** Lazy expiry is durable and cancels queued reminders without deleting history. */
export async function expireTeachingRequests(db:D1Database){
 const at=stamp();const expired=(await db.prepare(`SELECT * FROM teaching_session WHERE ((status='REQUESTED' AND expires_at<=?) OR (status='ALTERNATIVE_PROPOSED' AND proposed_expires_at<=?)) AND NOT EXISTS(SELECT 1 FROM teaching_outbox o WHERE o.session_id=teaching_session.id AND o.status='DELIVERING')`).bind(at,at).all<Row>()).results;
 for(const s of expired){
  const keep=s.status==='ALTERNATIVE_PROPOSED'&&s.base_status==='CONFIRMED';const expiryEvent=uid();
  await db.batch([
   db.prepare(`UPDATE teaching_session SET status=?,base_status=?,proposed_start_at=NULL,proposed_end_at=NULL,proposed_expires_at=NULL,proposal_by=NULL,revision=revision+1,updated_at=? WHERE id=? AND revision=? AND NOT EXISTS(SELECT 1 FROM teaching_outbox o WHERE o.session_id=teaching_session.id AND o.status='DELIVERING')`).bind(keep?'CONFIRMED':'EXPIRED',keep?'CONFIRMED':'REQUESTED',at,s.id,s.revision),
   db.prepare(`INSERT INTO teaching_event(id,session_id,actor_id,action,revision,detail_json,created_at) SELECT ?,id,instructor_id,'EXPIRED',revision,?,? FROM teaching_session WHERE id=? AND revision=? AND changes()=1`).bind(expiryEvent,JSON.stringify({previous:s}),at,s.id,s.revision+1),
   db.prepare(`UPDATE teaching_outbox SET status='CANCELED' WHERE session_id=? AND status='PENDING' AND revision<>(SELECT revision FROM teaching_session WHERE id=?)`).bind(s.id,s.id),
   ...(keep?outboxStatements(db,s.id,s.revision+1,at,false,expiryEvent):[]),
  ]);
 }
}
async function suggestion(db:D1Database,studentId:string){
 return db.prepare(`SELECT l.id,l.title FROM learning_path_series ps JOIN learning_path_version v ON v.id=ps.current_version_id AND v.series_id=ps.id AND v.status='APPROVED' JOIN learning_path_decision d ON d.version_id=v.id AND d.action<>'SKIP' JOIN academy_lesson l ON l.id=d.lesson_id AND l.status='published' JOIN academy_module m ON m.id=l.module_id AND m.status='published' JOIN academy_course c ON c.id=m.course_id AND c.status='published' WHERE ps.student_id=? AND EXISTS(SELECT 1 FROM student_course_assignment ca WHERE ca.user_id=ps.student_id AND ca.course_id=c.id) AND NOT EXISTS(SELECT 1 FROM student_lesson_progress p WHERE p.user_id=ps.student_id AND p.lesson_id=l.id AND p.status='completed') ORDER BY CASE WHEN l.id=json_extract(v.student_json,'$.startingPoint.id') THEN 0 ELSE 1 END,c.sort_order,m.sort_order,l.sort_order,l.id LIMIT 1`).bind(studentId).first<Row>();
}
async function limitFor(db:D1Database,c:Row,studentId:string){const r=await db.prepare('SELECT weekly_limit FROM teaching_allowance WHERE student_id=?').bind(studentId).first<Row>();return r?.weekly_limit??c.weekly_allowance;}
function weekBounds(iso:string,zone:string){const start=weekKey(iso,zone);return [localInstants(start,'00:00',zone)[0],localInstants(addDays(start,7),'00:00',zone)[0]];}
async function allowanceAvailable(db:D1Database,c:Row,studentId:string,start:string,ignoreId=''){
 const [lo,hi]=weekBounds(start,c.timezone);const rows=(await db.prepare(`SELECT * FROM teaching_session WHERE student_id=? AND id<>? AND status IN ${ACTIVE}`).bind(studentId,ignoreId).all<Row>()).results;
 const used=rows.filter(s=>candidateRanges(s,stamp()).some(r=>r.start>=lo&&r.start<hi)).length;
 return used<await limitFor(db,c,studentId);
}
export async function teachingSlots(db:D1Database,a:TeachingActor,c:Row,date:string,session?:Row){
 dateCheck(date);const now=Date.now(),today=localDate(new Date(now).toISOString(),c.timezone);if(date<today||date>bookingHorizonDate(c as any,now))return [];
 const studentId=session?.student_id??a.id;
 if(!await allowanceAvailable(db,c,studentId,localInstants(date,'12:00',c.timezone)[0],session?.id))return [];
 const override=await db.prepare('SELECT * FROM teaching_override WHERE instructor_id=? AND date=?').bind(c.instructor_id,date).first<Row>();
 if(override?.blocked)return [];
 const rules=override?[override]:(await db.prepare('SELECT * FROM teaching_availability WHERE instructor_id=? AND day_of_week=? ORDER BY start_time').bind(c.instructor_id,new Date(date+'T12:00:00Z').getUTCDay()).all<Row>()).results;
 const busy=(await db.prepare('SELECT * FROM teaching_calendar_busy WHERE id<>?').bind(session?.id??'').all<Row>()).results;
 if(busy.some(b=>b.start_epoch===null||b.end_epoch===null))return [];
 const slots:Row[]=[];for(const rule of rules){
  const minutes=(v:string)=>Number(v.slice(0,2))*60+Number(v.slice(3));
  for(let m=minutes(rule.start_time);m+c.duration_min<=minutes(rule.end_time);m+=15){
   const t=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');const instants=localInstants(date,t,c.timezone);
   if(instants.length!==1)continue;const start=instants[0],end=new Date(Date.parse(start)+c.duration_min*60000).toISOString();
   // Reject a session crossing the edge of the local availability window or a DST fold.
   const endLocal=new Intl.DateTimeFormat('en-GB',{timeZone:c.timezone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(end));
   if(localDate(end,c.timezone)!==date||endLocal>rule.end_time||!bookingTimeAllowed(start,c as any,now))continue;
   const from=Date.parse(start)/1000,to=Date.parse(end)/1000;
   if(busy.some(b=>from<Number(b.end_epoch)+Math.max(c.buffer_min,Number(b.buffer_min))*60&&to+Math.max(c.buffer_min,Number(b.buffer_min))*60>Number(b.start_epoch)))continue;
   slots.push({id:`${date}/${c.revision}/${start}`,start_at:start,end_at:end,timezone:c.timezone});
  }
 }
 return slots.filter((s,i)=>slots.findIndex(x=>x.id===s.id)===i);
}
export async function teachingSnapshot(db:D1Database,actorId:string,date?:string,sessionId?:string){
 const a=await teachingActor(db,actorId);await expireTeachingRequests(db);const c=await configFor(db);
 if(a.role==='admin'&&c)ownConfig(a,c);
 const sessions=(await db.prepare(`SELECT s.*,student.name AS student_name,host.name AS instructor_name FROM teaching_session s LEFT JOIN user student ON student.id=s.student_id JOIN user host ON host.id=s.instructor_id WHERE ${a.role==='admin'?'s.instructor_id':'s.student_id'}=? ORDER BY s.start_at DESC`).bind(a.id).all<Row>()).results;
 const scoped=sessionId?await sessionFor(db,a,sessionId):undefined;
 const admin=a.role==='admin';
 return {admin,userId:a.id,config:c,sessions,availability:c?(await db.prepare('SELECT * FROM teaching_availability WHERE instructor_id=? ORDER BY day_of_week,start_time').bind(c.instructor_id).all<Row>()).results:[],overrides:c?(await db.prepare('SELECT * FROM teaching_override WHERE instructor_id=? ORDER BY date').bind(c.instructor_id).all<Row>()).results:[],students:admin?(await db.prepare(`SELECT u.id,u.name,a.weekly_limit FROM user u LEFT JOIN teaching_allowance a ON a.student_id=u.id WHERE u.role='student' AND u.lifecycle_status='ACTIVE' AND COALESCE(u.banned,0)=0 ORDER BY u.name`).all<Row>()).results:[],suggestedLesson:admin?null:await suggestion(db,a.id),...(date&&c?{slots:await teachingSlots(db,a,c,date,scoped)}:{})};
}

// These predicates run inside the same transaction as every durable command.
const accountSQL=(alias='u')=>`${alias}.lifecycle_status='ACTIVE' AND COALESCE(${alias}.banned,0)=0 AND COALESCE(${alias}.must_change_password,0)=0 AND (${alias}.role='admin' OR ${alias}.subscriptionStatus IN ('active','trialing') OR (${alias}.complimentaryAccessRevokedAt IS NULL AND julianday(${alias}.complimentaryAccessExpiresAt)>julianday('now') AND (${alias}.complimentaryAccessStartsAt IS NULL OR julianday(${alias}.complimentaryAccessStartsAt)<=julianday('now'))))`;
function allowanceGuard(c:Row,studentId:string,start:string,ignore:string){
 const [lo,hi]=weekBounds(start,c.timezone);
 return {sql:`(SELECT COUNT(*) FROM teaching_session s WHERE s.student_id=? AND s.id<>? AND s.status IN ${ACTIVE} AND ((s.start_at>=? AND s.start_at<? AND (s.status='CONFIRMED' OR s.base_status='CONFIRMED' OR julianday(s.expires_at)>julianday('now'))) OR (s.proposed_start_at>=? AND s.proposed_start_at<? AND julianday(s.proposed_expires_at)>julianday('now')))) < COALESCE((SELECT weekly_limit FROM teaching_allowance WHERE student_id=?), (SELECT weekly_allowance FROM teaching_config WHERE id='primary'))`,args:[studentId,ignore,lo,hi,lo,hi,studentId]};
}
export async function teachingCommand(db:D1Database,actorId:string,input:Row){
 const a=await teachingActor(db,actorId);const key=text(input.requestKey,100);if(key.length<8)teachingError('Request key required.');
 const body=JSON.stringify(Object.fromEntries(Object.entries(input).sort(([a],[b])=>a.localeCompare(b))));
 const previous=await db.prepare('SELECT * FROM teaching_command WHERE actor_id=? AND request_key=?').bind(a.id,key).first<Row>();
 if(previous){if(previous.body_json!==body)teachingError('Request key already used for a different command.',409);return teachingSnapshot(db,a.id);}
 await expireTeachingRequests(db);let c=await configFor(db);const at=stamp();const action=text(input.action,30);const writes:D1PreparedStatement[]=[];let sid:string|null=null;let guard='1';let guardArgs:unknown[]=[];let detail:Row={};let eventRevision=0;let bookingStart:string|undefined;
 if(['configure','availability','removeAvailability','override','removeOverride','allowance'].includes(action)){
  ownConfig(a,c);
  if(action==='configure'){
   const zone=text(input.timezone,80);try{new Intl.DateTimeFormat('en',{timeZone:zone}).format();}catch{teachingError('Invalid IANA timezone.');}
   const duration=num(input.durationMin,15,180),buffer=num(input.bufferMin,0,120),hours=num(input.requestHours,1,168),weekly=num(input.weeklyAllowance,1,10);
   const notice=num(input.minimumNoticeHours===undefined?(c?.minimum_notice_hours??12):input.minimumNoticeHours,0,720),horizon=num(input.bookingHorizonDays===undefined?(c?.booking_horizon_days??14):input.bookingHorizonDays,1,90);
   writes.push(db.prepare(`INSERT INTO teaching_config(id,instructor_id,timezone,duration_min,buffer_min,request_hours,weekly_allowance,minimum_notice_hours,booking_horizon_days,revision) VALUES('primary',?,?,?,?,?,?,?,?,1) ON CONFLICT(id) DO UPDATE SET timezone=excluded.timezone,duration_min=excluded.duration_min,buffer_min=excluded.buffer_min,request_hours=excluded.request_hours,weekly_allowance=excluded.weekly_allowance,minimum_notice_hours=excluded.minimum_notice_hours,booking_horizon_days=excluded.booking_horizon_days,revision=teaching_config.revision+1`).bind(a.id,zone,duration,buffer,hours,weekly,notice,horizon));detail={previous:c,timezone:zone,duration,buffer,hours,weekly,minimumNoticeHours:notice,bookingHorizonDays:horizon};
  }else{
   if(!c)teachingError('Configure teaching first.');
   if(action==='availability'){const day=num(input.dayOfWeek,0,6),start=timeCheck(input.startTime),end=timeCheck(input.endTime);if(start>=end)teachingError('Availability must end after it starts.');writes.push(db.prepare('DELETE FROM teaching_availability WHERE instructor_id=? AND day_of_week=?').bind(a.id,day),db.prepare('INSERT INTO teaching_availability(id,instructor_id,day_of_week,start_time,end_time) VALUES(?,?,?,?,?)').bind(uid(),a.id,day,start,end));detail={day,start,end};}
   if(action==='removeAvailability'){const id=text(input.id);writes.push(db.prepare('DELETE FROM teaching_availability WHERE id=? AND instructor_id=?').bind(id,a.id));detail={id};}
   if(action==='override'){const date=dateCheck(input.date);if(typeof input.blocked!=='boolean')teachingError('Blocked must be true or false.');const start=input.blocked?null:timeCheck(input.startTime),end=input.blocked?null:timeCheck(input.endTime);if(start&&end&&start>=end)teachingError('Override must end after it starts.');writes.push(db.prepare('INSERT INTO teaching_override(id,instructor_id,date,blocked,start_time,end_time) VALUES(?,?,?,?,?,?) ON CONFLICT(instructor_id,date) DO UPDATE SET blocked=excluded.blocked,start_time=excluded.start_time,end_time=excluded.end_time').bind(uid(),a.id,date,Number(input.blocked),start,end));detail={date,blocked:input.blocked,start,end};}
   if(action==='removeOverride'){const id=text(input.id);writes.push(db.prepare('DELETE FROM teaching_override WHERE id=? AND instructor_id=?').bind(id,a.id));detail={id};}
   if(action==='allowance'){const studentId=text(input.studentId),limit=input.weeklyLimit===null?null:num(input.weeklyLimit,0,10),reason=text(input.reason,1000);if(reason.length<5)teachingError('An override reason is required.');const u=await db.prepare("SELECT id FROM user WHERE id=? AND role='student'").bind(studentId).first();if(!u)teachingError('Student unavailable.');const old=await db.prepare('SELECT * FROM teaching_allowance WHERE student_id=?').bind(studentId).first();if(limit===null)writes.push(db.prepare('DELETE FROM teaching_allowance WHERE student_id=?').bind(studentId));else writes.push(db.prepare('INSERT INTO teaching_allowance(student_id,weekly_limit,reason,updated_by,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(student_id) DO UPDATE SET weekly_limit=excluded.weekly_limit,reason=excluded.reason,updated_by=excluded.updated_by,updated_at=excluded.updated_at').bind(studentId,limit,reason,a.id,at));detail={studentId,weeklyLimit:limit,reason,previous:old};}
   writes.push(db.prepare("UPDATE teaching_config SET revision=revision+1 WHERE id='primary'"));
  }
 }else if(action==='request'){
  if(a.role==='admin')teachingError('Use a student account to request a lesson.',403);if(!c)teachingError('Teaching availability is not configured.');
  const slot=await resolveSlot(db,a,c,input.slotId);sid=uid();const lesson=await suggestion(db,a.id);const title=input.title?text(input.title):lesson?.title??'Weekly HFT lesson';const expiry=new Date(Math.min(Date.now()+c.request_hours*3600000,Date.parse(slot.start_at))).toISOString();
  bookingStart=slot.start_at;const allowance=allowanceGuard(c,a.id,slot.start_at,'');guard=allowance.sql;guardArgs=allowance.args;
  writes.push(db.prepare(`INSERT INTO teaching_session(id,instructor_id,student_id,kind,capacity,title,lesson_id,start_at,end_at,timezone,buffer_min,status,base_status,revision,expires_at,created_at,updated_at) VALUES(?,?,?,'INDIVIDUAL',1,?,?,?,?,?,?,'REQUESTED','REQUESTED',1,?,?,?)`).bind(sid,c.instructor_id,a.id,title,lesson?.id??null,slot.start_at,slot.end_at,c.timezone,c.buffer_min,expiry,at,at));
  writes.push(db.prepare("INSERT INTO teaching_enrollment(session_id,student_id,status) VALUES(?,?,'ENROLLED')").bind(sid,a.id));eventRevision=1;detail={slot,lesson};
 }else{
  const s=await sessionFor(db,a,input.sessionId);sid=s.id;const rev=num(input.expectedRevision,1,1000000);if(s.revision!==rev)teachingError('Schedule changed. Refresh and try again.',409);
  if(!c)teachingError('Teaching unavailable.');const instructor=a.role==='admin'&&a.id===s.instructor_id;
  if(!ACTIVE.includes(`'${s.status}'`))teachingError('This session is closed.',409);
  guard="EXISTS(SELECT 1 FROM teaching_session WHERE id=? AND revision=? AND (status='CONFIRMED' OR (status='REQUESTED' AND julianday(expires_at)>julianday('now')) OR (status='ALTERNATIVE_PROPOSED' AND julianday(proposed_expires_at)>julianday('now'))))";guardArgs=[sid,rev];eventRevision=rev+1;detail={previous:s,reason:input.reason?text(input.reason,1000):''};
  const update=(sql:string,args:unknown[]=[])=>writes.push(db.prepare(`UPDATE teaching_session SET ${sql},revision=revision+1,updated_at=? WHERE id=? AND revision=?`).bind(...args,at,sid,rev));
  const clear='proposed_start_at=NULL,proposed_end_at=NULL,proposed_expires_at=NULL,proposal_by=NULL';
  if(action==='cancel'){update(`status=?,${clear}`,[instructor?'CANCELED_BY_INSTRUCTOR':'CANCELED_BY_STUDENT']);writes.push(db.prepare("UPDATE teaching_enrollment SET status='CANCELED' WHERE session_id=?").bind(sid));}
  else if(action==='decline'){if(!instructor||s.base_status==='CONFIRMED')teachingError('Cannot decline this session.',403);update(`status='DECLINED',${clear}`);}
  else if(action==='rejectProposal'){if(s.status!=='ALTERNATIVE_PROPOSED'||s.proposal_by===a.id)teachingError('No alternative awaiting your response.');update(`status=base_status,${clear}`);detail.rejectedProposal=true;detail.restoreReminders=s.base_status==='CONFIRMED';}
  else if(action==='propose'){
   if(s.status==='ALTERNATIVE_PROPOSED')teachingError('Respond to the existing alternative before proposing another.',409);
   const student=await teachingActor(db,s.student_id);const slot=await resolveSlot(db,a,c,input.slotId,s);if(slot.start_at===s.start_at)teachingError('Choose a different time.');const allowance=allowanceGuard(c,student.id,slot.start_at,s.id);guard+=` AND (${allowance.sql})`;guardArgs.push(...allowance.args);
   bookingStart=slot.start_at;const expiry=new Date(Math.min(Date.now()+c.request_hours*3600000,Date.parse(slot.start_at))).toISOString();update(`base_status=status,status='ALTERNATIVE_PROPOSED',proposed_start_at=?,proposed_end_at=?,proposed_expires_at=?,proposal_by=?`,[slot.start_at,slot.end_at,expiry,a.id]);detail.slot=slot;
  }else if(action==='confirm'||action==='accept'){
   const alternative=s.status==='ALTERNATIVE_PROPOSED';
   if(alternative){if(s.proposal_by===a.id||(instructor?action!=='confirm':action!=='accept'))teachingError('The other participant must accept this alternative.',403);if(!s.proposed_start_at||s.proposed_expires_at<=at)teachingError('Alternative expired.',409);}
   else if(!instructor||action!=='confirm'||s.status!=='REQUESTED')teachingError('Instructor confirmation required.',403);
   await teachingActor(db,s.student_id);const start=alternative?s.proposed_start_at:s.start_at;if(start<=at)teachingError('This session time has passed.');const allowance=allowanceGuard(c,s.student_id,start,s.id);guard+=` AND (${allowance.sql})`;guardArgs.push(...allowance.args);
   update(`status='CONFIRMED',base_status='CONFIRMED',start_at=?,end_at=?,expires_at=NULL,${clear}`,[start,alternative?s.proposed_end_at:s.end_at]);detail.confirmed=true;
  }else teachingError('Unknown scheduling action.');
  writes.push(db.prepare("UPDATE teaching_outbox SET status='CANCELED' WHERE session_id=? AND status='PENDING'").bind(sid));
 }
 // Current actor, assigned host, target student and configuration are rechecked at commit.
 if(bookingStart){guard+=" AND julianday(?) >= julianday('now') + (SELECT minimum_notice_hours/24.0 FROM teaching_config WHERE id='primary')";guardArgs.push(bookingStart);}
 let accountGuard=`EXISTS(SELECT 1 FROM user u WHERE u.id=? AND ${accountSQL()})`;
 const accountArgs:unknown[]=[a.id];
 if(!c){accountGuard+=" AND NOT EXISTS(SELECT 1 FROM teaching_config WHERE id='primary')";}
 if(c){accountGuard+=" AND EXISTS(SELECT 1 FROM teaching_config WHERE id='primary' AND instructor_id=? AND revision=?)";accountArgs.push(c.instructor_id,c.revision);}
 if(sid&&action!=='request'&&!['cancel','decline','rejectProposal'].includes(action)){accountGuard+=` AND EXISTS(SELECT 1 FROM teaching_session s JOIN user u ON u.id=s.student_id WHERE s.id=? AND ${accountSQL()})`;accountArgs.push(sid);}
 if(sid&&action!=='request'){accountGuard+=" AND NOT EXISTS(SELECT 1 FROM teaching_outbox WHERE session_id=? AND status='DELIVERING')";accountArgs.push(sid);}
 if(a.role==='admin')accountGuard+=" AND EXISTS(SELECT 1 FROM user WHERE id='"+a.id.replaceAll("'","''")+"' AND role='admin')";
 const command=db.prepare(`INSERT INTO teaching_command(actor_id,request_key,body_json,result_session_id,created_at) VALUES(?,?,CASE WHEN (${accountGuard}) AND (${guard}) THEN ? ELSE NULL END,?,?)`).bind(a.id,key,...accountArgs,...guardArgs,body,sid,at);
 writes.unshift(command);
 writes.push(db.prepare('INSERT INTO teaching_event(id,session_id,actor_id,action,revision,detail_json,created_at) VALUES(?,?,?,?,?,?,?)').bind(uid(),sid,a.id,action,eventRevision,JSON.stringify(detail),at));
 if(sid){
  let notification:TeachingMessageType|null=action==='request'?'REQUEST_RECEIVED':action==='propose'?'ALTERNATIVE_PROPOSED':['cancel','decline'].includes(action)?'CANCELED':null;
  if(detail.confirmed)notification=detail.previous.status==='ALTERNATIVE_PROPOSED'?(detail.previous.base_status==='CONFIRMED'?'RESCHEDULED':'ALTERNATIVE_ACCEPTED'):'CONFIRMATION';
  const types:TeachingMessageType[]=notification?[notification]:[];if(detail.confirmed||detail.restoreReminders)types.push('REMINDER_24H','REMINDER_1H');
  writes.push(...teachingNotificationStatements(db,sid,eventRevision,at,types));
 }
 try{await db.batch(writes);}catch(e){const replay=await db.prepare('SELECT body_json FROM teaching_command WHERE actor_id=? AND request_key=?').bind(a.id,key).first<Row>();if(replay?.body_json===body)return teachingSnapshot(db,a.id);if(replay)teachingError('Request key already used.',409);teachingError('The schedule, allowance or availability changed. Refresh and choose an available time.',409);}
 return teachingSnapshot(db,a.id);
}
async function resolveSlot(db:D1Database,a:TeachingActor,c:Row,id:unknown,s?:Row){const key=text(id,150),date=dateCheck(key.split('/')[0]);const slots=await teachingSlots(db,a,c,date,s);const slot=slots.find(x=>x.id===key);if(!slot)teachingError('Slot unavailable or changed. Refresh available times.',409);return slot!;}
function outboxStatements(db:D1Database,sid:string,revision:number,at:string,confirmation=true,eventId:string|null=null){
 const types:TeachingMessageType[]=confirmation?['CONFIRMATION','REMINDER_24H','REMINDER_1H']:['REMINDER_24H','REMINDER_1H'];
 return teachingNotificationStatements(db,sid,revision,at,types,eventId);
}
