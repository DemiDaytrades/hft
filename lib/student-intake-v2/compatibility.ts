import type { IntakeV2Record } from "./contracts";

export type IntakeSourceKind = "legacy_consultation_questionnaire" | "student_intake_v2";

export type LegacyConsultationQuestionnaireSource = {
  kind: "legacy_consultation_questionnaire";
  id: string;
  userId: string;
  bookingId: string | null;
  status: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
};

export type IntakeV2Source = {
  kind: "student_intake_v2";
  record: IntakeV2Record;
};

export type IntakeSource = LegacyConsultationQuestionnaireSource | IntakeV2Source;

/** Foundation for future Game Plan generation to accept legacy or V2. Does NOT switch existing behavior. */
export interface IntakeSourceAdapter {
  getKind(): IntakeSourceKind;
  getStudentUserId(): string;
  getStatus(): string;
  getSubmittedAt(): string | null;
  toLegacyQuestionnaireShape?(): LegacyConsultationQuestionnaireSource;
  toIntakeV2Shape?(): IntakeV2Source;
}

export class LegacyQuestionnaireAdapter implements IntakeSourceAdapter {
  constructor(private readonly source: LegacyConsultationQuestionnaireSource) {}
  getKind(): IntakeSourceKind { return "legacy_consultation_questionnaire"; }
  getStudentUserId() { return this.source.userId; }
  getStatus() { return this.source.status; }
  getSubmittedAt() { return this.source.submittedAt; }
  toLegacyQuestionnaireShape() { return this.source; }
}

export class IntakeV2RecordAdapter implements IntakeSourceAdapter {
  constructor(private readonly source: IntakeV2Source) {}
  getKind(): IntakeSourceKind { return "student_intake_v2"; }
  getStudentUserId() { return this.source.record.student_user_id; }
  getStatus() { return this.source.record.status; }
  getSubmittedAt() { return this.source.record.completed_at; }
  toIntakeV2Shape() { return this.source; }
}

export function toIntakeSourceAdapter(source: IntakeSource): IntakeSourceAdapter {
  return source.kind === "legacy_consultation_questionnaire"
    ? new LegacyQuestionnaireAdapter(source)
    : new IntakeV2RecordAdapter(source);
}

export function isLegacyQuestionnaireSource(source: IntakeSource): source is LegacyConsultationQuestionnaireSource {
  return source.kind === "legacy_consultation_questionnaire";
}

export function isIntakeV2Source(source: IntakeSource): source is IntakeV2Source {
  return source.kind === "student_intake_v2";
}
