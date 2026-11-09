import {schoolReference} from './school/reference';
import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { assertLifecycleActive } from "../student-lifecycle";
import { interactiveLesson } from "./learning/policy";

function db() {
  return getCloudflareContext().env.DB;
}

function newId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function nowIso(): string {
  return new Date().toISOString();
}

export async function listPublishedCourses() {
  const { results } = await db()
    .prepare(`SELECT * FROM "academy_course" WHERE status = 'published' ORDER BY sort_order ASC, title ASC;`)
    .all<any>();
  return results;
}

export async function getCourseWithStructure(courseId: string) {
  const course = await db().prepare(`SELECT * FROM "academy_course" WHERE id = ? AND status = 'published';`).bind(courseId).first<any>();
  if (!course) return null;
  const { results: modules } = await db()
    .prepare(`SELECT * FROM "academy_module" WHERE course_id = ? AND status = 'published' ORDER BY sort_order ASC, id ASC;`)
    .bind(courseId)
    .all<any>();
  const moduleIds = modules.map((m: any) => m.id);
  let lessons: any[] = [];
  if (moduleIds.length > 0) {
    const placeholders = moduleIds.map(() => "?").join(",");
    const res = await db()
      .prepare(`SELECT * FROM "academy_lesson" WHERE module_id IN (${placeholders}) AND status = 'published' ORDER BY sort_order ASC, id ASC;`)
      .bind(...moduleIds)
      .all<any>();
    lessons = res.results;
  }
  lessons = orderLessons(modules, lessons);
  return { course, modules, lessons };
}

export async function getUserAssignments(userId: string) {
  const { results } = await db()
    .prepare(
      `SELECT a.*, c.title as course_title, c.slug as course_slug, c.description as course_description, c.track as course_track
       FROM "student_course_assignment" a
       JOIN "academy_course" c ON c.id = a.course_id
       WHERE a.user_id = ? AND a.status = 'assigned' AND c.status = 'published' ORDER BY a.assigned_at DESC;`,
    )
    .bind(userId)
    .all<any>();
  return results;
}

export async function isCourseAssigned(userId: string, courseId: string) {
  const row = await db()
    .prepare(`SELECT id FROM "student_course_assignment" WHERE user_id = ? AND course_id = ? AND status = 'assigned';`)
    .bind(userId, courseId)
    .first<any>();
  return !!row;
}

export async function getUserLessonProgress(userId: string, lessonId: string) {
  return db()
    .prepare(`SELECT * FROM "student_lesson_progress" WHERE user_id = ? AND lesson_id = ?;`)
    .bind(userId, lessonId)
    .first<any>();
}

export async function ensureLessonAvailable(userId: string, lessonId: string, courseId: string) {
  if (!await isCourseAssigned(userId, courseId)) return false;
  const structure = await getCourseWithStructure(courseId);
  if (!structure || structure.course.status !== "published") return false;
  const ordered = structure.lessons;
  const idx = ordered.findIndex((l: any) => l.id === lessonId);
  if (idx === -1) return false;
  if (idx === 0) return true;
  // Every earlier lesson must be completed; stale progress cannot bypass a gap.
  for (const previous of ordered.slice(0, idx)) {
    if ((await getUserLessonProgress(userId, previous.id))?.status !== 'completed') {
      const {isPlacementSkipApproved}=await import('../learning-path/access');
      if(await isPlacementSkipApproved(db(),userId,previous.id)) continue;
      return false;
    }
    if (interactiveLesson(previous.content)) {
      const { isLearningGateSatisfied } = await import("./learning/service");
      if (!await isLearningGateSatisfied(db(),userId,previous)) return false;
    }
  }
  return true;
}

