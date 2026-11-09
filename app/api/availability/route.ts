import { NextResponse } from "next/server";

import { generateAvailableSlots } from "@/lib/availability";

export const dynamic = "force-dynamic";

/** Public: get available slots for a date and duration. */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const durationMin = searchParams.get("durationMin");

  if (!date) {
    return NextResponse.json({ error: "Date is required." }, { status: 400 });
  }
  const duration = Number.parseInt(durationMin ?? "", 10);
  if (!duration || duration <= 0) {
    return NextResponse.json({ error: "Valid durationMin is required." }, { status: 400 });
  }

  const slots = await generateAvailableSlots(date, duration);
  return NextResponse.json({ slots });
}
