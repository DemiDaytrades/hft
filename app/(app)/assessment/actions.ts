"use server";
import { requireActiveMember } from "@/lib/dal";
import { createAttempt, getActiveAttempt, saveDraft, completeAttempt, getLatestCompleted, toStudentAttempt } from "@/lib/placement-assessment-storage";


export async function ensureAttempt() {
  const user = await requireActiveMember();
  const active = await getActiveAttempt(user.id);
  if (active) return active.id;
  return createAttempt(user.id, "v1");
}

export async function saveAnswers(attemptId: string, answers: any) {
  const user = await requireActiveMember();
  const active = await getActiveAttempt(user.id);
  if (!active || active.id !== attemptId) throw new Error("Not allowed");
  await saveDraft(user.id, attemptId, answers);
}

export async function submitAssessment(attemptId: string, answers: any) {
  const user = await requireActiveMember();
  const active = await getActiveAttempt(user.id);
  if (!active || active.id !== attemptId) throw new Error("Not allowed");
  return await completeAttempt(user.id, attemptId, answers, "v1");
}

export async function getLatestResult() {
  const user = await requireActiveMember();
  return toStudentAttempt(await getLatestCompleted(user.id));
}
