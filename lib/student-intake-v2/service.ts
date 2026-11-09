import {changedFields,defaultReview,REVIEW_VERSION} from "../consultation-review/model";
import type {SourceRef,EvidenceKind} from "../consultation-review/canonical";
import {
  INTAKE_V2_FORM_VERSION,
  INTAKE_V2_SCHEMA_VERSION,
  type AckAudit,
  type CaptureMode,
  type ExplainableFlag,
  type InstructorAssessmentV2,
  type IntakeV2Record,
  type IntakeV2Status,
  type StudentSectionsV2,
} from "./contracts";
import { buildAckAuditRecords } from "./acknowledgments";
import { evaluateExplainableFlags } from "./flags";
import { assertCanMutateSnapshot, assertNoInstructorFieldsInStudentPayload } from "./snapshot";
import { validateDraft, validateFinalCompletion } from "./validation";

export type IntakeActor = { userId: string; role: string };
export type IntakeD1 = D1Database;

function nowIso() { return new Date().toISOString(); }
function newId() { return crypto.randomUUID().replace(/-/g, ""); }
function json(v: unknown) { return JSON.stringify(v ?? null); }
function parseJson<T>(v: unknown, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === "string") { try { return JSON.parse(v) as T; } catch { return fallback; } }
  return v as T;
}

function rowToRecord(row: any): IntakeV2Record {
  return {
    id: row.id,
    student_user_id: row.student_user_id,
    booking_id: row.booking_id ?? null,
    legacy_consultation_questionnaire_id: row.legacy_consultation_questionnaire_id ?? null,
    schema_version: row.schema_version,
    form_version: row.form_version,
    status: row.status as IntakeV2Status,
    snapshot_version: Number(row.snapshot_version || 1),
    student_sections_json: parseJson(row.student_sections_json, {}),
    acknowledgments_json: parseJson(row.acknowledgments_json, {}),
    ack_audit_json: parseJson(row.ack_audit_json, { records: [] }),
    instructor_assessment_json: parseJson(row.instructor_assessment_json, {}),
    system_flags_json: parseJson(row.system_flags_json, []),
    proposed_seeds_json: parseJson(row.proposed_seeds_json, []),
    system_meta_json: parseJson(row.system_meta_json, {}),
    provenance_json: parseJson(row.provenance_json, {}),
    created_by_user_id: row.created_by_user_id ?? null,
    updated_by_user_id: row.updated_by_user_id ?? null,
    completed_by_user_id: row.completed_by_user_id ?? null,
    instructor_user_id: row.instructor_user_id ?? null,
    started_at: row.started_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    completed_at: row.completed_at ?? null,
  };
}

function mergePreservingUnknown<T extends Record<string, unknown>>(existing: T, incoming: Partial<T> | undefined): T {
  if (!incoming || typeof incoming !== "object") return existing || ({} as T);
  return { ...(existing || {}), ...(incoming as any) } as T;
}

function withStudentProvenance(sections: StudentSectionsV2, mode: CaptureMode, actor: IntakeActor, existingProv: Record<string, any>, previous: Record<string, unknown>) {
  const provenance = { ...(existingProv || {}) };
  const now = nowIso();
  for (const key of Object.keys(sections || {})) if (JSON.stringify(sections[key as keyof StudentSectionsV2]) !== JSON.stringify(previous[key])) provenance[key] = { source: mode, entered_by_user_id: actor.userId, entered_at: now };
  return provenance;
}

function withInstructorProvenance(assessment: InstructorAssessmentV2, actor: IntakeActor, existingProv: Record<string, any>, previous: Record<string, unknown>) {
  const provenance = { ...(existingProv || {}) };
  const now = nowIso();
  for (const key of Object.keys(assessment || {})) if (JSON.stringify(assessment[key as keyof InstructorAssessmentV2]) !== JSON.stringify(previous[key])) provenance[key] = { source: "instructor_assessment", evidenceKind:"INSTRUCTOR_OBSERVED", entered_by_user_id: actor.userId, entered_at: now };
  return provenance;
}

