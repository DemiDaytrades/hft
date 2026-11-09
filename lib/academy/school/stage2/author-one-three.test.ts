import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {gradeObjective} from '../policy';
test('S2.1–S2.3 each provide private evidence and distinct public teaching', async()=>{
 for(let n=1;n<=3;n++) {
  const file=path.join(__dirname,`class-${n}.ts`);
  assert.ok(fs.existsSync(file),`missing authored S2.${n}`);
  const c=(await import(`./class-${n}`))[`CLASS_S2_${n}`];
  const e=(await import(`./experience-${n}`))[`EXPERIENCE_S2_${n}`];
  assert.equal(c.id,`stage-2-class-${n}`);
  assert.equal(c.liveGuide.reduce((s:number,g:any)=>s+g.minutes,0),60);
  assert.ok(c.sections.length>=5);
  assert.ok(c.assessment.filter((i:any)=>i.kind==='choice'||i.kind==='matching').length>=2);
  for(const r of c.remediation) assert.equal(gradeObjective(r.reinforcement,r.reinforcement.correct),true);
  assert.ok(c.sections.every((s:any)=>s.activities.every((i:any)=>i.kind==='choice'||i.kind==='matching')));
  assert.ok(e.sections.some((s:any)=>s.practice.some((p:any)=>p.kind!=='reflect')));
  for(const o of c.objectives){
   assert.ok(c.assessment.some((i:any)=>i.objectiveId===o.id&&i.critical));
   assert.ok(c.homework.some((i:any)=>i.objectiveId===o.id&&i.rubric));
   assert.ok(c.remediation.some((i:any)=>i.competency===o.competency));
  }
  assert.equal(e.sections.length,c.sections.length);
  assert.equal(JSON.stringify(e).includes('rubric'),false);
  assert.equal(new Set(c.sections.map((s:any)=>s.paragraphs[0])).size,c.sections.length);
 }
});
