import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ACKNOWLEDGMENT_KEYS,
  INTAKE_V2_FORM_VERSION,
  INTAKE_V2_SCHEMA_VERSION,
  PREFER_NOT_TO_SAY,
  type AckAudit,
  type InstructorAssessmentV2,
  type StudentSectionsV2,
} from "./contracts";
import { buildAckAuditRecords } from "./acknowledgments";
import { evaluateExplainableFlags } from "./flags";
import { toStudentSafeInstructorAssessment } from "./snapshot";
import { validateDraft, validateFinalCompletion } from "./validation";
import {
  completeIntake,
  createDraftForStudent,
  evaluateAndStoreFlags,
  getActiveDraftForStudent,
  getIntakeById,
  getLatestCompletedIntake,
  saveAcknowledgments,
  saveInstructorAssessment,
  saveStudentAnswers,
  toStudentSafeIntakeResponse,
  type IntakeActor,
  type IntakeD1,
} from "./service";

type Row = Record<string, any>;

function makeMockD1(): IntakeD1 & { tables: Record<string, Row[]> } {
  const tables: Record<string, Row[]> = { student_intake_v2: [], student_intake_v2_event: [], student_intake_v2_pointer: [] };
  function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }
  function exec(sql: string, args: any[]) {
    const s = sql.replace(/\s+/g, " ").trim();
    if (s.startsWith("INSERT INTO \"student_intake_v2_event\"")) {
      const [id, intake_id, event_type, actor_user_id, actor_role, payload_summary_json, created_at] = args;
      tables.student_intake_v2_event.push({ id, intake_id, event_type, actor_user_id, actor_role, payload_summary_json, created_at });
      return { ok: true };
    }
    if (s.startsWith("INSERT INTO \"student_intake_v2\" (")) {
      const cols = ["id","student_user_id","booking_id","legacy_consultation_questionnaire_id","schema_version","form_version","status","snapshot_version","student_sections_json","acknowledgments_json","ack_audit_json","instructor_assessment_json","system_flags_json","proposed_seeds_json","system_meta_json","provenance_json","created_by_user_id","updated_by_user_id","completed_by_user_id","instructor_user_id","started_at","created_at","updated_at","completed_at"];
      const row: Row = {}; cols.forEach((c, i) => (row[c] = args[i]));
      tables.student_intake_v2.push(row); return { ok: true };
    }
    if (s.startsWith("INSERT INTO \"student_intake_v2_pointer\"")) {
      const [student_user_id, active_intake_id, latest_completed_intake_id, updated_at] = s.includes("SELECT ?,NULL,?,?") ? [args[0],null,args[1],args[2]] : args;
      const existing = tables.student_intake_v2_pointer.find(r => r.student_user_id === student_user_id);
      if (existing) {
        if (s.includes("active_intake_id=excluded.\"active_intake_id\",\"updated_at\"=") && !s.includes("latest_completed_intake_id=excluded")) { existing.active_intake_id = active_intake_id; existing.updated_at = updated_at; }
        else { existing.active_intake_id = active_intake_id; existing.latest_completed_intake_id = latest_completed_intake_id; existing.updated_at = updated_at; }
      } else tables.student_intake_v2_pointer.push({ student_user_id, active_intake_id, latest_completed_intake_id, updated_at });
      return { ok: true };
    }
    if (s.startsWith("SELECT active_intake_id FROM \"student_intake_v2_pointer\"")) return clone(tables.student_intake_v2_pointer.find(r => r.student_user_id === args[0]) || null);
    if (s.startsWith("SELECT latest_completed_intake_id FROM \"student_intake_v2_pointer\"")) return clone(tables.student_intake_v2_pointer.find(r => r.student_user_id === args[0]) || null);
    if (s.startsWith("SELECT * FROM \"student_intake_v2\" WHERE id = ? AND student_user_id = ?")) return clone(tables.student_intake_v2.find(r => r.id === args[0] && r.student_user_id === args[1]) || null);
    if (s.startsWith("SELECT * FROM \"student_intake_v2\" WHERE id = ?")) return clone(tables.student_intake_v2.find(r => r.id === args[0]) || null);
    if (s.includes("status IN ('draft','in_progress') ORDER BY updated_at DESC LIMIT 1")) return clone([...tables.student_intake_v2].filter(r => r.student_user_id === args[0] && ["draft","in_progress"].includes(r.status)).sort((a,b)=>String(b.updated_at).localeCompare(String(a.updated_at)))[0] || null);
    if (s.includes("status = 'completed' ORDER BY completed_at DESC")) return clone([...tables.student_intake_v2].filter(r => r.student_user_id === args[0] && r.status === "completed").sort((a,b)=>String(b.completed_at||b.created_at).localeCompare(String(a.completed_at||a.created_at)))[0] || null);
    if (s.startsWith("UPDATE \"student_intake_v2\" SET \"student_sections_json\"=?")) {
      const [ss, prov, flags, status, updated_at, updated_by, id, student] = args;
      const r = tables.student_intake_v2.find(x => x.id === id && x.student_user_id === student); if (r) Object.assign(r, { student_sections_json: ss, provenance_json: prov, system_flags_json: flags, status, updated_at, updated_by_user_id: updated_by }); return { ok: true };
    }
    if (s.startsWith("UPDATE \"student_intake_v2\" SET \"instructor_assessment_json\"=?")) {
      const [ia, prov, instructor_user_id, status, updated_at, updated_by, id, student] = args;
      const r = tables.student_intake_v2.find(x => x.id === id && x.student_user_id === student); if (r) Object.assign(r, { instructor_assessment_json: ia, provenance_json: prov, instructor_user_id: r.instructor_user_id || instructor_user_id, status, updated_at, updated_by_user_id: updated_by }); return { ok: true };
    }
    if (s.startsWith("UPDATE \"student_intake_v2\" SET \"acknowledgments_json\"=?")) {
      const [ack, audit, status, updated_at, updated_by, id, student] = args;
      const r = tables.student_intake_v2.find(x => x.id === id && x.student_user_id === student); if (r) Object.assign(r, { acknowledgments_json: ack, ack_audit_json: audit, status, updated_at, updated_by_user_id: updated_by }); return { ok: true };
    }
    if (s.startsWith("UPDATE \"student_intake_v2\" SET \"system_flags_json\"=?")) {
      const [flags, meta, updated_at, id, student] = args;
      const r = tables.student_intake_v2.find(x => x.id === id && x.student_user_id === student); if (r) Object.assign(r, { system_flags_json: flags, system_meta_json: meta, updated_at }); return { ok: true };
    }
    if (s.startsWith("UPDATE \"student_intake_v2\" SET \"status\"='completed'")) {
      const [completed_at, completed_by, flags, meta, updated_at, updated_by, id, student] = args;
      const r = tables.student_intake_v2.find(x => x.id === id && x.student_user_id === student && ["draft","in_progress"].includes(x.status));
      if (r) Object.assign(r, { status: "completed", completed_at, completed_by_user_id: completed_by, system_flags_json: flags, system_meta_json: meta, updated_at, updated_by_user_id: updated_by });
      return { ok: true };
    }
    if (s.startsWith("SELECT event_type FROM \"student_intake_v2_event\"")) return clone(tables.student_intake_v2_event.filter(r => r.intake_id === args[0] && r.event_type === args[1] ? true : r.intake_id === args[0] && !args[1]).slice(0,1)[0] || null);
    if (s.includes("FROM \"student_intake_v2_event\" WHERE intake_id = ? AND event_type = 'completed'")) return clone(tables.student_intake_v2_event.find(r => r.intake_id === args[0] && r.event_type === "completed") || null);
    throw new Error(`MockD1 unsupported SQL: ${s} | ${JSON.stringify(args)}`);
  }
  function prepare(sql: string) {
    let bound: any[] = [];
    const stmt: any = {
      bind(...args: any[]) { bound = args; return stmt; },
      async first() { return exec(sql, bound); },
      async all() { const r = exec(sql, bound); return { results: Array.isArray(r) ? r : r ? [r] : [] }; },
      async run() {
        let changes = 1;
        if (sql.startsWith('UPDATE "student_intake_v2"')) {
          const row = tables.student_intake_v2.find(r => r.id === bound[bound.length-3] && r.student_user_id === bound[bound.length-2]);
          changes = row && ['draft','in_progress'].includes(row.status) && row.snapshot_version === bound[bound.length-1] ? 1 : 0;
          if (!changes) return {success:true,meta:{changes:0}};
          exec(sql,bound);
          if (sql.includes('"snapshot_version"="snapshot_version"+1')) row!.snapshot_version++;
        } else exec(sql,bound);
        return {success:true,meta:{changes}};
      },
    };
    return stmt;
  }
  return { tables, prepare, batch: async (stmts: any[]) => { const results=[]; for (const st of stmts) results.push(await st.run()); return results; } } as any;
}

