import test from "node:test";
import assert from "node:assert/strict";
import Module from "node:module";
import { DatabaseSync } from "node:sqlite";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { MONEY_LESSON as doc } from "../curriculum/what-is-money";
import { installMoneyLesson } from "./seed";

const sqlite = new DatabaseSync(":memory:");
for (const file of readdirSync("migrations").filter(f=>f.endsWith('.sql')).sort()) sqlite.exec(readFileSync(path.join('migrations',file),'utf8'));
const db = { prepare(sql: string) { let args: any[]=[]; return { bind(...a: any[]) { args=a;return this; }, async first() {return sqlite.prepare(sql).get(...args)??null;}, async all() {return {results:sqlite.prepare(sql).all(...args)};}, async run() {const r=sqlite.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}};} }; }, async batch(statements: any[]) {sqlite.exec('BEGIN');try {const r=[];for(const s of statements)r.push(await s.run());sqlite.exec('COMMIT');return r;}catch(e){sqlite.exec('ROLLBACK');throw e;}} };
const load=(Module as any)._load;
(Module as any)._load=function(id:string,...args:any[]){if(id==='@opennextjs/cloudflare')return {getCloudflareContext:()=>({env:{DB:db}})};return load.call(this,id,...args);};
const service=require('./service');
const academy=require('../index');
const id=doc.id;
async function setup(){
 await installMoneyLesson(db);
 for(const [uid,role] of [['student','student'],['admin','admin'],['foreign','student']])sqlite.prepare('INSERT OR IGNORE INTO user (id,name,email,role,createdAt,updatedAt) VALUES (?,?,?,?,?,?)').run(uid,uid,uid+'@example.invalid',role,'2026-11-07','2026-11-07');
 sqlite.prepare('INSERT OR IGNORE INTO student_course_assignment (id,user_id,course_id,assigned_at) VALUES (?,?,?,?)').run('assign','student',doc.courseId,'2026-11-07');
}
async function finishSteps(){
 for(const step of doc.steps){
  for(const a of step.activities??[]) await service.learningAction('student',id,{action:'activity',activityId:a.id,answer:a.correct});
  await service.learningAction('student',id,{action:'step',stepId:step.id,revealIds:(step.reveals??[]).map(r=>r.id)});
 }
}
function answersFor(qs:any[]){return Object.fromEntries(qs.map(q=>[q.id,q.kind==='written'?'A considered explanation of the economic concepts.':q.kind==='true_false_explain'?{choice:'false',explanation:'International commerce and travel need currency conversion.'}:q.correct]));}
function reviewFor(qs:any[]){return {grades:Object.fromEntries(qs.filter(q=>q.kind==='written'||q.kind==='true_false_explain').map(q=>[q.id,true])),mastery:{q6:true,q8:true,q10:true},feedback:'Concepts demonstrated.'};}
test('interactive lifecycle preserves quick checks, written review, homework revisions and gated completion',async()=>{
 await setup();
 await assert.rejects(service.getLearningState('foreign',id),/unavailable/);
 await assert.rejects(academy.markLessonComplete('student',id),/requirements|mastery|complete/i);
 await assert.rejects(service.learningAction('student',id,{action:'start_assessment'}),/complete|interactions/i);
 await assert.rejects(service.learningAction('student',id,{action:'step',stepId:doc.steps[1].id}),/order|previous/i);
 await finishSteps();
 let state=await service.getLearningState('student',id);
 assert.equal(state.completedSteps.length,10);assert.ok(state.activityResults['quick-1']);
 assert.ok(!JSON.stringify(state).includes('rubric'));assert.ok(!JSON.stringify(state).includes('correct'));
 state=await service.learningAction('student',id,{action:'start_assessment'});
 const attempt=state.attempts.at(-1);
 const answers=answersFor(doc.questionBanks[0]);
 state=await service.learningAction('student',id,{action:'submit_assessment',attemptId:attempt.id,answers});
 assert.equal(state.status,'Awaiting instructor review');assert.equal(state.canComplete,false);
 await assert.rejects(service.instructorAction('student','student',id,{action:'review_assessment',attemptId:attempt.id,review:reviewFor(doc.questionBanks[0])}),/Forbidden|admin/i);
 state=await service.instructorAction('admin','student',id,{action:'review_assessment',attemptId:attempt.id,review:reviewFor(doc.questionBanks[0])});
 assert.equal(state.attempts.at(-1).score,100);assert.equal(state.homeworkTask.title,'Real World Currency Exchange');assert.equal(state.canComplete,false);
 state=await service.learningAction('student',id,{action:'homework',text:'Commerce: a US importer exchanges USD for JPY to pay a supplier. Travel: a UK tourist exchanges GBP for EUR to spend locally. Investment: a Japanese investor exchanges JPY for USD to acquire a US asset.'});
 assert.equal(state.status,'Awaiting instructor review');
 const first=state.homework[0];
 await assert.rejects(service.instructorAction('student','student',id,{action:'review_homework',submissionId:first.id,decision:'approve',feedback:'self'}),/Forbidden|admin/i);
 await service.instructorAction('admin','student',id,{action:'review_homework',submissionId:first.id,decision:'request_revision',feedback:'Clarify purpose.'});
 state=await service.learningAction('student',id,{action:'homework',text:'Revised original examples: commerce USD to JPY for a supplier; travel GBP to EUR for local spending; investment JPY to USD to buy an overseas asset. Each describes who exchanges, held/required currency and why.'});
 assert.equal(state.homework.length,2);assert.equal(state.homework[0].text,first.text);assert.equal(state.homework[0].status,'revision_required');
 await service.instructorAction('admin','student',id,{action:'review_homework',submissionId:state.homework[1].id,decision:'approve',feedback:'Clear examples.'});
 state=await service.learningAction('student',id,{action:'complete'});
 assert.equal(state.status,'Completed');assert.equal((await academy.getUserLessonProgress('student',id)).status,'completed');
 assert.equal((await service.getLearningState('student',id)).status,'Completed');assert.equal(state.nextLesson,null);
});

