import test from 'node:test';
import assert from 'node:assert/strict';
let auth:any;try{auth=require('./control-auth');}catch(e:any){if(e.code!=='MODULE_NOT_FOUND')throw e;}
const secret='local-test-only-32-plus-characters-secret';
test('control tickets are short lived, tamper resistant and bound to room/actor/connection',async()=>{
 assert.equal(typeof auth?.mintControlTicket,'function');
 const token=await auth.mintControlTicket(secret,{actorId:'a',sessionId:'s',connectionId:'c'},1000);
 const claim=await auth.verifyControlTicket(secret,token,'s',1010);assert.equal(claim.actorId,'a');assert.equal(claim.connectionId,'c');assert.ok(claim.nonce);
 await assert.rejects(auth.verifyControlTicket(secret,token,'other',1010));await assert.rejects(auth.verifyControlTicket(secret,token+'x','s',1010));await assert.rejects(auth.verifyControlTicket(secret,token,'s',1031));await assert.rejects(auth.verifyControlTicket('short',token,'s',1010));
});
test('internal control authentication binds method path body nonce and timestamp',async()=>{
 assert.equal(typeof auth?.signControlRequest,'function');const headers=await auth.signControlRequest(secret,'POST','/internal/publish','{"sessionId":"s"}',1000,'nonce-test');
 assert.equal(await auth.verifyControlRequest(secret,'POST','/internal/publish','{"sessionId":"s"}',new Headers(headers),1010),true);
 assert.equal(await auth.verifyControlRequest(secret,'POST','/internal/publish','{"sessionId":"other"}',new Headers(headers),1010),false);assert.equal(await auth.verifyControlRequest(secret,'GET','/internal/publish','{"sessionId":"s"}',new Headers(headers),1010),false);assert.equal(await auth.verifyControlRequest(secret,'POST','/internal/publish','{"sessionId":"s"}',new Headers(headers),1061),false);
});
