import type {TeachingView} from './teaching/contracts';
export type ClassroomResource='classroom-refresh'|'classroom-command'|'chat-history'|'teaching-refresh'|'teaching-command'|'instructor-panel';
type Diagnostic={resource:ClassroomResource;status:number;contentType:string;redirected:boolean;authDestination:'login'|'password-change'|null;cfRay:string|null;cloudflareChallenge:boolean;kind:'non-json'|'invalid-json'|'invalid-shape'|'api-rejection'};
export class ClassroomResponseError extends Error {
 constructor(message:string,public status:number,public needsSignIn=false){super(message);this.name='ClassroomResponseError';}
}
const object=(v:unknown):v is Record<string,any>=>!!v&&typeof v==='object'&&!Array.isArray(v);
function metadata(response:Response,resource:ClassroomResource):Omit<Diagnostic,'kind'>{
 let authDestination:Diagnostic['authDestination']=null;
 try{const path=new URL(response.url).pathname;if(path==='/login')authDestination='login';else if(path==='/account/change-password')authDestination='password-change';}catch{/* Synthetic Responses need not have a URL. */}
 const ray=response.headers.get('cf-ray');
 return {resource,status:response.status,contentType:(response.headers.get('content-type')??'').split(';')[0].trim().toLowerCase().slice(0,80),redirected:response.redirected,authDestination,cfRay:ray&&/^[a-f0-9]{16}-[a-z]{3}$/i.test(ray)?ray:null,cloudflareChallenge:response.headers.get('cf-mitigated')==='challenge'};
}
function fail(response:Response,resource:ClassroomResource,kind:Diagnostic['kind']):never{
 const safe={...metadata(response,resource),kind};
 // No response body, URL/query, cookies, authorization, answers or private notes.
 console.warn('[classroom-api-response]',safe);
 const needsSignIn=!!safe.authDestination||response.status===401;
 const message=needsSignIn?'Your session needs attention. Sign in again, then reopen the classroom.':resource.endsWith('command')?'Could not confirm the classroom action. Refresh the page before trying again.':'Classroom information could not be verified. Reload the page to retry.';
 throw new ClassroomResponseError(message+(safe.cfRay?' Reference: '+safe.cfRay+'.':''),response.status,needsSignIn);
}
export async function readClassroomResponse<T=Record<string,any>>(response:Response,resource:ClassroomResource):Promise<T>{
 const type=metadata(response,resource).contentType;
 if(!(type==='application/json'||type.startsWith('application/')&&type.endsWith('+json')))return fail(response,resource,'non-json');
 let value:unknown;try{value=await response.json();}catch{return fail(response,resource,'invalid-json');}
 if(!object(value))return fail(response,resource,'invalid-shape');
 return value as T;
}
type PrivateTeachingView={panel:any;context:any;handoff:any};
export async function loadTeachingResponses(url:string,host:boolean,get:(url:string)=>Promise<Response>=url=>fetch(url,{cache:'no-store',headers:{Accept:'application/json'}})):Promise<{view:TeachingView;privateView:PrivateTeachingView|null}>{
 const result=await get(url),view=await readClassroomResponse<TeachingView&{error?:string}>(result,'teaching-refresh');
 if(!result.ok)return fail(result,'teaching-refresh','api-rejection');
 if(!Number.isInteger(view.revision)||view.revision<0||!('youtube'in view)||!('activity'in view)||view.youtube!==null&&!object(view.youtube)||view.activity!==null&&!object(view.activity))return fail(result,'teaching-refresh','invalid-shape');
 let privateView:PrivateTeachingView|null=null;
 if(host){const response=await get(url+'?instructor=1');const data=await readClassroomResponse<PrivateTeachingView>(response,'instructor-panel');if(!response.ok)return fail(response,'instructor-panel','api-rejection');if(!object(data.panel)||!object(data.context)||!object(data.handoff)||!Array.isArray(data.panel.runs)||!Array.isArray(data.context.students)||!Array.isArray(data.handoff.students))return fail(response,'instructor-panel','invalid-shape');privateView=data;}
 return {view,privateView};
}

export async function guardMediaConnect<T>(connect:()=>Promise<T>):Promise<T>{
 try{return await connect();}catch(cause){const name=cause instanceof Error?cause.name:'';console.warn('[classroom-media-connect]',{phase:'media-connect',errorType:['Error','ConnectionError','SyntaxError','TypeError','NotAllowedError','AbortError'].includes(name)?name:'OtherError'});throw new Error('Media connection could not be confirmed. Select Reconnect to try again.');}
}
