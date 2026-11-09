import test from 'node:test';import assert from 'node:assert/strict';import Module from 'node:module';
let denied=true;const load=(Module as any)._load;(Module as any)._load=function(name:string,...args:any[]){if(name==='@/lib/dal')return{requireMemberApiUser:async()=>{if(denied)throw Object.assign(new Error('Unauthorized'),{status:401});return{id:'a',role:'student'};}};if(name==='@opennextjs/cloudflare')return{getCloudflareContext:()=>({env:{BETTER_AUTH_URL:'http://localhost:3006'}})};return load.call(this,name,...args);};
let api:any;try{api=require('../../app/api/classroom/[sessionId]/route');}catch(e:any){if(e.code!=='MODULE_NOT_FOUND')throw e;}
test('classroom routes reject anonymous access and forged origins without a database or provider call',async()=>{
 assert.equal(typeof api?.GET,'function');const context={params:Promise.resolve({sessionId:'room'})};assert.equal((await api.GET(new Request('http://localhost:3006/api/classroom/room'),context)).status,401);
 const post=(origin:string)=>api.POST(new Request('http://localhost:3006/api/classroom/room',{method:'POST',headers:{origin,'content-type':'application/json'},body:'{}'}),context);
 assert.equal((await post('https://evil.invalid')).status,403);assert.equal((await post('http://localhost:3006')).status,401);
});
