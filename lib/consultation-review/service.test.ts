import test from 'node:test';
import assert from 'node:assert/strict';
import {fixtureDb} from '../financial-plan/testing/db';
import {baseStudent,pfAnswers} from '../financial-plan/testing/fixture';
import {getReviewWorkspace,beginReviewCapture,adoptLegacyAnswers,saveConsultationReview} from './service';
import {saveStudentAnswers,saveAcknowledgments,completeIntake,getIntakeById,toStudentSafeIntakeResponse} from '../student-intake-v2/service';
import {ACKNOWLEDGMENT_KEYS} from '../student-intake-v2/contracts';
import {generatePlan} from '../financial-plan/service';
const actor={userId:'staff',role:'admin'};
function fixture(){const f=fixtureDb();for(const [id,role] of [['staff','admin'],['qa','student'],['other','student']])f.sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run(id,id,id+'@example.invalid',role,'2026-11-07','2026-11-07');f.sqlite.prepare("INSERT INTO consultation_questionnaire(id,user_id,status,data,created_at,updated_at) VALUES('legacy','qa','submitted',?,'2026-11-06','2026-11-06')").run(JSON.stringify({preferredName:'Known QA',demoExperience:'No',liveExperience:'No',goal612Month:'Build confidence over the next year',monthlyTakeHomeIncome:'3000'}));return f}
test('legacy completed evidence projects without writes, is explicitly adopted once and stays source-linked',async()=>{
 const {db,sqlite}=fixture();let w=await getReviewWorkspace(db,actor,'qa');assert.equal(w.intake,null);assert.equal(w.projection.sections.preferredName?.value,'Known QA');assert.equal(w.projection.sections.monthlyTakeHomeRange,undefined);assert.ok(w.projection.unmapped.some(x=>x.key==='goal612Month'));assert.equal(sqlite.prepare('SELECT count(*) AS n FROM student_intake_v2').get()!.n,0);
 let r=await beginReviewCapture(db,actor,'qa');w=await getReviewWorkspace(db,actor,'qa');r=await adoptLegacyAnswers(db,actor,'qa',r.id,r.snapshot_version,w.legacyDigest);assert.equal(r.student_sections_json.preferredName?.value,'Known QA');assert.equal(r.provenance_json?.preferredName.source,'instructor_entered_for_student');assert.equal((r.provenance_json?.preferredName as any).evidenceKind,'STUDENT_REPORTED');assert.ok((r.provenance_json?.preferredName as any).sourceRefs.length);
 const original=sqlite.prepare("SELECT data FROM consultation_questionnaire WHERE id='legacy'").get()!.data;assert.ok(String(original).includes('Known QA'));
 const repeat=await getReviewWorkspace(db,actor,'qa');assert.equal(Object.keys(repeat.projection.adoptable).length,0);await assert.rejects(getReviewWorkspace(db,{userId:'other',role:'admin'},'qa'),/authorized|Forbidden/i);sqlite.close();
});
test('concise human review replaces repeated factual summary, preserves exact final source and financial gate',async()=>{
 const {db,sqlite}=fixture();let r=await beginReviewCapture(db,actor,'qa');r=await saveStudentAnswers(db,{intakeId:r.id,studentUserId:'qa',actor,mode:'instructor_entered_for_student',sections:{...baseStudent(),...pfAnswers()}});
 const acks=Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k=>[k,true]));r=await saveAcknowledgments(db,{intakeId:r.id,studentUserId:'qa',actor,acknowledgments:acks,ackAudit:{records:ACKNOWLEDGMENT_KEYS.map(ack_key=>({ack_key,confirmed:true,capture_mode:'instructor_entered_for_student'}))} as any});
 await assert.rejects(completeIntake(db,{intakeId:r.id,studentUserId:'qa',actor}),/validation/);
 r=await saveConsultationReview(db,actor,'qa',r.id,r.snapshot_version,{matchesSelfReport:'NOT_OBSERVED',contradictions:'',requireAssessment:true,requirePractical:true,requireChartDemonstration:false,reason:'',observations:{instructorPrivateNotes:'PRIVATE QA NOTE'}},true);
 assert.equal(r.instructor_assessment_json.instructorSummary,undefined);assert.equal(r.instructor_assessment_json.recommendedStartingLevel,undefined);
 const done=await completeIntake(db,{intakeId:r.id,studentUserId:'qa',actor,expectedSnapshotVersion:r.snapshot_version});assert.equal(done.intake.status,'completed');assert.ok(!JSON.stringify(toStudentSafeIntakeResponse(done.intake)).includes('PRIVATE QA NOTE'));
 const plan=await generatePlan(db,actor,'qa',r.id);assert.equal(plan.status,'DRAFT');const next=await beginReviewCapture(db,actor,'qa');assert.notEqual(next.id,r.id);assert.equal(next.student_sections_json.preferredName?.value,r.student_sections_json.preferredName?.value);assert.equal((await getIntakeById(db,r.id))?.status,'completed');assert.deepEqual(next.ack_audit_json.records,[]);sqlite.close();
});
test('corrections retain both values/actor/provenance and review becomes stale',async()=>{
 const {db,sqlite}=fixture();let r=await beginReviewCapture(db,actor,'qa');r=await saveStudentAnswers(db,{intakeId:r.id,studentUserId:'qa',actor,mode:'instructor_entered_for_student',sections:{preferredName:{value:'Earlier'}}});r=await saveConsultationReview(db,actor,'qa',r.id,r.snapshot_version,{matchesSelfReport:'NOT_OBSERVED',contradictions:'',requireAssessment:false,requirePractical:false,requireChartDemonstration:false,reason:'',observations:{}},true);
 r=await saveStudentAnswers(db,{intakeId:r.id,studentUserId:'qa',actor,mode:'instructor_entered_for_student',sections:{preferredName:{value:'Correction'}},evidenceKind:'INSTRUCTOR_OVERRIDE',correctionReason:'Confirmed correction in consultation'});
 const w=await getReviewWorkspace(db,actor,'qa');assert.equal(w.reviewCurrent,false);const events=sqlite.prepare("SELECT * FROM student_intake_v2_event WHERE intake_id=? AND event_type='saved'").all(r.id);assert.ok(events.some(e=>String(e.payload_summary_json).includes('Earlier')&&String(e.payload_summary_json).includes('Correction')&&e.actor_user_id==='staff'));
 assert.equal((r.provenance_json?.preferredName as any).evidenceKind,'INSTRUCTOR_OVERRIDE');sqlite.close();
});
test('history failure rolls canonical correction back; preview never persists plans or assignments',async()=>{
 const {db,sqlite}=fixture();let r=await beginReviewCapture(db,actor,'qa');r=await saveStudentAnswers(db,{intakeId:r.id,studentUserId:'qa',actor,mode:'student_reported',sections:{preferredName:{value:'Original'}}});
 sqlite.exec("CREATE TRIGGER history_failure BEFORE INSERT ON student_intake_v2_event WHEN NEW.event_type='saved' BEGIN SELECT RAISE(ABORT,'test history failure'); END");
 await assert.rejects(saveStudentAnswers(db,{intakeId:r.id,studentUserId:'qa',actor,mode:'instructor_entered_for_student',sections:{preferredName:{value:'Lost history'}}}),/history failure/);
 const current=await getIntakeById(db,r.id);assert.equal(current?.student_sections_json.preferredName?.value,'Original');assert.equal(current?.snapshot_version,r.snapshot_version);sqlite.exec('DROP TRIGGER history_failure');
 await getReviewWorkspace(db,actor,'qa');for(const table of ['financial_plan_version','learning_path_version','student_course_assignment'])assert.equal(sqlite.prepare(`SELECT count(*) AS n FROM ${table}`).get()!.n,0);sqlite.close();
});
