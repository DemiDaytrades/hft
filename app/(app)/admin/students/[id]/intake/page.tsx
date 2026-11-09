import { getCloudflareContext } from "@opennextjs/cloudflare";
import { hasCanonicalIntake, PROTECTED_LEGACY_FACT_KEYS } from "@/lib/consultation-questionnaire/legacy-authority";
import { requireAdmin } from "@/lib/dal";
import { getLatestIntake } from "@/lib/student-intake";
import IntakeForm from "./IntakeForm";

export default async function IntakePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const intake = await getLatestIntake(id);
  const canonicalIntakeExists = await hasCanonicalIntake(getCloudflareContext().env.DB, id);
  return <IntakeForm userId={id} intake={intake} canonicalIntakeExists={canonicalIntakeExists} protectedKeys={PROTECTED_LEGACY_FACT_KEYS} />;
}
