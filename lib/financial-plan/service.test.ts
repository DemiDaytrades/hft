import test from 'node:test';
import Module from 'node:module';
import assert from 'node:assert/strict';
import {fixtureDb} from './testing/db';
import {baseStudent,pfAnswers,instructor} from './testing/fixture';
import * as intake from '../student-intake-v2/service';
import {buildAckAuditRecords} from '../student-intake-v2/acknowledgments';
import {ACKNOWLEDGMENT_KEYS} from '../student-intake-v2/contracts';
import {generatePlan,getStaffPlans,editPlan,transitionPlan,publishPlan,getStudentPlan} from './service';
const actor={userId:'staff',role:'admin'};
async function setup(){const f=fixtureDb();for(const [id,role] of [['staff','admin'],['a','student'],['b','student']])f.sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run(id,id,`${id}@example.invalid`,role,'2026-11-07','2026-11-07');return f;}
async function completed(db:D1Database,student='a',overrides:any={}){
 let r=await intake.createDraftForStudent(db,{studentUserId:student,actor});
 r=await intake.saveStudentAnswers(db,{intakeId:r.id,studentUserId:student,actor,mode:'instructor_entered_for_student',sections:{...baseStudent(),...pfAnswers(),...overrides}});
 r=await intake.saveInstructorAssessment(db,{intakeId:r.id,studentUserId:student,actor,assessment:{...instructor(),instructorPrivateNotes:{value:'PRIVATE_SENTINEL'}}});
 const a=buildAckAuditRecords({intake_id:r.id,confirmed_by_user_id:actor.userId,confirmed_by_role:'admin',capture_mode:'instructor_entered_for_student',confirmations:Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k=>[k,true])),form_version:r.form_version,schema_version:r.schema_version});
 await intake.saveAcknowledgments(db,{intakeId:r.id,studentUserId:student,actor,acknowledgments:a.acknowledgments,ackAudit:{records:a.records}});
 return (await intake.completeIntake(db,{intakeId:r.id,studentUserId:student,actor})).intake;
}
test('synthetic E2E: exact completed source, idempotent draft, review, approval, publication and preserved revision',async()=>{
 const {db,sqlite}=await setup();try{
 const source=await completed(db);
 const p=await generatePlan(db,actor,'a',source.id,'request1');
 assert.equal(p.status,'DRAFT');assert.equal(p.source.id,source.id);assert.equal(p.source.snapshot_version,source.snapshot_version);
 assert.equal((await generatePlan(db,actor,'a',source.id,'request1')).id,p.id);
 assert.equal(await getStudentPlan(db,'a'),null);assert.equal(await getStudentPlan(db,'b'),null);
 await assert.rejects(transitionPlan(db,{userId:'a',role:'admin'},p.id,p.editRevision,'approve'),/Forbidden/);
 await assert.rejects(publishPlan(db,actor,p.id,p.editRevision,0),/approved/i);
 const edited=await editPlan(db,actor,p.id,p.editRevision,{privateNotes:'PRIVATE_PLAN_SENTINEL',explanation:'Focus on the recorded funding context and demo practice.',actions:[{text:'Review the currency conversion examples in demo.',rationale:'Consultation agreed practice.',priority:'normal',status:'open',evidence:['immediateActionItems']}],reason:'Consultation interpretation',reviewResolution:'All missing information and conflicts reviewed; no live-capital approval.'});
 await assert.rejects(editPlan(db,actor,p.id,p.editRevision,edited.instructor),/changed|stale/i);
 const reviewed=await transitionPlan(db,actor,p.id,edited.editRevision,'review');
 const approved=await transitionPlan(db,actor,p.id,reviewed.editRevision,'approve');
 const beforePublish=approved.studentPreview;
 await publishPlan(db,actor,p.id,approved.editRevision,0);
 const view=await getStudentPlan(db,'a');assert.equal(view!.plan.id,p.id);assert.deepEqual(view!.plan.content,beforePublish);
 assert.ok(!JSON.stringify(view).includes('PRIVATE'));assert.ok(!JSON.stringify(view).includes('instructor_assessment'));assert.ok(!JSON.stringify(view).includes('recommended_starting_level'));
 const load=(Module as any)._load;let sessionId='a';
 (Module as any)._load=function(name:string,...args:any[]){if(name==='@/lib/dal')return {requireMemberApiUser:async()=>({id:sessionId,role:'student'})};if(name==='@opennextjs/cloudflare')return {getCloudflareContext:()=>({env:{DB:db}})};return load.call(this,name,...args);};
 try {
  const route=require('../../app/api/financial-plan/route');
  const own=await route.GET(new Request('https://local.invalid/api/financial-plan?studentId=b'));assert.equal((await own.json()).plan.id,p.id);
  sessionId='b';const other=await route.GET(new Request('https://local.invalid/api/financial-plan?studentId=a'));assert.equal(await other.json(),null);
 } finally {(Module as any)._load=load;}

 await assert.rejects(intake.saveStudentAnswers(db,{intakeId:source.id,studentUserId:'a',actor,mode:'student_reported',sections:{monthlyTakeHomeRange:{value:'$0'}}}),/immutable|completed/i);
 assert.throws(()=>sqlite.prepare("UPDATE student_intake_v2 SET student_sections_json='{}' WHERE id=?").run(source.id),/immutable/);
 const newer=await completed(db,'a',{financialReasonForTrading:{value:'Synthetic changed motivation'}});
 assert.equal((await getStudentPlan(db,'a'))!.sourceOutdated,true);
 const p2=await generatePlan(db,actor,'a',newer.id,'request2');assert.equal(p2.version,2);
 assert.equal((await getStaffPlans(db,actor,'a')).versions.find(v=>v.id===p.id)!.source.id,source.id);
 let next=await editPlan(db,actor,p2.id,p2.editRevision,edited.instructor);next=await transitionPlan(db,actor,p2.id,next.editRevision,'review');next=await transitionPlan(db,actor,p2.id,next.editRevision,'approve');
 sqlite.exec("CREATE TRIGGER test_fail_publish BEFORE UPDATE OF status ON financial_plan_version WHEN NEW.status='PUBLISHED' AND NEW.version=2 BEGIN SELECT RAISE(ABORT,'Injected failure'); END;");
 await assert.rejects(publishPlan(db,actor,next.id,next.editRevision,1),/Injected failure/);
 assert.equal((await getStudentPlan(db,'a'))!.plan.id,p.id);assert.equal((await getStaffPlans(db,actor,'a')).versions.find(v=>v.id===p.id)!.status,'PUBLISHED');
 sqlite.exec('DROP TRIGGER test_fail_publish');await publishPlan(db,actor,next.id,next.editRevision,1);
 assert.equal((await getStudentPlan(db,'a'))!.plan.id,p2.id);
 const history=await getStaffPlans(db,actor,'a');assert.equal(history.versions.find(v=>v.id===p.id)!.status,'SUPERSEDED');assert.deepEqual(history.versions.find(v=>v.id===p.id)!.studentPreview,beforePublish);
 assert.equal(await getStudentPlan(db,'b'),null);
 }finally{sqlite.close();}
});
test('unauthorized and incomplete sources cannot generate or inspect plans',async()=>{
 const {db,sqlite}=await setup();try{
 const draft=await intake.createDraftForStudent(db,{studentUserId:'a',actor});
 await assert.rejects(generatePlan(db,actor,'a',draft.id,'invalid'),/completed/i);
 await assert.rejects(generatePlan(db,{userId:'b',role:'admin'},'a',draft.id,'x'),/Forbidden/);
 await assert.rejects(getStaffPlans(db,{userId:'a',role:'student'},'a'),/Forbidden/);
 }finally{sqlite.close();}
});

