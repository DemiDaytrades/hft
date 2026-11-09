import { it } from 'node:test';
import assert from 'node:assert/strict';
import { INTAKE_V2_STUDENT_KEYS, INTAKE_V2_INSTRUCTOR_KEYS } from './contracts';
import { CAPTURE_SECTIONS, INSTRUCTOR_CAPTURE_FIELDS, wrapCaptureValues } from './workflow-fields';
import { FINANCIAL_HEALTH_KEY_ORDER } from './financial-health-registry';
import { DEBT_CREDIT_KEY_ORDER } from './debt-credit-registry';
import { MONTHLY_OBLIGATIONS_KEY_ORDER } from './monthly-obligations-registry';
import { TRADING_CAPITAL_READINESS_KEY_ORDER } from './trading-capital-readiness-registry';
import { TRADING_BEHAVIOR_KEY_ORDER } from './trading-behavior-registry';
it('every approved student contract has exactly one capture owner, except acknowledgment checklist handled by audit',()=>{
 const keys=[...new Set([...FINANCIAL_HEALTH_KEY_ORDER,...DEBT_CREDIT_KEY_ORDER,...MONTHLY_OBLIGATIONS_KEY_ORDER,...TRADING_CAPITAL_READINESS_KEY_ORDER,...TRADING_BEHAVIOR_KEY_ORDER])];
 const captured=CAPTURE_SECTIONS.flatMap(s=>s.fields.map(f=>f.key));
 assert.equal(new Set(captured).size,captured.length);
 assert.deepEqual([...new Set([...keys,...captured,'ackChecklist'])].sort(),[...INTAKE_V2_STUDENT_KEYS].sort());
 assert.deepEqual(INSTRUCTOR_CAPTURE_FIELDS.map(f=>f.key),[...INTAKE_V2_INSTRUCTOR_KEYS]);
});
it('capture wraps only explicitly edited fields and preserves nested/array contracts',()=>{
 assert.deepEqual(wrapCaptureValues({preferredName:'QA',demoLiveExperience:{demo:'No',live:'No'},learningStyles:['Videos']}),{preferredName:{value:'QA'},demoLiveExperience:{value:{demo:'No',live:'No'}},learningStyles:{value:['Videos']}});
 assert.deepEqual(wrapCaptureValues({}),{});
});
