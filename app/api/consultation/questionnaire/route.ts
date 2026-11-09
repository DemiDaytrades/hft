import { NextResponse } from "next/server";
import { requireActiveMember } from "@/lib/dal";
import { getQuestionnaireForUser } from "@/lib/consultation-questionnaire";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireActiveMember();
    const questionnaire = await getQuestionnaireForUser(user.id);
    return NextResponse.json({ questionnaire });
  } catch (e) {
    if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) {
      throw e;
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST() {
  await requireActiveMember();
  // Student entry is withheld for the initial member release. Never create a
  // record, mutate an existing questionnaire, or deliver notifications here.
  return NextResponse.json({ error: "Questionnaire entry is not available yet." }, { status: 403 });
}
