/** Shared, browser-safe entitlement predicates. D1 remains the source of state. */
export type MembershipAccess = {
  lifecycle_status?: "ACTIVE" | "DEACTIVATED" | null;
  subscriptionStatus?: string | null;
  complimentaryAccessStartsAt?: string | null;
  complimentaryAccessExpiresAt?: string | null;
  complimentaryAccessRevokedAt?: string | null;
};

export const ACTIVE_STATUSES = ["active", "trialing"] as const;

export function isActive(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}

export function isComplimentaryActive(m: MembershipAccess | null | undefined, now = Date.now()): boolean {
  if (!m?.complimentaryAccessExpiresAt || m.complimentaryAccessRevokedAt) return false;
  const expiry = Date.parse(m.complimentaryAccessExpiresAt);
  const start = m.complimentaryAccessStartsAt ? Date.parse(m.complimentaryAccessStartsAt) : null;
  return Number.isFinite(expiry) && expiry > now &&
    (start === null || (Number.isFinite(start) && start <= now));
}

export function hasStudentAccess(m: MembershipAccess | null | undefined, now = Date.now()): boolean {
  if (m?.lifecycle_status && m.lifecycle_status !== "ACTIVE") return false;
  return isActive(m?.subscriptionStatus) || isComplimentaryActive(m, now);
}

export function membershipLabel(m: MembershipAccess | null | undefined, now = Date.now()): string {
  if (m?.lifecycle_status === "DEACTIVATED") return "Former student";
  if (isActive(m?.subscriptionStatus)) return m?.subscriptionStatus === "trialing" ? "Paid membership (trial)" : "Paid membership";
  return isComplimentaryActive(m, now) ? "Complimentary access" : "Inactive";
}
