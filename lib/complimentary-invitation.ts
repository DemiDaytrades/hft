import 'server-only';
import {assertLifecycleActive} from './student-lifecycle';
import {getCloudflareContext} from '@opennextjs/cloudflare';
import {createInvite,type Invite} from './invites';
import {getConsentState,normalizePhone,sendEmail,sendSms,type CommChannel} from './communications';
import {isEmailConfigured,isSmsConfigured} from './communications/providers';
import {academyComplimentaryEmail,academyComplimentarySms} from './communications/templates';
export type DeliveryChoice='email'|'sms';
export type DeliveryStatus={status:'sent'|'failed'|'not_available'|'pending'|'uncertain'|'delivered';reason?:string;retryAllowed?:boolean};
export type ComplimentaryInvitationStatus={email:DeliveryStatus;sms:DeliveryStatus;account:string;access:string;accessDescription:string;accessExpiresAt:string|null;invitationExpiresAt:string|null;activationUrl:string|null;permitted:{email:boolean;sms:boolean};existingAccount:boolean};
type Actor={userId:string;role?:string};
const now=()=>new Date().toISOString();
const uid=()=>crypto.randomUUID().replaceAll('-','');
const fail=(message:string,status=400):never=>{throw Object.assign(new Error(message),{status});};
function cleanEmail(value:string){const email=String(value??'').trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)fail('A valid email identity is required, including for SMS-only delivery.');return email;}
function origin(){const env=getCloudflareContext().env as unknown as Record<string,string|undefined>;const u=new URL(env.BETTER_AUTH_URL??'');if(u.username||u.password||(u.protocol!=='https:'&&!(u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname))))fail('Configure a secure BETTER_AUTH_URL before issuing invitations.');return u.origin;}
async function authorized(db:D1Database,actor:Actor){await assertLifecycleActive(db,actor.userId);const user=await db.prepare('SELECT role,banned,must_change_password FROM user WHERE id=?').bind(actor.userId).first<any>();if(user?.role!=='admin'||user.banned||user.must_change_password)fail('Forbidden: authorized admin required.',403);}
async function recipient(db:D1Database,email:string){return db.prepare('SELECT * FROM user WHERE email=?').bind(email).first<any>();}
async function latestInvite(db:D1Database,email:string){return db.prepare("SELECT * FROM invite WHERE email=? AND (kind='member' OR kind LIKE 'member:%') ORDER BY createdAt DESC,id DESC LIMIT 1").bind(email).first<Invite>();}
function terms(kind:string){if(kind.startsWith('member:custom:'))return `Access expires ${kind.slice('member:custom:'.length)}.`;return `${kind.split(':')[1]??'30'} days after activation.`;}
function accessState(user:any){if(user?.lifecycle_status==='DEACTIVATED')return 'Deactivated';if(!user)return 'Awaiting Activation';if(user.complimentaryAccessRevokedAt)return 'Revoked';const end=Date.parse(user.complimentaryAccessExpiresAt??'');const start=Date.parse(user.complimentaryAccessStartsAt??'');if(!Number.isFinite(end))return 'Not Granted';if(end<=Date.now())return 'Expired';if(Number.isFinite(start)&&start>Date.now())return 'Not Yet Active';return 'Active';}
function purpose(user:any,invite:Invite|null,pendingExisting=false){return user&&!pendingExisting?`comp-access:${user.id}:${user.complimentaryAccessExpiresAt?.slice(0,10)??'none'}`:invite?`comp-invite:${invite.id}`:null;}
async function permission(db:D1Database,email:string,user:any){
 const consent=user?await getConsentState(user.id):null;
 if(user?.lifecycle_status==='DEACTIVATED')return {email:false,sms:false};
 return {email:!!email&&(!consent||consent.emailOptedIn),sms:!!user&&!!normalizePhone(user.phone_number??'')&&consent?.smsOptedIn===true};
}
async function deliveryStatus(db:D1Database,key:string|null,channel:CommChannel):Promise<DeliveryStatus>{
 if(!key)return {status:'not_available'};
 const row=await db.prepare('SELECT d.status,c.status AS provider_status FROM complimentary_invite_delivery d LEFT JOIN communication_log c ON c.idempotency_key=d.communication_key WHERE d.purpose_key=? AND d.channel=? ORDER BY d.sequence DESC LIMIT 1').bind(key,channel).first<any>();
 if(!row)return {status:'not_available',reason:'No delivery requested for this access/invitation.'};
 if(row.provider_status==='delivered')return {status:'delivered'};
 if(['suppressed','complained'].includes(row.provider_status))return {status:'failed',reason:'Provider suppression/complaint requires contact-policy review.',retryAllowed:false};
 if(['bounced','failed'].includes(row.provider_status)&&row.status==='sent')return {status:'failed',reason:'Provider reported delivery failure.'};
 if(row.provider_status==='sent')return {status:'sent'};
 return {status:row.status,reason:row.status==='pending'?'Delivery in progress or outcome not yet known.':row.status==='uncertain'?'Check provider logs before attempting another delivery.':undefined};
}
export async function getComplimentaryInvitationStatus(db:D1Database,actor:Actor,address:string):Promise<ComplimentaryInvitationStatus>{
 await authorized(db,actor);const email=cleanEmail(address),user=await recipient(db,email),invite=await latestInvite(db,email),permitted=await permission(db,email,user),state=accessState(user),base=origin();
 const customTermsExpired=!!invite?.kind.startsWith('member:custom:')&&Date.parse(`${invite.kind.slice(14)}T23:59:59Z`)<=Date.now();
 const valid=invite&&!invite.usedAt&&Date.parse(invite.expiresAt)>Date.now()&&!customTermsExpired;
 const pendingExisting=!!user&&state==='Not Granted'&&!!invite&&!invite.usedAt;
 const key=purpose(user,invite,pendingExisting);
 async function displayedStatus(channel:CommChannel){
  const current=await deliveryStatus(db,key,channel);
  if(current.reason==='No delivery requested for this access/invitation.'&&user&&invite?.usedAt&&invite.userId===user.id)return deliveryStatus(db,purpose(null,invite),channel);
  return current;
 }
 const credential=user?await db.prepare("SELECT id FROM account WHERE userId=? AND providerId='credential' AND password IS NOT NULL LIMIT 1").bind(user.id).first():null;
 return {email:await displayedStatus('email'),sms:await displayedStatus('sms'),account:user?(user.must_change_password?'Password Setup Required':credential?'Activated':'Existing Account — Sign In / Recovery'):'Awaiting Activation',access:(!user||pendingExisting)&&customTermsExpired?'Expired':pendingExisting?'Awaiting Activation':state,accessDescription:user&&!pendingExisting?user.complimentaryAccessExpiresAt?`Access expires ${user.complimentaryAccessExpiresAt.slice(0,10)}.`:'No complimentary access recorded.':invite?terms(invite.kind):'No invitation created.',accessExpiresAt:user?.complimentaryAccessExpiresAt??null,invitationExpiresAt:user&&!pendingExisting?null:invite?.expiresAt??null,activationUrl:user&&state==='Active'?`${base}/login`:(!user||pendingExisting)&&valid?`${base}/invite/${invite.token}`:null,permitted,existingAccount:!!user};
}
function channels(value:unknown,allowEmpty=false):DeliveryChoice[]{if(!Array.isArray(value)||!allowEmpty&&!value.length||value.some(c=>c!=='email'&&c!=='sms')||new Set(value).size!==value.length)fail('Select email, SMS, or both.');return value as DeliveryChoice[];}
async function deliver(db:D1Database,actor:Actor,email:string,user:any,invite:Invite|null,selected:DeliveryChoice[],retry:boolean,requestId?:string,pendingExisting=false){
 const key=purpose(user,invite,pendingExisting)!;const allowed=await permission(db,email,user);const base=origin();
 const url=user&&!pendingExisting?`${base}/login`:`${base}/invite/${invite!.token}`;
 const access=user&&!pendingExisting?`Access expires ${user.complimentaryAccessExpiresAt.slice(0,10)}.`:terms(invite!.kind);
 for(const channel of selected){
  if(!allowed[channel])continue; // Recheck consent after creation; never force a channel.
  const previous=await db.prepare('SELECT * FROM complimentary_invite_delivery WHERE purpose_key=? AND channel=? ORDER BY sequence DESC LIMIT 1').bind(key,channel).first<any>();
  if(previous){const status=await deliveryStatus(db,key,channel);if(status.retryAllowed===false||['pending','uncertain'].includes(status.status)||['sent','delivered'].includes(status.status)&&!requestId||!retry)continue;}
  if(previous) {
    await db.prepare("UPDATE complimentary_invite_delivery SET status='sent' WHERE id=? AND EXISTS(SELECT 1 FROM communication_log WHERE idempotency_key=? AND status IN ('sent','delivered'))").bind(previous.id,previous.communication_key).run();
    await db.prepare("UPDATE complimentary_invite_delivery SET status='failed' WHERE id=? AND status='sent' AND EXISTS(SELECT 1 FROM communication_log WHERE idempotency_key=? AND status IN ('bounced','failed'))").bind(previous.id,previous.communication_key).run();
  }
  const attemptId=uid(),sequence=(previous?.sequence??0)+1,communicationKey=`${key}:${channel}:${sequence}`,at=now();
  const claim=await db.prepare(`INSERT INTO complimentary_invite_delivery(id,invite_id,user_id,email,channel,purpose_key,sequence,request_key,previous_id,communication_key,status,actor_id,created_at,updated_at)
    SELECT ?,?,?,?,?,?,?,?,?,?,'pending',?,?,? WHERE NOT EXISTS(SELECT 1 FROM complimentary_invite_delivery WHERE purpose_key=? AND channel=? AND (status IN ('pending','uncertain') OR status='sent' AND ?=0)) ON CONFLICT DO NOTHING`).bind(attemptId,user&&!pendingExisting?null:invite!.id,user?.id??null,email,channel,key,sequence,requestId??null,previous?.id??null,communicationKey,actor.userId,at,at,key,channel,requestId?1:0).run();
  if(!claim.meta.changes)continue;
  let status:DeliveryStatus['status']='uncertain';
  try{
   if(channel==='email'&&!isEmailConfigured()||channel==='sms'&&!isSmsConfigured())status='not_available';
   else{
    const result=channel==='email'?await sendEmail({to:email,...academyComplimentaryEmail({url,access,existing:!!user,pendingExisting,invitationExpiresAt:invite?.expiresAt}),userId:user?.id??null,eventType:'complimentary_invite',idempotencyKey:communicationKey}):await sendSms({to:normalizePhone(user.phone_number)!,...academyComplimentarySms({url,access,existing:!!user,pendingExisting}),userId:user.id,eventType:'complimentary_invite',idempotencyKey:communicationKey});
    status=result.uncertain?'uncertain':result.status==='sent'||result.status==='skipped'&&!!result.providerMessageId?'sent':result.status==='failed'?'failed':'not_available';
   }
  }catch{status='uncertain';}
  try{await db.prepare('UPDATE complimentary_invite_delivery SET status=?,updated_at=? WHERE id=?').bind(status,now(),attemptId).run();}catch{/* Claim stays pending; never resend blindly after a logging failure. */}
 }
}
function kindFor(input:{days?:number;customDate?:string}){
 if(input.customDate){if(!/^\d{4}-\d{2}-\d{2}$/.test(input.customDate)||!Number.isFinite(Date.parse(`${input.customDate}T23:59:59Z`))||new Date(`${input.customDate}T23:59:59Z`).toISOString().slice(0,10)!==input.customDate||Date.parse(`${input.customDate}T23:59:59Z`)<=Date.now())fail('Choose a valid future custom date.');return `member:custom:${input.customDate}`;}
 if(![7,14,30,60,90].includes(input.days??30))fail('Choose an approved complimentary duration.');return `member:${input.days??30}`;
}
export async function createComplimentaryInvitation(db:D1Database,actor:Actor,input:{email:string;days?:number;customDate?:string;expiresAt?:string;channels:DeliveryChoice[]}){
 await authorized(db,actor);const email=cleanEmail(input.email),selected=channels(input.channels,true),kind=kindFor(input),user=await recipient(db,email),allowed=await permission(db,email,user);origin();
 if(input.expiresAt&&(!Number.isFinite(Date.parse(input.expiresAt))||Date.parse(input.expiresAt)<=Date.now()))fail('Choose a future expiration date.');
 if(user?.lifecycle_status==='DEACTIVATED')fail('Account deactivated; reactivate before granting or inviting.');
 if(user?.banned)fail('Cannot grant access to a banned account.');
 if(selected.some(c=>!allowed[c]))fail('Selected channel is not permitted: recorded phone and SMS consent are required for SMS; email must be permitted.');
 let invite:Invite|null=null;
 if(user){
  const at=now(),expiry=input.expiresAt?new Date(input.expiresAt).toISOString():kind.startsWith('member:custom:')?`${input.customDate}T23:59:59.000Z`:new Date(Date.now()+(input.days??30)*86400000).toISOString();
  const grantResult=await db.batch([
   db.prepare(`UPDATE user SET complimentaryAccessStartsAt=?,complimentaryAccessExpiresAt=CASE WHEN julianday(complimentaryAccessExpiresAt)>julianday(?) THEN complimentaryAccessExpiresAt ELSE ? END,complimentaryAccessRevokedAt=NULL,complimentaryGrantedBy=?,updatedAt=? WHERE id=? AND lifecycle_status='ACTIVE' AND COALESCE(banned,0)=0`).bind(at,expiry,expiry,actor.userId,at,user.id),
   db.prepare("UPDATE invite SET expiresAt=? WHERE email=? AND usedAt IS NULL AND (kind='member' OR kind LIKE 'member:%')").bind(at,email),
  ]);
  if(!grantResult[0].meta.changes)fail("Account lifecycle changed; reload before granting access.",409);
 }else invite=await createInvite({email,kind,createdBy:actor.userId,reuseValid:true});
 const updated=user?await recipient(db,email):null;
 await deliver(db,actor,email,updated,invite,selected,false);
 return getComplimentaryInvitationStatus(db,actor,email);
}
export async function resendComplimentaryInvitation(db:D1Database,actor:Actor,input:{email:string;channels:DeliveryChoice[];requestId?:string}){
 await authorized(db,actor);if(input.requestId!==undefined&&(typeof input.requestId!=='string'||!/^[-a-zA-Z0-9]{8,100}$/.test(input.requestId)))fail('Invalid resend request ID.');const email=cleanEmail(input.email),selected=channels(input.channels),user=await recipient(db,email),allowed=await permission(db,email,user);origin();
 if(user?.lifecycle_status==='DEACTIVATED')fail('Account deactivated; authorized reactivation required.');
 if(user?.banned)fail('Cannot send to a banned account.');
 if(selected.some(c=>!allowed[c]))fail('Selected channel is not permitted by current contact/consent.');
 let invite=await latestInvite(db,email);
 const state=accessState(user),pendingExisting=!!user&&state==='Not Granted'&&!!invite&&!invite.usedAt;
 if(user&&state!=='Active'&&!pendingExisting)fail(`Complimentary access is ${state.toLowerCase()}; resend cannot grant or extend access.`);
 if(!user||pendingExisting){
  if(!invite)return fail('Create a complimentary invitation first.');
  if(invite.usedAt)fail('This invitation was redeemed. Confirm the account before resending.');
  if(invite.kind.startsWith('member:custom:')&&Date.parse(`${invite.kind.slice(14)}T23:59:59Z`)<=Date.now())fail('The complimentary access date has expired; create an explicit new grant.');
  invite=await createInvite({email,kind:invite.kind,createdBy:actor.userId,reuseValid:true});
 }
 await deliver(db,actor,email,user,invite,selected,true,input.requestId,pendingExisting);
 return getComplimentaryInvitationStatus(db,actor,email);
}
