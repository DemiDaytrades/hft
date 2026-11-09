import { NextRequest, NextResponse } from "next/server";
import { requireMemberApiUser } from "@/lib/dal";
import { submitQuizAttempt } from "@/lib/academy";

export async function POST(req: NextRequest) {
  try {
    const user = await requireMemberApiUser(req.headers);
    const body = await req.json() as any;
    const attemptId = body.attemptId;
    const responses = body.responses;
    if (!attemptId || !Array.isArray(responses)) return NextResponse.json({ error: "attemptId and responses required" }, { status: 400 });
    const result = await submitQuizAttempt(attemptId, responses, user.id);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to submit quiz" }, { status: e.status || 400 });
  }
}
