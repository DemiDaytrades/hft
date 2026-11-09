import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import {fixtureDb} from './financial-plan/testing/db';
import {QUESTIONS,scoreAssessment} from './placement-assessment';
const {db,sqlite}=fixtureDb();const load=(Module as any)._load;
(Module as any)._load=function(name:string,...args:any[]){if(name==='@opennextjs/cloudflare')return {getCloudflareContext:()=>({env:{DB:db}})};return load.call(this,name,...args);};
const storage=require('./placement-assessment-storage');
for(const id of ['a','b'])sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run(id,id,`${id}@example.invalid`,'student','2026-11-07','2026-11-07');
const answers=Object.fromEntries(QUESTIONS.map(q=>[q.id,q.correct]));
test('35-question bank keeps existing scoring/safeguards and student projection hides keys',()=>{
 assert.equal(QUESTIONS.length,35);assert.equal(scoreAssessment(answers).overallScore,100);assert.equal(scoreAssessment(answers).recommendedLevel,'Advanced Assessment');
 const publicQuestions=storage.publicQuestions();assert.equal(publicQuestions.length,35);assert.ok(!JSON.stringify(publicQuestions).includes('"correct"'));assert.ok(!JSON.stringify(publicQuestions).includes('"explanation"'));
});
test('placement attempts await persistence, validate answers, enforce ownership and preserve completed history',async()=>{
 const id=await storage.createAttempt('a','v1');assert.equal((await storage.getActiveAttempt('a')).id,id);
 await assert.rejects(storage.saveDraft('b',id,answers),/unavailable|not allowed/i);
 await assert.rejects(storage.completeAttempt('a',id,{...answers,foreign:['x']},'v1'),/foreign|invalid/i);
 await assert.rejects(storage.completeAttempt('a',id,{},'v1'),/answer|complete/i);
 const result=await storage.completeAttempt('a',id,answers,'v1');assert.equal(result.overallScore,100);
 await assert.rejects(storage.saveDraft('a',id,answers),/closed|unavailable/i);await assert.rejects(storage.completeAttempt('a',id,answers,'v1'),/closed|unavailable/i);
 const row=await storage.getLatestCompleted('a');assert.ok(row.question_snapshot_json);assert.equal(storage.toStudentAttempt(row).question_snapshot_json,undefined);
 assert.throws(()=>sqlite.prepare("UPDATE placement_assessment_attempt SET answers='{}' WHERE id=?").run(id),/immutable/);
 sqlite.close();
});
