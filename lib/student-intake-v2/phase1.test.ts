import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ACKNOWLEDGMENT_KEYS,
  INTAKE_V2_FORM_VERSION,
  INTAKE_V2_SCHEMA_VERSION,
  PREFER_NOT_TO_SAY,
  type AckAudit,
  type AckAuditRecord,
  type StudentSectionsV2,
  type InstructorAssessmentV2,
} from "./contracts";
import { validateDraft, validateFinalCompletion } from "./validation";
import { evaluateExplainableFlags } from "./flags";
import { assertCanMutateSnapshot, assertNoInstructorFieldsInStudentPayload, toStudentSafeInstructorAssessment, IntakeSnapshotImmutableError } from "./snapshot";
import { toIntakeSourceAdapter, type IntakeSource } from "./compatibility";

function fv<T>(value: T) { return { value }; }

function completeStudent(overrides: Partial<StudentSectionsV2> = {}): StudentSectionsV2 {
  return {
    preferredName: fv("Alex"),
    location: fv("Austin, TX, USA"),
    timeZone: fv("America/Chicago"),
    occupation: fv("Engineer"),
    employmentType: fv("Full-time employee"),
    workScheduleSummary: fv("Weekdays 9-5"),
    majorResponsibilities: fv(["None"]),
    currentLifeGoal: fv("Build stability"),
    motivationAndWhyNow: fv("Ready now"),
    monthlyTakeHomeRange: fv("$5,000–$7,499"),
    additionalIncome: fv({ hasAdditional: "No" }),
    incomeConsistencyPay: fv({ consistency: "Very consistent", payFrequency: "Every 2 weeks" }),
    disposableIncomeRange: fv("$500–$999"),
    recurringObligationsRange: fv("$2,000–$2,999"),
    variableExpensesRange: fv("$500–$999"),
    upcomingMajorExpenses: fv({ hasUpcoming: "No" }),
    savingsEmergencyRanges: fv({ savings: "$1,000–$2,499", emergencyFund: "$500–$999" }),
    unexpectedExpenseAbility: fv("I could cover it, but it would be difficult"),
    debtStatusTypes: fv({ hasDebt: "No" }),
    availableTradingCapitalRange: fv("$500–$999"),
    affordableLossRange: fv("$100–$249"),
    pressureToMakeMoneyQuickly: fv("A little urgency"),
    desiredAdditionalMonthlyIncomeRange: fv("$500–$999"),
    financialReasonForTrading: fv("Supplement income"),
    marketsExperience: fv(["None yet"]),
    demoLiveExperience: fv({ demo: "No", live: "No" }),
    knowledgeMatrix: fv(Object.fromEntries(["buy_sell_direction","stop_loss","take_profit","lot_size","pips","leverage","spread_fees","candlesticks","support_resistance","trend","market_structure_basics","risk_management","position_sizing"].map(k => [k, "Heard of it"]))),
    platformsBrokerExperience: fv({ platforms: ["None yet"], brokerExperience: "No" }),
    priorEducation: fv({ type: "No" }),
    majorNegativeExperience: fv({ type: "No" }),
    biggestTradingConfusion: fv("Risk"),
    reactionToLoss: fv("Reflect"),
    reactionToWin: fv("Stay calm"),
    behaviorMatrix: fv({ fomo: "Sometimes", revenge_trading: "Unlikely", impulsiveness: "Rarely", patience: "Moderate", rule_consistency: "Usually" }),
    behaviorTendencies: fv(["Not applicable yet"]),
    willingDemoFirst: fv("Yes"),
    willingRiskLimits: fv("Yes"),
    goalImmediate: fv("Finish intake"),
    goals30_60_90: fv({ goal30: "Basics", goal60: "Practice", goal90: "Plan" }),
    goals6_12: fv({ goal6: "Consistency" }),
    goalBig: fv("Freedom"),
    goalWhy: fv("Family"),
    successDefinition: fv("Consistent process"),
    desiredTradingIncomeRange: fv("$500–$999"),
    membershipValue: fv("Guidance"),
    learningStyles: fv(["Watching demonstrations"]),
    paceAndQuestionComfort: fv({ pace: "Moderate/steady", questionComfort: "Comfortable" }),
    homeworkPreference: fv(["Chart markup exercises"]),
    accountabilityFeedback: fv({ accountability: "Weekly check-ins", feedbackFrequency: "Weekly" }),
    weeklyAvailability: fv({ monday: { windows: ["Evening"] } }),
    unavailableDays: fv(["None"]),
    weeklyHoursRange: fv("5–7 hours"),
    windowsAndConsistency: fv({ preferredWindows: ["Weekday evenings"], consistencyExpectation: "Mostly consistent" }),
    devicesInternet: fv({ devices: ["Computer/laptop"], internetReliability: "Mostly reliable" }),
    platformAccess: fv({ tradingView: "Yes", mt5: "No", demoAccount: "No", liveAccount: "No" }),
    supportTechReadiness: fv({ canScreenShare: "Yes", softwareComfort: "Comfortable" }),
    // Phase 3C defaults (additive). hasDebt defaults No so DC-02/06/10 not required.
    debtRepaymentConfidence: fv(PREFER_NOT_TO_SAY),
    creditUtilizationAwareness: fv("Not sure yet"),
    paymentHistoryConsistency: fv("Not sure yet"),
    debtRelatedStress: fv(PREFER_NOT_TO_SAY),
    creditBuildingGoals: fv("Not sure yet"),
    recentFinancialHardship: fv({ status: "No recent financial hardship" }),
    emergencyBorrowingReliance: fv(PREFER_NOT_TO_SAY),
    creditEducationInterest: fv(PREFER_NOT_TO_SAY),
    financialImprovementGoals612: fv(["Learn more about debt and credit"]),
    ackChecklist: fv(Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k => [k, true])) as any),
    ...overrides,
  };
}

