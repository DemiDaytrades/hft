// Deterministic structural workload; fake provider and synthetic in-memory D1 only.
// Timings are local process measurements, never Cloudflare's enforced CPU time.
require('./test-register.cjs');
const fs=require('node:fs'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.resolve(__dirname,'..'),source=path.resolve(process.argv[2]||root);
process.chdir(source);
const {classroomSnapshot,classroomCommand}=require(path.join(source,'lib/classroom/service.ts'));
const {costFixture}=require(path.join(root,'lib/classroom/testing/request-cost.ts'));
const rows=[];let request=0;
async function run(people){
 const f=costFixture(people-1);
 async function measure(label,operation){
  f.probe.reset();f.rpc.length=0;const at=performance.now(),cpu=process.cpuUsage();const result=await operation(),used=process.cpuUsage(cpu);
  const selects=f.probe.entries.filter(e=>['first','all','raw'].includes(e.method));
  rows.push({people,label,d1Calls:f.probe.calls,statements:f.probe.entries.length,uniqueSqlShapes:new Set(f.probe.entries.map(e=>e.sql)).size,duplicateReads:selects.filter(e=>e.duplicate).length,
   accountReadStatements:selects.filter(e=>/FROM user/.test(e.sql)).length,sessionReadStatements:selects.filter(e=>/FROM teaching_session/.test(e.sql)).length,roomReadStatements:selects.filter(e=>/FROM classroom_room/.test(e.sql)).length,
   decodedBytes:f.probe.decodedBytes,responseBytes:Buffer.byteLength(JSON.stringify(result)),providerOperations:[...f.rpc],localWallMs:performance.now()-at,localProcessCpuUs:used.user+used.system,
   sql:f.probe.entries});return result;
 }
 const cmd=(actor,action,extra={})=>classroomCommand(f.probe.db,f.provider,actor,'cost-room',{action,requestKey:'cost-harness-'+(++request),...extra});
 try{
  await measure('initialize',()=>classroomSnapshot(f.probe.db,'host','cost-room'));
  await measure('snapshot',()=>classroomSnapshot(f.probe.db,'host','cost-room'));
  await measure('start',()=>cmd('host','start'));
  await measure('instructor-join',()=>cmd('host','join'));
  await measure('student-join',()=>cmd('student-1','join'));
  await measure('presenter-grant',()=>cmd('host','grant',{targetUserId:'student-1',grants:{microphone:true,camera:true,screen:true}}));
  await measure('screenStart',()=>cmd('host','screenStart'));
  await measure('student-screenStart',()=>cmd('student-1','screenStart'));
  await measure('presenter-revoke',()=>cmd('host','demote',{targetUserId:'student-1'}));
  await measure('end',()=>cmd('host','end'));
 }finally{f.sqlite.close();}
}
(async()=>{await run(2);await run(11);const report={source,productionAccess:false,provider:'synthetic fake; no network',timingCaveat:'Local process CPU includes fixture/runtime overhead and is not Cloudflare CPU enforcement.',rows};if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(report,null,2));else console.log(JSON.stringify(report,null,2));})().catch(e=>{console.error(e.name+': '+e.message);process.exitCode=1;});
