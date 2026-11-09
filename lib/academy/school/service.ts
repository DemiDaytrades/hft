import 'server-only';
import { hasStudentAccess } from '../../membership-access';
import { assertInstructor } from '../instructor/service';
import { CLASS_ONE, AUTHORED_CLASSES, classDefinition, publicClass, validateCurriculum, CURRICULUM } from './registry';
import {assessmentCriteria} from './practical';
import { gradeObjective, validateAnswer } from './policy';
import type { ClassDefinition, Item, Answer, EvidenceKind } from './contracts';
type Row = Record<string, any>;
function fail(m: string, status = 403): never { throw Object.assign(new Error(m), { status }); }
const uid = () => crypto.randomUUID(), now = () => new Date().toISOString();
async function hash(s: string) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))), b => b.toString(16).padStart(2, '0')).join(''); }
async function learner(db: D1Database, user: string) { const a = await db.prepare('SELECT * FROM user WHERE id=?').bind(user).first<Row>(); if (!a || a.role !== 'student' || a.lifecycle_status !== 'ACTIVE' || a.banned || a.must_change_password || !hasStudentAccess(a))
    fail('Student unavailable: active entitlement and password setup required.'); return a; }
async function installDefinition(db: D1Database,d:ClassDefinition) { if (validateCurriculum(CURRICULUM, d).length)
    fail('Invalid curriculum', 400); const content = JSON.stringify(d), sha = await hash(content), old = await db.prepare('SELECT content_sha FROM school_definition WHERE class_id=? AND version=?').bind(d.id, d.version).first<Row>(); if (old && old.content_sha !== sha)
    fail('Immutable curriculum conflict', 409); const stage=CURRICULUM.stages.find(s=>s.id===d.stageId)!;const moduleId='hft-school-'+d.stageId;const at = now(); const rows = [{ table: 'academy_course', id: d.courseId, sql: "INSERT INTO academy_course(id,title,slug,description,track,status,sort_order,created_at,updated_at) VALUES(?,?,?,?,?,'published',100,?,?)", args: [d.courseId, 'HFT Academy · Master Curriculum', 'hft-master-curriculum', d.description, 'Foundations', at, at] }, { table: 'academy_module', id: moduleId, sql: "INSERT INTO academy_module(id,course_id,title,description,sort_order,status,created_at,updated_at) VALUES(?,?,?,?,?,'published',?,?)", args: [moduleId, d.courseId, stage.title, 'Versioned '+stage.title+' curriculum',stage.number-1, at, at] }, { table: 'academy_lesson', id: d.lessonId, sql: "INSERT INTO academy_lesson(id,module_id,title,lesson_type,content,sort_order,status,estimated_minutes,created_at,updated_at) VALUES(?,?,?,'interactive',?,?,'published',60,?,?)", args: [d.lessonId, moduleId, d.title, JSON.stringify({ format: 'hft-school-ref', classId: d.id }), d.number-1, at, at] }]; const writes = []; for (const r of rows) {
    const existing = await db.prepare('SELECT * FROM ' + r.table + ' WHERE id=?').bind(r.id).first<Row>();
    if (existing) {
        if (r.table === 'academy_lesson' && (existing.content !== r.args[3] || existing.module_id !== moduleId))
            fail('Installation anchor conflict', 409);
        if (r.table === 'academy_module' && existing.course_id !== d.courseId)
            fail('Installation course conflict', 409);
    }
    else
        writes.push(db.prepare(r.sql).bind(...r.args));
} if (!old)
    writes.push(db.prepare('INSERT INTO school_definition VALUES(?,?,?,?,?)').bind(d.id, d.version, content, sha, at)); if (writes.length)
    await db.batch(writes); return { classId: d.id, version: d.version, sha }; }
