import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ConsultationQuestionnaire } from "./types";

function db() {
  return getCloudflareContext().env.DB;
}

function rowToQuestionnaire(row: any): ConsultationQuestionnaire {
  return {
    id: row.id,
    userId: row.user_id,
    bookingId: row.booking_id ?? null,
    status: row.status,
    data: row.data ? JSON.parse(row.data) : {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    submittedAt: row.submitted_at ?? null,
  };
}

export async function getQuestionnaireForUserId(
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