export function getIntakeV2Db(db?: IntakeD1): IntakeD1 {
  if (db) return db;
  // Lazy require to keep this module testable outside Next/Cloudflare runtime.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getCloudflareContext } = require("@opennextjs/cloudflare");
  return getCloudflareContext().env.DB;
}

export async function writeIntakeEvent(db: IntakeD1, params: { intakeId: string; eventType: string; actor: IntakeActor; summary?: Record<string, unknown> }) {
  await db.prepare(
    `INSERT INTO "student_intake_v2_event" ("id","intake_id","event_type","actor_user_id","actor_role","payload_summary_json","created_at") VALUES (?,?,?,?,?,?,?)`,
  ).bind(newId(), params.intakeId, params.eventType, params.actor.userId, params.actor.role, json(params.summary || {}), nowIso()).run();
}

export async function getIntakeById(db: IntakeD1, intakeId: string, studentUserId?: string): Promise<IntakeV2Record | null> {
  const stmt = studentUserId
    ? db.prepare(`SELECT * FROM "student_intake_v2" WHERE id = ? AND student_user_id = ? LIMIT 1`).bind(intakeId, studentUserId)
    : db.prepare(`SELECT * FROM "student_intake_v2" WHERE id = ? LIMIT 1`).bind(intakeId);
  const row = await stmt.first<any>();
  return row ? rowToRecord(row) : null;
}

export async function getActiveDraftForStudent(db: IntakeD1, studentUserId: string): Promise<IntakeV2Record | null> {
  const pointer = await db.prepare(`SELECT active_intake_id FROM "student_intake_v2_pointer" WHERE student_user_id = ?`).bind(studentUserId).first<{ active_intake_id: string | null }>();
  if (pointer?.active_intake_id) {
    const rec = await getIntakeById(db, pointer.active_intake_id, studentUserId);
    if (rec && (rec.status === "draft" || rec.status === "in_progress")) return rec;
  }
  const row = await db.prepare(
    `SELECT * FROM "student_intake_v2" WHERE student_user_id = ? AND status IN ('draft','in_progress') ORDER BY updated_at DESC LIMIT 1`,
  ).bind(studentUserId).first<any>();
  return row ? rowToRecord(row) : null;
}

export async function getLatestCompletedIntake(db: IntakeD1, studentUserId: string): Promise<IntakeV2Record | null> {
  const pointer = await db.prepare(`SELECT latest_completed_intake_id FROM "student_intake_v2_pointer" WHERE student_user_id = ?`).bind(studentUserId).first<{ latest_completed_intake_id: string | null }>();
  if (pointer?.latest_completed_intake_id) {
    const rec = await getIntakeById(db, pointer.latest_completed_intake_id, studentUserId);
    if (rec?.status === "completed") return rec;
  }
  const row = await db.prepare(
    `SELECT * FROM "student_intake_v2" WHERE student_user_id = ? AND status = 'completed' ORDER BY completed_at DESC, created_at DESC LIMIT 1`,
  ).bind(studentUserId).first<any>();
  return row ? rowToRecord(row) : null;
}

export async function createDraftForStudent(db: IntakeD1, params: {
  studentUserId: string; actor: IntakeActor; bookingId?: string | null; legacyConsultationQuestionnaireId?: string | null; inheritLatest?: boolean;
}): Promise<IntakeV2Record> {
  const existing = await getActiveDraftForStudent(db, params.studentUserId);
  if (existing) return existing;
  const inherited = params.inheritLatest ? await getLatestCompletedIntake(db,params.studentUserId) : null;
  const id = newId();
  const now = nowIso();
  await db.prepare(
    `INSERT INTO "student_intake_v2" ("id","student_user_id","booking_id","legacy_consultation_questionnaire_id","schema_version","form_version","status","snapshot_version","student_sections_json","acknowledgments_json","ack_audit_json","instructor_assessment_json","system_flags_json","proposed_seeds_json","system_meta_json","provenance_json","created_by_user_id","updated_by_user_id","completed_by_user_id","instructor_user_id","started_at","created_at","updated_at","completed_at")
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL)`,
  ).bind(
    id, params.studentUserId, params.bookingId ?? null, params.legacyConsultationQuestionnaireId ?? null,
    INTAKE_V2_SCHEMA_VERSION, INTAKE_V2_FORM_VERSION, "draft", 1,
    json(inherited?.student_sections_json || {}), json({}), json({ records: [] }), json({}), json([]), json([]), json(inherited?{inheritedFromIntakeId:inherited.id}:{}), json(inherited?Object.fromEntries(Object.entries(inherited.provenance_json||{}).filter(([key])=>key in inherited.student_sections_json).map(([key,p])=>[key,{...p,inheritedFromIntakeId:inherited.id}])):{}),
    params.actor.userId, params.actor.userId, null, params.actor.userId, now, now, now,
  ).run();
  await db.prepare(
    `INSERT INTO "student_intake_v2_pointer" ("student_user_id","active_intake_id","latest_completed_intake_id","updated_at") VALUES (?,?,NULL,?)
     ON CONFLICT("student_user_id") DO UPDATE SET "active_intake_id"=excluded."active_intake_id","updated_at"=excluded."updated_at"`,
  ).bind(params.studentUserId, id, now).run();
  await writeIntakeEvent(db, { intakeId: id, eventType: "created", actor: params.actor, summary: { studentUserId: params.studentUserId } });
  return (await getIntakeById(db, id, params.studentUserId))!;
}

