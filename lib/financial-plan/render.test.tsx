import test from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import PlanContent from '../../components/financial-plan/PlanContent';
import {composeFinancial,studentContent,EMPTY_INSTRUCTOR} from './compose';
import {baseStudent,pfAnswers,instructor} from './testing/fixture';
import {INTAKE_V2_FORM_VERSION,INTAKE_V2_SCHEMA_VERSION,type IntakeV2Record} from '../student-intake-v2/contracts';
test('student plan renders readable escaped guidance without private fields or placement',()=>{
 const source={id:'synthetic',student_user_id:'a',form_version:INTAKE_V2_FORM_VERSION,schema_version:INTAKE_V2_SCHEMA_VERSION,student_sections_json:{...baseStudent(),...pfAnswers()},instructor_assessment_json:{...instructor(),instructorPrivateNotes:{value:'PRIVATE_SENTINEL'}},provenance_json:{}} as unknown as IntakeV2Record;
 const {financial}=composeFinancial(source,'2026-11-07T00:00:00.000Z');
 const dto=studentContent(financial,{...EMPTY_INSTRUCTOR,explanation:'Review <script>injected</script> as plain text.'});
 const html=renderToStaticMarkup(<PlanContent content={dto}/>);
 assert.ok(html.includes('Your action plan'));assert.ok(html.includes('Self-reported ranges'));assert.ok(html.includes('&lt;script&gt;'));
 assert.ok(!html.includes('<script>'));assert.ok(!html.includes('PRIVATE_SENTINEL'));assert.ok(!html.includes('[object Object]'));
});
