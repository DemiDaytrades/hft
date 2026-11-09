import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { ClassroomShell } from '../../components/classroom/Classroom';
import { orderedChat, visibleScreens } from '../../components/classroom/presentation';
test('classroom renders an honest awaiting-admission state without browser media', () => {
 const html = renderToStaticMarkup(<ClassroomShell sessionId="lesson-1" />);
 assert.match(html, /HFT/); assert.match(html, /classroom/i); assert.match(html, /Connecting to classroom/); assert.doesNotMatch(html, /<video/);
});
test('mobile receives only the instructor-selected screen while desktop retains all three', () => {
 const ids = ['host', 'a', 'b'];
 assert.deepEqual(visibleScreens(ids, 'a', true), ['a']);
 assert.deepEqual(visibleScreens(ids, 'a', false), ids);
});
test('chat recovery orders messages and deduplicates event identities', () => {
 const a = {id:'a', sequence:1}; const b = {id:'b',sequence:2};
 assert.deepEqual(orderedChat([b,a,b]), [a,b]);
});
test('media subscriptions match provider-prefixed identity and exclude unfocused mobile screens', async () => {
 const {subscribeMedia}=await import('../../components/classroom/media');
 const decisions:boolean[][]=[[],[]];
 const room={remoteParticipants:new Map(['alice','bob'].map((id,index)=>[`hft-${id}`,{identity:`hft-${id}`,trackPublications:new Map([['screen',{source:'screen_share',kind:'video',setSubscribed:(enabled:boolean)=>decisions[index].push(enabled)}]])}]))};
 subscribeMedia(room as never,['alice'],true);
 assert.deepEqual(decisions,[[true],[false]]);
});
test('control ticket uses WebSocket subprotocols without putting it into URL', async () => {
 const {controlSocketOptions,mediaIdentity}=await import('../../components/classroom/presentation');
 assert.equal(mediaIdentity('alice'),'hft-alice');
 assert.deepEqual(controlSocketOptions('wss://control.example/room','secret'),{url:'wss://control.example/room',protocols:['hft-classroom','secret']});
});
test('native screen unpublish releases a slot but room replacement does not', async () => {
 const {shouldReleaseScreen}=await import('../../components/classroom/media');
 assert.equal(shouldReleaseScreen('screen_share',false),true);
 assert.equal(shouldReleaseScreen('screen_share',true),false);
 assert.equal(shouldReleaseScreen('camera',false),false);
});
test('chat history recovers more than one snapshot and merges moderation updates', async () => {
 const {mergeChatHistory}=await import('../../components/classroom/presentation');
 const make=(id:number)=>({id,authorId:'a',authorName:'Alice',text:`message ${id}`,createdAt:'2026-11-08T10:00:00Z',deleted:false,pinned:false});
 const first=Array.from({length:100},(_,i)=>make(i+1));
 const next=Array.from({length:51},(_,i)=>make(i+100));
 const recovered=mergeChatHistory(mergeChatHistory(first,next),[{...make(110),deleted:true}]);
 assert.equal(recovered.length,150); assert.equal(recovered[0].id,1); assert.equal(recovered[149].id,150); assert.equal(recovered[109].deleted,true);
});
test('historical moderation triggers a full history refresh only for newly observed events', async () => {
 const {requiresHistoryRefresh,heartbeatDue}=await import('../../components/classroom/presentation');
 assert.equal(requiresHistoryRefresh([{id:12,action:'deleteChat'}],11),true);
 assert.equal(requiresHistoryRefresh([{id:12,action:'pin'}],11),true);
 assert.equal(requiresHistoryRefresh([{id:12,action:'deleteChat'}],12),false);
 assert.equal(requiresHistoryRefresh([{id:13,action:'heartbeat'}],12),false);
 assert.equal(heartbeatDue(14999,0),false);assert.equal(heartbeatDue(15000,0),true);
});
test('mobile subscribes only the focused camera when no screens are active', async () => {
 const {subscribeMedia}=await import('../../components/classroom/media');
 const decisions:boolean[][]=[[],[]];
 const room={remoteParticipants:new Map(['host','student'].map((id,index)=>[`hft-${id}`,{identity:`hft-${id}`,trackPublications:new Map([['camera',{source:'camera',kind:'video',setSubscribed:(enabled:boolean)=>decisions[index].push(enabled)}]])}]))};
 subscribeMedia(room as never,[],true,'host');
 subscribeMedia(room as never,['student'],true,'host');
 assert.deepEqual(decisions,[[true,false],[false,false]]);
});
test('authorization loss clears the room view while temporary failures keep recovery available', async () => {
 const {accessDeniedStatus}=await import('../../components/classroom/presentation');
 for(const status of [401,403,404])assert.equal(accessDeniedStatus(status),true);
 for(const status of [0,409,500,503])assert.equal(accessDeniedStatus(status),false);
 const html=renderToStaticMarkup(<ClassroomShell sessionId="lesson" snapshot={{title:"Cached private lesson",state:"LIVE"} as never} accessUnavailable><p>Cached private chat</p><button>Reconnect</button></ClassroomShell>);
 assert.match(html,/Classroom access unavailable/);assert.match(html,/Return to Academy/);assert.doesNotMatch(html,/Connecting to classroom|Cached private|Reconnect|LIVE/);
});
test('screen admission owns disconnect recovery until its pending response and replacement complete', async()=>{
 const {createMediaAdmissionCoordinator}=await import('../../components/classroom/presentation');
 const coordinator=createMediaAdmissionCoordinator();const scheduled:(()=>void)[]=[];const posts:string[]=[];let screenReserved=false;let finish!:()=>void;
 const pending=new Promise<void>(resolve=>{finish=resolve;});
 const join=()=>coordinator.execute('join',async()=>{posts.push('join');screenReserved=false;return true;});
 const screen=coordinator.execute('screenStart',async()=>{posts.push('screenStart');screenReserved=true;await pending;return true;});
 coordinator.recover(join,callback=>scheduled.push(callback));
 for(const callback of scheduled.splice(0))callback();
 await Promise.resolve();assert.equal(await join(),false);assert.deepEqual(posts,['screenStart']);assert.equal(screenReserved,true);
 finish();assert.equal(await screen,true);
 coordinator.recover(join,callback=>scheduled.push(callback));scheduled.shift()!();await Promise.resolve();
 assert.deepEqual(posts,['screenStart','join']);assert.equal(screenReserved,false);
});
test('queued disconnect recovery rechecks admission ownership and failure releases it', async()=>{
 const {createMediaAdmissionCoordinator}=await import('../../components/classroom/presentation');
 const coordinator=createMediaAdmissionCoordinator();const scheduled:(()=>void)[]=[];let joins=0;let fail!:(error:Error)=>void;
 const join=()=>coordinator.execute('join',async()=>{joins++;return true;});
 coordinator.recover(join,callback=>scheduled.push(callback));
 const pending=coordinator.execute('screenStop',()=>new Promise<boolean>((_resolve,reject)=>{fail=reject;}));
 scheduled.shift()!();await Promise.resolve();assert.equal(joins,0);
 fail(new Error('admission failed'));await assert.rejects(pending,/admission failed/);
 coordinator.recover(join,callback=>scheduled.push(callback));scheduled.shift()!();await Promise.resolve();assert.equal(joins,1);
});

