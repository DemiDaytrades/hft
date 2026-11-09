import {teachingView,teachingCommand,closeEndedTeaching} from '../../../lib/classroom/teaching/service';
import {classroomSnapshot,classroomCommand,reconcileClassroom} from '../../../lib/classroom/service';
import {verifyControlTicket,verifyControlRequest,type ControlClaims} from '../../../lib/classroom/control-auth';
import {createLiveKitProvider} from '../../../lib/classroom/livekit';
import type {ClassroomEnvironment} from '../../../lib/classroom/environment';
import type {ClassroomCommand,ClassroomSnapshot} from '../../../lib/classroom/contracts';
interface Env extends ClassroomEnvironment {CLASSROOM_ROOMS:DurableObjectNamespace;CLASSROOM_CONTROL_SECRET:string;HFT_APP?:Fetcher}
const reply=(v:unknown,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'private, no-store'}});
export async function consumeControlNonce(db:D1Database,nonce:string,expires:number){
 await db.batch([db.prepare('DELETE FROM classroom_control_nonce WHERE expires_at<?').bind(Math.floor(Date.now()/1000)),db.prepare('INSERT INTO classroom_control_nonce(nonce,expires_at) VALUES(?,?)').bind(nonce,expires)]);
}
const roomPath=/^\/classroom\/([A-Za-z0-9_-]{1,200})$/;
function ticketFrom(r:Request){return (r.headers.get('Sec-WebSocket-Protocol')??'').split(',').map(x=>x.trim()).find(x=>x!=='hft-classroom')??'';}
export default {async fetch(request:Request,env:Env):Promise<Response>{
 try{const path=new URL(request.url).pathname;
 if(path==='/internal/publish'){
  if(request.method!=='POST')return reply({error:'Method not allowed'},405);const body=await request.text();if(body.length>2048)return reply({error:'Request too large'},413);
  if(!await verifyControlRequest(env.CLASSROOM_CONTROL_SECRET,'POST',path,body,request.headers))return reply({error:'Unauthorized'},401);
  await consumeControlNonce(env.DB,request.headers.get('x-hft-control-nonce')!,Math.floor(Date.now()/1000)+120);
  const data=JSON.parse(body);if(typeof data.sessionId!=='string'||!/^[A-Za-z0-9_-]{1,200}$/.test(data.sessionId))return reply({error:'Invalid session'},400);
  return await env.CLASSROOM_ROOMS.get(env.CLASSROOM_ROOMS.idFromName(data.sessionId)).fetch(new Request(request,{body}));
 }
 const match=path.match(roomPath);
 if(!match||request.headers.get('Upgrade')?.toLowerCase()!=='websocket')return env.HFT_APP?env.HFT_APP.fetch(request):reply({error:'Not found'},404);
 if(request.headers.get('Origin')!==new URL(env.BETTER_AUTH_URL).origin)return reply({error:'Forbidden origin'},403);
 if(request.headers.get('Upgrade')?.toLowerCase()!=='websocket')return reply({error:'WebSocket required'},426);
 try{await verifyControlTicket(env.CLASSROOM_CONTROL_SECRET,ticketFrom(request),match[1]);}catch{return reply({error:'Fresh classroom admission required'},401);}
 return env.CLASSROOM_ROOMS.get(env.CLASSROOM_ROOMS.idFromName(match[1])).fetch(request);
 }catch{return reply({error:'Classroom control unavailable'},503);}
}};
/** One object per existing teaching UUID. Only control/chat metadata travels here. */
export class ClassroomRoom {
 private queue:Promise<unknown>=Promise.resolve();
 constructor(private state:DurableObjectState,private env:Env){}
 private serial<T>(f:()=>Promise<T>):Promise<T>{const p=this.queue.then(f);this.queue=p.catch(()=>undefined);return p;}
 async fetch(request:Request){return this.serial(async()=>{
  const url=new URL(request.url),match=url.pathname.match(roomPath);
  if(match){
   const claim=await verifyControlTicket(this.env.CLASSROOM_CONTROL_SECRET,ticketFrom(request),match[1]);
   const snapshot=await classroomSnapshot(this.env.DB,claim.actorId,claim.sessionId);this.validateLease(snapshot,claim);
   await consumeControlNonce(this.env.DB,claim.nonce,claim.expiresAt);
   await this.state.storage.put('sessionId',claim.sessionId);
   for(const ws of this.state.getWebSockets()){const old=ws.deserializeAttachment() as ControlClaims;if(old?.actorId===claim.actorId)ws.close(4001,'Connection replaced');}
   const pair=new WebSocketPair();const [client,server]=Object.values(pair);this.state.acceptWebSocket(server);server.serializeAttachment(claim);
   await this.state.storage.setAlarm(Date.now()+5000);this.send(server,await this.snapshot(claim.actorId,claim.sessionId));
   return new Response(null,{status:101,webSocket:client,headers:{'Sec-WebSocket-Protocol':'hft-classroom'}});
  }
  // Only the outer authenticated service-binding endpoint routes this branch.
  const body=JSON.parse(await request.text());if(url.pathname!=='/internal/publish'||typeof body.sessionId!=='string')return reply({error:'Not found'},404);
  await this.state.storage.put('sessionId',body.sessionId);await this.broadcast(body.sessionId);await this.state.storage.setAlarm(Date.now()+5000);return reply({ok:true});
 });}
 private validateLease(s:ClassroomSnapshot,c:ControlClaims){const self=s.participants.find(p=>p.id===c.actorId);if(s.state!=='LIVE'||!self?.connected||self.removed||self.connectionId!==c.connectionId)throw new Error('Fresh classroom admission required');}
 private async snapshot(actor:string,sid:string){const s=await classroomSnapshot(this.env.DB,actor,sid);s.media={available:createLiveKitProvider(this.env).configured};s.teaching=await teachingView(this.env.DB,actor,sid);return s;}
 private send(ws:WebSocket,snapshot:ClassroomSnapshot){ws.send(JSON.stringify({type:'snapshot',snapshot}));}
 async webSocketMessage(ws:WebSocket,data:string|ArrayBuffer){await this.serial(async()=>{
  const claim=ws.deserializeAttachment() as ControlClaims;
  try{
   if(typeof data!=='string'||data.length>12000)throw new Error('Invalid control event');
   const snapshot=await this.snapshot(claim.actorId,claim.sessionId);this.validateLease(snapshot,claim);
   const raw=JSON.parse(data);if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Invalid control event');
   const input={...raw,connectionId:claim.connectionId} as ClassroomCommand;
   // Media-token issuance stays on the authenticated Next API; never broadcast tokens.
   if(['join','screenStart','screenStop'].includes(input.action))throw new Error('Use the protected media admission endpoint');
   if(raw.type==='teaching')await teachingCommand(this.env.DB,claim.actorId,claim.sessionId,{...raw.command,connectionId:claim.connectionId});
   else await classroomCommand(this.env.DB,createLiveKitProvider(this.env),claim.actorId,claim.sessionId,input);
   try{await closeEndedTeaching(this.env.DB,claim.sessionId);}catch{}
   await this.broadcast(claim.sessionId);
  }catch{ws.send(JSON.stringify({type:'error',error:'Control rejected. Refresh classroom admission.'}));}
 });}
 async webSocketClose(ws:WebSocket){await this.depart(ws);}
 async webSocketError(ws:WebSocket){await this.depart(ws);}
 private async depart(ws:WebSocket){await this.serial(async()=>{const claim=ws.deserializeAttachment() as ControlClaims;if(!claim)return;try{const s=await this.snapshot(claim.actorId,claim.sessionId);this.validateLease(s,claim);await classroomCommand(this.env.DB,createLiveKitProvider(this.env),claim.actorId,claim.sessionId,{action:'leave',connectionId:claim.connectionId,requestKey:crypto.randomUUID()});try{await closeEndedTeaching(this.env.DB,claim.sessionId);}catch{}
   await this.broadcast(claim.sessionId);}catch{/* Replacement/end/deactivation already owns closure. */}});}
 async alarm(){await this.serial(async()=>{const sid=await this.state.storage.get<string>('sessionId');if(!sid)return;await reconcileClassroom(this.env.DB,createLiveKitProvider(this.env),sid);try{await closeEndedTeaching(this.env.DB,sid);}catch{}await this.broadcast(sid);const room=await this.env.DB.prepare('SELECT state_json,cleanup_pending FROM classroom_room WHERE session_id=?').bind(sid).first<{state_json:string;cleanup_pending:number}>();if(this.state.getWebSockets().length||room?.cleanup_pending||room&&JSON.parse(room.state_json).state!=='ENDED')await this.state.storage.setAlarm(Date.now()+5000);});}
 private async broadcast(sid:string){for(const ws of this.state.getWebSockets()){const claim=ws.deserializeAttachment() as ControlClaims;try{const s=await this.snapshot(claim.actorId,sid);if(s.state==='ENDED'){this.send(ws,s);ws.close(4000,'Class ended');continue;}this.validateLease(s,claim);this.send(ws,s);}catch{ws.close(4003,'Admission revoked');}}}
}
