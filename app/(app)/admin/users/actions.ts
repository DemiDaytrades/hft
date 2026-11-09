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

/** Request a single-use recovery link without replacing the member’s credential. */
export async function sendMemberPasswordReset(
  userId: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (userId === admin.id) {
    return { ok: false, error: "Use Account → Change password for your own login." };
  }
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const db = getCloudflareContext().env.DB;
    const user = await db
      .prepare(`SELECT email FROM "user" WHERE id = ?;`)
      .bind(userId)
      .first<{ email: string }>();
    if (!user?.email) return { ok: false, error: "Member not found." };

    await getAuth().api.requestPasswordReset({
      body: { email: user.email, redirectTo: "/reset-password" },
      headers: await headers(),
    });
  } catch (error) {
    return failure(error, "Could not send a password reset email.");
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

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function grantComplimentaryAccess(
  userId: string,
  days?: number,
  expiresAt?: string,
  deliveryChannels: ("email" | "sms")[] = ["email"],
): Promise<ActionResult> {
  const admin = await requireAdmin();
  const db = getCloudflareContext().env.DB;
  try {
    const user = await db.prepare('SELECT email FROM user WHERE id=?').bind(userId).first<{ email: string }>();
    if (!user) return { ok: false, error: "Member not found." };
    const { createComplimentaryInvitation } = await import("@/lib/complimentary-invitation");
    await createComplimentaryInvitation(db, { userId: admin.id, role: "admin" }, { email: user.email, days, expiresAt, channels: deliveryChannels });
  } catch (error) { return failure(error, "Could not grant complimentary access."); }
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function revokeComplimentaryAccess(userId: string): Promise<ActionResult> {
  await requireAdmin();
  const db = getCloudflareContext().env.DB;
  const now = new Date().toISOString();
  await db
    .prepare(
      `UPDATE "user"
       SET "complimentaryAccessRevokedAt" = ?, "updatedAt" = ?
       WHERE id = ?;`,
    )
    .bind(now, now, userId)
    .run();
  revalidatePath("/admin/users");
  return { ok: true };
}
