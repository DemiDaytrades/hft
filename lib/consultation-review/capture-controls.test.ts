import test from 'node:test';
import assert from 'node:assert/strict';
import { captureControl, optionsWithSaved, toggleCaptureOption, isCaptureVisible, patchScheduleDay, capturePrompt } from './capture-controls';
import { wrapCaptureValues } from '../student-intake-v2/workflow-fields';
test('historical demo/live and current access controls serialize exact existing Yes/No values',()=>{
 for(const path of ['demoLiveExperience.demo','demoLiveExperience.live','platformsBrokerExperience.brokerExperience','platformAccess.mt5','platformAccess.tradingView','platformAccess.demoAccount','platformAccess.liveAccount']){
  const control=captureControl(path);assert.equal(control.kind,'select');assert.deepEqual(control.options,['Yes','No']);
 }
 assert.deepEqual(wrapCaptureValues({demoLiveExperience:{demo:'No',live:'Yes'}}),{demoLiveExperience:{value:{demo:'No',live:'Yes'}}});
});
test('unknown saved controls remain selectable and editing a multiselect retains untouched custom values',()=>{
 assert.deepEqual(optionsWithSaved(['Yes','No'],'Needs setup'),['Yes','No','Needs setup']);
 assert.deepEqual(optionsWithSaved(['Forex'],['Custom market']),['Forex','Custom market']);
 assert.deepEqual(toggleCaptureOption(['Custom market'],'Forex',true),['Custom market','Forex']);
 assert.deepEqual(toggleCaptureOption(['Custom market','Forex'],'Forex',false),['Custom market']);
});
test('markets use existing options and explicit None yet selection is exclusive without inferring an answer',()=>{
 const spec=captureControl('marketsExperience');assert.equal(spec.kind,'multiselect');assert.ok(spec.options?.includes('Forex'));assert.ok(spec.options?.includes('None yet'));
 assert.deepEqual(toggleCaptureOption([],'Forex',false),[]);
 assert.deepEqual(toggleCaptureOption(['Custom market','Forex'],'None yet',true,['None yet']),['None yet']);
 assert.deepEqual(toggleCaptureOption(['None yet'],'Forex',true,['None yet']),['Forex']);
});
test('only explicit inactive branches hide details, never required knowledge or ordinary-mode reactions',()=>{
 const values={demoLiveExperience:{demo:'No',live:'No'},platformsBrokerExperience:{brokerExperience:'No'},priorEducation:{type:'No'},majorNegativeExperience:{type:'No'}};
 for(const path of ['liveAccountSizeRange','platformsBrokerExperience.brokerNames','priorEducation.notes','majorNegativeExperience.reflection'])assert.equal(isCaptureVisible(path,values,false),false,path);
 assert.equal(isCaptureVisible('reactionToLoss',values,true),false);assert.equal(isCaptureVisible('reactionToWin',values,true),false);
 assert.equal(isCaptureVisible('reactionToLoss',values,false),true);assert.equal(isCaptureVisible('knowledgeMatrix',values,true),true);
 assert.equal(isCaptureVisible('liveAccountSizeRange',{},true),true);assert.equal(isCaptureVisible('priorEducation.notes',{priorEducation:{type:'Unknown saved answer'}},true),true);
 assert.equal(isCaptureVisible('platformsBrokerExperience.brokerNames',{platformsBrokerExperience:{brokerExperience:'Yes'}},true),true);
});
test('narrative answers keep narrative controls; approved financial prompt comes directly from registry',()=>{
 for(const path of ['goalImmediate','goals6_12.goal6','motivationAndWhyNow','instructorPrivateNotes','reactionToLoss','knowledgeMatrix.market_structure_basics'])assert.equal(captureControl(path).kind,'narrative',path);
 assert.equal(capturePrompt('monthlyTakeHomeRange'),'What is your approximate monthly take-home income (after taxes)?');assert.equal(capturePrompt('goalImmediate'),undefined);
});
test('schedule note and window edits preserve other day data and unrelated nested values',()=>{
 const original={monday:{windows:['Evening'],note:'After commute',custom:'keep'},tuesday:{windows:['Morning']}};
 const note=patchScheduleDay(original,'monday',{note:'New note'});assert.deepEqual(note.monday,{windows:['Evening'],note:'New note',custom:'keep'});
 const cleared=patchScheduleDay(note,'monday',{windows:[]});assert.deepEqual(cleared.monday,{windows:[],note:'New note',custom:'keep'});assert.deepEqual(cleared.tuesday,original.tuesday);assert.equal(original.monday.note,'After commute');
});
