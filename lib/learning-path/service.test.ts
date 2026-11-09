import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import { fixtureDb } from '../financial-plan/testing/db';
import { installMoneyLesson } from '../academy/learning/seed';
import { MONEY_LESSON } from '../academy/curriculum/what-is-money';
import { QUESTIONS } from '../placement-assessment';
import { changeLifecycle } from '../student-lifecycle';
let current: any, session: any;
const load = (Module as any)._load;
(Module as any)._load = function (name: string, ...args: any[]) { if (name === '@opennextjs/cloudflare')
    return { getCloudflareContext: () => ({ env: { DB: current } }) }; if (name === './auth' || name === '@/lib/auth')
    return { ROLES: { admin: 'admin', student: 'student' }, getAuth: () => ({ api: { getSession: async () => session } }) }; if (name === 'react')
    return { ...load.call(this, name, ...args), cache: (f: any) => f }; if (name === 'next/headers')
    return { headers: async () => new Headers() }; return load.call(this, name, ...args); };
const { generateLearningPath, getStaffLearningPaths, saveLearningPath, approveLearningPath, getStudentLearningPath } = require('./service') as typeof import('./service');
globalThis.fetch = async () => { throw new Error('External network forbidden'); };
const storage = require('../placement-assessment-storage'), academy = require('../academy'), learning = require('../academy/learning/service');
const actor = { userId: 'admin', role: 'admin' };
async function setup() { const f = fixtureDb(); current = f.db; for (const [id, role] of [['admin', 'admin'], ['a', 'student'], ['b', 'student']])
    f.sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt,subscriptionStatus) VALUES(?,?,?,?,?,?,?)').run(id, id, `${id}@example.invalid`, role, '2026-11-07', '2026-11-07', id === 'a' ? 'active' : null); f.sqlite.prepare('UPDATE user SET complimentaryAccessExpiresAt=? WHERE id=?').run(new Date(Date.now() + 30 * 86400000).toISOString(), 'b'); await installMoneyLesson(f.db); return f; }
