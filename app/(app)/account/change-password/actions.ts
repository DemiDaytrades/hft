"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAuth } from "@/lib/auth";

const MIN_PASSWORD_LENGTH = 8;

export type ChangePasswordState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

/**
 * Server action for the forced first-login password change.
 *
 * Verifies the current (temporary) password through Better Auth's
 * changePassword endpoint; the shared auth hook clears setup after success.
 * After success the user is redirected to
 * /dashboard.
 */
export async function changePasswordAction(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      status: "error",
      message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  if (newPassword !== confirmPassword) {
    return { status: "error", message: "New passwords do not match." };
  }
  if (newPassword === currentPassword) {
    return {
      status: "error",
      message: "New password must be different from the current one.",
    };
  }

  try {
    await getAuth().api.changePassword({
      body: { currentPassword, newPassword, revokeOtherSessions: true },
      headers: await headers(),
    });
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not change password.",
    };
  }

  redirect("/dashboard");
  return { status: "success" };
}
