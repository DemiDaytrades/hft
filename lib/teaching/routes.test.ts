import test from 'node:test';import assert from 'node:assert/strict';import Module from 'node:module';import {fixtureDb} from '../financial-plan/testing/db';
const f=fixtureDb();let id='a',denied=false,baseUrl='http://localhost:3000';for(const [uid,role] of [['a','student'],['b','student'],['host','admin']])f.sqlite.prepare("INSERT INTO user(id,name,email,role,createdAt,updatedAt,subscriptionStatus,lifecycle_status) VALUES(?,?,?,?,?,?,'active','ACTIVE')").run(uid,uid,uid+'@example.invalid',role,'2026-11-07','2026-11-07');
const load=(Module as any)._load;(Module as any)._load=function(name:string,...args:any[]){if(name==='@/lib/dal')return{requireMemberApiUser:async()=>{if(denied)throw Object.assign(new Error('Denied'),{status:403});return{id,role:id==='host'?'admin':'student'};}};if(name==='@opennextjs/cloudflare')return{getCloudflareContext:()=>({env:{DB:f.db,BETTER_AUTH_URL:baseUrl}})};return load.call(this,name,...args);};
let api:any;try{api=require('../../app/api/teaching/route');}catch(e:any){if(e.code!=='MODULE_NOT_FOUND')throw e;}
test('teaching API authenticates, forbids cross-origin writes and never trusts forged student/instructor IDs',async()=>{
 assert.equal(typeof api?.GET,'function');let r=await api.GET(new Request('http://localhost:3000/api/teaching?studentId=b'));assert.equal(r.status,200);assert.equal((await r.json()).userId,'a');assert.equal(r.headers.get('Cache-Control'),'private, no-store');
 const post=(body:any,origin='http://localhost:3000')=>api.POST(new Request('http://localhost:3000/api/teaching',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({requestKey:crypto.randomUUID(),...body})}));
 assert.equal((await post({action:'configure'},'https://evil.invalid')).status,403);assert.equal((await post({action:'configure',instructorId:'host',studentId:'b'})).status,403);
 id='host';r=await post({action:'configure',timezone:'America/Chicago',durationMin:60,bufferMin:15,requestHours:12,weeklyAllowance:1});assert.equal(r.status,200);
 baseUrl='http://127.0.0.1:3004';
 const forwarded=new Request('http://localhost:3004/api/teaching',{method:'POST',headers:{origin:baseUrl,'content-type':'application/json','x-forwarded-host':'evil.invalid'},body:JSON.stringify({action:'availability',dayOfWeek:1,startTime:'09:00',endTime:'17:00',requestKey:crypto.randomUUID()})});
 assert.equal((await api.POST(forwarded)).status,200,'trusted configured origin must survive OpenNext internal host reconstruction');
 const forgedOrigin=new Request('http://localhost:3004/api/teaching',{method:'POST',headers:{origin:'https://evil.invalid','content-type':'application/json','x-forwarded-host':'evil.invalid'},body:'{}'});assert.equal((await api.POST(forgedOrigin)).status,403);
 baseUrl='http://localhost:3000';
 denied=true;assert.equal((await api.GET(new Request('http://localhost:3000/api/teaching'))).status,403);denied=false;
 id='a';f.sqlite.exec("UPDATE user SET lifecycle_status='DEACTIVATED' WHERE id='a'");assert.equal((await api.GET(new Request('http://localhost:3000/api/teaching'))).status,403);f.sqlite.close();
});
