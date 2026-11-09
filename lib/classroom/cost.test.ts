import test from 'node:test';
import assert from 'node:assert/strict';
import {classroomCommand,classroomSnapshot} from './service';
import {costFixture} from './testing/request-cost';
let key=0;
const command=(f:ReturnType<typeof costFixture>,actor:string,action:string,extra:any={})=>classroomCommand(f.probe.db,f.provider,actor,'cost-room',{action,requestKey:'cost-request-'+(++key),...extra});

test('initialized authorized snapshot is one selective authoritative read and keeps private fields out',async()=>{
 const f=costFixture();await classroomSnapshot(f.db,'host','cost-room');f.probe.reset();const snapshot=await classroomSnapshot(f.probe.db,'host','cost-room');
 assert.equal(f.probe.calls,1);assert.equal(snapshot.selfId,'host');assert.ok(!JSON.stringify(snapshot).includes('subscriptionStatus'));assert.ok(!f.probe.entries.some(e=>/SELECT \* FROM user/.test(e.sql)));f.sqlite.close();
});

for(const count of [1,10])test('admission work stays bounded for '+(count+1)+' people without N+1 account reads',async()=>{
 const f=costFixture(count);await command(f,'host','start');f.probe.reset();await command(f,'host','join');
 assert.ok(f.probe.calls<=14,'join D1 calls '+f.probe.calls+' exceed 14');f.probe.reset();const screen=await command(f,'host','screenStart');
 assert.ok(f.probe.calls<=16,'screen D1 calls '+f.probe.calls+' exceed 16');assert.equal(screen.snapshot.participants.find(p=>p.id==='host')?.screenActive,true);await command(f,'host','end');f.sqlite.close();
});

test('consolidated context is refreshed after token minting rather than reused across the provider await',async()=>{
 const f=costFixture();await command(f,'host','start');let removed=0;
 f.provider.issueToken=async()=>{f.sqlite.prepare("UPDATE user SET lifecycle_status='DEACTIVATED' WHERE id='host'").run();return {token:'never-return-this',url:'wss://example.invalid'};};f.provider.remove=async()=>{removed++;};
 await assert.rejects(command(f,'host','join'));assert.ok(removed>=2,'minted credentials must be revoked after fresh authority fails');f.sqlite.close();
});

test('bulk roster authority retains complimentary expiry, enrollment and assigned-instructor rules',async()=>{
 const f=costFixture(3);await command(f,'host','start');await command(f,'student-1','join');await command(f,'student-2','join');
 f.sqlite.prepare("UPDATE user SET subscriptionStatus='canceled',complimentaryAccessExpiresAt='2000-01-01T00:00:00Z' WHERE id='student-1'").run();f.sqlite.prepare("UPDATE teaching_enrollment SET status='CANCELED' WHERE student_id='student-2'").run();
 // An authorized command must reconcile the revoked participants before returning.
 const result=await command(f,'host','grant',{targetUserId:'student-3',grants:{screen:true}});
 for(const id of ['student-1','student-2']){const p=result.snapshot.participants.find(p=>p.id===id)!;assert.equal(p.connected,false);assert.deepEqual(p.grants,{microphone:false,camera:false,screen:false});}
 await assert.rejects(command(f,'student-1','join'));await assert.rejects(command(f,'student-2','join'));await command(f,'host','end');f.sqlite.close();
});
