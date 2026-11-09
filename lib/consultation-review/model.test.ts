import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewIsCurrent,changedFields,REVIEW_VERSION,judgmentFields} from './model';
test('review is exact-version evidence and source edits invalidate it',()=>{
 const r={version:REVIEW_VERSION,status:'reviewed',sourceRevision:4,reviewedBy:'staff',reviewedAt:'2026-11-07',matchesSelfReport:'NOT_OBSERVED'};
 assert.equal(reviewIsCurrent(r,4),true);assert.equal(reviewIsCurrent(r,5),false);assert.equal(reviewIsCurrent({...r,status:'draft'},4),false);assert.equal(reviewIsCurrent({...r,reviewedBy:null},4),false);
});
test('canonical correction captures both values and does not relabel original self-report',()=>{
 const old={preferredName:{value:'Earlier'}};const changes=changedFields(old,{preferredName:{value:'Corrected'}},'Clarified spelling');
 assert.deepEqual(changes,[{key:'preferredName',previousValue:{value:'Earlier'},newValue:{value:'Corrected'},reason:'Clarified spelling'}]);assert.equal(old.preferredName.value,'Earlier');assert.deepEqual(changedFields(old,old,''),[]);
});
test('concise judgment controls exclude repeated student facts and manual sequencing authority',()=>{
 assert.ok(judgmentFields.includes('instructorPrivateNotes'));assert.ok(!judgmentFields.includes('recommendedStartingLevel' as any));assert.ok(!judgmentFields.includes('recommendedAcademyTrack' as any));assert.ok(!judgmentFields.includes('assessedExperienceLevel' as any));
});
import {validateFinalCompletion} from '../student-intake-v2/validation';
import {baseStudent,pfAnswers} from '../financial-plan/testing/fixture';
test('empty claimed matrix entries are missing, not knowledge evidence',()=>{
 const s={...baseStudent(),...pfAnswers(),knowledgeMatrix:{value:{buy_sell_direction:''}}};const r=validateFinalCompletion({student_sections:s,instructor_assessment:{},ack_audit:{records:[]},intake_id:'qa'});
 assert.ok(r.issues.some(i=>i.path==='student_sections.knowledgeMatrix.buy_sell_direction'));assert.ok(r.issues.some(i=>i.path==='student_sections.knowledgeMatrix.stop_loss'));
});
test('never-traded history reactions are conditional in canonical mode only',()=>{
 const s={...baseStudent(),...pfAnswers()};delete s.reactionToLoss;delete s.reactionToWin;
 const input={student_sections:s,instructor_assessment:{},ack_audit:{records:[]},intake_id:'qa',snapshot_version:2};
 assert.ok(validateFinalCompletion(input).issues.some(i=>i.path==='student_sections.reactionToLoss'));
 assert.ok(!validateFinalCompletion({...input,instructor_review:{version:REVIEW_VERSION,status:'draft'}}).issues.some(i=>i.path==='student_sections.reactionToLoss'));
});
import {educationalIntake,recommendLearningPath} from '../learning-path/engine';
test('financial changes do not change educational profiles and instructor requests do not grant mastery',()=>{
 const base={id:'qa',snapshot_version:2,student_sections_json:{...baseStudent(),...pfAnswers()},instructor_assessment_json:{instructorPrivateNotes:{value:'PRIVATE'}},provenance_json:{},system_meta_json:{captureWorkflow:REVIEW_VERSION,smart_review:{requireAssessment:true,requirePractical:true,requireChartDemonstration:true}}};
 const source={intake:educationalIntake(base),assessment:null,academy:[],curriculum:[]};const recommendation=recommendLearningPath(source);
 const changed={...base,student_sections_json:{...base.student_sections_json,monthlyTakeHomeRange:{value:'$50,000+'},totalDebtRange:{value:'$0'},availableTradingCapitalRange:{value:'$100,000+'}}};
 assert.deepEqual(recommendLearningPath({...source,intake:educationalIntake(changed)}),recommendation);assert.ok(!JSON.stringify(source.intake).includes('PRIVATE'));assert.ok(recommendation.domains.every(d=>d.competency!=='MASTERED'));assert.ok(recommendation.domains.every(d=>d.missing.some(m=>m.includes('Instructor requested assessment'))));
});