async function requireMutableDraft(db: IntakeD1, intakeId: string, studentUserId: string, mode: "draft_save" | "autosave" | "instructor_save", expectedSnapshotVersion?: number): Promise<IntakeV2Record> {
  const rec = await getIntakeById(db, intakeId, studentUserId);
  if (!rec) throw new Error("Intake not found.");
  if(expectedSnapshotVersion !== undefined && rec.snapshot_version !== expectedSnapshotVersion) throw new Error("Intake changed; reload before saving.");
  assertCanMutateSnapshot({ currentStatus: rec.status, mode });
  return rec;
}

export async function saveStudentAnswers(db: IntakeD1, params: {
  expectedSnapshotVersion?: number; intakeId: string; studentUserId: string; actor: IntakeActor; mode: CaptureMode; sections: StudentSectionsV2; correctionReason?: string; evidenceKind?: "STUDENT_REPORTED"|"INSTRUCTOR_OVERRIDE"; sourceRefs?: Record<string,SourceRef[]>;
}): Promise<IntakeV2Record> {
  assertNoInstructorFieldsInStudentPayload(params.sections as unknown as Record<string, unknown>);
  const rec = await requireMutableDraft(db, params.intakeId, params.studentUserId, "draft_save", params.expectedSnapshotVersion);
  const validation = validateDraft({ student_sections: params.sections });
  if (!validation.ok) throw new Error(`Draft validation failed: ${validation.issues[0]?.message}`);
  const merged = mergePreservingUnknown(rec.student_sections_json as any, params.sections as any);
  const provenance = withStudentProvenance(params.sections, params.mode, params.actor, (rec.provenance_json as any) || {}, rec.student_sections_json as any);
  if(params.evidenceKind && !["STUDENT_REPORTED","INSTRUCTOR_OVERRIDE"].includes(params.evidenceKind))throw new Error("Factual capture cannot fabricate observation or demonstrated evidence.");
  if(params.evidenceKind==="INSTRUCTOR_OVERRIDE"&&!params.correctionReason?.trim())throw new Error("Instructor overrides require a reason.");
  const fieldChanges=changedFields(rec.student_sections_json as any,params.sections as any,params.correctionReason||"");
  for(const change of fieldChanges)provenance[change.key]={...provenance[change.key],evidenceKind:params.evidenceKind||"STUDENT_REPORTED",correctionReason:params.correctionReason?.trim()||null,...(params.sourceRefs?.[change.key]?{sourceRefs:params.sourceRefs[change.key]}:{})};
  const flags = evaluateExplainableFlags(merged);
  const now = nowIso();
  const nextStatus: IntakeV2Status = rec.status === "draft" ? "in_progress" : rec.status;
  const savedResults=await db.batch([
    db.prepare(
    `UPDATE "student_intake_v2" SET "student_sections_json"=?, "provenance_json"=?, "system_flags_json"=?, "status"=?, "updated_at"=?, "updated_by_user_id"=?  , "snapshot_version"="snapshot_version"+1 WHERE id=? AND student_user_id=? AND status IN ('draft','in_progress') AND snapshot_version=?`,
  ).bind(json(merged), json(provenance), json(flags), nextStatus, now, params.actor.userId, params.intakeId, params.studentUserId, rec.snapshot_version),
    db.prepare(`INSERT INTO "student_intake_v2_event" ("id","intake_id","event_type","actor_user_id","actor_role","payload_summary_json","created_at") SELECT ?,?,?,?,?,?,? WHERE changes()=1 AND EXISTS(SELECT 1 FROM student_intake_v2 WHERE id=? AND snapshot_version=?)`)
      .bind(newId(),params.intakeId,"saved",params.actor.userId,params.actor.role,json({mode:params.mode,keys:Object.keys(params.sections||{}),fieldChanges:fieldChanges.map(change=>({...change,previousProvenance:rec.provenance_json?.[change.key]??null,newProvenance:provenance[change.key]}))}),now,rec.id,rec.snapshot_version+1)
  ]);
  if (!savedResults[0].meta.changes) throw new Error("Intake changed; reload before saving.");
  return (await getIntakeById(db, params.intakeId, params.studentUserId))!;
}

