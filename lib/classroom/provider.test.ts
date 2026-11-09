import {test} from 'node:test';
import assert from 'node:assert/strict';
import {AccessToken,TokenVerifier,ServerError} from 'livekit-server-sdk';
import {createHash} from 'node:crypto';
import {createLiveKitProvider} from './livekit';
const env={LIVEKIT_URL:'wss://fixture.livekit.cloud',LIVEKIT_API_KEY:'local-test-key',LIVEKIT_API_SECRET:'local-test-secret-not-a-real-credential'};
const audience={microphone:false,camera:false,screen:false};
test('unconfigured media fails closed without inventing tokens',async()=>{const p=createLiveKitProvider({});assert.equal(p.configured,false);await assert.rejects(p.issueToken('room','user',audience),/unavailable/);});
test('rejects nonCloud, insecure, credentialed and path URLs',()=>{for(const url of ['ws://fixture.livekit.cloud','wss://evil.example','wss://x:y@fixture.livekit.cloud','wss://fixture.livekit.cloud/path'])assert.throws(()=>createLiveKitProvider({...env,LIVEKIT_URL:url}),/LiveKit Cloud/);});
test('token is room scoped short lived receive only and independent sources',async()=>{const p=createLiveKitProvider(env);for(const grants of [audience,{...audience,microphone:true},{...audience,camera:true},{...audience,screen:true}]){const {token}=await p.issueToken('opaque-room','opaque-user',grants);const claims=await new TokenVerifier(env.LIVEKIT_API_KEY,env.LIVEKIT_API_SECRET).verify(token);assert.equal(claims.video?.room,'opaque-room');assert.equal(claims.sub,'opaque-user');assert.equal(Number(claims.exp)-Number(claims.nbf),60);assert.equal(claims.video?.canPublishData,false);assert.equal(claims.video?.roomAdmin,undefined);assert.deepEqual(claims.video?.canPublishSources,grants.microphone?['microphone']:grants.camera?['camera']:grants.screen?['screen_share']:[]);}});
test('real signed webhook verifies body hash, timestamp and metadata',async()=>{const p=createLiveKitProvider(env);const body=JSON.stringify({id:'evt-1',event:'participant_joined',createdAt:String(Math.floor(Date.now()/1000)),room:{name:'opaque-room'},participant:{identity:'opaque-user',sid:'PA_test'}});const token=new AccessToken(env.LIVEKIT_API_KEY,env.LIVEKIT_API_SECRET,{ttl:60});token.sha256=createHash('sha256').update(body).digest('base64');const jwt=await token.toJwt();assert.equal((await p.verifiedWebhook(body,jwt)).identity,'opaque-user');await assert.rejects(p.verifiedWebhook(body+' ',jwt),/checksum/);await assert.rejects(p.verifiedWebhook(body,'bad'));const old=JSON.stringify({id:'old',event:'room_finished',createdAt:'1',room:{name:'opaque-room'}});token.sha256=createHash('sha256').update(old).digest('base64');await assert.rejects(p.verifiedWebhook(old,await token.toJwt()),/timestamp/);});
test('strict removal passes an explicit current-token cutoff to Cloud',async()=>{const calls:unknown[][]=[];const client={removeParticipant:async(...args:unknown[])=>{calls.push(args);}};const p=createLiveKitProvider(env,client as never);await p.remove('room','person',Math.floor(Date.now()/1000)+1);assert.equal(calls.length,1);assert.equal(calls[0][0],'room');assert.equal(calls[0][1],'person');assert.equal(typeof (calls[0][2] as {revokeTokenTs:bigint}).revokeTokenTs,'bigint');assert.ok((calls[0][2] as {revokeTokenTs:bigint}).revokeTokenTs>BigInt(Math.floor(Date.now()/1000)));await assert.rejects(p.remove('room','person',1),/cutoff/);});
test('permission changes strictly remove the participant after independent source update',async()=>{const calls:{op:string;args:unknown[]}[]=[];const client={updateParticipant:async(...args:unknown[])=>{calls.push({op:'update',args});},removeParticipant:async(...args:unknown[])=>{calls.push({op:'remove',args});}};const p=createLiveKitProvider(env,client as never);await p.setPermissions('room','person',{...audience,microphone:true});assert.deepEqual(calls.map(c=>c.op),['update','remove']);const permission=(calls[0].args[2] as {permission:{canPublishSources:number[];canPublishData:boolean}}).permission;assert.deepEqual(permission.canPublishSources,[2]);assert.equal(permission.canPublishData,false);});
test('provider errors propagate rather than pretending cleanup succeeded',async()=>{const client={removeParticipant:async()=>{throw new Error('provider unavailable');}};await assert.rejects(createLiveKitProvider(env,client as never).remove('room','person'),/provider unavailable/);});
test('permission change for an absent participant still strictly revokes outstanding tokens',async()=>{let revoked=false;const client={updateParticipant:async()=>{throw new Error('participant does not exist');},removeParticipant:async()=>{revoked=true;}};await createLiveKitProvider(env,client as never).setPermissions('room','person',audience);assert.equal(revoked,true);});

test('deleting an already absent room is idempotent for canonical LiveKit not_found only',async()=>{
 const missing=new ServerError('Not Found','room does not exist',404,'not_found');
 const client={deleteRoom:async()=>{throw missing;}};
 await createLiveKitProvider(env,client as never).deleteRoom('already-ended-room');
});
test('room teardown propagates authentication, transport and noncanonical missing-room failures',async()=>{
 const failures=[
  new ServerError('Unauthorized','invalid credentials',401,'unauthenticated'),
  new ServerError('Not Found','wrong status',503,'not_found'),
  new ServerError('Not Found','wrong code',404,'unavailable'),
  new Error('room not found'),
  Object.assign(new Error('untyped failure'),{status:404,code:'not_found'}),
 ];
 for(const failure of failures){const client={deleteRoom:async()=>{throw failure;}};await assert.rejects(createLiveKitProvider(env,client as never).deleteRoom('ended-room'),error=>error===failure);}
});

test('canonical missing room has empty participant inventory; other provider failures remain failures',async()=>{
 const missing=new ServerError('Not Found','room absent',404,'not_found');assert.deepEqual(await createLiveKitProvider(env,{listParticipants:async()=>{throw missing;}} as never).list('ended-room'),[]);
 const failure=new ServerError('Unauthorized','unauthorized',401,'unauthenticated');await assert.rejects(createLiveKitProvider(env,{listParticipants:async()=>{throw failure;}} as never).list('ended-room'),error=>error===failure);
});
