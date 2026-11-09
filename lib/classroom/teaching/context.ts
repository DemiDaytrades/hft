import {schoolTeachingContext,schoolSessionGuide} from '../../academy/school/teaching';
import {teachingAccess} from './access';
import {interactiveLesson} from '../../academy/learning/policy';
type Row=Record<string,any>;
/** Educational context only: deliberately queries no intake/consultation/financial tables. */
export async function teachingContext(db:D1Database,actor:string,sid:string){
 const {snapshot}=await teachingAccess(db,actor,sid,true);
 const session=await db.prepare('SELECT lesson_id,start_at,end_at FROM teaching_session WHERE id=?').bind(sid).first<Row>();
 const lesson=session?.lesson_id?await db.prepare("SELECT l.*,m.title AS module_title FROM academy_lesson l JOIN academy_module m ON m.id=l.module_id JOIN academy_course c ON c.id=m.course_id WHERE l.id=? AND l.status='published' AND m.status='published' AND c.status='published'").bind(session.lesson_id).first<Row>():null;
 const doc=lesson?interactiveLesson(lesson.content):null;
 const school=await schoolSessionGuide(db,actor,sid,session?.lesson_id);
 const students=await Promise.all(snapshot.participants.filter(p=>p.role==='student'&&!p.removed).map(async p=>{
  const path=await db.prepare("SELECT v.id,v.version,v.student_json FROM learning_path_series s JOIN learning_path_version v ON v.id=s.current_version_id WHERE s.student_id=? AND v.status='APPROVED'").bind(p.id).first<Row>();
  const previous=(await db.prepare("SELECT l.id,l.title,p.completed_at FROM student_lesson_progress p JOIN academy_lesson l ON l.id=p.lesson_id WHERE p.user_id=? AND p.status='completed' ORDER BY p.completed_at DESC LIMIT 1").bind(p.id).all<Row>()).results[0]??null;
  const homework=(await db.prepare('SELECT s.status,s.approved,s.reviewed_at,a.title FROM student_assignment_submission s JOIN academy_assignment a ON a.id=s.assignment_id WHERE s.user_id=? ORDER BY s.submitted_at DESC LIMIT 3').bind(p.id).all<Row>()).results;
  return {id:p.id,name:p.name,school:school?.bound?await schoolTeachingContext(db,actor,p.id,sid):null,approvedPath:path?{id:path.id,version:path.version,studentView:path.student_json?JSON.parse(path.student_json):null}:null,previousLesson:previous,homework};
 }));
 return {title:snapshot.title,durationMinutes:session?(Date.parse(session.end_at)-Date.parse(session.start_at))/60000:null,lesson:lesson?{id:lesson.id,title:lesson.title,module:lesson.module_title,stage:doc?.stage??null}:null,school:school?{bound:school.bound,available:school.available}:null,guide:school?.guide??(doc?{purpose:doc.purpose,concepts:doc.concepts,outline:doc.steps.map(s=>({title:s.title,paragraphs:s.paragraphs,examples:s.reveals?.map(r=>({title:r.title,text:r.text,example:r.example}))??[],questions:s.activities?.map(a=>({prompt:a.prompt,concept:a.concept}))??[]})),demonstrations:null,misconceptions:null,wrapUp:null}:null),students};
}