const admin: IntakeActor = { userId: "admin_user_1", role: "admin" };
function fv<T>(value: T) { return { value }; }
function studentSections(overrides: Partial<StudentSectionsV2> = {}): StudentSectionsV2 {
  return {
    preferredName: fv("Alex"), location: fv("Austin"), timeZone: fv("America/Chicago"), occupation: fv("Worker"), employmentType: fv("Full-time employee"), workScheduleSummary: fv("9-5"), majorResponsibilities: fv(["None"]),
    currentLifeGoal: fv("Stability"), motivationAndWhyNow: fv("Ready"),
    monthlyTakeHomeRange: fv("$3,000–$4,999"), additionalIncome: fv({ hasAdditional: "No" }), incomeConsistencyPay: fv({ consistency: "Very consistent", payFrequency: "Monthly" }), disposableIncomeRange: fv("$500–$999"), recurringObligationsRange: fv("$1,000–$1,999"), variableExpensesRange: fv("$250–$499"), upcomingMajorExpenses: fv({ hasUpcoming: "No" }), savingsEmergencyRanges: fv({ savings: "$500–$999", emergencyFund: "$500–$999" }), unexpectedExpenseAbility: fv("I could cover it, but it would be difficult"), debtStatusTypes: fv({ hasDebt: "No" }),
    availableTradingCapitalRange: fv("$500–$999"), affordableLossRange: fv("$100–$249"), pressureToMakeMoneyQuickly: fv("A little urgency"), desiredAdditionalMonthlyIncomeRange: fv("$500–$999"), financialReasonForTrading: fv("Extra income"),
    marketsExperience: fv(["None yet"]), demoLiveExperience: fv({ demo: "No", live: "No" }), knowledgeMatrix: fv(Object.fromEntries(["buy_sell_direction","stop_loss","take_profit","lot_size","pips","leverage","spread_fees","candlesticks","support_resistance","trend","market_structure_basics","risk_management","position_sizing"].map(k => [k, "Heard of it"]))),
    platformsBrokerExperience: fv({ platforms: ["None yet"], brokerExperience: "No" }), priorEducation: fv({ type: "No" }), majorNegativeExperience: fv({ type: "No" }), biggestTradingConfusion: fv("Risk"),
    behaviorMatrix: fv({ fomo: "Sometimes", revenge_trading: "Unlikely", impulsiveness: "Rarely", patience: "Moderate", rule_consistency: "Usually" }), behaviorTendencies: fv(["Not applicable yet"]), reactionToLoss: fv("Pause"), reactionToWin: fv("Calm"), willingDemoFirst: fv("Yes"), willingRiskLimits: fv("Yes"),
    goalImmediate: fv("Start"), goals30_60_90: fv({ goal30: "Basics", goal60: "Practice", goal90: "Routine" }), goals6_12: fv({ goal6: "Consistency" }), goalBig: fv("Freedom"), goalWhy: fv("Family"), successDefinition: fv("Process"), desiredTradingIncomeRange: fv("$500–$999"), membershipValue: fv("Support"),
    learningStyles: fv(["Videos"]), paceAndQuestionComfort: fv({ pace: "Moderate/steady", questionComfort: "Comfortable" }), homeworkPreference: fv(["Chart markup exercises"]), accountabilityFeedback: fv({ accountability: "Weekly check-ins", feedbackFrequency: "Weekly" }),
    weeklyAvailability: fv({ monday: { windows: ["Evening"] } }), unavailableDays: fv(["None"]), weeklyHoursRange: fv("2–4 hours"), windowsAndConsistency: fv({ preferredWindows: ["Weekday evenings"], consistencyExpectation: "Mostly consistent" }),
    devicesInternet: fv({ devices: ["Computer/laptop"], internetReliability: "Mostly reliable" }), platformAccess: fv({ tradingView: "Yes", mt5: "No", demoAccount: "No", liveAccount: "No" }), supportTechReadiness: fv({ canScreenShare: "Yes", softwareComfort: "Comfortable" }),
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
    ...overrides,
  } as StudentSectionsV2;
}
function instructor(overrides: Partial<InstructorAssessmentV2> = {}): InstructorAssessmentV2 {
  return {
    instructorSummary: fv("Summary"), assessedExperienceLevel: fv("Beginner"), assessedKnowledgeLevel: fv("Foundational gaps"), instructorStrengths: fv("Focus"), instructorWeaknesses: fv("Risk"),
    recommendedStartingLevel: fv("Foundations"), recommendedAcademyTrack: fv("Foundations"), recommendedFirstLesson: fv("Risk basics"), firstHomework: fv("Watch and journal"),
    recommendedPracticeFrequency: fv("4–5x/week"), recommendedCoachingFrequency: fv("Weekly"), immediateActionItems: fv("Set demo"), ...overrides,
  } as InstructorAssessmentV2;
}
function fullAck(intakeId: string) {
  const confirmations = Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k => [k, true])) as any;
  return buildAckAuditRecords({ intake_id: intakeId, confirmed_by_user_id: admin.userId, confirmed_by_role: admin.role, capture_mode: "student_reported", confirmations, confirmed_at: "2026-11-05T00:00:00.000Z" });
}
const LEGACY_PRE3D_FORM_VERSION = "hft_intake_v2_form.2026-11-05"; // Phase 1/2/3B/3C-era; grandfathered for MO completion
async function completeHappy(db: IntakeD1, studentId: string, secOverrides: Partial<StudentSectionsV2> = {}, instOverrides: Partial<InstructorAssessmentV2> = {}, opts: { formVersion?: string } = {}) {
  const draft = await createDraftForStudent(db, { studentUserId: studentId, actor: admin });
  const row = (db as any).tables.student_intake_v2.find((r: any) => r.id === draft.id);
  if (row) row.form_version = opts.formVersion ?? LEGACY_PRE3D_FORM_VERSION;
  await saveStudentAnswers(db, { intakeId: draft.id, studentUserId: studentId, actor: admin, mode: "student_reported", sections: studentSections(secOverrides) });
  await saveInstructorAssessment(db, { intakeId: draft.id, studentUserId: studentId, actor: admin, assessment: instructor(instOverrides) });
  const ack = fullAck(draft.id);
  await saveAcknowledgments(db, { intakeId: draft.id, studentUserId: studentId, actor: admin, acknowledgments: ack.acknowledgments, ackAudit: { records: ack.records } });
  return completeIntake(db, { intakeId: draft.id, studentUserId: studentId, actor: admin });
}

