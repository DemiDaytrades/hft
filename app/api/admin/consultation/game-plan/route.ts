import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/dal";
import { getQuestionnaireForUserId } from "@/lib/consultation-questionnaire/admin";
import { ensureSeries, getLatestVersion, getVersionHistory, getPublishedForUser, generateDraft, updateVersion, approveVersion, publishVersion, createRevision } from "@/lib/consultation-game-plan";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const questionnaire = await getQuestionnaireForUserId(userId);
    if (!questionnaire) return NextResponse.json({ series: null, latest: null, history: [], published: null });
    const series = await ensureSeries(userId, (questionnaire as any).id);
    const latest = await getLatestVersion((series as any).id);
    const history = await getVersionHistory((series as any).id);
    const published = await getPublishedForUser(userId);
    return NextResponse.json({ series, latest, history, published, questionnaire });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json() as any;
    const userId = body.userId;
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const questionnaire = await getQuestionnaireForUserId(userId);
    if (!questionnaire) return NextResponse.json({ error: "Questionnaire required" }, { status: 400 });
    const qid = (questionnaire as any).id;
    const qdata = (questionnaire as any).data || {};

    if (body.action === "generate-draft") {
      const latest = await generateDraft(userId, qid, qdata);
      return NextResponse.json({ latest });
    }
    if (body.action === "update") {
      if (!body.versionId) return NextResponse.json({ error: "versionId required" }, { status: 400 });
      const latest = await updateVersion(body.versionId, userId, body.updates || {});
      return NextResponse.json({ latest });
    }
    if (body.action === "review") {
      if (!body.versionId) return NextResponse.json({ error: "versionId required" }, { status: 400 });
      const latest = await updateVersion(body.versionId, userId, { status: "review" });
      return NextResponse.json({ latest });
    }
    if (body.action === "approve") {
      if (!body.versionId) return NextResponse.json({ error: "versionId required" }, { status: 400 });
      const latest = await approveVersion(body.versionId, userId, (admin as any).id);
      return NextResponse.json({ latest });
    }
    if (body.action === "publish") {
      if (!body.versionId) return NextResponse.json({ error: "versionId required" }, { status: 400 });
      const latest = await publishVersion(body.versionId, userId);
      return NextResponse.json({ latest });
    }
    if (body.action === "create-revision") {
      if (!body.versionId) return NextResponse.json({ error: "versionId required" }, { status: 400 });
      const latest = await createRevision(body.versionId, userId);
      return NextResponse.json({ latest });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}
