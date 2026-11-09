import test from 'node:test';
import assert from 'node:assert/strict';
import {signDispatchRequest,verifyDispatchRequest} from './dispatch-auth';
import scheduler from '../../workers/teaching-reminders/src/index';
const secret='test-secret-32-characters-minimum-length';
test('dispatch HMAC binds method/path, rejects stale, forged, malformed and weak-secret requests',async()=>{
 const now=Date.now();const headers=await signDispatchRequest(secret,now);const request=new Request('https://hft.internal/api/internal/teaching-delivery',{method:'POST',headers});
 assert.equal(await verifyDispatchRequest(request,secret,now),headers.get('x-teaching-nonce'));
 assert.equal(await verifyDispatchRequest(request,secret,now+61000),null);
 assert.equal(await verifyDispatchRequest(request,secret,now-61000),null);
 const malformed=new Headers(headers);malformed.set('x-teaching-nonce','not-a-uuid');
 assert.equal(await verifyDispatchRequest(new Request(request.url,{method:'POST',headers:malformed}),secret,now),null);
 assert.equal(await verifyDispatchRequest(request,'another-secret-32-characters-minimum-length',now),null);
 assert.equal(await verifyDispatchRequest(new Request('https://hft.internal/other',{method:'POST',headers}),secret,now),null);
 assert.equal(await verifyDispatchRequest(new Request(request.url,{headers}),secret,now),null);
 assert.equal(await verifyDispatchRequest(request,'short',now),null);
 assert.equal(await verifyDispatchRequest(new Request(request.url,{method:'POST'}),secret,now),null);
 await assert.rejects(()=>signDispatchRequest('short',now));
});
test('scheduler defaults inert and only signs a service-binding call when explicitly enabled',async()=>{
 const requests:Request[]=[];const env={HFT_APP:{fetch:async(r:Request)=>{requests.push(r);return new Response('{}');}},TEACHING_DISPATCH_SECRET:secret};
 await scheduler.scheduled({},env);assert.equal(requests.length,0);
 await scheduler.scheduled({},{...env,TEACHING_SCHEDULER_ENABLED:'false'});assert.equal(requests.length,0);
 await scheduler.scheduled({},{...env,TEACHING_SCHEDULER_ENABLED:'true'});assert.equal(requests.length,1);
 assert.ok(await verifyDispatchRequest(requests[0],secret));assert.equal(await requests[0].text(),'{}');
 await assert.rejects(()=>scheduler.scheduled({},{...env,TEACHING_SCHEDULER_ENABLED:'true',TEACHING_DISPATCH_SECRET:'short'}));assert.equal(requests.length,1);
 assert.equal((await scheduler.fetch()).status,404);
});