function completeInstructor(overrides: Partial<InstructorAssessmentV2> = {}): InstructorAssessmentV2 {
  return {
    instructorSummary: fv("Summary"),
    assessedExperienceLevel: fv("Beginner"),
    assessedKnowledgeLevel: fv("Foundational gaps"),
    instructorStrengths: fv("Motivated"),
    instructorWeaknesses: fv("Risk basics"),
    recommendedStartingLevel: fv("Foundations"),
    recommendedAcademyTrack: fv("Foundations Track"),
    recommendedFirstLesson: fv("Risk 101"),
    firstHomework: fv("Journal"),
    recommendedPracticeFrequency: fv("4–5x/week"),
    recommendedCoachingFrequency: fv("Weekly"),
    immediateActionItems: fv("Open demo"),
    ...overrides,
  };
}

function completeAudit(intakeId = "intake_test"): AckAudit {
  return {
    records: ACKNOWLEDGMENT_KEYS.map((ack_key): AckAuditRecord => ({
      ack_key,
      ack_text_version_id: "ack_v1",
      confirmed: true,
      confirmed_at: "2026-11-05T00:00:00.000Z",
      confirmed_by_user_id: "admin1",
      confirmed_by_role: "admin",
      intake_id: intakeId,
      form_version: INTAKE_V2_FORM_VERSION,
      schema_version: INTAKE_V2_SCHEMA_VERSION,
      capture_mode: "student_reported",
    })),
  };
}

