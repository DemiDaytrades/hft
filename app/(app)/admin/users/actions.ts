"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { getAuth, ROLES } from "@/lib/auth";
import { requireAdmin } from "@/lib/dal";

/**
 * Mutations go through Better Auth's admin API rather than raw SQL so its own
 * permission checks and side effects run -- banning a user also revokes their
 * live sessions, which a plain UPDATE would not do.
 *
 * Every action re-asserts `requireAdmin()`: server actions are public HTTP
 * endpoints, so the page-level check is not sufficient on its own.
 */

type ActionResult = { ok: true } | { ok: false; error: string };

function failure(error: unknown, fallback: string): ActionResult {
  const message = error instanceof Error ? error.message : fallback;
  return { ok: false, error: message };
}

export async function setUserRole(
  userId: string,
  role: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  if (userId === admin.id) {
    return { ok: false, error: "You cannot change your own role." };
  }
  if (role !== ROLES.admin && role !== ROLES.student) {
    return { ok: false, error: `Unknown role "${role}".` };
  }

  try {
    await getAuth().api.setRole({
      body: { userId, role },
      headers: await headers(),
    });
  } catch (error) {
    return failure(error, "Could not update role.");
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true };
}

/**
 * Sets a member's password directly.
 *
 * This is the recovery path while the site has no email: someone locked out
 * tells the owner, she sets a new password here and passes it on. Goes through
 * Better Auth's admin API so the hash format matches what sign-in expects and
 * its own permission check runs.
 */
export async function setMemberPassword(
  userId: string,
  newPassword: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  if (newPassword.length < 12) {
    return { ok: false, error: "Password must be at least 12 characters." };
  }
  if (userId === admin.id) {
    return {
      ok: false,
      error: "Use Account → Change password for your own login.",
    };
  }

  try {
    await getAuth().api.setUserPassword({
      body: { userId, newPassword },
      headers: await headers(),
    });
  } catch (error) {
    return failure(error, "Could not set that password.");
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserBanned(
  userId: string,
  banned: boolean,
  reason?: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  if (userId === admin.id) {
    return { ok: false, error: "You cannot ban yourself." };
  }

  const api = getAuth().api;
  const requestHeaders = await headers();

  try {
    if (banned) {
      await api.banUser({
        body: { userId, banReason: reason || "Violated community guidelines" },
        headers: requestHeaders,
      });
    } else {
      await api.unbanUser({ body: { userId }, headers: requestHeaders });
    }
  } catch (error) {
    return failure(error, "Could not update ban status.");
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true };
}
