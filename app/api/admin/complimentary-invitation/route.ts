import {requireMemberApiUser} from '@/lib/dal';
import {getCloudflareContext} from '@opennextjs/cloudflare';
import {getComplimentaryInvitationStatus,resendComplimentaryInvitation} from '@/lib/complimentary-invitation';
import {hitRateLimit} from '@/lib/auth-rate-limit-simple';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
const error=(e:unknown)=>json({error:e instanceof Error?e.message:'Invitation request failed.'},(e as {status?:number})?.status??400);
async function staff(request:Request){const user=await requireMemberApiUser(request.headers);if(user.role!=='admin')throw Object.assign(new Error('Forbidden'),{status:403});return {userId:user.id,role:'admin'};}
export async function GET(request:Request){try{const actor=await staff(request);return json(await getComplimentaryInvitationStatus(getCloudflareContext().env.DB,actor,new URL(request.url).searchParams.get('email')??''));}catch(e){return error(e);}}
export async function POST(request:Request){try{
 const actor=await staff(request);if(hitRateLimit(`comp-invite:${actor.userId}`,20,60000))return json({error:'Too many invitation requests. Try again shortly.'},429);
 const text=await request.text();if(text.length>4000)return json({error:'Request too large'},413);
 const input=JSON.parse(text);return json(await resendComplimentaryInvitation(getCloudflareContext().env.DB,actor,input));
}catch(e){return error(e);}}
