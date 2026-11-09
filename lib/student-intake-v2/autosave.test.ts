import { describe, it } from "node:test";
import assert from "node:assert";
import {
  isConflictStatus,
  mergeReconciledValues,
  saveStatusLabel,
  shouldApplyServerValues,
} from "./autosave";
import { fieldKeyForIssuePath, screenForIssuePath } from "@/app/(app)/admin/student-intake-v2/guided-config";

describe("intake autosave helpers", () => {
  it("detects conflict responses", () => {
    assert.equal(isConflictStatus(409), true);
    assert.equal(isConflictStatus(400), false);
  });

  it("keeps latest server values for untouched fields and local edits for edited fields", () => {
    const latest = { a: "server-a", b: "server-b", c: "server-c" };
    const local = { a: "local-a", b: "local-b", c: "local-c" };
    assert.deepEqual(mergeReconciledValues(latest, local, ["a", "c"]), {
      a: "local-a",
      b: "server-b",
      c: "local-c",
    });
  });

  it("ignores edited keys that are not present locally", () => {
    const latest = { a: "server-a", b: "server-b" };
    const local = { a: "local-a" };
    assert.deepEqual(mergeReconciledValues(latest, local, ["a", "missing"]), {
      a: "local-a",
      b: "server-b",
    });
  });

  it("applies server values only when no newer edit occurred during save", () => {
    assert.equal(shouldApplyServerValues(3, 3), true);
    assert.equal(shouldApplyServerValues(3, 4), false);
  });

  it("labels save states without hiding unsaved changes", () => {
    assert.equal(saveStatusLabel("saved", false), "Saved");
    assert.equal(saveStatusLabel("saved", true), "Unsaved changes");
    assert.equal(saveStatusLabel("saving", true), "Saving…");
    assert.equal(saveStatusLabel("conflict", true), "Draft changed elsewhere");
    assert.equal(saveStatusLabel("error", true, "network"), "Save failed: network");
  });
});

describe("guided issue navigation", () => {
  it("maps nested schedule issues to the schedule screen and day field", () => {
    const path = "student_sections.weeklyAvailability.monday.windows";
    assert.equal(screenForIssuePath(path), "schedule-availability");
    assert.equal(fieldKeyForIssuePath(path), "weeklyAvailability.monday");
  });

  it("maps knowledge-matrix parts to their specific screen and part field", () => {
    const path = "student_sections.knowledgeMatrix.market_structure_basics";
    assert.equal(screenForIssuePath(path), "experience-knowledge-3");
    assert.equal(fieldKeyForIssuePath(path), "knowledgeMatrix.market_structure_basics");
  });

  it("maps acknowledgment issues to acknowledgment fields", () => {
    const path = "acknowledgments.ackRiskOfLoss";
    assert.equal(screenForIssuePath(path), "acknowledgments-1");
    assert.equal(fieldKeyForIssuePath(path), "ack:ackRiskOfLoss");
  });

  it("does not map instructor-only issues to student fields", () => {
    assert.equal(fieldKeyForIssuePath("instructor_review.conflicts"), undefined);
  });
});
