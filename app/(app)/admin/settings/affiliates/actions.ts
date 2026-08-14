"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal";
import { SETTING_KEYS, setSetting } from "@/lib/settings";

export type AffiliateSettingsState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "saved" };

export async function saveAffiliateSettingsAction(
  _prev: AffiliateSettingsState,
  formData: FormData,
): Promise<AffiliateSettingsState> {
  await requireAdmin();

  const percent = Number(String(formData.get("percent") ?? "").trim());
  const holdDays = Number(String(formData.get("holdDays") ?? "").trim());

  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    return { status: "error", message: "Commission must be between 0 and 100." };
  }
  if (!Number.isInteger(holdDays) || holdDays < 0 || holdDays > 90) {
    return {
      status: "error",
      message: "Hold must be a whole number of days between 0 and 90.",
    };
  }

  await setSetting(SETTING_KEYS.defaultCommissionPercent, String(percent));
  await setSetting(SETTING_KEYS.commissionHoldDays, String(holdDays));

  revalidatePath("/admin/settings/affiliates");
  return { status: "saved" };
}
