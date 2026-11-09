import "server-only";
// Server-only adapter. Never import this module from a client component.
import { AccessToken, RoomServiceClient, WebhookReceiver, TrackSource, ServerError } from 'livekit-server-sdk';
import type { MediaGrants } from './contracts';
import { MediaUnavailableError, type ClassroomProvider, type ProviderEvent, type ProviderParticipant } from './provider';
export type LiveKitEnvironment={LIVEKIT_URL?:string;LIVEKIT_API_KEY?:string;LIVEKIT_API_SECRET?:string};
type RoomClient=Pick<RoomServiceClient,'createRoom'|'listRooms'|'updateParticipant'|'removeParticipant'|'deleteRoom'|'listParticipants'|'mutePublishedTrack'>;
function sources(grants:MediaGrants){return [...(grants.microphone?[TrackSource.MICROPHONE]:[]),...(grants.camera?[TrackSource.CAMERA]:[]),...(grants.screen?[TrackSource.SCREEN_SHARE]:[])];}
function source(value:TrackSource):'microphone'|'camera'|'screen'|'other'{return value===TrackSource.MICROPHONE?'microphone':value===TrackSource.CAMERA?'camera':value===TrackSource.SCREEN_SHARE?'screen':'other';}
function permission(grants:MediaGrants){const allowed=sources(grants);return {canSubscribe:true,canPublish:allowed.length>0,canPublishSources:allowed,canPublishData:false,canUpdateMetadata:false,canSubscribeMetrics:false,hidden:false,recorder:false,agent:false};}
export function createLiveKitProvider(env:LiveKitEnvironment, client?:RoomClient):ClassroomProvider {
 const configured=!!(env.LIVEKIT_URL&&env.LIVEKIT_API_KEY&&env.LIVEKIT_API_SECRET);
 let url:URL|undefined;
 if(env.LIVEKIT_URL){url=new URL(env.LIVEKIT_URL);if(url.protocol!=='wss:'||!/^[-a-z0-9]+\.livekit\.cloud$/i.test(url.hostname)||url.username||url.password||url.port||url.pathname!=='/'||url.search||url.hash)throw new Error('A secure project LiveKit Cloud URL is required');}
 const service=configured?(client??new RoomServiceClient(env.LIVEKIT_URL!.replace(/^wss:/,'https:'),env.LIVEKIT_API_KEY!,env.LIVEKIT_API_SECRET!)):undefined;
 const receiver=configured?new WebhookReceiver(env.LIVEKIT_API_KEY!,env.LIVEKIT_API_SECRET!):undefined;
 function requireService(){if(!service)throw new MediaUnavailableError();return service;}
 async function remove(room:string,identity:string,strictCutoffSeconds=Math.floor(Date.now()/1000)+1){if(!Number.isSafeInteger(strictCutoffSeconds)||strictCutoffSeconds<Math.floor(Date.now()/1000)||strictCutoffSeconds>Math.floor(Date.now()/1000)+59)throw new Error('Strict revocation cutoff must cover current tokens');await requireService().removeParticipant(room,identity,{revokeTokenTs:BigInt(strictCutoffSeconds)});}
 return {
 configured,
 async ensureRoom(room){const s=requireService();const existing=await s.listRooms([room]);if(!existing.length)await s.createRoom({name:room,maxParticipants:11,emptyTimeout:300,departureTimeout:60});},
 async issueToken(room,identity,grants){requireService();if(!room||!identity)throw new Error('Room and identity required');
 // Cloud uses second-resolution nbf cutoffs. Mint only after the prior command's strict cutoff.
 await new Promise(resolve=>setTimeout(resolve,1001-Date.now()%1000));
 const token=new AccessToken(env.LIVEKIT_API_KEY!,env.LIVEKIT_API_SECRET!,{identity,ttl:60});
 token.addGrant({roomJoin:true,room,canSubscribe:true,canPublish:sources(grants).length>0,canPublishSources:sources(grants),canPublishData:false,canUpdateOwnMetadata:false});
 return {token:await token.toJwt(),url:env.LIVEKIT_URL!,expiresIn:60};},
 async setPermissions(room,identity,grants){const s=requireService();
 try{await s.updateParticipant(room,identity,{permission:permission(grants)});}catch{/* A participant may already be absent. Strict removal below remains mandatory. */}
 // UpdateParticipant refreshes tokens but its default Cloud revocation buffer permits replay.
 // A strict remove forces a fresh HFT admission using current grants.
 await remove(room,identity);},
 remove,
 async deleteRoom(room){try{await requireService().deleteRoom(room);}catch(error){
 // Retried teardown has already succeeded when the SDK confirms the room is absent.
 if(!(error instanceof ServerError&&error.code==='not_found'&&error.status===404))throw error;
 }},
 async list(room){let participants;try{participants=await requireService().listParticipants(room);}catch(error){if(error instanceof ServerError&&error.code==='not_found'&&error.status===404)return [];throw error;}return participants.map(p=>({identity:p.identity,sid:p.sid,tracks:p.tracks.map(t=>({sid:t.sid,source:source(t.source),muted:t.muted}))}));},
 async verifiedWebhook(raw,authorization){if(!receiver)throw new MediaUnavailableError();if(raw.length>262144)throw new Error('Webhook body too large');const event=await receiver.receive(raw,authorization,false,5);const at=Number(event.createdAt);if(!event.id||!event.room?.name||!Number.isSafeInteger(at)||Math.abs(Date.now()/1000-at)>300)throw new Error('Invalid webhook timestamp or identity');return {id:event.id,type:event.event,createdAt:at,room:event.room.name,identity:event.participant?.identity,participantSid:event.participant?.sid,trackSid:event.track?.sid,source:event.track?source(event.track.source):undefined} satisfies ProviderEvent;}
 };
}
/** Webhook delivery is at least once. Persist event.id under a UNIQUE constraint before applying it. */
export function duplicateScreenTracks(participants:ProviderParticipant[]){return participants.flatMap(p=>p.tracks.filter(t=>t.source==='screen').slice(1).map(t=>({identity:p.identity,trackSid:t.sid})));}
