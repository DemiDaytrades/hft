import 'server-only';
import type {ClassroomProvider} from './provider';
import {reconcileClassroom} from './service';
/** Provider notifications are hints: current provider tracks + HFT grants decide state.
 * In particular a late participant_left for an old SID must not close a new HFT lease.
 */
export async function processClassroomWebhook(db:D1Database,provider:ClassroomProvider,raw:string,authorization:string):Promise<{accepted:boolean;duplicate:boolean}>{
 const event=await provider.verifiedWebhook(raw,authorization);
 if(!event.room.startsWith('hft-'))return {accepted:false,duplicate:false};
 const sid=event.room.slice(4);
 if(!sid||!await db.prepare('SELECT 1 FROM classroom_room WHERE session_id=?').bind(sid).first())return {accepted:false,duplicate:false};
 const inserted=await db.prepare('INSERT OR IGNORE INTO classroom_webhook(event_id,session_id,event_type,provider_created_at) VALUES(?,?,?,?)').bind(event.id,sid,event.type,event.createdAt).run();
 const duplicate=inserted.meta.changes===0;
 // Reconciliation is idempotent; retry on duplicate delivery as prior cleanup may have failed.
 await reconcileClassroom(db,provider,sid,event);
 return {accepted:true,duplicate};
}
