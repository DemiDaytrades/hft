/** Browser-memory simulation only. No database, session, network, storage or provider imports. */
import type {Answer,HomeworkBranch,InteractiveLesson,LearningState} from '../learning/contracts';
import {studentLesson,studentQuestion,validateAnswer,matchesAnswer} from '../learning/policy';
export type PreviewScenario='start'|'interactions'|'pending'|'remediation'|'homework'|'completed';
export function previewState(doc:InteractiveLesson,scenario:PreviewScenario='start',branch:HomeworkBranch='strong'):LearningState{
 const s:LearningState={lesson:studentLesson(doc),completedSteps:[],activityResults:{},attempts:[],homework:[],homeworkTask:null,weakConcepts:[],status:'In progress',canStartAssessment:false,canSubmitHomework:false,canComplete:false,nextLesson:null};
 if(scenario==='start')return s;
 s.completedSteps=doc.steps.map(step=>step.id);for(const a of doc.steps.flatMap(s=>s.activities??[]))s.activityResults[a.id]={passed:true,feedback:'Simulation: interaction complete.'};s.canStartAssessment=true;
 if(scenario==='interactions')return s;
 s.canStartAssessment=false;
 const qs=doc.questionBanks[0];s.attempts=[{id:'preview-attempt-1',number:1,status:scenario==='pending'?'instructor_review_required':'graded',questions:qs.map(studentQuestion),answers:{},score:scenario==='pending'?null:scenario==='remediation'||branch==='broad'?40:branch==='strong'?100:80,mastery:scenario==='pending'?{}:Object.fromEntries(qs.filter(q=>q.mastery).map(q=>[q.id,scenario!=='remediation'&&branch!=='broad'])),feedback:'Simulation only. No instructor assessment or mastery has been recorded.',branch:scenario==='pending'?null:branch}];
 if(scenario==='pending'){s.status='Awaiting instructor review';return s;}
 if(scenario==='remediation'||branch==='broad'){s.status='Remediation required';s.weakConcepts=doc.concepts.slice(0,3).map(c=>c.id);return s;}
 s.status='Awaiting homework';s.homeworkTask={title:doc.homework[branch].title,instructions:doc.homework[branch].instructions};s.canSubmitHomework=true;
 if(scenario==='completed'){s.status='Completed';s.canSubmitHomework=false;s.homework=[{id:'preview-homework-1',attemptId:'preview-attempt-1',number:1,status:'approved',text:'Simulated approved homework for presentation review only.',feedback:'Simulated approval; not a real instructor decision.',branch}];}
 return s;
}
export function simulateAction(doc:InteractiveLesson,previous:LearningState,input:{action:string;[key:string]:any}):LearningState{
 const state=structuredClone(previous),reject=(message:string):never=>{throw Error(message);};
 if(input.action==='activity'){
  const index=doc.steps.findIndex(s=>s.activities?.some(a=>a.id===input.activityId));if(index<0||index>state.completedSteps.length)reject('Complete previous interactions in order.');
  const a=doc.steps[index].activities!.find(a=>a.id===input.activityId)!;validateAnswer(a,input.answer);const passed=matchesAnswer(input.answer,a.correct);state.activityResults[a.id]={passed,feedback:passed?a.feedback:a.retryFeedback};
 }else if(input.action==='step'){
  const index=doc.steps.findIndex(s=>s.id===input.stepId);if(index<0||index>state.completedSteps.length)reject('Complete previous interactions in order.');const step=doc.steps[index];
  if((step.activities??[]).filter(a=>a.required).some(a=>a.diagnostic?!state.activityResults[a.id]:!state.activityResults[a.id]?.passed)||(step.reveals??[]).some(r=>!input.revealIds?.includes(r.id)))reject('Complete required interactions and open each concept.');
  if(!state.completedSteps.includes(step.id))state.completedSteps.push(step.id);state.canStartAssessment=state.completedSteps.length===doc.steps.length&&!state.attempts.length;
 }else if(input.action==='start_assessment'){
  if(!state.canStartAssessment)reject('Complete required interactions/review first.');const n=state.attempts.length+1;state.attempts.push({id:`preview-attempt-${n}`,number:n,status:'in_progress',questions:doc.questionBanks[(n-1)%doc.questionBanks.length].map(studentQuestion),answers:{},score:null,mastery:{},feedback:'',branch:null});state.canStartAssessment=false;
 }else if(input.action==='save_assessment'||input.action==='submit_assessment'){
  const attempt=state.attempts.at(-1);if(!attempt||attempt.id!==input.attemptId||attempt.status!=='in_progress')reject('Preview attempt unavailable or closed.');
  const data=input.answers as Record<string,Answer>;if(!data||typeof data!=='object'||Array.isArray(data)||Object.keys(data).some(k=>!attempt!.questions.some(q=>q.id===k)))reject('Invalid preview answers.');
  if(input.action==='submit_assessment')for(const q of attempt!.questions)validateAnswer(q,data[q.id]);attempt!.answers=structuredClone(data);
  if(input.action==='submit_assessment'){attempt!.status='instructor_review_required';state.status='Awaiting instructor review';}
 }else if(input.action==='remediate'){
  if(state.status!=='Remediation required')reject('No remediation is required.');state.canStartAssessment=true;
 }else if(input.action==='homework'){
  if(!state.canSubmitHomework||typeof input.text!=='string'||input.text.trim().length<40)reject('Provide homework response of at least 40 characters after review.');
  state.homework.push({id:`preview-homework-${state.homework.length+1}`,attemptId:state.attempts.at(-1)!.id,number:state.homework.length+1,status:'submitted',text:input.text,feedback:'',branch:state.attempts.at(-1)!.branch??'strong'});state.canSubmitHomework=false;state.status='Awaiting instructor review';
 }else if(input.action==='complete'){
  if(!state.canComplete)reject('Lesson requirements incomplete. Use explicit simulation scenarios to inspect approval/completion.');state.status='Completed';
 }else reject('Unknown preview action.');
 return state;
}
