import { MONEY_LESSON } from "../curriculum/what-is-money";

/** Curriculum installation only. Never enrolls students or modifies progress. */
export function moneyLessonRows() {
  const lesson = MONEY_LESSON;
  const now = "2026-11-07T00:00:00.000Z";
  const rows: { table: string; values: Record<string, string | number | null> }[] = [
    { table: "academy_course", values: { id: lesson.courseId, title: "Forex Foundations", slug: "local-forex-foundations", description: "Local reference curriculum: What Is Money?", track: "Foundations", status: "published", sort_order: 0, created_at: now, updated_at: now } },
    { table: "academy_module", values: { id: lesson.moduleId, course_id: lesson.courseId, title: lesson.stage, description: "The foundations of money, currency, and foreign exchange.", sort_order: 0, status: "published", created_at: now, updated_at: now } },
    { table: "academy_lesson", values: { id: lesson.id, module_id: lesson.moduleId, title: lesson.title, description: lesson.purpose, lesson_type: "interactive", content: JSON.stringify(lesson), video_url: null, estimated_minutes: 30, sort_order: 0, status: "published", requires_quiz: 1, requires_assignment: 1, requires_practical: 0, passing_gate: 1, created_at: now, updated_at: now } },
    { table: "academy_quiz", values: { id: lesson.quizId, lesson_id: lesson.id, module_id: null, checkpoint_id: null, title: "What Is Money? — Final Mastery Check", instructions: "Complete the mixed-format knowledge check. Written answers require instructor review. At least 80% and every required mastery concept must pass.", passing_score_percent: 80, max_attempts: 100, time_limit_minutes: null, randomize_questions: 0, randomize_answers: 0, require_pass_to_unlock: 1, sort_order: 0, created_at: now, updated_at: now } },
    { table: "academy_assignment", values: { id: lesson.assignmentId, lesson_id: lesson.id, module_id: null, title: "What Is Money? — Adaptive Homework", instructions: "Complete the homework branch assigned by your reviewed knowledge check in the interactive lesson.", assignment_type: "homework", requires_file_upload: 0, allowed_file_types: "[]", requires_approval_to_unlock: 1, points: null, rubric: "Instructor must verify the assigned branch, accurate concepts, and original explanations before approval. Branch rubrics live in the versioned curriculum.", sort_order: 0, created_at: now, updated_at: now } },
  ];
  return rows;
}

export async function installMoneyLesson(db: any) {
  const lesson = MONEY_LESSON;
  const rows = moneyLessonRows();
  // Check every existing record before making any changes. Content/version conflicts
  // require deliberate curriculum migration rather than silent replacement.
  const missing = [];
  for (const row of rows) {
    const existing = await db.prepare(`SELECT * FROM ${row.table} WHERE id = ?`).bind(row.values.id).first();
    if (existing) {
      const mismatch = Object.entries(row.values).some(([key, value]) => key !== "created_at" && key !== "updated_at" && existing[key] !== value);
      if (mismatch) throw new Error(`Curriculum conflict in ${row.table} (${row.values.id}); existing data/version was not overwritten.`);
    } else missing.push(row);
  }
  if (missing.length) {
    const statements = missing.map(({ table, values }) => {
      const keys = Object.keys(values);
      return db.prepare(`INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`).bind(...Object.values(values));
    });
    await db.batch(statements);
  }
  return { inserted: missing.length, courseId: lesson.courseId, moduleId: lesson.moduleId, lessonId: lesson.id, quizId: lesson.quizId, assignmentId: lesson.assignmentId };
}
