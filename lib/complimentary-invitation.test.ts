import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import {fixtureDb} from './financial-plan/testing/db';
const {db,sqlite}=fixtureDb();
let emailFail=false,smsFail=false,emailCount=0,smsCount=0,emailConfigured=true,smsTimeout=false,emailNoId=false;
let emailErrorStatus:number|undefined;
let session={id:"admin",role:"admin"};
const bodies:string[]=[];
const load=(Module as any)._load;
(Module as any)._load=function(name:string,...args:any[]){
 if(name==='@/lib/dal')return {requireMemberApiUser:async()=>session,requireAdmin:async()=>{if(session.role!=='admin')throw Object.assign(new Error('Forbidden'),{status:403});return {id:session.id,name:'Synthetic Admin'};}};
 if(name==='next/cache')return {revalidatePath(){}};
 if(name==='@opennextjs/cloudflare')return {getCloudflareContext:()=>({env:{DB:db,BETTER_AUTH_URL:'https://academy.example.invalid',TELNYX_API_KEY:'test-only',TELNYX_FROM_NUMBER:'+12025550111'}})};
 if(name==='@/lib/communications/providers'||name==='./communications/providers')return {isEmailConfigured:()=>emailConfigured,isSmsConfigured:()=>true,isTelnyxConfigured:()=>false,getTelnyx:()=>null,getResend:()=>({emails:{send:async(p:any)=>{emailCount++;bodies.push(p.text);if(emailNoId)return {};if(emailFail)return {error:{message:'Failed',statusCode:emailErrorStatus}};return {data:{id:`email-${emailCount}`}};}}}),getTwilio:()=>({messages:{create:async(p:any)=>{smsCount++;bodies.push(p.body);if(smsTimeout)throw new Error(`Timeout ${p.body}`);if(smsFail)throw Object.assign(new Error('Rejected'),{status:400});return {sid:`sms-${smsCount}`};}}})};
 return load.call(this,name,...args);
};
process.env.TWILIO_FROM_NUMBER='+12025550111';
// Any unmocked network access is a test failure.
globalThis.fetch=async()=>{throw new Error('Outbound network blocked by test');};
const {createComplimentaryInvitation,resendComplimentaryInvitation,getComplimentaryInvitationStatus}=require('./complimentary-invitation');
for(const [id,email,role] of [['admin','admin@example.invalid','admin'],['member','member@example.invalid','student'],['noPhone','nophone@example.invalid','student'],['noConsent','noconsent@example.invalid','student']])sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run(id,id,email,role,'2026-11-07','2026-11-07');
sqlite.prepare('UPDATE user SET phone_number=?,sms_opted_in=1 WHERE id=?').run('+12025550123','member');
sqlite.prepare('UPDATE user SET phone_number=?,sms_opted_in=0 WHERE id=?').run('+12025550124','noConsent');
const actor={userId:'admin',role:'admin'};
test('new email invitation uses secure setup, logs recipient rather than admin, and repeats idempotently',async()=>{
 const p=await createComplimentaryInvitation(db,actor,{email:'new@example.invalid',days:30,channels:['email']});
 assert.equal(p.email.status,'sent');assert.equal(p.sms.status,'not_available');assert.equal(p.account,'Awaiting Activation');assert.ok(p.activationUrl.includes('/invite/'));
 const before=emailCount;const retry=await createComplimentaryInvitation(db,actor,{email:'new@example.invalid',days:30,channels:['email']});assert.equal(retry.activationUrl,p.activationUrl);assert.equal(emailCount,before);
 assert.equal((sqlite.prepare("SELECT COUNT(*) AS n FROM user WHERE email='new@example.invalid'").get() as any).n,0);
 const log=sqlite.prepare("SELECT * FROM communication_log WHERE event_type='complimentary_invite' LIMIT 1").get() as any;assert.equal(log.user_id,null);assert.ok(!JSON.stringify(log).includes(p.activationUrl.split('/').at(-1)));
 assert.ok(bodies.at(-1)!.includes('30 days after activation'));assert.ok(!/temporary password|tempPassword/i.test(bodies.join('')));
});
test('both channels, independent failure, retry only failed channel and unchanged entitlement',async()=>{
 smsFail=true;const p=await createComplimentaryInvitation(db,actor,{email:'member@example.invalid',days:30,channels:['email','sms']});
 assert.equal(p.email.status,'sent');assert.equal(p.sms.status,'failed');assert.ok(p.activationUrl.endsWith('/login'));
 const expiry=(sqlite.prepare("SELECT complimentaryAccessExpiresAt FROM user WHERE id='member'").get() as any).complimentaryAccessExpiresAt;
 const emailBefore=emailCount;smsFail=false;await resendComplimentaryInvitation(db,actor,{email:'member@example.invalid',channels:['email','sms']});assert.equal(emailCount,emailBefore);
 assert.equal((sqlite.prepare("SELECT complimentaryAccessExpiresAt FROM user WHERE id='member'").get() as any).complimentaryAccessExpiresAt,expiry);
 assert.equal((await getComplimentaryInvitationStatus(db,actor,'member@example.invalid')).sms.status,'sent');
 emailFail=true;const x=await createComplimentaryInvitation(db,actor,{email:'member@example.invalid',days:60,channels:['email','sms']});assert.equal(x.email.status,'failed');assert.equal(x.sms.status,'sent');emailFail=false;
});
test('SMS only requires existing recorded consent/contact and email identity; disallowed channels cannot send',async()=>{
 const p=await createComplimentaryInvitation(db,actor,{email:'member@example.invalid',days:90,channels:['sms']});assert.equal(p.sms.status,'sent');
 const before=smsCount;
 await assert.rejects(createComplimentaryInvitation(db,actor,{email:'nophone@example.invalid',days:30,channels:['sms']}),/permitted|phone/i);
 await assert.rejects(createComplimentaryInvitation(db,actor,{email:'noconsent@example.invalid',days:30,channels:['sms']}),/permitted|consent/i);
 await assert.rejects(createComplimentaryInvitation(db,actor,{email:'fresh@example.invalid',days:30,channels:['sms']}),/permitted|consent/i);
 await assert.rejects(createComplimentaryInvitation(db,actor,{email:'',days:30,channels:['sms']}),/email/i);
 assert.equal(smsCount,before);
});
test('expired invite rotates safely with same terms; revoked grants and unauthorized requests cannot resend',async()=>{
 const first=await getComplimentaryInvitationStatus(db,actor,'new@example.invalid');
 sqlite.prepare('UPDATE invite SET expiresAt=? WHERE token=?').run('2020-01-01',first.activationUrl.split('/').at(-1));
 const renewed=await resendComplimentaryInvitation(db,actor,{email:'new@example.invalid',channels:['email']});assert.notEqual(renewed.activationUrl,first.activationUrl);
 assert.equal((sqlite.prepare('SELECT kind FROM invite WHERE token=?').get(renewed.activationUrl.split('/').at(-1)) as any).kind,'member:30');
 sqlite.prepare("UPDATE user SET complimentaryAccessRevokedAt='2026-11-07' WHERE id='member'").run();
 await assert.rejects(resendComplimentaryInvitation(db,actor,{email:'member@example.invalid',channels:['email']}),/revoked/i);
 await assert.rejects(resendComplimentaryInvitation(db,{userId:'member',role:'admin'},{email:'new@example.invalid',channels:['email']}),/Forbidden/i);
 await assert.rejects(createComplimentaryInvitation(db,{userId:'member',role:'admin'},{email:'new2@example.invalid',days:30,channels:['email']}),/Forbidden/i);
});

