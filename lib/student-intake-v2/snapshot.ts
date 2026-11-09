import type { IntakeV2Status } from "./contracts";
import { canTransitionStatus } from "./validation";

export type SnapshotWriteMode = "draft_save" | "autosave" | "instructor_save" | "complete" | "system";

export class IntakeSnapshotImmutableError extends Error {
  code = "INTAKE_SNAPSHOT_IMMUTABLE" as const;
  constructor(message = "Completed Intake V2 snapshots cannot be silently overwritten by normal save/update operations.") {
    super(message);
    this.name = "IntakeSnapshotImmutableError";
  }
}

export function assertCanMutateSnapshot(params: {
  currentStatus: IntakeV2Status;
  mode: SnapshotWriteMode;
  nextStatus?: IntakeV2Status;
}): void {
  const { currentStatus, mode, nextStatus } = params;
  if (currentStatus === "completed" && mode !== "system") {
    throw new IntakeSnapshotImmutableError();
  }
  if (currentStatus === "superseded" || currentStatus === "archived") {
    if (mode !== "system") throw new IntakeSnapshotImmutableError(`Intake with status ${currentStatus} cannot be modified by normal operations.`);
  }
  if (nextStatus && !canTransitionStatus(currentStatus, nextStatus)) {
    throw new Error(`Invalid status transition: ${currentStatus} -> ${nextStatus}`);
  }
}

/** Maps to student-safe payload; instructorPrivateNotes must never be included. */
export function toStudentSafeInstructorAssessment<T extends Record<string, unknown>>(assessment: T | null | undefined): Omit<T, "instructorPrivateNotes"> {
  if (!assessment || typeof assessment !== "object") return {} as Omit<T, "instructorPrivateNotes">;
  const { instructorPrivateNotes: _private, ...safe } = assessment as T & { instructorPrivateNotes?: unknown };
  return safe;
}

/** Reject payloads attempting to write instructor-only fields in a student context. */
export function assertNoInstructorFieldsInStudentPayload(payload: Record<string, unknown>): void {
  const instructor = new Set([
    "instructorSummary","assessedExperienceLevel","assessedKnowledgeLevel","instructorStrengths","instructorWeaknesses","behavioralConcerns","financialRiskConcerns","scheduleConcerns","learningStyleObservations","recommendedStartingLevel","recommendedAcademyTrack","recommendedModules","recommendedFirstLesson","firstHomework","recommendedPracticeFrequency","recommendedCoachingFrequency","riskRestrictions","instructorPrivateNotes","immediateActionItems",
    "instructor_assessment_json", "instructorAssessment",
  ]);
  for (const k of Object.keys(payload || {})) {
    if (instructor.has(k)) throw new Error(`Student payload cannot write instructor-only field: ${k}`);
  }
}
