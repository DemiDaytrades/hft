import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import {fixtureDb} from './testing/db';
const {db,sqlite}=fixtureDb();
let user={id:'a',role:'student'},denied=false;
for(const [id,role] of [['a','student'],['b','student'],['staff','admin']])sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run(id,id,`${id}@example.invalid`,role,'2026-11-07','2026-11-07');
const load=(Module as any)._load;
(Module as any)._load=function(name:string,...args:any[]){
 if(name==='@/lib/dal')return {requireMemberApiUser:async()=>{if(denied)throw Object.assign(new Error('Membership/password gate denied'),{status:403});return user;}};
 if(name==='@opennextjs/cloudflare')return {getCloudflareContext:()=>({env:{DB:db}})};
 return load.call(this,name,...args);
};
const student=require('../../app/api/financial-plan/route'),admin=require('../../app/api/admin/financial-plan/route');
test('student endpoint uses session identity and staff endpoints reject forged student actions',async()=>{
 let r=await student.GET(new Request('https://local.invalid/api/financial-plan?studentId=b&version=draft'));
 assert.equal(r.status,200);assert.equal(await r.json(),null);assert.equal(r.headers.get('Cache-Control'),'private, no-store');
 assert.equal((await admin.GET(new Request('https://local.invalid/api/admin/financial-plan?studentId=b'))).status,403);
 for(const action of ['generate','save','review','approve','publish']){
  r=await admin.POST(new Request('https://local.invalid/api/admin/financial-plan',{method:'POST',body:JSON.stringify({action,studentId:'b',planId:'a',revision:1,role:'admin'})}));assert.equal(r.status,403);
 }
 denied=true;assert.equal((await student.GET(new Request('https://local.invalid/api/financial-plan'))).status,403);denied=false;
 user={id:'staff',role:'admin'};r=await admin.GET(new Request('https://local.invalid/api/admin/financial-plan?studentId=a'));assert.equal(r.status,200);
 sqlite.close();
});
