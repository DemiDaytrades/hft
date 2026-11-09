import test from 'node:test';import assert from 'node:assert/strict';import {fixtureDb} from '../financial-plan/testing/db';
let runtime:any;try{runtime=require('../../workers/classroom/src/index');}catch(e:any){if(e.code!=='MODULE_NOT_FOUND')throw e;}
test('classroom Worker rejects unsigned internal calls, anonymous WS and wrong browser origin',async()=>{
 assert.equal(typeof runtime?.default?.fetch,'function');const env={BETTER_AUTH_URL:'http://localhost:3006',CLASSROOM_CONTROL_SECRET:'test-only-secret-of-at-least-thirty-two-chars'};
 assert.equal((await runtime.default.fetch(new Request('http://localhost/internal/publish',{method:'POST',body:'{}'}),env)).status,401);
 assert.equal((await runtime.default.fetch(new Request('http://localhost/classroom/s',{headers:{Upgrade:'websocket',Origin:'https://evil.invalid'}}),env)).status,403);
 assert.equal((await runtime.default.fetch(new Request('http://localhost/classroom/s',{headers:{Upgrade:'websocket',Origin:'http://localhost:3006'}}),env)).status,401);
});
test('single-use control nonce rejects replay even across separate requests',async()=>{
 assert.equal(typeof runtime?.consumeControlNonce,'function');const {sqlite,db}=fixtureDb();await runtime.consumeControlNonce(db,'one-ticket',Math.floor(Date.now()/1000)+30);await assert.rejects(runtime.consumeControlNonce(db,'one-ticket',Math.floor(Date.now()/1000)+30));sqlite.close();
});
test('local same-origin gateway forwards normal HFT requests but never bypasses websocket checks',async()=>{
 let forwarded=0;const env={BETTER_AUTH_URL:'http://localhost:3006',CLASSROOM_CONTROL_SECRET:'test-only-secret-of-at-least-thirty-two-chars',HFT_APP:{fetch:async()=>{forwarded++;return new Response('application');}}};
 const r=await runtime.default.fetch(new Request('http://localhost/classroom/s'),env);assert.equal(r.status,200);assert.equal(await r.text(),'application');assert.equal(forwarded,1);
 assert.equal((await runtime.default.fetch(new Request('http://localhost/classroom/s',{headers:{Upgrade:'websocket',Origin:'https://evil.invalid'}}),env)).status,403);assert.equal(forwarded,1);
});

import {signControlRequest} from './control-auth';
const publishSecret='test-only-publish-secret-of-at-least-thirty-two-chars';
async function publishRequest(body:string,headers?:Record<string,string>){return new Request('https://classroom.test/internal/publish',{method:'POST',headers:{'Content-Type':'application/json',...(headers??await signControlRequest(publishSecret,'POST','/internal/publish',body))},body});}
function publishRoom(db:D1Database,storageError?:Error){const stored=new Map<string,unknown>();const state={storage:{async put(k:string,v:unknown){if(storageError)throw storageError;stored.set(k,v);},async setAlarm(at:number){stored.set('alarm',at);}},getWebSockets(){return [];}};const object=new runtime.ClassroomRoom(state,{DB:db});let forwards=0;const forwardedBodies:string[]=[];const env={DB:db,CLASSROOM_CONTROL_SECRET:publishSecret,CLASSROOM_ROOMS:{idFromName:(s:string)=>s,get:()=>({async fetch(request:Request){forwards++;const forwarded=new Request(request);forwardedBodies.push(await forwarded.clone().text());return object.fetch(forwarded);}})}};return {env,stored,forwardedBodies,forwards:()=>forwards};}
test('signed publish crosses the DO request boundary with the exact authenticated body and rejects replay',async()=>{
 const {sqlite,db}=fixtureDb();try{const room=publishRoom(db),body=' { "sessionId" : "synthetic-forward" }\n',headers=await signControlRequest(publishSecret,'POST','/internal/publish',body);
 const response=await runtime.default.fetch(await publishRequest(body,headers),room.env);assert.equal(response.status,200);assert.deepEqual(await response.json(),{ok:true});assert.equal(room.stored.get('sessionId'),'synthetic-forward');assert.deepEqual(room.forwardedBodies,[' { "sessionId" : "synthetic-forward" }\n']);assert.equal(room.forwards(),1);
 const duplicate=await runtime.default.fetch(await publishRequest(body,headers),room.env);assert.equal(duplicate.status,503);assert.equal(room.forwards(),1);
 }finally{sqlite.close();}
});
test('async DO failure is caught as safe structured 5xx instead of escaping to a platform HTML error',async()=>{
 const {sqlite,db}=fixtureDb();try{const room=publishRoom(db,new Error('private storage details must not escape'));const response=await runtime.default.fetch(await publishRequest('{"sessionId":"synthetic-error"}'),room.env);assert.equal(response.status,503);assert.match(response.headers.get('content-type')??'',/application\/json/);assert.deepEqual(await response.json(),{error:'Classroom control unavailable'});}finally{sqlite.close();}
});
test('publish signature binds the original bytes and tampering cannot reach a DO or consume a nonce',async()=>{
 const {sqlite,db}=fixtureDb();try{const room=publishRoom(db),headers=await signControlRequest(publishSecret,'POST','/internal/publish','{"sessionId":"synthetic-auth"}');const response=await runtime.default.fetch(await publishRequest('{ "sessionId": "synthetic-auth" }',headers),room.env);assert.equal(response.status,401);assert.equal(room.forwards(),0);assert.equal(sqlite.prepare('SELECT count(*) AS n FROM classroom_control_nonce').get()!.n,0);}finally{sqlite.close();}
});
test('signed invalid session stays a safe 400 and stale authentication stays 401 before DO dispatch',async()=>{
 const {sqlite,db}=fixtureDb();try{const room=publishRoom(db);assert.equal((await runtime.default.fetch(await publishRequest('{"sessionId":"invalid/session"}'),room.env)).status,400);const body='{"sessionId":"synthetic-stale"}',headers=await signControlRequest(publishSecret,'POST','/internal/publish',body,Math.floor(Date.now()/1000)-120);assert.equal((await runtime.default.fetch(await publishRequest(body,headers),room.env)).status,401);assert.equal(room.forwards(),0);}finally{sqlite.close();}
});
