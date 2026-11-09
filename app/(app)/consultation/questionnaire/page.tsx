import { requireActiveMember } from "@/lib/dal";
import { Panel } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ConsultationQuestionnairePage() {
  await requireActiveMember();
  return <Panel><h1 className="font-display text-xl font-bold">Consultation questionnaire</h1><p className="mt-2 text-white/70">Questionnaire entry is not available yet. Your instructor will provide next steps for your consultation.</p></Panel>;
}