async function assessment(user = 'a', correct = true) { const id = await storage.createAttempt(user, 'v1'); await storage.completeAttempt(user, id, Object.fromEntries(QUESTIONS.map(q => [q.id, correct ? q.correct : [q.choices.find(c => !q.correct.includes(c))!]])), 'v1'); return id; }
const reviewed = (p: any) => ({ ...p.instructor, reason: 'Reviewed knowledge and practical evidence; preserving required core.', explanation: 'Begin with required HFT core, then focus on the recorded domain gaps. Practical verification remains separate.', privateNotes: 'PRIVATE_SENTINEL' });
test('persisted recommendation, authority/overrides, approval assignments, privacy and version history', async () => {
    const { db, sqlite } = await setup();
    try {
        await assessment();
        const p = await generateLearningPath(db, actor, 'a');
        assert.equal(p.recommendation.overall, 'ADVANCED');
        assert.equal(p.status, 'DRAFT');
        assert.equal(await getStudentLearningPath(db, 'a'), null);
        assert.equal((await generateLearningPath(db, actor, 'a')).id, p.id);
        assert.equal((sqlite.prepare('SELECT COUNT(*) AS n FROM student_course_assignment').get() as any).n, 0);
        await assert.rejects(approveLearningPath(db, { userId: 'a', role: 'admin' }, p.id, p.revision), /Forbidden/);
        await assert.rejects(saveLearningPath(db, actor, p.id, p.revision, { ...reviewed(p), decisions: [{ lessonId: MONEY_LESSON.id, action: 'SKIP', reason: 'Prior knowledge' }] }), /core/i);
        await assert.rejects(saveLearningPath(db, actor, p.id, p.revision, { ...reviewed(p), overrides: [{ domain: 'RISK_MANAGEMENT', competency: 'MASTERED', reason: 'I think so' }] }), /demonstration|verif/i);
        const modified = await saveLearningPath(db, actor, p.id, p.revision, { ...reviewed(p), overrides: [{ domain: 'RISK_MANAGEMENT', competency: 'DEVELOPING', reason: 'Consultation identified concept application gaps.' }] });
        assert.equal(modified.recommendation.domains.find((d: any) => d.domain === 'RISK_MANAGEMENT')!.competency, 'PROFICIENT');
        const approved = await approveLearningPath(db, actor, p.id, modified.revision);
        assert.equal(approved.status, 'APPROVED');
        assert.equal((sqlite.prepare('SELECT COUNT(*) AS n FROM student_course_assignment').get() as any).n, 1);
        assert.equal((sqlite.prepare('SELECT COUNT(*) AS n FROM academy_lesson').get() as any).n, 1);
        const view = await getStudentLearningPath(db, 'a');
        assert.equal(view!.path.domains.find(d => d.domain === 'RISK_MANAGEMENT')!.competency, 'DEVELOPING');
        for (const key of ['PRIVATE_SENTINEL', 'source_json', 'knowledgeScore', 'assessmentSummary', 'consultationContext'])
            assert.ok(!JSON.stringify(view).includes(key));
        session = { user: { id: 'b', role: 'student' } };
        const route = require('../../app/api/learning-path/route');
        assert.equal(await (await route.GET(new Request('https://local.invalid/api/learning-path?studentId=a'))).json(), null);
        await assert.rejects(academy.markLessonComplete('a', MONEY_LESSON.id), /requirements|mastery|complete/i);
        const before = JSON.stringify(approved);
        await assessment('a', false);
        const v2 = await generateLearningPath(db, actor, 'a');
        assert.equal(v2.version, 2);
        assert.equal(v2.recommendation.overall, 'BEGINNER');
        assert.equal((await getStudentLearningPath(db, 'a'))!.version, 1);
        let next = await saveLearningPath(db, actor, v2.id, v2.revision, reviewed(v2));
        sqlite.exec("CREATE TRIGGER fail_lp_approval BEFORE UPDATE OF status ON learning_path_version WHEN NEW.version=2 AND NEW.status='APPROVED' BEGIN SELECT RAISE(ABORT,'Injected approval failure'); END;");
        await assert.rejects(approveLearningPath(db, actor, next.id, next.revision), /Injected/);
        assert.equal((await getStudentLearningPath(db, 'a'))!.version, 1);
        sqlite.exec('DROP TRIGGER fail_lp_approval');
        await approveLearningPath(db, actor, next.id, next.revision);
        assert.equal((await getStudentLearningPath(db, 'a'))!.version, 2);
        assert.equal((sqlite.prepare('SELECT COUNT(*) AS n FROM student_course_assignment').get() as any).n, 1);
        const old = (await getStaffLearningPaths(db, actor, 'a')).versions.find(v => v.id === p.id)!;
        assert.equal(old.status, 'SUPERSEDED');
        assert.equal(JSON.parse(before).sourceDigest, old.sourceDigest);
        assert.deepEqual(JSON.parse(before).recommendation, old.recommendation);
    }
    finally {
        sqlite.close();
    }
});
test('former student cannot receive approval/access; history remains', async () => {
    const { db, sqlite } = await setup();
    try {
        await assessment();
        let p = await generateLearningPath(db, actor, 'a');
        p = await saveLearningPath(db, actor, p.id, p.revision, reviewed(p));
        await changeLifecycle(db, actor, 'a', { action: 'deactivate', revision: 0, confirmation: 'DEACTIVATE a@example.invalid', billingChoice: 'access_only', paidAcknowledged: true });
        await assert.rejects(approveLearningPath(db, actor, p.id, p.revision), /deactivated|lifecycle/i);
        await assert.rejects(getStudentLearningPath(db, 'a'), /deactivated|unavailable/i);
        assert.equal((await getStaffLearningPaths(db, actor, 'a')).versions.length, 1);
        assert.equal((sqlite.prepare('SELECT COUNT(*) AS n FROM student_course_assignment').get() as any).n, 0);
    }
    finally {
        sqlite.close();
    }
});
test('explicit eligible acceleration never completes or bypasses core; stale/concurrent approvals rejected', async () => {
    const { db, sqlite } = await setup();
    try {
        const base = sqlite.prepare('SELECT * FROM academy_lesson WHERE id=?').get(MONEY_LESSON.id) as any;
        // Test-only authored curriculum; never persistent fixtures or fake production lessons.
        for (const [lesson, order, classification] of [['eligible', 1, 'PLACEMENT_ELIGIBLE'], ['later-core', 2, 'REQUIRED_CORE']] as const)
            sqlite.prepare('INSERT INTO academy_lesson(id,module_id,title,lesson_type,content,sort_order,status,created_at,updated_at,placement_classification) VALUES(?,?,?,?,?,?,?,?,?,?)').run(lesson, base.module_id, lesson, 'text', 'Local verification fixture', order, 'published', '2026-11-07', '2026-11-07', classification);
        await assessment();
        let p = await generateLearningPath(db, actor, 'a');
        const content = reviewed(p);
        content.decisions = content.decisions.map((d: any) => d.lessonId === 'eligible' ? { ...d, action: 'SKIP', reason: 'Instructor verified these prerequisite concepts.' } : d);
        const blocked = await saveLearningPath(db, actor, p.id, p.revision, { ...content, startingLessonId: 'later-core' });
        await assert.rejects(approveLearningPath(db, actor, blocked.id, blocked.revision), /locked|prerequisite/);
        p = blocked;
        p = await saveLearningPath(db, actor, p.id, p.revision, content);
        await assert.rejects(saveLearningPath(db, actor, p.id, p.revision - 1, content), /changed/);
        const outcomes = await Promise.allSettled([approveLearningPath(db, actor, p.id, p.revision), approveLearningPath(db, actor, p.id, p.revision)]);
        assert.equal(outcomes.filter(x => x.status === 'fulfilled').length, 1);
        const { isPlacementSkipApproved } = require('./access');
        assert.equal(await isPlacementSkipApproved(db, 'a', 'eligible'), true);
        assert.equal(await isPlacementSkipApproved(db, 'a', MONEY_LESSON.id), false);
        assert.equal(await academy.ensureLessonAvailable('a', 'later-core', MONEY_LESSON.courseId), false);
        assert.equal((sqlite.prepare("SELECT COUNT(*) AS n FROM student_lesson_progress WHERE lesson_id='eligible'").get() as any).n, 0);
        sqlite.prepare("UPDATE academy_lesson SET updated_at='2026-11-08' WHERE id='eligible'").run();
        assert.equal(await isPlacementSkipApproved(db, 'a', 'eligible'), false);
        const next = await generateLearningPath(db, actor, 'a');
        const mastered = { ...reviewed(next), overrides: [{ domain: 'RISK_MANAGEMENT', competency: 'MASTERED', reason: 'Instructor observed whole-domain practical demonstration.', verification: { reference: 'local-review-123', observedAt: '2026-11-07T12:00:00Z', statement: 'Observed position-sizing, loss-limit and scenario application across this domain.', scope: 'DOMAIN', demonstrated: true } }] };
        const saved = await saveLearningPath(db, actor, next.id, next.revision, mastered);
        await approveLearningPath(db, actor, next.id, saved.revision);
        assert.equal((await getStudentLearningPath(db, 'a'))!.path.domains.find(d => d.domain === 'RISK_MANAGEMENT')!.evidenceLevel, 'INSTRUCTOR_VERIFIED');
    }
    finally {
        sqlite.close();
    }
});
