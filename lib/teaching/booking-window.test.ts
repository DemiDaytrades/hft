import test from 'node:test';
import assert from 'node:assert/strict';
import {fixtureDb} from '../financial-plan/testing/db';
import {teachingCommand,teachingSnapshot} from './service';
import {addDays,localDate} from './time';
import {bookingTimeAllowed} from './booking-window';

async function fixture(t:any, at='2099-01-05T16:00:00Z') {
 const RealDate=Date;let now=RealDate.parse(at);
 class Clock extends RealDate {constructor(v?:any){super(v===undefined?now:v);}static now(){return now;}}
 globalThis.Date=Clock as DateConstructor;t.after(()=>{globalThis.Date=RealDate;});
 const {sqlite,db}=fixtureDb();t.after(()=>sqlite.close());
 for(const [id,role] of [['host','admin'],['qa','student']])sqlite.prepare("INSERT INTO user(id,name,email,role,createdAt,updatedAt,subscriptionStatus,lifecycle_status) VALUES(?,?,?,?,?,?,'active','ACTIVE')").run(id,id,id+'@example.invalid',role,at,at);
 const run=(actor:string,input:any)=>teachingCommand(db,actor,{requestKey:crypto.randomUUID(),...input});
 const configure=(extra={})=>run('host',{action:'configure',timezone:'America/Chicago',durationMin:60,bufferMin:15,requestHours:48,weeklyAllowance:1,minimumNoticeHours:12,bookingHorizonDays:14,...extra});
 await configure();for(let day=0;day<7;day++)await run('host',{action:'availability',dayOfWeek:day,startTime:'00:00',endTime:'23:59'});
 const slots=async(date:string)=>(await teachingSnapshot(db,'qa',date)).slots!;
 return {sqlite,db,run,configure,slots,setNow:(v:string)=>{now=RealDate.parse(v);}};
}
test('booking notice and horizon persist separately from pending request expiry',async t=>{
 const f=await fixture(t);let c=(await teachingSnapshot(f.db,'host')).config!;
 assert.equal(c.minimum_notice_hours,12);assert.equal(c.booking_horizon_days,14);assert.equal(c.request_hours,48);
 await f.configure({minimumNoticeHours:24,bookingHorizonDays:7});
 await f.run('host',{action:'configure',timezone:'America/Chicago',durationMin:60,bufferMin:15,requestHours:36,weeklyAllowance:1});
 c=(await teachingSnapshot(f.db,'qa')).config!;assert.equal(c.minimum_notice_hours,24);assert.equal(c.booking_horizon_days,7);assert.equal(c.request_hours,36);
 for(const extra of [{minimumNoticeHours:-1},{minimumNoticeHours:1.5},{bookingHorizonDays:0},{bookingHorizonDays:91}])await assert.rejects(f.configure(extra),/whole number/);
});
test('11h59m is denied, exactly 12h is offered, and direct/stale slots are revalidated',async t=>{
 const f=await fixture(t,'2099-01-05T16:01:00Z');
 const date='2099-01-05';const start='2099-01-06T04:00:00.000Z';
 const c=(await teachingSnapshot(f.db,'qa')).config!;const forged=`${date}/${c.revision}/${start}`;
 assert.ok(!(await f.slots(date)).some((s:any)=>s.start_at===start));await assert.rejects(f.run('qa',{action:'request',slotId:forged}),/Slot unavailable/);
 f.setNow('2099-01-05T16:00:00Z');const slot=(await f.slots(date)).find((s:any)=>s.start_at===start);assert.ok(slot);
 f.setNow('2099-01-05T16:01:00Z');await assert.rejects(f.run('qa',{action:'request',slotId:slot.id}),/Slot unavailable/);
 f.setNow('2099-01-05T16:00:00Z');await f.run('qa',{action:'request',slotId:slot.id});assert.equal((await teachingSnapshot(f.db,'qa')).sessions[0].status,'REQUESTED');
});
test('14-day cutoff is inclusive to the same local time; later instants and day 15 are rejected',async t=>{
 const f=await fixture(t);const slots=await f.slots('2099-01-19');assert.ok(slots.some((s:any)=>s.start_at==='2099-01-19T16:00:00.000Z'));
 assert.ok(!slots.some((s:any)=>s.start_at==='2099-01-19T16:15:00.000Z'));assert.deepEqual(await f.slots('2099-01-20'),[]);
 const c=(await teachingSnapshot(f.db,'qa')).config!;await assert.rejects(f.run('qa',{action:'request',slotId:`2099-01-20/${c.revision}/2099-01-20T16:00:00.000Z`}),/Slot unavailable/);
 const old=slots[0];await f.configure({bookingHorizonDays:7});await assert.rejects(f.run('qa',{action:'request',slotId:old.id}),/Slot unavailable/);
});
test('valid held requests remain confirmable inside notice; fresh alternatives still obey the window',async t=>{
 const f=await fixture(t);const slot=(await f.slots('2099-01-06'))[0];await f.run('qa',{action:'request',slotId:slot.id});let s=(await teachingSnapshot(f.db,'qa')).sessions[0];
 f.setNow(new Date(Date.parse(s.start_at)-11*3600000).toISOString());await f.run('host',{action:'confirm',sessionId:s.id,expectedRevision:s.revision});s=(await teachingSnapshot(f.db,'qa')).sessions[0];assert.equal(s.status,'CONFIRMED');
 const c=(await teachingSnapshot(f.db,'qa')).config!;await assert.rejects(f.run('qa',{action:'propose',sessionId:s.id,expectedRevision:s.revision,slotId:`2099-01-06/${c.revision}/2099-01-06T06:15:00.000Z`}),/Slot unavailable/);
 assert.equal((await teachingSnapshot(f.db,'qa')).sessions[0].start_at,slot.start_at);await f.run('qa',{action:'cancel',sessionId:s.id,expectedRevision:s.revision});assert.equal((await teachingSnapshot(f.db,'qa')).sessions[0].status,'CANCELED_BY_STUDENT');
});
test('calendar-day horizon preserves Chicago wall time across both DST transitions',async t=>{
 const f=await fixture(t,'2027-03-01T16:00:00Z');
 for(const [now,expected] of [['2027-03-01T16:00:00Z','2027-03-15T15:00:00.000Z'],['2027-10-25T15:00:00Z','2027-11-08T16:00:00.000Z']]){
  f.setNow(now);const date=addDays(localDate(now,'America/Chicago'),14);const slots=await f.slots(date);assert.ok(slots.some((s:any)=>s.start_at===expected));assert.ok(!slots.some((s:any)=>s.start_at>expected));
 }
});