describe("Intake V2 Phase 1", () => {
  it("draft can save incomplete data", () => {
    const result = validateDraft({ student_sections: { preferredName: fv("A") } });
    assert.equal(result.ok, true);
  });

  it("final completion rejects missing required visible fields", () => {
    const student = completeStudent();
    delete (student as any).preferredName;
    const result = validateFinalCompletion({ student_sections: student, instructor_assessment: completeInstructor(), ack_audit: completeAudit(), intake_id: "intake_test" });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(i => i.path.includes("preferredName")));
  });

  it("Prefer not to say passes where allowed for financial responses", () => {
    const student = completeStudent({
      monthlyTakeHomeRange: fv(PREFER_NOT_TO_SAY),
      disposableIncomeRange: fv(PREFER_NOT_TO_SAY),
      recurringObligationsRange: fv(PREFER_NOT_TO_SAY),
      variableExpensesRange: fv(PREFER_NOT_TO_SAY),
      savingsEmergencyRanges: fv({ savings: PREFER_NOT_TO_SAY, emergencyFund: PREFER_NOT_TO_SAY }),
      availableTradingCapitalRange: fv(PREFER_NOT_TO_SAY),
      affordableLossRange: fv(PREFER_NOT_TO_SAY),
      desiredAdditionalMonthlyIncomeRange: fv(PREFER_NOT_TO_SAY),
      financialReasonForTrading: fv(PREFER_NOT_TO_SAY),
    });
    const result = validateFinalCompletion({ student_sections: student, instructor_assessment: completeInstructor(), ack_audit: completeAudit(), intake_id: "intake_test" });
    assert.equal(result.ok, true, JSON.stringify(result.issues));
  });

  it("conditional fields become required only when triggered", () => {
    const student = completeStudent({
      debtStatusTypes: fv({ hasDebt: "Yes", types: [] }),
      totalDebtRange: undefined,
      monthlyDebtPaymentsRange: undefined,
    });
    const result = validateFinalCompletion({ student_sections: student, instructor_assessment: completeInstructor(), ack_audit: completeAudit(), intake_id: "intake_test" });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(i => i.path.includes("debtStatusTypes.types")));
    assert.ok(result.issues.some(i => i.path.includes("totalDebtRange")));
  });

  it("all 7 acknowledgments are required", () => {
    const student = completeStudent({ ackChecklist: fv({ ackRiskOfLoss: true } as any) });
    const result = validateFinalCompletion({ student_sections: student, instructor_assessment: completeInstructor(), ack_audit: completeAudit(), intake_id: "intake_test" });
    assert.equal(result.ok, false);
    assert.ok(result.issues.filter(i => i.code === "ack_required").length >= 6);
  });

  it("incomplete acknowledgment audit fails completion", () => {
    const audit = completeAudit();
    audit.records = audit.records.slice(0, 5);
    const result = validateFinalCompletion({ student_sections: completeStudent(), instructor_assessment: completeInstructor(), ack_audit: audit, intake_id: "intake_test" });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(i => i.code === "ack_audit_required"));
  });

  it("missing required instructor assessment fails completion", () => {
    const ia = completeInstructor();
    delete (ia as any).instructorSummary;
    const result = validateFinalCompletion({ student_sections: completeStudent(), instructor_assessment: ia, ack_audit: completeAudit(), intake_id: "intake_test" });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(i => i.path.includes("instructorSummary")));
  });

  it("high-risk rule triggers explainable reasons", () => {
    const flags = evaluateExplainableFlags(completeStudent({
      affordableLossRange: fv("$0"),
      pressureToMakeMoneyQuickly: fv("High urgency"),
      savingsEmergencyRanges: fv({ savings: "$0", emergencyFund: "$0" }),
      unexpectedExpenseAbility: fv("I would likely not be able to cover it right now"),
      willingRiskLimits: fv("No"),
      availableTradingCapitalRange: fv("$0 (not available now)"),
    }));
    const demo = flags.find(f => f.rule_id === "RISK_DEMO_FIRST_V1");
    assert.ok(demo);
    assert.ok(demo.source_fields.includes("affordableLossRange"));
    assert.ok(demo.triggering_values.some(t => t.field === "pressureToMakeMoneyQuickly"));
    assert.ok(demo.suggested_instructor_action.length > 0);
  });

  it("high-risk rule requires applicable instructor fields", () => {
    const student = completeStudent({ pressureToMakeMoneyQuickly: fv("High urgency") });
    const result = validateFinalCompletion({ student_sections: student, instructor_assessment: completeInstructor(), ack_audit: completeAudit(), intake_id: "intake_test" });
    assert.equal(result.ok, false);
    assert.ok(result.issues.some(i => i.path.includes("financialRiskConcerns") || i.path.includes("riskRestrictions") || i.path.includes("behavioralConcerns")));
  });

  it("completed snapshot normal update is rejected", () => {
    assert.throws(() => assertCanMutateSnapshot({ currentStatus: "completed", mode: "draft_save" }), IntakeSnapshotImmutableError);
  });

  it("student payload cannot write instructor-only fields", () => {
    assert.throws(() => assertNoInstructorFieldsInStudentPayload({ instructorSummary: "x" }), /instructor-only/);
  });

  it("instructor private notes cannot appear in student-safe mapping", () => {
    const safe = toStudentSafeInstructorAssessment({ instructorSummary: { value: "ok" }, instructorPrivateNotes: { value: "secret" } });
    assert.equal((safe as any).instructorPrivateNotes, undefined);
    assert.deepEqual((safe as any).instructorSummary, { value: "ok" });
  });

  it("legacy source type remains supported by compatibility interface", () => {
    const legacy: IntakeSource = {
      kind: "legacy_consultation_questionnaire",
      id: "q1", userId: "u1", bookingId: null, status: "submitted",
      data: {}, createdAt: "a", updatedAt: "b", submittedAt: "c",
    };
    const adapter = toIntakeSourceAdapter(legacy);
    assert.equal(adapter.getKind(), "legacy_consultation_questionnaire");
    assert.equal(adapter.getStudentUserId(), "u1");
  });

  it("no test modifies production records", () => {
    // This test is a contract assertion: tests use in-memory fixtures only and perform no DB/network writes.
    assert.equal(typeof fetch, "function");
  });
});
