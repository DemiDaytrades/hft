import { NextRequest, NextResponse } from "next/server";
import { requireMemberApiUser } from "@/lib/dal";
import { startOrUpdateAssignment, submitAssignment } from "@/lib/academy";

export async function POST(req: NextRequest) {
  try {
    const user = await requireMemberApiUser(req.headers);
    const body = await req.json() as any;
    const assignmentId = body.assignmentId;
    const action = body.action;
    const responseText = body.responseText;
    const fileUrls = body.fileUrls;
    if (!assignmentId) return NextResponse.json({ error: "assignmentId required" }, { status: 400 });
    if (action === 'save' || action === 'start') {
      const sub = await startOrUpdateAssignment(user.id, assignmentId, responseText, fileUrls);
      return NextResponse.json({ submission: sub });
    } else if (action === 'submit') {
      const sub = await startOrUpdateAssignment(user.id, assignmentId, responseText, fileUrls);
      const submitted = await submitAssignment(sub.id, user.id);
      return NextResponse.json({ submission: submitted });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: e.status || 400 });
  }
}
