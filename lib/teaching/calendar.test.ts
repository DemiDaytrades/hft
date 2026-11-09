import {test} from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {readdirSync,readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {fixtureDb} from '../financial-plan/testing/db';
import {localInstants,localDate,addDays,weekKey} from './time';
test('Chicago DST gaps, folds and local calendar weeks',()=>{
 assert.deepEqual(localInstants('2026-03-08','02:30','America/Chicago'),[]);
 assert.deepEqual(localInstants('2026-11-01','01:30','America/Chicago'),['2026-11-01T06:30:00.000Z','2026-11-01T07:30:00.000Z']);
 assert.equal(localDate('2026-11-09T02:00:00Z','America/Chicago'),'2026-11-08');
 assert.equal(weekKey('2026-11-09T02:00:00Z','America/Chicago'),'2026-11-02');
 assert.equal(addDays('2026-03-07',1),'2026-03-08');
 assert.throws(()=>localInstants('2026-02-30','10:00','America/Chicago'));
 assert.throws(()=>localInstants('2026-02-28','24:00','America/Chicago'));
});
function setup(){const {sqlite}=fixtureDb();sqlite.exec(`INSERT INTO user (id,name,email,emailVerified,createdAt,updatedAt) VALUES ('teacher','Teacher','teacher@test',1,0,0); INSERT INTO consultation_type(id,name,duration_min,price_cents,created_at,updated_at) VALUES ('ct','Test',60,0,'x','x')`);return sqlite;}
function lesson(db:ReturnType<typeof setup>,id='lesson',start='2099-11-09T18:00:00Z',end='2099-11-09T19:00:00Z',status='CONFIRMED',expires:string|null=null){db.prepare(`INSERT INTO teaching_session(id,instructor_id,start_at,end_at,timezone,buffer_min,status,expires_at,created_at,updated_at) VALUES (?,'teacher',?,?,'America/Chicago',15,?,?,datetime('now'),datetime('now'))`).run(id,start,end,status,expires);}
function consultation(db:ReturnType<typeof setup>,at='2099-11-09T12:00',id='consult'){db.prepare(`INSERT INTO consultation_booking(id,consultation_type_id,customer_name,customer_email,customer_phone,appointment_at,duration_min,price_cents,created_at,updated_at) VALUES (?,'ct','Test','test@test','0',?,60,0,'x','x')`).run(id,at);}
test('shared calendar guards both arrival orders and buffers',()=>{for(const first of ['lesson','consult']){const db=setup();if(first==='lesson'){lesson(db);assert.throws(()=>consultation(db),/calendar_conflict/);}else{consultation(db);assert.throws(()=>lesson(db),/calendar_conflict/);}db.close();} const db=setup();lesson(db);assert.throws(()=>consultation(db,'2099-11-09T19:14:00Z'),/calendar_conflict/);consultation(db,'2099-11-09T19:15:00Z');db.close();});
test('expired requests release but pending consultation never expires before late paid confirmation',()=>{const db=setup();lesson(db,'old',undefined,undefined,'REQUESTED','2000-01-01T00:00:00Z');consultation(db);assert.throws(()=>lesson(db,'new'),/calendar_conflict/);db.exec(`UPDATE consultation_booking SET status='confirmed' WHERE id='consult'`);db.close();});
test('consultation updates and teaching proposals reserve atomically',()=>{const db=setup();consultation(db,'2099-11-10T18:00:00Z');lesson(db);assert.throws(()=>db.exec(`UPDATE consultation_booking SET appointment_at='2099-11-09T18:30:00Z',status='confirmed'`),/calendar_conflict/);assert.throws(()=>db.exec(`UPDATE teaching_session SET status='ALTERNATIVE_PROPOSED',base_status='CONFIRMED',proposed_start_at='2099-11-10T18:00:00Z',proposed_end_at='2099-11-10T19:00:00Z',proposed_expires_at='2100-01-01T00:00:00Z'`),/calendar_conflict/);db.close();});
test('consultation Chicago normalization, offsets and epoch seconds agree',()=>{
 for(const [at,start,end] of [
 ['2026-07-01T12:00','2026-07-01T17:00:00Z','2026-07-01T18:00:00Z'],
 ['2026-01-01T12:00','2026-01-01T18:00:00Z','2026-01-01T19:00:00Z'],
 ['2026-11-01T01:30','2026-11-01T06:30:00Z','2026-11-01T08:30:00Z'],
 ['2026-07-01T12:00:00-05:00','2026-07-01T17:00:00Z','2026-07-01T18:00:00Z'],
 [String(Date.parse('2026-07-01T17:00:00Z')/1000),'2026-07-01T17:00:00Z','2026-07-01T18:00:00Z'],
 ]){const db=setup();consultation(db,at);const w=db.prepare('SELECT * FROM teaching_consultation_windows').get()!;assert.equal(w.start_epoch,Date.parse(start)/1000);assert.equal(w.end_epoch,Date.parse(end)/1000);db.close();}
});
test('unknown legacy dates fail closed without rewriting stored consultation values',()=>{
 for(const at of ['not-a-date','2026-03-08T02:30','2001-01-01T12:00']){const db=setup();const trigger=db.prepare("SELECT sql FROM sqlite_master WHERE name='consultation_booking_time_insert'").get()!.sql as string;assert.throws(()=>consultation(db,at),/calendar_invalid_time/);db.exec('DROP TRIGGER consultation_booking_time_insert');consultation(db,at);db.exec(trigger);assert.equal(db.prepare('SELECT appointment_at FROM consultation_booking').get()!.appointment_at,at);assert.throws(()=>lesson(db),/calendar_conflict/);db.close();}
});
test('unexpired request and proposed windows reserve; expired proposal releases only its window',()=>{
 const db=setup();lesson(db,'request',undefined,undefined,'REQUESTED','2100-01-01T00:00:00Z');assert.throws(()=>consultation(db),/calendar_conflict/);db.exec(`UPDATE teaching_session SET status='ALTERNATIVE_PROPOSED',base_status='CONFIRMED',proposed_start_at='2099-11-10T18:00:00Z',proposed_end_at='2099-11-10T19:00:00Z',proposed_expires_at='2100-01-01T00:00:00Z'`);assert.throws(()=>consultation(db,'2099-11-10T18:00:00Z'),/calendar_conflict/);db.exec(`UPDATE teaching_session SET proposed_expires_at='2000-01-01T00:00:00Z'`);consultation(db,'2099-11-10T18:00:00Z');assert.throws(()=>consultation(db,undefined,'original-conflict'),/calendar_conflict/);db.close();
});

test('additive migration preserves complete existing consultation rows and rejects later conflicts',()=>{
 const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON');
 for(const f of readdirSync('migrations').filter(f=>f.endsWith('.sql')&&f<'0033_weekly_teaching.sql').sort())db.exec(readFileSync(`migrations/${f}`,'utf8'));
 db.exec(`INSERT INTO user(id,name,email,emailVerified,createdAt,updatedAt) VALUES ('teacher','Teacher','teacher@test',1,0,0); INSERT INTO consultation_type(id,name,duration_min,price_cents,created_at,updated_at) VALUES ('ct','Test',60,0,'x','x')`);
 consultation(db,'2026-11-01T01:30','legacy-fold');consultation(db,'legacy-unparseable','legacy-unknown');
 const before=db.prepare('SELECT * FROM consultation_booking ORDER BY id').all();
 db.exec(readFileSync('migrations/0033_weekly_teaching.sql','utf8'));
 assert.deepEqual(db.prepare('SELECT * FROM consultation_booking ORDER BY id').all(),before);
 assert.throws(()=>lesson(db),/calendar_conflict/);
 db.exec(`UPDATE consultation_booking SET admin_notes='retained edit' WHERE id='legacy-unknown'`);
 db.close();
});
test('database guards teaching conflicts independent of caller and compares effective buffers',()=>{
 const db=setup();lesson(db);assert.throws(()=>lesson(db,'second'),/calendar_conflict/);
 lesson(db,'after','2099-11-09T19:15:00Z','2099-11-09T20:15:00Z');
 assert.throws(()=>db.exec(`UPDATE teaching_session SET buffer_min=30 WHERE id='after'`),/calendar_conflict/);
 assert.throws(()=>db.exec(`UPDATE teaching_session SET end_at='broken' WHERE id='after'`),/CHECK constraint/);
 db.close();
});
test('atomic command can refer to its newly inserted session; later failure rolls everything back',async()=>{
 const {db,sqlite}=fixtureDb();sqlite.exec(`INSERT INTO user(id,name,email,emailVerified,createdAt,updatedAt) VALUES ('teacher','Teacher','teacher@test',1,0,0)`);
 const command=(key:string,id:string)=>db.prepare('INSERT INTO teaching_command(actor_id,request_key,body_json,result_session_id,created_at) VALUES(?,?,?,?,?)').bind('teacher',key,'{}',id,'2099-01-01T00:00:00Z');
 const session=(id:string)=>db.prepare(`INSERT INTO teaching_session(id,instructor_id,start_at,end_at,timezone,buffer_min,status,created_at,updated_at) VALUES (?,'teacher','2099-11-09T18:00:00Z','2099-11-09T19:00:00Z','America/Chicago',15,'CONFIRMED','2099-01-01T00:00:00Z','2099-01-01T00:00:00Z')`).bind(id);
 await db.batch([command('first','first'),session('first')]);
 assert.equal(sqlite.prepare('SELECT count(*) n FROM teaching_command').get()!.n,1);
 await assert.rejects(db.batch([command('conflict','conflict'),session('conflict')]),/calendar_conflict/);
 assert.equal(sqlite.prepare('SELECT count(*) n FROM teaching_command').get()!.n,1);
 await assert.rejects(db.batch([command('missing','missing')]),/FOREIGN KEY constraint/);
 assert.equal(sqlite.prepare('SELECT count(*) n FROM teaching_command').get()!.n,1);
 sqlite.close();
});
