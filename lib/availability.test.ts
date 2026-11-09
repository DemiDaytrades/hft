import { describe, it } from "node:test";
import assert from "node:assert";
import {
  timeToMinutes,
  minutesToTime,
  addMinutes,
  overlaps,
  BOOKING_TIMEZONE,
} from "@/lib/availability";

// ── Pure availability logic tests ──

describe("availability calculations", () => {
  it("timeToMinutes converts HH:MM to minutes", () => {
    assert.strictEqual(timeToMinutes("00:00"), 0);
    assert.strictEqual(timeToMinutes("09:30"), 570);
    assert.strictEqual(timeToMinutes("17:00"), 1020);
    assert.strictEqual(timeToMinutes("23:59"), 1439);
  });

  it("minutesToTime converts minutes to HH:MM", () => {
    assert.strictEqual(minutesToTime(0), "00:00");
    assert.strictEqual(minutesToTime(570), "09:30");
    assert.strictEqual(minutesToTime(1020), "17:00");
    assert.strictEqual(minutesToTime(1439), "23:59");
  });

  it("addMinutes advances an ISO timestamp", () => {
    const base = "2026-01-15T09:00:00";
    const plus30 = addMinutes(base, 30);
    assert.strictEqual(plus30, "2026-01-15T09:30:00.000Z");
  });

  it("overlaps detects intersecting slots", () => {
    const iso = (time: string) => `2026-01-15T${time}:00.000Z`;
    const existing = [{ start: iso("10:00"), end: iso("10:30") }];
    // Before
    assert.strictEqual(overlaps(iso("09:00"), 30, existing), false);
    // Touching end (not overlapping)
    assert.strictEqual(overlaps(iso("09:30"), 30, existing), false);
    // Inside existing
    assert.strictEqual(overlaps(iso("10:10"), 10, existing), true);
    // Overlapping start
    assert.strictEqual(overlaps(iso("10:20"), 20, existing), true);
    // Existing inside new
    assert.strictEqual(overlaps(iso("09:50"), 40, existing), true);
  });

  it("BOOKING_TIMEZONE is America/Chicago", () => {
    assert.strictEqual(BOOKING_TIMEZONE, "America/Chicago");
  });
});
