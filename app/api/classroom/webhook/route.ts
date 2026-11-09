import {getCloudflareContext} from '@opennextjs/cloudflare';
import {createLiveKitProvider} from '@/lib/classroom/livekit';
import {processClassroomWebhook} from '@/lib/classroom/webhooks';
import type {ClassroomEnvironment} from '@/lib/classroom/environment';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const env=getCloudflareContext().env as ClassroomEnvironment,provider=createLiveKitProvider(env);
 if(!provider.configured)return Response.json({unavailable:true},{status:503});
 const length=Number(request.headers.get('content-length')??0);if(length>262144)return Response.json({error:'Payload too large'},{status:413});
 const raw=await request.text();if(raw.length>262144)return Response.json({error:'Payload too large'},{status:413});
 try{return Response.json(await processClassroomWebhook(env.DB,provider,raw,request.headers.get('Authorization')??''),{headers:{'Cache-Control':'private, no-store'}});}catch{return Response.json({error:'Webhook rejected'},{status:401});}
}