test('recovery queued before a completed admission cannot later reset its screen reservation',async()=>{
 const {createMediaAdmissionCoordinator}=await import('../../components/classroom/presentation');
 const coordinator=createMediaAdmissionCoordinator();let queued!:()=>void;let joins=0;
 coordinator.recover(async()=>{joins++;},callback=>{queued=callback;});
 await coordinator.execute('screenStart',async()=>true);
 queued();await Promise.resolve();assert.equal(joins,0);
});
test('remote video attachment preserves SDK autoplay playback and detaches on cleanup',async()=>{
 const {mountMediaTrack}=await import('../../components/classroom/media');
 const original=globalThis.HTMLVideoElement;
 // Model browser autoplay: unmuting an automatically playing stream pauses it.
 class Video {autoplay=true;playsInline=false;paused=false;removed=false;private isMuted=true;get muted(){return this.isMuted;}set muted(value:boolean){this.isMuted=value;if(!value)this.paused=true;}remove(){this.removed=true;}}
 Object.defineProperty(globalThis,'HTMLVideoElement',{configurable:true,writable:true,value:Video});
 try{const video=new Video();let attached=false;let detached=false;const track={attach:()=>video,detach:(element:unknown)=>{assert.equal(element,video);detached=true;}};const container={appendChild:(element:unknown)=>{assert.equal(element,video);attached=true;}};
  const cleanup=mountMediaTrack(track as never,container as never,false);
  assert.equal(attached,true);assert.equal(video.paused,false,'remote video must retain the SDK autoplay state');assert.equal(video.muted,true);assert.equal(video.playsInline,true);
  cleanup();assert.equal(detached,true);assert.equal(video.removed,true);
 }finally{if(original===undefined)Reflect.deleteProperty(globalThis,'HTMLVideoElement');else Object.defineProperty(globalThis,'HTMLVideoElement',{configurable:true,writable:true,value:original});}
});
test('audio unlock invokes playback within the user gesture and rejected playback stays retryable',async()=>{
 const {enableClassroomAudio,AudioPlaybackControl}=await import('../../components/classroom/media');
 let inGesture=false;let attempts=0;let rejectPlayback=true;
 const room={canPlaybackAudio:false,startAudio:()=>{assert.equal(inGesture,true,'startAudio must run synchronously in the click gesture');attempts++;if(rejectPlayback)return Promise.reject(new Error('playback still blocked'));room.canPlaybackAudio=true;return Promise.resolve();}};
 const render=()=>renderToStaticMarkup(<AudioPlaybackControl room={room as never} onChange={()=>{}} onError={()=>{}}/>);
 assert.match(render(),/Enable classroom audio/);assert.equal(attempts,0,'rendering never activates playback');
 inGesture=true;const rejected=enableClassroomAudio(room as never);inGesture=false;await assert.rejects(rejected,/playback still blocked/);assert.match(render(),/Enable classroom audio/);
 rejectPlayback=false;inGesture=true;const resumed=enableClassroomAudio(room as never);inGesture=false;await resumed;assert.equal(attempts,2);assert.equal(render(),'');
});
