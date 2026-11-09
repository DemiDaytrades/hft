import test from "node:test";
import assert from "node:assert/strict";
import { hasStudentAccess, isComplimentaryActive, membershipLabel } from "./membership-access";

const now = Date.parse("2026-11-07T12:00:00Z");
test("complimentary expiry, revocation, and future start deny access", () => {
  assert.equal(isComplimentaryActive({ complimentaryAccessExpiresAt: "2026-11-08T12:00:00Z" }, now), true);
  assert.equal(isComplimentaryActive({ complimentaryAccessExpiresAt: "2026-11-07T12:00:00Z" }, now), false);
  assert.equal(isComplimentaryActive({ complimentaryAccessExpiresAt: "invalid" }, now), false);
  assert.equal(isComplimentaryActive({ complimentaryAccessExpiresAt: "2026-12-01", complimentaryAccessRevokedAt: "2026-11-06" }, now), false);
  assert.equal(isComplimentaryActive({ complimentaryAccessExpiresAt: "2026-12-01", complimentaryAccessStartsAt: "2026-11-09" }, now), false);
});
test("paid and trialing access survive revoked or expired complimentary grants", () => {
  assert.equal(hasStudentAccess({ subscriptionStatus: "active", complimentaryAccessRevokedAt: "2026-11-06" }, now), true);
  assert.equal(hasStudentAccess({ subscriptionStatus: "trialing", complimentaryAccessExpiresAt: "2026-01-01" }, now), true);
  assert.equal(hasStudentAccess({ subscriptionStatus: "past_due", complimentaryAccessExpiresAt: "2026-12-01" }, now), true);
  assert.equal(hasStudentAccess({ subscriptionStatus: "canceled" }, now), false);
});
test("membership labels use the same entitlement rules as access", () => {
  assert.equal(membershipLabel({ subscriptionStatus: "trialing" }, now), "Paid membership (trial)");
  assert.equal(membershipLabel({ complimentaryAccessExpiresAt: "2026-12-01" }, now), "Complimentary access");
  assert.equal(membershipLabel({ complimentaryAccessExpiresAt: "2026-01-01" }, now), "Inactive");
  assert.equal(membershipLabel({ complimentaryAccessExpiresAt: "2026-12-01", complimentaryAccessRevokedAt: "2026-11-06" }, now), "Inactive");
});
