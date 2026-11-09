import type { MediaGrants } from './contracts';
export type ProviderParticipant={identity:string;sid:string;tracks:{sid:string;source:'microphone'|'camera'|'screen'|'other';muted:boolean}[]};
export type ProviderEvent={id:string;type:string;createdAt:number;room:string;identity?:string;participantSid?:string;trackSid?:string;source?:'microphone'|'camera'|'screen'|'other'};
export interface ClassroomProvider {
 readonly configured:boolean;
 ensureRoom(room:string):Promise<void>;
 issueToken(room:string,identity:string,grants:MediaGrants):Promise<{token:string;url:string;expiresIn:60}>;
 setPermissions(room:string,identity:string,grants:MediaGrants):Promise<void>;
 remove(room:string,identity:string,strictCutoffSeconds?:number):Promise<void>;
 deleteRoom(room:string):Promise<void>;
 list(room:string):Promise<ProviderParticipant[]>;
 verifiedWebhook(raw:string,authorization:string):Promise<ProviderEvent>;
}
export class MediaUnavailableError extends Error { constructor(){super('Classroom media is unavailable. LiveKit Cloud development configuration is required.');this.name='MediaUnavailableError';} }
