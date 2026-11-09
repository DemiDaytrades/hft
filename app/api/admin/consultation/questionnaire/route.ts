import { commitLegacyQuestionnaire } from "@/lib/consultation-questionnaire/legacy-write";
import { assertLegacyChangesAllowed, assertLegacyCreateAllowed, hasCanonicalIntake, legacyAuthorityError, PROTECTED_LEGACY_FACT_KEYS } from "@/lib/consultation-questionnaire/legacy-authority";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/dal";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { db, newId, nowIso } from "@/lib/academy";

export const dynamic = "force-dynamic";

function rowToQuestionnaire(row: any) {
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

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const dbCtx = getCloudflareContext().env.DB;
    const row = await dbCtx
      .prepare(`SELECT * FROM "consultation_questionnaire" WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;`)
      .bind(userId)
      .first<any>();
    const canonicalIntakeExists = await hasCanonicalIntake(dbCtx, userId);
    if (!row) return NextResponse.json({ questionnaire: null, canonicalIntakeExists, protectedKeys: PROTECTED_LEGACY_FACT_KEYS });
    return NextResponse.json({ questionnaire: rowToQuestionnaire(row), canonicalIntakeExists, protectedKeys: PROTECTED_LEGACY_FACT_KEYS });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireAdmin();
    const body = await request.json() as {
      action?: string;
      userId?: string;
      id?: string;
      data?: any;
      source?: string;
    };
    const dbCtx = getCloudflareContext().env.DB;
    const now = nowIso();

    if (body.action === "create" || body.action === "get-or-create") {
      if (!body.userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
      const existing = await dbCtx
        .prepare(`SELECT * FROM "consultation_questionnaire" WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;`)
        .bind(body.userId)
        .first<any>();
      if (existing) return NextResponse.json({ questionnaire: rowToQuestionnaire(existing) });
      await assertLegacyCreateAllowed(dbCtx, body.userId);
      const id = newId();
      const inserted = await dbCtx
        .prepare(`INSERT INTO "consultation_questionnaire" (id, user_id, booking_id, status, data, created_at, updated_at, submitted_at) SELECT ?, ?, NULL, 'draft', '{}', ?, ?, NULL WHERE NOT EXISTS(SELECT 1 FROM student_intake_v2 WHERE student_user_id=? AND status IN ('draft','in_progress','completed'));`)
        .bind(id, body.userId, now, now, body.userId)
        .run();
      if (!inserted.meta.changes) throw legacyAuthorityError();
      const created = await dbCtx
        .prepare(`SELECT * FROM "consultation_questionnaire" WHERE id = ?;`)
        .bind(id)
        .first<any>();
      return NextResponse.json({ questionnaire: rowToQuestionnaire(created) });
    }

    if (body.action === "save") {
      if (!body.id || !body.userId) return NextResponse.json({ error: "id and userId required" }, { status: 400 });
      const existing = await dbCtx
        .prepare(`SELECT * FROM "consultation_questionnaire" WHERE id = ? AND user_id = ?;`)
        .bind(body.id, body.userId)
        .first<any>();
      if (!existing) return NextResponse.json({ error: "Questionnaire not found" }, { status: 404 });
      const previous = JSON.parse(existing.data || "{}");
      if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) return NextResponse.json({ error: "Invalid answer payload" }, { status: 400 });
      await assertLegacyChangesAllowed(dbCtx, body.userId, previous, body.data);
      const incoming = JSON.stringify({ ...previous, ...body.data });
      await commitLegacyQuestionnaire(dbCtx, { previous: existing, data: incoming, actorUserId: actor.id,
        status: existing.status === "draft" ? "in_progress" : existing.status,
        submittedAt: existing.submitted_at ?? null,
        source: (body.source === "autosave" ? "autosave" : "save_draft"), now });
      const updated = await dbCtx
        .prepare(`SELECT * FROM "consultation_questionnaire" WHERE id = ? AND user_id = ?;`)
        .bind(body.id, body.userId)
        .first<any>();
      return NextResponse.json({ questionnaire: rowToQuestionnaire(updated) });
    }

    if (body.action === "complete") {
      if (!body.id || !body.userId) return NextResponse.json({ error: "id and userId required" }, { status: 400 });
      const existing = await dbCtx
        .prepare(`SELECT * FROM "consultation_questionnaire" WHERE id = ? AND user_id = ?;`)
        .bind(body.id, body.userId)
        .first<any>();
      if (!existing) return NextResponse.json({ error: "Questionnaire not found" }, { status: 404 });
      const previous = JSON.parse(existing.data || "{}");
      if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) return NextResponse.json({ error: "Invalid answer payload" }, { status: 400 });
      await assertLegacyChangesAllowed(dbCtx, body.userId, previous, body.data);
      const incoming = JSON.stringify({ ...previous, ...body.data });
      await commitLegacyQuestionnaire(dbCtx, { previous: existing, data: incoming, actorUserId: actor.id,
        status: "submitted",
        submittedAt: existing.submitted_at ?? now,
        source: "complete", now });
      const updated = await dbCtx
        .prepare(`SELECT * FROM "consultation_questionnaire" WHERE id = ? AND user_id = ?;`)
        .bind(body.id, body.userId)
        .first<any>();
      return NextResponse.json({ questionnaire: rowToQuestionnaire(updated) });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: e.status || 500 });
  }
}
