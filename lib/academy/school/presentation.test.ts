import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {CLASS_ONE,publicClass} from './registry';
import {classPresentation,explore,practiceResult,checkFeedback} from './presentation';

test('compatible scenes cover the exact assigned section sequence without changing the academic source',()=>{
 const doc=publicClass(CLASS_ONE),p=classPresentation(doc)!;
 assert.deepEqual(p.sections.map(s=>s.id),['world','barter','bridge','exchange','account','store','acceptance','digital','flow','review']);
 assert.equal(classPresentation({...doc,version:'future.2'}),null);
 assert.equal(classPresentation({...doc,id:'another-class'}),null);
 assert.equal(classPresentation({...doc,sections:doc.sections.slice(1)}),null);
 assert.equal(createHash('sha256').update(readFileSync('lib/academy/school/class-one.ts')).digest('hex'),'83e036c91343db36e48ba6a575d97632d06d263181123ef06387c04ad8d9dba7');
 assert.equal(CLASS_ONE.homework.length,12);
 assert.equal(CLASS_ONE.assessment.length,11);
});
test('practice feedback explains barter mismatch and changed answers clear a prior result',()=>{
 const task=classPresentation(publicClass(CLASS_ONE))!.sections[1].tasks[0];
 let state=explore({}, {type:'answer',id:task.id,field:'choice',value:'yes'});
 const wrong=practiceResult(task,state[task.id].answers);
 assert.equal(wrong.kind,'try-again');assert.match(wrong.why,/bread/i);
 state=explore(state,{type:'check',id:task.id,result:wrong});
 state=explore(state,{type:'answer',id:task.id,field:'choice',value:'no'});
 assert.equal(state[task.id].result,undefined);
 assert.equal(practiceResult(task,state[task.id].answers).kind,'success');
 const prior=state;state=explore(state,{type:'reveal',id:'world'});
 assert.deepEqual(state[task.id],prior[task.id]);assert.equal(state.world.revealed,true);
 assert.equal(Object.hasOwn(state,'evidence'),false);
});
test('function challenge accepts repeated categories and explains each action, not an entire story',()=>{
 const task=classPresentation(publicClass(CLASS_ONE))!.sections[5].tasks[1];
 assert.equal(practiceResult(task,{}).kind,'incomplete');
 const right={bus:'exchange',bread:'measure',later:'later',repair:'exchange'};
 const result=practiceResult(task,right);assert.equal(result.kind,'success');assert.equal(result.items?.length,4);
 assert.ok(result.items?.every(i=>i.why.length>20));
 assert.equal(practiceResult(task,{...right,bread:'exchange'}).kind,'try-again');
 assert.equal(practiceResult(task,{...right,foreign:'exchange'}).kind,'incomplete');
});
test('reflection is thoughtful ungraded practice and durable-check feedback distinguishes concepts',()=>{
 const task=classPresentation(publicClass(CLASS_ONE))!.sections[9].tasks[1];
 assert.equal(practiceResult(task,{}).kind,'incomplete');
 assert.equal(practiceResult(task,{thought:'I can pay, compare and keep some for later.'}).kind,'reflection');
 assert.match(checkFeedback('store',false),/purchasing power/i);
 assert.match(checkFeedback('account',true),/common|measure|compar/i);
});
import {sectionAdvance} from './presentation';
test('completed-class sequential review navigates without another save; new completion still requires passed checks',()=>{
 assert.equal(sectionAdvance({busy:false,completed:true,done:true,checksPassed:true}),'navigate');
 assert.equal(sectionAdvance({busy:false,completed:true,done:false,checksPassed:false}),'navigate');
 assert.equal(sectionAdvance({busy:false,completed:false,done:false,checksPassed:false}),'blocked');
 assert.equal(sectionAdvance({busy:false,completed:false,done:false,checksPassed:true}),'save');
 assert.equal(sectionAdvance({busy:true,completed:true,done:true,checksPassed:true}),'blocked');
});
