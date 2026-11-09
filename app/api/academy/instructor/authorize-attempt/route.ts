import { NextRequest, NextResponse } from "next/server";
import { requireMemberApiUser } from "@/lib/dal";
import { authorizeAdditionalQuizAttempt } from "@/lib/academy";

export async function POST(req: NextRequest) {
  try {
    const user = await requireMemberApiUser(req.headers);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json() as any;
    const userId = body.userId;
    const quizId = body.quizId;
    if (!userId || !quizId) return NextResponse.json({ error: "userId and quizId required" }, { status: 400 });
    const attempt = await authorizeAdditionalQuizAttempt(user.id, userId, quizId);
    return NextResponse.json({ attempt });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to authorize" }, { status: e.status || 400 });
  }
}