test('an explicit resend is repeat-safe, recorded and preserves the link and access terms',async()=>{
 const initial=await getComplimentaryInvitationStatus(db,actor,'new@example.invalid'),before=emailCount;
 await resendComplimentaryInvitation(db,actor,{email:'new@example.invalid',channels:['email'],requestId:'resend-request-1'});
 await resendComplimentaryInvitation(db,actor,{email:'new@example.invalid',channels:['email'],requestId:'resend-request-1'});
 assert.equal(emailCount,before+1);
 const after=await getComplimentaryInvitationStatus(db,actor,'new@example.invalid');assert.equal(after.activationUrl,initial.activationUrl);assert.equal(after.accessDescription,initial.accessDescription);
 const row=sqlite.prepare("SELECT previous_id FROM complimentary_invite_delivery WHERE request_key='resend-request-1'").get() as any;assert.ok(row.previous_id);
});

test('legacy pending invitation to an existing account preserves its redemption flow and password',async()=>{
 const {createInvite}=require('./invites');
 const invite=await createInvite({email:'nophone@example.invalid',kind:'member:14',createdBy:'admin'});
 const before=sqlite.prepare("SELECT * FROM user WHERE id='noPhone'").get();
 const result=await resendComplimentaryInvitation(db,actor,{email:'nophone@example.invalid',channels:['email']});
 assert.equal(result.activationUrl,`https://academy.example.invalid/invite/${invite.token}`);
 assert.equal(result.access,'Awaiting Activation');assert.ok(bodies.at(-1)!.includes('existing password has not been changed'));
 assert.deepEqual(sqlite.prepare("SELECT * FROM user WHERE id='noPhone'").get(),before);
});
test('email opt-out and unavailable provider do not fabricate delivery or roll back grants/invites',async()=>{
 sqlite.prepare("UPDATE user SET email_opted_in=0 WHERE id='noConsent'").run();
 await assert.rejects(createComplimentaryInvitation(db,actor,{email:'noconsent@example.invalid',days:30,channels:['email']}),/permitted/);
 const fallback=await createComplimentaryInvitation(db,actor,{email:'noconsent@example.invalid',days:30,channels:[]});assert.equal(fallback.access,'Active');assert.equal(fallback.email.status,'not_available');
 emailConfigured=false;const p=await createComplimentaryInvitation(db,actor,{email:'unconfigured@example.invalid',days:30,channels:['email']});assert.equal(p.email.status,'not_available');assert.ok(p.activationUrl);emailConfigured=true;
 const r=await resendComplimentaryInvitation(db,actor,{email:'unconfigured@example.invalid',channels:['email']});assert.equal(r.email.status,'sent');
});
test('concurrent creation/send claims send once; students cannot retrieve activation links',async()=>{
 const before=emailCount;
 const [a,b]=await Promise.all([createComplimentaryInvitation(db,actor,{email:'parallel@example.invalid',days:30,channels:['email']}),createComplimentaryInvitation(db,actor,{email:'parallel@example.invalid',days:30,channels:['email']})]);
 assert.equal(a.activationUrl,b.activationUrl);assert.equal(emailCount,before+1);
 const route=require('../app/api/admin/complimentary-invitation/route');
 session={id:'member',role:'student'};
 const response=await route.GET(new Request('https://local.invalid/api/admin/complimentary-invitation?email=parallel@example.invalid'));
 assert.equal(response.status,403);const body=await response.text();assert.ok(!body.includes(a.activationUrl));assert.ok(!body.includes(a.activationUrl.split('/').at(-1)));
 const post=await route.POST(new Request('https://local.invalid/api/admin/complimentary-invitation',{method:'POST',body:JSON.stringify({email:'parallel@example.invalid',channels:['email']})}));assert.equal(post.status,403);
 session={id:'admin',role:'admin'};
});
test('an expired custom access date is not renewed by resending the invitation',async()=>{
 const {createInvite}=require('./invites');
 await createInvite({email:'oldcustom@example.invalid',kind:'member:custom:2020-01-01',createdBy:'admin'});
 await assert.rejects(resendComplimentaryInvitation(db,actor,{email:'oldcustom@example.invalid',channels:['email']}),/access date has expired/);
});

