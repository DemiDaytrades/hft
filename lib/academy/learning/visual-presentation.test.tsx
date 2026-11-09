import test from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import Player from '../../../components/academy/learning/InteractiveLessonPlayer';
import {ScenarioStage} from '../../../components/academy/learning/LessonVisuals';
import {QuestionInput} from '../../../components/academy/learning/QuestionInput';
import {MONEY_LESSON as doc} from '../curriculum/what-is-money';
import {previewState} from '../instructor/simulation';
test('journey exposes all ten original steps and preserves locked navigation and original teaching prompt',()=>{
 const s=previewState(doc),html=renderToStaticMarkup(<Player initialState={s}/>);assert.match(html,/Your learning journey/);assert.match(html,/aria-label="Lesson steps"/);for(const step of doc.steps)assert.ok(html.includes(step.title.replaceAll('&','&amp;')));assert.match(html,/What would you do next/);assert.ok(!html.includes('LESSON MASTERED'));assert.ok(!html.includes('questionBanks'));assert.ok(!html.includes('rubric'));
});
test('response tiles retain native radio semantics and exact option IDs without grading on selection',()=>{
 const q=previewState(doc).lesson.steps[0].activities![0],html=renderToStaticMarkup(<QuestionInput question={q} value={q.options![1].id} onChange={()=>{}}/>);assert.match(html,/lx-response/);assert.equal([...html.matchAll(/type="radio"/g)].length,q.options!.length);assert.match(html,/checked=""/);for(const o of q.options!)assert.ok(html.includes(`value="${o.id}"`));assert.ok(!html.includes('correct'));
});
test('reviewed numeric knowledge score alone never paints a concept as mastered or earns completion milestone',()=>{
 const s=previewState(doc,'homework');s.attempts[0].mastery={q6:false,q8:false,q10:false};const html=renderToStaticMarkup(<Player initialState={s}/>);assert.ok(!html.includes('LESSON MASTERED'));assert.ok(!html.includes('>Mastered<'));assert.match(html,/Instructor review/);assert.match(html,/Your assignment/);
});
test('completion milestone requires existing Completed state and retains unavailable next-lesson protection',()=>{
 const s=previewState(doc,'completed'),html=renderToStaticMarkup(<Player initialState={s}/>);assert.match(html,/LESSON MASTERED/);assert.match(html,/Your foundation is built/);assert.ok(!html.includes('href="/academy/lesson/'));assert.match(html,/Not yet available/);
});

test('currency concept visual does not disclose the matching exercise answers',()=>{const html=renderToStaticMarkup(<ScenarioStage id="money-currency"/>);for(const code of ['USD','JPY','GBP','EUR'])assert.ok(html.includes(code));for(const country of ['United States','Japan','United Kingdom','Euro-area'])assert.ok(!html.includes(country));});
