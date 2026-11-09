import test from 'node:test';
import assert from 'node:assert/strict';
import {composeFinancial,studentContent,EMPTY_INSTRUCTOR} from './compose';
import {FINANCIAL_COVERAGE} from './coverage';
import {baseStudent,pfAnswers,instructor} from './testing/fixture';
import {INTAKE_V2_FORM_VERSION,INTAKE_V2_SCHEMA_VERSION,type IntakeV2Record} from '../student-intake-v2/contracts';
const at='2026-11-07T00:00:00.000Z';
const source=(sections:any)=>({id:'synthetic',student_user_id:'a',status:'completed',snapshot_version:3,completed_at:at,form_version:INTAKE_V2_FORM_VERSION,schema_version:INTAKE_V2_SCHEMA_VERSION,student_sections_json:{...baseStudent(),...pfAnswers(),...sections},instructor_assessment_json:{...instructor(),instructorPrivateNotes:{value:'PRIVATE_SENTINEL'}},provenance_json:{},system_flags_json:[]} as unknown as IntakeV2Record);
test('54 fields have explicit coverage; range/goal context is preserved without manufactured precision',()=>{
 assert.equal(FINANCIAL_COVERAGE.length,54);assert.equal(new Set(FINANCIAL_COVERAGE.map(f=>f.key)).size,54);
 for(const f of FINANCIAL_COVERAGE)assert.ok(f.policy&&f.label&&f.note);
 assert.ok(FINANCIAL_COVERAGE.filter(f=>f.group==='Debt / credit').every(f=>f.rules.length===0));
 const s=source({desiredAdditionalMonthlyIncomeRange:{value:'$500–$999'}}),a=composeFinancial(s,at),b=composeFinancial(s,at);
 assert.deepEqual(a,b);assert.ok(a.financial.goals.some(g=>g.value==='$500–$999'));
 assert.ok(a.financial.context.some(c=>c.key==='monthlyTakeHomeRange'&&c.value==='$3,000–$4,999'));
 assert.equal('curriculum_starting_level_v1' in a.financial.findings,false);
 const dto=studentContent(a.financial,EMPTY_INSTRUCTOR),encoded=JSON.stringify(dto);
 for(const forbidden of ['PRIVATE_SENTINEL','instructor_assessment','provenance_json','recommended_starting_level','expected_return','profit_target','risk_per_trade'])assert.ok(!encoded.includes(forbidden));
});
test('synthetic pressure, borrowed/essential, PNTA, missing and strong contexts remain advisory',()=>{
 const cases=[
 {tradingCapitalSources:{value:['Borrowed money']},borrowedCreditFundingIntent:{value:'Yes'}},
 {tradingCapitalSources:{value:['Money normally used for bills/living expenses']},billsMoneyUsedForTradingFrequency:{value:'Often'}},
 {tradingCapitalSources:{value:['Prefer not to answer']},borrowedCreditFundingIntent:{value:'Prefer not to answer'},billsMoneyUsedForTradingFrequency:{value:'Prefer not to answer'}},
 {savingsEmergencyRanges:{value:{}},unexpectedExpenseAbility:{value:null}},
 {pressureToMakeMoneyQuickly:{value:'High urgency'},tradingProfitsForEssentialExpensesExpectation:{value:'I expect trading profits to cover major essential expenses'}},
 {}];
 for(const c of cases){const r=composeFinancial(source(c),at);assert.ok(!JSON.stringify(r.financial).includes('SAFE_TO_TRADE'));assert.equal(r.financial.findings.demo_first_readiness_advisory_v1.instructor_review_required,true);}
 const unknown=composeFinancial(source(cases[2]),at);assert.equal(unknown.financial.findings.funding_source_safety_review_v1.status,'INSUFFICIENT_INFORMATION');
});
