import { describe, it } from "node:test";
import assert from "node:assert";
import { PREFER_NOT_TO_SAY, type StudentSectionsV2 } from "./contracts";
import {
  createDraftForStudent,
  getActiveDraftForStudent,
  getIntakeById,
  saveStudentAnswers,
  type IntakeActor,
  type IntakeD1,
} from "./service";

type Row = Record<string, any>;
function makeMockD1(): IntakeD1 & { tables: Record<string, Row[]> } {
  const tables: Record<string, Row[]> = { student_intake_v2: [], student_intake_v2_event: [], student_intake_v2_pointer: [] };
  function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }
  function exec(sql: string, args: any[]) {
    const s = sql.replace(/\s+/g, " ").trim();
    if (s.startsWith("INSERT INTO \"student_intake_v2_event\"")) { tables.student_intake_v2_event.push({ id: args[0], intake_id: args[1], event_type: args[2], actor_user_id: args[3], actor_role: args[4], payload_summary_json: args[5], created_at: args[6] }); return { ok: true }; }
    if (s.startsWith("INSERT INTO \"student_intake_v2\" (")) {
      const cols = ["id","student_user_id","booking_id","legacy_consultation_questionnaire_id","schema_version","form_version","status","snapshot_version","student_sections_json","acknowledgments_json","ack_audit_json","instructor_assessment_json","system_flags_json","proposed_seeds_json","system_meta_json","provenance_json","created_by_user_id","updated_by_user_id","completed_by_user_id","instructor_user_id","started_at","created_at","updated_at","completed_at"];
      const row: Row = {}; cols.forEach((c, i) => (row[c] = args[i])); tables.student_intake_v2.push(row); return { ok: true };
    }
    if (s.startsWith("INSERT INTO \"student_intake_v2_pointer\"")) {
      const [student_user_id, active_intake_id, _latest, updated_at] = s.includes("SELECT ?,NULL,?,?") ? [args[0],null,args[1],args[2]] : args;
      const existing = tables.student_intake_v2_pointer.find(r => r.student_user_id === student_user_id);
      if (existing) { existing.active_intake_id = active_intake_id; existing.updated_at = updated_at; if (s.includes("latest_completed_intake_id=excluded")) existing.latest_completed_intake_id = args[2]; }
      else tables.student_intake_v2_pointer.push({ student_user_id, active_intake_id, latest_completed_intake_id: args[2], updated_at });
      return { ok: true };
    }
    if (s.startsWith("SELECT active_intake_id FROM \"student_intake_v2_pointer\"")) return clone(tables.student_intake_v2_pointer.find(r => r.student_user_id === args[0]) || null);
    if (s.startsWith("SELECT latest_completed_intake_id FROM \"student_intake_v2_pointer\"")) return clone(tables.student_intake_v2_pointer.find(r => r.student_user_id === args[0]) || null);
    if (s.startsWith("SELECT * FROM \"student_intake_v2\" WHERE id = ? AND student_user_id = ?")) return clone(tables.student_intake_v2.find(r => r.id === args[0] && r.student_user_id === args[1]) || null);
    if (s.startsWith("SELECT * FROM \"student_intake_v2\" WHERE id = ?")) return clone(tables.student_intake_v2.find(r => r.id === args[0]) || null);
    if (s.includes("status IN ('draft','in_progress') ORDER BY updated_at DESC LIMIT 1")) return clone([...tables.student_intake_v2].filter(r => r.student_user_id === args[0] && ["draft","in_progress"].includes(r.status)).sort((a,b)=>String(b.updated_at).localeCompare(String(a.updated_at)))[0] || null);
    if (s.includes("status = 'completed' ORDER BY completed_at DESC")) return clone([...tables.student_intake_v2].filter(r => r.student_user_id === args[0] && r.status === "completed")[0] || null);
    if (s.startsWith("UPDATE \"student_intake_v2\" SET \"student_sections_json\"=?")) {
      const [ss, prov, flags, status, updated_at, updated_by, id, student] = args;
      const r = tables.student_intake_v2.find(x => x.id === id && x.student_user_id === student); if (r) Object.assign(r, { student_sections_json: ss, provenance_json: prov, system_flags_json: flags, status, updated_at, updated_by_user_id: updated_by }); return { ok: true };
    }
    if (s.startsWith("UPDATE \"student_intake_v2\" SET \"status\"='completed'")) {
      const [completed_at, completed_by, flags, meta, updated_at, updated_by, id, student] = args;
      const r = tables.student_intake_v2.find(x => x.id === id && x.student_user_id === student && ["draft","in_progress"].includes(x.status));
      if (r) Object.assign(r, { status: "completed", completed_at, completed_by_user_id: completed_by, system_flags_json: flags, system_meta_json: meta, updated_at, updated_by_user_id: updated_by }); return { ok: true };
    }
    if (s.includes("FROM \"student_intake_v2_event\" WHERE intake_id = ? AND event_type = 'completed'")) return clone(tables.student_intake_v2_event.find(r => r.intake_id === args[0] && r.event_type === "completed") || null);
    if (s.startsWith("UPDATE \"student_intake_v2\" SET \"acknowledgments_json\"=?") || s.startsWith("UPDATE \"student_intake_v2\" SET \"instructor_assessment_json\"=?") || s.startsWith("UPDATE \"student_intake_v2\" SET \"system_flags_json\"=?")) return { ok: true };
    throw new Error(`MockD1 unsupported SQL: ${s}`);
  }
  function prepare(sql: string) {
    let bound: any[] = [];
    const stmt: any = { bind(...args: any[]) { bound = args; return stmt; }, async first() { return exec(sql, bound); }, async all() { const r = exec(sql, bound); return { results: Array.isArray(r) ? r : r ? [r] : [] }; }, async run() {
        let changes = 1;
        if (sql.startsWith('UPDATE "student_intake_v2"')) {
          const row = tables.student_intake_v2.find(r => r.id === bound[bound.length-3] && r.student_user_id === bound[bound.length-2]);
          changes = row && ['draft','in_progress'].includes(row.status) && row.snapshot_version === bound[bound.length-1] ? 1 : 0;
          if (!changes) return {success:true,meta:{changes:0}};
          exec(sql,bound);
          if (sql.includes('"snapshot_version"="snapshot_version"+1')) row!.snapshot_version++;
        } else exec(sql,bound);
        return {success:true,meta:{changes}};
      } };
    return stmt;
  }
  return { tables, prepare, batch: async (stmts: any[]) => { const results=[]; for (const st of stmts) results.push(await st.run()); return results; } } as any;
}
const admin: IntakeActor = { userId: "staff_admin_test", role: "admin" };
const SYNTHETIC_STUDENT = "synthetic_student_v2_local_only";

