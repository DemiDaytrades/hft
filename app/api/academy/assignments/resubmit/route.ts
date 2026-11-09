import { NextRequest, NextResponse } from "next/server";
import { requireMemberApiUser } from "@/lib/dal";
import { resubmitAssignment } from "@/lib/academy";

export async function POST(req: NextRequest) {
  try {
    const user = await requireMemberApiUser(req.headers);
    const body = await req.json() as any;
    const originalSubmissionId = body.originalSubmissionId;
    const responseText = body.responseText;
    const fileUrls = body.fileUrls;
    if (!originalSubmissionId) return NextResponse.json({ error: "originalSubmissionId required" }, { status: 400 });
    const sub = await resubmitAssignment(originalSubmissionId, user.id, responseText || '', fileUrls);
    return NextResponse.json({ submission: sub });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to resubmit" }, { status: e.status || 400 });
  }
}
