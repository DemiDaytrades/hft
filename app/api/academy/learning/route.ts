import { requireMemberApiUser } from "@/lib/dal";
import { getLearningState, learningAction } from "@/lib/academy/learning/service";

export const dynamic="force-dynamic";
const error=(e:unknown)=>Response.json({error:e instanceof Error?e.message:'Unable to load lesson.'},{status:(e as {status?:number})?.status??400});
export async function GET(request:Request) {
  try {
    const user=await requireMemberApiUser(request.headers);
    const lessonId=new URL(request.url).searchParams.get('lessonId');
    if(!lessonId)return Response.json({error:'lessonId required'},{status:400});
    return Response.json(await getLearningState(user.id,lessonId),{headers:{'Cache-Control':'private, no-store'}});
  } catch(e){return error(e);}
}
export async function POST(request:Request) {
  try {
    const user=await requireMemberApiUser(request.headers);
    if(Number(request.headers.get('content-length')??0)>100000)return Response.json({error:'Request too large'},{status:413});
    const text=await request.text();if(text.length>100000)return Response.json({error:'Request too large'},{status:413});
    const input=JSON.parse(text);
    if(typeof input.lessonId!=='string')return Response.json({error:'lessonId required'},{status:400});
    return Response.json(await learningAction(user.id,input.lessonId,input),{headers:{'Cache-Control':'private, no-store'}});
  } catch(e){return error(e);}
}