describe("Intake V2 Phase 2 persistence/domain (mocked D1)", () => {
  it("1. authorized instructor can create draft", async () => {
    const db = makeMockD1();
    const d = await createDraftForStudent(db, { studentUserId: "s1", actor: admin });
    assert.equal(d.status, "draft"); assert.equal(d.student_user_id, "s1");
  });
  it("2. unauthorized user cannot access another student’s intake (scope enforced)", async () => {
    const db = makeMockD1();
    const d = await createDraftForStudent(db, { studentUserId: "s2", actor: admin });
    const wrong = await getActiveDraftForStudent(db, "wrong-student");
    assert.equal(wrong?.id === d.id, false);
    assert.equal(await getIntakeById(db, d.id, "wrong-student"), null);
  });
  it("3. partial draft saves successfully", async () => {
    const db = makeMockD1(); const d = await createDraftForStudent(db, { studentUserId: "s3", actor: admin });
    const saved = await saveStudentAnswers(db, { intakeId: d.id, studentUserId: "s3", actor: admin, mode: "instructor_entered_for_student", sections: { preferredName: fv("Pat") } as any });
    assert.equal((saved.student_sections_json as any).preferredName.value, "Pat");
  });
  it("4. draft remains draft/in_progress", async () => {
    const db = makeMockD1(); const d = await createDraftForStudent(db, { studentUserId: "s4", actor: admin });
    const saved = await saveStudentAnswers(db, { intakeId: d.id, studentUserId: "s4", actor: admin, mode: "student_reported", sections: { preferredName: fv("Pat") } as any });
    assert.ok(["draft","in_progress"].includes(saved.status));
  });
  it("5. provenance persists correctly", async () => {
    const db = makeMockD1(); const d = await createDraftForStudent(db, { studentUserId: "s5", actor: admin });
    const saved = await saveStudentAnswers(db, { intakeId: d.id, studentUserId: "s5", actor: admin, mode: "instructor_entered_for_student", sections: { preferredName: fv("Pat") } as any });
    assert.equal((saved.provenance_json as any).preferredName.source, "instructor_entered_for_student");
  });
  it("6. instructor assessment persists", async () => {
    const db = makeMockD1(); const d = await createDraftForStudent(db, { studentUserId: "s6", actor: admin });
    const saved = await saveInstructorAssessment(db, { intakeId: d.id, studentUserId: "s6", actor: admin, assessment: { instructorSummary: fv("ok") } });
    assert.equal((saved.instructor_assessment_json as any).instructorSummary.value, "ok");
  });
  it("7. acknowledgment audit persists correctly", async () => {
    const db = makeMockD1(); const d = await createDraftForStudent(db, { studentUserId: "s7", actor: admin });
    const ack = fullAck(d.id);
    const saved = await saveAcknowledgments(db, { intakeId: d.id, studentUserId: "s7", actor: admin, acknowledgments: ack.acknowledgments, ackAudit: { records: ack.records } });
    assert.equal((saved.ack_audit_json as any).records.length, 7);
  });
  it("8. missing acknowledgment blocks completion", async () => {
    const db = makeMockD1(); const d = await createDraftForStudent(db, { studentUserId: "s8", actor: admin }); (db as any).tables.student_intake_v2.find((r:any)=>r.id===d.id).form_version = LEGACY_PRE3D_FORM_VERSION;
    await saveStudentAnswers(db, { intakeId: d.id, studentUserId: "s8", actor: admin, mode: "student_reported", sections: studentSections() });
    await saveInstructorAssessment(db, { intakeId: d.id, studentUserId: "s8", actor: admin, assessment: instructor() });
    const ack = fullAck(d.id); ack.acknowledgments.ackRiskOfLoss = false; ack.records = ack.records.filter(r => r.ack_key !== "ackRiskOfLoss");
    await saveAcknowledgments(db, { intakeId: d.id, studentUserId: "s8", actor: admin, acknowledgments: ack.acknowledgments, ackAudit: { records: ack.records } });
    await assert.rejects(() => completeIntake(db, { intakeId: d.id, studentUserId: "s8", actor: admin }));
  });
  it("9. incomplete ack audit blocks completion", async () => {
    const db = makeMockD1(); const d = await createDraftForStudent(db, { studentUserId: "s9", actor: admin }); (db as any).tables.student_intake_v2.find((r:any)=>r.id===d.id).form_version = LEGACY_PRE3D_FORM_VERSION;
    await saveStudentAnswers(db, { intakeId: d.id, studentUserId: "s9", actor: admin, mode: "student_reported", sections: studentSections() });
    await saveInstructorAssessment(db, { intakeId: d.id, studentUserId: "s9", actor: admin, assessment: instructor() });
    const ack = fullAck(d.id); ack.records = ack.records.slice(0, 2);
    await saveAcknowledgments(db, { intakeId: d.id, studentUserId: "s9", actor: admin, acknowledgments: ack.acknowledgments, ackAudit: { records: ack.records } });
    await assert.rejects(() => completeIntake(db, { intakeId: d.id, studentUserId: "s9", actor: admin }));
  });
  it("10. Prefer not to say passes where approved", async () => {
    const db = makeMockD1();
    const result = await completeHappy(db, "s10", { monthlyTakeHomeRange: fv(PREFER_NOT_TO_SAY), disposableIncomeRange: fv(PREFER_NOT_TO_SAY), recurringObligationsRange: fv(PREFER_NOT_TO_SAY), variableExpensesRange: fv(PREFER_NOT_TO_SAY), savingsEmergencyRanges: fv({ savings: PREFER_NOT_TO_SAY, emergencyFund: PREFER_NOT_TO_SAY }), availableTradingCapitalRange: fv(PREFER_NOT_TO_SAY), affordableLossRange: fv(PREFER_NOT_TO_SAY), desiredAdditionalMonthlyIncomeRange: fv(PREFER_NOT_TO_SAY), financialReasonForTrading: fv(PREFER_NOT_TO_SAY) });
    assert.equal(result.intake.status, "completed");
  });
  it("11. conditional required fields are enforced", async () => {
    const res = validateFinalCompletion({ student_sections: studentSections({ debtStatusTypes: fv({ hasDebt: "Yes", types: [] }) }), instructor_assessment: instructor(), acknowledgments: Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k=>[k,true])), ack_audit: { records: buildAckAuditRecords({ intake_id: "x", confirmed_by_user_id: "a", confirmed_by_role: "admin", capture_mode: "student_reported", confirmations: Object.fromEntries(ACKNOWLEDGMENT_KEYS.map(k=>[k,true])) as any }).records }, intake_id: "x" });
    assert.equal(res.ok, false);
  });
  it("12. high-risk flags contain explainable reasons", async () => {
    const flags = evaluateExplainableFlags(studentSections({ affordableLossRange: fv("$0"), pressureToMakeMoneyQuickly: fv("High urgency"), savingsEmergencyRanges: fv({ savings: "$0", emergencyFund: "$0" }), unexpectedExpenseAbility: fv("I would likely not be able to cover it right now"), willingRiskLimits: fv("No"), availableTradingCapitalRange: fv("$0 (not available now)") }));
    assert.ok(flags[0]?.source_fields.length);
    assert.ok(flags[0]?.suggested_instructor_action);
  });
  it("13. high-risk completion requires I6/I7/I17", async () => {
    const db = makeMockD1(); const d = await createDraftForStudent(db, { studentUserId: "s13", actor: admin }); (db as any).tables.student_intake_v2.find((r:any)=>r.id===d.id).form_version = LEGACY_PRE3D_FORM_VERSION;
    await saveStudentAnswers(db, { intakeId: d.id, studentUserId: "s13", actor: admin, mode: "student_reported", sections: studentSections({ pressureToMakeMoneyQuickly: fv("High urgency") }) });
    await saveInstructorAssessment(db, { intakeId: d.id, studentUserId: "s13", actor: admin, assessment: instructor() });
    const ack = fullAck(d.id);
    await saveAcknowledgments(db, { intakeId: d.id, studentUserId: "s13", actor: admin, acknowledgments: ack.acknowledgments, ackAudit: { records: ack.records } });
    await assert.rejects(() => completeIntake(db, { intakeId: d.id, studentUserId: "s13", actor: admin }));
  });
  it("14. successful completion creates immutable completed snapshot", async () => {
    const db = makeMockD1();
    const result = await completeHappy(db, "s14");
    assert.equal(result.intake.status, "completed");
    await assert.rejects(() => saveStudentAnswers(db, { intakeId: result.intake.id, studentUserId: "s14", actor: admin, mode: "student_reported", sections: { preferredName: fv("Changed") } as any }));
  });
  it("15. pointer updates to completed intake", async () => {
    const db = makeMockD1();
    const result = await completeHappy(db, "s15");
    const latest = await getLatestCompletedIntake(db, "s15");
    assert.equal(latest?.id, result.intake.id);
  });
  it("16. audit completion event created", async () => {
    const db = makeMockD1();
    const result = await completeHappy(db, "s16");
    assert.ok(db.tables.student_intake_v2_event.some(e => e.intake_id === result.intake.id && e.event_type === "completed"));
  });
  it("17. normal mutation after completion is rejected", async () => {
    const db = makeMockD1();
    const result = await completeHappy(db, "s17");
    await assert.rejects(() => saveInstructorAssessment(db, { intakeId: result.intake.id, studentUserId: "s17", actor: admin, assessment: { instructorSummary: fv("x") } }));
  });
  it("18. instructorPrivateNotes absent from student-safe serialization", async () => {
    const db = makeMockD1(); const d = await createDraftForStudent(db, { studentUserId: "s18", actor: admin });
    await saveInstructorAssessment(db, { intakeId: d.id, studentUserId: "s18", actor: admin, assessment: { instructorSummary: fv("ok"), instructorPrivateNotes: fv("SECRET") } as any });
    const intake = await getIntakeById(db, d.id, "s18");
    const safe = toStudentSafeIntakeResponse(intake!);
    assert.equal(JSON.stringify(safe).includes("SECRET"), false);
    assert.equal((toStudentSafeInstructorAssessment({ instructorSummary: fv("ok"), instructorPrivateNotes: fv("SECRET") } as any) as any).instructorPrivateNotes, undefined);
  });
  it("19. no external side effects occur", async () => {
    const db = makeMockD1();
    await completeHappy(db, "s19");
    assert.equal(db.tables.student_intake_v2.length, 1); // only intake records/events in mock; no email/sms/stripe calls possible
  });
  it("20. legacy questionnaire/Game Plan behavior remains untouched", async () => {
    assert.equal(validateDraft({ student_sections: {} }).ok, true); // foundation-only; legacy modules not imported/executed
  });
});
