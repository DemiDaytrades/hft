import test from 'node:test';
import assert from 'node:assert/strict';
import {fixtureDb} from '../financial-plan/testing/db';

// The missing service is intentionally loaded without hiding a failed behavior assertion.
let service:any;try{service=require('./service');}catch(e:any){if(e.code!=='MODULE_NOT_FOUND')throw e;}
test('weekly teaching exports an authenticated transactional scheduling service',()=>assert.equal(typeof service?.teachingCommand,'function'));
const {teachingCommand:command,teachingSnapshot:snapshot}=service;
const {addDays,localDate}=require('./time');
const setup=async()=>{
 const {sqlite,db}=fixtureDb();
 for(const [id,role] of [['host','admin'],['a','student'],['b','student'],['otherhost','admin']])sqlite.prepare(`INSERT INTO user(id,name,email,role,createdAt,updatedAt,subscriptionStatus,lifecycle_status) VALUES(?,?,?,?,?,?,'active','ACTIVE')`).run(id,id,id+'@example.invalid',role,'2026-11-07','2026-11-07');
 const run=(actor:string,body:any)=>command(db,actor,{requestKey:crypto.randomUUID(),...body});
 await run('host',{action:'configure',timezone:'America/Chicago',durationMin:60,bufferMin:15,requestHours:12,weeklyAllowance:1});
 const date=addDays(localDate(new Date().toISOString(),'America/Chicago'),3),day=new Date(date+'T12:00:00Z').getUTCDay();
 await run('host',{action:'availability',dayOfWeek:day,startTime:'09:00',endTime:'20:00'});
 const slots=async(actor='a',sessionId?:string)=>(await snapshot(db,actor,date,sessionId)).slots;
 return {sqlite,db,run,date,slots};
};
test('server slots honor availability, blocks, date overrides, duration and buffers',async()=>{
 const f=await setup();let slots=await f.slots();assert.ok(slots.length>5);assert.equal(Date.parse(slots[0].end_at)-Date.parse(slots[0].start_at),3600000);
 await f.run('host',{action:'override',date:f.date,blocked:true});assert.deepEqual(await f.slots(),[]);
 await f.run('host',{action:'override',date:f.date,blocked:false,startTime:'12:00',endTime:'14:00'});slots=await f.slots();assert.equal(slots.length,5);
 await f.run('a',{action:'request',slotId:slots[0].id});const other=await f.slots('b');assert.equal(other.length,0);f.sqlite.close();
});
test('request retries are idempotent, ownership enforced, confirmation prepares durable revision jobs',async()=>{
 const f=await setup();const slot=(await f.slots())[0];const body={action:'request',slotId:slot.id,requestKey:'same-request-key'};
 await command(f.db,'a',body);await command(f.db,'a',body);let s=(await snapshot(f.db,'a')).sessions[0];assert.equal(s.status,'REQUESTED');assert.equal(s.revision,1);
 assert.equal(f.sqlite.prepare('SELECT COUNT(*) n FROM teaching_session').get()!.n,1);
 await assert.rejects(command(f.db,'a',{...body,title:'different'}),/key/);
 assert.equal((await snapshot(f.db,'b')).sessions.length,0);
 await assert.rejects(f.run('b',{action:'cancel',sessionId:s.id,expectedRevision:1}),/unavailable/);
 await assert.rejects(f.run('a',{action:'confirm',sessionId:s.id,expectedRevision:1}),/Instructor/);
 await assert.rejects(f.run('otherhost',{action:'confirm',sessionId:s.id,expectedRevision:1}),/unavailable/);
 await f.run('host',{action:'confirm',sessionId:s.id,expectedRevision:1});s=(await snapshot(f.db,'a')).sessions.find((x:any)=>x.id===s.id);assert.equal(s.status,'CONFIRMED');assert.equal(s.revision,2);
 assert.equal(f.sqlite.prepare("SELECT COUNT(*) n FROM teaching_outbox WHERE status='PENDING'").get()!.n,12);assert.equal(f.sqlite.prepare("SELECT COUNT(*) n FROM teaching_outbox WHERE status='CANCELED'").get()!.n,4);
 await assert.rejects(f.run('a',{action:'cancel',sessionId:s.id,expectedRevision:1}),/changed/);f.sqlite.close();
});
test('default weekly allowance, audited instructor override, and slot allowance races',async()=>{
 const f=await setup();const slots=await f.slots();const results=await Promise.allSettled([f.run('a',{action:'request',slotId:slots[0].id}),f.run('a',{action:'request',slotId:slots[8].id})]);assert.equal(results.filter(x=>x.status==='fulfilled').length,1);
 assert.deepEqual(await f.slots(),[]);await assert.rejects(f.run('a',{action:'allowance',studentId:'a',weeklyLimit:2,reason:'Support'}),/instructor/);
 await f.run('host',{action:'allowance',studentId:'a',weeklyLimit:2,reason:'Additional guided practice'});assert.ok((await f.slots()).length>0);
 const event=f.sqlite.prepare("SELECT detail_json FROM teaching_event WHERE action='allowance'").get()!;assert.equal(JSON.parse(String(event.detail_json)).weeklyLimit,2);assert.equal(f.sqlite.prepare('SELECT weekly_limit FROM teaching_allowance WHERE student_id=?').get('a')!.weekly_limit,2);f.sqlite.close();
});
test('instructor alternatives require student acceptance; reschedule keeps old reservation until instructor confirms',async()=>{
 const f=await setup();await f.run('a',{action:'request',slotId:(await f.slots())[0].id});let s=(await snapshot(f.db,'a')).sessions[0];const old=s.start_at;
 const alternate=(await f.slots('host',s.id))[8];await f.run('host',{action:'propose',sessionId:s.id,expectedRevision:s.revision,slotId:alternate.id,reason:'Schedule adjustment'});
 s=(await snapshot(f.db,'a')).sessions.find((x:any)=>x.id===s.id);assert.equal(s.start_at,old);assert.equal(s.status,'ALTERNATIVE_PROPOSED');
 await assert.rejects(f.run('host',{action:'accept',sessionId:s.id,expectedRevision:s.revision}),/other participant/);
 await f.run('a',{action:'accept',sessionId:s.id,expectedRevision:s.revision});s=(await snapshot(f.db,'a')).sessions.find((x:any)=>x.id===s.id);assert.equal(s.start_at,alternate.start_at);assert.equal(s.status,'CONFIRMED');
 const retained=s.start_at;const replacement=(await f.slots('a',s.id)).find((x:any)=>x.start_at>retained)!;
 await f.run('a',{action:'propose',sessionId:s.id,expectedRevision:s.revision,slotId:replacement.id});s=(await snapshot(f.db,'a')).sessions.find((x:any)=>x.id===s.id);assert.equal(s.base_status,'CONFIRMED');assert.equal(s.start_at,retained);
 assert.ok(f.sqlite.prepare('SELECT * FROM teaching_calendar_busy WHERE id=? AND start_epoch=unixepoch(?)').get(s.id,retained));
 await f.run('host',{action:'confirm',sessionId:s.id,expectedRevision:s.revision});s=(await snapshot(f.db,'a')).sessions.find((x:any)=>x.id===s.id);assert.equal(s.start_at,replacement.start_at);
 const events=f.sqlite.prepare('SELECT * FROM teaching_event WHERE session_id=?').all(s.id);assert.equal(events.length,5);assert.ok(events.some((e:any)=>e.detail_json.includes(retained)));
 await f.run('a',{action:'cancel',sessionId:s.id,expectedRevision:s.revision});assert.equal((await snapshot(f.db,'a')).sessions[0].status,'CANCELED_BY_STUDENT');assert.equal(f.sqlite.prepare("SELECT COUNT(*) n FROM teaching_outbox WHERE status='PENDING' AND type<>'CANCELED'").get()!.n,0);assert.equal(f.sqlite.prepare("SELECT COUNT(*) n FROM teaching_outbox WHERE status='PENDING' AND type='CANCELED'").get()!.n,4);f.sqlite.close();
});
test('expiry releases a request but restores confirmed base when an alternative expires',async()=>{
 const f=await setup();await f.run('a',{action:'request',slotId:(await f.slots())[0].id});let s=(await snapshot(f.db,'a')).sessions[0];f.sqlite.prepare("UPDATE teaching_session SET expires_at='2001-01-01T00:00:00Z' WHERE id=?").run(s.id);
 assert.equal((await snapshot(f.db,'a')).sessions[0].status,'EXPIRED');assert.ok((await f.slots()).length>0);
 await f.run('a',{action:'request',slotId:(await f.slots())[0].id});s=(await snapshot(f.db,'a')).sessions.find((x:any)=>x.status==='REQUESTED');await f.run('host',{action:'confirm',sessionId:s.id,expectedRevision:s.revision});s=(await snapshot(f.db,'a')).sessions.find((x:any)=>x.id===s.id);
 const replacement=(await f.slots('host',s.id))[8];await f.run('host',{action:'propose',sessionId:s.id,expectedRevision:s.revision,slotId:replacement.id});f.sqlite.prepare("UPDATE teaching_session SET proposed_expires_at='2001-01-01T00:00:00Z' WHERE id=?").run(s.id);
 s=(await snapshot(f.db,'a')).sessions.find((x:any)=>x.id===s.id);assert.equal(s.status,'CONFIRMED');assert.equal(s.proposed_start_at,null);f.sqlite.close();
});
test('deactivated, forced password and expired accounts cannot schedule or mutate instructor settings',async()=>{
 const f=await setup();await assert.rejects(f.run('a',{action:'availability',dayOfWeek:1,startTime:'09:00',endTime:'17:00'}),/instructor/);
 for(const sql of ["UPDATE user SET lifecycle_status='DEACTIVATED' WHERE id='a'","UPDATE user SET lifecycle_status='ACTIVE',must_change_password=1 WHERE id='a'","UPDATE user SET must_change_password=0,subscriptionStatus='canceled',complimentaryAccessExpiresAt='2001-01-01' WHERE id='a'"]){f.sqlite.exec(sql);await assert.rejects(snapshot(f.db,'a'),/account|membership/);}
 f.sqlite.exec("UPDATE user SET complimentaryAccessStartsAt='2001-01-01',complimentaryAccessExpiresAt='2099-01-01',complimentaryAccessRevokedAt=NULL WHERE id='a'");assert.ok(await snapshot(f.db,'a'));f.sqlite.close();
});
test('declines, declined alternatives and instructor cancellation preserve history and group schema remains compatible',async()=>{
 const f=await setup();await f.run('a',{action:'request',slotId:(await f.slots())[0].id});let s=(await snapshot(f.db,'a')).sessions[0];await f.run('host',{action:'decline',sessionId:s.id,expectedRevision:s.revision,reason:'Unavailable'});assert.equal((await snapshot(f.db,'a')).sessions[0].status,'DECLINED');
 await f.run('a',{action:'request',slotId:(await f.slots())[0].id});s=(await snapshot(f.db,'a')).sessions.find((x:any)=>x.status==='REQUESTED');await f.run('host',{action:'propose',sessionId:s.id,expectedRevision:s.revision,slotId:(await f.slots('host',s.id))[8].id});s=(await snapshot(f.db,'a')).sessions.find((x:any)=>x.id===s.id);await f.run('a',{action:'rejectProposal',sessionId:s.id,expectedRevision:s.revision});s=(await snapshot(f.db,'a')).sessions.find((x:any)=>x.id===s.id);assert.equal(s.status,'REQUESTED');
 await f.run('host',{action:'cancel',sessionId:s.id,expectedRevision:s.revision});assert.equal((await snapshot(f.db,'a')).sessions.find((x:any)=>x.id===s.id).status,'CANCELED_BY_INSTRUCTOR');
 f.sqlite.prepare("UPDATE teaching_session SET kind='GROUP',capacity=10,student_id=NULL WHERE id=?").run(s.id);assert.equal(f.sqlite.prepare('SELECT capacity FROM teaching_session WHERE id=?').get(s.id)!.capacity,10);
 assert.equal(f.sqlite.prepare('SELECT COUNT(*) n FROM student_lesson_progress').get()!.n,0);f.sqlite.close();
});
test('rejecting or expiring a confirmed reschedule preserves future reminders for original time',async()=>{
 const f=await setup();await f.run('a',{action:'request',slotId:(await f.slots())[0].id});let s=(await snapshot(f.db,'a')).sessions[0];await f.run('host',{action:'confirm',sessionId:s.id,expectedRevision:s.revision});s=(await snapshot(f.db,'a')).sessions[0];
 await f.run('host',{action:'propose',sessionId:s.id,expectedRevision:s.revision,slotId:(await f.slots('host',s.id))[8].id});s=(await snapshot(f.db,'a')).sessions[0];await f.run('a',{action:'rejectProposal',sessionId:s.id,expectedRevision:s.revision});s=(await snapshot(f.db,'a')).sessions[0];
 assert.ok(Number(f.sqlite.prepare("SELECT COUNT(*) n FROM teaching_outbox WHERE session_id=? AND revision=? AND status='PENDING' AND type='REMINDER_1H'").get(s.id,s.revision)!.n)>0);
 await f.run('host',{action:'propose',sessionId:s.id,expectedRevision:s.revision,slotId:(await f.slots('host',s.id))[8].id});f.sqlite.prepare("UPDATE teaching_session SET proposed_expires_at='2001-01-01T00:00:00Z' WHERE id=?").run(s.id);s=(await snapshot(f.db,'a')).sessions[0];
 assert.ok(Number(f.sqlite.prepare("SELECT COUNT(*) n FROM teaching_outbox WHERE session_id=? AND revision=? AND status='PENDING' AND type='REMINDER_1H'").get(s.id,s.revision)!.n)>0);f.sqlite.close();
});
test('transaction rechecks expiry and first-configuration instructor ownership',async()=>{
 const f=await setup();await f.run('a',{action:'request',slotId:(await f.slots())[0].id});const s=(await snapshot(f.db,'a')).sessions[0];
 const original=f.db.batch.bind(f.db);f.db.batch=async stmts=>{f.sqlite.prepare("UPDATE teaching_session SET expires_at='2001-01-01T00:00:00Z' WHERE id=?").run(s.id);return original(stmts);};
 await assert.rejects(f.run('host',{action:'confirm',sessionId:s.id,expectedRevision:s.revision}),/changed/);f.db.batch=original;
 assert.notEqual(f.sqlite.prepare('SELECT status FROM teaching_session WHERE id=?').get(s.id)!.status,'CONFIRMED');f.sqlite.close();
 const {sqlite,db}=fixtureDb();for(const id of ['h1','h2'])sqlite.prepare("INSERT INTO user(id,name,email,role,createdAt,updatedAt) VALUES(?,?,?,'admin',?,?)").run(id,id,id+'@example.invalid','2026-11-07','2026-11-07');
 const results=await Promise.allSettled(['h1','h2'].map(id=>command(db,id,{action:'configure',requestKey:crypto.randomUUID(),timezone:'America/Chicago',durationMin:60,bufferMin:15,requestHours:12,weeklyAllowance:1})));assert.equal(results.filter(r=>r.status==='fulfilled').length,1);sqlite.close();
});
test('an explicit null allowance override restores the configured default with audit',async()=>{
 const f=await setup();await f.run('host',{action:'allowance',studentId:'a',weeklyLimit:2,reason:'Additional support'});await f.run('host',{action:'allowance',studentId:'a',weeklyLimit:null,reason:'Return to membership default'});assert.equal(f.sqlite.prepare('SELECT * FROM teaching_allowance WHERE student_id=?').get('a'),undefined);assert.equal(f.sqlite.prepare("SELECT COUNT(*) n FROM teaching_event WHERE action='allowance'").get()!.n,2);f.sqlite.close();
});
test('approved starting lesson is suggested without exposing private notes or altering Academy progression',async()=>{
 const f=await setup();const at=new Date().toISOString();
 f.sqlite.prepare("INSERT INTO academy_course(id,title,slug,status,created_at,updated_at) VALUES('qa-course','QA curriculum','qa-curriculum','published',?,?)").run(at,at);
 f.sqlite.prepare("INSERT INTO academy_module(id,course_id,title,status,created_at,updated_at) VALUES('qa-module','qa-course','QA module','published',?,?)").run(at,at);
 for(const [id,sort,classification] of [['qa-optional',0,'OPTIONAL_ENRICHMENT'],['qa-start',1,'REQUIRED_CORE']])f.sqlite.prepare("INSERT INTO academy_lesson(id,module_id,title,status,sort_order,placement_classification,created_at,updated_at) VALUES(?,'qa-module',?,'published',?,?,?,?)").run(id,id,sort,classification,at,at);
 f.sqlite.prepare("INSERT INTO student_course_assignment(id,user_id,course_id,assigned_at) VALUES('qa-assignment','a','qa-course',?)").run(at);
 f.sqlite.exec("INSERT INTO learning_path_series(id,student_id) VALUES('qa-series','a')");
 f.sqlite.prepare("INSERT INTO learning_path_version(id,series_id,version,request_key,source_json,source_digest,engine_version,recommendation_json,instructor_json,student_json,status,created_at,created_by,updated_at,updated_by) VALUES('qa-path','qa-series',1,'qa-key','{}','digest','qa','{}',?,?,'APPROVED',?,'host',?,'host')").run(JSON.stringify({startingLessonId:'qa-start',privateNotes:'INSTRUCTOR PRIVATE'}),JSON.stringify({startingPoint:{id:'qa-start',title:'qa-start'}}),at,at);
 for(const [id,action] of [['qa-optional','OPTIONAL'],['qa-start','REQUIRE']])f.sqlite.prepare("INSERT INTO learning_path_decision VALUES('qa-path',?,?,?,?)").run(id,action,'QA reason',at);
 f.sqlite.exec("UPDATE learning_path_series SET current_version_id='qa-path' WHERE id='qa-series'");
 const before=f.sqlite.prepare('SELECT * FROM learning_path_version').all();const view=await snapshot(f.db,'a');assert.equal(view.suggestedLesson.id,'qa-start');assert.ok(!JSON.stringify(view).includes('INSTRUCTOR PRIVATE'));
 await f.run('a',{action:'request',slotId:(await f.slots())[0].id});assert.equal((await snapshot(f.db,'a')).sessions[0].lesson_id,'qa-start');assert.deepEqual(f.sqlite.prepare('SELECT * FROM learning_path_version').all(),before);assert.equal(f.sqlite.prepare('SELECT COUNT(*) n FROM student_lesson_progress').get()!.n,0);f.sqlite.close();
});
test('workflow prepares safe request, alternative, accepted/rescheduled and canceled notifications by revision',async()=>{
 const f=await setup();await f.run('a',{action:'request',slotId:(await f.slots())[0].id});let s=(await snapshot(f.db,'a')).sessions[0];
 const types=()=>f.sqlite.prepare("SELECT DISTINCT type FROM teaching_outbox WHERE session_id=? AND revision=? AND status='PENDING'").all(s.id,s.revision).map((r:any)=>r.type);
 assert.deepEqual(types(),['REQUEST_RECEIVED']);
 await f.run('host',{action:'propose',sessionId:s.id,expectedRevision:s.revision,slotId:(await f.slots('host',s.id))[8].id});s=(await snapshot(f.db,'a')).sessions[0];assert.deepEqual(types(),['ALTERNATIVE_PROPOSED']);
 await f.run('a',{action:'accept',sessionId:s.id,expectedRevision:s.revision});s=(await snapshot(f.db,'a')).sessions[0];assert.ok(types().includes('ALTERNATIVE_ACCEPTED'));
 await f.run('a',{action:'propose',sessionId:s.id,expectedRevision:s.revision,slotId:(await f.slots('a',s.id))[0].id});s=(await snapshot(f.db,'a')).sessions[0];await f.run('host',{action:'confirm',sessionId:s.id,expectedRevision:s.revision});s=(await snapshot(f.db,'a')).sessions[0];assert.ok(types().includes('RESCHEDULED'));
 await f.run('a',{action:'cancel',sessionId:s.id,expectedRevision:s.revision});s=(await snapshot(f.db,'a')).sessions[0];assert.deepEqual(types(),['CANCELED']);f.sqlite.close();
});
test('rescheduling across DST retains UTC authority and instructor timezone without fixed-week arithmetic',async()=>{
 const RealDate=Date;const fixed=RealDate.parse('2027-03-08T12:00:00Z');
 class ClockDate extends RealDate{constructor(value?:any){super(value===undefined?fixed:value);}static now(){return fixed;}}
 globalThis.Date=ClockDate as DateConstructor;
 let f:any;try{
  f=await setup();for(const day of [6,0])await f.run('host',{action:'availability',dayOfWeek:day,startTime:'09:00',endTime:'17:00'});
  const original=(await snapshot(f.db,'a','2027-03-13')).slots[0];assert.equal(original.start_at,'2027-03-13T15:00:00.000Z');await f.run('a',{action:'request',slotId:original.id});let s=(await snapshot(f.db,'a')).sessions[0];await f.run('host',{action:'confirm',sessionId:s.id,expectedRevision:s.revision});s=(await snapshot(f.db,'a')).sessions[0];
  const after=(await snapshot(f.db,'a','2027-03-14',s.id)).slots[0];assert.equal(after.start_at,'2027-03-14T14:00:00.000Z');await f.run('a',{action:'propose',sessionId:s.id,expectedRevision:s.revision,slotId:after.id});s=(await snapshot(f.db,'a')).sessions[0];await f.run('host',{action:'confirm',sessionId:s.id,expectedRevision:s.revision});s=(await snapshot(f.db,'a')).sessions[0];assert.equal(s.start_at,after.start_at);assert.equal(s.timezone,'America/Chicago');
  const differentZone=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric'}).format(new RealDate(s.start_at));assert.match(differentZone,/10/);
 }finally{f?.sqlite.close();globalThis.Date=RealDate;}
});