export async function markLessonComplete(userId: string, lessonId: string) {
  const {lesson}=await requireLessonAccess(userId, lessonId);
  if(schoolReference(lesson.content))throw academyError("Use the versioned curriculum workflow.",400);
  if(interactiveLesson(lesson.content)) {
    const { learningAction }=await import("./learning/service");
    await learningAction(userId,lessonId,{action:"complete"});
    return;
  }
  const existing = await getUserLessonProgress(userId, lessonId);
  const now = nowIso();
  if (!existing) {
    await db()
      .prepare(`INSERT INTO "student_lesson_progress" (id, user_id, lesson_id, status, started_at, completed_at, updated_at) VALUES (?, ?, ?, 'completed', ?, ?, ?);`)
      .bind(newId(), userId, lessonId, now, now, now)
      .run();
  } else {
    await db()
      .prepare(`UPDATE "student_lesson_progress" SET status = 'completed', completed_at = COALESCE(completed_at, ?), updated_at = ? WHERE id = ?;`)
      .bind(now, now, existing.id)
      .run();
  }
}

export { db, newId, nowIso };


// Assessment types
export type QuizQuestionType = 'multiple_choice_single' | 'multiple_choice_multiple' | 'true_false' | 'scenario' | 'calculation' | 'image_based';
export type QuizAttemptStatus = 'in_progress' | 'submitted' | 'graded' | 'instructor_review_required';
export type AssignmentStatus = 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'revision_required';
export type AssignmentType = 'homework' | 'practical' | 'chart_demo';
export type CheckpointStatus = 'not_started' | 'in_progress' | 'pending_review' | 'revision_required' | 'passed' | 'failed';
export type LessonProgressStatusExtended = 'locked' | 'available' | 'in_progress' | 'pending_review' | 'revision_required' | 'completed';

export async function getQuizById(quizId: string) {
  return db().prepare(`SELECT * FROM "academy_quiz" WHERE id = ?;`).bind(quizId).first<any>();
}

