import {protectedNumberedChanges} from './consultation-review/numbered';
import { assertLegacyChangesAllowed, assertLegacyCreateAllowed, protectedLegacyChanges, legacyAuthorityError } from "./consultation-questionnaire/legacy-authority";
import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type IntakeStatus = "draft" | "completed";

export async function getLatestIntake(userId: string) {
  const db = (await getCloudflareContext()).env.DB;
  return db
    .prepare(`SELECT * FROM "student_intake" WHERE "userId" = ? ORDER BY "version" DESC, "createdAt" DESC LIMIT 1;`)
    .bind(userId)
    .first<any>();
}

export async function createDraft(userId: string, createdBy: string) {
  const db = (await getCloudflareContext()).env.DB;
  await assertLegacyCreateAllowed(db, userId);
  const now = new Date().toISOString();
  const id = crypto.randomUUID().replace(/-/g, "");
  const prev = await db.prepare(`SELECT MAX(version) AS v FROM "student_intake" WHERE "userId" = ?;`).bind(userId).first<{ v: number | null }>();
  const version = (prev?.v ?? 0) + 1;
  const inserted = await db.prepare(`INSERT INTO "student_intake" (id, "userId", status, version, "createdBy", data, "createdAt", "updatedAt") SELECT ?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM student_intake_v2 WHERE student_user_id=? AND status IN ('draft','in_progress','completed'));`)
    .bind(id, userId, "draft", version, createdBy, "{}", now, now, userId).run();
  if (!inserted.meta.changes) throw legacyAuthorityError();
  return { id, version };
}

export async function saveDraft(id: string, data: any, expectedUserId?: string, actorId?: string) {
  const db = (await getCloudflareContext()).env.DB;
  const existing = await db.prepare('SELECT * FROM "student_intake" WHERE id = ?;').bind(id).first<any>();
  if (!existing || (expectedUserId && existing.userId !== expectedUserId)) throw new Error("Intake not found.");
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid legacy intake answers.");
  const previous = JSON.parse(existing.data || "{}");
  await assertLegacyChangesAllowed(db, existing.userId, previous, data);
  const merged = { ...previous, ...data };
  const now = new Date().toISOString();
  if (JSON.stringify(previous) === JSON.stringify(merged)) return id;
  // New existing-schema version preserves the previous JSON and completion metadata.
  const nextId = crypto.randomUUID().replace(/-/g, "");
  const inserted = await db.prepare(`INSERT INTO "student_intake" (id, "userId", status, version, "createdBy", data, "createdAt", "updatedAt") SELECT ?, ?, 'draft', COALESCE(MAX(version), 0) + 1, ?, ?, ?, ? FROM "student_intake" WHERE "userId" = ? HAVING (?=0 OR NOT EXISTS(SELECT 1 FROM student_intake_v2 WHERE student_user_id=? AND status IN ('draft','in_progress','completed')));`)
    .bind(nextId, existing.userId, actorId || existing.createdBy || "admin", JSON.stringify(merged), now, now, existing.userId, (protectedLegacyChanges(previous, merged)||protectedNumberedChanges(previous,merged)) ? 1 : 0, existing.userId).run();
  if (!inserted.meta.changes) throw legacyAuthorityError();
  return nextId;
}

export async function completeIntake(id: string, expectedUserId?: string) {
  const db = (await getCloudflareContext()).env.DB;
  const existing = await db.prepare('SELECT * FROM "student_intake" WHERE id = ?;').bind(id).first<any>();
  if (!existing || (expectedUserId && existing.userId !== expectedUserId)) throw new Error("Intake not found.");
  const now = new Date().toISOString();
  await db.prepare(`UPDATE "student_intake" SET status = 'completed', "completedAt" = ?, "updatedAt" = ? WHERE id = ?;`)
    .bind(now, now, id).run();
}
