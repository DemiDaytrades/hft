import test from "node:test";
import assert from "node:assert/strict";
import { assessmentResult, matchesAnswer, studentQuestion } from "./policy";
import type { Question } from "./contracts";

const questions: Question[] = Array.from({ length: 10 }, (_, i) => ({ id: `q${i+1}`, kind: i < 4 ? "choice" : "written", prompt: "Question", concept: i < 3 ? "barter" : "fx", correct: i < 4 ? "a" : undefined, rubric: "PRIVATE", mastery: [5,7,9].includes(i) }));
const answers = Object.fromEntries(questions.map(q => [q.id, q.kind === "choice" ? "a" : "Thoughtful student response"]));
test("80 percent cannot compensate for failed required mastery", () => {
  const result = assessmentResult(questions, answers, { grades: { q5:true,q6:true,q7:true,q8:true,q9:false,q10:false }, mastery: {q6:true,q8:true,q10:false}, feedback:"Review connection" });
  assert.equal(result.score,80); assert.equal(result.passed,false); assert.equal(result.masteryPassed,false);
});
test("80 percent with mastery passes; below threshold does not", () => {
  const review = {grades:{q5:false,q6:true,q7:false,q8:true,q9:true,q10:true},mastery:{q6:true,q8:true,q10:true},feedback:""};
  assert.equal(assessmentResult(questions,answers,review).passed,true);
  review.grades.q9=false;
  assert.equal(assessmentResult(questions,answers,review).passed,false);
});
test("branch selection uses scored concepts and never labels pending writing mastered", () => {
  const pending=assessmentResult(questions,answers,null);
  assert.equal(pending.score,null);assert.equal(pending.passed,false);
  const wrong=Object.fromEntries(questions.map(q=>[q.id,q.kind==='choice'?'wrong':'Response']));
  assert.equal(assessmentResult(questions,wrong,{grades:{},mastery:{},feedback:''}).branch,'broad');
});
test("answer equality checks ordering and matching without accepting extra keys", () => {
  assert.equal(matchesAnswer(['a','b'],['b','a']),false);
  assert.equal(matchesAnswer({USD:'US',JPY:'JP'},{JPY:'JP',USD:'US'}),true);
  assert.equal(matchesAnswer({USD:'US'},{USD:'US',secret:'extra'}),false);
});
test("student question serialization never includes answer or instructor rubric", () => {
  const output=studentQuestion(questions[0]);assert.equal('correct' in output,false);assert.equal('rubric' in output,false);
});

test('adaptive homework distinguishes barter, currency and broad weaknesses',()=>{
 const base={grades:{q5:true,q6:true,q7:true,q8:true,q9:true,q10:true},mastery:{q6:true,q8:true,q10:true},feedback:''};
 assert.equal(assessmentResult(questions,answers,base).branch,'strong');
 assert.equal(assessmentResult(questions,{...answers,q1:'wrong'},base).branch,'barter');
 assert.equal(assessmentResult(questions,answers,{...base,mastery:{...base.mastery,q10:false}}).branch,'currency');
 assert.equal(assessmentResult(questions,Object.fromEntries(questions.map(q=>[q.id,'wrong'])),{grades:{},mastery:{},feedback:''}).branch,'broad');
});

test('a true false explanation cannot override an objectively false judgment',()=>{
 const q:Question={id:'q8',kind:'true_false_explain',concept:'fx',prompt:'FX only exists for speculation',correct:'false',mastery:true};
 const result=assessmentResult([q],{q8:{choice:'true',explanation:'A long but incorrect explanation.'}},{grades:{q8:true},mastery:{q8:true},feedback:''});
 assert.equal(result.score,0);assert.equal(result.mastery.q8,false);assert.equal(result.passed,false);
});
