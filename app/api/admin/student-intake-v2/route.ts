import {defaultReview,REVIEW_VERSION} from "@/lib/consultation-review/model";
import { validateFinalCompletion } from "@/lib/student-intake-v2/validation";
import { NextResponse } from "next/server";
import { requireIntakeV2Staff } from "@/lib/student-intake-v2/auth";
import { getIntakeV2Db, createDraftForStudent, getActiveDraftForStudent, getLatestCompletedIntake, saveStudentAnswers, saveInstructorAssessment, saveAcknowledgments, evaluateAndStoreFlags, completeIntake, getIntakeById } from "@/lib/student-intake-v2/service";
import { getAcknowledgmentRegistry } from "@/lib/student-intake-v2/acknowledgments";
import { assertNoInstructorFieldsInStudentPayload } from "@/lib/student-intake-v2/snapshot";
import type { AckAudit, InstructorAssessmentV2, StudentSectionsV2 } from "@/lib/student-intake-v2/contracts";

export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export async function GET(request: Request) {
  try {
    await requireIntakeV2Staff();
    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    const studentUserId = url.searchParams.get("studentUserId");
    const intakeId = url.searchParams.get("intakeId");
    const db = getIntakeV2Db();
    if (action === "registry") return NextResponse.json({ acknowledgments: getAcknowledgmentRegistry() });
    if (action === "get" && intakeId) {
      const intake = await getIntakeById(db, intakeId, studentUserId || undefined);
      if (!intake) return jsonError("Not found", 404);
      return NextResponse.json({ intake }); // admin/instructor-only route; no student-safe filtering
    }
    if (!studentUserId) return jsonError("studentUserId required");
    if (action === "latest-completed") return NextResponse.json({ intake: await getLatestCompletedIntake(db, studentUserId) });
    if (action === "validate" && intakeId) {
      const intake = await getIntakeById(db, intakeId, studentUserId);
      if (!intake) return jsonError("Not found", 404);
      return NextResponse.json(validateFinalCompletion({student_sections:intake.student_sections_json,instructor_assessment:intake.instructor_assessment_json,acknowledgments:intake.acknowledgments_json,ack_audit:intake.ack_audit_json,intake_id:intake.id,form_version:intake.form_version,schema_version:intake.schema_version,snapshot_version:intake.snapshot_version,instructor_review:intake.system_meta_json?.captureWorkflow===REVIEW_VERSION?(intake.system_meta_json.smart_review??defaultReview(intake.snapshot_version)):undefined}));
    }
    if (action === "flags" && intakeId) {
      const intake = await getIntakeById(db, intakeId, studentUserId);
      if (!intake) return jsonError("Not found", 404);
      return NextResponse.json({ flags: intake.system_flags_json || [] });
    }
    const intake = await getActiveDraftForStudent(db, studentUserId);
    return NextResponse.json({ intake });
  } catch (e: any) {
    if (e?.digest?.includes("NEXT_REDIRECT") || e?.message === "NEXT_REDIRECT") throw e;
    return jsonError(e?.message || "Unauthorized", e?.message === "Intake not found." ? 404 : 403);
  }
}

type Body = {
  correctionReason?: string;
  evidenceKind?: "STUDENT_REPORTED"|"INSTRUCTOR_OVERRIDE";
  expectedSnapshotVersion?: number;
  action?: string;
  studentUserId?: string;
  intakeId?: string;
  bookingId?: string | null;
  legacyConsultationQuestionnaireId?: string | null;
  mode?: "student_reported" | "instructor_entered_for_student";
  sections?: StudentSectionsV2;
  assessment?: InstructorAssessmentV2;
  acknowledgments?: Record<string, boolean>;
  ackAudit?: AckAudit;
};

export async function POST(request: Request) {
  try {
    const actor = await requireIntakeV2Staff();
    const body = (await request.json().catch(() => ({}))) as Body;
    const action = body.action;
    const studentUserId = String(body.studentUserId || "");
    const intakeId = String(body.intakeId || "");
    const db = getIntakeV2Db();

    if (action === "create-draft") {
      if (!studentUserId) return jsonError("studentUserId required");
      const intake = await createDraftForStudent(db, { studentUserId, actor, bookingId: body.bookingId ?? null, legacyConsultationQuestionnaireId: body.legacyConsultationQuestionnaireId ?? null });
      return NextResponse.json({ intake });
    }
    if (!intakeId || !studentUserId) return jsonError("intakeId and studentUserId required");

    if (body.expectedSnapshotVersion !== undefined) {
      const current = await getIntakeById(db,intakeId,studentUserId);
      if (!current) return jsonError("Not found",404);
      if (current.snapshot_version !== body.expectedSnapshotVersion) return jsonError("Intake changed; reload before saving. Your unsaved answers have been kept on this page.",409);
    }
    if (action === "save-student") {
      const sections = body.sections || ({} as StudentSectionsV2);
      assertNoInstructorFieldsInStudentPayload(sections as unknown as Record<string, unknown>);
      const intake = await saveStudentAnswers(db, { expectedSnapshotVersion:body.expectedSnapshotVersion, intakeId, studentUserId, actor, mode: "instructor_entered_for_student", sections,correctionReason:body.correctionReason,evidenceKind:body.evidenceKind });
      return NextResponse.json({ intake });
    }
    if (action === "save-instructor") {
      const intake = await saveInstructorAssessment(db, { expectedSnapshotVersion:body.expectedSnapshotVersion, intakeId, studentUserId, actor, assessment: body.assessment || ({} as InstructorAssessmentV2) });
      return NextResponse.json({ intake });
    }
    if (action === "save-ack") {
      const intake = await saveAcknowledgments(db, { expectedSnapshotVersion:body.expectedSnapshotVersion, intakeId, studentUserId, actor, acknowledgments: body.acknowledgments || {}, ackAudit: body.ackAudit || { records: [] } });
      return NextResponse.json({ intake });
    }
    if (action === "evaluate-flags") {
      const flags = await evaluateAndStoreFlags(db, { intakeId, studentUserId, actor });
      return NextResponse.json({ flags });
    }
    if (action === "complete") {
      const result = await completeIntake(db, { expectedSnapshotVersion:body.expectedSnapshotVersion, intakeId, studentUserId, actor });
      return NextResponse.json({ intake: result.intake, flags: result.flags });
    }
    return jsonError("Invalid action");
  } catch (e: any) {
    if (e?.digest?.includes("NEXT_REDIRECT") || e?.message === "NEXT_REDIRECT") throw e;
    if (e?.issues) return jsonError(e.message, 422, { issues: e.issues, flags: e.flags });
    const message = e?.message || "Request failed";
    const status = /Intake changed; reload/.test(message) ? 409 : 400;
    return jsonError(message, status);
  }
}
