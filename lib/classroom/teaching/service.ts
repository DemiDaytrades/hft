import {teachingAccess,deny,liveAuthoritySQL} from './access';
import {validateActivity,validateAnswer,scoreActivity,normalizeYoutubeUrl} from './policy';
import {studentActivity} from './projection';
import type {TeachingView,ActivityDefinition,YoutubeState} from './contracts';
type Row=Record<string,any>;
async function state(db:D1Database,sid:string){return db.prepare('SELECT * FROM classroom_teaching WHERE session_id=?').bind(sid).first<Row>();}
export async function teachingView(db:D1Database,actorId:string,sid:string):Promise<TeachingView>{
 const {snapshot}=await teachingAccess(db,actorId,sid),s=await state(db,sid);
 const run=await db.prepare('SELECT * FROM classroom_activity_run WHERE session_id=? ORDER BY launched_at DESC,id DESC LIMIT 1').bind(sid).first<Row>();
 const own=run?await db.prepare('SELECT answer_json,correct,review_json FROM classroom_activity_response WHERE run_id=? AND student_id=?').bind(run.id,actorId).first<Row>():null;
 const activity=run?studentActivity(run as any,own as any,snapshot.state==='ENDED'):null;
 if(activity?.closed&&JSON.parse(run!.snapshot_json).showAggregate){const answers=(await db.prepare('SELECT answer_json FROM classroom_activity_response WHERE run_id=?').bind(run!.id).all<Row>()).results.map(r=>JSON.parse(r.answer_json));activity.aggregate=activity.options.map(o=>({optionId:o.id,count:answers.filter(a=>Array.isArray(a)&&a.includes(o.id)).length}));}
 return {revision:s?.revision??0,youtube:s?.youtube_json?JSON.parse(s.youtube_json):null,activity};
}
export async function instructorTeachingView(db:D1Database,actorId:string,sid:string){
 await teachingAccess(db,actorId,sid,true);const s=await state(db,sid);
 const runs=(await db.prepare('SELECT * FROM classroom_activity_run WHERE session_id=? ORDER BY launched_at DESC,id DESC').bind(sid).all<Row>()).results;
 const bank=(await db.prepare('SELECT * FROM classroom_activity_bank WHERE instructor_id=? ORDER BY created_at DESC').bind(actorId).all<Row>()).results;
 const guides=(await db.prepare('SELECT * FROM classroom_teaching_guide WHERE session_id=? ORDER BY version DESC').bind(sid).all<Row>()).results.map(g=>({id:g.id,version:g.version,guide:JSON.parse(g.guide_json),createdAt:g.created_at}));
 return {guides,revision:s?.revision??0,notes:s?.private_notes??'',bank:bank.map(b=>({id:b.id,version:b.version,definition:JSON.parse(b.definition_json)})),runs:await Promise.all(runs.map(async r=>({...r,definition:JSON.parse(r.snapshot_json),responses:(await db.prepare('SELECT student_id,answer_json,correct,submitted_at,revision,review_json FROM classroom_activity_response WHERE run_id=? ORDER BY student_id').bind(r.id).all<Row>()).results.map(a=>({studentId:a.student_id,answer:JSON.parse(a.answer_json),correct:a.correct===null?null:a.correct===1,submittedAt:a.submitted_at,revision:a.revision,review:a.review_json?JSON.parse(a.review_json):null}))})))};
}
export interface TeachingCommand {action:string;requestKey:string;connectionId?:string;expectedRevision?:number;definition?:unknown;runId?:string;answer?:unknown;text?:string;url?:string;position?:number;playing?:boolean;active?:boolean;bankId?:string;studentId?:string;conceptId?:string;domain?:string;stage?:string;guide?:unknown}
export async function teachingCommand(db:D1Database,actorId:string,sid:string,input:TeachingCommand){
 const hostAction=input.action!=='answer';const {snapshot}=await teachingAccess(db,actorId,sid,hostAction);
 if(!/^[\w-]{8,100}$/.test(input.requestKey??''))deny('Request key required.',400);
 if(!['notes','saveBank','launch','answer','close','youtube','observe','saveGuide'].includes(input.action))deny('Unknown teaching command.',400);
 const self=snapshot.participants.find(p=>p.id===actorId);
 if(snapshot.state!=='LIVE'||!self?.connected||!input.connectionId||self.connectionId!==input.connectionId||!self.leaseExpiresAt||Date.parse(self.leaseExpiresAt)<=Date.now())deny('Current live classroom connection required.',409);
 const body=JSON.stringify(input),prior=await db.prepare('SELECT body_json FROM classroom_teaching_command WHERE session_id=? AND actor_id=? AND request_key=?').bind(sid,actorId,input.requestKey).first<Row>();
 if(prior){if(prior.body_json!==body)deny('Request key reused.',409);return teachingView(db,actorId,sid);}
 const current=await state(db,sid),revision=current?.revision??0,at=new Date().toISOString();
 if(input.expectedRevision!==undefined&&input.expectedRevision!==revision)deny('Teaching state changed.',409);
 let responseGuard='1=1';const responseArgs:unknown[]=[];
 const writes:D1PreparedStatement[]=[];
 if(input.action==='saveGuide'){
  const raw=input.guide as Record<string,unknown>;if(!raw||typeof raw!=='object'||Array.isArray(raw))deny('Invalid teaching guide.',400);
  const guide:Record<string,string>={};for(const key of ['objectives','outline','talkingPoints','examples','demonstrations','misconceptions','questions','wrapUp']){if(typeof raw[key]!=='string'||raw[key].length>2500)deny('Invalid guide field (maximum 2500 characters).',400);guide[key]=raw[key];}
  writes.push(db.prepare('INSERT INTO classroom_teaching_guide(id,session_id,version,guide_json,created_by,created_at) SELECT ?,?,COALESCE((SELECT MAX(version) FROM classroom_teaching_guide WHERE session_id=?),0)+1,?,?,?').bind(crypto.randomUUID(),sid,sid,JSON.stringify(guide),actorId,at));
 }
 if(input.action==='notes'){
  if(typeof input.text!=='string'||input.text.length>20000)deny('Notes too long.',400);
  writes.push(db.prepare('UPDATE classroom_teaching SET private_notes=? WHERE session_id=?').bind(input.text,sid));
 }
 if(input.action==='saveBank'||input.action==='launch'){
  let raw=input.definition;
  if(input.bankId){const b=await db.prepare('SELECT * FROM classroom_activity_bank WHERE id=? AND instructor_id=?').bind(input.bankId,actorId).first<Row>();if(!b)deny('Activity unavailable.',404);raw={...JSON.parse(b.definition_json),sourceId:b.id,sourceVersion:String(b.version)};}
  const definition=validateActivity(raw);
  if(input.action==='saveBank')writes.push(db.prepare('INSERT INTO classroom_activity_bank(id,instructor_id,definition_json,created_at) VALUES(?,?,?,?)').bind(crypto.randomUUID(),actorId,JSON.stringify(definition),at));
  else{
   // Timed-out runs are durably closed before the next launch, within this transaction.
   writes.push(db.prepare('UPDATE classroom_activity_run SET closed_at=? WHERE session_id=? AND closed_at IS NULL AND closes_at IS NOT NULL AND julianday(closes_at)<=julianday(?)').bind(at,sid,at));
   writes.push(db.prepare('INSERT INTO classroom_activity_run(id,session_id,instructor_id,snapshot_json,launched_at,closes_at) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),sid,actorId,JSON.stringify(definition),at,definition.timerSeconds?new Date(Date.parse(at)+definition.timerSeconds*1000).toISOString():null));
  }
 }
 if(input.action==='answer'||input.action==='close'){
  const run=await db.prepare('SELECT * FROM classroom_activity_run WHERE id=? AND session_id=?').bind(input.runId??'',sid).first<Row>();
  if(!run)deny('Activity unavailable.',404);
  if(input.action==='close')writes.push(db.prepare('UPDATE classroom_activity_run SET closed_at=COALESCE(closed_at,?) WHERE id=?').bind(at,run.id));
  else{
   if(actorId===snapshot.hostId)deny('Student response required.',400);
   if(run.closed_at||run.closes_at&&Date.parse(run.closes_at)<=Date.now())deny('Activity closed.',409);
   const definition=JSON.parse(run.snapshot_json) as ActivityDefinition,answer=validateAnswer(definition,input.answer),correct=scoreActivity(definition,answer);
   responseGuard="EXISTS(SELECT 1 FROM classroom_activity_run WHERE id=? AND session_id=? AND closed_at IS NULL AND (closes_at IS NULL OR julianday(closes_at)>julianday('now')))";responseArgs.push(run.id,sid);
   const old=await db.prepare('SELECT 1 FROM classroom_activity_response WHERE run_id=? AND student_id=?').bind(run.id,actorId).first();
   if(old&&!definition.allowRevisions)deny('Answer already received.',409);
   writes.push(db.prepare(`INSERT INTO classroom_activity_response(run_id,student_id,answer_json,correct,submitted_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM classroom_activity_run WHERE id=? AND closed_at IS NULL AND (closes_at IS NULL OR julianday(closes_at)>julianday('now'))) ON CONFLICT(run_id,student_id) DO UPDATE SET answer_json=excluded.answer_json,correct=excluded.correct,submitted_at=excluded.submitted_at,revision=classroom_activity_response.revision+1`).bind(run.id,actorId,JSON.stringify(answer),correct===null?null:Number(correct),at,run.id));
  }
 }
 if(input.action==='observe'){
  if(typeof input.text!=='string'||!input.text.trim()||input.text.length>5000||!snapshot.participants.some(p=>p.id===input.studentId&&p.role==='student'&&!p.removed))deny('Observation requires an enrolled student and text.',400);
  const id=crypto.randomUUID(),e={id,source:'INSTRUCTOR_OBSERVATION',domain:input.domain,scope:'CONCEPT',level:'KNOWS_CONCEPT',reference:id,summary:input.text.trim(),recordedAt:at,verifiedBy:actorId,contextOnly:true,result:'CONTEXT',provenance:{sessionId:sid,studentId:input.studentId,conceptId:input.conceptId??null,stage:input.stage??null,evaluation:'INSTRUCTOR_OBSERVATION',authorId:actorId}};
  writes.push(db.prepare('INSERT INTO classroom_learning_evidence(id,session_id,student_id,source,reference,evidence_json,recorded_at,reviewed_by) VALUES(?,?,?,?,?,?,?,?)').bind(id,sid,input.studentId!,'INSTRUCTOR_OBSERVATION',id,JSON.stringify(e),at,actorId));
 }
 if(input.action==='youtube'){
  if(typeof input.position!=='number'||!Number.isFinite(input.position)||input.position<0||input.position>86400||typeof input.playing!=='boolean'||typeof input.active!=='boolean')deny('Invalid playback state.',400);
  const youtube:YoutubeState={videoId:normalizeYoutubeUrl(input.url??''),position:input.position,playing:input.playing,active:input.active,updatedAt:Date.parse(at),revision:revision+1};
  writes.push(db.prepare('UPDATE classroom_teaching SET youtube_json=? WHERE session_id=?').bind(JSON.stringify(youtube),sid));
 }
 try{await db.batch([
  db.prepare(`INSERT INTO classroom_teaching_command(session_id,actor_id,request_key,body_json,created_at) VALUES(?,?,?,CASE WHEN ${liveAuthoritySQL} AND COALESCE((SELECT revision FROM classroom_teaching WHERE session_id=?),0)=? AND ${responseGuard} THEN ? ELSE NULL END,?)`).bind(sid,actorId,input.requestKey,sid,actorId,Number(hostAction),snapshot.revision,input.connectionId,sid,revision,...responseArgs,body,at),
  db.prepare('INSERT OR IGNORE INTO classroom_teaching(session_id,updated_at) VALUES(?,?)').bind(sid,at),...writes,
  db.prepare('UPDATE classroom_teaching SET revision=revision+1,updated_at=? WHERE session_id=?').bind(at,sid),
 ]);}catch{deny('Teaching state or authority changed. Refresh and retry.',409);}
 return teachingView(db,actorId,sid);
}
/** Recoverable END cleanup. Never changes Phase B terminal/media authority. */
export async function closeEndedTeaching(db:D1Database,sid:string){
 await db.prepare("UPDATE classroom_activity_run SET closed_at=COALESCE(closed_at,?) WHERE session_id=? AND EXISTS(SELECT 1 FROM classroom_room r WHERE r.session_id=? AND json_extract(r.state_json,'$.state')='ENDED')").bind(new Date().toISOString(),sid,sid).run();
}