test('parallel generation allocates unique versions; forged roles and stale publication cannot act',async()=>{
 const {db,sqlite}=await setup();try{
 const source=await completed(db);
 const same=await Promise.all([generatePlan(db,actor,'a',source.id,'same'),generatePlan(db,actor,'a',source.id,'same')]);assert.equal(same[0].id,same[1].id);
 const distinct=await Promise.all([generatePlan(db,actor,'a',source.id,'second'),generatePlan(db,actor,'a',source.id,'third')]);assert.deepEqual(distinct.map(p=>p.version).sort(),[2,3]);
 await assert.rejects(editPlan(db,actor,same[0].id,same[0].editRevision,{...same[0].instructor,reason:'stale'}),/newer|changed/);
 await assert.rejects(publishPlan(db,{userId:'a',role:'admin'},same[0].id,1,0),/Forbidden/);
 const all=await getStaffPlans(db,actor,'a');assert.equal(all.versions.length,3);
 assert.equal((sqlite.prepare('SELECT COUNT(*) AS n FROM student_placement').get() as any)?.n??0,0);
 }finally{sqlite.close();}
});

test('source saves preserve unchanged provenance, stamp acknowledgments on server and reject CAS races',async()=>{
 const {db,sqlite}=await setup();try{
 let r=await intake.createDraftForStudent(db,{studentUserId:'a',actor});
 const params={intakeId:r.id,studentUserId:'a',actor,mode:'student_reported' as const,sections:{monthlyTakeHomeRange:{value:'$3,000–$4,999'}}};
 r=await intake.saveStudentAnswers(db,params);const provenance=r.provenance_json!.monthlyTakeHomeRange;
 r=await intake.saveStudentAnswers(db,params);assert.deepEqual(r.provenance_json!.monthlyTakeHomeRange,provenance);
 r=await intake.saveAcknowledgments(db,{intakeId:r.id,studentUserId:'a',actor,acknowledgments:Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k=>[k,true])),ackAudit:{records:[{ack_key:'ackRiskOfLoss',confirmed_by_user_id:'forged',confirmed_at:'1900',ack_text_version_id:'forged'} as any]}});
 assert.ok(r.ack_audit_json.records.every(a=>a.confirmed_by_user_id==='staff'&&a.ack_text_version_id!=='forged'&&a.confirmed_at!=='1900'));
 const normalPrepare=db.prepare.bind(db);let once=false;
 const racing={...db,prepare(sql:string){if(!once&&sql.startsWith('UPDATE "student_intake_v2"')){once=true;sqlite.prepare('UPDATE student_intake_v2 SET snapshot_version=snapshot_version+1 WHERE id=?').run(r.id);}return normalPrepare(sql);}} as D1Database;
 await assert.rejects(intake.saveStudentAnswers(racing,{...params,sections:{monthlyTakeHomeRange:{value:'$0'}}}),/changed|reload/);
 assert.equal((await intake.getIntakeById(db,r.id))!.student_sections_json.monthlyTakeHomeRange!.value,'$3,000–$4,999');
 }finally{sqlite.close();}
});

