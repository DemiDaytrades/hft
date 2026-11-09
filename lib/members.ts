import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import { ROLES } from "./auth";

/**
 * Read queries for the admin area.
 *
 * Reads go straight to D1 (cheap, and already gated by `requireAdmin()` in the
 * page). Mutations go through Better Auth's admin API instead -- see
 * app/(app)/admin/users/actions.ts -- so its permission checks and side effects
 * (session revocation on ban, etc.) run.
 *
 * Better Auth stores `date` columns as ISO-8601 strings on SQLite
 * (supportsDates: false), so string comparison is a valid date range filter.
 */

function db() {
  return getCloudflareContext().env.DB;
}

export type Member = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: number;
  role: string | null;
  banned: number | null;
  banReason: string | null;
  createdAt: string;
  subscriptionStatus: string | null;
  lifecycle_status: "ACTIVE" | "DEACTIVATED";
  lifecycle_changed_at: string | null;
  complimentaryAccessExpiresAt: string | null;
  complimentaryAccessRevokedAt: string | null;
};

export type MemberStats = {
  total: number;
  admins: number;
  students: number;
  banned: number;
  newThisWeek: number;
};

export async function getMemberStats(): Promise<MemberStats> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const row = await db()
    .prepare(
      `SELECT
         COUNT(*)                                                  AS total,
         SUM(CASE WHEN role = ?            THEN 1 ELSE 0 END)      AS admins,
         SUM(CASE WHEN role IS NULL OR role <> ? THEN 1 ELSE 0 END) AS students,
         SUM(CASE WHEN banned = 1          THEN 1 ELSE 0 END)      AS banned,
         SUM(CASE WHEN "createdAt" >= ?    THEN 1 ELSE 0 END)      AS newThisWeek
       FROM "user"`,
    )
    .bind(ROLES.admin, ROLES.admin, weekAgo)
    .first<MemberStats>();

  return (
    row ?? { total: 0, admins: 0, students: 0, banned: 0, newThisWeek: 0 }
  );
}

export async function getRecentMembers(limit = 8): Promise<Member[]> {
const { results } = await db()
    .prepare(
      `SELECT id, name, email, "emailVerified", role, banned, "banReason", "createdAt",
              "lifecycle_status", "lifecycle_changed_at", "subscriptionStatus", "complimentaryAccessExpiresAt", "complimentaryAccessRevokedAt"
        FROM "user"
        WHERE lifecycle_status = 'ACTIVE'
        ORDER BY "createdAt" DESC
        LIMIT ?`,
    )
    .bind(limit)
    .all<Member>();

  return results;
}

export type MemberPage = {
  members: Member[];
  total: number;
  page: number;
  pageCount: number;
};

const PAGE_SIZE = 25;

/** Paginated member list with an optional name/email search. */
export async function listMembers({
  search = "",
  page = 1,
  lifecycle = "active",
  roleFilter = "students",
}: {
  search?: string;
  page?: number;
  lifecycle?: "active" | "former";
  roleFilter?: "students" | "staff";
} = {}): Promise<MemberPage> {
  const term = search.trim();
  // LIKE with a leading wildcard cannot use an index, but the member table is
  // small (hundreds, not millions) so a scan is fine here.
  const state = lifecycle === "former" ? "DEACTIVATED" : "ACTIVE";
  const where = `WHERE lifecycle_status = ? AND ${roleFilter === "staff" ? "role = 'admin'" : "COALESCE(role,'student') <> 'admin'"}${term ? " AND (name LIKE ? OR email LIKE ?)" : ""}`;
  const like = `%${term}%`;

  const countStmt = db().prepare(
    `SELECT COUNT(*) AS n FROM "user" ${where}`,
  );
  const countRow = await (
    term ? countStmt.bind(state, like, like) : countStmt.bind(state)
  ).first<{ n: number }>();
  const total = countRow?.n ?? 0;

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount);
  const offset = (current - 1) * PAGE_SIZE;

  const listStmt = db().prepare(
    `SELECT id, name, email, "emailVerified", role, banned, "banReason", "createdAt",
            "lifecycle_status", "lifecycle_changed_at", "subscriptionStatus", "complimentaryAccessExpiresAt", "complimentaryAccessRevokedAt"
     FROM "user"
     ${where}
     ORDER BY "createdAt" DESC
     LIMIT ? OFFSET ?`,
  );

  const { results } = await (term
    ? listStmt.bind(state, like, like, PAGE_SIZE, offset)
    : listStmt.bind(state, PAGE_SIZE, offset)
  ).all<Member>();

  return { members: results, total, page: current, pageCount };
}