export async function installSchool(db:D1Database){const installed=[];for(const d of AUTHORED_CLASSES)installed.push(await installDefinition(db,d));return {...installed[0],classes:installed};}
export async function assignClass(db: D1Database, actor: string, student: string, classId: string) {
    await assertInstructor(db, actor);
    await learner(db, student);
    const d = classDefinition(classId);
    if(!d)fail('Class unavailable',400);
    const stored = await db.prepare('SELECT 1 AS yes FROM school_definition WHERE class_id=? AND version=?').bind(d.id, d.version).first();
    if (!stored)
        fail('Curriculum not installed', 409);
    for (const pre of d.prerequisites) {
        if (!await db.prepare('SELECT 1 FROM school_completion c JOIN school_enrollment e ON e.id=c.enrollment_id WHERE e.user_id=? AND e.class_id=?').bind(student, pre).first())
            fail('Prerequisite not completed', 409);
    }
    const course = await db.prepare("SELECT id FROM academy_course WHERE id=? AND status='published'").bind(d.courseId).first();
    if (!course)
        fail('Course unavailable');
    const assignment = await db.prepare("SELECT id,status FROM student_course_assignment WHERE user_id=? AND course_id=?").bind(student, d.courseId).first<Row>();
    if (assignment && assignment.status !== 'assigned')
        fail('Restore course assignment explicitly before class enrollment', 409);
    const prerequisiteGuard=d.prerequisites.map(()=>'EXISTS(SELECT 1 FROM school_completion cp JOIN school_enrollment ep ON ep.id=cp.enrollment_id WHERE ep.user_id=? AND ep.class_id=?)').join(' AND ');
    const guard = `EXISTS(SELECT 1 FROM user WHERE id=? AND role='admin' AND lifecycle_status='ACTIVE' AND COALESCE(banned,0)=0 AND COALESCE(must_change_password,0)=0) AND EXISTS(SELECT 1 FROM user u WHERE u.id=? AND u.role='student' AND u.lifecycle_status='ACTIVE' AND COALESCE(u.banned,0)=0 AND COALESCE(u.must_change_password,0)=0 AND (u.subscriptionStatus IN ('active','trialing') OR (u.complimentaryAccessRevokedAt IS NULL AND julianday(u.complimentaryAccessExpiresAt)>julianday('now') AND (u.complimentaryAccessStartsAt IS NULL OR julianday(u.complimentaryAccessStartsAt)<=julianday('now'))))) AND EXISTS(SELECT 1 FROM academy_lesson l JOIN academy_module m ON m.id=l.module_id JOIN academy_course c ON c.id=m.course_id WHERE l.id=? AND c.id=? AND l.status='published' AND m.status='published' AND c.status='published')${prerequisiteGuard?' AND '+prerequisiteGuard:''}`;
    const args = [actor, student, d.lessonId, d.courseId,...d.prerequisites.flatMap(pre=>[student,pre])], writes = [];
    if (!assignment)
        writes.push(db.prepare(`INSERT INTO student_course_assignment(id,user_id,course_id,status,assigned_at,assigned_by) SELECT ?,?,?,'assigned',?,? WHERE ${guard}`).bind(uid(), student, d.courseId, now(), actor, ...args));
    writes.push(db.prepare(`INSERT OR IGNORE INTO school_enrollment(id,user_id,class_id,version,assigned_by,created_at) SELECT ?,?,?,?,?,? WHERE ${guard} AND EXISTS(SELECT 1 FROM student_course_assignment WHERE user_id=? AND course_id=? AND status='assigned')`).bind(uid(), student, d.id, d.version, actor, now(), ...args, student, d.courseId));
    await db.batch(writes);
    await assertInstructor(db, actor);
    return schoolState(db, student, classId);
}
async function load(db: D1Database, student: string, classId: string, version?: string) { await learner(db, student); const e = await db.prepare('SELECT e.*,d.content_json,d.content_sha FROM school_enrollment e JOIN school_definition d ON d.class_id=e.class_id AND d.version=e.version WHERE e.user_id=? AND e.class_id=?' + (version ? ' AND e.version=?' : '') + ' ORDER BY e.created_at DESC LIMIT 1').bind(student, classId, ...version ? [version] : []).first<Row>(); if (!e)
    fail('Class unavailable'); if (await hash(e.content_json) !== e.content_sha)
    fail('Curriculum integrity mismatch', 409); const d = JSON.parse(e.content_json) as ClassDefinition; const access = await db.prepare("SELECT l.id FROM academy_lesson l JOIN academy_module m ON m.id=l.module_id JOIN academy_course c ON c.id=m.course_id JOIN student_course_assignment a ON a.course_id=c.id WHERE l.id=? AND c.id=? AND a.user_id=? AND a.status='assigned' AND l.status='published' AND m.status='published' AND c.status='published'").bind(d.lessonId, d.courseId, student).first(); if (!access)
    fail('Published assigned class unavailable'); return { e, d }; }