test('ambiguous provider failure is not blindly resent',async()=>{
 sqlite.prepare("UPDATE user SET complimentaryAccessRevokedAt=NULL WHERE id='member'").run();
 const base=await getComplimentaryInvitationStatus(db,actor,'member@example.invalid');
 const key=sqlite.prepare("SELECT purpose_key FROM complimentary_invite_delivery WHERE email='member@example.invalid' AND channel='sms' ORDER BY created_at DESC LIMIT 1").get() as any;
 // A crash/timeout before a provider outcome was recorded remains uncertain.
 sqlite.prepare("UPDATE complimentary_invite_delivery SET status='uncertain' WHERE purpose_key=? AND channel='sms'").run(key.purpose_key);
 sqlite.prepare("DELETE FROM communication_log WHERE idempotency_key IN(SELECT communication_key FROM complimentary_invite_delivery WHERE purpose_key=? AND channel='sms')").run(key.purpose_key);
 const before=smsCount;await resendComplimentaryInvitation(db,actor,{email:'member@example.invalid',channels:['sms'],requestId:'uncertain-resend-1'});assert.equal(smsCount,before);
 const after=await getComplimentaryInvitationStatus(db,actor,'member@example.invalid');assert.equal(after.sms.status,'uncertain');assert.equal(after.accessExpiresAt,base.accessExpiresAt);
});

test('network timeout is an uncertain outcome and retry does not duplicate the SMS',async()=>{
 sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt,phone_number,sms_opted_in) VALUES(?,?,?,?,?,?,?,1)').run('network','Synthetic','network@example.invalid','student','2026-11-07','2026-11-07','+12025550127');
 smsTimeout=true;const result=await createComplimentaryInvitation(db,actor,{email:'network@example.invalid',days:30,channels:['sms']});smsTimeout=false;
 assert.equal(result.sms.status,'uncertain');const count=smsCount;
 await resendComplimentaryInvitation(db,actor,{email:'network@example.invalid',channels:['sms'],requestId:'retry-network-1'});assert.equal(smsCount,count);
});

test('email without acceptance evidence is uncertain and does not retry blindly',async()=>{
 emailNoId=true;const result=await createComplimentaryInvitation(db,actor,{email:'no-message-id@example.invalid',days:30,channels:['email']});emailNoId=false;
 assert.equal(result.email.status,'uncertain');const count=emailCount;
 await resendComplimentaryInvitation(db,actor,{email:'no-message-id@example.invalid',channels:['email'],requestId:'retry-ambiguous-email'});assert.equal(emailCount,count);
});

