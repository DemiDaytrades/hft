import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import {signDispatchRequest} from './dispatch-auth';
const secret='test-secret-32-characters-minimum-length';
const nonces=new Set<string>();let writes=0,calls=0;
const env:{DB:any;TEACHING_DELIVERY_ENABLED?:string;TEACHING_DISPATCH_SECRET?:string;BETTER_AUTH_URL:string}={BETTER_AUTH_URL:'https://example.invalid',DB:{prepare(sql:string){return {bind(...args:any[]){return {async run(){writes++;if(sql.startsWith('INSERT')){if(nonces.has(args[0]))return {meta:{changes:0}};nonces.add(args[0]);}return {meta:{changes:1}};}};}};}}};
const original=(Module as any)._load;
(Module as any)._load=function(name:string,...args:any[]){
 if(name==='@opennextjs/cloudflare')return {getCloudflareContext:()=>({env})};
 if(name==='@/lib/teaching/delivery')return {processTeachingDelivery:async(db:any,options:any)=>{calls++;assert.equal(db,env.DB);assert.equal(options.enabled,true);assert.equal(options.limit,25);assert.equal(options.baseUrl,env.BETTER_AUTH_URL);return {sent:0,skipped:0,failed:0,uncertain:0,disabled:false};}};
 if(name==='@/lib/teaching/delivery-adapter')return {deliverTeachingMessage:async()=>{throw new Error('No real provider allowed');}};
 return original.call(this,name,...args);
};
let route:any;try{route=require('../../app/api/internal/teaching-delivery/route');}catch(e:any){if(e.code!=='MODULE_NOT_FOUND')throw e;}
test('internal dispatcher is inert by default; authenticates, bounds input and rejects nonce replay before dispatch',async()=>{
 assert.equal(typeof route?.POST,'function');
 const make=async(now=Date.now(),body='{}')=>new Request('https://hft.internal/api/internal/teaching-delivery',{method:'POST',headers:await signDispatchRequest(secret,now),body});
 assert.equal((await route.GET()).status,405);
 assert.equal((await route.POST(await make())).status,503);assert.equal(writes,0);assert.equal(calls,0);
 env.TEACHING_DELIVERY_ENABLED='true';
 assert.equal((await route.POST(await make())).status,401);assert.equal(writes,0);
 env.TEACHING_DISPATCH_SECRET=secret;
 assert.equal((await route.POST(await make(Date.now()-61000))).status,401);
 const forged=await make();forged.headers.set('x-teaching-signature','0'.repeat(64));assert.equal((await route.POST(forged)).status,401);
 assert.equal((await route.POST(await make(Date.now(),'{"recipient":"forged"}'))).status,400);
 assert.equal((await route.POST(await make(Date.now(),' '.repeat(300)))).status,413);assert.equal(writes,0);
 const request=await make();const replay=request.clone();assert.equal((await route.POST(request)).status,200);assert.equal(calls,1);
 assert.equal((await route.POST(replay)).status,409);assert.equal(calls,1);
});