export async function getQuizQuestions(quizId: string, randomize = false) {
  const { results } = await db()
    .prepare(`SELECT * FROM "academy_quiz_question" WHERE quiz_id = ? ORDER BY sort_order ASC;`)
    .bind(quizId)
    .all<any>();
  if (!randomize) return results;
  // Fisher-Yates shuffle
  const arr = [...results];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function getQuestionChoices(questionId: string, randomize = false) {
  const { results } = await db()
    .prepare(`SELECT * FROM "academy_quiz_question_choice" WHERE question_id = ? ORDER BY sort_order ASC;`)
    .bind(questionId)
    .all<any>();
  if (!randomize) return results;
  const arr = [...results].filter((c: any) => !c.is_correct || true); // keep structure
  const shuffled = [...results];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function getUserQuizAttempts(userId: string, quizId: string) {
  // Interactive snapshots contain private answer keys and instructor rubrics.
  // Their student history is served only through the sanitized learning state.
  await assertLegacyAssessmentResource('quiz',quizId);
  const { results } = await db()
    .prepare(`SELECT * FROM "student_quiz_attempt" WHERE user_id = ? AND quiz_id = ? ORDER BY attempt_number ASC;`)
    .bind(userId, quizId)
    .all<any>();
  return results;
}

export async function getActiveQuizAttempt(userId: string, quizId: string) {
  return db()
    .prepare(`SELECT * FROM "student_quiz_attempt" WHERE user_id = ? AND quiz_id = ? AND status = 'in_progress' ORDER BY attempt_number DESC LIMIT 1;`)
    .bind(userId, quizId)
    .first<any>();
}

export async function startQuizAttempt(userId: string, quizId: string) {
  await requireAcademyResource(userId, "quiz", quizId);
  await assertLegacyAssessmentResource('quiz',quizId);
  const quiz = await getQuizById(quizId);
  if (!quiz) throw new Error('Quiz not found');
  const attempts = await getUserQuizAttempts(userId, quizId);
  const attemptNumber = attempts.length + 1;
  const maxAttempts = quiz.max_attempts || 2;
  
  // Check if user can start new attempt
  if (attemptNumber > maxAttempts) {
    // Check if instructor authorized additional attempt
    const authorized = attempts.some((a: any) => a.instructor_authorized_additional === 1);
    if (!authorized) {
      throw new Error('Maximum attempts reached. Instructor review required.');
    }
    // If authorized, allow one more attempt
  }
  
  // Check if any attempt is instructor_review_required and not authorized
  const hasReviewRequired = attempts.some((a: any) => a.instructor_review_required === 1 && a.instructor_authorized_additional !== 1);
  const hasInProgress = attempts.some((a: any) => a.status === 'in_progress');
  if (hasInProgress) {
    const active = await getActiveQuizAttempt(userId, quizId);
    return active;
  }
  if (hasReviewRequired && attemptNumber > maxAttempts) {
    throw new Error('Instructor review required. Additional attempts need authorization.');
  }
  
  const id = newId();
  const now = nowIso();
  await db()
    .prepare(`INSERT INTO "student_quiz_attempt" (id, user_id, quiz_id, attempt_number, status, started_at) VALUES (?, ?, ?, ?, 'in_progress', ?);`)
    .bind(id, userId, quizId, attemptNumber, now)
    .run();
  return db().prepare(`SELECT * FROM "student_quiz_attempt" WHERE id = ?;`).bind(id).first<any>();
}

export async function submitQuizAttempt(attemptId: string, responses: Array<{ questionId: string, selectedChoiceIds: string[] }>, userId: string) {
  const attempt = await db().prepare(`SELECT * FROM "student_quiz_attempt" WHERE id = ?;`).bind(attemptId).first<any>();
  if (!attempt) throw new Error('Attempt not found');
  if (attempt.user_id !== userId) throw academyError('Unauthorized', 403);
  await assertLegacyAssessmentResource('quiz',attempt.quiz_id);
  await requireAcademyResource(userId, 'quiz', attempt.quiz_id);
  if (attempt.status !== 'in_progress') throw new Error('Attempt already submitted');
  
  const quiz = await getQuizById(attempt.quiz_id);
  const now = nowIso();
  let totalPoints = 0;
  let earnedPoints = 0;
  
  // Get all questions for this quiz
  const { results: questions } = await db()
    .prepare(`SELECT * FROM "academy_quiz_question" WHERE quiz_id = ?;`)
    .bind(attempt.quiz_id)
    .all<any>();
  
  for (const q of questions) {
    totalPoints += q.points || 1;
  }
  
  // Validate the entire request before any response or grade writes.
  if (!Array.isArray(responses)) throw academyError('Invalid responses', 400);
  const seen = new Set<string>();
  const validated = [];
  for (const resp of responses) {
    if (!resp || typeof resp.questionId !== 'string' || !questions.some((q: any) => q.id === resp.questionId)) throw academyError('Invalid question', 400);
    if (seen.has(resp.questionId)) throw academyError('Duplicate question', 400);
    seen.add(resp.questionId);
    if (!Array.isArray(resp.selectedChoiceIds) || resp.selectedChoiceIds.some((id: unknown) => typeof id !== 'string') || new Set(resp.selectedChoiceIds).size !== resp.selectedChoiceIds.length) throw academyError('Invalid choices', 400);
    const choices = await getQuestionChoices(resp.questionId);
    if (resp.selectedChoiceIds.some(id => !choices.some((c: any) => c.id === id))) throw academyError('Invalid choice', 400);
    const question = questions.find((q: any) => q.id === resp.questionId)!;
    if (question.question_type !== 'multiple_choice_multiple' && resp.selectedChoiceIds.length > 1) throw academyError('Invalid choices', 400);
    const correct = choices.filter((c: any) => c.is_correct === 1).map((c: any) => c.id).sort();
    const isCorrect = correct.length > 0 && JSON.stringify(correct) === JSON.stringify([...resp.selectedChoiceIds].sort());
    const pointsEarned = isCorrect ? (question.points || 1) : 0;
    earnedPoints += pointsEarned;
    validated.push({resp, isCorrect, pointsEarned});
  }
  for (const {resp, isCorrect, pointsEarned} of validated) {
    await db().prepare(`INSERT INTO "student_quiz_response" (id, attempt_id, question_id, selected_choice_ids, is_correct, points_earned, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);`)
      .bind(newId(), attemptId, resp.questionId, JSON.stringify(resp.selectedChoiceIds), isCorrect ? 1 : 0, pointsEarned, now).run();
  }

  const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passingScore = quiz?.passing_score_percent || 80;
  const passed = scorePercent >= passingScore ? 1 : 0;
  const maxAttempts = quiz?.max_attempts || 2;
  
  let status = 'graded';
  let instructorReviewRequired = 0;
  
  if (passed === 0 && attempt.attempt_number >= maxAttempts) {
    // Check if already authorized additional attempt
    const allAttempts = await getUserQuizAttempts(attempt.user_id, attempt.quiz_id);
    const hasAuth = allAttempts.some((a: any) => a.instructor_authorized_additional === 1 && a.id !== attemptId);
    if (!hasAuth) {
      status = 'instructor_review_required';
      instructorReviewRequired = 1;
    }
  }
  
  await db()
    .prepare(`UPDATE "student_quiz_attempt" SET status = ?, submitted_at = ?, score_percent = ?, score_points = ?, total_points = ?, passed = ?, instructor_review_required = ? WHERE id = ?;`)
    .bind(status, now, scorePercent, earnedPoints, totalPoints, passed, instructorReviewRequired, attemptId)
    .run();
  
  return {
    attemptId,
    scorePercent,
    earnedPoints,
    totalPoints,
    passed: passed === 1,
    status,
    instructorReviewRequired: instructorReviewRequired === 1,
    attemptsUsed: attempt.attempt_number,
    maxAttempts
  };
}

export async function authorizeAdditionalQuizAttempt(instructorId: string, userId: string, quizId: string) {
  await assertLegacyAssessmentResource('quiz',quizId);
  const attempts = await getUserQuizAttempts(userId, quizId);
  if (attempts.length === 0) throw new Error('No attempts found');
  const lastAttempt = attempts[attempts.length - 1];
  if (lastAttempt.instructor_review_required !== 1 && lastAttempt.status !== 'instructor_review_required') {
    throw new Error('Additional attempt can only be authorized after instructor review required');
  }
  
  const quiz = await getQuizById(quizId);
  const maxAttempts = quiz?.max_attempts || 2;
  const id = newId();
  const now = nowIso();
  await db()
    .prepare(`INSERT INTO "student_quiz_attempt" (id, user_id, quiz_id, attempt_number, status, started_at, instructor_authorized_additional, authorized_by, authorized_at) VALUES (?, ?, ?, ?, 'in_progress', ?, 1, ?, ?);`)
    .bind(id, userId, quizId, attempts.length + 1, now, instructorId, now)
    .run();
  return db().prepare(`SELECT * FROM "student_quiz_attempt" WHERE id = ?;`).bind(id).first<any>();
}

export async function getAssignmentById(assignmentId: string) {
  return db().prepare(`SELECT * FROM "academy_assignment" WHERE id = ?;`).bind(assignmentId).first<any>();
}

export async function getUserAssignmentSubmissions(userId: string, assignmentId: string) {
  const { results } = await db()
    .prepare(`SELECT * FROM "student_assignment_submission" WHERE user_id = ? AND assignment_id = ? ORDER BY attempt_number ASC, submitted_at ASC;`)
    .bind(userId, assignmentId)
    .all<any>();
  return results;
}

export async function startOrUpdateAssignment(userId: string, assignmentId: string, responseText?: string, fileUrls?: string[]) {
  await requireAcademyResource(userId, "assignment", assignmentId);
  await assertLegacyAssessmentResource('assignment',assignmentId);
  const submissions = await getUserAssignmentSubmissions(userId, assignmentId);
  const existing = submissions.find((s: any) => s.status === 'in_progress' || s.status === 'not_started' || s.status === 'revision_required');
  const now = nowIso();
  
  if (existing) {
    await db()
      .prepare(`UPDATE "student_assignment_submission" SET status = 'in_progress', response_text = COALESCE(?, response_text), file_urls = COALESCE(?, file_urls) WHERE id = ?;`)
      .bind(responseText || null, fileUrls ? JSON.stringify(fileUrls) : null, existing.id)
      .run();
    return db().prepare(`SELECT * FROM "student_assignment_submission" WHERE id = ?;`).bind(existing.id).first<any>();
  }
  
  const id = newId();
  await db()
    .prepare(`INSERT INTO "student_assignment_submission" (id, user_id, assignment_id, status, response_text, file_urls, attempt_number) VALUES (?, ?, ?, 'in_progress', ?, ?, 1);`)
    .bind(id, userId, assignmentId, responseText || '', fileUrls ? JSON.stringify(fileUrls) : '[]')
    .run();
  await db()
    .prepare(`INSERT INTO "assignment_submission_history" (id, submission_id, action, actor_id, actor_type, created_at) VALUES (?, ?, 'started', ?, 'student', ?);`)
    .bind(newId(), id, userId, now)
    .run();
  return db().prepare(`SELECT * FROM "student_assignment_submission" WHERE id = ?;`).bind(id).first<any>();
}

export async function submitAssignment(submissionId: string, userId: string) {
  const submission = await db().prepare(`SELECT * FROM "student_assignment_submission" WHERE id = ?;`).bind(submissionId).first<any>();
  if (!submission) throw new Error('Submission not found');
  if (submission.user_id !== userId) throw academyError('Unauthorized');
  await assertLegacyAssessmentResource('assignment',submission.assignment_id);
  await requireAcademyResource(userId, 'assignment', submission.assignment_id);
  const now = nowIso();
  await db()
    .prepare(`UPDATE "student_assignment_submission" SET status = 'submitted', submitted_at = ? WHERE id = ?;`)
    .bind(now, submissionId)
    .run();
  await db()
    .prepare(`INSERT INTO "assignment_submission_history" (id, submission_id, action, actor_id, actor_type, created_at) VALUES (?, ?, 'submitted', ?, 'student', ?);`)
    .bind(newId(), submissionId, userId, now)
    .run();
  return db().prepare(`SELECT * FROM "student_assignment_submission" WHERE id = ?;`).bind(submissionId).first<any>();
}

export async function reviewAssignment(submissionId: string, instructorId: string, action: 'approve' | 'request_revision', feedback: string, score?: number) {
  const submission = await db().prepare(`SELECT * FROM "student_assignment_submission" WHERE id = ?;`).bind(submissionId).first<any>();
  if (!submission) throw new Error('Submission not found');
  await assertLegacyAssessmentResource('assignment',submission.assignment_id);
  const now = nowIso();
  
  if (action === 'approve') {
    await db()
      .prepare(`UPDATE "student_assignment_submission" SET status = 'approved', approved = 1, reviewed_at = ?, reviewed_by = ?, instructor_feedback = ?, score = ? WHERE id = ?;`)
      .bind(now, instructorId, feedback || '', score ?? null, submissionId)
      .run();
    await db()
      .prepare(`INSERT INTO "assignment_submission_history" (id, submission_id, action, actor_id, actor_type, feedback, created_at) VALUES (?, ?, 'approved', ?, 'instructor', ?, ?);`)
      .bind(newId(), submissionId, instructorId, feedback || '', now)
      .run();
  } else if (action === 'request_revision') {
    await db()
      .prepare(`UPDATE "student_assignment_submission" SET status = 'revision_required', reviewed_at = ?, reviewed_by = ?, instructor_feedback = ? WHERE id = ?;`)
      .bind(now, instructorId, feedback || '', submissionId)
      .run();
    await db()
      .prepare(`INSERT INTO "assignment_submission_history" (id, submission_id, action, actor_id, actor_type, feedback, created_at) VALUES (?, ?, 'revision_required', ?, 'instructor', ?, ?);`)
      .bind(newId(), submissionId, instructorId, feedback || '', now)
      .run();
  }
  
  return db().prepare(`SELECT * FROM "student_assignment_submission" WHERE id = ?;`).bind(submissionId).first<any>();
}

export async function resubmitAssignment(originalSubmissionId: string, userId: string, responseText: string, fileUrls?: string[]) {
  const original = await db().prepare(`SELECT * FROM "student_assignment_submission" WHERE id = ?;`).bind(originalSubmissionId).first<any>();
  if (!original) throw new Error('Submission not found');
  if (original.user_id !== userId) throw academyError('Unauthorized');
  await assertLegacyAssessmentResource('assignment',original.assignment_id);
  await requireAcademyResource(userId, 'assignment', original.assignment_id);
  if (original.status !== 'revision_required') throw new Error('Can only resubmit after revision required');
  
  const submissions = await getUserAssignmentSubmissions(userId, original.assignment_id);
  const maxAttempt = submissions.reduce((max: number, s: any) => Math.max(max, s.attempt_number || 1), 0);
  const now = nowIso();
  const id = newId();
  
  await db()
    .prepare(`INSERT INTO "student_assignment_submission" (id, user_id, assignment_id, status, response_text, file_urls, attempt_number, revision_of_id, submitted_at) VALUES (?, ?, ?, 'submitted', ?, ?, ?, ?, ?);`)
    .bind(id, userId, original.assignment_id, responseText || '', fileUrls ? JSON.stringify(fileUrls) : '[]', maxAttempt + 1, originalSubmissionId, now)
    .run();
  await db()
    .prepare(`INSERT INTO "assignment_submission_history" (id, submission_id, action, actor_id, actor_type, created_at) VALUES (?, ?, 'resubmitted', ?, 'student', ?);`)
    .bind(newId(), id, userId, now)
    .run();
  return db().prepare(`SELECT * FROM "student_assignment_submission" WHERE id = ?;`).bind(id).first<any>();
}

export async function getCheckpointById(checkpointId: string) {
  return db().prepare(`SELECT * FROM "academy_checkpoint" WHERE id = ?;`).bind(checkpointId).first<any>();
}

export async function getCheckpointParts(checkpointId: string) {
  const { results } = await db()
    .prepare(`SELECT * FROM "academy_checkpoint_part" WHERE checkpoint_id = ? ORDER BY sort_order ASC;`)
    .bind(checkpointId)
    .all<any>();
  return results;
}

export async function getUserCheckpointProgress(userId: string, checkpointId: string) {
  return db()
    .prepare(`SELECT * FROM "student_checkpoint_progress" WHERE user_id = ? AND checkpoint_id = ?;`)
    .bind(userId, checkpointId)
    .first<any>();
}

export async function isCheckpointComplete(userId: string, checkpointId: string) {
  const checkpoint = await getCheckpointById(checkpointId);
  if (!checkpoint) return false;
  const parts = await getCheckpointParts(checkpointId);
  if (parts.length === 0) {
    const progress = await getUserCheckpointProgress(userId, checkpointId);
    return progress?.status === 'passed';
  }
  
  for (const part of parts) {
    if (!part.required) continue;
    if (part.part_type === 'quiz' && part.quiz_id) {
      const attempts = await getUserQuizAttempts(userId, part.quiz_id);
      const passed = attempts.some((a: any) => a.passed === 1 && a.status !== 'instructor_review_required');
      if (!passed) return false;
    } else if ((part.part_type === 'assignment' || part.part_type === 'chart_demo' || part.part_type === 'homework') && part.assignment_id) {
      const subs = await getUserAssignmentSubmissions(userId, part.assignment_id);
      const approved = subs.some((s: any) => s.status === 'approved' && s.approved === 1);
      if (!approved) return false;
    }
  }
  return true;
}

export async function updateCheckpointProgress(userId: string, checkpointId: string) {
  const complete = await isCheckpointComplete(userId, checkpointId);
  const existing = await getUserCheckpointProgress(userId, checkpointId);
  const now = nowIso();
  if (complete) {
    if (!existing) {
      const id = newId();
      await db()
        .prepare(`INSERT INTO "student_checkpoint_progress" (id, user_id, checkpoint_id, status, passed_at, updated_at) VALUES (?, ?, ?, 'passed', ?, ?);`)
        .bind(id, userId, checkpointId, now, now)
        .run();
    } else if (existing.status !== 'passed') {
      await db()
        .prepare(`UPDATE "student_checkpoint_progress" SET status = 'passed', passed_at = COALESCE(passed_at, ?), updated_at = ? WHERE id = ?;`)
        .bind(now, now, existing.id)
        .run();
    }
    return true;
  }
  return false;
}

export async function getMissedTopicsForReview(userId: string, quizId: string) {
  const attempts = await getUserQuizAttempts(userId, quizId);
  const failedAttempts = attempts.filter((a: any) => a.passed === 0);
  const missedTopics: any[] = [];
  for (const attempt of failedAttempts) {
    const { results: responses } = await db()
      .prepare(`SELECT r.*, q.question_text, q.explanation FROM "student_quiz_response" r JOIN "academy_quiz_question" q ON q.id = r.question_id WHERE r.attempt_id = ? AND r.is_correct = 0;`)
      .bind(attempt.id)
      .all<any>();
    for (const resp of responses) {
      missedTopics.push({
        attemptNumber: attempt.attempt_number,
        questionText: resp.question_text,
        explanation: resp.explanation
      });
    }
  }
  return missedTopics;
}

export function academyError(message: string, status = 403) {
  return Object.assign(new Error(message), { status });
}

/** Mixed-format lessons have their own version-linked review gates. */
export async function assertLegacyAssessmentResource(kind:'quiz'|'assignment',id:string) {
  const row=await db().prepare(`SELECT lesson_id FROM "academy_${kind}" WHERE id=?`).bind(id).first<any>();
  if(row?.lesson_id) {
    const lesson=await db().prepare('SELECT content FROM academy_lesson WHERE id=?').bind(row.lesson_id).first<any>();
    if(interactiveLesson(lesson?.content))throw academyError('Use the interactive lesson assessment and homework workflow.',400);
  }
}

export function orderLessons(modules: any[], lessons: any[]) {
  const orderedModules = [...modules].sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id));
  return [...lessons].sort((a, b) => orderedModules.findIndex(m => m.id === a.module_id) - orderedModules.findIndex(m => m.id === b.module_id) || a.sort_order - b.sort_order || a.id.localeCompare(b.id));
}

