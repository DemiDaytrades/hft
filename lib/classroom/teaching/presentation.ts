import type {FollowupContent} from './handoff';
export function teachingMobileViews(tab:string,state:string,youtube:boolean){return {player:youtube&&(tab==='stage'||tab==='activity'),tools:tab==='activity'||state==='ENDED'};}
export function followupDraftDefaults(value?:string):FollowupContent {if(value){try{return JSON.parse(value);}catch{/* Unset draft uses explicit defaults. */}}return {feedback:'',decision:'REVIEW',task:'',lessonId:''};}