export async function saveInstructorAssessment(db: IntakeD1, params: {
  expectedSnapshotVersion?: number; intakeId: string; studentUserId: string; actor: IntakeActor; assessment: InstructorAssessmentV2;
}): Promise<IntakeV2Record> {
  const rec = await requireMutableDraft(db, params.intakeId, params.studentUserId, "instructor_save", params.expectedSnapshotVersion);
  if(rec.system_meta_json?.captureWorkflow===REVIEW_VERSION){
    const allowed=new Set(["instructorStrengths","instructorWeaknesses","behavioralConcerns","financialRiskConcerns","scheduleConcerns","learningStyleObservations","riskRestrictions","instructorPrivateNotes"]);
    if(Object.keys(params.assessment).some(k=>!allowed.has(k)))throw new Error("Use concise instructor review. Legacy summary/placement fields are historical; approve recommendations in Learning Paths.");
  }
  const merged = mergePreservingUnknown(rec.instructor_assessment_json as any, params.assessment as any);
  const provenance = withInstructorProvenance(params.assessment, params.actor, (rec.provenance_json as any) || {}, rec.instructor_assessment_json as any);
  const now = nowIso();
  const savedResults=await db.batch([
    db.prepare(
    `UPDATE "student_intake_v2" SET "instructor_assessment_json"=?, "provenance_json"=?, "instructor_user_id"=COALESCE("instructor_user_id",?), "status"=?, "updated_at"=?, "updated_by_user_id"=?  , "snapshot_version"="snapshot_version"+1 WHERE id=? AND student_user_id=? AND status IN ('draft','in_progress') AND snapshot_version=?`,
  ).bind(json(merged), json(provenance), params.actor.userId, rec.status === "draft" ? "in_progress" : rec.status, now, params.actor.userId, params.intakeId, params.studentUserId, rec.snapshot_version),
    db.prepare(`INSERT INTO "student_intake_v2_event" ("id","intake_id","event_type","actor_user_id","actor_role","payload_summary_json","created_at") SELECT ?,?,?,?,?,?,? WHERE changes()=1 AND EXISTS(SELECT 1 FROM student_intake_v2 WHERE id=? AND snapshot_version=?)`)
      .bind(newId(),params.intakeId,"saved",params.actor.userId,params.actor.role,json({kind:"instructor_assessment",fieldChanges:changedFields(rec.instructor_assessment_json as any,params.assessment as any,"").map(change=>({...change,previousProvenance:rec.provenance_json?.[change.key]??null,newProvenance:provenance[change.key]}))}),now,rec.id,rec.snapshot_version+1)
  ]);
  if (!savedResults[0].meta.changes) throw new Error("Intake changed; reload before saving.");
  return (await getIntakeById(db, params.intakeId, params.studentUserId))!;
}

