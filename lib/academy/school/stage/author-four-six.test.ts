import test from 'node:test';
import assert from 'node:assert/strict';
import {CLASS_FOUR} from './class-four';
import {CLASS_FIVE} from './class-five';
import {CLASS_SIX} from './class-six';
import {EXPERIENCE_FOUR} from './experience-four';
import {EXPERIENCE_FIVE} from './experience-five';
import {EXPERIENCE_SIX} from './experience-six';
for(const [definition,experience,count] of [[CLASS_FOUR,EXPERIENCE_FOUR,6],[CLASS_FIVE,EXPERIENCE_FIVE,6],[CLASS_SIX,EXPERIENCE_SIX,5]] as const){
 test(`${definition.title}: mapped teaching and independently reviewed evidence`,()=>{
 assert.equal(definition.sections.length,count); assert.equal(experience.sections.length,count);
 assert.equal(definition.liveGuide.reduce((n,x)=>n+x.minutes,0),60);
 assert.equal(definition.chart.required,false);
 for(const section of definition.sections){
 assert(definition.objectives.some(x=>x.id===section.objectiveId&&x.competency===section.competency));
 assert(experience.sections.some(x=>x.sectionId===section.id));
 assert(definition.assessment.some(x=>x.competency===section.competency&&x.kind==='choice'));
 const fresh=definition.remediation.find(x=>x.competency===section.competency); assert(fresh); assert.equal(fresh.sectionId,section.id);
 assert.notEqual(fresh.reinforcement.prompt,section.activities[0].prompt);
 assert(section.paragraphs.length>=2); assert(section.example); assert(section.misconception);
 }
 assert(definition.homework.some(x=>x.kind==='written'&&x.rubric)); assert(definition.homework.some(x=>x.kind==='choice'));
 assert(definition.homework.some(x=>x.kind==='reflection'));
 });
}
test('subject-specific skill evidence remains distinct',()=>{
 assert(EXPERIENCE_FOUR.sections.some(x=>x.practice.some(p=>p.kind==='calculate'&&p.expected===10)));
 assert(CLASS_FOUR.homework.some(x=>/working/i.test(x.prompt)));
 assert(CLASS_FIVE.homework.some(x=>/participant.*needs map/i.test(x.prompt)));
 assert(CLASS_SIX.homework.some(x=>/checklist/i.test(x.prompt)));
 assert(CLASS_SIX.sections.some(x=>/no.action/i.test(x.title)));
});
test('public practice uses authentic subject operations and varied answer positions',()=>{
 assert.equal(EXPERIENCE_FOUR.sections[1].practice[0].kind,'calculate');
 assert.equal(EXPERIENCE_FOUR.sections[3].practice[0].expected,-4.55);
 assert.equal(EXPERIENCE_FIVE.sections[0].practice[0].kind,'matching');
 assert.equal(EXPERIENCE_FIVE.sections[5].practice[0].kind,'matching');
 assert.equal(EXPERIENCE_SIX.sections[0].practice[0].kind,'reflect');
 assert.equal(EXPERIENCE_SIX.sections[4].practice[0].kind,'reflect');
 for(const e of [EXPERIENCE_FOUR,EXPERIENCE_FIVE,EXPERIENCE_SIX]){
 const choices=e.sections.flatMap(x=>x.practice).filter(x=>x.kind==='choice');
 assert(choices.some(x=>x.options?.[0].id===x.correct));
 assert(choices.some(x=>x.options?.[1].id===x.correct));
 assert.equal(new Set(e.sections.map(x=>x.explanation[0])).size,e.sections.length);
 }
});
test('permanent guides teach fresh retrieval with their own visual aid',()=>{
 for(const c of [CLASS_FOUR,CLASS_FIVE,CLASS_SIX]){
 assert(c.design.studyGuideVisual?.nodes.length);
 assert((c.design.studyGuideChecks?.length??0)>=3);
 for(const text of c.studyGuide.summary) assert(!c.objectives.some(o=>o.text===text));
 for(const example of c.studyGuide.examples) assert(!c.sections.some(s=>s.example===example));
 assert(c.liveGuide.every(b=>!b.talkingPoints.some(p=>p.includes('carry the stated need, base or constraint')||p.includes('Give pairs a changed assumption'))));
 }
});
test('arithmetic homework and fresh interest reinforcement map to the skill actually checked',()=>{
 for(const number of [2,4,5,6]){
 const section=CLASS_FOUR.sections[number-1];
 assert(CLASS_FOUR.homework.some(x=>x.kind==='written'&&x.sectionId===section.id&&x.competency===section.competency));
 }
 const interest=CLASS_FOUR.remediation.find(x=>x.sectionId===CLASS_FOUR.sections[4].id)!;
 assert(/\d/.test(interest.reinforcement.prompt));
 assert(interest.reinforcement.options?.some(x=>/×|\*/.test(x.label)));
});
