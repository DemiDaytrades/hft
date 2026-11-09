import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { planMoneyLessonInstallation, rehearseMoneyLessonInstallation } from './installer';
import { MONEY_LESSON } from '../curriculum/what-is-money';
function fixture() {
  const db = new DatabaseSync(':memory:');
  const dir = path.resolve(__dirname, '../../../migrations');
  for (const name of readdirSync(dir).filter(n => n.endsWith('.sql')).sort()) db.exec(readFileSync(path.join(dir, name), 'utf8'));
  db.exec("INSERT INTO academy_course(id,title,slug,status,created_at,updated_at) VALUES('existing-course','HFT Trading Foundations','foundations','draft','original','original'); INSERT INTO academy_module(id,course_id,title,sort_order,status,created_at,updated_at) VALUES('existing-module','existing-course','Foundations',0,'draft','original','original')");
  return db;
}
const mapping = { courseId: 'existing-course', moduleId: 'existing-module', sortOrder: 10 };
test('plan reuses explicit existing mapping, preserves approved payload and writes nothing', async () => {
 const db = fixture(); try {
 const before = db.prepare('SELECT * FROM academy_course').all();
 const plan = await planMoneyLessonInstallation(db, mapping);
 assert.equal(plan.inserts.length, 3);
 assert.deepEqual(JSON.parse(plan.inserts[0].values.content as string), { ...MONEY_LESSON, courseId: mapping.courseId, moduleId: mapping.moduleId });
 assert.equal(plan.inserts[0].values.module_id, mapping.moduleId);
 assert.equal(plan.inserts[0].values.status, 'draft');
 assert.equal(db.prepare('SELECT count(*) AS n FROM academy_lesson').get()!.n, 0);
 assert.deepEqual(db.prepare('SELECT * FROM academy_course').all(), before);
 } finally { db.close(); }
});
test('local rehearsal is idempotent and fails closed on any conflicting lesson', async () => {
 const db = fixture(); try {
 assert.equal((await rehearseMoneyLessonInstallation(db, mapping)).inserted, 3);
 assert.equal((await rehearseMoneyLessonInstallation(db, mapping)).inserted, 0);
 db.exec("UPDATE academy_lesson SET content='conflict'; DELETE FROM academy_assignment;");
 await assert.rejects(rehearseMoneyLessonInstallation(db, mapping), /conflict/i);
 assert.equal(db.prepare('SELECT count(*) AS n FROM academy_assignment').get()!.n, 0);
 assert.equal(db.prepare('SELECT count(*) AS n FROM academy_course').get()!.n, 1);
 } finally { db.close(); }
});
test('missing mapping, mismatched parent and equivalent differently identified lesson are refused', async () => {
 const db = fixture(); try {
 await assert.rejects(planMoneyLessonInstallation(db, { ...mapping, moduleId: 'missing' }), /mapping/i);
 db.exec("INSERT INTO academy_lesson(id,module_id,title,lesson_type,sort_order,status,created_at,updated_at) VALUES('other-money','existing-module','What Is Money?','text',0,'draft','original','original')");
 await assert.rejects(planMoneyLessonInstallation(db, mapping), /duplicate/i);
 } finally { db.close(); }
});
test('prepare CLI forbids remote targets, missing explicit mapping, and invalid modes', async () => {
 const { main } = require('../../../scripts/prepare-money-lesson.cjs');
 await assert.rejects(main(['--remote']), /Usage/);
 await assert.rejects(main(['--local-db', '/tmp/production.sqlite', '--course-id', 'c', '--module-id', 'm', '--sort-order', '10']), /Only an existing/);
 await assert.rejects(main(['--local-db', '.wrangler/state/example.sqlite']), /Usage/);
 await assert.rejects(main(['--publish']), /Usage/);
});
test('incomplete interactive schema is refused before producing a misleading install plan', async () => {
 const db = fixture(); try {
 db.exec('ALTER TABLE student_quiz_attempt DROP COLUMN learning_answers_json');
 await assert.rejects(planMoneyLessonInstallation(db, mapping), /0027/);
 assert.equal(db.prepare('SELECT count(*) AS n FROM academy_lesson').get()!.n, 0);
 } finally { db.close(); }
});
test('0027 open-attempt index does not masquerade as migrated 0028 index', async () => {
 const db = fixture(); try {
 db.exec("DROP INDEX student_quiz_attempt_learning_open; CREATE UNIQUE INDEX student_quiz_attempt_learning_open ON student_quiz_attempt(user_id,quiz_id) WHERE learning_version IS NOT NULL AND status='in_progress'");
 await assert.rejects(planMoneyLessonInstallation(db, mapping), /0028/);
 } finally { db.close(); }
});