test('completion racing a newer save cannot advance the completed pointer',async()=>{
 const {db,sqlite}=await setup();try{
 const first=await completed(db),next=await intake.createDraftForStudent(db,{studentUserId:'a',actor});
 const full=await intake.getIntakeById(db,first.id);
 // Prepare a valid draft with current source data; model a save winning immediately before completion.
 sqlite.prepare('UPDATE student_intake_v2 SET student_sections_json=?,instructor_assessment_json=?,acknowledgments_json=?,ack_audit_json=? WHERE id=?').run(JSON.stringify(full!.student_sections_json),JSON.stringify(full!.instructor_assessment_json),JSON.stringify(full!.acknowledgments_json),JSON.stringify({...full!.ack_audit_json,records:full!.ack_audit_json.records.map(a=>({...a,intake_id:next.id}))}),next.id);
 const original=db.prepare.bind(db);let once=false;
 const racing={...db,prepare(sql:string){if(!once&&sql.startsWith('UPDATE "student_intake_v2"')){once=true;sqlite.prepare('UPDATE student_intake_v2 SET snapshot_version=snapshot_version+1 WHERE id=?').run(next.id);}return original(sql);}} as D1Database;
 await assert.rejects(intake.completeIntake(racing,{intakeId:next.id,studentUserId:'a',actor}),/changed|reload/);
 assert.equal((await intake.getLatestCompletedIntake(db,'a'))!.id,first.id);
 assert.equal((await intake.getIntakeById(db,next.id))!.status,'draft');
 assert.equal((sqlite.prepare("SELECT COUNT(*) AS n FROM student_intake_v2_event WHERE intake_id=? AND event_type='completed'").get(next.id) as any).n,0);
 }finally{sqlite.close();}
});

test('approval cannot bind a future revision to an older saved preview',async()=>{
 const {db,sqlite}=await setup();try{
 const source=await completed(db);let p=await generatePlan(db,actor,'a',source.id,'race-approval');
 p=await editPlan(db,actor,p.id,p.editRevision,{...p.instructor,reason:'Interpret consultation',explanation:'Persisted original guidance.',reviewResolution:'All recorded information reviewed with uncertainty retained.'});
 p=await transitionPlan(db,actor,p.id,p.editRevision,'review');
 const original=db.prepare.bind(db);let once=false;
 const racing={...db,prepare(sql:string){if(!once&&sql.startsWith('UPDATE financial_plan_version SET status=')&&sql.includes('approved_at')){
  once=true;
  sqlite.prepare("UPDATE financial_plan_version SET instructor_json=?,status='DRAFT',edit_revision=edit_revision+1 WHERE id=?").run(JSON.stringify({...p.instructor,explanation:'Concurrent different guidance.'}),p.id);
  sqlite.prepare("UPDATE financial_plan_version SET status='REVIEW',edit_revision=edit_revision+1 WHERE id=?").run(p.id);
 }return original(sql);}} as D1Database;
 await assert.rejects(transitionPlan(racing,actor,p.id,p.editRevision+2,'approve'),/changed|stale|revision/i);
 }finally{sqlite.close();}
});
