import { commitLegacyQuestionnaire } from "@/lib/consultation-questionnaire/legacy-write";
import { assertLegacyChangesAllowed } from "@/lib/consultation-questionnaire/legacy-authority";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/dal";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const db = getCloudflareContext().env.DB;
    const rows = await db
      .prepare(`SELECT * FROM "consultation_questionnaire_revision" WHERE user_id = ? ORDER BY created_at DESC;`)
      .bind(userId)
      .all<any>();
    return NextResponse.json({ revisions: rows.results || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireAdmin();
    const body = await request.json() as { action?: string; userId?: string; revisionId?: string };
    if (body.action !== "restore" || !body.userId || !body.revisionId) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const db = getCloudflareContext().env.DB;
    const now = new Date().toISOString();
    const revision = await db
      .prepare(`SELECT * FROM "consultation_questionnaire_revision" WHERE id = ? AND user_id = ?;`)
      .bind(body.revisionId, body.userId)
      .first<any>();
    if (!revision) return NextResponse.json({ error: "revision not found" }, { status: 404 });
    const current = await db
      .prepare(`SELECT * FROM "consultation_questionnaire" WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;`)
      .bind(body.userId)
      .first<any>();
    if (!current) return NextResponse.json({ error: "questionnaire not found" }, { status: 404 });
    await assertLegacyChangesAllowed(db, body.userId, JSON.parse(current.data || "{}"), { ...Object.fromEntries(Object.keys(JSON.parse(current.data || "{}")).map(key => [key, undefined])), ...JSON.parse(revision.data || "{}") });
    await commitLegacyQuestionnaire(db, { previous: current, data: revision.data, actorUserId: actor.id, status: revision.status,
      submittedAt: current.submitted_at ?? null, source: 'restore', restoredFrom: body.revisionId, now });
    const updated = await db
      .prepare(`SELECT * FROM "consultation_questionnaire" WHERE id = ? AND user_id = ?;`)
      .bind(current.id, body.userId)
      .first<any>();
    return NextResponse.json({ questionnaire: { id: updated.id, userId: updated.user_id, status: updated.status, data: JSON.parse(updated.data || "{}"), updatedAt: updated.updated_at } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: e.status || 500 });
  }
}
