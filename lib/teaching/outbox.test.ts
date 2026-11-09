import test from 'node:test';
import assert from 'node:assert/strict';
import {fixtureDb} from '../financial-plan/testing/db';
let worker:any;try{worker=require('./outbox').processTeachingOutboxMock;}catch(e:any){if(e.code!=='MODULE_NOT_FOUND')throw e;}
function setup(){
 const {sqlite,db}=fixtureDb();
 for(const [id,role] of [['host','admin'],['student','student'],['other','student']])sqlite.prepare(`INSERT INTO user(id,name,email,createdAt,updatedAt,role,lifecycle_status,subscriptionStatus,must_change_password) VALUES(?,?,?,'2026-01-01','2026-01-01',?,'ACTIVE','active',0)`).run(id,id,id+'@example.test',role);
 sqlite.exec(`INSERT INTO teaching_config(id,instructor_id) VALUES('primary','host'); INSERT INTO teaching_session(id,instructor_id,student_id,start_at,end_at,timezone,buffer_min,status,base_status,created_at,updated_at) VALUES('session','host','student','2099-01-01T12:00:00Z','2099-01-01T13:00:00Z','America/Chicago',15,'CONFIRMED','CONFIRMED','2026-01-01','2026-01-01'); INSERT INTO teaching_enrollment VALUES('session','student','ENROLLED')`);
 const job=(id='job',recipient='student',channel='email',revision=1,type='CONFIRMATION')=>sqlite.prepare(`INSERT INTO teaching_outbox(id,session_id,revision,recipient_id,channel,type,due_at) VALUES(?,'session',?,?,?,?, '2020-01-01T00:00:00Z')`).run(id,revision,recipient,channel,type);
 return {sqlite,db,job};
}
test('mock processor exists with real delivery disabled',()=>assert.equal(typeof worker,'function'));
test('durably mocks once across concurrent workers and logs only mocked state',async()=>{
 const {sqlite,db,job}=setup();job();const results=await Promise.all([worker(db),worker(db)]);
 assert.equal(results.reduce((n,r)=>n+r.mocked,0),1);assert.equal(sqlite.prepare('SELECT attempts FROM teaching_outbox').get()?.attempts,1);
 const logs=sqlite.prepare('SELECT * FROM communication_log').all();assert.equal(logs.length,1);assert.equal(logs[0].status,'mocked');assert.equal(logs[0].event_type,'teaching_CONFIRMATION');assert.equal(logs[0].provider_message_id,null);assert.deepEqual(await worker(db),{mocked:0,skipped:0});
});
for(const [name,sql] of [
 ['canceled',`UPDATE teaching_session SET status='CANCELED_BY_STUDENT'`],['stale revision',`UPDATE teaching_session SET revision=2`],['expired membership',`UPDATE user SET subscriptionStatus='expired' WHERE id='student'`],['deactivated',`UPDATE user SET lifecycle_status='DEACTIVATED' WHERE id='student'`],['forced password',`UPDATE user SET must_change_password=1 WHERE id='student'`],['banned',`UPDATE user SET banned=1 WHERE id='student'`],['unenrolled',`UPDATE teaching_enrollment SET status='CANCELED'`],['email consent',`UPDATE user SET email_opted_in=0 WHERE id='student'`],['empty email',`UPDATE user SET email='  ' WHERE id='student'`],['revoked complimentary',`UPDATE user SET subscriptionStatus='expired',complimentaryAccessExpiresAt='2099-01-01',complimentaryAccessRevokedAt='2026-01-01' WHERE id='student'`],['future complimentary',`UPDATE user SET subscriptionStatus='expired',complimentaryAccessStartsAt='2098-01-01',complimentaryAccessExpiresAt='2099-01-01' WHERE id='student'`],
])test(`skips ${name} without a communication log`,async()=>{const {sqlite,db,job}=setup();job();sqlite.exec(sql);assert.deepEqual(await worker(db),{mocked:0,skipped:1});assert.equal(sqlite.prepare('SELECT count(*) AS n FROM communication_log').get()?.n,0);assert.equal(sqlite.prepare('SELECT status FROM teaching_outbox').get()?.status,'SKIPPED');});
test('paid access survives complimentary revocation and assigned staff need no membership',async()=>{const {sqlite,db,job}=setup();job();job('hostjob','host');sqlite.exec(`UPDATE user SET complimentaryAccessRevokedAt='2026-01-01'; UPDATE user SET subscriptionStatus='expired' WHERE id='host'`);assert.deepEqual(await worker(db),{mocked:2,skipped:0});});
test('only current assigned instructor or enrolled student can receive jobs',async()=>{const {db,job}=setup();job('unassigned','other');assert.deepEqual(await worker(db),{mocked:0,skipped:1});});
test('sms opt in and nonempty phone required; email remains an independent fallback',async()=>{const {sqlite,db,job}=setup();job('email');job('sms','student','sms');assert.deepEqual(await worker(db),{mocked:1,skipped:1});sqlite.exec(`UPDATE user SET sms_opted_in=1,phone_number='+15555550100' WHERE id='student'`);job('smsnext','student','sms',1,'REMINDER_1H');assert.deepEqual(await worker(db),{mocked:1,skipped:0});});
test('type, revision, channel and session distinguish idempotency keys',async()=>{const {sqlite,db,job}=setup();job();job('reminder','student','email',1,'REMINDER_1H');await worker(db);sqlite.exec(`UPDATE teaching_session SET revision=2`);job('revision2','student','email',2);await worker(db);const keys=sqlite.prepare('SELECT idempotency_key FROM communication_log').all().map(r=>r.idempotency_key);assert.equal(new Set(keys).size,3);});
test('validates bounded integer limits and leaves future jobs pending',async()=>{const {sqlite,db,job}=setup();for(const limit of [0,-1,501,1.5,NaN])await assert.rejects(()=>worker(db,limit));job();sqlite.exec(`UPDATE teaching_outbox SET due_at='2099-01-01T00:00:00Z'`);assert.deepEqual(await worker(db),{mocked:0,skipped:0});});
test('eligibility is rechecked after candidate read and before atomic claim',async()=>{const {sqlite,db,job}=setup();job();const raced={prepare:db.prepare.bind(db),batch:async(stmts:D1PreparedStatement[])=>{sqlite.exec(`UPDATE teaching_session SET revision=2`);return db.batch(stmts);}} as D1Database;assert.deepEqual(await worker(raced),{mocked:0,skipped:1});assert.equal(sqlite.prepare('SELECT count(*) AS n FROM communication_log').get()?.n,0);});
test('failed log insertion rolls back claim so the pending job remains retryable',async()=>{const {sqlite,db,job}=setup();job();sqlite.exec(`CREATE TRIGGER fail_mock_log BEFORE INSERT ON communication_log BEGIN SELECT RAISE(ABORT,'fixture log unavailable'); END`);await assert.rejects(()=>worker(db),/fixture log unavailable/);assert.equal(sqlite.prepare('SELECT status FROM teaching_outbox').get()?.status,'PENDING');assert.equal(sqlite.prepare('SELECT attempts FROM teaching_outbox').get()?.attempts,0);sqlite.exec('DROP TRIGGER fail_mock_log');assert.deepEqual(await worker(db),{mocked:1,skipped:0});});
for(const [name,sql] of [
 ['expired complimentary',`UPDATE user SET subscriptionStatus='expired',complimentaryAccessExpiresAt='2020-01-01' WHERE id='student'`],
 ['staff password required',`UPDATE user SET must_change_password=1 WHERE id='host'`],
 ['staff no longer assigned',`UPDATE teaching_config SET instructor_id='other'`],
])test(`rechecks ${name}`,async()=>{const {sqlite,db,job}=setup();job('job',name.startsWith('staff')?'host':'student');sqlite.exec(sql);assert.deepEqual(await worker(db),{mocked:0,skipped:1});});
test('previous persisted delivery state suppresses a reset pending job',async()=>{const {sqlite,db,job}=setup();job();await worker(db);sqlite.exec(`UPDATE teaching_outbox SET status='PENDING'`);assert.deepEqual(await worker(db),{mocked:0,skipped:1});assert.equal(sqlite.prepare('SELECT count(*) AS n FROM communication_log').get()?.n,1);});
test('next weekly session has an independent notification key',async()=>{const {sqlite,db,job}=setup();job();await worker(db);sqlite.exec(`INSERT INTO teaching_session(id,instructor_id,student_id,start_at,end_at,timezone,buffer_min,status,base_status,created_at,updated_at) VALUES('next','host','student','2099-01-08T12:00:00Z','2099-01-08T13:00:00Z','America/Chicago',15,'CONFIRMED','CONFIRMED','2026-01-01','2026-01-01'); INSERT INTO teaching_enrollment VALUES('next','student','ENROLLED'); INSERT INTO teaching_outbox(id,session_id,revision,recipient_id,channel,type,due_at) VALUES('nextjob','next',1,'student','email','CONFIRMATION','2020-01-01T00:00:00Z')`);assert.deepEqual(await worker(db),{mocked:1,skipped:0});assert.equal(sqlite.prepare('SELECT count(DISTINCT idempotency_key) AS n FROM communication_log').get()?.n,2);});
for(const type of ['CONFIRMATION','REMINDER_24H','REMINDER_1H'])test(`skips overdue ${type} after the confirmed class has started`,async()=>{
 const {sqlite,db,job}=setup();job('overdue','student','email',1,type);
 sqlite.exec(`UPDATE teaching_session SET start_at='2020-01-01T12:00:00Z',end_at='2020-01-01T13:00:00Z'`);
 assert.deepEqual(await worker(db),{mocked:0,skipped:1});
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM communication_log').get()?.n,0);
});
test('worker expires an unanswered confirmed alternative and rearms future reminders without a dashboard read',async()=>{
 const {sqlite,db,job}=setup();job();sqlite.exec(`UPDATE teaching_outbox SET status='CANCELED'; UPDATE teaching_session SET status='ALTERNATIVE_PROPOSED',base_status='CONFIRMED',proposed_start_at='2099-01-02T12:00:00Z',proposed_end_at='2099-01-02T13:00:00Z',proposed_expires_at='2001-01-01T00:00:00Z',proposal_by='host'`);
 assert.deepEqual(await worker(db),{mocked:0,skipped:0});
 const s=sqlite.prepare('SELECT status,revision FROM teaching_session').get();assert.equal(s?.status,'CONFIRMED');assert.equal(s?.revision,2);
 assert.equal(sqlite.prepare(`SELECT count(*) AS n FROM teaching_outbox WHERE revision=2 AND status='PENDING' AND type IN ('REMINDER_24H','REMINDER_1H')`).get()?.n,8);
 assert.equal(sqlite.prepare(`SELECT count(*) AS n FROM teaching_outbox WHERE revision=2 AND type='CONFIRMATION'`).get()?.n,0);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM communication_log').get()?.n,0);
});
test('unexpired alternative continues to pause reminders without changing the proposed session',async()=>{
 const {sqlite,db,job}=setup();job();sqlite.exec(`UPDATE teaching_outbox SET status='CANCELED'; UPDATE teaching_session SET status='ALTERNATIVE_PROPOSED',base_status='CONFIRMED',proposed_start_at='2099-01-02T12:00:00Z',proposed_end_at='2099-01-02T13:00:00Z',proposed_expires_at='2098-01-01T00:00:00Z',proposal_by='host'`);
 assert.deepEqual(await worker(db),{mocked:0,skipped:0});assert.equal(sqlite.prepare('SELECT status FROM teaching_session').get()?.status,'ALTERNATIVE_PROPOSED');assert.equal(sqlite.prepare('SELECT revision FROM teaching_session').get()?.revision,1);assert.equal(sqlite.prepare(`SELECT count(*) AS n FROM teaching_outbox WHERE status='PENDING'`).get()?.n,0);
});
