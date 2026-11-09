"use server";
import { requireAdmin } from "@/lib/dal";
import { createDraft, saveDraft, completeIntake, getLatestIntake } from "@/lib/student-intake";
import { revalidatePath } from "next/cache";

export async function saveDraftAction(userId: string, intakeId: string | null, data: any) {
  const admin = await requireAdmin();
  let id = intakeId;
  if (!id) {
    const d = await createDraft(userId, admin.id);
    id = d.id;
  }
  id = await saveDraft(id, data, userId, admin.id);
  revalidatePath(`/admin/students/${userId}`);
  return { ok: true, intakeId: id };
}

export async function completeIntakeAction(userId: string, intakeId: string, data: any) {
  const admin = await requireAdmin();
  const savedId = await saveDraft(intakeId, data, userId, admin.id);
  await completeIntake(savedId, userId);
  revalidatePath(`/admin/students/${userId}`);
  return { ok: true };
}
