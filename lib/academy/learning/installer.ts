import type { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { moneyLessonRows } from './seed';
import { MONEY_LESSON } from '../curriculum/what-is-money';

type Mapping = { courseId: string; moduleId: string; sortOrder: number };
/** Offline-only plan: explicit existing catalog mapping; no publishing/enrollment. */
export async function planMoneyLessonInstallation(db: DatabaseSync, mapping: Mapping) {
  if (!mapping?.courseId || !mapping?.moduleId) throw new Error('Explicit existing course/module mapping required.');
  if (!Number.isSafeInteger(mapping.sortOrder) || mapping.sortOrder < 0) throw new Error('Explicit nonnegative integer sort order required.');
  if (db.prepare('SELECT id FROM academy_lesson WHERE module_id = ? AND sort_order = ? AND id <> ?').get(mapping.moduleId, mapping.sortOrder, MONEY_LESSON.id)) throw new Error('Reviewed sort order is occupied; existing lessons were not reordered.');
  const course = db.prepare('SELECT * FROM academy_course WHERE id = ?').get(mapping.courseId);
  const module = db.prepare('SELECT * FROM academy_module WHERE id = ?').get(mapping.moduleId);
  if (!course || !module || module.course_id !== mapping.courseId) throw new Error('Invalid existing course/module mapping.');
  // Fail closed before planning content against pre-interactive or incompatible schemas.
  const columns = db.prepare('PRAGMA table_info(student_quiz_attempt)').all();
  if (!['learning_version', 'learning_questions_json', 'learning_answers_json', 'learning_review_json', 'learning_mastery_json'].every(name => columns.some(c => c.name === name)) || !db.prepare("SELECT name FROM sqlite_master WHERE name = 'academy_learning_event'").get()) throw new Error('Migration 0027 required before rehearsal; migrations are never applied by this installer.');
  if (JSON.stringify(db.prepare("PRAGMA index_info(student_quiz_attempt_learning_open)").all().map(column => column.name)) !== JSON.stringify(["user_id", "quiz_id", "learning_version"])) throw new Error('Migration 0028 required before rehearsal.');
  const rows = moneyLessonRows().filter(row => !['academy_course', 'academy_module'].includes(row.table));
  const lesson = rows[0].values;
  lesson.module_id = mapping.moduleId;
  lesson.status = 'draft';
  lesson.sort_order = mapping.sortOrder;
  // Remap placement metadata for runtime course navigation; teaching content is unchanged.
  lesson.content = JSON.stringify({ ...MONEY_LESSON, courseId: mapping.courseId, moduleId: mapping.moduleId });
  const aliases = db.prepare('SELECT id, title, content FROM academy_lesson').all();
  for (const row of aliases) {
    if (row.id === MONEY_LESSON.id) continue;
    let payload: any = null;
    try { payload = JSON.parse(String(row.content)); } catch { /* Legacy text is valid. */ }
    if (String(row.title).trim().toLowerCase() === MONEY_LESSON.title.toLowerCase() || payload?.id === MONEY_LESSON.id || payload?.version === MONEY_LESSON.version) throw new Error('Possible duplicate Lesson 1 under another ID; reconcile manually before installation.');
  }
  const inserts = [];
  for (const row of rows) {
    if (row.table !== 'academy_lesson') {
      const aliases = db.prepare(`SELECT id FROM ${row.table} WHERE lesson_id = ? AND id <> ?`).all(MONEY_LESSON.id, row.values.id);
      if (aliases.length) throw new Error(`Possible duplicate in ${row.table}; reconcile manually.`);
    }
    const existing = db.prepare(`SELECT * FROM ${row.table} WHERE id = ?`).get(row.values.id);
    if (!existing) inserts.push(row);
    else if (Object.entries(row.values).some(([key, value]) => !['created_at', 'updated_at'].includes(key) && existing[key] !== value)) throw new Error(`Curriculum conflict in ${row.table}; nothing overwritten.`);
  }
  return { mode: 'prepare-only', contentVersion: MONEY_LESSON.version, contentSha256: createHash('sha256').update(JSON.stringify(MONEY_LESSON)).digest('hex'), mapping, courseStatus: course.status, moduleStatus: module.status, lessonStatus: 'draft', rows, inserts };
}

/** Caller must supply a checked local DB. No remote clients or provider APIs exist here. */
export async function rehearseMoneyLessonInstallation(db: DatabaseSync, mapping: Mapping) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const plan = await planMoneyLessonInstallation(db, mapping);
    for (const { table, values } of plan.inserts) {
      const keys = Object.keys(values);
      db.prepare(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`).run(...Object.values(values));
    }
    if (db.prepare('PRAGMA foreign_key_check').all().length) throw new Error('Foreign key check failed.');
    db.exec('COMMIT');
    return { ...plan, inserted: plan.inserts.length };
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}

const literal = (value: string | number | null) => value === null ? 'NULL' : typeof value === 'number' ? String(value) : "'" + value.replaceAll("'", "''") + "'";

/** Review artifact only. SQLite wrapper and D1 atomic batch consume identical statements. */
export function moneyLessonSqlArtifact(plan: Awaited<ReturnType<typeof planMoneyLessonInstallation>>) {
  const { mapping } = plan;
  const predicates = [
    `EXISTS (SELECT 1 FROM academy_course WHERE id=${literal(mapping.courseId)} AND status IS ${literal(String(plan.courseStatus))})`,
    `EXISTS (SELECT 1 FROM academy_module WHERE id=${literal(mapping.moduleId)} AND course_id=${literal(mapping.courseId)} AND status IS ${literal(String(plan.moduleStatus))})`,
    `NOT EXISTS (SELECT 1 FROM academy_lesson WHERE module_id=${literal(mapping.moduleId)} AND sort_order=${mapping.sortOrder} AND id<>${literal(MONEY_LESSON.id)})`,
    `NOT EXISTS (SELECT 1 FROM academy_lesson WHERE id<>${literal(MONEY_LESSON.id)} AND (lower(trim(title))=lower(${literal(MONEY_LESSON.title)}) OR CASE WHEN json_valid(content) THEN json_extract(content,'$.id')=${literal(MONEY_LESSON.id)} OR json_extract(content,'$.version')=${literal(MONEY_LESSON.version)} ELSE 0 END))`,
    `(SELECT count(*) FROM pragma_table_info('student_quiz_attempt') WHERE name IN ('learning_version','learning_questions_json','learning_answers_json','learning_review_json','learning_mastery_json'))=5`,
    `(SELECT count(*) FROM sqlite_master WHERE type='table' AND name='academy_learning_event')=1`,
    `(SELECT group_concat(name,',') FROM pragma_index_info('student_quiz_attempt_learning_open'))='user_id,quiz_id,learning_version'`,
  ];
  for (const row of plan.rows) {
    const same = Object.entries(row.values).filter(([key]) => !['created_at','updated_at'].includes(key)).map(([key,value]) => `${key} IS ${literal(value)}`).join(' AND ');
    predicates.push(`NOT EXISTS (SELECT 1 FROM ${row.table} WHERE id=${literal(row.values.id)} AND NOT (${same}))`);
    if (row.table !== 'academy_lesson') predicates.push(`NOT EXISTS (SELECT 1 FROM ${row.table} WHERE lesson_id=${literal(MONEY_LESSON.id)} AND id<>${literal(row.values.id)})`);
  }
  // A deliberately invalid JSON expression aborts a stale/conflicting batch before any insert.
  const guard = `SELECT CASE WHEN ${predicates.map(p => '('+p+')').join(' AND ')} THEN 1 ELSE json('Lesson 1 installation conflict; abort') END`;
  const statements = [guard, ...plan.rows.map(({table,values}) => `INSERT INTO ${table} (${Object.keys(values).join(',')}) SELECT ${Object.values(values).map(literal).join(',')} WHERE NOT EXISTS (SELECT 1 FROM ${table} WHERE id=${literal(values.id)})`)];
  return { contentSha256: plan.contentSha256, statements, sqliteSql: '-- PREPARED ONLY: never pass this BEGIN wrapper to D1. D1 requires the atomic batch adapter.\nBEGIN IMMEDIATE;\n' + statements.join(';\n') + ';\nCOMMIT;\n' };
}

/** Not wired to CLI/runtime. Later authorized D1 execution must pass the reviewed statements as ONE atomic batch. */
export async function executeReviewedMoneyLessonBatch(db: { prepare(sql: string): unknown; batch(statements: any[]): Promise<unknown> }, artifact: ReturnType<typeof moneyLessonSqlArtifact>) {
  return db.batch(artifact.statements.map(sql => db.prepare(sql)));
}
