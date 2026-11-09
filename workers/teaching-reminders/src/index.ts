import {signDispatchRequest,TEACHING_DISPATCH_PATH} from '../../../lib/teaching/dispatch-auth';
interface TeachingSchedulerEnv {
 TEACHING_SCHEDULER_ENABLED?:string;
 TEACHING_DISPATCH_SECRET?:string;
 HFT_APP:{fetch(request:Request):Promise<Response>};
}
export default {
 async scheduled(_event:unknown,env:TeachingSchedulerEnv){
  if(env.TEACHING_SCHEDULER_ENABLED!=='true')return;
  const headers=await signDispatchRequest(env.TEACHING_DISPATCH_SECRET??'');
  const response=await env.HFT_APP.fetch(new Request(`https://hft.internal${TEACHING_DISPATCH_PATH}`,{method:'POST',headers,body:'{}'}));
  if(!response.ok)throw new Error(`Teaching dispatcher returned ${response.status}.`);
 },
 async fetch(){return new Response('Not found',{status:404});},
};
