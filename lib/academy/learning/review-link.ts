/** Queue rows resolve their lesson on the server; never infer IDs from quiz names. */
export function reviewLink(row: { user_id: string; learning_lesson_id?: string | null; quiz_id?: string }) {
  const student = encodeURIComponent(row.user_id);
  if (row.learning_lesson_id) return `/admin/academy/learning?studentId=${student}&lessonId=${encodeURIComponent(row.learning_lesson_id)}`;
  return `/admin/academy/review/${student}${row.quiz_id ? `?quizId=${encodeURIComponent(row.quiz_id)}` : ''}`;
}
