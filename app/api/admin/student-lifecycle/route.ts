import {invalidateClassroomUser} from '@/lib/classroom/service';
import {createLiveKitProvider} from '@/lib/classroom/livekit';
import type {ClassroomEnvironment} from '@/lib/classroom/environment';
import {requireMemberApiUser} from '@/lib/dal';
import {getCloudflareContext} from '@opennextjs/cloudflare';
import {getLifecycle,changeLifecycle,previewDeletion,requestDeletionPreview} from '@/lib/student-lifecycle';
export const dynamic='force-dynamic';
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
const error=(e:unknown)=>json({error:e instanceof Error?e.message:'Lifecycle request failed.'},(e as {status?:number})?.status??400);
async function staff(request:Request){const user=await requireMemberApiUser(request.headers);if(user.role!=='admin')throw Object.assign(new Error('Forbidden'),{status:403});return {userId:user.id,role:'admin'};}
export async function GET(request:Request){try{
 const actor=await staff(request),params=new URL(request.url).searchParams,studentId=params.get('studentId');if(!studentId)return json({error:'studentId required'},400);
 const db=getCloudflareContext().env.DB;
 return json(params.get('action')==='impact'?await previewDeletion(db,actor,studentId):await getLifecycle(db,actor,studentId));
}catch(e){return error(e);}}
export async function POST(request:Request){try{
 const actor=await staff(request),text=await request.text();if(text.length>10000)return json({error:'Request too large'},413);
 const input=JSON.parse(text);if(typeof input.studentId!=='string')return json({error:'studentId required'},400);
 const db=getCloudflareContext().env.DB;
 if(input.action==='deletion-preview')return json(await requestDeletionPreview(db,actor,input.studentId,input.confirmation));
 if(input.action!=='deactivate'&&input.action!=='reactivate')return json({error:'Permanent deletion and combined Stripe cancellation are not enabled.'},400);
 const result=await changeLifecycle(db,actor,input.studentId,input);
 // Lifecycle state commits first; admission is denied even if provider cleanup retries.
 if(input.action==='deactivate'){try{await invalidateClassroomUser(db,createLiveKitProvider(getCloudflareContext().env as ClassroomEnvironment),input.studentId);}catch{return json({...result,classroomCleanupPending:true});}}
 return json(result);
}catch(e){return error(e);}}
