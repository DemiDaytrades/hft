import {getCloudflareContext} from '@opennextjs/cloudflare';
import {requireAdmin} from '@/lib/dal';
import {classroomSnapshot} from '@/lib/classroom/service';
import Classroom from '@/components/classroom/Classroom';
export default async function InstructorClassroomPage({params}:{params:Promise<{sessionId:string}>}){
 const user=await requireAdmin(),{sessionId}=await params;const s=await classroomSnapshot(getCloudflareContext().env.DB,user.id,sessionId);if(s.hostId!==user.id)throw new Error('Assigned instructor required.');
 return <Classroom sessionId={sessionId} instructor/>;
}
