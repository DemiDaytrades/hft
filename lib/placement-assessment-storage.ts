import 'server-only';
import {getCloudflareContext} from '@opennextjs/cloudflare';
import {scoreAssessment,QUESTIONS,validatePlacementAnswers} from './placement-assessment';
import {assertLifecycleActive} from './student-lifecycle';
const db=()=>getCloudflareContext().env.DB;
const fail=(message:string):never=>{throw new Error(message);};
export const publicQuestions=()=>QUESTIONS.map(({correct:_c,explanation:_e,...q})=>q);
export function toStudentAttempt(row:any){if(!row)return null;return {id:row.id,status:row.status,answers:row.answers,overallScore:row.overallScore,recommendedLevel:row.recommendedLevel,recommendedTrack:row.recommendedTrack,completedAt:row.completedAt};}
export async function createAttempt(userId:string,version:string){
 await assertLifecycleActive(db(),userId);if(version!=='v1')fail('Unsupported assessment version.');
 const at=new Date().toISOString(),id=crypto.randomUUID().replaceAll('-','');
 await db().prepare(`INSERT INTO placement_assessment_attempt(id,userId,status,answers,assessmentVersion,startedAt,createdAt,updatedAt,question_snapshot_json) SELECT ?,?,'in_progress','{}',?,?,?,?,? WHERE EXISTS(SELECT 1 FROM user WHERE id=? AND lifecycle_status='ACTIVE' AND COALESCE(banned,0)=0) AND NOT EXISTS(SELECT 1 FROM placement_assessment_attempt WHERE userId=? AND status='in_progress') ON CONFLICT DO NOTHING`).bind(id,userId,version,at,at,at,JSON.stringify(QUESTIONS),userId,userId).run();
 const active=await getActiveAttempt(userId);if(!active)fail('Assessment unavailable.');return active.id as string;
}
export async function getActiveAttempt(userId:string){return db().prepare("SELECT * FROM placement_assessment_attempt WHERE userId=? AND status='in_progress' ORDER BY createdAt DESC,id DESC LIMIT 1").bind(userId).first<any>();}
async function active(userId:string,attemptId:string){await assertLifecycleActive(db(),userId);const row=await db().prepare("SELECT * FROM placement_assessment_attempt WHERE id=? AND userId=? AND status='in_progress'").bind(attemptId,userId).first<any>();if(!row)fail('Attempt unavailable or closed.');return row;}
export async function saveDraft(userId:string,attemptId:string,answers:unknown){
 await active(userId,attemptId);validatePlacementAnswers(answers,false);
 const r=await db().prepare("UPDATE placement_assessment_attempt SET answers=?,updatedAt=? WHERE id=? AND userId=? AND status='in_progress' AND EXISTS(SELECT 1 FROM user WHERE id=? AND lifecycle_status='ACTIVE' AND COALESCE(banned,0)=0)").bind(JSON.stringify(answers),new Date().toISOString(),attemptId,userId,userId).run();if(!r.meta.changes)fail('Attempt unavailable or closed.');
}
export async function completeAttempt(userId:string,attemptId:string,answers:unknown,version:string){
 const row=await active(userId,attemptId);if(version!=='v1'||row.assessmentVersion!==version)fail('Unsupported assessment version.');
 validatePlacementAnswers(answers);const result=scoreAssessment(answers),at=new Date().toISOString();
 const r=await db().prepare(`UPDATE placement_assessment_attempt SET status='completed',answers=?,overallScore=?,forexKnowledgeScore=?,riskManagementScore=?,executionScore=?,psychologyScore=?,analysisScore=?,recommendedLevel=?,recommendedTrack=?,strengths=?,focusAreas=?,safeguardReason=?,completedAt=?,updatedAt=?,question_snapshot_json=? WHERE id=? AND userId=? AND status='in_progress' AND EXISTS(SELECT 1 FROM user WHERE id=? AND lifecycle_status='ACTIVE' AND COALESCE(banned,0)=0)`).bind(JSON.stringify(answers),result.overallScore,result.categoryScores.forexKnowledge,result.categoryScores.riskManagement,result.categoryScores.execution,result.categoryScores.psychology,result.categoryScores.analysis,result.recommendedLevel,result.recommendedTrack,JSON.stringify(result.strengths),JSON.stringify(result.focusAreas),result.safeguardReason,at,at,JSON.stringify(QUESTIONS),attemptId,userId,userId).run();
 if(!r.meta.changes)fail('Attempt unavailable or closed.');return result;
}
export async function getLatestCompleted(userId:string){return db().prepare("SELECT * FROM placement_assessment_attempt WHERE userId=? AND status='completed' ORDER BY completedAt DESC,id DESC LIMIT 1").bind(userId).first<any>();}
export async function getHistory(userId:string){return (await db().prepare('SELECT * FROM placement_assessment_attempt WHERE userId=? ORDER BY createdAt DESC,id DESC').bind(userId).all<any>()).results;}
