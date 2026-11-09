import test from 'node:test';
import assert from 'node:assert/strict';
import {categorizeValue,reason} from './normalization';
import {deriveFundingSourceSafetyReview,deriveCurriculumStartingLevel,deriveEmergencyResilienceBand} from './derived-features';
const ctx={computed_at:'2026-11-07T00:00:00.000Z'};
const input=(values:Record<string,unknown>)=>({intake_id:'synthetic',form_version:'hft_intake_v2_form.2026-11-05_phase3f',schema_version:'hft_intake_v2.0',student_sections_json:Object.fromEntries(Object.entries(values).map(([k,value])=>[k,{value}])) as any});
test('scalar, array and compound unanswered values are uncertainty, never reassuring funding',()=>{
 for(const unknown of ['Prefer not to answer','Unknown',['Prefer not to answer'],['Not sure yet'],{status:'Prefer not to answer'},{},[],null]){
  const r=deriveFundingSourceSafetyReview(input({tradingCapitalSources:unknown,borrowedCreditFundingIntent:'Prefer not to answer',billsMoneyUsedForTradingFrequency:'Prefer not to answer'}),ctx);
  assert.notEqual(r.status,'KNOWN',JSON.stringify(unknown));assert.equal(r.instructor_review_required,true);
  assert.notEqual(categorizeValue(unknown,'',true).status,'KNOWN');
 }
 const partial=deriveFundingSourceSafetyReview(input({tradingCapitalSources:['Prefer not to answer'],borrowedCreditFundingIntent:'No',billsMoneyUsedForTradingFrequency:'Never'}),ctx);
 assert.equal(partial.result,'INSUFFICIENT_INFORMATION');
});
test('compound reasons are readable and no missing reserve is zero',()=>{
 const r=reason('i','savingsEmergencyRanges','student',{savings:'$500–$999',emergencyFund:'Not sure yet'},'',true,'CONTEXT','Synthetic');
 assert.ok(r.display_value?.includes('savings: $500–$999'));assert.ok(!r.display_value?.includes('[object Object]'));
 assert.equal(deriveEmergencyResilienceBand(input({savingsEmergencyRanges:{savings:'Not sure yet',emergencyFund:'Prefer not to answer'}}),ctx).result,'INSUFFICIENT_INFORMATION');
});
test('educational level is invariant across financial circumstances',()=>{
 const edu={knowledgeMatrix:{stop_loss:'Familiar'},marketsExperience:['Forex'],demoLiveExperience:{demo:'Yes',live:'Yes'}};
 const baseline=deriveCurriculumStartingLevel(input(edu),ctx);
 for(const financial of [{monthlyTakeHomeRange:'Under $1,000',debtStatusTypes:{hasDebt:'Yes'},totalDebtRange:'$50,000+',pressureToMakeMoneyQuickly:'High urgency'}, {monthlyTakeHomeRange:'$10,000+',debtStatusTypes:{hasDebt:'No'},pressureToMakeMoneyQuickly:'No urgency right now'}, {creditScoreRange:'Prefer not to say',availableTradingCapitalRange:'$0',savingsEmergencyRanges:{savings:'$0',emergencyFund:'$0'}}]) assert.deepEqual(deriveCurriculumStartingLevel(input({...edu,...financial}),ctx),baseline);
});

test('malformed funding compounds cannot stand in for a usable source array',()=>{
 const r=deriveFundingSourceSafetyReview(input({tradingCapitalSources:{unexpected:'compound'},borrowedCreditFundingIntent:'No',billsMoneyUsedForTradingFrequency:'Never'}),ctx);
 assert.equal(r.result,'INSUFFICIENT_INFORMATION');assert.equal(r.instructor_review_required,true);
});
