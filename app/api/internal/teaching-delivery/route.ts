import {getCloudflareContext} from '@opennextjs/cloudflare';
import {verifyDispatchRequest} from '@/lib/teaching/dispatch-auth';
import {processTeachingDelivery} from '@/lib/teaching/delivery';
import {deliverTeachingMessage} from '@/lib/teaching/delivery-adapter';
export const dynamic='force-dynamic';
const reply=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(){return new Response(null,{status:405,headers:{Allow:'POST','Cache-Control':'no-store'}});}
export async function POST(request:Request){
 try{
  const env=getCloudflareContext().env as CloudflareEnv&{TEACHING_DELIVERY_ENABLED?:string;TEACHING_DISPATCH_SECRET?:string};
  if(env.TEACHING_DELIVERY_ENABLED!=='true')return reply({disabled:true},503);
  const nonce=await verifyDispatchRequest(request,env.TEACHING_DISPATCH_SECRET);
  if(!nonce)return reply({error:'Unauthorized.'},401);
  // Read a bounded stream before parsing, even if content-length is omitted or forged.
  let raw='';let bytes=0;const reader=request.body?.getReader();const decoder=new TextDecoder();
  if(reader){try{while(true){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.byteLength;if(bytes>256){await reader.cancel();return reply({error:'Request too large.'},413);}raw+=decoder.decode(chunk.value,{stream:true});}raw+=decoder.decode();}finally{reader.releaseLock();}}
  if(raw.trim()!==''&&raw.trim()!=='{}')return reply({error:'Empty dispatcher command required.'},400);
  const claim=await env.DB.prepare('INSERT INTO teaching_dispatch_nonce(nonce,created_at) VALUES(?,?) ON CONFLICT(nonce) DO NOTHING').bind(nonce,new Date().toISOString()).run();
  if(claim.meta.changes!==1)return reply({error:'Dispatcher request already used.'},409);
  await env.DB.prepare('DELETE FROM teaching_dispatch_nonce WHERE created_at < ?').bind(new Date(Date.now()-300000).toISOString()).run();
  return reply(await processTeachingDelivery(env.DB,{enabled:true,deliver:deliverTeachingMessage,baseUrl:env.BETTER_AUTH_URL,limit:25}));
 }catch{return reply({error:'Teaching dispatch unavailable.'},503);}
}
