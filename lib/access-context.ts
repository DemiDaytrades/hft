import 'server-only';
import {hasStudentAccess,type MembershipAccess} from './membership-access';

/** Server-only, selective projection. Never contains credentials or questionnaire data. */
export type AccessAccount=MembershipAccess&{id:string;role:string|null;banned:number|null;must_change_password:number|null};
export const accessAccountColumns='id,role,lifecycle_status,banned,must_change_password,subscriptionStatus,complimentaryAccessStartsAt,complimentaryAccessExpiresAt,complimentaryAccessRevokedAt';
export function lifecycleActive(account:AccessAccount|null|undefined):account is AccessAccount{return !!account&&account.lifecycle_status==='ACTIVE'&&!account.banned;}
export function memberReady(account:AccessAccount|null|undefined):account is AccessAccount{return lifecycleActive(account)&&!account.must_change_password&&(account.role==='admin'||hasStudentAccess(account));}
export async function readAccessAccount(db:D1Database,userId:string){
 return db.prepare('SELECT '+accessAccountColumns+' FROM user WHERE id=?').bind(userId).first<AccessAccount>();
}
