import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ACKNOWLEDGMENT_KEYS,
  INTAKE_V2_FORM_VERSION,
  INTAKE_V2_SCHEMA_VERSION,
  type AckAudit,
  type InstructorAssessmentV2,
  type StudentSectionsV2,
} from "./contracts";
import {
  evaluateExplainableFlags,
  hasBlockingHighRiskFlags,
  hasHighRiskFlags,
} from "./flags";
import { validateFinalCompletion } from "./validation";
import { REVIEW_VERSION, type SmartReview } from "../consultation-review/model";
import { baseStudent, instructor, pfAnswers } from "../financial-plan/testing/fixture";

const LEGACY_PRE3D_FORM = "hft_intake_v2_form.2026-11-05";
const CONDITIONAL_FIELDS = [
  "behavioralConcerns",
  "financialRiskConcerns",
  "riskRestrictions",
] as const;

function fv<T>(value: T) {
  return { value };
}

function audit(intakeId = "intake_test"): AckAudit {
  return {
    records: ACKNOWLEDGMENT_KEYS.map((key) => ({
      ack_key: key,
      ack_text_version_id: "ack_v1",
      confirmed: true as const,
      confirmed_at: "2026-01-01T00:00:00.000Z",
      confirmed_by_user_id: "user_test",
      confirmed_by_role: "student",
      intake_id: intakeId,
      form_version: LEGACY_PRE3D_FORM,
      schema_version: INTAKE_V2_SCHEMA_VERSION,
      capture_mode: "student_reported" as const,
    })),
  };
}

function currentReview(sourceRevision: number): SmartReview {
  return {
    version: REVIEW_VERSION,
    status: "reviewed",
    sourceRevision,
    reviewedBy: "instructor_test",
    reviewedAt: "2026-01-01T00:00:00.000Z",
    matchesSelfReport: "MATCHES",
    contradictions: "",
    requireAssessment: false,
    requirePractical: false,
    requireChartDemonstration: false,
    reason: "",
  };
}

function assertConditionalFieldsRequired(result: ReturnType<typeof validateFinalCompletion>) {
  assert.equal(result.ok, false);
  for (const field of CONDITIONAL_FIELDS) {
    assert.ok(
      result.issues.some((issue) => issue.path === `instructor_assessment.${field}`),
      `expected instructor_assessment.${field} to be required: ${JSON.stringify(result.issues)}`,
    );
  }
}

describe("beginner completion blocker", () => {
  it("A. demo-first beginner completes without I6/I7/I17", () => {
    const student = baseStudent({
      ...pfAnswers(),
      availableTradingCapitalRange: fv("$0 (not available now)"),
      affordableLossRange: fv("$0"),
    });
    const flags = evaluateExplainableFlags(student);

    assert.ok(flags.some((flag) => flag.rule_id === "RISK_DEMO_FIRST_V1"));
    assert.equal(hasHighRiskFlags(flags), true);
    assert.equal(hasBlockingHighRiskFlags(flags), false);

    const legacy = validateFinalCompletion({
      student_sections: student,
      instructor_assessment: instructor(),
      ack_audit: audit(),
      intake_id: "intake_test",
      form_version: INTAKE_V2_FORM_VERSION,
    });
    assert.equal(legacy.ok, true, JSON.stringify(legacy.issues));

    const reviewed = validateFinalCompletion({
      student_sections: student,
      instructor_assessment: {} as InstructorAssessmentV2,
      ack_audit: audit(),
      intake_id: "intake_test",
      form_version: INTAKE_V2_FORM_VERSION,
      snapshot_version: 1,
      instructor_review: currentReview(1),
    });
    assert.equal(reviewed.ok, true, JSON.stringify(reviewed.issues));
  });

  it("B. genuine high financial pressure still requires I6/I7/I17", () => {
    const student = baseStudent({ pressureToMakeMoneyQuickly: fv("High urgency") });
    const flags = evaluateExplainableFlags(student);

    assert.ok(flags.some((flag) => flag.rule_id === "RISK_HIGH_FINANCIAL_PRESSURE_V1"));
    assert.equal(hasHighRiskFlags(flags), true);
    assert.equal(hasBlockingHighRiskFlags(flags), true);

    const result = validateFinalCompletion({
      student_sections: student,
      instructor_assessment: instructor(),
      ack_audit: audit(),
      intake_id: "intake_test",
      form_version: LEGACY_PRE3D_FORM,
    });
    assertConditionalFieldsRequired(result);
  });

  it("C. mixed demo-first and genuine high risk requires I6/I7/I17", () => {
    const student = baseStudent({
      availableTradingCapitalRange: fv("$0 (not available now)"),
      affordableLossRange: fv("$0"),
      pressureToMakeMoneyQuickly: fv("High urgency"),
    });
    const flags = evaluateExplainableFlags(student);

    assert.ok(flags.some((flag) => flag.rule_id === "RISK_DEMO_FIRST_V1"));
    assert.ok(flags.some((flag) => flag.rule_id === "RISK_HIGH_FINANCIAL_PRESSURE_V1"));
    assert.equal(hasBlockingHighRiskFlags(flags), true);

    const result = validateFinalCompletion({
      student_sections: student,
      instructor_assessment: instructor(),
      ack_audit: audit(),
      intake_id: "intake_test",
      form_version: LEGACY_PRE3D_FORM,
    });
    assertConditionalFieldsRequired(result);
  });

  it("D. current concise review does not bypass genuine high-risk conditionals", () => {
    const student = baseStudent({ pressureToMakeMoneyQuickly: fv("High urgency") });

    const current = validateFinalCompletion({
      student_sections: student,
      instructor_assessment: {} as InstructorAssessmentV2,
      ack_audit: audit(),
      intake_id: "intake_test",
      form_version: LEGACY_PRE3D_FORM,
      snapshot_version: 1,
      instructor_review: currentReview(1),
    });
    assertConditionalFieldsRequired(current);

    const stale = validateFinalCompletion({
      student_sections: student,
      instructor_assessment: {} as InstructorAssessmentV2,
      ack_audit: audit(),
      intake_id: "intake_test",
      form_version: LEGACY_PRE3D_FORM,
      snapshot_version: 1,
      instructor_review: currentReview(0),
    });
    assert.equal(stale.ok, false);
    assert.ok(stale.issues.some((issue) => issue.path === "instructor_review" && issue.code === "review_required"));
  });
});
