import "server-only";
import { assertLifecycleActive } from "../../student-lifecycle";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Answer, AssessmentReview, AttemptView, Concept, InteractiveLesson, LearningState, Question } from "./contracts";
import { assessmentResult, interactiveLesson, matchesAnswer, studentLesson, studentQuestion, validateAnswer } from "./policy";

const database = (): any => getCloudflareContext().env.DB;
const uid = () => crypto.randomUUID().replaceAll("-", "");
const now = () => new Date().toISOString();
const parse = <T>(value: string | null, fallback: T): T => value ? JSON.parse(value) : fallback;
const fail = (message: string, status=400): never => { throw Object.assign(new Error(message),{status}); };

async function context(userId: string, lessonId: string) {
  const { requireLessonAccess } = await import("../index");
  const { lesson } = await requireLessonAccess(userId,lessonId);
  const doc = interactiveLesson(lesson.content);
  if (!doc || doc.id!==lessonId) return fail("Interactive lesson unavailable.",404);
  return { db: database(), doc, lesson };
}
async function evidence(db: any, userId: string, doc: InteractiveLesson) {
  const events = (await db.prepare('SELECT * FROM academy_learning_event WHERE user_id=? AND lesson_id=? AND content_version=? ORDER BY rowid ASC').bind(userId,doc.id,doc.version).all()).results;
  const attempts = (await db.prepare('SELECT * FROM student_quiz_attempt WHERE user_id=? AND quiz_id=? AND learning_version=? ORDER BY attempt_number ASC').bind(userId,doc.quizId,doc.version).all()).results;
  const homework = (await db.prepare('SELECT * FROM student_assignment_submission WHERE user_id=? AND assignment_id=? ORDER BY attempt_number ASC').bind(userId,doc.assignmentId).all()).results;
  const completedSteps = doc.steps.filter(step=>events.some((e:any)=>e.kind==='step' && e.event_key===step.id && e.passed===1)).map(s=>s.id);
  const latest = attempts.at(-1);
  const result = latest ? assessmentResult(parse<Question[]>(latest.learning_questions_json,[]),parse(latest.learning_answers_json,{}),parse<AssessmentReview|null>(latest.learning_review_json,null)) : null;
  const submitted = latest && latest.status!=='in_progress';
  const reviewed = submitted && !!latest.learning_review_json;
  const currentHomework = homework.filter((h:any)=>h.learning_attempt_id===latest?.id);
  const approved = currentHomework.at(-1)?.status==='approved' && currentHomework.at(-1)?.approved===1;
  const allInteractions = doc.steps.every(step=>(step.activities??[]).filter(a=>a.required).every(a=>events.some((e:any)=>e.kind==='activity' && e.event_key===a.id && (a.diagnostic || e.passed===1))));
  const ready = completedSteps.length===doc.steps.length && allInteractions;
  const canComplete = ready && !!reviewed && !!result?.passed && approved;
  return {events,attempts,homework,currentHomework,completedSteps,latest,result,reviewed,ready,canComplete};
}
/** Used by legacy completion/unlock paths too; never trusts a completed flag alone. */
export async function isLearningGateSatisfied(db: any, userId: string, lesson: any): Promise<boolean> {
  const doc=interactiveLesson(lesson.content);
  if(!doc)return true;
  const e=await evidence(db,userId,doc);
  const p=await db.prepare('SELECT status,learning_version FROM student_lesson_progress WHERE user_id=? AND lesson_id=?').bind(userId,doc.id).first();
  return e.canComplete && p?.status==='completed' && p.learning_version===doc.version;
}
async function stateFor(db: any,userId:string,doc:InteractiveLesson): Promise<LearningState> {
  const e=await evidence(db,userId,doc);
  const progress=await db.prepare('SELECT status,learning_version FROM student_lesson_progress WHERE user_id=? AND lesson_id=?').bind(userId,doc.id).first();
  const completed=e.canComplete && progress?.status==='completed' && progress.learning_version===doc.version;
  const activityResults: LearningState['activityResults']={};
  for(const event of e.events)if(event.kind==='activity')activityResults[event.event_key]={passed:event.passed===1,feedback:event.feedback};
  const diagnosticWeak = doc.steps.flatMap(step=>step.activities??[]).filter(a=>a.diagnostic && activityResults[a.id]?.passed===false).map(a=>a.concept);
  const attempts: AttemptView[]=e.attempts.map((a:any)=>{
    const questions=parse<Question[]>(a.learning_questions_json,[]);
    const result=assessmentResult(questions,parse(a.learning_answers_json,{}),parse<AssessmentReview|null>(a.learning_review_json,null));
    return {id:a.id,number:a.attempt_number,status:a.status,questions:questions.map(studentQuestion),answers:parse(a.learning_answers_json,{}),score:result.score,mastery:result.score===null?{}:result.mastery,feedback:a.instructor_feedback??'',branch:result.score===null?null:result.branch};
  });
  const canSubmitHomework=!!e.reviewed && e.result?.branch!=='broad' && (!e.currentHomework.length || e.currentHomework.at(-1).status==='revision_required');
  let status:LearningState['status']='In progress';
  if(e.latest?.status==='instructor_review_required' || e.currentHomework.at(-1)?.status==='submitted')status='Awaiting instructor review';
  else if(e.reviewed && !e.result?.passed)status='Remediation required';
  else if(e.reviewed)status='Awaiting homework';
  if(completed)status='Completed';
  const {getCourseWithStructure}=await import('../index');
  const structure=await getCourseWithStructure(doc.courseId);
  const idx=structure?.lessons.findIndex((l:any)=>l.id===doc.id)??-1;
  const next=idx>=0?structure?.lessons[idx+1]:null;
  return {lesson:studentLesson(doc),completedSteps:e.completedSteps,activityResults,attempts,
    homework:e.homework.filter((h:any)=>e.attempts.some((a:any)=>a.id===h.learning_attempt_id)).map((h:any)=>({id:h.id,attemptId:h.learning_attempt_id,number:h.attempt_number,status:h.status,text:h.response_text,feedback:h.instructor_feedback??'',branch:h.learning_branch})),
    homeworkTask:e.reviewed && e.result?.branch!=='broad'?{title:doc.homework[e.result!.branch].title,instructions:doc.homework[e.result!.branch].instructions}:null,
    weakConcepts:e.reviewed?(e.result?.weakConcepts??[]):[...new Set(diagnosticWeak)],status,
    canStartAssessment:e.ready && (!e.latest || (!!e.reviewed && !e.result?.passed && e.events.some((event:any)=>event.kind==='remediation' && event.event_key===e.latest.id))),
    canSubmitHomework,canComplete:e.canComplete,
    nextLesson:next?{id:next.id,title:next.title,available:completed}:null};
}
export async function getLearningState(userId:string,lessonId:string) {
  const {db,doc}=await context(userId,lessonId);
  return stateFor(db,userId,doc);
}
async function event(db:any,userId:string,doc:InteractiveLesson,kind:string,key:string,response:unknown,passed:boolean,feedback='') {
  await db.prepare('INSERT INTO academy_learning_event (id,user_id,lesson_id,content_version,kind,event_key,response_json,passed,feedback,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(uid(),userId,doc.id,doc.version,kind,key,JSON.stringify(response),passed?1:0,feedback,now()).run();
}
function scopedAttempt(e:any,id:unknown) {
  const row=e.attempts.find((a:any)=>a.id===id);
  if(!row)return fail('Attempt unavailable.',403);
  return row;
}
function answersFor(questions:Question[],input:unknown,complete:boolean):Record<string,Answer> {
  if(!input || typeof input!=='object' || Array.isArray(input))return fail('Invalid assessment answers.');
  const data=input as Record<string,Answer>;
  if(Object.keys(data).some(key=>!questions.some(q=>q.id===key)))return fail('Foreign question in assessment.');
  if(JSON.stringify(data).length>60000)return fail('Assessment is too large.');
  for(const q of questions) {
    if(complete)validateAnswer(q,data[q.id]);
    else if(Object.hasOwn(data,q.id) && typeof data[q.id]!=='string' && (typeof data[q.id]!=='object' || data[q.id]===null))return fail('Invalid draft answer.');
  }
  return data;
}
export async function learningAction(userId:string,lessonId:string,input:any):Promise<LearningState> {
  const {db,doc}=await context(userId,lessonId);
  const e=await evidence(db,userId,doc);
  if(!input || typeof input!=='object')return fail('Invalid learning action.');
  if(input.action==='activity') {
    const index=doc.steps.findIndex(step=>step.activities?.some(a=>a.id===input.activityId));
    if(index<0 || index>e.completedSteps.length)return fail('Complete previous steps in order.');
    const a=doc.steps[index].activities!.find(a=>a.id===input.activityId)!;
    validateAnswer(a,input.answer);
    const passed=matchesAnswer(input.answer,a.correct);
    await event(db,userId,doc,'activity',a.id,input.answer,passed,passed?a.feedback:a.retryFeedback);
  } else if(input.action==='step') {
    const index=doc.steps.findIndex(s=>s.id===input.stepId);
    if(index<0 || index>e.completedSteps.length)return fail('Complete previous steps in order.');
    const step=doc.steps[index];
    // A persisted acknowledgement remains valid when revisiting after refresh.
    if(e.completedSteps.includes(step.id))return stateFor(db,userId,doc);
    if((step.activities??[]).filter(a=>a.required).some(a=>!e.events.some((v:any)=>v.kind==='activity' && v.event_key===a.id && (a.diagnostic || v.passed===1))))return fail('Complete the required interactions first.');
    if((step.reveals??[]).some(r=>!Array.isArray(input.revealIds) || !input.revealIds.includes(r.id)))return fail('Open each concept before continuing.');
    if(!e.completedSteps.includes(step.id))await event(db,userId,doc,'step',step.id,{revealIds:input.revealIds??[]},true);
  } else if(input.action==='start_assessment') {
    if(!e.ready)return fail('Complete the lesson content and required interactions first.');
    if(e.latest?.status==='in_progress')return stateFor(db,userId,doc);
    if(e.latest && (!e.reviewed || e.result?.passed || !e.events.some((v:any)=>v.kind==='remediation' && v.event_key===e.latest.id)))return fail('Complete instructor review and remediation before a retake.');
    const maximum=await db.prepare('SELECT MAX(attempt_number) AS n FROM student_quiz_attempt WHERE user_id=? AND quiz_id=?').bind(userId,doc.quizId).first();
    const n=(maximum?.n??0)+1;
    // Snapshot selected questions; later curriculum edits cannot rewrite attempts.
    const questions=doc.questionBanks[(n-1)%doc.questionBanks.length].map(q=>{
      const options=q.options?[...q.options]:undefined;
      if(options)for(let i=options.length-1;i>0;i--){const random=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[options[i],options[random]]=[options[random],options[i]];}
      return {...q,...(options?{options}:{})};
    });
    await db.prepare("INSERT INTO student_quiz_attempt (id,user_id,quiz_id,attempt_number,status,started_at,learning_version,learning_questions_json,learning_answers_json) VALUES (?,?,?,?,'in_progress',?,?,?,'{}')").bind(uid(),userId,doc.quizId,n,now(),doc.version,JSON.stringify(questions)).run();
  } else if(input.action==='save_assessment' || input.action==='submit_assessment') {
    const a=scopedAttempt(e,input.attemptId);
    if(a.id!==e.latest?.id || a.status!=='in_progress')return fail('Attempt is closed or already submitted.');
    const questions=parse<Question[]>(a.learning_questions_json,[]);
    const submit=input.action==='submit_assessment';
    const answers=answersFor(questions,input.answers,submit);
    const result=await db.prepare("UPDATE student_quiz_attempt SET learning_answers_json=?,status=?,submitted_at=?,instructor_review_required=? WHERE id=? AND user_id=? AND status='in_progress'").bind(JSON.stringify(answers),submit?'instructor_review_required':'in_progress',submit?now():null,submit?1:0,a.id,userId).run();
    if(!result.meta?.changes)return fail('Attempt has already been submitted.',409);
  } else if(input.action==='remediate') {
    if(!e.reviewed || e.result?.passed)return fail('No reviewed remediation is required.');
    await event(db,userId,doc,'remediation',e.latest.id,{concepts:e.result?.weakConcepts},true);
  } else if(input.action==='homework') {
    if(!e.reviewed || e.result?.branch==='broad')return fail('Complete remediation and a different knowledge-check attempt before homework.');
    if(typeof input.text!=='string' || input.text.trim().length<40 || input.text.length>12000)return fail('Provide your original homework response (40–12000 characters).');
    const prior=e.currentHomework.at(-1);
    if(prior && prior.status!=='revision_required')return fail('Homework is already awaiting review or approved.');
    const submissionId=uid();
    const maximum=await db.prepare('SELECT MAX(attempt_number) AS n FROM student_assignment_submission WHERE user_id=? AND assignment_id=?').bind(userId,doc.assignmentId).first();
    await db.batch([
      db.prepare("INSERT INTO student_assignment_submission (id,user_id,assignment_id,status,response_text,file_urls,attempt_number,revision_of_id,submitted_at,learning_attempt_id,learning_branch) VALUES (?,?,?,'submitted',?,'[]',?,?,?,?,?)").bind(submissionId,userId,doc.assignmentId,input.text.trim(),(maximum?.n??0)+1,prior?.id??null,now(),e.latest.id,e.result!.branch),
      db.prepare("INSERT INTO assignment_submission_history (id,submission_id,action,actor_id,actor_type,created_at) VALUES (?,?,?,?,'student',?)").bind(uid(),submissionId,prior?'resubmitted':'submitted',userId,now()),
    ]);
  } else if(input.action==='complete') {
    if(!e.canComplete)return fail('Lesson requirements are incomplete: reviewed knowledge, mastery and approved homework are required.');
    await db.prepare("INSERT INTO student_lesson_progress (id,user_id,lesson_id,status,started_at,completed_at,updated_at,learning_version) VALUES (?,?,?,'completed',?,?,?,?) ON CONFLICT(user_id,lesson_id) DO UPDATE SET status='completed',completed_at=COALESCE(completed_at,excluded.completed_at),updated_at=excluded.updated_at,learning_version=excluded.learning_version").bind(uid(),userId,doc.id,now(),now(),now(),doc.version).run();
  } else return fail('Unknown learning action.');
  return stateFor(db,userId,doc);
}
async function staff(db:any,actorId:string,studentId:string) {
  await assertLifecycleActive(db,actorId);
  const user=await db.prepare('SELECT role,banned,must_change_password FROM user WHERE id=?').bind(actorId).first();
  if(actorId===studentId || user?.role!=='admin' || user.banned || user.must_change_password)return fail('Forbidden: authorized admin review required.',403);
}
export async function getInstructorLearningState(actorId:string,studentId:string,lessonId:string) {
  const db=database(); await staff(db,actorId,studentId);
  // Authorized staff can inspect retained work without restoring student eligibility.
  const lesson=await db.prepare('SELECT content FROM academy_lesson WHERE id=?').bind(lessonId).first();
  const doc=interactiveLesson(lesson?.content);
  if(!doc)return fail('Interactive lesson unavailable.',404);
  const student=await db.prepare('SELECT lifecycle_status,banned FROM user WHERE id=?').bind(studentId).first();
  if(!student)return fail('Student unavailable.',404);
  const readOnly=student.lifecycle_status!=='ACTIVE'||!!student.banned;
  const e=await evidence(db,studentId,doc);
  return {readOnly,state:await stateFor(db,studentId,doc),reviewItems:e.attempts.map((a:any)=>({id:a.id,questions:parse(a.learning_questions_json,[]),answers:parse(a.learning_answers_json,{}),status:a.status})),homeworkRubrics:doc.homework};
}
export async function instructorAction(actorId:string,studentId:string,lessonId:string,input:any):Promise<LearningState> {
  const db=database();await staff(db,actorId,studentId);
  const {doc}=await context(studentId,lessonId);
  const e=await evidence(db,studentId,doc);
  if(input.action==='review_assessment') {
    const a=scopedAttempt(e,input.attemptId);
    if(a.id!==e.latest?.id || a.status!=='instructor_review_required' || a.learning_review_json)return fail('Only the pending latest attempt can be reviewed.');
    const qs=parse<Question[]>(a.learning_questions_json,[]), review=input.review as AssessmentReview;
    const manual=qs.filter(q=>q.kind==='written'||q.kind==='true_false_explain');
    const mastery=qs.filter(q=>q.mastery);
    if(!review || typeof review.feedback!=='string' || review.feedback.length>4000 || !review.grades || !review.mastery || manual.some(q=>typeof review.grades[q.id]!=='boolean') || mastery.some(q=>typeof review.mastery[q.id]!=='boolean') || Object.keys(review.grades).some(k=>!manual.some(q=>q.id===k)) || Object.keys(review.mastery).some(k=>!mastery.some(q=>q.id===k)))return fail('Grade every written answer and each required mastery concept explicitly.');
    const safe={grades:review.grades,mastery:review.mastery,feedback:review.feedback};
    const result=assessmentResult(qs,parse(a.learning_answers_json,{}),safe);
    const updated=await db.prepare("UPDATE student_quiz_attempt SET learning_review_json=?,learning_mastery_json=?,score_percent=?,score_points=?,total_points=?,passed=?,status='graded',instructor_review_required=0,instructor_feedback=? WHERE id=? AND user_id=? AND status='instructor_review_required' AND learning_review_json IS NULL").bind(JSON.stringify({...safe,reviewedBy:actorId,reviewedAt:now()}),JSON.stringify(result.mastery),result.score,Object.values(result.grades).filter(Boolean).length,qs.length,result.passed?1:0,safe.feedback,a.id,studentId).run();
    if(!updated.meta?.changes)return fail('Attempt already reviewed.',409);
  } else if(input.action==='review_homework') {
    const h=e.homework.find((h:any)=>h.id===input.submissionId);
    if(!h || h.learning_attempt_id!==e.latest?.id || h.id!==e.currentHomework.at(-1)?.id || h.status!=='submitted' || !e.reviewed || e.result?.branch==='broad')return fail('Only current submitted homework can be reviewed.');
    if(!['approve','request_revision'].includes(input.decision) || typeof input.feedback!=='string' || input.feedback.length>4000 || (input.decision==='request_revision' && input.feedback.trim().length<5))return fail('Provide a valid decision and actionable revision feedback.');
    const approved=input.decision==='approve';
    await db.batch([
      db.prepare("UPDATE student_assignment_submission SET status=?,approved=?,reviewed_at=?,reviewed_by=?,instructor_feedback=? WHERE id=? AND status='submitted'").bind(approved?'approved':'revision_required',approved?1:0,now(),actorId,input.feedback,h.id),
      db.prepare("INSERT INTO assignment_submission_history (id,submission_id,action,actor_id,actor_type,feedback,created_at) VALUES (?,?,?,?,'instructor',?,?)").bind(uid(),h.id,approved?'approved':'revision_required',actorId,input.feedback,now()),
    ]);
  } else return fail('Unknown review action.');
  return stateFor(db,studentId,doc);
}
