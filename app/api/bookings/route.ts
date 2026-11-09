import { NextResponse } from "next/server";

import { createBooking } from "@/lib/bookings";
import { listBookingsWithTypes } from "@/lib/bookings";
import { createBookingCheckoutSession } from "@/lib/stripe-bookings";
import { requireAdmin } from "@/lib/dal";

export const dynamic = "force-dynamic";

async function currentOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto =
    h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  if (!host) throw new Error("Could not determine the site address.");
  return `${proto}://${host}`;
}

import { headers } from "next/headers";

/** Public: create a PENDING booking and return Stripe checkout URL. */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      consultationTypeId?: unknown;
      customerName?: unknown;
      customerEmail?: unknown;
      customerPhone?: unknown;
      appointmentAt?: unknown;
      durationMin?: unknown;
      priceCents?: unknown;
      questions?: unknown;
      smsOptedIn?: unknown;
    };
    const {
      consultationTypeId,
      customerName,
      customerEmail,
      customerPhone,
      appointmentAt,
      durationMin,
      priceCents,
      questions,
      smsOptedIn,
    } = body;

    // Server-side validation — never trust browser-supplied price/duration.
    if (!consultationTypeId || typeof consultationTypeId !== "string") {
      return NextResponse.json({ error: "Consultation type is required." }, { status: 400 });
    }
    if (!customerName || typeof customerName !== "string") {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!customerEmail || typeof customerEmail !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!customerPhone || typeof customerPhone !== "string") {
      return NextResponse.json({ error: "Phone is required." }, { status: 400 });
    }
    if (!appointmentAt || typeof appointmentAt !== "string") {
      return NextResponse.json({ error: "Appointment time is required." }, { status: 400 });
    }

    // Re-verify the consultation type server-side to get authoritative price/duration.
    const { getConsultationType } = await import("@/lib/consultation-types");
    const type = await getConsultationType(consultationTypeId);
    if (!type || !type.active) {
      return NextResponse.json({ error: "Consultation type is not available." }, { status: 400 });
    }

    const { bookingId, slotKey } = await createBooking({
      consultationTypeId: type.id,
      customerName,
      customerEmail,
      customerPhone,
      appointmentAt,
      durationMin: type.durationMin,
      priceCents: type.priceCents,
      questions: (questions as Record<string, string>) ?? {},
      smsOptedIn: smsOptedIn === true,
    });

    const origin = await currentOrigin();
    const checkoutUrl = await createBookingCheckoutSession({
      origin,
      bookingId,
      consultationTypeName: type.name,
      durationMin: type.durationMin,
      priceCents: type.priceCents,
      customerEmail,
      customerName,
    });

    return NextResponse.json({
      bookingId,
      slotKey,
      checkoutUrl,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "That appointment slot is no longer available.") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create booking." },
      { status: 500 },
    );
  }
}

/** Admin: list all bookings. */
export async function GET(): Promise<Response> {
  await requireAdmin();
  const bookings = await listBookingsWithTypes();
  return NextResponse.json({ bookings });
}
