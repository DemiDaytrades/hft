import {getCloudflareContext} from '@opennextjs/cloudflare';
import {requireMemberApiUser} from '@/lib/dal';
import {teachingView,instructorTeachingView,teachingCommand} from '@/lib/classroom/teaching/service';
import {teachingContext} from '@/lib/classroom/teaching/context';
import {prepareHandoff,saveFollowup,approveFollowup,reviewFollowup} from '@/lib/classroom/teaching/handoff';
import {reviewActivityResponse} from '@/lib/classroom/teaching/evidence';
import {teachingAccess} from '@/lib/classroom/teaching/access';
import {teachingBody,teachingJson as json,teachingError as error} from '@/lib/classroom/teaching/http';
import {publishClassroom} from '@/lib/classroom/transport';
export const dynamic='force-dynamic';
type Context={params:Promise<{sessionId:string}>};
export async function GET(request:Request,context:Context){try{
 const actor=await requireMemberApiUser(request.headers),env=getCloudflareContext().env,{sessionId}=await context.params;
 if(new URL(request.url).searchParams.get('instructor')==='1')return json({panel:await instructorTeachingView(env.DB,actor.id,sessionId),context:await teachingContext(env.DB,actor.id,sessionId),handoff:await prepareHandoff(env.DB,actor.id,sessionId)});
 return json(await teachingView(env.DB,actor.id,sessionId));
}catch(e){return error(e);}}
export async function POST(request:Request,context:Context){try{
 const env=getCloudflareContext().env,input=await teachingBody(request,env.BETTER_AUTH_URL),actor=await requireMemberApiUser(request.headers),{sessionId}=await context.params;
 if(['saveFollowup','approveFollowup','reviewTask','reviewResponse'].includes(input.action)){
  await teachingAccess(env.DB,actor.id,sessionId,true);
  if(input.action==='saveFollowup')await saveFollowup(env.DB,actor.id,sessionId,input.studentId,input.content);
  if(input.action==='approveFollowup')await approveFollowup(env.DB,actor.id,sessionId,input.followupId);
  if(input.action==='reviewTask'){
   const row=await env.DB.prepare('SELECT 1 FROM classroom_followup_submission s JOIN classroom_followup f ON f.id=s.followup_id WHERE s.id=? AND f.session_id=?').bind(input.submissionId,sessionId).first();if(!row)return json({error:'Task unavailable.'},404);
   await reviewFollowup(env.DB,actor.id,input.submissionId,input.decision,input.feedback);
  }
  if(input.action==='reviewResponse')await reviewActivityResponse(env.DB,actor.id,sessionId,input.runId,input.studentId,input.decision,input.feedback);
  return json({ok:true});
 }
 const result=await teachingCommand(env.DB,actor.id,sessionId,input);
 try{await publishClassroom(env,sessionId);}catch{/* Durable state remains authoritative; polling recovers. */}
 return json(result);
}catch(e){return error(e);}}
