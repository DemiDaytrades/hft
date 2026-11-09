import { NextResponse } from "next/server";

import { listConsultationTypes, createConsultationType } from "@/lib/consultation-types";
import { requireAdmin } from "@/lib/dal";

export const dynamic = "force-dynamic";

/** Public: list active consultation types. */
export async function GET(): Promise<Response> {
  const types = await listConsultationTypes();
  return NextResponse.json({ types });
}

/** Admin: create a new consultation type. */
export async function POST(request: Request): Promise<Response> {
  await requireAdmin();

  try {
    const body = (await request.json()) as {
      name?: unknown;
      description?: unknown;
      durationMin?: unknown;
      priceCents?: unknown;
      active?: unknown;
      displayOrder?: unknown;
    };
    const { name, description, durationMin, priceCents, active, displayOrder } =
      body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (
      typeof durationMin !== "number" ||
      durationMin <= 0 ||
      durationMin > 480
    ) {
      return NextResponse.json(
        { error: "Duration must be between 1 and 480 minutes." },
        { status: 400 },
      );
    }
    if (
      typeof priceCents !== "number" ||
      priceCents < 0 ||
      priceCents > 1000000
    ) {
      return NextResponse.json(
        { error: "Price must be between 0 and 10,000.00." },
        { status: 400 },
      );
    }

    const type = await createConsultationType({
      name: name as string,
      description: (description as string) ?? "",
      durationMin: durationMin as number,
      priceCents: priceCents as number,
      active: active as boolean | undefined,
      displayOrder: displayOrder as number | undefined,
    });

    return NextResponse.json({ type }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create type." },
      { status: 500 },
    );
  }
}
