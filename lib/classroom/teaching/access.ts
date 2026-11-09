import {classroomSnapshot} from '../service';
export function deny(message:string,status=403):never {throw Object.assign(new Error(message),{status});}
export async function teachingAccess(db:D1Database,actorId:string,sid:string,hostOnly=false){
 const snapshot=await classroomSnapshot(db,actorId,sid),host=snapshot.hostId===actorId;
 if(hostOnly&&!host)deny('Assigned instructor only.');
 return {snapshot,host};
}
/** Rechecked inside the transaction. No stale account, roster, room or lease can write. */
export const liveAuthoritySQL=`EXISTS(
 SELECT 1 FROM user u JOIN teaching_session s ON s.id=?
 JOIN classroom_room r ON r.session_id=s.id
 JOIN classroom_presence p ON p.session_id=s.id AND p.user_id=u.id
 JOIN json_each(r.state_json,'$.participants') member
 WHERE u.id=? AND u.lifecycle_status='ACTIVE' AND COALESCE(u.banned,0)=0 AND COALESCE(u.must_change_password,0)=0
 AND (u.role='admin' OR u.subscriptionStatus IN ('active','trialing') OR (u.complimentaryAccessRevokedAt IS NULL AND julianday(u.complimentaryAccessExpiresAt)>julianday('now') AND (u.complimentaryAccessStartsAt IS NULL OR julianday(u.complimentaryAccessStartsAt)<=julianday('now'))))
 AND s.status='CONFIRMED' AND julianday('now') BETWEEN julianday(s.start_at)-15.0/1440 AND julianday(s.end_at)+2.0/24
 AND ((s.instructor_id=u.id AND u.role='admin') OR (?=0 AND EXISTS(SELECT 1 FROM teaching_enrollment e WHERE e.session_id=s.id AND e.student_id=u.id AND e.status='ENROLLED')))
 AND r.revision=? AND json_extract(r.state_json,'$.state')='LIVE'
 AND json_extract(member.value,'$.id')=u.id AND json_extract(member.value,'$.connected')=1 AND COALESCE(json_extract(member.value,'$.removed'),0)=0
 AND json_extract(member.value,'$.connectionId')=p.connection_id AND p.connection_id=? AND julianday(p.expires_at)>julianday('now')
)`;
