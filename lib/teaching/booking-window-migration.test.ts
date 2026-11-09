import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readdirSync,readFileSync} from 'node:fs';

test('0038 preserves existing scheduling rows and adds independent constrained settings',()=>{
 const db=new DatabaseSync(':memory:');try{
  db.exec('PRAGMA foreign_keys=ON');for(const name of readdirSync('migrations').filter(n=>n.endsWith('.sql')&&n<'0038').sort())db.exec(readFileSync('migrations/'+name,'utf8'));
  db.exec("INSERT INTO user(id,name,email,createdAt,updatedAt) VALUES('qa-host','QA','qa@example.invalid',0,0); INSERT INTO teaching_config(id,instructor_id,timezone,duration_min,buffer_min,request_hours,weekly_allowance) VALUES('primary','qa-host','America/Chicago',60,15,37,1); INSERT INTO teaching_override(id,instructor_id,date,blocked) VALUES('qa-block','qa-host','2099-01-01',1)");
  const before=db.prepare('SELECT * FROM teaching_config').get()!,overrides=db.prepare('SELECT * FROM teaching_override').all();
  db.exec(readFileSync('migrations/0038_teaching_booking_window.sql','utf8'));const after=db.prepare('SELECT * FROM teaching_config').get()!;
  for(const key of Object.keys(before))assert.equal(after[key],before[key]);assert.equal(after.minimum_notice_hours,12);assert.equal(after.booking_horizon_days,14);assert.equal(after.request_hours,37);assert.deepEqual(db.prepare('SELECT * FROM teaching_override').all(),overrides);assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
  assert.throws(()=>db.exec('UPDATE teaching_config SET minimum_notice_hours=-1'),/CHECK/);assert.throws(()=>db.exec('UPDATE teaching_config SET booking_horizon_days=0'),/CHECK/);
 }finally{db.close();}
});
