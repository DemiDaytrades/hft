import {getCloudflareContext} from '@opennextjs/cloudflare';
import {requireActiveMember} from '@/lib/dal';
import {classroomSnapshot} from '@/lib/classroom/service';
import Classroom from '@/components/classroom/Classroom';
export default async function ClassroomPage({params}:{params:Promise<{sessionId:string}>}){
 const user=await requireActiveMember(),{sessionId}=await params;await classroomSnapshot(getCloudflareContext().env.DB,user.id,sessionId);
 return <Classroom sessionId={sessionId}/>;
}