export type Submission = {
    id: string;
    kind: 'assessment' | 'homework';
    assessmentId: string | null;
    number: number;
    answers: Record<string, Answer>;
    objective: Record<string, boolean>;
    status: string;
    review: {
        grades: Record<string, boolean>;
        feedback: string;
        reviewer: string;
        reviewedAt: string;
    } | null;
    createdAt: string;
};
async function internal(db: D1Database, student: string, classId: string, version?: string) { const { e, d } = await load(db, student, classId, version); const events = (await db.prepare('SELECT * FROM school_event WHERE enrollment_id=? ORDER BY rowid').bind(e.id).all<Row>()).results; const rows = (await db.prepare('SELECT * FROM school_submission WHERE enrollment_id=? ORDER BY rowid').bind(e.id).all<Row>()).results; const submissions: Submission[] = rows.map(x => ({ id: x.id, kind: x.kind, assessmentId: x.assessment_id, number: x.number, answers: JSON.parse(x.answers_json), objective: JSON.parse(x.objective_json), status: x.status, review: x.review_json ? JSON.parse(x.review_json) : null, createdAt: x.created_at })); const completion = await db.prepare('SELECT * FROM school_completion WHERE enrollment_id=?').bind(e.id).first<Row>(); const drafts = Object.fromEntries((await db.prepare('SELECT kind,answers_json FROM school_draft WHERE enrollment_id=?').bind(e.id).all<Row>()).results.map(r => [r.kind, JSON.parse(r.answers_json)])); const completedSections = d.sections.filter(s => events.some(x => x.kind === 'section' && x.event_key === s.id && x.passed)).map(x => x.id); const latestAssessment = submissions.filter(x => x.kind === 'assessment').at(-1), latestHomework = submissions.filter(x => x.kind === 'homework').at(-1); const weak = new Set<string>(); if (latestAssessment?.review) {
    for (const q of d.assessment)
        if ((latestAssessment.objective[q.id] ?? latestAssessment.review.grades[q.id]) !== true)
            weak.add(q.competency);
} const assessmentsReady = completedSections.length === d.sections.length; const knowledge = latestAssessment ? Object.values(latestAssessment.objective) : []; const score = knowledge.length ? Math.round(100 * knowledge.filter(Boolean).length / knowledge.length) : null; const manualPassed = latestAssessment?.review && d.assessment.filter(q => q.kind === 'written').every(q => latestAssessment.review!.grades[q.id] === true); const assessmentPassed = !!latestAssessment?.review && assessmentCriteria(d,latestAssessment.objective,latestAssessment.review.grades); const canSubmitHomework = assessmentPassed; const canComplete = assessmentsReady && assessmentPassed && latestHomework?.status === 'approved' && latestHomework.assessmentId === latestAssessment?.id; const remediated = (comp: string) => events.some(x => x.kind === 'remediation' && x.event_key === comp && x.passed && latestAssessment && x.created_at >= latestAssessment.createdAt); const evidence: {
    category: EvidenceKind;
    itemId: string;
    competency: string;
    sectionId: string;
    objectiveId: string;
    source: string;
    version: string;
    reviewer: string | null;
    approved: boolean | null;
    createdAt: string;
}[] = []; for (const event of events.filter(e => e.kind === 'activity')) {
    const q = d.sections.flatMap(s => s.activities).find(q => q.id === event.event_key);
    if (q)
        evidence.push({ category: q.category, itemId: q.id, competency: q.competency, sectionId: q.sectionId, objectiveId: q.objectiveId, source: event.id, version: d.version, reviewer: null, approved: !!event.passed, createdAt: event.created_at });
} for (const s of submissions)
    for (const q of s.kind === 'assessment' ? d.assessment : d.homework)
        evidence.push({ category: q.category, itemId: q.id, competency: q.competency, sectionId: q.sectionId, objectiveId: q.objectiveId, source: s.id, version: d.version, reviewer: s.review?.reviewer ?? null, approved: s.review ? (s.objective[q.id] ?? s.review.grades[q.id] ?? null) : null, createdAt: s.createdAt }); return { e, d, events, submissions, completion, drafts, completedSections, latestAssessment, latestHomework, weak: [...weak], score, assessmentPassed, canSubmitHomework, canComplete: !!canComplete && (d.stageId==='stage-1'||[...weak].every(remediated)), remediated, evidence }; }
