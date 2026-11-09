"use server";
import { requireAdmin } from "@/lib/dal";
import { upsertPlacement } from "@/lib/student-placement";
import { revalidatePath } from "next/cache";

export async function savePlacementAction(userId: string, formData: FormData) {
  const admin = await requireAdmin();
  await upsertPlacement(userId, {
    instructorLevel: formData.get("instructorLevel"),
    instructorTrack: formData.get("instructorTrack"),
    instructorReason: formData.get("instructorReason"),
  }, admin.id);
  revalidatePath(`/admin/students/${userId}`);
}
