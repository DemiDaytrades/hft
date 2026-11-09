import test from 'node:test';import assert from 'node:assert/strict';import Module from 'node:module';
let invalidated=false;const load=(Module as any)._load;
(Module as any)._load=function(name:string,...args:any[]){if(name==='@/lib/dal')return {requireMemberApiUser:async()=>({id:'host',role:'admin'})};if(name==='@opennextjs/cloudflare')return{getCloudflareContext:()=>({env:{DB:{},BETTER_AUTH_URL:'http://localhost:3006'}})};if(name==='@/lib/student-lifecycle')return{changeLifecycle:async()=>({status:'DEACTIVATED'})};if(name==='@/lib/classroom/service')return{invalidateClassroomUser:async(_d:unknown,_p:unknown,id:string)=>{assert.equal(id,'student');invalidated=true;}};if(name==='@/lib/classroom/livekit')return{createLiveKitProvider:()=>({configured:false})};return load.call(this,name,...args);};
const api=require('../../app/api/admin/student-lifecycle/route');
test('successful deactivation immediately invokes classroom revocation after lifecycle commit',async()=>{
 const r=await api.POST(new Request('http://localhost:3006/api/admin/student-lifecycle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentId:'student',action:'deactivate'})}));assert.equal(r.status,200);assert.equal(invalidated,true);
});
