import { NextResponse } from "next/server";

import {
  listAvailabilityRules,
  createOrUpdateAvailabilityRule,
} from "@/lib/availability-rules";
import { requireAdmin } from "@/lib/dal";

export const dynamic = "force-dynamic";

/** Admin: list availability rules. */
export async function GET(): Promise<Response> {
  await requireAdmin();
  const rules = await listAvailabilityRules();
  return NextResponse.json({ rules });
}

/** Admin: create or update availability rules (batch upsert). */
export async function POST(request: Request): Promise<Response> {
  await requireAdmin();

  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of rules." },
        { status: 400 },
      );
    }

    for (const rule of body) {
      if (
        typeof rule.dayOfWeek !== "number" ||
        rule.dayOfWeek < 0 ||
        rule.dayOfWeek > 6 ||
        typeof rule.startTime !== "string" ||
        typeof rule.endTime !== "string" ||
        typeof rule.enabled !== "boolean"
      ) {
        return NextResponse.json(
          { error: "Invalid rule format." },
          { status: 400 },
        );
      }
      await createOrUpdateAvailabilityRule({
        dayOfWeek: rule.dayOfWeek,
        startTime: rule.startTime,
        endTime: rule.endTime,
        enabled: rule.enabled,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save rules." },
      { status: 500 },
    );
  }
}
