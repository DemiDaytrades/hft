"use server";
import { requireAdmin } from "@/lib/dal";
import { upsertPlan } from "@/lib/training-plan";
import { revalidatePath } from "next/cache";

export async function saveTrainingPlanAction(userId: string, formData: FormData) {
  await requireAdmin();
  const d: any = {};
  for (const [k, v] of formData.entries()) {
    if (k.startsWith("$ACTION_")) continue;
    if (k.endsWith("[]")) { const key = k.slice(0, -2); d[key] = d[key] ? [...d[key], v] : [v]; }
    else d[k] = v;
  }
  const status = String(formData.get("status") ?? "draft");
  await upsertPlan(userId, d, status, "admin");
  revalidatePath(`/admin/students/${userId}`);
  revalidatePath(`/admin/students/${userId}/training-plan`);
}
