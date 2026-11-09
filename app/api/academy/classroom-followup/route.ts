import {getCloudflareContext} from '@opennextjs/cloudflare';
import {requireMemberApiUser} from '@/lib/dal';
import {studentFollowups,submitFollowup} from '@/lib/classroom/teaching/handoff';
import {teachingBody,teachingJson as json,teachingError as error} from '@/lib/classroom/teaching/http';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const actor=await requireMemberApiUser(request.headers);return json({followups:await studentFollowups(getCloudflareContext().env.DB,actor.id)});}catch(e){return error(e);}}
export async function POST(request:Request){try{const env=getCloudflareContext().env,input=await teachingBody(request,env.BETTER_AUTH_URL),actor=await requireMemberApiUser(request.headers);return json(await submitFollowup(env.DB,actor.id,input.followupId,input.body));}catch(e){return error(e);}}