function projection(x: Awaited<ReturnType<typeof internal>>) { return { class: publicClass(x.d), revision: x.e.revision, drafts: x.drafts as Record<string, Record<string, Answer>>, enrollmentId: x.e.id, completedSections: x.completedSections, activities: Object.fromEntries(x.events.filter(e => e.kind === 'activity').map(e => [e.event_key, { passed: !!e.passed, answer: JSON.parse(e.response_json) }])), submissions: x.submissions, weak: x.weak, remediated: x.weak.filter(x.remediated), knowledgeScore: x.score, canStartAssessment: x.completedSections.length === x.d.sections.length && !x.latestAssessment?.status.includes('awaiting') && x.weak.every(x.remediated), canSubmitHomework: x.canSubmitHomework && x.latestHomework?.status !== 'awaiting_review' && !(x.latestHomework?.status === 'approved' && x.latestHomework.assessmentId === x.latestAssessment?.id), canComplete: x.canComplete, completed: !!x.completion, completedAt: x.completion?.completed_at ?? null, evidence: x.evidence }; }
export async function schoolState(db: D1Database, student: string, classId: string, version?: string) { return projection(await internal(db, student, classId, version)); }
export async function instructorSchoolState(db: D1Database, actor: string, student: string, classId: string) { await assertInstructor(db, actor); const x = await internal(db, student, classId); return { ...projection(x), privateClass: x.d }; }
export async function schoolCatalog(db: D1Database, user: string) { await learner(db, user); const es = (await db.prepare('SELECT class_id,version FROM school_enrollment WHERE user_id=? ORDER BY created_at').bind(user).all<Row>()).results; const out = []; for (const e of es) {
    try {
        const s = await schoolState(db, user, e.class_id, e.version);
        out.push({ id: e.class_id, version: e.version, title: s.class.title, stageId: s.class.stageId, completed: s.completed });
    }
    catch (e) {
        if ((e as any).status !== 403)
            throw e;
    }
} return out; }
// Every write is conditional on a one-use operation inserted under a fresh enrollment revision and account/course guard.
async function commit(db: D1Database, x: Awaited<ReturnType<typeof internal>>, actor: string, input: Row, writes: (op: string) => D1PreparedStatement[]) {
    if (typeof input.requestKey !== 'string' || input.requestKey.length < 8 || input.requestKey.length > 100)
        fail('Request key required', 400);
    if (input.expectedRevision !== x.e.revision)
        fail('Class changed; refresh before saving.', 409);
    const op = uid(), body = JSON.stringify(input), at = now();
    const previous = await db.prepare('SELECT body_json FROM school_operation WHERE enrollment_id=? AND actor_id=? AND request_key=?').bind(x.e.id, actor, input.requestKey).first<Row>();
    if (previous) {
        if (previous.body_json !== body)
            fail('Request key reused', 409);
        return;
    }
    const account = `u.lifecycle_status='ACTIVE' AND COALESCE(u.banned,0)=0 AND COALESCE(u.must_change_password,0)=0 AND (u.role='admin' OR u.subscriptionStatus IN ('active','trialing') OR (u.complimentaryAccessRevokedAt IS NULL AND julianday(u.complimentaryAccessExpiresAt)>julianday('now') AND (u.complimentaryAccessStartsAt IS NULL OR julianday(u.complimentaryAccessStartsAt)<=julianday('now'))))`;
    const guard = `EXISTS(SELECT 1 FROM school_enrollment WHERE id=? AND revision=?) AND EXISTS(SELECT 1 FROM user u WHERE u.id=? AND ${account}${actor !== x.e.user_id ? " AND u.role='admin'" : " AND u.role='student'"}) AND EXISTS(SELECT 1 FROM user u WHERE u.id=? AND ${account} AND u.role='student') AND EXISTS(SELECT 1 FROM academy_lesson l JOIN academy_module m ON m.id=l.module_id JOIN academy_course c ON c.id=m.course_id JOIN student_course_assignment a ON a.course_id=c.id WHERE l.id=? AND l.status='published' AND m.status='published' AND c.status='published' AND a.user_id=? AND a.status='assigned')`;
    const batch = [db.prepare(`INSERT INTO school_operation(id,enrollment_id,actor_id,request_key,body_json,created_at) SELECT ?,?,?,?,?,? WHERE ${guard}`).bind(op, x.e.id, actor, input.requestKey, body, at, x.e.id, x.e.revision, actor, x.e.user_id, x.d.lessonId, x.e.user_id), ...writes(op), db.prepare('UPDATE school_enrollment SET revision=revision+1 WHERE id=? AND EXISTS(SELECT 1 FROM school_operation WHERE id=?)').bind(x.e.id, op)];
    const result = await db.batch(batch);
    if (!result[0].meta.changes)
        fail('Access or class revision changed; refresh.', 409);
}
function validAnswers(items: Item[], answers: unknown) { if (!answers || typeof answers !== 'object' || Array.isArray(answers) || Object.keys(answers).length !== items.length || items.some(q => !Object.hasOwn(answers, q.id)))
    fail('Submit exactly the assigned questions', 400); for (const q of items) {
    try {
        validateAnswer(q, (answers as Row)[q.id]);
    }
    catch {
        fail('Invalid response: ' + q.id, 400);
    }
} return answers as Record<string, Answer>; }
export async function schoolCommand(db: D1Database, user: string, input: Row) {
    const x = await internal(db, user, input.classId, input.version);
    if (x.completion)
        fail('Class already completed; completion history is preserved.', 409);
    const { d } = x;
    const event = (kind: string, key: string, response: unknown, passed: boolean) => (op: string) => [db.prepare('INSERT INTO school_event SELECT ?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM school_operation WHERE id=?)').bind(uid(), x.e.id, op, kind, key, JSON.stringify(response), passed ? 1 : 0, now(), op)];
    let writes: (op: string) => D1PreparedStatement[];
    if (input.action === 'draft') {
        const kind = input.kind;
        if (kind !== 'assessment' && kind !== 'homework')
            fail('Invalid draft kind', 400);
        if (kind === 'homework' && !x.canSubmitHomework)
            fail('Homework not available', 409);
        const items = kind === 'assessment' ? d.assessment : d.homework, answers = input.answers;
        if (!answers || typeof answers !== 'object' || Array.isArray(answers) || Object.keys(answers).some(id => !items.some(q => q.id === id)))
            fail('Invalid draft', 400);
        for (const [id, value] of Object.entries(answers)) {
            const q = items.find(q => q.id === id)!;
            if (q.kind === 'written' || q.kind === 'reflection') {
                if (typeof value !== 'string' || value.length > 5000)
                    fail('Invalid draft response', 400);
            }
            else if (q.kind === 'matching') {
                if (!value || typeof value !== 'object' || Array.isArray(value) || Object.entries(value).some(([k, v]) => !q.items?.some(i => i.id === k) || !q.targets?.some(t => t.id === v)))
                    fail('Invalid draft matching', 400);
            }
            else
                validateAnswer(q, value);
        }
        writes = op => [db.prepare('INSERT INTO school_draft SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM school_operation WHERE id=?) ON CONFLICT(enrollment_id,kind) DO UPDATE SET answers_json=excluded.answers_json,updated_at=excluded.updated_at').bind(x.e.id, kind, JSON.stringify(answers), now(), op)];
    }
    else if (input.action === 'activity') {
        const q = d.sections.flatMap(s => s.activities).find(q => q.id === input.itemId);
        if (!q)
            fail('Activity unavailable', 400);
        const index = d.sections.findIndex(s => s.id === q.sectionId);
        if (index > 0 && !x.completedSections.includes(d.sections[index - 1].id))
            fail('Review previous section first', 409);
        validateAnswer(q, input.answer);
        writes = event('activity', q.id, input.answer, gradeObjective(q, input.answer) === true);
    }
    else if (input.action === 'section') {
        const index = d.sections.findIndex(s => s.id === input.sectionId);
        if (index < 0)
            fail('Section unavailable', 400);
        const s = d.sections[index];
        if (index > 0 && !x.completedSections.includes(d.sections[index - 1].id))
            fail('Review previous section first', 409);
        if (!s.activities.every(a => x.events.some(e => e.kind === 'activity' && e.event_key === a.id && e.passed)))
            fail('Complete the section checks first', 409);
        writes = event('section', s.id, {}, true);
    }
    else if (input.action === 'assessment' || input.action === 'homework') {
        const kind = input.action;
        if (kind === 'assessment' && (x.completedSections.length !== d.sections.length || x.latestAssessment?.status === 'awaiting_review' || !x.weak.every(x.remediated)))
            fail('Complete sections, review and targeted remediation first', 409);
        if (kind === 'homework' && (!x.canSubmitHomework || x.latestHomework?.status === 'awaiting_review'))
            fail('Reviewed assessment and any prior homework review required', 409);
        const items = kind === 'assessment' ? d.assessment : d.homework, answers = validAnswers(items, input.answers), objective = Object.fromEntries(items.filter(q => q.kind === 'choice' || q.kind === 'matching').map(q => [q.id, gradeObjective(q, answers[q.id])])), n = x.submissions.filter(s => s.kind === kind).length + 1;
        writes = op => [db.prepare("INSERT INTO school_submission SELECT ?,?,?,?,?,?,?,?,'awaiting_review',NULL,? WHERE EXISTS(SELECT 1 FROM school_operation WHERE id=?)").bind(uid(), x.e.id, op, kind, kind === 'homework' ? x.latestAssessment!.id : null, n, JSON.stringify(answers), JSON.stringify(objective), now(), op)];
    }
    else if (input.action === 'remediate') {
        const r = d.remediation.find(r => r.competency === input.competency);
        if (!r || !x.weak.includes(r.competency))
            fail('No assigned targeted remediation', 400);
        validateAnswer(r.reinforcement, input.answer);
        writes = event('remediation', r.competency, input.answer, gradeObjective(r.reinforcement, input.answer) === true);
    }
    else if (input.action === 'complete') {
        if (!x.canComplete)
            fail('Reviewed knowledge, critical reasoning and approved homework required', 409);
        writes = op => [db.prepare('INSERT INTO school_completion SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM school_operation WHERE id=?)').bind(x.e.id, JSON.stringify({ version: d.version, contentSha: x.e.content_sha, completedSections: x.completedSections, evidence: x.evidence, submissionIds: x.submissions.map(s => s.id), policy: 'knowledge80-criticalReasoning-homework-v1' }), now(), op)];
    }
    else
        fail('Unknown class action', 400);
    await commit(db, x, user, input, writes);
    return schoolState(db, user, d.id, d.version);
}
export async function schoolReview(db: D1Database, actor: string, input: Row) { await assertInstructor(db, actor); const x = await internal(db, input.studentId, input.classId, input.version); if (x.completion)
    fail('Completion is immutable', 409); const s = x.submissions.find(s => s.id === input.submissionId), latest = x.submissions.filter(item => item.kind === s?.kind).at(-1); if (!s || s.id !== latest?.id || s.review || s.status !== 'awaiting_review')
    fail('Submission unavailable or already reviewed', 409); const items = s.kind === 'assessment' ? x.d.assessment : x.d.homework, manual = items.filter(q => q.kind === 'written' || q.kind === 'reflection'), grades = input.grades; if (!grades || typeof grades !== 'object' || Array.isArray(grades) || Object.keys(grades).length !== manual.length || !manual.every(q => typeof grades[q.id] === 'boolean'))
    fail('Review each written response individually', 400); if (typeof input.feedback !== 'string' || input.feedback.trim().length < 5 || input.feedback.length > 5000)
    fail('Provide review feedback', 400); const objectiveValues = Object.values(s.objective); const knowledgePass = s.kind === 'assessment' ? objectiveValues.filter(Boolean).length / objectiveValues.length >= .8 : objectiveValues.every(Boolean); const passed = knowledgePass && manual.every(q => grades[q.id]) && (s.kind!=='assessment'||assessmentCriteria(x.d,s.objective,grades)); const review = { grades, feedback: input.feedback.trim(), reviewer: actor, reviewedAt: now() }; await commit(db, x, actor, { ...input, requestKey: input.requestKey ?? uid() }, op => [db.prepare('UPDATE school_submission SET status=?,review_json=? WHERE id=? AND review_json IS NULL AND EXISTS(SELECT 1 FROM school_operation WHERE id=?)').bind(passed ? 'approved' : 'returned', JSON.stringify(review), s.id, op)]); return schoolState(db, input.studentId, input.classId, x.d.version); }
