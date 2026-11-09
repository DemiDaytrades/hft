import {requireMemberApiUser} from '@/lib/dal';
import {getIntakeV2Db} from '@/lib/student-intake-v2/service';
import {instructorCurriculum,instructorStudents,inspectLesson,studentAcademyView} from '@/lib/academy/instructor/service';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const user=await requireMemberApiUser(request.headers);if(user.role!=='admin')throw Object.assign(Error('Forbidden'),{status:403});const db=getIntakeV2Db(),q=new URL(request.url).searchParams;const result=q.get('studentId')?await studentAcademyView(db,user.id,q.get('studentId')!,q.get('lessonId')??undefined):q.get('lessonId')?await inspectLesson(db,user.id,q.get('lessonId')!):q.get('students')?await instructorStudents(db,user.id):await instructorCurriculum(db,user.id);return Response.json(result,{headers:{'Cache-Control':'private, no-store'}});}catch(e){return Response.json({error:e instanceof Error?e.message:'Unable to load Academy.'},{status:(e as {status?:number}).status??400,headers:{'Cache-Control':'private, no-store'}});}}
// No mutation handler. Next returns 405 for POST/PUT/PATCH/DELETE.
