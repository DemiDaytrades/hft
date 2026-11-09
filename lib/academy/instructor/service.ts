import 'server-only';
import {assertLifecycleActive} from '../../student-lifecycle';
import {hasStudentAccess} from '../../membership-access';
import {interactiveLesson} from '../learning/policy';
import {getInstructorLearningState,isLearningGateSatisfied} from '../learning/service';
import {ensureLessonAvailable} from '../index';
import {isPlacementSkipApproved} from '../../learning-path/access';
import type {LearningState} from '../learning/contracts';
import type {StudentPath} from '../../learning-path/contracts';
const fail=(message:string,status=403):never=>{throw Object.assign(new Error(message),{status});};
export async function assertInstructor(db:D1Database,actorId:string){
 await assertLifecycleActive(db,actorId);
 const actor=await db.prepare('SELECT role,banned,must_change_password FROM user WHERE id=?').bind(actorId).first<any>();
 if(actor?.role!=='admin'||actor.banned||actor.must_change_password)fail('Forbidden: authorized instructor required.');
}
const json=(s:string,fallback:any)=>{try{return JSON.parse(s);}catch{return fallback;}};
function lessonMetadata(l:any){
 const doc=interactiveLesson(l.content),text=(l.content??'').trim();
 const readiness=doc?(doc.steps.length>0&&doc.steps.some(s=>s.paragraphs?.some(p=>p.trim()))&&doc.questionBanks.some(b=>b.length)?'READY':'NEEDS_CONTENT'):(!text||/^(coming soon|placeholder|todo|tbd|content coming soon)[.!\s]*$/i.test(text)?'NEEDS_CONTENT':l.lesson_type==='interactive'||text.startsWith('{')?'NOT_AVAILABLE':'READY');
 return {id:l.id,title:l.title,moduleId:l.module_id,publication:l.status,readiness,stage:doc?.stage??null,interactive:!!doc,version:doc?.version??null,classification:l.id==='hft-money-1'?'REQUIRED_CORE':l.placement_classification,estimatedMinutes:l.estimated_minutes,video:doc?.steps.some(s=>s.video&&!s.video.url)?'Video asset not attached':l.video_url?'Video linked':null};
}
async function catalogRows(db:D1Database){
 const courses=(await db.prepare('SELECT id,title,status,sort_order,track FROM academy_course ORDER BY sort_order,id').all<any>()).results;
 const modules=(await db.prepare('SELECT id,title,status,sort_order,course_id FROM academy_module ORDER BY sort_order,id').all<any>()).results;
 const lessons=(await db.prepare('SELECT * FROM academy_lesson ORDER BY sort_order,id').all<any>()).results;
 return {courses,modules,lessons};
}
export async function instructorCurriculum(db:D1Database,actorId:string){
 await assertInstructor(db,actorId);const {courses,modules,lessons}=await catalogRows(db);
 return {courses:courses.map(c=>({id:c.id,title:c.title,publication:c.status,track:c.track,modules:modules.filter(m=>m.course_id===c.id).map(m=>({id:m.id,title:m.title,publication:m.status,lessons:lessons.filter(l=>l.module_id===m.id).map(lessonMetadata)}))})),counts:{courses:courses.length,modules:modules.length,lessons:lessons.length}};
}
export async function inspectLesson(db:D1Database,actorId:string,lessonId:string){
 await assertInstructor(db,actorId);const l=await db.prepare('SELECT * FROM academy_lesson WHERE id=?').bind(lessonId).first<any>();if(!l)return fail('Lesson unavailable.',404);
 const module=await db.prepare('SELECT id,title,status,course_id FROM academy_module WHERE id=?').bind(l.module_id).first<any>();
 const course=await db.prepare('SELECT id,title,status FROM academy_course WHERE id=?').bind(module.course_id).first<any>();
 const quizzes=(await db.prepare('SELECT id,title,instructions,passing_score_percent,max_attempts FROM academy_quiz WHERE lesson_id=? ORDER BY sort_order,id').bind(lessonId).all<any>()).results;
 const assignments=(await db.prepare('SELECT id,title,instructions,assignment_type,rubric,requires_approval_to_unlock FROM academy_assignment WHERE lesson_id=? ORDER BY sort_order,id').bind(lessonId).all<any>()).results;
 const questions=[];for(const q of quizzes){const rows=(await db.prepare('SELECT id,question_text,explanation,question_type,points FROM academy_quiz_question WHERE quiz_id=? ORDER BY sort_order,id').bind(q.id).all<any>()).results;for(const r of rows){const choices=(await db.prepare('SELECT choice_text,is_correct FROM academy_quiz_question_choice WHERE question_id=? ORDER BY sort_order,id').bind(r.id).all<any>()).results;questions.push({...r,quizId:q.id,choices});}}
 return {lesson:{...lessonMetadata(l),description:l.description,content:l.content,requiresQuiz:!!l.requires_quiz,requiresAssignment:!!l.requires_assignment,requiresPractical:!!l.requires_practical,passingGate:!!l.passing_gate},module,course,interactive:interactiveLesson(l.content),quizzes,questions,assignments};
}
export async function instructorStudents(db:D1Database,actorId:string){
 await assertInstructor(db,actorId);const rows=(await db.prepare("SELECT id,name,email,lifecycle_status FROM user WHERE COALESCE(role,'student')='student' ORDER BY name,email,id").all<any>()).results;
 const safe=rows.map(u=>({id:u.id,name:u.name,email:u.email,lifecycle:u.lifecycle_status}));return {active:safe.filter(u=>u.lifecycle==='ACTIVE'),former:safe.filter(u=>u.lifecycle!=='ACTIVE')};
}
export function studentAccess(u:any){
 if(u.lifecycle_status!=='ACTIVE')return {allowed:false,reason:'ACCESS DENIED — student deactivated'};
 if(u.banned)return {allowed:false,reason:'ACCESS DENIED — account unavailable'};
 if(u.must_change_password)return {allowed:false,reason:'ACCESS DENIED — password change required'};
 if(!hasStudentAccess(u))return {allowed:false,reason:'ACCESS DENIED — no valid entitlement'};
 return {allowed:true,reason:'Valid entitlement and active student'};
}
/** Actor is always staff; target never becomes the session user. This function performs SELECTs only. */
export async function studentAcademyView(db:D1Database,actorId:string,studentId:string,selectedLessonId?:string){
 await assertInstructor(db,actorId);
 const u=await db.prepare("SELECT id,name,email,role,lifecycle_status,banned,must_change_password,subscriptionStatus,complimentaryAccessStartsAt,complimentaryAccessExpiresAt,complimentaryAccessRevokedAt FROM user WHERE id=? AND COALESCE(role,'student')='student'").bind(studentId).first<any>();if(!u)return fail('Student unavailable.',404);
 const access=studentAccess(u),catalog=await catalogRows(db);
 const assigned=(await db.prepare('SELECT id,course_id,status FROM student_course_assignment WHERE user_id=? ORDER BY assigned_at,id').bind(studentId).all<any>()).results;
 const progress=(await db.prepare('SELECT lesson_id,status,learning_version FROM student_lesson_progress WHERE user_id=?').bind(studentId).all<any>()).results;
 const genericHomework=(await db.prepare('SELECT s.status,s.attempt_number,a.lesson_id FROM student_assignment_submission s JOIN academy_assignment a ON a.id=s.assignment_id WHERE s.user_id=? ORDER BY s.attempt_number,s.id').bind(studentId).all<any>()).results;
 const genericQuizzes=(await db.prepare('SELECT a.status,a.instructor_review_required,a.attempt_number,q.lesson_id FROM student_quiz_attempt a JOIN academy_quiz q ON q.id=a.quiz_id WHERE a.user_id=? ORDER BY a.attempt_number,a.id').bind(studentId).all<any>()).results;
 const pathRow=await db.prepare("SELECT v.version,v.student_json FROM learning_path_series s JOIN learning_path_version v ON v.id=s.current_version_id AND v.series_id=s.id WHERE s.student_id=? AND v.status='APPROVED'").bind(studentId).first<any>();
 const learningPath=pathRow?{version:pathRow.version,path:json(pathRow.student_json,null) as StudentPath}:null;
 const legacy=learningPath?null:await db.prepare('SELECT instructorLevel,instructorTrack FROM student_placement WHERE userId=?').bind(studentId).first<any>();
 const lessons=[];const states=new Map<string,LearningState>();
 for(const course of catalog.courses)for(const module of catalog.modules.filter(m=>m.course_id===course.id))for(const l of catalog.lessons.filter(l=>l.module_id===module.id)){
  const isAssigned=assigned.some(a=>a.course_id===course.id&&a.status==='assigned'),published=l.status==='published'&&module.status==='published'&&course.status==='published';
  const p=progress.find(p=>p.lesson_id===l.id);const doc=interactiveLesson(l.content);
  // Reuse the existing, authorized instructor state projection (including historical/former work).
  let state:LearningState|null=null;if(doc){state=(await getInstructorLearningState(actorId,studentId,l.id)).state;states.set(l.id,state);}
  const hasRecordedWork=!!p||!!state&&(state.attempts.length>0||state.homework.length>0||state.completedSteps.length>0||Object.keys(state.activityResults).length>0);
  const recordedPresentation=!!state&&(isAssigned&&published||hasRecordedWork);
  const completed=p?.status==='completed'&&(!doc||await isLearningGateSatisfied(db,studentId,l));
  const skipped=published&&isAssigned&&await isPlacementSkipApproved(db,studentId,l.id);
  let lockReason=!access.allowed?access.reason:!published?'LOCKED — curriculum not yet available':!isAssigned?'LOCKED — not assigned':'';
  if(!lockReason&&!await ensureLessonAvailable(studentId,l.id,course.id)){
   const earlier=lessons.find(x=>x.courseId===course.id&&x.published&&!x.completed&&!x.skipped);
   const prior=earlier?states.get(earlier.id):null;
   lockReason=prior?.homework.at(-1)?.status==='submitted'||prior?.status==='Awaiting homework'?'LOCKED — homework awaiting approval':prior?.status==='Awaiting instructor review'?'LOCKED — instructor review required':'LOCKED — prerequisite not mastered';
  }
  const mastery=state?.attempts.at(-1)?.mastery??{};
  const homeworkStatus=state?.homework.at(-1)?.status??genericHomework.filter(h=>h.lesson_id===l.id).at(-1)?.status??'Not assigned';
  const latestQuiz=genericQuizzes.filter(q=>q.lesson_id===l.id).at(-1);
  const reviewRequired=state?.status==='Awaiting instructor review'||homeworkStatus==='submitted'||latestQuiz?.status==='instructor_review_required';
  lessons.push({...lessonMetadata(l),courseId:course.id,courseTitle:course.title,moduleTitle:module.title,assigned:isAssigned,published,completed,skipped,hasRecordedWork,recordedPresentation,availability:lockReason?'LOCKED' as const:skipped?'SKIPPED' as const:completed?'COMPLETED' as const:'AVAILABLE' as const,lockReason:lockReason||null,learningStatus:state?.status??p?.status??'Not started',stepsCompleted:state?.completedSteps.length??0,stepsTotal:doc?.steps.length??null,mastery,weakConcepts:state?.weakConcepts??[],homeworkStatus,remediationRequired:state?.status==='Remediation required',reviewRequired});
 }
 const current=lessons.find(l=>l.assigned&&!l.completed&&!l.skipped&&l.published),next=lessons.find(l=>l.availability==='AVAILABLE');
 const selected=selectedLessonId?lessons.find(l=>l.id===selectedLessonId):current;
 const raw=selected?.recordedPresentation?states.get(selected.id):undefined;
 // All controls and outbound student navigation are inert, even if actual work could be submitted.
 const lessonState=raw?{...raw,canStartAssessment:false,canSubmitHomework:false,canComplete:false,nextLesson:raw.nextLesson?{...raw.nextLesson,available:false}:null}:null;
 const lessonIds=lessons.filter(l=>l.assigned&&l.published);const completeCount=lessonIds.filter(l=>l.completed).length;
 const stageLessons=current?lessonIds.filter(l=>l.moduleId===current.moduleId):[];
 const masteredConcepts=[...new Map([...states.entries()].flatMap(([lessonId,state])=>Object.entries(state.attempts.at(-1)?.mastery??{}).filter(([,v])=>v).map(([key])=>{const concept=state.attempts.at(-1)?.questions.find(q=>q.id===key)?.concept;return [`${lessonId}:${concept??key}`,{lessonId,concept:concept??key,label:state.lesson.concepts.find(c=>c.id===concept)?.label??'Verified lesson concept'}] as const;}))).values()];
 return {readOnly:true as const,student:{id:u.id,name:u.name,email:u.email,lifecycle:u.lifecycle_status},access,placement:learningPath?.path?.overall??legacy?.instructorLevel??null,learningPath,assignments:assigned,lessons,lessonState,selectedLessonId:selected?.id??null,summary:{currentStage:current?.stage??current?.moduleTitle??null,currentLesson:current?.title??null,nextAvailableLesson:next?{id:next.id,title:next.title}:null,completed:completeCount,total:lessonIds.length,progressPercent:lessonIds.length?Math.round(completeCount/lessonIds.length*100):0,stageCompleted:stageLessons.filter(l=>l.completed).length,stageTotal:stageLessons.length,masteredConcepts,homeworkAwaitingReview:lessons.filter(l=>l.homeworkStatus==='submitted').length,remediationRequired:lessons.filter(l=>l.remediationRequired).length,instructorReview:lessons.filter(l=>l.reviewRequired).length}};
}
