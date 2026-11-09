/** Launch snapshots are immutable. Private keys/rubrics must never be student DTOs. */
export type ActivityKind = 'POLL'|'SINGLE'|'MULTI'|'TRUE_FALSE'|'WRITTEN';
export interface ActivityOption {id:string;text:string}
export interface ActivityDefinition {
 kind:ActivityKind;prompt:string;options:ActivityOption[];correctIds:string[];
 allowRevisions:boolean;showCorrectness:boolean;showAggregate?:boolean;timerSeconds?:number;
 rubric?:string;conceptId?:string;domain?:string;stage?:string;
 sourceId?:string;sourceVersion?:string;
}
export type ActivityAnswer = string|string[];
export interface YoutubeState {videoId:string;position:number;playing:boolean;updatedAt:number;revision:number;active:boolean}
export interface StudentActivity {
 id:string;kind:ActivityKind;prompt:string;options:ActivityOption[];
 allowRevisions:boolean;closesAt:string|null;closed:boolean;
 aggregate?:{optionId:string;count:number}[];ownAnswer:ActivityAnswer|null;received:boolean;correct?:boolean;review?:{decision:string;feedback:string};
}
export interface TeachingView {revision:number;youtube:YoutubeState|null;activity:StudentActivity|null}
