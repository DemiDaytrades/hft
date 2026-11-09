import test from 'node:test';
import assert from 'node:assert/strict';
import {projectCanonical,type LegacySource} from './canonical';
import {NUMBERED_FORM_VERSION,NUMBERED_MAPPING_VERSION,resolveNumberedForm,NUMBERED_FIELDS} from './numbered';
import {fixtureDb} from '../financial-plan/testing/db';
import {getReviewWorkspace,beginReviewCapture,adoptLegacyAnswers} from './service';
import {readLegacyEducationalContext} from './legacy-education';
import {educationalIntake,recommendLearningPath} from '../learning-path/engine';
import {toStudentSafeIntakeResponse} from '../student-intake-v2/service';
const source=(data:Record<string,unknown>,extra:Partial<LegacySource>={}):LegacySource=>({kind:'legacy_intake',id:'synthetic-old',revision:1,capturedAt:'2026-11-03T05:17:00.000Z',completedAt:'2026-11-03T05:17:00.000Z',data,...extra});
test('verified historical source identifies its form; booking keys, missing dates and unsupported versions do not',()=>{
 assert.equal(resolveNumberedForm(source({q3:'Synthetic 90-day goal',q8:'Neither'})),NUMBERED_FORM_VERSION);
 assert.equal(resolveNumberedForm(source({q3:'booking topic',q8:'Neither'},{kind:'consultation_questionnaire'})),null);
 assert.equal(resolveNumberedForm(source({q3:'Unknown'},{capturedAt:null,completedAt:null})),null);
 assert.equal(resolveNumberedForm(source({q3:'Unknown'},{formVersion:'unknown-form'})),null);
 assert.equal(NUMBERED_FIELDS.filter(f=>/^q(?:[1-9]|1[0-8])$/.test(f.key)).length,18);
});
test('numbered goals/platforms/history/support reuse exact meaning and retain source mapping evidence without writes',()=>{
 const s=source({q3:'Synthetic 90-day goal',q4:'Synthetic long-term vision',q7:['MT5'],q8:'Neither',q9:'No',q10:'No',q11:['Hands-on','Video']});const old=JSON.stringify(s);const p=projectCanonical(null,[s]);
 assert.equal(p.sections.goals30_60_90?.value.goal90,'Synthetic 90-day goal');assert.equal(p.sections.goalBig?.value,'Synthetic long-term vision');assert.deepEqual(p.sections.demoLiveExperience?.value,{demo:'No',live:'No'});assert.deepEqual(p.sections.platformsBrokerExperience?.value.platforms,['MT5']);assert.equal(p.sections.platformAccess,undefined);assert.deepEqual(p.sections.learningStyles?.value,['Hands-on','Video']);
 const ref=p.sourceRefs.goalBig[0];assert.equal(ref.path,'q4');assert.equal(ref.historicalFormVersion,NUMBERED_FORM_VERSION);assert.equal(ref.mappingVersion,NUMBERED_MAPPING_VERSION);assert.equal(ref.canonicalPath,'goalBig');assert.equal(ref.evidenceKind,'HISTORICAL_STUDENT_REPORTED');assert.equal(JSON.stringify(s),old);
});
test('partial markets/ratings/raw amounts and unknown keys are never promoted or hidden as private observations',()=>{
 const p=projectCanonical(null,[source({q1:'Synthetic motivation',q2:'Synthetic broad aspiration',q5:'Yes',q6:['Forex'],q12:'8',q13:'9',q14:'Synthetic obstacle',q15:'Evenings',q16:'3000',q17:'1200',q18:'200',q999:'unknown',q26:'PRIVATE NOTE',whyJoin:'Synthetic reason'})]);
 for(const k of ['marketsExperience','knowledgeMatrix','behaviorMatrix','monthlyTakeHomeRange','recurringObligationsRange','dependentSupportObligation'])assert.equal(p.sections[k as keyof typeof p.sections],undefined);
 assert.ok(p.unmapped.find(f=>f.key==='q6')?.categories.includes('EDUCATIONAL_PLACEMENT_INPUT'));assert.equal(p.unmapped.find(f=>f.key==='q16')?.kind,'STUDENT_REPORTED');assert.ok(p.unmapped.find(f=>f.key==='q26')?.categories.includes('INSTRUCTOR_PRIVATE'));assert.ok(!p.facts.some(f=>JSON.stringify(f).includes('PRIVATE NOTE')));assert.equal(p.sections.goalImmediate,undefined);
});
test('new canonical facts win; historical disagreement surfaces without changing either record',()=>{
 const intake={id:'modern',snapshot_version:2,student_sections_json:{goalBig:{value:'Newer authoritative vision'}},provenance_json:{}} as any;const p=projectCanonical(intake,[source({q4:'Older vision'})]);assert.equal(p.sections.goalBig?.value,'Newer authoritative vision');assert.equal(p.adoptable.goalBig,undefined);assert.ok(p.conflicts.some(c=>c.key==='goalBig'));assert.equal(intake.student_sections_json.goalBig.value,'Newer authoritative vision');
});
test('a partial canonical demo/live object retains its authoritative child and fills only the missing child',()=>{
 const p=projectCanonical({id:'modern',snapshot_version:2,student_sections_json:{demoLiveExperience:{value:{demo:'Yes'}}},provenance_json:{}} as any,[source({q8:'Neither'})]);assert.deepEqual(p.sections.demoLiveExperience?.value,{demo:'Yes',live:'No'});assert.ok(p.conflicts.some(c=>c.key==='demoLiveExperience.demo'));
});
test('only already-approved financial ranges are reused, with no bucketing or education effects',()=>{
 const p=projectCanonical(null,[source({q16:'$3,000–$4,999',q23:'$500–$999',q21:'$5,000–$9,999'})]);assert.equal(p.sections.monthlyTakeHomeRange?.value,'$3,000–$4,999');assert.equal(p.sections.disposableIncomeRange,undefined);assert.equal(p.sections.totalDebtRange?.value,'$5,000–$9,999');
 const make=(sections:any)=>({intake:educationalIntake({id:'x',snapshot_version:1,student_sections_json:sections,instructor_assessment_json:{},provenance_json:{}}),assessment:null,academy:[],curriculum:[]});assert.deepEqual(recommendLearningPath(make(p.sections)),recommendLearningPath(make({})));assert.ok(p.facts.filter(f=>f.key.includes('Income')).every(f=>!f.categories.includes('EDUCATIONAL_PLACEMENT_INPUT')));
});
test('unsupported history options, contradictory None lists and future capture windows remain review-only',()=>{
 for(const data of [{q8:'No'},{q8:'__proto__'},{q8:'constructor'},{q8:'toString'},{q7:['None','MT5']},{q11:['invented option']}])assert.equal(Object.keys(projectCanonical(null,[source(data)]).adoptable).length,0);
 assert.equal(Object.keys(projectCanonical(null,[source({q3:'Unknown future form'},{capturedAt:'2026-12-01',completedAt:'2026-12-01'})]).adoptable).length,0);
});
test('full synthetic review recap, adoption, financial inputs and educational evidence preserve the original row and privacy',async()=>{
 const {db,sqlite}=fixtureDb();for(const [id,role] of [['staff','admin'],['qa','student']])sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run(id,id,id+'@example.invalid',role,'2026-11-07','2026-11-07');
 const data={q1:'Synthetic motivation',q3:'Synthetic 90-day objective',q4:'Synthetic long-term vision',q6:['Forex'],q7:['MT5'],q8:'Neither',q9:'No',q10:'No',q11:['Hands-on'],q16:'$3,000–$4,999',q18:'Synthetic support amount',q26:'PRIVATE HISTORICAL NOTE',q27:'PRIVATE OLD TRACK'};
 sqlite.prepare('INSERT INTO student_intake(id,userId,status,version,createdBy,data,createdAt,updatedAt,completedAt) VALUES(?,?,?,?,?,?,?,?,?)').run('old','qa','completed',1,'staff',JSON.stringify(data),'2026-11-03T05:03:00Z','2026-11-03T05:17:00Z','2026-11-03T05:17:00Z');
 const actor={userId:'staff',role:'admin'};let w=await getReviewWorkspace(db,actor,'qa');assert.ok(w.afterCallSummary.facts.some(f=>f.key==='goalBig'));assert.equal(w.projection.sections.monthlyTakeHomeRange?.value,'$3,000–$4,999');assert.ok(Object.values(w.financial.findings).some(f=>JSON.stringify(f).includes('$3,000–$4,999')));assert.ok(w.validation.issues.some(i=>i.path==='student_sections.preferredName'));assert.ok(!w.validation.issues.some(i=>i.path==='student_sections.goalBig'));
 const context=await readLegacyEducationalContext(db,'qa');assert.ok(context.some(c=>c.key==='q6'));assert.ok(!context.some(c=>['q16','q18','q26','q27'].includes(c.key)));assert.ok(w.recommendation.domains.every(d=>d.competency!=='MASTERED'));
 const started=await beginReviewCapture(db,actor,'qa');w=await getReviewWorkspace(db,actor,'qa');const adopted=await adoptLegacyAnswers(db,actor,'qa',started.id,started.snapshot_version,w.legacyDigest);assert.equal(adopted.student_sections_json.goalBig?.value,data.q4);assert.ok((adopted.provenance_json?.goalBig as any).sourceRefs.some((r:any)=>r.evidenceKind==='HISTORICAL_STUDENT_REPORTED'));assert.ok(!JSON.stringify(toStudentSafeIntakeResponse(adopted)).includes('PRIVATE'));assert.equal(sqlite.prepare('SELECT data FROM student_intake WHERE id=?').get('old')?.data,JSON.stringify(data));for(const table of ['financial_plan_version','learning_path_version','student_course_assignment'])assert.equal(sqlite.prepare(`SELECT count(*) AS n FROM ${table}`).get()?.n,0);sqlite.close();
});
