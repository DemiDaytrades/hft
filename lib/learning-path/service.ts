import { assertLifecycleActive } from '../student-lifecycle';
import { interactiveLesson } from '../academy/learning/policy';
import { isLearningGateSatisfied } from '../academy/learning/service';
import { hasStudentAccess } from '../membership-access';
import { captureEducationalSource, readCurriculum } from './source';
import { recommendLearningPath, initialInstructor, toStudentPath, LEARNING_ENGINE_VERSION } from './engine';
import { DOMAINS, LEVELS, COMPETENCIES, type InstructorPath, type LearningPathVersion } from './contracts';
type Actor = {
    userId: string;
    role: string;
};
const id = () => crypto.randomUUID(), now = () => new Date().toISOString();
const fail = (m: string, status = 400): never => { throw Object.assign(new Error(m), { status }); };
function canonical(v: any): string { return Array.isArray(v) ? `[${v.map(canonical).join(',')}]` : v && typeof v === 'object' ? `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}` : JSON.stringify(v); }
async function hash(v: unknown) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical(v))))).map(x => x.toString(16).padStart(2, '0')).join(''); }
async function staff(db: D1Database, a: Actor, student?: string) { await assertLifecycleActive(db, a.userId); const u = await db.prepare('SELECT role,banned,must_change_password FROM user WHERE id=?').bind(a.userId).first<any>(); if (u?.role !== 'admin' || u.banned || u.must_change_password || a.userId === student)
    fail('Forbidden: authorized instructor required.', 403); }
function view(r: any): LearningPathVersion { const source = JSON.parse(r.source_json), recommendation = JSON.parse(r.recommendation_json), instructor = JSON.parse(r.instructor_json); return { id: r.id, studentId: r.student_id, seriesId: r.series_id, version: r.version, revision: r.edit_revision, status: r.status, source, sourceDigest: r.source_digest, recommendation, instructor, studentPreview: r.student_json ? JSON.parse(r.student_json) : toStudentPath(source, recommendation, instructor), createdAt: r.created_at, createdBy: r.created_by, approvedAt: r.approved_at, approvedBy: r.approved_by }; }
async function load(db: D1Database, a: Actor, pid: string) { await staff(db, a); const r = await db.prepare('SELECT v.*,s.student_id FROM learning_path_version v JOIN learning_path_series s ON s.id=v.series_id WHERE v.id=?').bind(pid).first<any>(); if (!r)
    fail('Learning path unavailable.', 404); await staff(db, a, r.student_id); return view(r); }
export async function getStaffLearningPaths(db: D1Database, a: Actor, student: string) { await staff(db, a, student); const rows = (await db.prepare('SELECT v.*,s.student_id FROM learning_path_version v JOIN learning_path_series s ON s.id=v.series_id WHERE s.student_id=? ORDER BY version DESC').bind(student).all<any>()).results; const events = (await db.prepare('SELECT e.* FROM learning_path_event e JOIN learning_path_version v ON v.id=e.version_id JOIN learning_path_series s ON s.id=v.series_id WHERE s.student_id=? ORDER BY e.rowid').bind(student).all<any>()).results; const series = await db.prepare('SELECT current_version_id FROM learning_path_series WHERE student_id=?').bind(student).first<any>(); const enrollments = (await db.prepare('SELECT e.* FROM learning_path_enrollment e JOIN learning_path_version v ON v.id=e.version_id JOIN learning_path_series s ON s.id=v.series_id WHERE s.student_id=?').bind(student).all<any>()).results; return { versions: rows.map(view), events, enrollments, currentVersionId: series?.current_version_id ?? null }; }
export async function generateLearningPath(db: D1Database, a: Actor, student: string, requestKey?: string) { await staff(db, a, student); await assertLifecycleActive(db, student); const source = await captureEducationalSource(db, student), digest = await hash(source), key = requestKey ?? `${digest}:${LEARNING_ENGINE_VERSION}`; if (typeof key !== 'string' || !key.length || key.length > 200)
    fail('Invalid request key.'); await db.prepare('INSERT INTO learning_path_series(id,student_id) VALUES(?,?) ON CONFLICT(student_id) DO NOTHING').bind(id(), student).run(); const series = await db.prepare('SELECT id FROM learning_path_series WHERE student_id=?').bind(student).first<any>(); const recommendation = recommendLearningPath(source), at = now(); await db.prepare(`INSERT INTO learning_path_version(id,series_id,version,request_key,source_json,source_digest,engine_version,recommendation_json,instructor_json,created_at,created_by,updated_at,updated_by) SELECT ?,?,COALESCE(MAX(version),0)+1,?,?,?,?,?,?,?,?,?,? FROM learning_path_version WHERE series_id=? ON CONFLICT(series_id,request_key) DO NOTHING`).bind(id(), series.id, key, canonical(source), digest, LEARNING_ENGINE_VERSION, JSON.stringify(recommendation), JSON.stringify(initialInstructor(recommendation)), at, a.userId, at, a.userId, series.id).run(); const r = await db.prepare('SELECT id,source_digest FROM learning_path_version WHERE series_id=? AND request_key=?').bind(series.id, key).first<any>(); if (r.source_digest !== digest)
    fail('Request key source changed.', 409); return load(db, a, r.id); }
