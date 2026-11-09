import "server-only";

import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { lifecycleActive, readAccessAccount } from "./access-context";
import { getAuth, ROLES } from "./auth";
import { getMembership, hasStudentAccess } from "./membership";

/**
 * Data Access Layer. Every authorization check lives here rather than in
 * `proxy.ts`, which only does an optimistic cookie-presence check -- see
 * the Next.js auth guide's "Data Access Layer" section.
 *
 * `cache()` memoises per render pass, so a page and its children can each
 * call these without re-hitting D1.
 */

export const getSession = cache(async () => {
  // `headers()` is awaited first on purpose: it marks the route dynamic before
  // getAuth() touches the Cloudflare context, which does not exist during the
  // build's prerender pass. Reversing these two lines fails `next build`.
  const requestHeaders = await headers();
  return getAuth().api.getSession({ headers: requestHeaders });
});

// React cache is scoped to this server render, not a cross-request authority cache.
const getRequestAccount = cache((userId:string) => readAccessAccount(getCloudflareContext().env.DB,userId));

/** Redirects to /login unless a valid session exists. */
export const requireUser = cache(async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  const account = await getRequestAccount(session.user.id);
  if(!lifecycleActive(account)) redirect("/account-deactivated");
  return { ...session.user, role: account.role ?? ROLES.student };
});

/** Always read the setup requirement from D1, never from a cached session. */
async function isPasswordReady(userId: string): Promise<boolean> {
  const row = await getRequestAccount(userId);
  return !!row && !row.must_change_password;
}

/** Keep requireUser available for the setup page to avoid a redirect loop. */
export const requirePasswordReadyUser = cache(async () => {
  const user = await requireUser();
  if (!(await isPasswordReady(user.id))) redirect("/account/change-password");
  return user;
});

/** API equivalent: errors carry HTTP status without emitting HTML redirects. */
export async function requireMemberApiUser(requestHeaders: Headers) {
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  // Route handlers need one fresh account projection per invocation; never cache it globally.
  const account = await readAccessAccount(getCloudflareContext().env.DB,session.user.id);
  if(!lifecycleActive(account)) throw Object.assign(new Error("Account deactivated or unavailable."),{status:403});
  const user = { ...session.user, role: account.role ?? ROLES.student };
  if (account.must_change_password) {
    throw Object.assign(new Error("Password setup required"), { status: 403 });
  }
  if (user.role !== ROLES.admin && !hasStudentAccess(account)) {
    throw Object.assign(new Error("Active membership required"), { status: 403 });
  }
  return user;
}

/**
 * Redirects non-admins to the student dashboard rather than /login -- they are
 * legitimately signed in, just not staff, and bouncing them to a login form
 * they have already satisfied is a dead end.
 */
export const requireAdmin = cache(async () => {
  const user = await requirePasswordReadyUser();
  if (user.role !== ROLES.admin) redirect("/dashboard");
  return user;
});

/**
 * Gate for member-only content. Access follows the *subscription*, not the
 * role -- a member whose card fails loses content without any role change, and
 * an account with no subscription is worth nothing on its own.
 *
 * Admins pass regardless so staff can view member areas without paying.
 */
export const requireActiveMember = cache(async () => {
  const user = await requirePasswordReadyUser();
  if (user.role === ROLES.admin) return user;

  const membership = await getMembership(user.id);
  if (!hasStudentAccess(membership)) redirect("/join");

  return user;
});
