import {getCloudflareContext} from '@opennextjs/cloudflare';
import {requireMemberApiUser} from '@/lib/dal';
import {teachingCommand,teachingSnapshot} from '@/lib/teaching/service';
export const dynamic='force-dynamic';
const reply=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
function error(e:unknown){const value=e as Error&{status?:number};const status=value.status??500;return reply({error:status>=500?'Unable to load weekly lessons.':value.message},status);}
export async function GET(request:Request){try{const user=await requireMemberApiUser(request.headers);const url=new URL(request.url);return reply(await teachingSnapshot(getCloudflareContext().env.DB,user.id,url.searchParams.get('date')??undefined,url.searchParams.get('sessionId')??undefined));}catch(e){return error(e);}}
export async function POST(request:Request){try{
 // OpenNext may reconstruct an internal hostname. Trust the configured app
 // origin, never caller-controlled Host/X-Forwarded-Host headers.
 const origin=request.headers.get('origin');const expectedOrigin=new URL(getCloudflareContext().env.BETTER_AUTH_URL).origin;if(!origin||origin!==expectedOrigin)return reply({error:'Same-origin request required.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'JSON required.'},415);
 const user=await requireMemberApiUser(request.headers);const raw=await request.text();if(raw.length>10000)return reply({error:'Request too large.'},413);
 let body;try{body=JSON.parse(raw);}catch{return reply({error:'Invalid JSON.'},400);}if(!body||typeof body!=='object'||Array.isArray(body))return reply({error:'Invalid command.'},400);
 return reply(await teachingCommand(getCloudflareContext().env.DB,user.id,body));
}catch(e){return error(e);}}
