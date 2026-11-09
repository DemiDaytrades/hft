import 'server-only';
import { legacyAuthorityError, protectedLegacyChanges } from './legacy-authority';

/** Guard and write execute within one SQLite/D1 transaction. Snapshot follows only
 * a successful update; snapshot failure rolls the update back with the batch. */
export async function commitLegacyQuestionnaire(db:D1Database, input:{
  previous:any; data:string; status:string; submittedAt:string|null; source:string;
  restoredFrom?:string; now:string; actorUserId:string;
}) {
  if (typeof input.actorUserId !== "string" || !input.actorUserId.trim()) throw new Error("Authenticated correction actor is required.");
  const p=input.previous;
  const changed=protectedLegacyChanges(JSON.parse(p.data || '{}'),JSON.parse(input.data));
  const update=db.prepare(`UPDATE "consultation_questionnaire" SET data=?, status=?, submitted_at=?, updated_at=? WHERE id=? AND user_id=? AND COALESCE(data,'{}')=? AND updated_at IS ? AND (?=0 OR NOT EXISTS(SELECT 1 FROM student_intake_v2 WHERE student_user_id=? AND status IN ('draft','in_progress','completed')))`)
    .bind(input.data,input.status,input.submittedAt,input.now,p.id,p.user_id,p.data || '{}',p.updated_at,changed?1:0,p.user_id);
  const statements=[update];
  if(p.data!==input.data || input.source==='restore')statements.push(db.prepare(`INSERT INTO "consultation_questionnaire_revision" (id,questionnaire_id,user_id,data,status,questionnaire_updated_at,source,restored_from_revision_id,actor_user_id,created_at) SELECT ?,?,?,?,?,?,?,?,?,? WHERE changes()=1`)
    .bind(crypto.randomUUID().replace(/-/g,''),p.id,p.user_id,p.data || '{}',p.status,p.updated_at,input.source,input.restoredFrom??null,input.actorUserId,input.now));
  const result=await db.batch(statements);
  if(result[0].meta.changes!==1)throw legacyAuthorityError();
}
