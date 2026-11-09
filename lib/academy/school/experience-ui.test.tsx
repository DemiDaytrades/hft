import test from 'node:test';import assert from 'node:assert/strict';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
import {CLASS_ONE,publicClass} from './registry';import {MONEY_EXPERIENCE,explore,practiceResult} from './presentation';
import {SectionExperience} from '@/components/academy/school/SectionExperience';import {ExperienceVisual} from '@/components/academy/school/ExperienceVisual';
import {SchoolRoadmap} from '@/components/academy/school/SchoolRoadmap';import {studentRoadmap} from './roadmap';import {CURRICULUM} from './registry';
const doc=publicClass(CLASS_ONE);
test('experience comes before deeper prose and no new practice can masquerade as durable credit',()=>{
 const html=renderToStaticMarkup(<SectionExperience scene={MONEY_EXPERIENCE.sections[0]} section={doc.sections[0]} state={{}} dispatch={()=>{}}><p>EXISTING_SAVED_CHECK</p></SectionExperience>);
 assert.ok(html.indexOf('You need dinner')<html.indexOf('Explore the full explanation'));
 assert.ok(html.includes(doc.sections[0].paragraphs[0]));assert.ok(html.includes('EXISTING_SAVED_CHECK'));
 assert.match(html,/not graded|ungraded/i);assert.match(html,/type="radio"/);
 assert.match(html,/Reveal the idea/);assert.ok(!html.includes('Submit homework'));
});
test('matching feedback has labeled select alternatives and distinguishes why each action fits',()=>{
 const scene=MONEY_EXPERIENCE.sections[5],task=scene.tasks[1];
 let state=explore({}, {type:'check',id:task.id,result:practiceResult(task,{bus:'exchange',bread:'measure',later:'later',repair:'exchange'})});
 const html=renderToStaticMarkup(<SectionExperience scene={scene} section={doc.sections[5]} state={state} dispatch={()=>{}}/>);
 assert.equal((html.match(/<select/g)||[]).length,4);assert.match(html,/aria-label="Comparing bread prices/);assert.match(html,/role="status"/);assert.match(html,/unit of account/);
});
test('purposeful visuals expose meaning without relying on motion or color',()=>{
 for(const scene of MONEY_EXPERIENCE.sections){const html=renderToStaticMarkup(<ExperienceVisual kind={scene.visual}/>);assert.match(html,/<figcaption/);assert.match(html,/aria-label/);assert.ok(!html.includes('<img'));}
});
test('rendered student roadmap has safe states and contains no internal authoring vocabulary',()=>{
 const html=renderToStaticMarkup(<SchoolRoadmap stages={studentRoadmap(CURRICULUM,[])}/>);
 assert.match(html,/Coming later/);assert.match(html,/Locked/);assert.ok(!/blueprint|authored|assessment ready/i.test(html));
});
import {StudyGuide} from '@/components/academy/school/StudyGuide';
test('prediction visuals reveal conclusions only after exploration',()=>{
 const initial=renderToStaticMarkup(<ExperienceVisual kind="acceptance" revealed={false}/>);
 assert.ok(!initial.includes('Others accept it'));assert.ok(initial.includes('$100'));
 const revealed=renderToStaticMarkup(<ExperienceVisual kind="acceptance" revealed/>);assert.ok(revealed.includes('Others accept it'));
 const barter=renderToStaticMarkup(<ExperienceVisual kind="barter" revealed={false}/>);assert.ok(!barter.includes('Wants do not match'));assert.ok(barter.includes('Wants bread'));
 const synthesis=renderToStaticMarkup(<ExperienceVisual kind="review" revealed={false}/>);assert.ok(!synthesis.includes('Unit of account'));assert.ok(synthesis.includes('Compare'));
});
test('future or unrelated guide versions keep their own content without the current scene overlay',()=>{
 const html=renderToStaticMarkup(<StudyGuide doc={{...doc,version:'future.2'}}/>);
 assert.ok(!html.includes('synthesis-scene'));assert.ok(!html.includes('Quick self-check'));assert.ok(!html.includes('Expand the review explanation'));assert.ok(html.includes(doc.studyGuide.summary[0]));
});
