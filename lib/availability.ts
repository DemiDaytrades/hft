import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export const BOOKING_TIMEZONE = "America/Chicago";

export type AvailabilityRule = {
  id: string;
  dayOfWeek: number;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  enabled: boolean;
};

export type AvailabilityOverride = {
  id: string;
  date: string; // YYYY-MM-DD
  type: "blocked" | "override";
  startTime: string | null;
  endTime: string | null;
  enabled: boolean;
  reason: string;
};

export type AvailableSlot = {
  start: string; // ISO-8601 in America/Chicago
  end: string; // ISO-8601 in America/Chicago
  available: boolean;
};

function db() {
  return getCloudflareContext().env.DB;
}

/** Convert a local date + HH:MM time to an ISO-8601 string in the booking timezone. */
export function localToIso(dateStr: string, timeStr: string): string {
  // dateStr is YYYY-MM-DD, timeStr is HH:MM
  return `${dateStr}T${timeStr}:00`;
}

/** Parse an ISO-8601 datetime to local date string and time components in the booking tz.
 *  The input string is expected to already be in Chicago local time (constructed
 *  by localToIso), so we split parts directly without UTC conversion. */
export function isoToLocalParts(iso: string): { date: string; time: string } {
  const [datePart, timePart] = iso.split("T");
  return { date: datePart, time: timePart?.split(".")[0] ?? "00:00" };
}

export function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60000).toISOString();
}

export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Current time in minutes since midnight, in America/Chicago timezone. */
export function currentTimeMinutesInChicago(): number {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  const minute = Number(parts.find((p) => p.type === "minute")?.value);
  return hour * 60 + minute;
}

/** Round up minutes to the next 15-minute increment. */
export function roundUpTo15(minutes: number): number {
  return Math.ceil(minutes / 15) * 15;
}

/** Get the local date string (YYYY-MM-DD) in the booking timezone. */
function todayLocal(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  return `${parts.find((p) => p.type === "year")?.value}-${parts.find(
    (p) => p.type === "month",
  )?.value}-${parts.find((p) => p.type === "day")?.value}`;
}

