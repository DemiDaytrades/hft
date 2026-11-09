import { NextResponse } from "next/server";
import { requireActiveMember } from "@/lib/dal";
import { getMembership } from "@/lib/membership";
import { getConsultationType } from "@/lib/consultation-types";
import { createMemberBooking, getActiveBookingForUser } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireActiveMember();
    await getMembership(user.id);
    const booking = await getActiveBookingForUser(user.id);
    return NextResponse.json({ booking });
  } catch (e) {
    if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) {
      throw e;
    }
    return NextResponse.json({ error: "Active HFT membership required." }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireActiveMember();
    await getMembership(user.id);

    const body = await request.json() as {
      appointmentAt?: string;
    };
    const { appointmentAt } = body;

    if (!appointmentAt || typeof appointmentAt !== "string") {
      return NextResponse.json({ error: "Appointment time is required." }, { status: 400 });
    }

    const type = await getConsultationType("strategy");
    if (!type || !type.active) {
      return NextResponse.json({ error: "Consultation type not available." }, { status: 400 });
    }

    const booking = await createMemberBooking({
      consultationTypeId: type.id,
      customerName: user.name || user.email,
      customerEmail: user.email,
      customerPhone: "",
      appointmentAt,
      durationMin: type.durationMin,
      questions: {},
      userId: user.id,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) {
      throw e;
    }
    if (e instanceof Error && e.message.includes("slot is no longer available")) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    if (e instanceof Error && e.message.includes("already have")) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "Active HFT membership required." }, { status: 403 });
  }
}
