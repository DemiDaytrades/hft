import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { installMoneyLesson } from "./seed";
import { MONEY_LESSON } from "../curriculum/what-is-money";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { sqliteAdapter, checkedDatabase, main } = require("../../../scripts/seed-academy-local.cjs");

function fixture() {
  const sqlite = new DatabaseSync(":memory:");
  const directory = path.resolve(__dirname, "../../../migrations");
  for (const filename of readdirSync(directory).filter(name => name.endsWith(".sql")).sort()) sqlite.exec(readFileSync(path.join(directory, filename), "utf8"));
  return sqlite;
}

test("all real migrations support local Lesson 1 installation and exact reruns", async () => {
  const sqlite = fixture();
  try {
    const db = sqliteAdapter(sqlite);
    assert.equal((await installMoneyLesson(db)).inserted, 5);
    const snapshot = sqlite.prepare("SELECT * FROM academy_lesson").get()!;
    assert.deepEqual(JSON.parse(snapshot.content as string), MONEY_LESSON);
    assert.equal(snapshot.status, "published");
    assert.equal(snapshot.requires_assignment, 1);
    assert.equal(snapshot.requires_quiz, 1);
    assert.equal(sqlite.prepare("SELECT requires_approval_to_unlock AS required FROM academy_assignment").get()!.required, 1);
    // A fixture progress row models existing progress; the installer must never touch it.
    sqlite.prepare("INSERT INTO user (id, name, email, emailVerified, createdAt, updatedAt) VALUES ('fixture', 'Fixture', 'fixture@example.invalid', 1, '2026-01-01', '2026-01-01')").run();
    sqlite.prepare("INSERT INTO student_lesson_progress (id,user_id,lesson_id,status,updated_at) VALUES ('progress','fixture',?,'in_progress','original')").run(MONEY_LESSON.id);
    const before = sqlite.prepare("SELECT * FROM student_lesson_progress").get();
    assert.equal((await installMoneyLesson(db)).inserted, 0);
    assert.deepEqual(sqlite.prepare("SELECT * FROM student_lesson_progress").get(), before);
    assert.deepEqual(sqlite.prepare("SELECT * FROM academy_lesson").get(), snapshot);
    for (const table of ["academy_course", "academy_module", "academy_lesson", "academy_quiz", "academy_assignment"]) assert.equal(sqlite.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get()!.count, 1);
    for (const table of ["student_course_assignment", "academy_quiz_question", "student_quiz_attempt", "student_assignment_submission"]) assert.equal(sqlite.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get()!.count, 0);
  } finally { sqlite.close(); }
});

test("curriculum conflicts fail without overwriting any content or inserting missing rows", async () => {
  const sqlite = fixture();
  try {
    const db = sqliteAdapter(sqlite);
    await installMoneyLesson(db);
    sqlite.prepare("UPDATE academy_lesson SET content = ?").run('{"version":"conflicting"}');
    sqlite.prepare("DELETE FROM academy_assignment").run();
    await assert.rejects(installMoneyLesson(db), /Curriculum conflict/);
    assert.equal(sqlite.prepare("SELECT content FROM academy_lesson").get()!.content, '{"version":"conflicting"}');
    assert.equal(sqlite.prepare("SELECT COUNT(*) AS count FROM academy_assignment").get()!.count, 0);
  } finally { sqlite.close(); }
});

test("local seed CLI rejects remote flags and database paths outside local state", async () => {
  await assert.rejects(main(["--remote"]), /forbidden/);
  await assert.rejects(main(["--production"]), /forbidden/);
  assert.throws(() => checkedDatabase("/tmp/production.sqlite"), /Only an existing/);
  assert.throws(() => checkedDatabase(".wrangler/state/../../production.sqlite"), /Only an existing/);
});