/** Day of week (0=Sunday) for a local date string in the booking timezone. */
export function dayOfWeekFor(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00`).getDay();
}

/** Reap expired slot holds so blocked slots become bookable again.
 *  Idempotent — deleting already-expired holds is a no-op. */
export async function reapExpiredHolds(): Promise<number> {
  const now = new Date().toISOString();
  const result = await db()
    .prepare(
      `DELETE FROM "booking_slot_hold" WHERE expires_at < ?;`,
    )
    .bind(now)
    .run();
  return result.meta?.changes ?? 0;
}
function rowToRule(row: any): AvailabilityRule {
  return {
    id: row.id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
    enabled: row.enabled === 1,
  };
}

/** Get availability rules for a day of week. */
async function getRulesForDay(dayOfWeek: number): Promise<AvailabilityRule[]> {
  const { results } = await db()
    .prepare(
      `SELECT * FROM "availability_rule"
       WHERE day_of_week = ? AND enabled = 1;`,
    )
    .bind(dayOfWeek)
    .all<any>();
  return results.map(rowToRule);
}

/** Get the override for a specific date. */
async function getOverrideForDate(
  dateStr: string,
): Promise<AvailabilityOverride | null> {
  const row = await db()
    .prepare(
      `SELECT * FROM "availability_override"
       WHERE date = ? AND enabled = 1;`,
    )
    .bind(dateStr)
    .first<any>();
  if (!row) return null;
  return {
    id: row.id,
    date: row.date,
    type: row.type,
    startTime: row.start_time,
    endTime: row.end_time,
    enabled: row.enabled === 1,
    reason: row.reason,
  };
}

/** Get confirmed or pending bookings for a date, to check slot overlaps. */
async function getBookingsForDate(
  dateStr: string,
): Promise<{ start: string; end: string }[]> {
  const { results } = await db()
    .prepare(
      `SELECT appointment_at, duration_min FROM "consultation_booking"
       WHERE status IN ('pending', 'confirmed')
         AND date(appointment_at) = ?;`,
    )
    .bind(dateStr)
    .all<{ appointment_at: string; duration_min: number }>();
  return results.map((r) => ({
    start: r.appointment_at,
    end: addMinutes(r.appointment_at, r.duration_min),
  }));
}

/** Does a candidate slot [slotStart, slotStart + duration) overlap any existing booking? */
export function overlaps(
  slotStart: string,
  durationMin: number,
  existing: { start: string; end: string }[],
): boolean {
  const slotEnd = addMinutes(slotStart, durationMin);
  return existing.some((b) => slotStart < b.end && slotEnd > b.start);
}

/**
 * Generate available slots for a date.
 *
 * Slots start every 15 minutes from the day's start to end. A slot is offered
 * only if the full consultation duration fits before the day's end and does not
 * overlap an existing confirmed or pending booking.
 *
 * All times are interpreted in America/Chicago.
 */
export async function generateAvailableSlots(
  dateStr: string,
  durationMin: number,
): Promise<AvailableSlot[]> {
  // Reject past dates.
  const today = todayLocal();
  if (dateStr < today) return [];

  const override = await getOverrideForDate(dateStr);
  let startTime: string | null;
  let endTime: string | null;

  if (override) {
    if (override.type === "blocked") return [];
    startTime = override.startTime ?? null;
    endTime = override.endTime ?? null;
    if (!startTime || !endTime) return [];
  } else {
    const dow = dayOfWeekFor(dateStr);
    const rules = await getRulesForDay(dow);
    if (rules.length === 0) return [];
    // Use the earliest start and latest end across rules for that day.
    // (Multiple rules per day are possible but unique index prevents duplicates;
    // we merge conservatively.)
    startTime = rules
      .map((r) => r.startTime)
      .reduce((a, b) => (a < b ? a : b));
    endTime = rules.map((r) => r.endTime).reduce((a, b) => (a > b ? a : b));
  }

  const startMin = timeToMinutes(startTime!);
  const endMin = timeToMinutes(endTime!);
  if (endMin <= startMin) return [];

  // Same-day rule: require at least 30 minutes advance notice.
  // Only slots starting at or after roundUpTo15(now + 30min) are offered.
  let minStartMin = startMin;
  if (dateStr === today) {
    const nowMinutes = currentTimeMinutesInChicago();
    minStartMin = Math.max(startMin, roundUpTo15(nowMinutes + 30));
    if (minStartMin > endMin) return [];
  }

  const existing = await getBookingsForDate(dateStr);
  const slots: AvailableSlot[] = [];

  // Reap expired holds so blocked slots become bookable again.
  await reapExpiredHolds();

  for (
    let m = minStartMin;
    m + durationMin <= endMin;
    m += 15
  ) {
    const slotStart = localToIso(dateStr, minutesToTime(m));
    const slotEnd = addMinutes(slotStart, durationMin);
    const available = !overlaps(slotStart, durationMin, existing);
    slots.push({ start: slotStart, end: slotEnd, available });
  }

  return slots;
}

/** Check whether a specific appointment datetime + duration is available. */
export async function isSlotAvailable(
  appointmentAt: string,
  durationMin: number,
): Promise<boolean> {
  const { date, time } = isoToLocalParts(appointmentAt);
  const today = todayLocal();
  if (date < today) return false;

  // Same-day rule: require at least 30 minutes advance notice.
  if (date === today) {
    const nowMinutes = currentTimeMinutesInChicago();
    const minStartMin = roundUpTo15(nowMinutes + 30);
    const slotStartMin = timeToMinutes(time);
    if (slotStartMin < minStartMin) return false;
  }

  const override = await getOverrideForDate(date);
  if (override && override.type === "blocked") return false;

  let startTime: string | null;
  let endTime: string | null;

  if (override && override.type === "override") {
    startTime = override.startTime ?? null;
    endTime = override.endTime ?? null;
  } else {
    const dow = dayOfWeekFor(date);
    const rules = await getRulesForDay(dow);
    if (rules.length === 0) return false;
    startTime = rules
      .map((r) => r.startTime)
      .reduce((a, b) => (a < b ? a : b));
    endTime = rules.map((r) => r.endTime).reduce((a, b) => (a > b ? a : b));
  }
  if (!startTime || !endTime) return false;

  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);
  const slotStartMin = timeToMinutes(time);
  if (slotStartMin < startMin || slotStartMin + durationMin > endMin)
    return false;

  // Reap expired holds so blocked slots become bookable again.
  await reapExpiredHolds();

  const existing = await getBookingsForDate(date);
  return !overlaps(appointmentAt, durationMin, existing);
}
