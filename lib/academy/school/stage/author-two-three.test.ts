import test from 'node:test';
import assert from 'node:assert/strict';
import {CLASS_TWO} from './class-two';
import {CLASS_THREE} from './class-three';
import {EXPERIENCE_TWO} from './experience-two';
import {EXPERIENCE_THREE} from './experience-three';
for (const [definition, experience, count] of [[CLASS_TWO,EXPERIENCE_TWO,6],[CLASS_THREE,EXPERIENCE_THREE,7]] as const) {
 test(`${definition.title}: complete mapped instruction and individually reviewed evidence`,()=>{
  assert.equal(definition.sections.length,count);
  assert.equal(definition.liveGuide.reduce((n,b)=>n+b.minutes,0),60);
  assert.equal(definition.chart.required,false);
  assert.equal(definition.sections.length,experience.sections.length);
  for(const section of definition.sections){
   assert.ok(definition.objectives.some(o=>o.id===section.objectiveId&&o.competency===section.competency));
   assert.ok(section.paragraphs.length>=2&&section.example&&section.misconception);
   assert.ok(section.activities.every(a=>a.kind==='choice'||a.kind==='matching'));
   assert.ok(definition.assessment.some(a=>a.competency===section.competency));
   const reinforcement=definition.remediation.find(r=>r.competency===section.competency);
   assert.ok(reinforcement&&reinforcement.reinforcement.correct);
   assert.ok(!definition.assessment.some(a=>a.prompt===reinforcement?.reinforcement.prompt));
  }
  for(const item of [...definition.assessment,...definition.homework]){
   assert.ok(item.id.startsWith(definition.id));
   assert.ok(definition.sections.some(s=>s.id===item.sectionId&&s.objectiveId===item.objectiveId&&s.competency===item.competency));
   if(item.kind==='written'||item.kind==='reflection'){assert.ok(item.rubric);assert.equal(item.correct,undefined);}
   else assert.ok(item.correct);
  }
  assert.ok(definition.homework.some(i=>i.kind==='matching'||i.kind==='choice'));
  assert.ok(definition.homework.some(i=>i.kind==='written'));
  assert.ok(definition.homework.some(i=>i.id===definition.design.reflectionItemId));
  assert.ok(definition.references.every(r=>r.url.startsWith('https://')));
 });
}
test('history is contextual and banking distinguishes settlement from unconstrained credit',()=>{
 const history=JSON.stringify(CLASS_TWO); const banking=JSON.stringify(CLASS_THREE);
 assert.match(history,/not a universal/i); assert.match(history,/coexist/i); assert.match(history,/1661/);
 assert.match(banking,/settlement/i); assert.match(banking,/capital/i); assert.match(banking,/liquidity/i); assert.match(banking,/jurisdiction/i);
 assert.equal(EXPERIENCE_TWO.format,'timeline'); assert.equal(EXPERIENCE_THREE.format,'system');
});
test('timeline orders contextual examples and system maps role relationships',()=>{
 assert.ok(EXPERIENCE_TWO.sections.some(s=>s.practice.some(p=>p.kind==='sequence')));
 assert.ok(EXPERIENCE_THREE.sections.some(s=>s.practice.some(p=>p.kind==='matching')));
 for(const experience of [EXPERIENCE_TWO,EXPERIENCE_THREE]){
  assert.ok(experience.sections.every(s=>s.visual.nodes.length>=3));
  const practices=experience.sections.flatMap(s=>s.practice);
  assert.ok(practices.every(p=>p.explanation&&p.retry));
 }
});
test('public chapters use distinct inquiry and keep reference publication dates out of monetary milestones',()=>{
 for(const experience of [EXPERIENCE_TWO,EXPERIENCE_THREE]){
  assert.equal(new Set(experience.sections.map(s=>s.hook)).size,experience.sections.length);
  assert.equal(new Set(experience.sections.map(s=>s.practice[0].prompt)).size,experience.sections.length);
 }
 assert.doesNotMatch(JSON.stringify(EXPERIENCE_TWO),/explainer (?:published|updated)|2015|2024/);
 assert.doesNotMatch(JSON.stringify(CLASS_TWO.homework),/explainer (?:published|updated)|2015|2024/);
});
test('historical milestones are monetary developments; reviewed comparisons and independent review aids fit their subjects',()=>{
 const history=JSON.stringify(CLASS_TWO.sections);
 assert.match(history,/1668/);assert.match(history,/1904/);
 assert.doesNotMatch(CLASS_TWO.homework.find(i=>i.id.endsWith('homework-comparison'))!.rubric!,/loan|borrower|liquidity/);
 for(const definition of [CLASS_TWO,CLASS_THREE]){
  assert.ok(definition.design.studyGuideVisual?.nodes.length);
  assert.ok(definition.design.studyGuideChecks?.length);
  assert.ok(definition.remediation.every(r=>r.reinforcement.options?.every(o=>!definition.sections.flatMap(s=>s.activities).flatMap(a=>a.options??[]).some(old=>old.label===o.label))));
 }
});
test('guides plan distinct changed-condition activities and reinforcement avoids a binary answer rhythm',()=>{
 for(const definition of [CLASS_TWO,CLASS_THREE]){
  assert.equal(new Set(definition.liveGuide.map(g=>g.activity.prompt)).size,definition.sections.length);
  assert.equal(new Set(definition.liveGuide.map(g=>g.talkingPoints[2])).size,definition.sections.length);
  assert.ok(definition.remediation.every(r=>r.reinforcement.options?.length===3));
  assert.equal(new Set(definition.studyGuide.summary).size,definition.studyGuide.summary.length);
  assert.ok(definition.studyGuide.summary.every(s=>!definition.objectives.some(o=>s===o.text+'.')));
 }
 const sequence=EXPERIENCE_TWO.sections.flatMap(s=>s.practice).find(p=>p.kind==='sequence')!;
 assert.match(JSON.stringify(sequence.rows),/1661/);assert.match(JSON.stringify(sequence.rows),/1701/);assert.match(JSON.stringify(sequence.rows),/1904/);
 assert.match(JSON.stringify(CLASS_TWO.homework[0]),/1999/);assert.match(JSON.stringify(CLASS_TWO.homework[0]),/2002/);
});
