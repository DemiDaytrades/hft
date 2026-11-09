import test from 'node:test';
import assert from 'node:assert/strict';
import { projectCanonical, CANONICAL_FIELD_CATEGORIES, type LegacySource } from './canonical';
import { INTAKE_V2_STUDENT_KEYS, INTAKE_V2_INSTRUCTOR_KEYS, type IntakeV2Record } from '../student-intake-v2/contracts';
const source=(data:Record<string,unknown>,id='legacy'):LegacySource=>({kind:'consultation_questionnaire',id,revision:2,capturedAt:'2026-11-07T00:00:00Z',data});
const intake=(sections:Record<string,unknown>)=>({id:'v2',snapshot_version:3,updated_at:'2026-11-07T01:00:00Z',student_sections_json:sections} as IntakeV2Record);
test('canonical wins and disagreements retain both source references without mutating inputs',()=>{
 const s=intake({preferredName:{value:'Current'},goals30_60_90:{value:{goal30:'Current goal'}}});const before=JSON.stringify(s);
 const p=projectCanonical(s,[source({preferredName:'Old',goal30Day:'Old goal',goal90Day:'90'})]);
 assert.equal(p.sections.preferredName?.value,'Current');assert.deepEqual(p.sections.goals30_60_90?.value,{goal30:'Current goal',goal90:'90'});assert.equal(p.conflicts.length,2);assert.equal(p.conflicts[0].sources.length,2);assert.equal(JSON.stringify(s),before);assert.equal(p.adoptable.preferredName,undefined);assert.deepEqual(p.adoptable.goals30_60_90?.value,{goal30:'Current goal',goal90:'90'});
});
test('exact narrative facts fill missing values with source refs, while legacy disagreement is explicit',()=>{
 const p=projectCanonical(null,[{...source({preferredName:'Ada',confuses:'Entries'},'a'),kind:'legacy_intake'},source({preferredName:'Bea'},'b')]);
 assert.equal(p.sections.preferredName?.value,'Ada');assert.equal(p.sections.biggestTradingConfusion?.value,'Entries');assert.equal(p.conflicts.length,1);assert.equal(p.sourceRefs.preferredName[0].id,'a');assert.equal(p.facts.find(x=>x.key==='preferredName')?.kind,'STUDENT_REPORTED');
});
test('unknowns never become No/None, acknowledgments, financial ranges or invented goal dates',()=>{
 const p=projectCanonical(null,[source({tradedBefore:'No',monthlyTakeHomeIncome:'2500',goal612Month:'Buy a house',mt45:'Yes',mt5Installed:'Yes',experienceLevel:'Intermediate',brokerCurrent:'Not decided'})]);
 assert.equal(p.sections.marketsExperience,undefined);assert.equal(p.sections.monthlyTakeHomeRange,undefined);assert.equal(p.sections.goals6_12,undefined);assert.equal(p.sections.ackChecklist,undefined);assert.equal(p.sections.platformAccess,undefined);
 assert.ok(p.unmapped.some(x=>x.key==='mt5Installed'&&x.value==='Yes'));assert.ok(p.unmapped.some(x=>x.key==='experienceLevel'));assert.ok(p.unmapped.some(x=>x.key==='goal612Month'));assert.ok(!p.unmapped.some(x=>x.kind==='ASSESSMENT_DEMONSTRATED'));
});
test('partial historical account experience does not fabricate current platform access',()=>{
 const p=projectCanonical(null,[source({demoExperience:'Yes',liveExperience:'No',platformsUsed:['MT5'],knowledgeMarketStructure:'Expert'})]);
 assert.deepEqual(p.sections.demoLiveExperience?.value,{demo:'Yes',live:'No'});assert.equal(p.sections.platformAccess,undefined);assert.equal(p.sections.knowledgeMatrix,undefined);assert.deepEqual(p.sections.platformsBrokerExperience?.value,{platforms:['MT5']});
});
test('invalid shapes and ambiguous hours stay unknown; private instructor notes never enter student sections',()=>{
 const p=projectCanonical(null,[source({preferredName:['Bad'],hoursPerWeek:'40',instructorNotes:'Private',summaryLevel:'Expert',constructor:'bad',__proto__:{polluted:true}})]);
 assert.equal(p.sections.preferredName,undefined);assert.equal(p.sections.weeklyHoursRange,undefined);assert.equal((p.sections as any).instructorNotes,undefined);assert.equal(({} as any).polluted,undefined);assert.ok(p.unmapped.find(x=>x.key==='instructorNotes')?.categories.includes('INSTRUCTOR_PRIVATE'));
});
test('canonical provenance and categories keep observation and financial evidence distinct',()=>{
 const p=projectCanonical(intake({preferredName:{value:'Ada',provenance:{source:'system_derived'}},monthlyTakeHomeRange:{value:'$0'}}),[]);
 assert.equal(p.facts.find(x=>x.key==='preferredName')?.kind,'SYSTEM_DERIVED');assert.ok(!p.facts.find(x=>x.key==='monthlyTakeHomeRange')?.categories.includes('EDUCATIONAL_PLACEMENT_INPUT'));
 for(const key of [...INTAKE_V2_STUDENT_KEYS,...INTAKE_V2_INSTRUCTOR_KEYS])assert.ok(CANONICAL_FIELD_CATEGORIES[key]?.length,key);
});

test('financial goals/work-school/current access cannot fabricate different canonical facts',()=>{
 const p=projectCanonical(null,[{kind:'consultation_questionnaire',id:'q',revision:1,capturedAt:null,data:{financialGoal:'Pay this bill',bigGoal:'Pay debt',currentWork:'Full-time school',gtk2:'Family support',demoAccount:'Yes'}}]);
 assert.equal(p.sections.goalBig,undefined);assert.equal(p.sections.occupation,undefined);assert.equal(p.sections.demoLiveExperience,undefined);assert.ok(p.unmapped.some(f=>f.key==='financialGoal'));assert.ok(p.unmapped.some(f=>f.key==='currentWork'));
});
test('stored origin and original legacy refs survive override projection',()=>{
 const i={id:'v2',snapshot_version:4,student_sections_json:{preferredName:{value:'Corrected'}},provenance_json:{preferredName:{source:'instructor_entered_for_student',evidenceKind:'INSTRUCTOR_OVERRIDE',sourceRefs:[{kind:'consultation_questionnaire',id:'old',revision:1,path:'preferredName',capturedAt:null}]}}} as any;
 const p=projectCanonical(i,[]);assert.equal(p.facts[0].kind,'INSTRUCTOR_OVERRIDE');assert.ok(p.facts[0].sources.some(s=>s.id==='old'));
});
test('existing literal multiselect facts are reused without enum translation or repeating entry',()=>{
 const p=projectCanonical(null,[source({marketsTraded:['Forex','Crypto'],platformsUsed:['MT5'],learningPrefs:['Videos'],devices:['Desktop/Laptop']})]);
 assert.deepEqual(p.sections.marketsExperience?.value,['Forex','Crypto']);assert.deepEqual(p.sections.platformsBrokerExperience?.value,{platforms:['MT5']});assert.deepEqual(p.sections.learningStyles?.value,['Videos']);assert.deepEqual(p.sections.devicesInternet?.value,{devices:['Desktop/Laptop']});assert.equal(p.sections.platformAccess,undefined);
});
