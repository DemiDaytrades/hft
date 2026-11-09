import {DOMAINS} from '../../learning-path/contracts';
import type {ActivityDefinition,ActivityAnswer,ActivityKind} from './contracts';
const fail=():never=>{throw new Error('Invalid teaching activity');};
function text(value:unknown,max:number,optional=false):string|undefined {
 if(optional&&value===undefined)return undefined;
 if(typeof value!=='string'||!value.trim()||value.length>max)return fail();
 return value.trim();
}
export function normalizeYoutubeUrl(value:string):string {
 const invalid=():never=>{throw Object.assign(new Error('Enter a valid YouTube video URL.'),{status:400});};
 if(typeof value!=='string')return invalid();
 if(/^[\w-]{11}$/.test(value))return value;
 let url:URL;try{url=new URL(value);}catch{return invalid();}
 if(url.protocol!=='https:'||url.username||url.password||url.port)return invalid();
 let id:string|null=null;
 if(url.hostname==='youtu.be'&&/^\/[\w-]{11}$/.test(url.pathname))id=url.pathname.slice(1);
 if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(url.hostname)){
  if(url.pathname==='/watch')id=url.searchParams.get('v');
  else if(/^\/(embed|shorts)\/[\w-]{11}$/.test(url.pathname))id=url.pathname.split('/')[2];
 }
 if(!id||!/^[\w-]{11}$/.test(id))return invalid();return id;
}
export function youtubePosition(state:{position:number;playing:boolean;updatedAt:number},now:number):number {
 if(!Number.isFinite(state.position)||state.position<0||!Number.isFinite(state.updatedAt)||!Number.isFinite(now))return fail();
 return state.position+(state.playing?Math.max(0,now-state.updatedAt)/1000:0);
}
export function validateActivity(value:unknown):ActivityDefinition {
 if(!value||typeof value!=='object'||Array.isArray(value))return fail();
 const v=value as Record<string,unknown>,kind=v.kind as ActivityKind;
 if(!['POLL','SINGLE','MULTI','TRUE_FALSE','WRITTEN'].includes(kind))return fail();
 const prompt=text(v.prompt,2000)!;
 if(!Array.isArray(v.options)||v.options.length>8)return fail();
 const options=v.options.map(o=>{if(!o||typeof o!=='object')return fail();return {id:text(o.id,64)!,text:text(o.text,500)!};});
 if(new Set(options.map(o=>o.id)).size!==options.length)return fail();
 if(kind==='WRITTEN'?options.length!==0:options.length<2)return fail();
 if(kind==='TRUE_FALSE'&&(options.length!==2||!options.some(o=>o.id==='true')||!options.some(o=>o.id==='false')))return fail();
 if(!Array.isArray(v.correctIds)||v.correctIds.some(id=>typeof id!=='string'||!options.some(o=>o.id===id)))return fail();
 const correctIds=v.correctIds as string[];
 if(new Set(correctIds).size!==correctIds.length)return fail();
 if(['POLL','WRITTEN'].includes(kind)?correctIds.length!==0:kind==='MULTI'?correctIds.length<1:correctIds.length!==1)return fail();
 for(const key of ['allowRevisions','showCorrectness','showAggregate'])if(v[key]!==undefined&&typeof v[key]!=='boolean')return fail();
 if(v.timerSeconds!==undefined&&(!Number.isInteger(v.timerSeconds)||Number(v.timerSeconds)<1||Number(v.timerSeconds)>3600))return fail();
 const result:ActivityDefinition={kind,prompt,options,correctIds:[...correctIds],allowRevisions:v.allowRevisions===true,showCorrectness:v.showCorrectness===true,showAggregate:v.showAggregate===true};
 if(v.timerSeconds!==undefined)result.timerSeconds=Number(v.timerSeconds);
 for(const key of ['rubric','conceptId','domain','stage','sourceId','sourceVersion'] as const){const val=text(v[key],key==='rubric'?4000:200,true);if(val!==undefined)result[key]=val;}
 if(!['POLL','WRITTEN'].includes(kind)&&(!result.conceptId||!result.stage||!result.sourceVersion||!DOMAINS.includes(result.domain as any)))return fail();
 return result;
}
export function validateAnswer(def:ActivityDefinition,value:unknown):ActivityAnswer {
 if(def.kind==='WRITTEN')return text(value,5000)!;
 if(!Array.isArray(value)||!value.length||value.length>def.options.length||value.some(id=>typeof id!=='string'||!def.options.some(o=>o.id===id))||new Set(value).size!==value.length)return fail();
 if(def.kind!=='MULTI'&&value.length!==1)return fail();return [...value] as string[];
}
export function scoreActivity(def:ActivityDefinition,value:unknown):boolean|null {
 const answer=validateAnswer(def,value);
 if(def.kind==='POLL'||def.kind==='WRITTEN')return null;
 const ids=answer as string[];return ids.length===def.correctIds.length&&ids.every(id=>def.correctIds.includes(id));
}
