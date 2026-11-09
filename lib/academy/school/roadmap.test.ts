import test from 'node:test';import assert from 'node:assert/strict';
import {CURRICULUM} from './registry';import {studentRoadmap} from './roadmap';
test('student roadmap hides authoring metadata and does not make locked or future classes playable',()=>{
 const result=studentRoadmap(CURRICULUM,[]);
 assert.equal(result[0].classes[0].status,'Locked');assert.equal(result[0].classes[0].href,undefined);
 assert.equal(result[0].classes[1].status,'Locked');assert.equal(result[1].status,'Coming later');
 assert.ok(!/blueprint|authored|private|rubric|assessmentReady/i.test(JSON.stringify(result)));
});
test('only entitled assigned editions have links; actual activity distinguishes in-progress from available',()=>{
 const base={id:'stage-1-class-1',version:'money-foundations.1.0.0',completed:false};
 assert.equal(studentRoadmap(CURRICULUM,[base])[0].classes[0].status,'Available');
 assert.equal(studentRoadmap(CURRICULUM,[{...base,started:true}])[0].classes[0].status,'In progress');
 const completed=studentRoadmap(CURRICULUM,[{...base,completed:true}])[0].classes[0];
 assert.equal(completed.status,'Completed');assert.ok(!completed.href!.includes('version='));
 assert.equal(studentRoadmap(CURRICULUM,[{...base,id:'stage-2-class-1'}])[0].classes[1].href,undefined);
});
