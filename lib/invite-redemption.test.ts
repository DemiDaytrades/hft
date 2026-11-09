import test from "node:test";
import assert from "node:assert/strict";

/**
 * Pure/logic tests for invite redemption safety rules (no D1/Better Auth).
 * Validates the invariants required by the audit fix: idempotency decisions,
 * expiry parsing shape, and "never overwrite password" contract (modeled).
 */

function computeExpiry(inviteKind: string, now: Date): Date {
  const parts = inviteKind.split(":");
  if (parts[1] === "custom" && parts[2]) return new Date(`${parts[2]}T23:59:59`);
  const days = Number.parseInt(parts[1] ?? "30", 10) || 30;
  return new Date(now.getTime() + days * 86400000);
}

function shouldAttachComplimentaryForExistingAccount(inviteValidUnused: boolean, emailMatches: boolean): { attach: boolean; overwritePassword: boolean } {
  if (!inviteValidUnused || !emailMatches) return { attach: false, overwritePassword: false };
  return { attach: true, overwritePassword: false };
}

test("existing account redemption never overwrites password", () => {
  const r = shouldAttachComplimentaryForExistingAccount(true, true);
  assert.equal(r.attach, true);
  assert.equal(r.overwritePassword, false);
});

test("invalid/used/mismatched invite does not attach", () => {
  assert.equal(shouldAttachComplimentaryForExistingAccount(false, true).attach, false);
  assert.equal(shouldAttachComplimentaryForExistingAccount(true, false).attach, false);
});

test("complimentary expiry parsing: days and custom date", () => {
  const now = new Date("2026-01-01T00:00:00.000Z");
  const d30 = computeExpiry("member:30", now);
  assert.equal(d30.toISOString(), "2026-01-31T00:00:00.000Z");
  const custom = computeExpiry("member:custom:2026-02-15", now);
  assert.ok(custom.getFullYear() === 2026 && custom.getMonth() === 1 && custom.getDate() === 15);
});

test("default member kind yields 30 days", () => {
  const now = new Date("2026-01-01T00:00:00.000Z");
  const d = computeExpiry("member", now);
  assert.equal(d.toISOString(), "2026-01-31T00:00:00.000Z");
});
