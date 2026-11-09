import assert from "node:assert/strict";
import test from "node:test";
import { MONEY_LESSON } from "./what-is-money";

test("money curriculum preserves the ten-question mixed assessment and independent mastery", () => {
  assert.equal(MONEY_LESSON.steps.length, 10);
  assert.equal(MONEY_LESSON.questionBanks.length, 2);
  for (const bank of MONEY_LESSON.questionBanks) {
    assert.deepEqual(bank.map((q) => q.id), Array.from({ length: 10 }, (_, i) => `q${i + 1}`));
    assert.deepEqual(bank.filter((q) => q.mastery).map((q) => q.id), ["q6", "q8", "q10"]);
    assert.deepEqual(new Set(bank.map((q) => q.concept)), new Set(MONEY_LESSON.concepts.map((c) => c.id)));
    assert.deepEqual(bank.map((q) => q.kind), ["choice", "choice", "written", "choice", "matching", "written", "written", "true_false_explain", "written", "written"]);
    assert.ok(bank.filter((q) => q.kind === "written" || q.mastery).every((q) => q.rubric));
  }
  assert.ok(MONEY_LESSON.questionBanks[0].every((q, i) => q.prompt !== MONEY_LESSON.questionBanks[1][i].prompt));
});

test("approved first bank retains objective keys and all targeted remediation", () => {
  const bank = MONEY_LESSON.questionBanks[0];
  assert.deepEqual(bank.filter((q) => ["q1", "q2", "q4"].includes(q.id)).map((q) => q.correct), ["b", "b", "b"]);
  assert.deepEqual(bank[4].correct, { USD: "us", JPY: "jp", GBP: "uk", EUR: "euro" });
  assert.equal(bank[7].correct, "false");
  for (const concept of MONEY_LESSON.concepts) {
    assert.ok(MONEY_LESSON.remediation[concept.id].text.length > 100);
  }
  assert.equal(MONEY_LESSON.steps[8].video?.url, undefined);
  assert.match(MONEY_LESSON.homework.broad.instructions, /Homework remains locked/);
  assert.match(MONEY_LESSON.homework.broad.instructions, /different knowledge-check attempt/);
  const activityIds = MONEY_LESSON.steps.flatMap((step) => step.activities?.map((a) => a.id) ?? []);
  assert.equal(activityIds.length, new Set(activityIds).size);
  assert.equal(activityIds.filter((id) => id.startsWith("quick-")).length, 3);
});
