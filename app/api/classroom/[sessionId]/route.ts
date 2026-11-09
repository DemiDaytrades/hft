import {closeEndedTeaching} from '@/lib/classroom/teaching/service';
import {getCloudflareContext} from '@opennextjs/cloudflare';
import {requireMemberApiUser} from '@/lib/dal';
import {classroomSnapshot,classroomCommand,reconcileClassroom} from '@/lib/classroom/service';
import {createLiveKitProvider} from '@/lib/classroom/livekit';
import {realtimeAdmission,publishClassroom} from '@/lib/classroom/transport';
import type {ClassroomEnvironment} from '@/lib/classroom/environment';
export const dynamic='force-dynamic';
type Context={params:Promise<{sessionId:string}>};
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
function error(e:unknown){const v=e as Error&{status?:number};return json({error:(v.status??500)>=500?'Classroom is temporarily unavailable.':v.message},v.status??500);}
export async function GET(request:Request,context:Context){try{
 const actor=await requireMemberApiUser(request.headers),env=getCloudflareContext().env as ClassroomEnvironment,{sessionId}=await context.params;
 // Authorize before reconciliation can initialize any room or read its roster.
 await classroomSnapshot(env.DB,actor.id,sessionId);
 const provider=createLiveKitProvider(env);await reconcileClassroom(env.DB,provider,sessionId);
 try{await closeEndedTeaching(env.DB,sessionId);}catch{/* Retryable teaching cleanup does not block terminal security. */}
 const snapshot=await classroomSnapshot(env.DB,actor.id,sessionId);snapshot.media={available:provider.configured,...(!provider.configured?{reason:'Live media is not configured. HFT classroom controls are available for local verification.'}:{})};return json(snapshot);
}catch(e){return error(e);}}
export async function POST(request:Request,context:Context){try{
 const env=getCloudflareContext().env as ClassroomEnvironment;
 if(request.headers.get('origin')!==new URL(env.BETTER_AUTH_URL).origin)return json({error:'Same-origin request required.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'JSON required.'},415);
 const actor=await requireMemberApiUser(request.headers),{sessionId}=await context.params;
 const raw=await request.text();if(raw.length>12000)return json({error:'Request too large.'},413);
 let input;try{input=JSON.parse(raw);}catch{return json({error:'Invalid JSON.'},400);}if(!input||typeof input!=='object'||Array.isArray(input))return json({error:'Invalid classroom command.'},400);
 const result=await classroomCommand(env.DB,createLiveKitProvider(env),actor.id,sessionId,input);
 if(result.snapshot.state==='ENDED')try{await closeEndedTeaching(env.DB,sessionId);}catch{/* Recover on next authorized read. */}
 let realtime;if(input.action==='join')realtime=await realtimeAdmission(env,result.snapshot);
 // The state commit is authoritative even if a notification transport is down.
 let realtimePending=false;try{if(input.action!=='heartbeat')await publishClassroom(env,sessionId);}catch{realtimePending=true;}
 return json({...result,...(realtime?{realtime}:{}),...(realtimePending?{realtimePending}: {})});
}catch(e){return error(e);}}
