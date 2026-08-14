"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal";
import { changePrice, migrateExistingMembers } from "@/lib/pricing";
import { friendlyStripeError } from "@/lib/stripe";

export type PriceState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "changed"; newPriceCents: number };

export type MigrateState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "progress"; migrated: number; remaining: number; done: boolean };

export async function changePriceAction(
  _prev: PriceState,
  formData: FormData,
): Promise<PriceState> {
  await requireAdmin();

  const dollars = Number(String(formData.get("price") ?? "").replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(dollars) || dollars <= 0) {
    return { status: "error", message: "Enter a price, like 175." };
  }

  const cents = Math.round(dollars * 100);

  try {
    const price = await changePrice(cents);
    revalidatePath("/admin/settings/pricing");
    revalidatePath("/join");
    return { status: "changed", newPriceCents: price.unit_amount ?? cents };
  } catch (error) {
    return { status: "error", message: friendlyStripeError(error) };
  }
}

export async function migrateMembersAction(
  _prev: MigrateState,
  _formData: FormData,
): Promise<MigrateState> {
  await requireAdmin();

  try {
    const progress = await migrateExistingMembers();
    revalidatePath("/admin/settings/pricing");
    return { status: "progress", ...progress };
  } catch (error) {
    return { status: "error", message: friendlyStripeError(error) };
  }
}