test('80 percent with failed mastery requires remediation and a different immutable attempt',async()=>{
 // A separate student starts the same published curriculum.
 sqlite.prepare('INSERT INTO student_course_assignment (id,user_id,course_id,assigned_at) VALUES (?,?,?,?)').run('foreign-assign','foreign',doc.courseId,'2026-11-07');
 for(const step of doc.steps){for(const a of step.activities??[])await service.learningAction('foreign',id,{action:'activity',activityId:a.id,answer:a.correct});await service.learningAction('foreign',id,{action:'step',stepId:step.id,revealIds:(step.reveals??[]).map(r=>r.id)});}
 let state=await service.learningAction('foreign',id,{action:'start_assessment'});const first=state.attempts[0];
 await service.learningAction('foreign',id,{action:'submit_assessment',attemptId:first.id,answers:answersFor(doc.questionBanks[0])});
 const review=reviewFor(doc.questionBanks[0]);review.grades.q3=false;review.grades.q7=false;review.mastery.q10=false;
 state=await service.instructorAction('admin','foreign',id,{action:'review_assessment',attemptId:first.id,review});
 assert.equal(state.attempts[0].score,80);assert.equal(state.status,'Remediation required');assert.equal(state.canComplete,false);
 await assert.rejects(service.learningAction('foreign',id,{action:'start_assessment'}),/remediation|review/i);
 await service.learningAction('foreign',id,{action:'remediate'});
 state=await service.learningAction('foreign',id,{action:'start_assessment'});
 assert.equal(state.attempts.length,2);assert.equal(state.attempts[0].score,80);assert.equal(state.attempts[1].number,2);
 assert.notEqual(state.attempts[1].questions[0].prompt,first.questions[0].prompt);
 await assert.rejects(service.learningAction('foreign',id,{action:'submit_assessment',attemptId:first.id,answers:answersFor(doc.questionBanks[0])}),/submitted|closed|active/i);
 // A real next lesson fixture must remain locked: never seeded as curriculum.
 sqlite.prepare('INSERT INTO academy_lesson (id,module_id,title,sort_order,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?)').run('test-next',doc.moduleId,'TEST ONLY NEXT',1,'published','2026-11-07','2026-11-07');
 assert.equal(await academy.ensureLessonAvailable('foreign','test-next',doc.courseId),false);
 sqlite.prepare("UPDATE student_lesson_progress SET status='completed' WHERE user_id='foreign' AND lesson_id=?").run(id);
 assert.equal(await academy.ensureLessonAvailable('foreign','test-next',doc.courseId),false);
 assert.equal(await academy.ensureLessonAvailable('student','test-next',doc.courseId),true);
});

