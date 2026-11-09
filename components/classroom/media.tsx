'use client';
import { useEffect, useRef } from 'react';
import { mediaIdentity } from './presentation';
import type { Room, Track } from 'livekit-client';
export type MediaAdmission = {url:string;token:string};
export type ClassroomMedia = {room:Room; destroy:()=>Promise<void>};
// Import only after deliberate admission in the browser, never during SSR.
export async function connectMedia(admission:MediaAdmission, onChange:()=>void, onDisconnect:()=>void, onScreenStopped:()=>void):Promise<ClassroomMedia> {
 const {Room,RoomEvent} = await import('livekit-client');
 const room = new Room({adaptiveStream:true,dynacast:true});
 let intentionalDisconnect=false;
 room.on(RoomEvent.LocalTrackUnpublished,publication=>{if(shouldReleaseScreen(publication.source,intentionalDisconnect))onScreenStopped();});
 room.on(RoomEvent.TrackSubscribed,onChange).on(RoomEvent.TrackUnsubscribed,onChange).on(RoomEvent.AudioPlaybackStatusChanged,onChange).on(RoomEvent.TrackPublished,onChange).on(RoomEvent.LocalTrackPublished,onChange).on(RoomEvent.LocalTrackUnpublished,onChange).on(RoomEvent.Disconnected,()=>{if(!intentionalDisconnect)onDisconnect();});
 // HFT re-admits through the API instead of reconnecting with a cached token.
 room.on(RoomEvent.Reconnecting,()=>{void room.disconnect();});
 await room.connect(admission.url,admission.token,{autoSubscribe:false});
 return {room,destroy:()=>{intentionalDisconnect=true;return room.disconnect();}};
}
export function subscribeMedia(room:Room, screenIds:string[], mobile:boolean, focusUserId?:string) {
 for(const participant of room.remoteParticipants.values()) for(const publication of participant.trackPublications.values()) {
  const screen = publication.source === 'screen_share';
  publication.setSubscribed(screen ? screenIds.map(mediaIdentity).includes(participant.identity) : publication.kind === 'audio' || (publication.source === 'camera'&&(!mobile||(!screenIds.length&&participant.identity===mediaIdentity(focusUserId||'')))));
 }
}
export function MediaTrack({track,muted=false}:{track:Track;muted?:boolean}) {
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(ref.current)return mountMediaTrack(track,ref.current,muted);},[track,muted]);
 return <div className="hft-media" ref={ref}/>;
}

export function shouldReleaseScreen(source:string,intentionalDisconnect:boolean):boolean {return source==='screen_share'&&!intentionalDisconnect;}

// The SDK mutes video-only streams to permit autoplay. A remote track must keep
// that setting; classroom audio is attached through separate audio tracks.
export function mountMediaTrack(track:Track,container:HTMLElement,muted=false){
 const element=track.attach();element.autoplay=true;if(element instanceof HTMLVideoElement){element.playsInline=true;if(muted)element.muted=true;}container.appendChild(element);return ()=>{track.detach(element);element.remove();};
}

/** Call directly from a click so browsers retain the user's playback gesture. */
export function enableClassroomAudio(room:Pick<Room,'startAudio'>):Promise<void>{return room.startAudio();}
export function AudioPlaybackControl({room,onChange,onError}:{room:Room;onChange:()=>void;onError:(message:string)=>void}){
 if(room.canPlaybackAudio)return null;
 return <button type="button" onClick={()=>{void enableClassroomAudio(room).then(onChange).catch(error=>onError(error instanceof Error?error.message:'Classroom audio could not start. Try again.'));}}>Enable classroom audio</button>;
}