test('window comparison includes exact millisecond cutoffs and rejects one millisecond outside',()=>{
 const c={timezone:'America/Chicago',minimum_notice_hours:12,booking_horizon_days:14},now=Date.parse('2027-01-01T16:00:00Z');
 assert.equal(bookingTimeAllowed('2027-01-02T03:59:59.999Z',c,now),false);assert.equal(bookingTimeAllowed('2027-01-02T04:00:00.000Z',c,now),true);
 assert.equal(bookingTimeAllowed('2027-01-15T16:00:00.000Z',c,now),true);assert.equal(bookingTimeAllowed('2027-01-15T16:00:00.001Z',c,now),false);
});
test('transaction rejects a request whose notice expires after slot validation',async t=>{
 const f=await fixture(t);const slot=(await f.slots('2099-01-05')).find((s:any)=>s.start_at==='2099-01-06T04:00:00.000Z');assert.ok(slot);
 const original=f.db.batch.bind(f.db);
 f.db.batch=async stmts=>{
  const late=Date.parse('2099-01-05T16:00:01Z');
  f.sqlite.function('julianday',{varargs:true},(...args:any[])=>((args[0]==='now'?late:Date.parse(String(args[0])))/86400000)+2440587.5);
  return original(stmts);
 };
 await assert.rejects(f.run('qa',{action:'request',slotId:slot.id}),/schedule.*changed/);
 assert.equal(f.sqlite.prepare('SELECT count(*) AS n FROM teaching_session').get()!.n,0);
});
test('configuration changes during a slot request cannot bypass the horizon',async t=>{
 const f=await fixture(t);const slot=(await f.slots('2099-01-19'))[0];const original=f.db.batch.bind(f.db);
 f.db.batch=async stmts=>{f.sqlite.exec("UPDATE teaching_config SET booking_horizon_days=1,revision=revision+1 WHERE id='primary'");return original(stmts);};
 await assert.rejects(f.run('qa',{action:'request',slotId:slot.id}),/schedule.*changed/);assert.equal(f.sqlite.prepare('SELECT count(*) AS n FROM teaching_session').get()!.n,0);
});
for(const proposer of ['host','qa'])test(`held ${proposer==='host'?'instructor':'student'} alternative stays confirmable inside notice until expiry`,async t=>{
 const f=await fixture(t);const slots=await f.slots('2099-01-06');await f.run('qa',{action:'request',slotId:slots[0].id});let s=(await teachingSnapshot(f.db,'qa')).sessions[0];
 await f.run(proposer,{action:'propose',sessionId:s.id,expectedRevision:s.revision,slotId:slots[4].id});s=(await teachingSnapshot(f.db,'qa')).sessions[0];
 const proposed=s.proposed_start_at;f.setNow(new Date(Date.parse(proposed)-11*3600000).toISOString());
 await f.run(proposer==='host'?'qa':'host',{action:proposer==='host'?'accept':'confirm',sessionId:s.id,expectedRevision:s.revision});
 s=(await teachingSnapshot(f.db,'qa')).sessions[0];assert.equal(s.status,'CONFIRMED');assert.equal(s.start_at,proposed);
});
