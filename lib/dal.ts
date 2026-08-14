import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAuth, ROLES } from "./auth";
import { getMembership, isActive } from "./membership";

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

/** Redirects to /login unless a valid session exists. */
export const requireUser = cache(async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  return session.user;
});

/**
 * Redirects non-admins to the student dashboard rather than /login -- they are
 * legitimately signed in, just not staff, and bouncing them to a login form
 * they have already satisfied is a dead end.
 */
export const requireAdmin = cache(async () => {
  const user = await requireUser();
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
  const user = await requireUser();
  if (user.role === ROLES.admin) return user;

  const membership = await getMembership(user.id);
  if (!isActive(membership?.subscriptionStatus)) redirect("/join");

  return user;
});
