import { commitLegacyQuestionnaire } from "./legacy-write";
import { legacyAuthorityError } from "./legacy-authority";
import { assertLegacyChangesAllowed, assertLegacyCreateAllowed } from "./legacy-authority";
import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import type {
  ConsultationQuestionnaire,
  ConsultationQuestionnaireData,
  QuestionnaireStatus,
} from "./types";

import { studentQuestionnaireData } from "./student-data";

function db() {
  return getCloudflareContext().env.DB;
}

function newId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function nowIso(): string {
  return new Date().toISOString();
}

function rowToQuestionnaire(row: any): ConsultationQuestionnaire {
  return {
    id: row.id,
    userId: row.user_id,
    bookingId: row.booking_id ?? null,
    status: row.status as QuestionnaireStatus,
    data: studentQuestionnaireData(row.data ? JSON.parse(row.data) : {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    submittedAt: row.submitted_at ?? null,
  };
}

export async function getQuestionnaireForUser(
  userId: string,
): Promise<ConsultationQuestionnaire | null> {
  const row = await db()
    .prepare(
      `SELECT * FROM "consultation_questionnaire" WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;`,
    )
    .bind(userId)
    .first<any>();
  if (!row) return null;
  return rowToQuestionnaire(row);
}

export async function getQuestionnaireForUserAndBooking(
  userId: string,
  bookingId: string,
): Promise<ConsultationQuestionnaire | null> {
  const row = await db()
    .prepare(
      `SELECT * FROM "consultation_questionnaire" WHERE user_id = ? AND booking_id = ? ORDER BY created_at DESC LIMIT 1;`,
    )
    .bind(userId, bookingId)
    .first<any>();
  if (!row) return null;
  return rowToQuestionnaire(row);
}

export async function createOrGetQuestionnaire(input: {
  userId: string;
  bookingId?: string | null;
}): Promise<ConsultationQuestionnaire> {
  const existing = input.bookingId
    ? await getQuestionnaireForUserAndBooking(input.userId, input.bookingId)
    : await getQuestionnaireForUser(input.userId);
  if (existing) return existing;
  await assertLegacyCreateAllowed(db(), input.userId);

  const id = newId();
  const now = nowIso();
  const inserted = await db()
    .prepare(
      `INSERT INTO "consultation_questionnaire"
         (id, user_id, booking_id, status, data, created_at, updated_at, submitted_at)
       SELECT ?, ?, ?, 'draft', '{}', ?, ?, NULL WHERE NOT EXISTS(SELECT 1 FROM student_intake_v2 WHERE student_user_id=? AND status IN ('draft','in_progress','completed'));`,
    )
    .bind(id, input.userId, input.bookingId ?? null, now, now, input.userId)
    .run();
  if (!inserted.meta.changes) throw legacyAuthorityError();

  const created = input.bookingId
    ? await getQuestionnaireForUserAndBooking(input.userId, input.bookingId)
    : await getQuestionnaireForUser(input.userId);
  if (!created) throw new Error("Failed to create questionnaire.");
  return created;
}

export async function saveQuestionnaireDraft(input: {
  id: string;
  userId: string;
  data: ConsultationQuestionnaireData;
}): Promise<ConsultationQuestionnaire> {
  const existing = await db()
    .prepare(`SELECT * FROM "consultation_questionnaire" WHERE id = ? AND user_id = ?;`)
    .bind(input.id, input.userId)
    .first<any>();
  if (!existing) throw new Error("Questionnaire not found.");
  if (existing.status === "submitted") throw new Error("Submitted questionnaires cannot be changed.");
  const previous = existing.data ? JSON.parse(existing.data) : {};
  const incoming = studentQuestionnaireData(input.data);
  await assertLegacyChangesAllowed(db(), input.userId, previous, incoming);
  const data = { ...previous, ...incoming };

  const now = nowIso();
  await commitLegacyQuestionnaire(db(), { previous: existing, data: JSON.stringify(data), actorUserId: input.userId,
    status: "draft", submittedAt: existing.submitted_at ?? null,
    source: "save_draft", now });

  const updated = await db()
    .prepare(`SELECT * FROM "consultation_questionnaire" WHERE id = ? AND user_id = ?;`)
    .bind(input.id, input.userId)
    .first<any>();
  if (!updated) throw new Error("Questionnaire not found after update.");
  return rowToQuestionnaire(updated);
}

export async function submitQuestionnaire(input: {
  id: string;
  userId: string;
  data: ConsultationQuestionnaireData;
}): Promise<ConsultationQuestionnaire> {
  const existing = await db()
    .prepare(`SELECT * FROM "consultation_questionnaire" WHERE id = ? AND user_id = ?;`)
    .bind(input.id, input.userId)
    .first<any>();
  if (!existing) throw new Error("Questionnaire not found.");
  if (existing.status === "submitted") throw new Error("Submitted questionnaires cannot be changed.");
  const previous = existing.data ? JSON.parse(existing.data) : {};
  const incoming = studentQuestionnaireData(input.data);
  await assertLegacyChangesAllowed(db(), input.userId, previous, incoming);
  const data = { ...previous, ...incoming };

  const now = nowIso();
  await commitLegacyQuestionnaire(db(), { previous: existing, data: JSON.stringify(data), actorUserId: input.userId,
    status: "submitted", submittedAt: now,
    source: "complete", now });

  const updated = await db()
    .prepare(`SELECT * FROM "consultation_questionnaire" WHERE id = ? AND user_id = ?;`)
    .bind(input.id, input.userId)
    .first<any>();
  if (!updated) throw new Error("Questionnaire not found after update.");
  return rowToQuestionnaire(updated);
}

export type { ConsultationQuestionnaire, ConsultationQuestionnaireData } from "./types";
