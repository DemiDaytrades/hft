import { NextResponse } from "next/server";

import {
  getConsultationType,
  updateConsultationType,
  deleteConsultationType,
} from "@/lib/consultation-types";
import { requireAdmin } from "@/lib/dal";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const type = await getConsultationType(id);
  if (!type) {
    return NextResponse.json({ error: "Consultation type not found." }, { status: 404 });
  }
  return NextResponse.json({ type });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  await requireAdmin();
  const { id } = await params;

  try {
    const body = (await request.json()) as {
      name?: unknown;
      description?: unknown;
      durationMin?: unknown;
      priceCents?: unknown;
      active?: unknown;
      displayOrder?: unknown;
    };
    const type = await updateConsultationType(id, {
      name: body.name as string | undefined,
      description: body.description as string | undefined,
      durationMin: body.durationMin as number | undefined,
      priceCents: body.priceCents as number | undefined,
      active: body.active as boolean | undefined,
      displayOrder: body.displayOrder as number | undefined,
    });
    return NextResponse.json({ type });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update type." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  await requireAdmin();
  const { id } = await params;

  try {
    await deleteConsultationType(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete type." },
      { status: 500 },
    );
  }
}
