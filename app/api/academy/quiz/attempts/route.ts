import { NextRequest, NextResponse } from "next/server";
import { requireMemberApiUser } from "@/lib/dal";
import { requireAcademyResource } from "@/lib/academy";
import { getUserQuizAttempts, getMissedTopicsForReview } from "@/lib/academy";

export async function GET(req: NextRequest) {
  try {
    const user = await requireMemberApiUser(req.headers);
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");
    if (!quizId) return NextResponse.json({ error: "quizId required" }, { status: 400 });
    await requireAcademyResource(user.id, "quiz", quizId);
    const attempts = await getUserQuizAttempts(user.id, quizId);
    const missed = await getMissedTopicsForReview(user.id, quizId);
    return NextResponse.json({ attempts, missedTopics: missed });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch attempts" }, { status: e.status || 400 });
  }
}
