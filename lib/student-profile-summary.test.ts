import assert from "node:assert/strict";
import test from "node:test";
import {
  academyAccessStatus,
  assignmentStatusLabel,
  canonicalAssessmentStatus,
  financialPlanStatus,
  instructorPlacementStatus,
  learningPathStatus,
  legacyIntakeStatusLabel,
  legacyQuestionnaireStatusLabel,
  membershipStatus,
} from "./student-profile-summary";

test("canonical assessment prefers the active draft and labels the latest completion", () => {
  const status = canonicalAssessmentStatus(
    { status: "in_progress", updated_at: "2026-11-09T12:00:00.000Z" },
    { status: "completed", completed_at: "2026-11-01T12:00:00.000Z" },
  );
  assert.equal(status.label, "In progress");
  assert.match(status.detail, /Latest completed Nov 1, 2026/);
  assert.equal(status.tone, "pending");
  assert.deepEqual(canonicalAssessmentStatus(null, null), {
    label: "Not started",
    detail: "No canonical assessment recorded",
    tone: "neutral",
  });
});

test("legacy statuses remain explicitly historical and readable", () => {
  assert.equal(legacyIntakeStatusLabel("draft"), "Draft");
  assert.equal(legacyIntakeStatusLabel("completed"), "Completed");
  assert.equal(legacyQuestionnaireStatusLabel({ status: "submitted" }), "Completed");
  assert.equal(legacyQuestionnaireStatusLabel({ status: "draft", data: {} }), "Not Started");
  assert.equal(legacyQuestionnaireStatusLabel({ status: "draft", data: { goal: "x" } }), "In Progress");
});

test("membership and academy access stay separate", () => {
  const now = Date.parse("2026-11-09T12:00:00.000Z");
  const paid = {
    lifecycle_status: "ACTIVE",
    subscriptionStatus: "active",
    complimentaryAccessExpiresAt: null,
    complimentaryAccessRevokedAt: null,
  };
  assert.equal(membershipStatus(paid, now).label, "Paid membership");
  assert.equal(academyAccessStatus(paid, now).label, "Active");
  assert.deepEqual(membershipStatus({ ...paid, lifecycle_status: "DEACTIVATED" }, now), {
    label: "Former student",
    detail: "Lifecycle deactivated",
    tone: "blocked",
  });
  assert.equal(academyAccessStatus({ ...paid, lifecycle_status: "DEACTIVATED" }, now).label, "Blocked");
  assert.equal(academyAccessStatus({ ...paid, subscriptionStatus: "canceled" }, now).label, "Blocked");
  assert.equal(academyAccessStatus({ ...paid, banned: 1 }, now).detail, "Account unavailable");
});

test("instructor placement does not treat legacy placement as current approval", () => {
  const legacy = { instructorLevel: "Developing Trader", instructorTrack: "Stage 1" };
  assert.deepEqual(instructorPlacementStatus(null, legacy), {
    label: "Legacy placement only",
    detail: "Current instructor review is pending",
    tone: "pending",
  });
  assert.equal(instructorPlacementStatus({ status: "DRAFT", version: 2 }, legacy).label, "Pending approval");
  assert.equal(
    instructorPlacementStatus({ status: "APPROVED", version: 2, student_json: JSON.stringify({ overall: "BEGINNER" }) }, legacy).label,
    "Beginner",
  );
});

test("learning path and financial plan lifecycle labels are distinct", () => {
  assert.equal(learningPathStatus(null).label, "Not started");
  assert.equal(learningPathStatus({ status: "DRAFT", version: 1 }).label, "Draft v1");
  assert.equal(learningPathStatus({ status: "APPROVED", version: 2, student_json: JSON.stringify({ overall: "INTERMEDIATE" }) }).label, "Approved v2");
  assert.equal(financialPlanStatus(null).label, "Not started");
  assert.equal(financialPlanStatus({ status: "DRAFT", version: 2, published_version: 1 }).detail, "Draft — not published · v1 published");
  assert.equal(financialPlanStatus({ status: "PUBLISHED", version: 1, published_at: "2026-11-08T12:00:00.000Z" }).label, "Published v1");
});

test("course assignments remain assignments, never placement approval", () => {
  assert.equal(assignmentStatusLabel("assigned"), "Assigned");
  assert.equal(assignmentStatusLabel("completed"), "Completed");
  assert.equal(assignmentStatusLabel("revoked"), "Revoked");
  assert.equal(assignmentStatusLabel("in_progress"), "In progress");
});