function validate(p: LearningPathVersion, value: unknown): InstructorPath {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return fail('Invalid instructor path.');
    const v = value as InstructorPath;
    if (Object.keys(v).some(k => !['overall', 'explanation', 'privateNotes', 'reason', 'startingLessonId', 'decisions', 'overrides', 'demonstrations'].includes(k)) || !(v.overall === null || LEVELS.includes(v.overall)) || ['explanation', 'privateNotes', 'reason'].some(k => typeof v[k as keyof InstructorPath] !== 'string' || String(v[k as keyof InstructorPath]).length > 8000) || v.explanation.trim().length < 10 || v.reason.trim().length < 10)
        fail('Explain the student guidance and review reason.');
    if (!Array.isArray(v.decisions) || v.decisions.length > p.source.curriculum.length || new Set(v.decisions.map(d => d.lessonId)).size !== v.decisions.length)
        fail('Invalid curriculum decisions.');
    for (const d of v.decisions) {
        const l = p.source.curriculum.find(l => l.id === d.lessonId);
        if (!l || !['REQUIRE', 'RECOMMEND', 'REMEDIATE', 'SKIP', 'OPTIONAL'].includes(d.action) || typeof d.reason !== 'string' || d.reason.trim().length < 5 || d.reason.length > 2000)
            fail('Only existing curriculum with a reason is permitted.');
        if (d.action === 'SKIP' && l!.classification !== 'PLACEMENT_ELIGIBLE')
            fail('Required core cannot be skipped; only placement-eligible content can accelerate.');
    }
    for (const l of p.source.curriculum.filter(l => l.classification === 'REQUIRED_CORE' || l.id === 'hft-money-1'))
        if (!v.decisions.some(d => d.lessonId === l.id && ['REQUIRE', 'RECOMMEND', 'REMEDIATE'].includes(d.action)))
            fail('Required core must remain assigned.');
    if (v.decisions.some((d, i) => i > 0 && p.source.curriculum.findIndex(l => l.id === v.decisions[i - 1].lessonId) > p.source.curriculum.findIndex(l => l.id === d.lessonId)))
        fail('Preserve catalog prerequisite order; use explicit eligible skips to accelerate.');
    if (v.startingLessonId !== null && !v.decisions.some(d => d.lessonId === v.startingLessonId && d.action !== 'SKIP'))
        fail('Starting point must be an assigned existing lesson.');
    if (!Array.isArray(v.overrides) || v.overrides.length > DOMAINS.length || new Set(v.overrides.map(o => o.domain)).size !== v.overrides.length)
        fail('Invalid domain overrides.');
    for (const o of v.overrides) {
        if (!DOMAINS.includes(o.domain) || !COMPETENCIES.includes(o.competency) || typeof o.reason !== 'string' || o.reason.trim().length < 10 || o.reason.length > 2000)
            fail('Every override needs a documented reason.');
        if (o.verification && o.competency !== 'MASTERED')
            fail('Domain verification requires a mastered override.');
        if (o.competency === 'MASTERED') {
            const x = o.verification;
            if (!x || x.scope !== 'DOMAIN' || x.demonstrated !== true || typeof x.reference !== 'string' || !x.reference.trim() || x.reference.length > 500 || !Number.isFinite(Date.parse(x.observedAt)) || typeof x.statement !== 'string' || x.statement.trim().length < 20 || x.statement.length > 2000)
                fail('Mastered requires recorded instructor verification of domain demonstration.');
        }
    }
    if (!Array.isArray(v.demonstrations) || v.demonstrations.length > 30 || v.demonstrations.some(d => !DOMAINS.includes(d.domain) || typeof d.instruction !== 'string' || d.instruction.trim().length < 5 || d.instruction.length > 2000))
        fail('Invalid practical demonstration requirements.');
    // Explicit field projection prevents arbitrary private payloads entering the public DTO.
    return { overall: v.overall, explanation: v.explanation, privateNotes: v.privateNotes, reason: v.reason, startingLessonId: v.startingLessonId, decisions: v.decisions.map(d => ({ lessonId: d.lessonId, action: d.action, reason: d.reason })), overrides: v.overrides.map(o => ({ domain: o.domain, competency: o.competency, reason: o.reason, ...(o.verification ? { verification: { reference: o.verification.reference, observedAt: o.verification.observedAt, statement: o.verification.statement, scope: o.verification.scope, demonstrated: o.verification.demonstrated } } : {}) })), demonstrations: v.demonstrations.map(d => ({ domain: d.domain, instruction: d.instruction })) };
}
const latest = 'AND version=(SELECT MAX(version) FROM learning_path_version x WHERE x.series_id=learning_path_version.series_id)';
export async function saveLearningPath(db: D1Database, a: Actor, pid: string, revision: number, value: unknown) { const p = await load(db, a, pid); await assertLifecycleActive(db, p.studentId); const content = validate(p, value); const r = await db.prepare(`UPDATE learning_path_version SET instructor_json=?,edit_revision=edit_revision+1,updated_at=?,updated_by=? WHERE id=? AND edit_revision=? AND status='DRAFT' ${latest}`).bind(JSON.stringify(content), now(), a.userId, pid, revision).run(); if (!r.meta.changes)
    fail('Path changed or a newer version exists; reload.', 409); return load(db, a, pid); }
