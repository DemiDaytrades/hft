import test from 'node:test';import assert from 'node:assert/strict';import Module from 'node:module';
import {costFixture} from './classroom/testing/request-cost';
const f=costFixture();let actor='host';const load=(Module as any)._load;
(Module as any)._load=function(name:string,...args:any[]){
 if(name==='@opennextjs/cloudflare')return{getCloudflareContext:()=>({env:{DB:f.probe.db}})};
 if(name==='./auth'||name==='@/lib/auth')return{ROLES:{admin:'admin',student:'student'},getAuth:()=>({api:{getSession:async()=>({user:{id:actor,role:'admin'}})}})};
 return load.call(this,name,...args);
};
const dal=require('./dal');
test('API account lifecycle, password, membership and current role use one fresh selective account read',async()=>{
 for(const id of ['host','student-1']){actor=id;f.probe.reset();const user=await dal.requireMemberApiUser(new Headers());assert.equal(user.role,id==='host'?'admin':'student');assert.equal(f.probe.calls,1);assert.ok(!f.probe.entries.some(e=>/SELECT \*/.test(e.sql)));}
});
test('request reuse never caches entitlement or forced-password/lifecycle state into the next request',async()=>{
 actor='student-1';await dal.requireMemberApiUser(new Headers());
 for(const [column,value] of [['must_change_password',1],['lifecycle_status','DEACTIVATED'],['subscriptionStatus','canceled']] as const){
  f.sqlite.prepare('UPDATE user SET '+column+'=? WHERE id=?').run(value,actor);await assert.rejects(dal.requireMemberApiUser(new Headers()),(e:any)=>e.status===403);
  f.sqlite.prepare("UPDATE user SET must_change_password=0,lifecycle_status='ACTIVE',subscriptionStatus='active' WHERE id=?").run(actor);
 }
});
