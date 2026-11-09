import {requireIntakeV2Staff} from '@/lib/student-intake-v2/auth';
import {getIntakeV2Db} from '@/lib/student-intake-v2/service';
import {getReviewWorkspace,beginReviewCapture,adoptLegacyAnswers,saveConsultationReview,type ReviewInput} from '@/lib/consultation-review/service';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store'};
function error(e:unknown){if((e as any)?.digest?.includes('NEXT_REDIRECT'))throw e;return Response.json({error:e instanceof Error?e.message:'Unable to load review.'},{status:(e as any)?.status??400,headers})}
export async function GET(request:Request){try{const actor=await requireIntakeV2Staff(),studentId=new URL(request.url).searchParams.get('studentId');if(!studentId)return Response.json({error:'studentId required'},{status:400,headers});return Response.json(await getReviewWorkspace(getIntakeV2Db(),actor,studentId),{headers})}catch(e){return error(e)}}
export async function POST(request:Request){try{
 const actor=await requireIntakeV2Staff();const b=await request.json() as {action:string;studentId:string;intakeId:string;revision:number;legacyDigest:string;review:ReviewInput;confirm:boolean};const db=getIntakeV2Db();if(typeof b.studentId!=='string'||!b.studentId)return Response.json({error:'studentId required'},{status:400,headers});
 let intake;
 if(b.action==='start')intake=await beginReviewCapture(db,actor,b.studentId);
 else{if(typeof b.intakeId!=='string'||!Number.isSafeInteger(b.revision))return Response.json({error:'Exact intakeId and revision required'},{status:400,headers});
 if(b.action==='adopt')intake=await adoptLegacyAnswers(db,actor,b.studentId,b.intakeId,b.revision,b.legacyDigest);
 else if(b.action==='review')intake=await saveConsultationReview(db,actor,b.studentId,b.intakeId,b.revision,b.review,b.confirm===true);
 else return Response.json({error:'Invalid action'},{status:400,headers});}
 return Response.json({intake},{headers});
 }catch(e){return error(e)}}