export async function saveAcknowledgments(db: IntakeD1, params: {
  expectedSnapshotVersion?: number; intakeId: string; studentUserId: string; actor: IntakeActor; acknowledgments: Record<string, boolean>; ackAudit: AckAudit;
}): Promise<IntakeV2Record> {
  const rec = await requireMutableDraft(db, params.intakeId, params.studentUserId, "draft_save", params.expectedSnapshotVersion);
  const captured = buildAckAuditRecords({ intake_id: rec.id, confirmed_by_user_id: params.actor.userId, confirmed_by_role: params.actor.role, capture_mode: params.ackAudit.records?.[0]?.capture_mode === "instructor_entered_for_student" ? "instructor_entered_for_student" : "student_reported", confirmations: params.acknowledgments, form_version: rec.form_version, schema_version: rec.schema_version });
  const preservedRecords = captured.records.filter(record => params.ackAudit.records?.some(submitted => submitted.ack_key === record.ack_key && submitted.confirmed === true)).map(record => {
    const previous = rec.acknowledgments_json[record.ack_key] === true ? rec.ack_audit_json.records.find(r=>r.ack_key===record.ack_key && r.confirmed===true && r.ack_text_version_id===record.ack_text_version_id) : undefined;
    return previous || record;
  });
  const now = nowIso();
  const savedResults=await db.batch([
    db.prepare(
    `UPDATE "student_intake_v2" SET "acknowledgments_json"=?, "ack_audit_json"=?, "status"=?, "updated_at"=?, "updated_by_user_id"=?  , "snapshot_version"="snapshot_version"+1 WHERE id=? AND student_user_id=? AND status IN ('draft','in_progress') AND snapshot_version=?`,
  ).bind(json(captured.acknowledgments), json({ records: preservedRecords }), rec.status === "draft" ? "in_progress" : rec.status, now, params.actor.userId, params.intakeId, params.studentUserId, rec.snapshot_version),
    db.prepare(`INSERT INTO "student_intake_v2_event" ("id","intake_id","event_type","actor_user_id","actor_role","payload_summary_json","created_at") SELECT ?,?,?,?,?,?,? WHERE changes()=1 AND EXISTS(SELECT 1 FROM student_intake_v2 WHERE id=? AND snapshot_version=?)`)
      .bind(newId(),params.intakeId,"ack_recorded",params.actor.userId,params.actor.role,json({previousAcknowledgments:rec.acknowledgments_json,newAcknowledgments:captured.acknowledgments,previousAudit:rec.ack_audit_json,newAudit:{records:preservedRecords}}),now,rec.id,rec.snapshot_version+1)
  ]);
  if (!savedResults[0].meta.changes) throw new Error("Intake changed; reload before saving.");
  return (await getIntakeById(db, params.intakeId, params.studentUserId))!;
}

export async function evaluateAndStoreFlags(db: IntakeD1, params: { intakeId: string; studentUserId: string; actor: IntakeActor }): Promise<ExplainableFlag[]> {
  const rec = await getIntakeById(db, params.intakeId, params.studentUserId);
  if (!rec) throw new Error("Intake not found.");
  assertCanMutateSnapshot({ currentStatus: rec.status, mode: "draft_save" });
  const flags = evaluateExplainableFlags(rec.student_sections_json as StudentSectionsV2);
  const now = nowIso();
  const saved = await db.prepare(`UPDATE "student_intake_v2" SET "system_flags_json"=?, "system_meta_json"=?, "updated_at"=?  , "snapshot_version"="snapshot_version"+1 WHERE id=? AND student_user_id=? AND status IN ('draft','in_progress') AND snapshot_version=?`).bind(
    json(flags), json({ ...(rec.system_meta_json || {}), flagsEvaluatedAt: now, flagSchemaVersion: INTAKE_V2_SCHEMA_VERSION }), now, params.intakeId, params.studentUserId, rec.snapshot_version,
  ).run();
  if (!saved.meta.changes) throw new Error("Intake changed; reload before saving.");
  return flags;
}