test('activation retains original delivery evidence and never reveals the consumed activation token',async()=>{
 const pending=await getComplimentaryInvitationStatus(db,actor,'parallel@example.invalid');
 const token=pending.activationUrl.split('/').at(-1);
 sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt,complimentaryAccessStartsAt,complimentaryAccessExpiresAt) VALUES(?,?,?,?,?,?,?,?)').run('activated','Synthetic','parallel@example.invalid','student','2026-11-07','2026-11-07',new Date().toISOString(),new Date(Date.now()+30*86400000).toISOString());
 sqlite.prepare('INSERT INTO account(id,accountId,providerId,userId,password,createdAt,updatedAt) VALUES(?,?,?,?,?,?,?)').run('cred','activated','credential','activated','hash-not-a-plaintext-password','2026-11-07','2026-11-07');
 sqlite.prepare('UPDATE invite SET usedAt=?,userId=? WHERE token=?').run(new Date().toISOString(),'activated',token);
 const result=await getComplimentaryInvitationStatus(db,actor,'parallel@example.invalid');
 assert.equal(result.email.status,'sent');assert.equal(result.account,'Activated');assert.equal(result.access,'Active');assert.ok(result.activationUrl.endsWith('/login'));assert.ok(!JSON.stringify(result).includes(token));
});

test('email server errors remain uncertain rather than creating an automatic duplicate',async()=>{
 emailFail=true;emailErrorStatus=503;
 const result=await createComplimentaryInvitation(db,actor,{email:'email-server-error@example.invalid',days:30,channels:['email']});
 emailFail=false;emailErrorStatus=undefined;assert.equal(result.email.status,'uncertain');
 const count=emailCount;await resendComplimentaryInvitation(db,actor,{email:'email-server-error@example.invalid',channels:['email'],requestId:'retry-server-error'});assert.equal(emailCount,count);
});
test('admin create action automatically delivers while student create is rejected',async()=>{
 const {createInviteAction}=require('../app/(app)/admin/users/invite-actions');
 const invalid=await createInviteAction('invalid-custom@example.invalid','member','custom','',['email']);assert.equal(invalid.ok,false);
 const result=await createInviteAction('action@example.invalid','member','30',undefined,['email']);
 assert.equal(result.ok,true);assert.equal(result.delivery.email.status,'sent');
 session={id:'member',role:'student'};await assert.rejects(createInviteAction('denied@example.invalid','member','30',undefined,['email']),/Forbidden/);session={id:'admin',role:'admin'};
});

test('existing provider confirmation is shown truthfully; suppression is not blindly retried',async()=>{
 sqlite.prepare("UPDATE communication_log SET status='delivered' WHERE idempotency_key IN(SELECT communication_key FROM complimentary_invite_delivery WHERE email='action@example.invalid')").run();
 assert.equal((await getComplimentaryInvitationStatus(db,actor,'action@example.invalid')).email.status,'delivered');
 sqlite.prepare("UPDATE communication_log SET status='suppressed' WHERE idempotency_key IN(SELECT communication_key FROM complimentary_invite_delivery WHERE email='action@example.invalid')").run();
 const before=emailCount;await resendComplimentaryInvitation(db,actor,{email:'action@example.invalid',channels:['email'],requestId:'suppressed-resend'});assert.equal(emailCount,before);
});

test('expired complimentary custom terms hide the activation fallback even if token TTL remains',async()=>{
 const status=await getComplimentaryInvitationStatus(db,actor,'oldcustom@example.invalid');
 assert.equal(status.access,'Expired');assert.equal(status.activationUrl,null);
});

test('failed invitation rotation preserves the previous valid token atomically',async()=>{
 const {createInvite,getInviteByToken,inviteStatus}=require('./invites');
 const previous=await createInvite({email:'atomic@example.invalid',kind:'member:30',createdBy:'admin'});
 sqlite.exec("CREATE TRIGGER fail_test_rotation BEFORE INSERT ON invite WHEN NEW.email='atomic@example.invalid' BEGIN SELECT RAISE(ABORT,'Injected insertion failure'); END;");
 try{await assert.rejects(createInvite({email:'atomic@example.invalid',kind:'member:60',createdBy:'admin'}),/Injected insertion failure/);}
 finally{sqlite.exec('DROP TRIGGER fail_test_rotation');}
 const retained=await getInviteByToken(previous.token);assert.equal(inviteStatus(retained),'valid');assert.equal(retained.expiresAt,previous.expiresAt);
});
