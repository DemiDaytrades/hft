import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import {fixtureDb} from './financial-plan/testing/db';
import {baseStudent,pfAnswers,instructor} from './financial-plan/testing/fixture';
import * as intake from './student-intake-v2/service';
import {buildAckAuditRecords} from './student-intake-v2/acknowledgments';
import {ACKNOWLEDGMENT_KEYS} from './student-intake-v2/contracts';
import {generatePlan} from './financial-plan/service';
import {installMoneyLesson} from './academy/learning/seed';
import {MONEY_LESSON} from './academy/curriculum/what-is-money';
import {changeLifecycle,getLifecycle,previewDeletion,requestDeletionPreview,assertLifecycleActive} from './student-lifecycle';
import {hasStudentAccess} from './membership-access';
const {db,sqlite}=fixtureDb();
let session:any={user:{id:'paid',role:'student'}};
const load=(Module as any)._load;
(Module as any)._load=function(name:string,...args:any[]){
 if(name==='@opennextjs/cloudflare')return {getCloudflareContext:()=>({env:{DB:db,BETTER_AUTH_URL:"https://local.example.invalid"}})};
 if(name==='react')return {...load.call(this,name,...args),cache:(f:any)=>f};
 if(name==='next/headers')return {headers:async()=>new Headers()};
 if(name==='next/navigation')return {redirect:(path:string)=>{throw new Error(`redirect:${path}`);}};
 if(name==='./auth'||name==='@/lib/auth')return {ROLES:{admin:'admin',student:'student'},getAuth:()=>({api:{getSession:async()=>session}})};
 return load.call(this,name,...args);
};
globalThis.fetch=async()=>{throw new Error('Outbound network forbidden in lifecycle tests');};
const dal=require('./dal'),members=require('./members');
const admin={userId:'admin',role:'admin'};
for(const [id,role] of [['admin','admin'],['paid','student'],['comp','student'],['other','student']])sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run(id,id,`${id}@example.invalid`,role,'2026-11-07','2026-11-07');
sqlite.prepare("UPDATE user SET subscriptionStatus='active',subscriptionId='sub_test_only',stripeCustomerId='cus_test_only' WHERE id='paid'").run();
sqlite.prepare('UPDATE user SET complimentaryAccessStartsAt=?,complimentaryAccessExpiresAt=? WHERE id=?').run('2020-01-01',new Date(Date.now()+30*86400000).toISOString(),'comp');
async function preservedData(){
 await installMoneyLesson(db);
 sqlite.prepare('INSERT INTO student_course_assignment(id,user_id,course_id,assigned_at) VALUES(?,?,?,?)').run('assignment','paid',MONEY_LESSON.courseId,'2026-11-07');
 sqlite.prepare("INSERT INTO student_lesson_progress(id,user_id,lesson_id,status,updated_at) VALUES(?,?,?,'completed',?)").run('progress','paid',MONEY_LESSON.id,'2026-11-07');
 sqlite.prepare("INSERT INTO student_assignment_submission(id,user_id,assignment_id,status,response_text) VALUES(?,?,?,'approved',?)").run('homework','paid',MONEY_LESSON.assignmentId,'Historical synthetic work');
 let source=await intake.createDraftForStudent(db,{studentUserId:'paid',actor:admin});
 await intake.saveStudentAnswers(db,{intakeId:source.id,studentUserId:'paid',actor:admin,mode:'student_reported',sections:{...baseStudent(),...pfAnswers()}});
 await intake.saveInstructorAssessment(db,{intakeId:source.id,studentUserId:'paid',actor:admin,assessment:instructor()});
 const a=buildAckAuditRecords({intake_id:source.id,confirmed_by_user_id:'admin',confirmed_by_role:'admin',capture_mode:'instructor_entered_for_student',confirmations:Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k=>[k,true]))});
 await intake.saveAcknowledgments(db,{intakeId:source.id,studentUserId:'paid',actor:admin,acknowledgments:a.acknowledgments,ackAudit:{records:a.records}});
 source=(await intake.completeIntake(db,{intakeId:source.id,studentUserId:'paid',actor:admin})).intake;
 await generatePlan(db,admin,'paid',source.id,'lifecycle-history');
}
const history=()=>Object.fromEntries(['student_course_assignment','student_lesson_progress','student_assignment_submission','student_intake_v2','student_intake_v2_event','financial_plan_series','financial_plan_version','financial_plan_event'].map(t=>[t,sqlite.prepare(`SELECT * FROM ${t} ORDER BY rowid`).all()]));
test('deactivation overrides paid access, revokes sessions/invites, preserves history and does not cancel billing',async()=>{
 await preservedData();assert.equal((await dal.requireMemberApiUser(new Headers())).id,'paid');
 sqlite.prepare('INSERT INTO session(id,userId,token,expiresAt,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run('session','paid','secret-session','2099-01-01','2026-11-07','2026-11-07');
 sqlite.prepare('INSERT INTO invite(id,token,email,kind,createdBy,createdAt,expiresAt) VALUES(?,?,?,?,?,?,?)').run('old','secret-invite','paid@example.invalid','member:30','admin','2026-11-07','2099-01-01');
 const before=history();const result=await changeLifecycle(db,admin,'paid',{action:'deactivate',revision:0,confirmation:'DEACTIVATE paid@example.invalid',reason:'Program ended',note:'PRIVATE_LIFECYCLE_NOTE',billingChoice:'access_only',paidAcknowledged:true});
 assert.equal(result.status,'DEACTIVATED');assert.deepEqual(history(),before);
 assert.equal((sqlite.prepare("SELECT COUNT(*) AS n FROM session WHERE userId='paid'").get() as any).n,0);
 assert.ok(Date.parse((sqlite.prepare("SELECT expiresAt FROM invite WHERE id='old'").get() as any).expiresAt)<=Date.now());
 const user=sqlite.prepare("SELECT * FROM user WHERE id='paid'").get() as any;assert.equal(user.subscriptionStatus,'active');assert.equal(user.subscriptionId,'sub_test_only');assert.equal(hasStudentAccess(user),false);
 await assert.rejects(dal.requireMemberApiUser(new Headers()),(e:any)=>e.status===403);await assert.rejects(dal.requireActiveMember(),/account-deactivated/);
 await assert.rejects(assertLifecycleActive(db,'paid'),/deactivated/i);
 const academyApi=require('../app/api/academy/learning/route'),financialApi=require('../app/api/financial-plan/route'),questionnaireApi=require('../app/api/consultation/questionnaire/route');
 assert.equal((await academyApi.GET(new Request(`https://local.invalid/api/academy/learning?lessonId=${MONEY_LESSON.id}`))).status,403);
 assert.equal((await academyApi.POST(new Request('https://local.invalid/api/academy/learning',{method:'POST',body:JSON.stringify({lessonId:MONEY_LESSON.id,action:'complete'})}))).status,403);
 assert.equal((await financialApi.GET(new Request('https://local.invalid/api/financial-plan'))).status,403);
 assert.equal((await questionnaireApi.GET()).status,403);
 const lifecycleApi=require('../app/api/admin/student-lifecycle/route');
 assert.equal((await lifecycleApi.GET(new Request('https://local.invalid/api/admin/student-lifecycle?studentId=other'))).status,403);
 assert.equal((await lifecycleApi.POST(new Request('https://local.invalid/api/admin/student-lifecycle',{method:'POST',body:JSON.stringify({studentId:'paid',action:'reactivate',revision:1,confirmation:'REACTIVATE paid@example.invalid'})}))).status,403);
 assert.throws(()=>sqlite.prepare('INSERT INTO session(id,userId,token,expiresAt,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run('bad-new-session','paid','secret-new','2099-01-01','2026-11-07','2026-11-07'),/deactivated/i);
 // Model an otherwise-valid old link in flight; lifecycle still prevents redemption.
 sqlite.prepare("UPDATE invite SET expiresAt='2099-01-01' WHERE id='old'").run();
 const accept=require('../app/invite/[token]/actions'),form=new FormData();form.set('token','secret-invite');
 const redemption=await accept.acceptInviteAction({status:'idle'},form);assert.equal(redemption.status,'error');assert.ok(redemption.message.includes('deactivated'));
 sqlite.prepare("UPDATE invite SET expiresAt='2020-01-01' WHERE id='old'").run();
 assert.deepEqual(history(),before);

 assert.throws(()=>sqlite.prepare("INSERT INTO invite(id,token,email,kind,createdAt,expiresAt) VALUES('newbad','new-secret','paid@example.invalid','member:30','2026-11-07','2099-01-01')").run(),/deactivated/i);
 assert.equal((await members.listMembers()).members.some((u:any)=>u.id==='paid'),false);assert.equal((await members.listMembers({lifecycle:'former'})).members.some((u:any)=>u.id==='paid'),true);
 session={user:{id:'admin',role:'admin'}};
 const reviewApi=require('../app/api/admin/academy/learning/route');
 const formerReview=await reviewApi.GET(new Request(`https://local.invalid/api/admin/academy/learning?studentId=paid&lessonId=${MONEY_LESSON.id}`));
 assert.equal(formerReview.status,200);assert.equal((await formerReview.json()).readOnly,true);
 session={user:{id:'paid',role:'student'}};
 const events=(await getLifecycle(db,admin,'paid')).events;assert.equal(events.at(-1).event_type,'STUDENT_DEACTIVATED');assert.equal(events.at(-1).private_note,'PRIVATE_LIFECYCLE_NOTE');assert.equal(JSON.parse(events.at(-1).safe_metadata_json).membershipType,'Paid membership');
});
test('reactivation restores eligibility only, preserves history and requires a valid entitlement',async()=>{
 const before=history();let current=await getLifecycle(db,admin,'paid');
 await changeLifecycle(db,admin,'paid',{action:'reactivate',revision:current.revision,confirmation:'REACTIVATE paid@example.invalid'});
 assert.deepEqual(history(),before);assert.equal((await dal.requireMemberApiUser(new Headers())).id,'paid');
 const expiry=(sqlite.prepare("SELECT complimentaryAccessExpiresAt FROM user WHERE id='comp'").get() as any).complimentaryAccessExpiresAt;
 session={user:{id:'comp',role:'student'}};assert.equal((await dal.requireMemberApiUser(new Headers())).id,'comp');
 await changeLifecycle(db,admin,'comp',{action:'deactivate',revision:0,confirmation:'DEACTIVATE comp@example.invalid',billingChoice:'access_only'});
 await assert.rejects(dal.requireMemberApiUser(new Headers()),(e:any)=>e.status===403);
 assert.equal((sqlite.prepare("SELECT complimentaryAccessExpiresAt FROM user WHERE id='comp'").get() as any).complimentaryAccessExpiresAt,expiry);
 sqlite.prepare("UPDATE user SET complimentaryAccessExpiresAt='2020-01-01' WHERE id='comp'").run();current=await getLifecycle(db,admin,'comp');
 await changeLifecycle(db,admin,'comp',{action:'reactivate',revision:current.revision,confirmation:'REACTIVATE comp@example.invalid'});
 assert.equal((sqlite.prepare("SELECT complimentaryAccessExpiresAt FROM user WHERE id='comp'").get() as any).complimentaryAccessExpiresAt,'2020-01-01');await assert.rejects(dal.requireMemberApiUser(new Headers()),(e:any)=>e.status===403);
 assert.ok(expiry);assert.deepEqual(history(),before);
});
test('authorization, typed confirmations, paid warning and stale revisions prevent accidental changes',async()=>{
 await assert.rejects(changeLifecycle(db,{userId:'other',role:'admin'},'paid',{action:'deactivate',revision:2,confirmation:'DEACTIVATE paid@example.invalid',billingChoice:'access_only',paidAcknowledged:true}),/Forbidden/);
 await assert.rejects(changeLifecycle(db,admin,'admin',{action:'deactivate',revision:0,confirmation:'DEACTIVATE admin@example.invalid',billingChoice:'access_only'}),/own|staff/i);
 await assert.rejects(changeLifecycle(db,admin,'paid',{action:'deactivate',revision:2,confirmation:'wrong',billingChoice:'access_only',paidAcknowledged:true}),/confirmation/i);
 await assert.rejects(changeLifecycle(db,admin,'paid',{action:'deactivate',revision:2,confirmation:'DEACTIVATE paid@example.invalid',billingChoice:'cancel_and_deactivate',paidAcknowledged:true}),/cancellation|billing/i);
 await assert.rejects(changeLifecycle(db,admin,'paid',{action:'deactivate',revision:2,confirmation:'DEACTIVATE paid@example.invalid',billingChoice:'access_only'}),/paid|billing/i);
 await assert.rejects(changeLifecycle(db,admin,'paid',{action:'deactivate',revision:0,confirmation:'DEACTIVATE paid@example.invalid',billingChoice:'access_only',paidAcknowledged:true}),/changed|revision/i);
});
test('permanent deletion is a protected impact preview, never a destructive executor',async()=>{
 const before=history();await assert.rejects(previewDeletion(db,{userId:'other',role:'student'},'paid'),/Forbidden/);
 const preview=await previewDeletion(db,admin,'paid');assert.equal(preview.executionEnabled,false);assert.ok(preview.items.some((i:any)=>i.category==='EXTERNAL SYSTEM / STRIPE'));assert.ok(!JSON.stringify(preview).includes('secret-'));
 await assert.rejects(requestDeletionPreview(db,admin,'paid','DELETE'),/confirmation/i);
 await requestDeletionPreview(db,admin,'paid','PREVIEW PERMANENT DELETE paid@example.invalid');assert.deepEqual(history(),before);
 assert.ok(sqlite.prepare("SELECT id FROM user WHERE id='paid'").get());
});

test('failed audit rolls back removal; concurrent transitions produce one immutable event',async()=>{
 sqlite.prepare('INSERT INTO session(id,userId,token,expiresAt,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run('other-session','other','other-secret','2099-01-01','2026-11-07','2026-11-07');
 sqlite.prepare('INSERT INTO invite(id,token,email,kind,createdBy,createdAt,expiresAt) VALUES(?,?,?,?,?,?,?)').run('other-invite','other-invite-secret','other@example.invalid','member:30','admin','2026-11-07','2099-01-01');
 const input={action:'deactivate' as const,revision:0,confirmation:'DEACTIVATE other@example.invalid',billingChoice:'access_only' as const};
 sqlite.exec("CREATE TRIGGER fail_lifecycle_audit BEFORE INSERT ON student_lifecycle_event WHEN NEW.student_id='other' BEGIN SELECT RAISE(ABORT,'Injected audit failure'); END;");
 await assert.rejects(changeLifecycle(db,admin,'other',input),/Injected audit/);
 assert.equal((await getLifecycle(db,admin,'other')).status,'ACTIVE');assert.ok(sqlite.prepare("SELECT id FROM session WHERE id='other-session'").get());assert.equal((sqlite.prepare("SELECT expiresAt FROM invite WHERE id='other-invite'").get() as any).expiresAt,'2099-01-01');
 sqlite.exec('DROP TRIGGER fail_lifecycle_audit');
 const results=await Promise.allSettled([changeLifecycle(db,admin,'other',input),changeLifecycle(db,admin,'other',input)]);
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.filter(r=>r.status==='rejected').length,1);
 const state=await getLifecycle(db,admin,'other');assert.equal(state.events.length,1);assert.equal(state.revision,1);
 assert.throws(()=>sqlite.prepare("DELETE FROM student_lifecycle_event WHERE student_id='other'").run(),/retention|immutable/i);
});
test('a billing change during deactivation forces fresh confirmation instead of silently removing a newly paid student',async()=>{
 sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run('billing-race','Synthetic','race@example.invalid','student','2026-11-07','2026-11-07');
 const prepare=db.prepare.bind(db);let once=false;
 const racing={...db,prepare(sql:string){if(!once&&sql.startsWith('UPDATE user SET lifecycle_status')){once=true;sqlite.prepare("UPDATE user SET subscriptionStatus='active',subscriptionId='sub_synthetic' WHERE id='billing-race'").run();}return prepare(sql);}} as D1Database;
 await assert.rejects(changeLifecycle(racing,admin,'billing-race',{action:'deactivate',revision:0,confirmation:'DEACTIVATE race@example.invalid',billingChoice:'access_only'}),/changed|reload/);
 assert.equal((await getLifecycle(db,admin,'billing-race')).status,'ACTIVE');
});
test('protected admin impact endpoint has no destructive action and never returns secret material',async()=>{
 session={user:{id:'admin',role:'admin'}};
 const route=require('../app/api/admin/student-lifecycle/route');
 const preview=await route.GET(new Request('https://local.invalid/api/admin/student-lifecycle?studentId=paid&action=impact'));
 assert.equal(preview.status,200);assert.equal(preview.headers.get('Cache-Control'),'private, no-store');
 const body=await preview.text();assert.ok(!body.includes('secret-'));assert.ok(!body.includes('PRIVATE_LIFECYCLE_NOTE'));assert.ok(body.includes('executionEnabled'));
 const before=history();const result=await route.POST(new Request('https://local.invalid/api/admin/student-lifecycle',{method:'POST',body:JSON.stringify({studentId:'paid',action:'permanent-delete',confirmation:'DELETE paid@example.invalid'})}));assert.equal(result.status,400);assert.deepEqual(history(),before);
});

test('a concurrent deactivation prevents a stale complimentary grant from changing former entitlement',async()=>{
 sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt,complimentaryAccessExpiresAt,complimentaryAccessRevokedAt) VALUES(?,?,?,?,?,?,?,?)').run('grant-race','Synthetic','grant-race@example.invalid','student','2026-11-07','2026-11-07','2020-01-01','2020-01-01');
 const prepare=db.prepare.bind(db);let once=false;
 const racing={...db,prepare(sql:string){if(!once&&sql.startsWith('UPDATE user SET complimentaryAccessStartsAt')){once=true;sqlite.prepare("UPDATE user SET lifecycle_status='DEACTIVATED' WHERE id='grant-race'").run();}return prepare(sql);}} as D1Database;
 const {createComplimentaryInvitation}=require('./complimentary-invitation');
 await assert.rejects(createComplimentaryInvitation(racing,admin,{email:'grant-race@example.invalid',days:30,channels:[]}),/deactivated|lifecycle|changed/i);
 const row=sqlite.prepare("SELECT * FROM user WHERE id='grant-race'").get() as any;assert.equal(row.complimentaryAccessExpiresAt,'2020-01-01');assert.equal(row.complimentaryAccessRevokedAt,'2020-01-01');
});

test('reactivating a canceled paid student does not create a subscription or grant access',async()=>{
 let state=await getLifecycle(db,admin,'billing-race');
 await changeLifecycle(db,admin,'billing-race',{action:'deactivate',revision:state.revision,confirmation:'DEACTIVATE race@example.invalid',billingChoice:'access_only',paidAcknowledged:true});
 // Model legitimate billing state arriving separately; lifecycle must not restore it.
 sqlite.prepare("UPDATE user SET subscriptionStatus='canceled',subscriptionId=NULL WHERE id='billing-race'").run();
 state=await getLifecycle(db,admin,'billing-race');await changeLifecycle(db,admin,'billing-race',{action:'reactivate',revision:state.revision,confirmation:'REACTIVATE race@example.invalid'});
 const row=sqlite.prepare("SELECT * FROM user WHERE id='billing-race'").get() as any;assert.equal(row.subscriptionStatus,'canceled');assert.equal(row.subscriptionId,null);assert.equal(hasStudentAccess(row),false);
 session={user:{id:'billing-race',role:'student'}};await assert.rejects(dal.requireMemberApiUser(new Headers()),(e:any)=>e.status===403);session={user:{id:'admin',role:'admin'}};
});
