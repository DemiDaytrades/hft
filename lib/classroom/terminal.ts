import type {ClassroomProvider,ProviderEvent,ProviderParticipant} from './provider';

type CleanupRow={id:string;user_id:string|null;grants_json:string|null};
type TerminalProvider=Pick<ClassroomProvider,'remove'|'deleteRoom'>&Partial<Pick<ClassroomProvider,'list'>>;
/** ENDED is durable authority. DeleteRoom alone does not invalidate bearer tokens.
 * One durable barrier merges identities across overlapping attempts. A successful
 * attempt acknowledges only the exact identity set it revoked, never newer work.
 */
export async function reconcileTerminalClassroom(db:D1Database,provider:TerminalProvider,sid:string,participants:readonly {id:string}[],cleanupPending:boolean,event?:Pick<ProviderEvent,'identity'>){
 const jobs=(await db.prepare('SELECT id,user_id,grants_json FROM classroom_cleanup WHERE session_id=?').bind(sid).all<CleanupRow>()).results;
 const identities=new Set<string>();
 if(jobs.length||cleanupPending)for(const participant of participants)identities.add('hft-'+participant.id);
 for(const job of jobs){
  if(job.user_id)identities.add('hft-'+job.user_id);
  const saved=JSON.parse(job.grants_json??'{}') as {terminalIdentities?:unknown};
  if(Array.isArray(saved.terminalIdentities))for(const id of saved.terminalIdentities)if(typeof id==='string'&&id)identities.add(id);
 }
 if(event?.identity)identities.add(event.identity);
 const barrier='terminal:'+sid;
 async function persistBarrier(){await db.batch([
  db.prepare(`INSERT INTO classroom_cleanup(id,session_id,operation,grants_json,created_at) VALUES(?,?,'delete',?,?) ON CONFLICT(id) DO UPDATE SET grants_json=json_object('terminalIdentities',json((SELECT json_group_array(value) FROM (SELECT value FROM json_each(COALESCE(json_extract(classroom_cleanup.grants_json,'$.terminalIdentities'),'[]')) UNION SELECT value FROM json_each(json_extract(excluded.grants_json,'$.terminalIdentities')) ORDER BY value))))`).bind(barrier,sid,JSON.stringify({terminalIdentities:[...identities].sort()}),new Date().toISOString()),
  db.prepare('UPDATE classroom_room SET cleanup_pending=1 WHERE session_id=?').bind(sid),
 ]);}
 // Persist a verified event's revocation intent before any remote await.
 if(jobs.length||cleanupPending||event)await persistBarrier();
 let live:ProviderParticipant[]=[];let inventoryFailed=false;
 try{if(provider.list)live=await provider.list('hft-'+sid);}catch{inventoryFailed=true;}
 if(!jobs.length&&!cleanupPending&&!event&&!live.length&&!inventoryFailed)return;
 for(const participant of live)identities.add(participant.identity);
 await persistBarrier();
 const claimed=await db.prepare('SELECT grants_json FROM classroom_cleanup WHERE id=?').bind(barrier).first<{grants_json:string}>();
 // A concurrent attempt may already have completed the same merged work.
 if(!claimed)return;
 const toRevoke=(JSON.parse(claimed.grants_json) as {terminalIdentities:string[]}).terminalIdentities;
 // Attempt every revocation even when one provider request fails. Absent and
 // previously removed roster identities may still possess an unexpired token.
 const revoked=await Promise.allSettled(toRevoke.map(identity=>provider.remove('hft-'+sid,identity)));
 if(inventoryFailed||revoked.some(result=>result.status==='rejected'))return;
 const beforeDelete=await db.prepare('SELECT grants_json FROM classroom_cleanup WHERE id=?').bind(barrier).first<{grants_json:string}>();
 if(beforeDelete?.grants_json!==claimed.grants_json)return;
 try{await provider.deleteRoom('hft-'+sid);}catch{return;}
 const acknowledged=JSON.stringify(jobs.filter(job=>job.id!==barrier).map(job=>job.id));
 await db.batch([
  db.prepare('DELETE FROM classroom_cleanup WHERE session_id=? AND id IN (SELECT value FROM json_each(?))').bind(sid,acknowledged),
  // A late signed event may have merged another identity while APIs were in flight.
  db.prepare('DELETE FROM classroom_cleanup WHERE id=? AND grants_json=?').bind(barrier,claimed.grants_json),
  db.prepare('UPDATE classroom_room SET cleanup_pending=CASE WHEN EXISTS(SELECT 1 FROM classroom_cleanup WHERE session_id=?) THEN 1 ELSE 0 END WHERE session_id=?').bind(sid,sid),
 ]);
}