test('completed reveal steps remain acknowledged after refresh',async()=>{
 const before=await service.getLearningState('student',id);
 const events=sqlite.prepare('SELECT COUNT(*) AS n FROM academy_learning_event').get() as any;
 const state=await service.learningAction('student',id,{action:'step',stepId:'functions',revealIds:[]});
 assert.deepEqual(state.completedSteps,before.completedSteps);
 assert.equal((sqlite.prepare('SELECT COUNT(*) AS n FROM academy_learning_event').get() as any).n,events.n);
});

test('foreign attempts, invalid answers, private keys and legacy assessment bypasses are rejected',async()=>{
 const state=await service.getLearningState('foreign',id), attempt=state.attempts.at(-1);
 await assert.rejects(service.learningAction('student',id,{action:'save_assessment',attemptId:attempt.id,answers:{}}),/unavailable/i);
 await assert.rejects(service.learningAction('foreign',id,{action:'submit_assessment',attemptId:attempt.id,answers:{alien:'answer'}}),/foreign question/i);
 await assert.rejects(service.learningAction('foreign',id,{action:'submit_assessment',attemptId:attempt.id,answers:{q1:'invalid'}}),/valid answer/i);
 await assert.rejects(academy.assertLegacyAssessmentResource('quiz',doc.quizId),/interactive/i);
 await assert.rejects(academy.assertLegacyAssessmentResource('assignment',doc.assignmentId),/interactive/i);
 assert.equal(JSON.stringify(state).includes('rubric'),false);
 assert.equal(JSON.stringify(state).includes('"correct"'),false);
});

test('publication, assignment and current curriculum version are enforced',async()=>{
 sqlite.prepare("UPDATE academy_lesson SET status='draft' WHERE id=?").run(id);
 await assert.rejects(service.getLearningState('student',id),/unavailable/i);
 sqlite.prepare("UPDATE academy_lesson SET status='published' WHERE id=?").run(id);
 sqlite.prepare("UPDATE student_course_assignment SET status='revoked' WHERE user_id='student'").run();
 await assert.rejects(service.getLearningState('student',id),/unavailable/i);
 sqlite.prepare("UPDATE student_course_assignment SET status='assigned' WHERE user_id='student'").run();
 sqlite.prepare('UPDATE academy_lesson SET content=? WHERE id=?').run(JSON.stringify({...doc,version:'money.test-new'}),id);
 assert.equal(await academy.ensureLessonAvailable('student','test-next',doc.courseId),false);
 assert.equal((await service.getLearningState('student',id)).canComplete,false);
 sqlite.prepare('UPDATE academy_lesson SET content=? WHERE id=?').run(JSON.stringify(doc),id);
});

test('a draft from an older curriculum version cannot block a current-version attempt',async()=>{
 const newer={...doc,version:'money.test-new'};
 sqlite.prepare('UPDATE academy_lesson SET content=? WHERE id=?').run(JSON.stringify(newer),id);
 try {
  for(const step of doc.steps){for(const a of step.activities??[])await service.learningAction('foreign',id,{action:'activity',activityId:a.id,answer:a.correct});await service.learningAction('foreign',id,{action:'step',stepId:step.id,revealIds:(step.reveals??[]).map(r=>r.id)});}
  const state=await service.learningAction('foreign',id,{action:'start_assessment'});
  assert.equal(state.attempts.length,1);
  assert.equal(state.attempts[0].number,3);
  assert.equal((sqlite.prepare("SELECT COUNT(*) AS n FROM student_quiz_attempt WHERE user_id='foreign'").get() as any).n,3);
 } finally {sqlite.prepare('UPDATE academy_lesson SET content=? WHERE id=?').run(JSON.stringify(doc),id);}
});

test('legacy attempt history cannot return interactive answer keys or private rubrics',async()=>{
 await assert.rejects(academy.getUserQuizAttempts('foreign',doc.quizId),/interactive/i);
});
