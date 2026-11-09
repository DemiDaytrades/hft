import test from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import InteractiveLessonPlayer from '../../../components/academy/learning/InteractiveLessonPlayer';
import {MONEY_LESSON as doc} from '../curriculum/what-is-money';
import {previewState,simulateAction} from './simulation';
test('real-student presentation disables all write controls and has no outbound student navigation',()=>{
 let state=previewState(doc,'interactions');state=simulateAction(doc,state,{action:'start_assessment'});
 const html=renderToStaticMarkup(<InteractiveLessonPlayer initialState={previewState(doc)} readOnly/>)+renderToStaticMarkup(<InteractiveLessonPlayer initialState={state} readOnly/>);assert.match(html,/READ ONLY/);
 for(const text of ['Check response','Save draft','Submit for instructor review','Complete lesson &amp; earn mastery']){const buttons=[...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].filter(m=>m[2].includes(text));assert.ok(buttons.length>0,text);assert.ok(buttons.every(m=>m[1].includes('disabled')),text);}
 assert.ok(!html.includes('href="/academy/'));assert.ok(!html.includes('rubric'));assert.ok(!html.includes('correct'));
 const complete=previewState(doc,'completed');complete.nextLesson={id:'future-fixture',title:'Existing next lesson',available:true};assert.ok(!renderToStaticMarkup(<InteractiveLessonPlayer initialState={complete} readOnly/>).includes('href="/academy/'));
});
test('simulation clearly labeled while using the same student presentation',()=>{const html=renderToStaticMarkup(<InteractiveLessonPlayer initialState={previewState(doc)} simulation={doc}/>);assert.match(html,/STUDENT PREVIEW/);assert.match(html,/Final mastery check/);assert.match(html,/No progress, attempts, homework or mastery will be saved/);assert.ok(!html.includes('rubric'));});
