import assert from 'node:assert/strict';
import test from 'node:test';
import {CLASS_S2_4} from './class-4';
import {CLASS_S2_5} from './class-5';
import {CLASS_S2_6} from './class-6';
import {EXPERIENCE_S2_4} from './experience-4';
import {EXPERIENCE_S2_5} from './experience-5';
import {EXPERIENCE_S2_6} from './experience-6';
test('mechanics classes preserve evidence, independent teaching and full facilitated time',()=>{
 for(const [i,c] of [CLASS_S2_4,CLASS_S2_5,CLASS_S2_6].entries()){
 assert.equal(c.id,`stage-2-class-${i+4}`); assert.equal(c.liveGuide.reduce((a,b)=>a+b.minutes,0),60);
 assert.equal(c.sections.length,6); assert.equal(c.objectives.length,2);
 for(const o of c.objectives){assert.ok(c.homework.some(h=>h.competency===o.competency&&h.rubric));assert.ok(c.assessment.some(h=>h.competency===o.competency));assert.ok(c.remediation.some(h=>h.competency===o.competency));}
 assert.ok(c.homework.every(h=>h.kind==='written'||h.kind==='reflection'));
 }
 for(const e of [EXPERIENCE_S2_4,EXPERIENCE_S2_5,EXPERIENCE_S2_6]){assert.equal(e.sections.length,6);assert.ok(!JSON.stringify(e).includes('rubric'));}
 assert.equal(EXPERIENCE_S2_6.format,'session');
 assert.ok(CLASS_S2_6.homework.some(h=>h.prompt.includes('integrated')));
});
test('pip ruler distinguishes JPY, fractional and supplied nonstandard increments',()=>{
 const practices=EXPERIENCE_S2_4.sections.flatMap(s=>s.practice);
 assert.ok(practices.some(p=>p.kind==='calculate'&&p.expected===15.5));
 assert.ok(practices.some(p=>p.kind==='calculate'&&p.expected===0.3));
 assert.match(CLASS_S2_4.homework[1].rubric!,/0.7 pip/);
 assert.ok(CLASS_S2_4.sections.every(s=>s.activities.every(a=>a.kind==='choice'&&a.critical)));
});
test('collateral comparison preserves exposure and refuses unspecified contract',()=>{
 assert.match(CLASS_S2_5.homework[1].rubric!,/600 and 300 USD/);
 assert.match(CLASS_S2_5.homework[1].rubric!,/600 USD adverse change in either/);
 assert.match(CLASS_S2_5.remediation[1].reinforcement.prompt,/30:1\s*versus\s*60:1/);
 assert.ok(EXPERIENCE_S2_5.sections.flatMap(s=>s.practice).some(p=>p.expected===240));
});
test('seasonal timeline and read-only record are dated and preserve earlier-stage review',()=>{
 assert.match(CLASS_S2_6.homework[0].rubric!,/release 13:15 UTC/);
 assert.match(CLASS_S2_6.homework[0].rubric!,/release 14:15 UTC/);
 assert.match(CLASS_S2_6.homework[1].rubric!,/existing remediation/);
 assert.match(CLASS_S2_6.homework[1].rubric!,/110.335 USD/);
 assert.equal(EXPERIENCE_S2_6.sections[4].practice[0].correct,'observe');
});
