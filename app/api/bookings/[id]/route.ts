import { NextResponse } from "next/server";

import {
  getBooking,
  updateBooking,
  type UpdateBookingInput,
} from "@/lib/bookings";
import { requireAdmin } from "@/lib/dal";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  await requireAdmin();
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  return NextResponse.json({ booking });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  await requireAdmin();
  const { id } = await params;

  try {
    const body = (await request.json()) as {
      status?: string;
      outcome?: string;
      adminNotes?: string;
    };
    const input: UpdateBookingInput = {};
    if (body.status) input.status = body.status as UpdateBookingInput["status"];
    if (body.outcome)
      input.outcome = body.outcome as UpdateBookingInput["outcome"];
    if (body.adminNotes !== undefined) input.adminNotes = body.adminNotes;

    const booking = await updateBooking(id, input);
    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update booking." },
      { status: 500 },
    );
  }
}
