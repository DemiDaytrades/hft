import test from 'node:test';
import assert from 'node:assert/strict';
import {fixtureDb} from '../financial-plan/testing/db';
import {readLegacyEducationalContext} from './legacy-education';
import {recommendLearningPath} from '../learning-path/engine';
test('legacy education retains source evidence while excluding financial/private data and mastery',async()=>{
 const {sqlite,db}=fixtureDb();sqlite.prepare('INSERT INTO user(id,name,email,createdAt,updatedAt) VALUES(?,?,?,?,?)').run('qa','Synthetic','qa@example.invalid','2026-11-07','2026-11-07');
 sqlite.prepare('INSERT INTO consultation_questionnaire(id,user_id,status,data,created_at,updated_at) VALUES(?,?,?,?,?,?)').run('q','qa','submitted',JSON.stringify({mt5Exp:'Never used',experienceLevel:'Advanced',monthlyTakeHomeIncome:'PRIVATE FINANCE',instructorNotes:'PRIVATE NOTE'}),'2026-11-07','2026-11-07');
 const legacyContext=await readLegacyEducationalContext(db,'qa');assert.deepEqual(legacyContext.map(c=>c.key).sort(),['experienceLevel','mt5Exp']);assert.ok(legacyContext.every(c=>c.reference.includes('consultation_questionnaire:q:revision:')));
 const result=recommendLearningPath({intake:null,assessment:null,academy:[],curriculum:[],legacyContext});assert.ok(!JSON.stringify(result).includes('PRIVATE'));assert.ok(result.domains.every(d=>d.competency!=='MASTERED'));assert.ok(result.domains.every(d=>d.evidence.filter(e=>e.reference?.startsWith('consultation_questionnaire')).every(e=>e.source==='INTAKE_SELF_REPORT'&&e.level==='SELF_REPORTED')));sqlite.close();
});
