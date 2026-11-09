import { NextRequest, NextResponse } from "next/server";
import { requireMemberApiUser } from "@/lib/dal";
import { reviewAssignment } from "@/lib/academy";

export async function POST(req: NextRequest) {
  try {
    const user = await requireMemberApiUser(req.headers);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json() as any;
    const submissionId = body.submissionId;
    const action = body.action;
    const feedback = body.feedback;
    const score = body.score;
    if (!submissionId || !action) return NextResponse.json({ error: "submissionId and action required" }, { status: 400 });
    if (action !== 'approve' && action !== 'request_revision') {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    const result = await reviewAssignment(submissionId, user.id, action, feedback || '', score);
    return NextResponse.json({ submission: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to review" }, { status: e.status || 400 });
  }
}