test('review requires an explicit unoccupied sort position', async () => {
 const db = fixture(); try {
 await assert.rejects(planMoneyLessonInstallation(db, { ...mapping, sortOrder: undefined } as any), /sort/i);
 db.exec("INSERT INTO academy_lesson(id,module_id,title,sort_order,status,created_at,updated_at) VALUES('older','existing-module','Earlier lesson',10,'draft','original','original')");
 await assert.rejects(planMoneyLessonInstallation(db, mapping), /sort/i);
 } finally { db.close(); }
});
test('exact emitted artifact runs twice, protects mapped payload and refuses late conflicts before writes', async () => {
 const { moneyLessonSqlArtifact } = require('./installer');
 const db = fixture(); try {
 const plan = await planMoneyLessonInstallation(db, mapping);
 const artifact = moneyLessonSqlArtifact(plan);
 db.exec(artifact.sqliteSql); db.exec(artifact.sqliteSql);
 assert.equal(db.prepare('SELECT count(*) AS n FROM academy_lesson').get()!.n, 1);
 assert.equal(db.prepare('SELECT sort_order FROM academy_lesson').get()!.sort_order, 10);
 assert.deepEqual(JSON.parse(String(db.prepare('SELECT content FROM academy_lesson').get()!.content)), { ...MONEY_LESSON, courseId: mapping.courseId, moduleId: mapping.moduleId });
 db.exec("DELETE FROM academy_assignment; UPDATE academy_quiz SET title='late conflict'");
 assert.throws(() => db.exec(artifact.sqliteSql), /malformed JSON/);
 db.exec('ROLLBACK');
 assert.equal(db.prepare('SELECT count(*) AS n FROM academy_assignment').get()!.n, 0);
 } finally { db.close(); }
});
test('D1 batch adapter executes identical reviewed statements atomically on last-insert failure', async () => {
 const { moneyLessonSqlArtifact, executeReviewedMoneyLessonBatch } = require('./installer');
 const { sqliteAdapter } = require('../../../scripts/seed-academy-local.cjs');
 const db = fixture(); try {
 const artifact = moneyLessonSqlArtifact(await planMoneyLessonInstallation(db, mapping));
 db.exec("CREATE TRIGGER fixture_refuse_homework BEFORE INSERT ON academy_assignment BEGIN SELECT RAISE(ABORT,'fixture refuses homework'); END");
 await assert.rejects(executeReviewedMoneyLessonBatch(sqliteAdapter(db), artifact), /fixture refuses homework/);
 assert.equal(db.prepare('SELECT count(*) AS n FROM academy_lesson').get()!.n, 0);
 assert.equal(db.prepare('SELECT count(*) AS n FROM academy_quiz').get()!.n, 0);
 db.exec('DROP TRIGGER fixture_refuse_homework');
 await executeReviewedMoneyLessonBatch(sqliteAdapter(db), artifact);
 await executeReviewedMoneyLessonBatch(sqliteAdapter(db), artifact);
 assert.equal(db.prepare('SELECT count(*) AS n FROM academy_lesson').get()!.n, 1);
 assert.equal(db.prepare('SELECT count(*) AS n FROM academy_assignment').get()!.n, 1);
 } finally { db.close(); }
});