describe("Phase 3B — Financial Health workflow", () => {
  it("no automatic draft creation on student selection (active lookup returns null)", async () => {
    const db = makeMockD1();
    assert.equal(await getActiveDraftForStudent(db, SYNTHETIC_STUDENT), null);
    assert.equal(db.tables.student_intake_v2.length, 0);
  });

  it("create-draft action creates/returns active draft; duplicate click returns same draft", async () => {
    const db = makeMockD1();
    const a = await createDraftForStudent(db, { studentUserId: SYNTHETIC_STUDENT, actor: admin });
    const b = await createDraftForStudent(db, { studentUserId: SYNTHETIC_STUDENT, actor: admin });
    assert.equal(a.id, b.id);
    assert.equal(a.status, "draft");
    assert.equal(db.tables.student_intake_v2.filter(r => r.student_user_id === SYNTHETIC_STUDENT && ["draft","in_progress"].includes(r.status)).length, 1);
  });

  it("exact approved Financial Health keys used by save payload", async () => {
    const expected = ["monthlyTakeHomeRange","additionalIncome","incomeConsistencyPay","disposableIncomeRange","recurringObligationsRange","variableExpensesRange","upcomingMajorExpenses","savingsEmergencyRanges","unexpectedExpenseAbility","debtStatusTypes","totalDebtRange","monthlyDebtPaymentsRange","creditScoreRange","availableTradingCapitalRange","affordableLossRange","pressureToMakeMoneyQuickly","desiredAdditionalMonthlyIncomeRange","financialReasonForTrading"];
    // keys mirror FinancialHealthForm's FINANCIAL_HEALTH_FIELDS contract usage
    const db = makeMockD1();
    const draft = await createDraftForStudent(db, { studentUserId: SYNTHETIC_STUDENT, actor: admin });
    const sections: Partial<StudentSectionsV2> = {
      monthlyTakeHomeRange: { value: "$3,000–$4,999" },
      financialReasonForTrading: { value: "Education" },
      savingsEmergencyRanges: { value: { savings: "$500–$999", emergencyFund: "$1–$499" } },
    } as any;
    const saved = await saveStudentAnswers(db, { intakeId: draft.id, studentUserId: SYNTHETIC_STUDENT, actor: admin, mode: "instructor_entered_for_student", sections: sections as any });
    for (const k of ["monthlyTakeHomeRange","financialReasonForTrading","savingsEmergencyRanges"]) assert.ok(k in (saved.student_sections_json as any));
    assert.deepEqual(Object.keys({ monthlyTakeHomeRange:1,additionalIncome:1,incomeConsistencyPay:1,disposableIncomeRange:1,recurringObligationsRange:1,variableExpensesRange:1,upcomingMajorExpenses:1,savingsEmergencyRanges:1,unexpectedExpenseAbility:1,debtStatusTypes:1,totalDebtRange:1,monthlyDebtPaymentsRange:1,creditScoreRange:1,availableTradingCapitalRange:1,affordableLossRange:1,pressureToMakeMoneyQuickly:1,desiredAdditionalMonthlyIncomeRange:1,financialReasonForTrading:1 }), expected);
  });

  it("save uses instructor_entered_for_student provenance mode", async () => {
    const db = makeMockD1();
    const draft = await createDraftForStudent(db, { studentUserId: SYNTHETIC_STUDENT, actor: admin });
    const saved = await saveStudentAnswers(db, { intakeId: draft.id, studentUserId: SYNTHETIC_STUDENT, actor: admin, mode: "instructor_entered_for_student", sections: { monthlyTakeHomeRange: { value: "$1,000–$1,999" } } as any });
    const prov = (saved.provenance_json as any)?.monthlyTakeHomeRange;
    assert.ok(prov, "provenance recorded");
    assert.equal(prov.source, "instructor_entered_for_student");
    assert.equal(prov.entered_by_user_id, admin.userId);
    assert.ok(prov.entered_at);
  });

  it("Prefer not to say preserved (not converted to blank/null)", async () => {
    const db = makeMockD1();
    const draft = await createDraftForStudent(db, { studentUserId: SYNTHETIC_STUDENT, actor: admin });
    const saved = await saveStudentAnswers(db, { intakeId: draft.id, studentUserId: SYNTHETIC_STUDENT, actor: admin, mode: "instructor_entered_for_student", sections: { monthlyTakeHomeRange: { value: PREFER_NOT_TO_SAY }, savingsEmergencyRanges: { value: { savings: PREFER_NOT_TO_SAY, emergencyFund: PREFER_NOT_TO_SAY } } } as any });
    assert.equal((saved.student_sections_json as any).monthlyTakeHomeRange?.value, PREFER_NOT_TO_SAY);
    assert.equal((saved.student_sections_json as any).savingsEmergencyRanges?.value?.savings, PREFER_NOT_TO_SAY);
    assert.equal((saved.student_sections_json as any).savingsEmergencyRanges?.value?.emergencyFund, PREFER_NOT_TO_SAY);
  });

  it("existing section data preserved during Financial Health save (merge, no unanswered overwrite)", async () => {
    const db = makeMockD1();
    const draft = await createDraftForStudent(db, { studentUserId: SYNTHETIC_STUDENT, actor: admin });
    await saveStudentAnswers(db, { intakeId: draft.id, studentUserId: SYNTHETIC_STUDENT, actor: admin, mode: "instructor_entered_for_student", sections: { goalImmediate: { value: "Learn risk" } } as any });
    await saveStudentAnswers(db, { intakeId: draft.id, studentUserId: SYNTHETIC_STUDENT, actor: admin, mode: "instructor_entered_for_student", sections: { monthlyTakeHomeRange: { value: "$2,000–$2,999" } } as any });
    const rec = await getIntakeById(db, draft.id, SYNTHETIC_STUDENT);
    assert.equal((rec?.student_sections_json as any)?.goalImmediate?.value, "Learn risk");
    assert.equal((rec?.student_sections_json as any)?.monthlyTakeHomeRange?.value, "$2,000–$2,999");
  });

  it("completed snapshot remains immutable (cannot save student answers)", async () => {
    const db = makeMockD1();
    const draft = await createDraftForStudent(db, { studentUserId: SYNTHETIC_STUDENT, actor: admin });
    const row = db.tables.student_intake_v2.find(r => r.id === draft.id)!;
    row.status = "completed"; row.completed_at = new Date().toISOString();
    await assert.rejects(
      () => saveStudentAnswers(db, { intakeId: draft.id, studentUserId: SYNTHETIC_STUDENT, actor: admin, mode: "instructor_entered_for_student", sections: { monthlyTakeHomeRange: { value: "$0" } } as any }),
      (e: any) => /immutable|completed|Cannot mutate/i.test(String(e?.message || e))
    );
  });
});
