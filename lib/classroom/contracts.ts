import type {TeachingView} from './teaching/contracts';
export type ClassroomState='SCHEDULED'|'READY'|'LIVE'|'ENDED';
export type MediaGrants={microphone:boolean;camera:boolean;screen:boolean};
export type ClassroomParticipant={id:string;name:string;role:'host'|'student';connected:boolean;handRaised:boolean;removed:boolean;grants:MediaGrants;screenActive:boolean;connectionId?:string;leaseExpiresAt?:string;screenReservedAt?:string;screenTrackSeen?:boolean};
export type ClassroomChat={id:number;authorId:string;authorName:string;text:string;createdAt:string;deleted:boolean;pinned:boolean};
export type ClassroomEvent={id:number;action:string;actorId:string;createdAt:string};
export type ClassroomSnapshot={teaching?:TeachingView;sessionId:string;title:string;selfId:string;hostId:string;state:ClassroomState;revision:number;participants:ClassroomParticipant[];chat:ClassroomChat[];events:ClassroomEvent[];cursor:number;stage:{layout:'instructor'|'presenter'|'side-by-side';focusUserId:string;revision:number};media:{available:boolean;reason?:string};startAt:string;endAt:string};
export type ClassroomCommand={action:'start'|'end'|'join'|'leave'|'raiseHand'|'lowerHand'|'grant'|'demote'|'remove'|'declineHand'|'screenStart'|'screenStop'|'stage'|'chat'|'pin'|'deleteChat'|'heartbeat';requestKey:string;targetUserId?:string;grants?:Partial<MediaGrants>;layout?:ClassroomSnapshot['stage']['layout'];focusUserId?:string;text?:string;messageId?:number;connectionId?:string;expectedRevision?:number};

export type ClassroomResult={snapshot:ClassroomSnapshot;admission?:{url:string;token:string;expiresAt:string}};
