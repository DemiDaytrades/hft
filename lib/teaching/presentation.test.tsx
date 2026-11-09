import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseTeachingSnapshot, teachingResponseError, weeklyLessonStatus, SessionCard, type TeachingSession } from '../../components/teaching/Scheduler';
const base: TeachingSession = { id: 'stable-session-1', instructor_id:'demi',student_id:'student',instructor_name:'Demi', title:'What Is Money?', lesson_id:'money',start_at:'2026-11-09T19:00:00Z',end_at:'2026-11-09T20:00:00Z',timezone:'America/Chicago',status:'REQUESTED',revision:1, expires_at:'2026-11-09T18:00:00Z',base_status:null,proposed_start_at:null,proposed_end_at:null,proposed_expires_at:null,proposal_by:null };
const card = (session: TeachingSession, admin = false) => renderToStaticMarkup(<SessionCard session={session} admin={admin} timezone="America/Chicago" busy={false} onAction={()=>{}} onPropose={()=>{}} />);
test('student request is explicitly pending and cannot confirm itself',()=>{ const html=card(base); assert.match(html,/Waiting for instructor confirmation/); assert.doesNotMatch(html,/>Confirm</); assert.match(html,/What Is Money/); });
test('student can accept an instructor alternative while original confirmed time stays visible',()=>{ const html=card({...base,status:'ALTERNATIVE_PROPOSED',base_status:'CONFIRMED',proposal_by:'demi',proposed_start_at:'2026-11-10T20:00:00Z',proposed_end_at:'2026-11-10T21:00:00Z'}); assert.match(html,/>Accept alternative</); assert.match(html,/Original confirmed time remains reserved/); assert.match(html,/Nov 9/); assert.match(html,/Nov 10/); });
test('student cannot accept its own proposal and instructor can confirm it',()=>{ const session={...base,status:'ALTERNATIVE_PROPOSED',proposal_by:'student'}; assert.doesNotMatch(card(session),/>Accept alternative</); assert.match(card(session,true),/>Confirm</); });
test('only confirmed session offers an authorized classroom route with stable identity',()=>{ const html=card({...base,status:'CONFIRMED'}); assert.match(html,/stable-session-1/); assert.match(html,/classroom\/stable-session-1/); assert.match(html,/Join class/); assert.doesNotMatch(card({...base,status:'REQUESTED'}),/classroom\/stable-session-1/); });
test('terminal sessions do not offer cancellation or rescheduling',()=>{ const html=card({...base,status:'CANCELED_BY_STUDENT'}); assert.doesNotMatch(html,/>Cancel lesson</); assert.doesNotMatch(html,/>Propose different time</); });

test('canceled confirmed lesson needs scheduling again while active confirmed replacement stays confirmed',()=>{
  for(const status of ['CANCELED_BY_STUDENT','CANCELED_BY_INSTRUCTOR']) assert.equal(weeklyLessonStatus([{...base,status,base_status:'CONFIRMED'}]),'Needs scheduling');
  assert.equal(weeklyLessonStatus([{...base,status:'ALTERNATIVE_PROPOSED',base_status:'CONFIRMED',proposal_by:'student'}]),'Confirmed');
  assert.equal(weeklyLessonStatus([{...base,status:'REQUESTED'}]),'Request pending');
});

test('teaching response parsing narrows unknown JSON and rejects invalid snapshots',()=>{
  const snapshot={admin:false,userId:'student',config:null,sessions:[],availability:[],overrides:[],suggestedLesson:null};
  assert.equal(parseTeachingSnapshot(snapshot),snapshot);
  assert.throws(()=>parseTeachingSnapshot({error:'Denied'}),/Invalid lesson response/);
  assert.throws(()=>parseTeachingSnapshot(null),/Invalid lesson response/);
});
test('teaching error response only uses a string error from an object envelope',()=>{
  assert.equal(teachingResponseError({error:'Schedule changed'},'Fallback'),'Schedule changed');
  for(const value of [null,'oops',{error:123},{},[]]) assert.equal(teachingResponseError(value,'Fallback'),'Fallback');
});
