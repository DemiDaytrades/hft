import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
for(let n=1;n<=5;n++) test(`S3.${n} provides chart evidence, coherent candles and complete teaching`,async()=>{
 const file=`${__dirname}/class-${n}.ts`;
 assert.ok(fs.existsSync(file),'authored class is missing');
 const c=(await import(`./class-${n}`))[`CLASS_S3_${n}`];
 const e=(await import(`./experience-${n}`))[`EXPERIENCE_S3_${n}`];
 assert.equal(c.chart.required,true);assert.equal(c.liveGuide.reduce((a:any,b:any)=>a+b.minutes,0),60);
 assert.ok(c.sections.length>=4);assert.ok(c.homework.some((i:any)=>i.kind==='matching'));assert.ok(c.homework.some((i:any)=>i.kind==='written'&&i.category==='PRACTICAL'));
 for(const o of c.objectives){assert.ok(c.homework.some((i:any)=>i.competency===o.competency));assert.ok(c.remediation.some((r:any)=>r.competency===o.competency));}
 assert.equal(e.sections.length,c.sections.length);
 for(const s of e.sections){assert.ok(s.practice.length);assert.ok(s.visual.chart.bars.length>=4);for(const b of s.visual.chart.bars){assert.ok(b.high>=Math.max(b.open,b.close));assert.ok(b.low<=Math.min(b.open,b.close));}}
});
test('fresh practicals are machine gradable and pivot evidence keeps knowledge time',async()=>{
 const {gradeObjective}=await import('../policy');
 for(let n=1;n<=5;n++){
  const c=(await import(`./class-${n}`))[`CLASS_S3_${n}`];
  const m=c.homework[0];assert.equal(gradeObjective(m,m.correct),true);
  const wrong={...m.correct};wrong[Object.keys(wrong)[0]]=m.targets.find((v:any)=>v.id!==wrong[Object.keys(wrong)[0]]).id;
  assert.equal(gradeObjective(m,wrong),false);
  for(const r of c.remediation){assert.equal(gradeObjective(r.reinforcement,r.reinforcement.correct),true);assert.equal(r.reinforcement.critical,true);}
 }
 const c=(await import('./class-4')).CLASS_S3_4;
 assert.match(c.homework[1].rubric!,/confirmed13:02/);assert.match(c.homework[1].rubric!,/candidate/);
 const e=(await import('./experience-4')).EXPERIENCE_S3_4;
 assert.equal(e.sections[1].visual.chart!.revealed,2);
});
test('every saved section activity can progress and candidate nodes stop at reveal',async()=>{
 const {gradeObjective}=await import('../policy');
 for(let n=1;n<=5;n++){
  const c=(await import(`./class-${n}`))[`CLASS_S3_${n}`];
  assert.equal(new Set(c.sections.map((s:any)=>s.activities[0].prompt)).size,5);
  for(const s of c.sections)for(const a of s.activities){assert.equal(gradeObjective(a,a.correct),true);assert.ok(a.sectionId===s.id);}
 }
 const e=(await import('./experience-4')).EXPERIENCE_S3_4;
 assert.equal(e.sections[1].visual.nodes.length,2);
 assert.ok(e.sections[1].visual.nodes.every(v=>!v.label.includes('09:02')));
});
