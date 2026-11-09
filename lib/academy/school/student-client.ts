import type {Answer} from './contracts';
export function applyStudentReply<T extends{enrollment:string;revision:number}>(current:T,incoming:T):T{return incoming.enrollment===current.enrollment&&Number.isFinite(incoming.revision)&&incoming.revision>=current.revision?incoming:current;}
export function checkResponseStatus(previous:{passed:boolean;answer?:Answer}|undefined,answer:Answer|undefined):'success'|'changed'|'retry'|null{
 if(!previous)return null;
 if(previous.passed&&previous.answer===undefined)return 'success';
 if(JSON.stringify(answer)!==JSON.stringify(previous.answer))return 'changed';
 return previous.passed?'success':'retry';
}