export async function approveLearningPath(db: D1Database, a: Actor, pid: string, revision: number) {
    const p = await load(db, a, pid);
    await assertLifecycleActive(db, p.studentId);
    if (p.status !== 'DRAFT' || p.revision !== revision)
        fail('Path changed; reload.', 409);
    const content = validate(p, p.instructor);
    if (canonical(await readCurriculum(db)) !== canonical(p.source.curriculum))
        fail('Curriculum changed; generate a new recommendation.', 409);
    if (content.startingLessonId) {
        const start = p.source.curriculum.find(l => l.id === content.startingLessonId)!;
        for (const earlier of p.source.curriculum.filter(l => l.courseId === start.courseId && l.order < start.order)) {
            const decision = content.decisions.find(d => d.lessonId === earlier.id);
            if (decision?.action === 'SKIP' && earlier.classification === 'PLACEMENT_ELIGIBLE')
                continue;
            const progress = await db.prepare("SELECT status FROM student_lesson_progress WHERE user_id=? AND lesson_id=?").bind(p.studentId, earlier.id).first<any>();
            const lesson = await db.prepare('SELECT * FROM academy_lesson WHERE id=?').bind(earlier.id).first<any>();
            if (progress?.status !== 'completed' || (interactiveLesson(lesson.content) && !await isLearningGateSatisfied(db, p.studentId, lesson)))
                fail('Starting point is locked by earlier required prerequisites; start earlier or justify eligible skips.');
        }
    }
    const token = id(), at = now();
    const condition = 'EXISTS(SELECT 1 FROM learning_path_version WHERE id=? AND approval_token=? AND status=\'DRAFT\')';
    const statements = [db.prepare(`UPDATE learning_path_version SET approval_token=?,student_json=?,updated_at=?,updated_by=? WHERE id=? AND edit_revision=? AND status='DRAFT' ${latest} AND EXISTS(SELECT 1 FROM user WHERE id=? AND lifecycle_status='ACTIVE' AND COALESCE(banned,0)=0) AND EXISTS(SELECT 1 FROM user WHERE id=? AND role='admin' AND lifecycle_status='ACTIVE' AND COALESCE(banned,0)=0 AND COALESCE(must_change_password,0)=0)`).bind(token, JSON.stringify(toStudentPath(p.source, p.recommendation, content)), at, a.userId, pid, revision, p.studentId, a.userId)];
    for (const d of content.decisions) {
        const l = p.source.curriculum.find(l => l.id === d.lessonId)!;
        statements.push(db.prepare(`INSERT INTO learning_path_decision SELECT ?,?,?,?,? WHERE ${condition}`).bind(pid, d.lessonId, d.action, d.reason, l.catalogUpdatedAt!, pid, token));
    }
    const courses = [...new Set(content.decisions.filter(d => d.action !== 'SKIP').map(d => p.source.curriculum.find(l => l.id === d.lessonId)!.courseId))];
    for (const c of courses) {
        statements.push(db.prepare(`INSERT INTO student_course_assignment(id,user_id,course_id,assigned_by,status,assigned_at) SELECT ?,?,?,?,'assigned',? WHERE ${condition} AND NOT EXISTS(SELECT 1 FROM student_course_assignment WHERE user_id=? AND course_id=? AND status='assigned')`).bind(id(), p.studentId, c, a.userId, at, pid, token, p.studentId, c));
        statements.push(db.prepare(`INSERT INTO learning_path_enrollment SELECT ?,?,id FROM student_course_assignment WHERE user_id=? AND course_id=? AND status='assigned' AND ${condition} ORDER BY assigned_at,id LIMIT 1`).bind(pid, c, p.studentId, c, pid, token));
    }
    statements.push(db.prepare("UPDATE learning_path_version SET status='APPROVED',approved_at=?,approved_by=?,edit_revision=edit_revision+1 WHERE id=? AND approval_token=? AND status='DRAFT'").bind(at, a.userId, pid, token));
    statements.push(db.prepare("UPDATE learning_path_version SET status='SUPERSEDED',superseded_at=?,updated_at=?,updated_by=? WHERE id=(SELECT current_version_id FROM learning_path_series WHERE id=?) AND status='APPROVED' AND EXISTS(SELECT 1 FROM learning_path_version WHERE id=? AND approval_token=? AND status='APPROVED')").bind(at, at, a.userId, p.seriesId, pid, token));
    statements.push(db.prepare("UPDATE learning_path_series SET current_version_id=? WHERE id=? AND EXISTS(SELECT 1 FROM learning_path_version WHERE id=? AND approval_token=? AND status='APPROVED')").bind(pid, p.seriesId, pid, token));
    const results = await db.batch(statements);
    if (!results[0].meta.changes)
        fail('Concurrent change or lifecycle restriction; reload.', 409);
    return load(db, a, pid);
}
/** authenticatedUserId must come from session, never query/body. */
export async function getStudentLearningPath(db: D1Database, authenticatedUserId: string) { await assertLifecycleActive(db, authenticatedUserId); const u = await db.prepare('SELECT * FROM user WHERE id=?').bind(authenticatedUserId).first<any>(); if (!u || u.banned || u.must_change_password || (u.role!=='admin'&&!hasStudentAccess(u)))
    fail('Learning path unavailable.', 403); const r = await db.prepare("SELECT v.version,v.approved_at,v.student_json FROM learning_path_series s JOIN learning_path_version v ON v.id=s.current_version_id AND v.series_id=s.id WHERE s.student_id=? AND v.status='APPROVED'").bind(authenticatedUserId).first<any>(); return r ? { version: r.version, approvedAt: r.approved_at, path: JSON.parse(r.student_json) as import('./contracts').StudentPath } : null; }
