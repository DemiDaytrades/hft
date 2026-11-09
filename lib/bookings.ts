import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isSlotAvailable } from "./availability";

export type ConsultationBooking = {
  id: string;
  consultationTypeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentAt: string; // ISO-8601 in America/Chicago
  durationMin: number;
  priceCents: number;
  status: "pending" | "confirmed" | "cancelled" | "no-show" | "completed";
  outcome:
    | "not-set"
    | "joined-hft"
    | "follow-up"
    | "needs-more-time"
    | "not-interested";
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  adminNotes: string;
  questions: Record<string, string>;
  smsOptedIn: boolean;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingInput = {
  consultationTypeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentAt: string;
  durationMin: number;
  priceCents: number;
  questions: Record<string, string>;
  smsOptedIn: boolean;
  userId?: string | null;
};

export type UpdateBookingInput = {
  status?: ConsultationBooking["status"];
  outcome?: ConsultationBooking["outcome"];
  adminNotes?: string;
};

function db() {
  return getCloudflareContext().env.DB;
}

function newId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function nowIso(): string {
  return new Date().toISOString();
}

function rowToBooking(row: any): ConsultationBooking {
  return {
    id: row.id,
    consultationTypeId: row.consultation_type_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    appointmentAt: row.appointment_at,
    durationMin: row.duration_min,
    priceCents: row.price_cents,
    status: row.status as ConsultationBooking["status"],
    outcome: row.outcome as ConsultationBooking["outcome"],
    stripeSessionId: row.stripe_session_id ?? null,
    stripePaymentIntentId: row.stripe_payment_intent_id ?? null,
    adminNotes: row.admin_notes,
    questions: row.questions ? JSON.parse(row.questions) : {},
    smsOptedIn: row.sms_opted_in === 1,
    userId: row.user_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Create a PENDING booking and a temporary slot hold. Returns the booking id. */
export async function createBooking(
  input: CreateBookingInput,
): Promise<{ bookingId: string; slotKey: string }> {
  const id = newId();
  const now = nowIso();
  const slotKey = `${input.appointmentAt}:${input.consultationTypeId}`;

  // Final server-side availability check before writing.
  const available = await isSlotAvailable(
    input.appointmentAt,
    input.durationMin,
  );
  if (!available) {
    throw new Error("That appointment slot is no longer available.");
  }

  await db().batch([
    db()
      .prepare(
        `INSERT INTO "consultation_booking"
           (id, consultation_type_id, customer_name, customer_email, customer_phone,
            appointment_at, duration_min, price_cents, status, outcome, stripe_session_id,
            stripe_payment_intent_id, admin_notes, questions, sms_opted_in, user_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'not-set', NULL, NULL, '', ?, ?, ?, ?, ?);`,
      )
      .bind(
        id,
        input.consultationTypeId,
        input.customerName,
        input.customerEmail,
        input.customerPhone,
        input.appointmentAt,
        input.durationMin,
        input.priceCents,
        JSON.stringify(input.questions),
        input.smsOptedIn ? 1 : 0,
        input.userId ?? null,
        now,
        now,
      ),
    db()
      .prepare(
        `INSERT INTO "booking_slot_hold"
           (id, booking_id, slot_key, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?);`,
      )
      .bind(
        newId(),
        id,
        slotKey,
        new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15-minute hold
        now,
      ),
  ]);

  return { bookingId: id, slotKey };
}

/** Get a booking by id. */
export async function getBooking(
  id: string,
): Promise<ConsultationBooking | null> {
  const row = await db()
    .prepare(`SELECT * FROM "consultation_booking" WHERE id = ?;`)
    .bind(id)
    .first<ConsultationBooking>();
  if (!row) return null;
  return rowToBooking(row);
}

/** Get a booking by Stripe session id. */
export async function getBookingByStripeSession(
  stripeSessionId: string,
): Promise<ConsultationBooking | null> {
  const row = await db()
    .prepare(
      `SELECT * FROM "consultation_booking" WHERE stripe_session_id = ?;`,
    )
    .bind(stripeSessionId)
    .first<ConsultationBooking>();
  if (!row) return null;
  return rowToBooking(row);
}

/** Confirm a PENDING booking after Stripe webhook verifies payment. */
export async function confirmBooking(
  bookingId: string,
  stripeSessionId: string,
  stripePaymentIntentId: string,
): Promise<ConsultationBooking> {
  const booking = await getBooking(bookingId);
  if (!booking) throw new Error("Booking not found.");
  if (booking.status !== "pending") {
    throw new Error(`Booking is already ${booking.status}.`);
  }

  await db().batch([
    db()
      .prepare(
        `UPDATE "consultation_booking"
         SET status = 'confirmed',
             stripe_session_id = ?,
             stripe_payment_intent_id = ?,
             updated_at = ?
         WHERE id = ? AND status = 'pending';`,
      )
      .bind(stripeSessionId, stripePaymentIntentId, nowIso(), bookingId),
    db()
      .prepare(
        `DELETE FROM "booking_slot_hold" WHERE booking_id = ?;`,
      )
      .bind(bookingId),
  ]);

  const confirmed = await getBooking(bookingId);
  if (!confirmed) throw new Error("Booking not found after confirmation.");
  return confirmed;
}

/** Cancel a booking (admin or system). Releases any slot hold. */
export async function cancelBooking(bookingId: string): Promise<void> {
  await db().batch([
    db()
      .prepare(
        `UPDATE "consultation_booking"
         SET status = 'cancelled', updated_at = ?
         WHERE id = ?;`,
      )
      .bind(nowIso(), bookingId),
    db()
      .prepare(
        `DELETE FROM "booking_slot_hold" WHERE booking_id = ?;`,
      )
      .bind(bookingId),
  ]);
}

/** List bookings with optional status filter (admin view). */
export async function listBookings(
  status?: ConsultationBooking["status"],
): Promise<ConsultationBooking[]> {
  let query = `SELECT * FROM "consultation_booking"`;
  const binds: unknown[] = [];
  if (status) {
    query += ` WHERE status = ?`;
    binds.push(status);
  }
  query += ` ORDER BY appointment_at DESC;`;

  const { results } = await db().prepare(query).bind(...binds).all();
  return results.map(rowToBooking);
}

/** Admin update: status, outcome, notes. Does NOT touch Stripe fields. */
export async function updateBooking(
  id: string,
  input: UpdateBookingInput,
): Promise<ConsultationBooking> {
  const existing = await getBooking(id);
  if (!existing) throw new Error("Booking not found.");

  const now = nowIso();
  await db()
    .prepare(
      `UPDATE "consultation_booking"
       SET status = COALESCE(?, status),
           outcome = COALESCE(?, outcome),
           admin_notes = COALESCE(?, admin_notes),
           updated_at = ?
       WHERE id = ?;`,
    )
    .bind(
      input.status ?? null,
      input.outcome ?? null,
      input.adminNotes ?? null,
      now,
      id,
    )
    .run();

  const updated = await getBooking(id);
  if (!updated) throw new Error("Booking not found after update.");
  return updated;
}

/** Reap expired slot holds (callable from a cron or on-demand). */
export async function reapExpiredHolds(): Promise<number> {
  const now = nowIso();
  const result = await db()
    .prepare(
      `DELETE FROM "booking_slot_hold" WHERE expires_at < ?;`,
    )
    .bind(now)
    .run();
  return result.meta?.changes ?? 0;
}

/** Get all bookings for admin list with consultation type name. */
export type BookingSummary = ConsultationBooking & {
  consultationTypeName: string;
};

export async function listBookingsWithTypes(): Promise<BookingSummary[]> {
  const { results } = await db()
    .prepare(
      `SELECT b.*, ct.name AS consultation_type_name
       FROM "consultation_booking" b
       JOIN "consultation_type" ct ON ct.id = b.consultation_type_id
       ORDER BY b.appointment_at DESC;`,
    )
    .all<BookingSummary & { consultation_type_name: string }>();
  return results.map((r) => ({
    ...rowToBooking(r),
    consultationTypeName: r.consultation_type_name,
  }));
}


/** Get the most recent active (pending/confirmed) booking for a user. */
export async function getActiveBookingForUser(
  userId: string,
): Promise<ConsultationBooking | null> {
  const row = await db()
    .prepare(
      `SELECT * FROM "consultation_booking"
       WHERE user_id = ? AND status IN ('pending', 'confirmed')
       ORDER BY appointment_at ASC
       LIMIT 1;`,
    )
    .bind(userId)
    .first<any>();
  if (!row) return null;
  return rowToBooking(row);
}

/** Get all active bookings for a user (to be safe). */
export async function listActiveBookingsForUser(
  userId: string,
): Promise<ConsultationBooking[]> {
  const { results } = await db()
    .prepare(
      `SELECT * FROM "consultation_booking"
       WHERE user_id = ? AND status IN ('pending', 'confirmed')
       ORDER BY appointment_at ASC;`,
    )
    .bind(userId)
    .all<any>();
  return results.map(rowToBooking);
}

/** Create a confirmed booking for a member with $0 charge, no Stripe checkout. */
export async function createMemberBooking(input: {
  consultationTypeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentAt: string;
  durationMin: number;
  questions?: Record<string, string>;
  userId: string;
}): Promise<ConsultationBooking> {
  const id = newId();
  const now = nowIso();
  const slotKey = `${input.appointmentAt}:${input.consultationTypeId}`;

  const available = await isSlotAvailable(input.appointmentAt, input.durationMin);
  if (!available) {
    throw new Error("That appointment slot is no longer available.");
  }

  // Check for existing active booking
  const existing = await getActiveBookingForUser(input.userId);
  if (existing) {
    throw new Error("You already have an active HFT Strategy Consultation booking.");
  }

  await db().batch([
    db()
      .prepare(
        `INSERT INTO "consultation_booking"
           (id, consultation_type_id, customer_name, customer_email, customer_phone,
            appointment_at, duration_min, price_cents, status, outcome, stripe_session_id,
            stripe_payment_intent_id, admin_notes, questions, sms_opted_in, user_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'confirmed', 'not-set', NULL, NULL, '', ?, 0, ?, ?, ?);`,
      )
      .bind(
        id,
        input.consultationTypeId,
        input.customerName,
        input.customerEmail,
        input.customerPhone,
        input.appointmentAt,
        input.durationMin,
        JSON.stringify(input.questions ?? {}),
        input.userId,
        now,
        now,
      ),
    db()
      .prepare(
        `INSERT INTO "booking_slot_hold"
           (id, booking_id, slot_key, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?);`,
      )
      .bind(newId(), id, slotKey, now, now), // expired hold to block slot
  ]);

  const booking = await getBooking(id);
  if (!booking) throw new Error("Booking failed to create.");
  return booking;
}