export async function requireLessonAccess(userId: string, lessonId: string) {
  await assertLifecycleActive(db(),userId);
  const lesson = await db().prepare(`SELECT * FROM "academy_lesson" WHERE id = ?;`).bind(lessonId).first<any>();
  if (!lesson || lesson.status !== 'published') throw academyError('Lesson unavailable');
  const module = await db().prepare(`SELECT * FROM "academy_module" WHERE id = ?;`).bind(lesson.module_id).first<any>();
  if (!module || module.status !== 'published' || !await ensureLessonAvailable(userId, lessonId, module.course_id)) throw academyError('Lesson unavailable');
  return { lesson, module };
}

export async function requireAcademyResource(userId: string, kind: 'quiz' | 'assignment' | 'checkpoint', id: string) {
  await assertLifecycleActive(db(),userId);
  if (typeof id !== 'string' || !id) throw academyError('Invalid resource', 400);
  const resource = await db().prepare(`SELECT * FROM "academy_${kind}" WHERE id = ?;`).bind(id).first<any>();
  if (!resource) throw academyError('Resource unavailable', 404);
  if (resource.lesson_id) await requireLessonAccess(userId, resource.lesson_id);
  else if (resource.module_id) {
    const module = await db().prepare(`SELECT * FROM "academy_module" WHERE id = ?;`).bind(resource.module_id).first<any>();
    if (!module || module.status !== 'published') throw academyError('Module unavailable');
    const structure = await getCourseWithStructure(module.course_id);
    const moduleLessons = structure?.lessons.filter((l: any) => l.module_id === module.id) || [];
    // Module assessments are available only after all their published lessons.
    if (!moduleLessons.length || !await isCourseAssigned(userId, module.course_id)) throw academyError('Module unavailable');
    for (const lesson of moduleLessons) if ((await getUserLessonProgress(userId, lesson.id))?.status !== 'completed') throw academyError('Complete module lessons first');
  } else if (kind === 'quiz' && resource.checkpoint_id) await requireAcademyResource(userId, 'checkpoint', resource.checkpoint_id);
  else if (kind === 'checkpoint' && resource.course_id) {
    const structure = await getCourseWithStructure(resource.course_id);
    if (!structure || !await isCourseAssigned(userId, resource.course_id) || !structure.lessons.length) throw academyError('Course unavailable');
    for (const lesson of structure.lessons) if ((await getUserLessonProgress(userId, lesson.id))?.status !== 'completed') throw academyError('Complete course lessons first');
  } else throw academyError('Resource has no published learning context');
  return resource;
}
