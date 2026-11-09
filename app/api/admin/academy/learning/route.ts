import { requireMemberApiUser } from "@/lib/dal";
import { getInstructorLearningState, instructorAction } from "@/lib/academy/learning/service";
export const dynamic='force-dynamic';
const error=(e:unknown)=>Response.json({error:e instanceof Error?e.message:'Review failed.'},{status:(e as {status?:number})?.status??400});
export async function GET(request:Request) {
  try {
    const user=await requireMemberApiUser(request.headers);
    if(user.role!=='admin')return Response.json({error:'Forbidden'},{status:403});
    const params=new URL(request.url).searchParams,studentId=params.get('studentId'),lessonId=params.get('lessonId');
    if(!studentId||!lessonId)return Response.json({error:'studentId and lessonId required'},{status:400});
    return Response.json(await getInstructorLearningState(user.id,studentId,lessonId),{headers:{'Cache-Control':'private, no-store'}});
  }catch(e){return error(e);}
}
export async function POST(request:Request) {
  try {
    const user=await requireMemberApiUser(request.headers);
    if(user.role!=='admin')return Response.json({error:'Forbidden'},{status:403});
    const text=await request.text();if(text.length>100000)return Response.json({error:'Request too large'},{status:413});
    const input=JSON.parse(text);
    if(typeof input.studentId!=='string'||typeof input.lessonId!=='string')return Response.json({error:'studentId and lessonId required'},{status:400});
    return Response.json(await instructorAction(user.id,input.studentId,input.lessonId,input),{headers:{'Cache-Control':'private, no-store'}});
  }catch(e){return error(e);}
}
