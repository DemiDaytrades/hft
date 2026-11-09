import { NextRequest, NextResponse } from "next/server";
import { requireMemberApiUser } from "@/lib/dal";
import { requireAcademyResource } from "@/lib/academy";
import { startQuizAttempt } from "@/lib/academy";

export async function POST(req: NextRequest) {
  try {
    const user = await requireMemberApiUser(req.headers);
    const body = await req.json() as any;
    const quizId = body.quizId;
    if (!quizId) return NextResponse.json({ error: "quizId required" }, { status: 400 });
    await requireAcademyResource(user.id, "quiz", quizId);
    const attempt = await startQuizAttempt(user.id, quizId);
    return NextResponse.json({ attempt });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to start quiz" }, { status: e.status || 400 });
  }
}
