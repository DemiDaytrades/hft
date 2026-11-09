import {getCloudflareContext} from '@opennextjs/cloudflare';
import {requireMemberApiUser} from '@/lib/dal';
import {classroomChatSince} from '@/lib/classroom/service';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{sessionId:string}>}){
 try{const actor=await requireMemberApiUser(request.headers),{sessionId}=await params,raw=new URL(request.url).searchParams.get('after')??'0';
 if(!/^\d{1,15}$/.test(raw))return Response.json({error:'Invalid history cursor'},{status:400});
 const messages=await classroomChatSince(getCloudflareContext().env.DB,actor.id,sessionId,Number(raw));
 return Response.json({messages,nextCursor:messages.at(-1)?.id??Number(raw),hasMore:messages.length===100},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){return Response.json({error:(e as Error).message},{status:(e as {status?:number}).status??500,headers:{'Cache-Control':'private, no-store'}});}
}
