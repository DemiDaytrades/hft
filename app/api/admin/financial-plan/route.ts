import {requireMemberApiUser} from '@/lib/dal';
import {getIntakeV2Db} from '@/lib/student-intake-v2/service';
import {generatePlan,getStaffPlans,editPlan,transitionPlan,publishPlan} from '@/lib/financial-plan/service';
export const dynamic='force-dynamic';
const respond=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
const error=(e:unknown)=>respond({error:e instanceof Error?e.message:'Financial plan request failed.'},(e as {status?:number})?.status??400);
async function authorize(request:Request){const u=await requireMemberApiUser(request.headers);if(u.role!=='admin')throw Object.assign(new Error('Forbidden'),{status:403});return {userId:u.id,role:'admin'};}
export async function GET(request:Request){try{
 const actor=await authorize(request),studentId=new URL(request.url).searchParams.get('studentId');
 if(!studentId)return respond({error:'studentId required'},400);
 return respond(await getStaffPlans(getIntakeV2Db(),actor,studentId));
}catch(e){return error(e);}}
export async function POST(request:Request){try{
 const actor=await authorize(request);
 const text=await request.text();if(text.length>100000)return respond({error:'Request too large'},413);
 const body=JSON.parse(text),db=getIntakeV2Db();
 if(body.action==='generate'){
  if(typeof body.studentId!=='string'||typeof body.intakeId!=='string'||(body.requestKey!==undefined&&typeof body.requestKey!=='string'))return respond({error:'studentId, intakeId and valid requestKey required'},400);
  return respond(await generatePlan(db,actor,body.studentId,body.intakeId,body.requestKey));
 }
 if(typeof body.planId!=='string'||!Number.isSafeInteger(body.revision))return respond({error:'planId and revision required'},400);
 if(body.action==='save')return respond(await editPlan(db,actor,body.planId,body.revision,body.content));
 if(['review','approve','return'].includes(body.action))return respond(await transitionPlan(db,actor,body.planId,body.revision,body.action));
 if(body.action==='publish'&&Number.isSafeInteger(body.seriesRevision))return respond(await publishPlan(db,actor,body.planId,body.revision,body.seriesRevision));
 return respond({error:'Invalid action'},400);
}catch(e){return error(e);}}
