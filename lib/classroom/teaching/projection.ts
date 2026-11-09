import type {ActivityDefinition,ActivityAnswer,StudentActivity} from './contracts';
/** Explicit allowlist: never spread a bank/run/response record into a student DTO. */
export function studentActivity(run:{id:string;snapshot_json:string;closes_at:string|null;closed_at:string|null},own:{answer_json:string;correct:number|null;review_json?:string|null}|null,ended:boolean,now=Date.now()):StudentActivity {
 const def=JSON.parse(run.snapshot_json) as ActivityDefinition;
 const closed=ended||Boolean(run.closed_at)||(run.closes_at!==null&&Date.parse(run.closes_at)<=now);
 const review=closed&&own?.review_json?JSON.parse(own.review_json):null;
 return {...(review?{review:{decision:review.decision,feedback:review.feedback}}:{}),id:run.id,kind:def.kind,prompt:def.prompt,options:def.options.map(o=>({id:o.id,text:o.text})),allowRevisions:def.allowRevisions,closesAt:run.closes_at,closed,ownAnswer:own?JSON.parse(own.answer_json) as ActivityAnswer:null,received:Boolean(own),...(closed&&def.showCorrectness&&own?.correct!==null&&own?.correct!==undefined?{correct:own.correct===1}:{})};
}
