import type { Metadata } from "next";
import { requireAdmin } from "@/lib/dal";
import { listMembers } from "@/lib/members";
import IntakeV2Workspace from "./IntakeV2Workspace";

export const metadata: Metadata = {
  title: "Student Assessment & Consultation",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function StudentIntakeV2Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; studentUserId?: string; screen?: string; stage?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const selectedStudentId = typeof sp.studentUserId === "string" ? sp.studentUserId : "";
  const screen = typeof sp.screen === "string" ? sp.screen : "";
  const stage = typeof sp.stage === "string" ? sp.stage : "";
  const members = await listMembers({ search: q, page: 1 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
          Student Assessment &amp; Consultation
        </h1>
        <p className="mt-1 text-[14px] text-white/45">
          Capture approved responses once. Reuse compatible saved consultation answers, review derived financial and educational evidence, collect only missing information and finalize an immutable snapshot.
        </p>
      </div>
      <IntakeV2Workspace
        initialQuery={q}
        initialMembers={members.members.map((m) => ({ id: m.id, name: m.name, email: m.email }))}
        initialSelectedStudentId={selectedStudentId}
        initialScreen={screen}
        initialStage={stage}
      />
    </div>
  );
}
