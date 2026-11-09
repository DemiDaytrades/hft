import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeYoutubeUrl,youtubePosition,validateActivity,scoreActivity,validateAnswer} from './policy';
const quiz=()=>({kind:'MULTI',prompt:'Select both',options:[{id:'a',text:'A'},{id:'b',text:'B'},{id:'c',text:'C'}],correctIds:['a','b'],allowRevisions:false,showCorrectness:false,domain:'FOREX_FOUNDATIONS',conceptId:'barter',stage:'STAGE_1',sourceVersion:'1'});
test('YouTube accepts only known HTTPS providers and literal video IDs',()=>{
 for(const url of ['dQw4w9WgXcQ','https://youtu.be/dQw4w9WgXcQ?t=4','https://www.youtube.com/watch?v=dQw4w9WgXcQ','https://www.youtube.com/embed/dQw4w9WgXcQ']) assert.equal(normalizeYoutubeUrl(url),'dQw4w9WgXcQ');
 for(const url of ['https://youtube.com.evil.invalid/watch?v=dQw4w9WgXcQ','http://youtube.com/watch?v=dQw4w9WgXcQ','<iframe>','https://evil.invalid/dQw4w9WgXcQ','https://user@youtube.com/watch?v=dQw4w9WgXcQ'])assert.throws(()=>normalizeYoutubeUrl(url));
});
test('playback uses server anchor and never extrapolates paused or negative time',()=>{
 const state={position:12,playing:true,updatedAt:1000};assert.equal(youtubePosition(state,6000),17);assert.equal(youtubePosition({...state,playing:false},6000),12);assert.equal(youtubePosition(state,0),12);
});
test('multi quiz uses exact sets and rejects duplicate or unknown answers',()=>{
 const def=validateActivity(quiz());assert.equal(scoreActivity(def,['b','a']),true);assert.equal(scoreActivity(def,['a']),false);assert.equal(scoreActivity(def,['a','b','c']),false);
 assert.throws(()=>validateAnswer(def,['a','a']));assert.throws(()=>validateAnswer(def,['foreign']));
});
test('single and true-false keys are constrained; polls and writing are unscored',()=>{
 const base=quiz();assert.throws(()=>validateActivity({...base,kind:'SINGLE'}));assert.throws(()=>validateActivity({...base,correctIds:['foreign']}));assert.throws(()=>validateActivity({...base,options:[base.options[0],base.options[0]]}));
 const single=validateActivity({...base,kind:'SINGLE',correctIds:['a']});assert.equal(scoreActivity(single,['a']),true);assert.throws(()=>validateAnswer(single,['a','b']));
 const tf=validateActivity({...base,kind:'TRUE_FALSE',options:[{id:'true',text:'True'},{id:'false',text:'False'}],correctIds:['false']});assert.equal(scoreActivity(tf,['false']),true);
 const poll=validateActivity({...base,kind:'POLL',correctIds:[]});assert.equal(scoreActivity(poll,['a']),null);assert.throws(()=>validateActivity({...base,kind:'POLL'}));
 const written=validateActivity({kind:'WRITTEN',prompt:'Explain',options:[],correctIds:[]});assert.equal(scoreActivity(written,'My answer'),null);assert.throws(()=>validateAnswer(written,' '.repeat(20)));assert.throws(()=>validateAnswer(written,'x'.repeat(5001)));
});
test('validation rejects malformed metadata and bounds launch timer and content',()=>{
 for(const timerSeconds of [0,3601,1.5])assert.throws(()=>validateActivity({...quiz(),timerSeconds}));
 assert.equal(validateActivity({...quiz(),timerSeconds:60}).timerSeconds,60);
 assert.throws(()=>validateActivity({...quiz(),prompt:'x'.repeat(2001)}));assert.throws(()=>validateActivity({...quiz(),allowRevisions:'yes'}));assert.throws(()=>validateActivity({...quiz(),kind:'UNKNOWN'}));
});