export async function completeIntake(db: IntakeD1, params: { expectedSnapshotVersion?: number; intakeId: string; studentUserId: string; actor: IntakeActor }): Promise<{ intake: IntakeV2Record; flags: ExplainableFlag[] }> {
  const rec = await getIntakeById(db, params.intakeId, params.studentUserId);
  if (!rec) throw new Error("Intake not found.");
  if(params.expectedSnapshotVersion !== undefined && rec.snapshot_version !== params.expectedSnapshotVersion) throw new Error("Intake changed; reload before completing.");
  assertCanMutateSnapshot({ currentStatus: rec.status, mode: "complete", nextStatus: "completed" });
  const flags = evaluateExplainableFlags(rec.student_sections_json as StudentSectionsV2);
  const validation = validateFinalCompletion({
    student_sections: rec.student_sections_json as StudentSectionsV2,
    instructor_assessment: rec.instructor_assessment_json as InstructorAssessmentV2,
    acknowledgments: rec.acknowledgments_json as Record<string, boolean>,
    ack_audit: rec.ack_audit_json as AckAudit,
    intake_id: rec.id,
    form_version: rec.form_version,
    schema_version: rec.schema_version,
    snapshot_version:rec.snapshot_version,
    instructor_review:rec.system_meta_json?.captureWorkflow===REVIEW_VERSION?(rec.system_meta_json.smart_review??defaultReview(rec.snapshot_version)):undefined,
  });
  if (!validation.ok) {
    const err = new Error("Intake completion validation failed.");
    (err as any).issues = validation.issues;
    (err as any).flags = flags;
    throw err;
  }
  const now = nowIso();
  const results = await db.batch([
    db.prepare(`UPDATE "student_intake_v2" SET "status"='completed', "completed_at"=?, "completed_by_user_id"=?, "system_flags_json"=?, "system_meta_json"=?, "updated_at"=?, "updated_by_user_id"=? WHERE id=? AND student_user_id=? AND status IN ('draft','in_progress') AND snapshot_version=?`)
      .bind(now, params.actor.userId, json(flags), json({ ...(rec.system_meta_json || {}), completedAt: now, flagsEvaluatedAt: now }), now, params.actor.userId, rec.id, rec.student_user_id, rec.snapshot_version),
    db.prepare(`INSERT INTO "student_intake_v2_pointer" ("student_user_id","active_intake_id","latest_completed_intake_id","updated_at") SELECT ?,NULL,?,? WHERE changes()=1 AND EXISTS(SELECT 1 FROM student_intake_v2 WHERE id=? AND status='completed' AND completed_at=? AND snapshot_version=?)
       ON CONFLICT("student_user_id") DO UPDATE SET "active_intake_id"=NULL, "latest_completed_intake_id"=excluded."latest_completed_intake_id", "updated_at"=excluded."updated_at"`)
      .bind(rec.student_user_id, rec.id, now, rec.id, now, rec.snapshot_version),
    db.prepare(`INSERT INTO "student_intake_v2_event" ("id","intake_id","event_type","actor_user_id","actor_role","payload_summary_json","created_at") SELECT ?,?,?,?,?,?,? WHERE changes()=1 AND EXISTS(SELECT 1 FROM student_intake_v2 WHERE id=? AND status='completed' AND completed_at=? AND snapshot_version=?)`)
      .bind(newId(), rec.id, "completed", params.actor.userId, params.actor.role, json({ flags: flags.map(f => f.rule_id) }), now, rec.id, now, rec.snapshot_version),
  ]);
  if (!results[0].meta.changes) throw new Error("Intake changed; reload before completing.");
  const intake = await getIntakeById(db, rec.id, rec.student_user_id);
  if (!intake || intake.status !== "completed") throw new Error("Completion failed to persist.");
  return { intake, flags };
}

export function toStudentSafeIntakeResponse(record: IntakeV2Record) {
  const ia = (record.instructor_assessment_json || {}) as Record<string, unknown>;
  const { instructorPrivateNotes: _p, ...studentSafeAssessment } = ia;
  void studentSafeAssessment;
  return {
    id: record.id,
    student_user_id: record.student_user_id,
    booking_id: record.booking_id,
    schema_version: record.schema_version,
    form_version: record.form_version,
    status: record.status,
    snapshot_version: record.snapshot_version,
    student_sections_json: record.student_sections_json,
    acknowledgments_json: record.acknowledgments_json,
    completed_at: record.completed_at,
    updated_at: record.updated_at,
    // instructorPrivateNotes, raw ack_audit/provenance/system_meta/events/internal metadata excluded.
  };
}
