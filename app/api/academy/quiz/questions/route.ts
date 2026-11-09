import { NextRequest, NextResponse } from "next/server";
import { requireMemberApiUser } from "@/lib/dal";
import { requireAcademyResource } from "@/lib/academy";
import { getQuizById, getQuizQuestions, getQuestionChoices } from "@/lib/academy";

export async function GET(req: NextRequest) {
  try {
    const user = await requireMemberApiUser(req.headers);
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");
    if (!quizId) return NextResponse.json({ error: "quizId required" }, { status: 400 });
    await requireAcademyResource(user.id, "quiz", quizId);
    const quiz = await getQuizById(quizId);
    const questions = await getQuizQuestions(quizId, quiz?.randomize_questions === 1);
    const result = [];
    for (const q of questions) {
      const choices = await getQuestionChoices(q.id, quiz?.randomize_answers === 1);
      result.push({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        points: q.points,
        choices: choices.map((c: any) => ({ id: c.id, choice_text: c.choice_text, sort_order: c.sort_order }))
      });
    }
    return NextResponse.json({ quiz: { id: quiz.id, title: quiz.title, passing_score_percent: quiz.passing_score_percent, max_attempts: quiz.max_attempts }, questions: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: e.status || 500 });
  }
}
