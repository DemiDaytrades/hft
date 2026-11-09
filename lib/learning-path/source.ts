import {readLiveEvidence} from '../classroom/teaching/evidence';
import {readLegacyEducationalContext} from '../consultation-review/legacy-education';
import type { CurriculumItem, Domain, EducationalSource, Evidence } from './contracts';
import { QUESTIONS } from '../placement-assessment';
import { DOMAINS } from './contracts';
import { educationalIntake } from './engine';
import { getLatestCompletedIntake } from '../student-intake-v2/service';
import { interactiveLesson, assessmentResult } from '../academy/learning/policy';
import { isLearningGateSatisfied } from '../academy/learning/service';
const parse = (v: string | null, fallback: any) => { try {
    return v ? JSON.parse(v) : fallback;
}
catch {
    return fallback;
} };
export async function readCurriculum(db: D1Database): Promise<CurriculumItem[]> {
    const rows = (await db.prepare(`SELECT l.*,m.course_id,m.sort_order AS module_order,c.sort_order AS course_order FROM academy_lesson l JOIN academy_module m ON m.id=l.module_id JOIN academy_course c ON c.id=m.course_id WHERE l.status='published' AND m.status='published' AND c.status='published' ORDER BY c.sort_order,c.id,m.sort_order,m.id,l.sort_order,l.id`).all<any>()).results;
    return rows.map((l, index) => ({ id: l.id, title: l.title, courseId: l.course_id, moduleId: l.module_id, classification: l.id === 'hft-money-1' ? 'REQUIRED_CORE' : l.placement_classification, domains: l.id === 'hft-money-1' ? ['FOREX_FOUNDATIONS'] : (Array.isArray(parse(l.competency_domains_json, [])) ? parse(l.competency_domains_json, []) : []).filter((d: string) => DOMAINS.includes(d as Domain)), order: index, available: true, catalogUpdatedAt: l.updated_at, contentVersion: interactiveLesson(l.content)?.version ?? null }));
}
export async function captureEducationalSource(db: D1Database, studentId: string): Promise<EducationalSource> {
    const intake = await getLatestCompletedIntake(db, studentId);
    let assessment = await db.prepare("SELECT * FROM placement_assessment_attempt WHERE userId=? AND status='completed' ORDER BY completedAt DESC,id DESC LIMIT 1").bind(studentId).first<any>();
    if (assessment?.question_snapshot_json && JSON.stringify(parse(assessment.question_snapshot_json, null)) !== JSON.stringify(QUESTIONS))
        assessment = null;
    const curriculum = await readCurriculum(db), academy: Evidence[] = [];
    const quizzes = (await db.prepare("SELECT a.*,q.lesson_id FROM student_quiz_attempt a JOIN academy_quiz q ON q.id=a.quiz_id WHERE a.user_id=? AND a.status='graded' ORDER BY a.submitted_at,a.id").bind(studentId).all<any>()).results;
    for (const a of quizzes) {
        const item = curriculum.find(c => c.id === a.lesson_id);
        if (!item)
            continue;
        const review = parse(a.learning_review_json, null), questions = parse(a.learning_questions_json, []), answers = parse(a.learning_answers_json, {});
        const valid = a.learning_version ? questions.length > 0 && !!review && assessmentResult(questions, answers, review).passed : a.passed === 1 && typeof a.score_percent === 'number';
        if (!valid)
            continue;
        for (const domain of item.domains)
            academy.push({ id: `quiz:${a.id}:${domain}`, source: 'LESSON_KNOWLEDGE_CHECK', domain, scope: 'CONCEPT', level: 'KNOWS_CONCEPT', reference: a.id, recordedAt: a.submitted_at, verifiedBy: review?.reviewedBy, summary: 'Passed lesson knowledge check; concept-scoped evidence, not whole-domain practical proof.' });
    }
    const homework = (await db.prepare("SELECT s.*,a.lesson_id FROM student_assignment_submission s JOIN academy_assignment a ON a.id=s.assignment_id WHERE s.user_id=? AND s.status='approved' AND s.approved=1 AND s.reviewed_by IS NOT NULL ORDER BY s.reviewed_at,s.id").bind(studentId).all<any>()).results;
    for (const h of homework) {
        const item = curriculum.find(c => c.id === h.lesson_id);
        if (!item)
            continue;
        for (const domain of item.domains)
            academy.push({ id: `homework:${h.id}:${domain}`, source: 'HOMEWORK', domain, scope: 'CONCEPT', level: 'CAN_APPLY_CONCEPT', reference: h.id, recordedAt: h.reviewed_at, verifiedBy: h.reviewed_by, summary: 'Instructor-approved assignment. Does not by itself verify an entire domain or live behavior.' });
    }
    const progress = (await db.prepare("SELECT l.* FROM student_lesson_progress p JOIN academy_lesson l ON l.id=p.lesson_id WHERE p.user_id=? AND p.status='completed'").bind(studentId).all<any>()).results;
    for (const l of progress) {
        const doc = interactiveLesson(l.content), item = curriculum.find(c => c.id === l.id);
        if (!doc || !item || !await isLearningGateSatisfied(db, studentId, l))
            continue;
        for (const domain of item.domains)
            academy.push({ id: `mastery:${l.id}:${doc.version}:${domain}`, source: 'LESSON_KNOWLEDGE_CHECK', domain, scope: 'CONCEPT', level: 'CAN_APPLY_CONCEPT', reference: `${l.id}:${doc.version}`, summary: 'Version-linked lesson interactions, reviewed mastery and approved homework satisfied. Scope is this lesson, not the entire domain.' });
    }
    academy.push(...await readLiveEvidence(db,studentId));
    return { legacyContext:await readLegacyEducationalContext(db,studentId), intake: intake ? educationalIntake(intake) : null, assessment: assessment ? { id: assessment.id, version: assessment.assessmentVersion, completedAt: assessment.completedAt, answers: parse(assessment.answers, {}) } : null, academy, curriculum };
}
