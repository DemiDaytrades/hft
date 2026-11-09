import {mintControlTicket,signControlRequest} from './control-auth';
import type {ClassroomEnvironment} from './environment';
import type {ClassroomSnapshot} from './contracts';
export async function realtimeAdmission(env:ClassroomEnvironment,snapshot:ClassroomSnapshot){
 const connection=snapshot.participants.find(p=>p.id===snapshot.selfId)?.connectionId;
 if(!env.CLASSROOM_CONTROL_SECRET||!env.CLASSROOM_CONTROL_URL||!connection)return undefined;
 const url=new URL(env.CLASSROOM_CONTROL_URL);const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
 if(url.username||url.password||url.search||url.hash||(!local&&url.protocol!=='wss:')||(local&&!['ws:','wss:'].includes(url.protocol)))throw new Error('Invalid classroom control configuration.');
 url.pathname='/classroom/'+encodeURIComponent(snapshot.sessionId);
 return {url:url.toString(),ticket:await mintControlTicket(env.CLASSROOM_CONTROL_SECRET,{actorId:snapshot.selfId,sessionId:snapshot.sessionId,connectionId:connection})};
}
export async function publishClassroom(env:ClassroomEnvironment,sessionId:string){
 if(!env.CLASSROOM_HUB||!env.CLASSROOM_CONTROL_SECRET)return;
 const path='/internal/publish',body=JSON.stringify({sessionId});
 const r=await env.CLASSROOM_HUB.fetch('https://classroom.internal'+path,{method:'POST',headers:{'Content-Type':'application/json',...await signControlRequest(env.CLASSROOM_CONTROL_SECRET,'POST',path,body)},body});
 if(!r.ok)throw new Error('Classroom realtime notification pending.');
}
