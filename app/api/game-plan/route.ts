import { NextResponse } from "next/server";
import { requireActiveMember } from "@/lib/dal";
import { getPublishedForUser } from "@/lib/consultation-game-plan";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireActiveMember();
    const published = await getPublishedForUser(user.id);
    if (!published) return NextResponse.json({ gamePlan: null });
    // Only return student_visible_payload - never private data
    return NextResponse.json({ gamePlan: published.student_visible_payload, publishedAt: published.published_at, version: published.version });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unauthorized" }, { status: 403 });
  }
}
