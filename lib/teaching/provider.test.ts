import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import {fixtureDb} from '../financial-plan/testing/db';
const {db,sqlite}=fixtureDb();
let emailResponse:any={data:{id:'resend-1'}}, emailThrow:any, smsResponse:any={sid:'twilio-1'}, smsThrow:any;
let telnyx=false, telnyxResponse:any={data:{id:'telnyx-1'}}, telnyxStatus=200, telnyxThrow:any;
const emailCalls:any[]=[], smsCalls:any[]=[], fetchCalls:any[]=[];
const load=(Module as any)._load;
(Module as any)._load=function(name:string,...args:any[]){
 if(name==='@opennextjs/cloudflare')return {getCloudflareContext:()=>({env:{DB:db,TELNYX_API_KEY:'test-only',TELNYX_FROM_NUMBER:'+12025550111'}})};
 if(name==='@/lib/communications/providers')return {isEmailConfigured:()=>true,isSmsConfigured:()=>true,isTelnyxConfigured:()=>telnyx,getTelnyx:()=>({apiKey:'test-only'}),getResend:()=>({emails:{send:async(...args:any[])=>{emailCalls.push(args);if(emailThrow)throw emailThrow;return emailResponse;}}}),getTwilio:()=>({messages:{create:async(p:any)=>{smsCalls.push(p);if(smsThrow)throw smsThrow;return smsResponse;}}})};
 return load.call(this,name,...args);
};
process.env.TWILIO_FROM_NUMBER='+12025550111';
globalThis.fetch=async(url:any,init:any)=>{fetchCalls.push({url,init});if(telnyxThrow)throw telnyxThrow;return Response.json(telnyxResponse,{status:telnyxStatus});};
const {sendEmail,sendSms}=require('../communications');
const email={to:'student@example.invalid',subject:'Lesson confirmed',html:'<p>Lesson confirmed</p>',text:'Lesson confirmed',eventType:'teaching'};
const sms={to:'+12025550123',body:'Lesson confirmed',eventType:'teaching'};
let seq=0;
function key(){return `teaching:session-1:revision-2:student-1:${++seq}`;}
function reset(){emailResponse={data:{id:'resend-1'}};emailThrow=undefined;smsResponse={sid:'twilio-1'};smsThrow=undefined;telnyx=false;telnyxStatus=200;telnyxResponse={data:{id:'telnyx-1'}};telnyxThrow=undefined;emailCalls.length=0;smsCalls.length=0;fetchCalls.length=0;}
test('teaching email uses existing Resend payload, provider idempotency and communication deduplication',async()=>{
 reset();const idempotencyKey=key();const result=await sendEmail({...email,idempotencyKey});
 assert.equal(result.status,'sent');assert.equal(result.providerMessageId,'resend-1');assert.equal(result.idempotencyKey,idempotencyKey);
 assert.equal(emailCalls[0][1].idempotencyKey,idempotencyKey);assert.equal(emailCalls[0][0].text,'Lesson confirmed');assert.deepEqual(emailCalls[0][0].to,['student@example.invalid']);
 const row=sqlite.prepare('SELECT event_type,idempotency_key,status FROM communication_log WHERE idempotency_key=?').get(idempotencyKey) as any;
 assert.deepEqual({...row},{event_type:'teaching',idempotency_key:idempotencyKey,status:'sent'});
 assert.equal((await sendEmail({...email,idempotencyKey})).status,'skipped');assert.equal(emailCalls.length,1);
});
test('teaching email marks missing IDs, network failures and 5xx uncertain; hard rejection is definite',async()=>{
 for(const outcome of ['missing','network','server','rejected']){reset();if(outcome==='missing')emailResponse={data:null,error:null};if(outcome==='network')emailThrow=new Error('timeout');if(outcome==='server')emailResponse={data:null,error:{message:'failed',statusCode:503}};if(outcome==='rejected')emailResponse={data:null,error:{message:'invalid',statusCode:422}};const result=await sendEmail({...email,idempotencyKey:key()});assert.equal(result.status,'failed');assert.equal(result.uncertain,outcome!=='rejected');}
});
test('teaching Telnyx payload returns provider ID and preserves supplied communication key',async()=>{
 reset();telnyx=true;const idempotencyKey=key();const result=await sendSms({...sms,idempotencyKey});assert.equal(result.status,'sent');assert.equal(result.providerMessageId,'telnyx-1');assert.equal(result.idempotencyKey,idempotencyKey);assert.equal(fetchCalls[0].url,'https://api.telnyx.com/v2/messages');assert.deepEqual(JSON.parse(fetchCalls[0].init.body),{to:'+12025550123',text:'Lesson confirmed',from:'+12025550111'});assert.equal(smsCalls.length,0);
});
test('uncertain teaching Telnyx outcomes never fall back to Twilio',async()=>{
 for(const outcome of ['missing','network','server']){reset();telnyx=true;if(outcome==='missing')telnyxResponse={data:{}};if(outcome==='network')telnyxThrow=new Error('timeout');if(outcome==='server')telnyxStatus=503;const result=await sendSms({...sms,idempotencyKey:key()});assert.equal(result.status,'failed');assert.equal(result.uncertain,true);assert.equal(smsCalls.length,0);}
});
test('known Telnyx rejection can use existing Twilio fallback with teaching payload',async()=>{
 reset();telnyx=true;telnyxStatus=422;const idempotencyKey=key();const result=await sendSms({...sms,idempotencyKey});assert.equal(result.status,'sent');assert.equal(result.providerMessageId,'twilio-1');assert.equal(result.idempotencyKey,idempotencyKey);assert.deepEqual(smsCalls,[{to:'+12025550123',body:'Lesson confirmed',from:'+12025550111'}]);
});
test('teaching Twilio missing IDs and unknown outcomes are uncertain; hard rejection is definite',async()=>{
 for(const outcome of ['missing','network','server','rejected']){reset();if(outcome==='missing')smsResponse={};if(outcome==='network')smsThrow=new Error('timeout');if(outcome==='server')smsThrow=Object.assign(new Error('failed'),{status:503});if(outcome==='rejected')smsThrow=Object.assign(new Error('invalid'),{status:422});const result=await sendSms({...sms,idempotencyKey:key()});assert.equal(result.status,'failed');assert.equal(result.uncertain,outcome!=='rejected');}
});

test('teaching email and Telnyx requests have finite supported abort signals',async()=>{
 reset();const originalTimeout=AbortSignal.timeout;const durations:number[]=[];
 AbortSignal.timeout=(milliseconds:number)=>{durations.push(milliseconds);return originalTimeout(milliseconds);};
 try {
  await sendEmail({...email,idempotencyKey:key()});
  assert.ok(emailCalls[0][1].signal instanceof AbortSignal);
  telnyx=true;await sendSms({...sms,idempotencyKey:key()});
  assert.ok(fetchCalls[0].init.signal instanceof AbortSignal);
  assert.deepEqual(durations,[30000,30000]);
 } finally {AbortSignal.timeout=originalTimeout;}
});
