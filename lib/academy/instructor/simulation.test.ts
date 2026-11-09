import test from 'node:test';
import assert from 'node:assert/strict';
import {MONEY_LESSON as doc} from '../curriculum/what-is-money';
import {previewState,simulateAction} from './simulation';
globalThis.fetch=async()=>{throw Error('Preview must not access network');};
test('browser-only preview preserves interactions and pending review without network or records',()=>{
 let state=previewState(doc);assert.ok(!JSON.stringify(state).includes('rubric'));assert.ok(!JSON.stringify(state).includes('correct'));
 assert.throws(()=>simulateAction(doc,state,{action:'start_assessment'}),/interactions/i);
 for(const step of doc.steps){for(const a of step.activities??[])state=simulateAction(doc,state,{action:'activity',activityId:a.id,answer:a.correct});state=simulateAction(doc,state,{action:'step',stepId:step.id,revealIds:(step.reveals??[]).map(r=>r.id)});}
 assert.equal(state.completedSteps.length,doc.steps.length);state=simulateAction(doc,state,{action:'start_assessment'});assert.ok(state.attempts[0].id.startsWith('preview-'));
 const answers=Object.fromEntries(doc.questionBanks[0].map(q=>[q.id,q.kind==='written'?'A simulated written response for visual QA.':q.kind==='true_false_explain'?{choice:'false',explanation:'Simulated reasoning about currency exchange.'}:q.correct]));
 state=simulateAction(doc,state,{action:'submit_assessment',attemptId:state.attempts[0].id,answers});assert.equal(state.status,'Awaiting instructor review');assert.equal(state.attempts[0].score,null);assert.equal(state.canComplete,false);assert.throws(()=>simulateAction(doc,state,{action:'complete'}),/requirements/i);
});
test('explicit simulation scenarios expose real presentation branches, never actual mastery',()=>{for(const branch of ['strong','barter','currency','broad'] as const){const s=previewState(doc,'homework',branch);assert.equal(s.homeworkTask?.title??null,branch==='broad'?null:doc.homework[branch].title);assert.ok(!JSON.stringify(s).includes('rubric'));assert.ok(s.attempts.every(a=>a.id.startsWith('preview-')));}assert.equal(previewState(doc,'completed').status,'Completed');assert.equal(previewState(doc,'remediation').status,'Remediation required');});
