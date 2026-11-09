import { NextRequest, NextResponse } from "next/server";
import { requireMemberApiUser } from "@/lib/dal";
import { requireAcademyResource } from "@/lib/academy";
import { isCheckpointComplete, updateCheckpointProgress, getCheckpointParts } from "@/lib/academy";

export async function GET(req: NextRequest) {
  try {
    const user = await requireMemberApiUser(req.headers);
    const { searchParams } = new URL(req.url);
    const checkpointId = searchParams.get("checkpointId");
    if (!checkpointId) return NextResponse.json({ error: "checkpointId required" }, { status: 400 });
    await requireAcademyResource(user.id, "checkpoint", checkpointId);
    const complete = await isCheckpointComplete(user.id, checkpointId);
    await updateCheckpointProgress(user.id, checkpointId);
    const parts = await getCheckpointParts(checkpointId);
    return NextResponse.json({ complete, parts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: e.status || 400 });
  }
}
