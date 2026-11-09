import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { getQuestionnaireForUserId } from "@/lib/consultation-questionnaire/admin";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Panel } from "@/components/ui";
import ConsultationResultsClient from "./ConsultationResultsClient";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: any }) {
  if (value === null || value === undefined || value === "") return null;
  const v = Array.isArray(value) ? value.join(", ") : String(value);
  if (!v.trim()) return null;
  return (
    <div className="flex gap-3 py-1 border-b border-white/5">
      <span className="w-64 shrink-0 text-sm text-white/50">{label}</span>
      <span className="text-sm text-white">{v}</span>
    </div>
  );
}

export default async function ConsultationResultsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const db = (await getCloudflareContext()).env.DB;
  const user = await db.prepare(`SELECT id, name, email FROM "user" WHERE id = ?;`).bind(id).first<any>();
  const questionnaire = await getQuestionnaireForUserId(id);
  const data: any = (questionnaire as any)?.data || {};

  const parseNum = (v: any) => {
    const n = parseFloat(String(v || "").replace(/[^0-9.-]/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const fixedBills = [
    "billRentMortgage", "billCarPayment", "billCarInsurance", "billPhone", "billUtilities", "billInternet",
    "billCreditCards", "billLoans", "billChildFamilySupport", "billGroceries", "billGasTransportation",
    "billSubscriptions", "billOtherRecurring"
  ];
  let totalBills = 0;
  for (const k of fixedBills) {
    const n = parseNum(data[k]);
    if (n) totalBills += n;
  }
  for (const b of data.customBills || []) {
    const n = parseNum(b.amount);
    if (n) totalBills += n;
  }

  const monthlyIncome = parseNum(data.monthlyTakeHomeIncome) || parseNum(data.salary) || parseNum(data.currentApproxMonthlyIncome);
  const otherIncome = parseNum(data.monthlyOtherIncome);
  const totalIncome = monthlyIncome + otherIncome;
  const remaining = totalIncome - totalBills;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase">Consultation Results</h1>
          <p className="text-white">{user?.name ?? "—"} · {user?.email}</p>
          <p className="text-white/60">Questionnaire Status: {(questionnaire as any)?.status === "submitted" ? "Completed" : (questionnaire as any)?.status || "Not Started"}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/students/${id}/questionnaire`} className="rounded bg-white/10 px-4 py-2 text-white">← Back to Questionnaire</Link>
          <Link href={`/admin/students/${id}`} className="rounded bg-white/10 px-4 py-2 text-white">Student Profile</Link>
        </div>
      </div>

      <ConsultationResultsClient userId={id} questionnaire={questionnaire} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-2 font-display text-[16px] font-bold uppercase tracking-[0.03em]">Student Starting Point</h2>
          <Row label="Experience Level" value={data.experienceLevel || data.yearsTrading} />
          <Row label="Traded Before" value={data.tradedBefore} />
          <Row label="Markets" value={data.marketsTraded} />
          <Row label="Platforms" value={data.platformsUsed} />
          <Row label="Broker" value={data.brokerCurrent || data.preferredBroker} />
          <Row label="Knowledge Self-Assessment" value={data.weakestTopic ? `Weakest: ${data.weakestTopic}; Strongest: ${data.strongestTopic || "—"}` : null} />
          <Row label="MT5/Platform Readiness" value={data.hasTradingView || data.hasBrokerAccount || data.techComfort} />
          <Row label="Strengths" value={data.strengthsIdentified} />
          <Row label="Knowledge Gaps" value={data.areasToFocus || data.weakestTopic} />
          <Row label="Psychology/Discipline" value={data.biggestPsychChallenge || data.revengeTrading || data.fomoTendency} />
        </Panel>

        <Panel>
          <h2 className="mb-2 font-display text-[16px] font-bold uppercase tracking-[0.03em]">Financial Snapshot (INSTRUCTOR ONLY)</h2>
          <Row label="Employment Status" value={data.employmentStatus} />
          <Row label="Job/Occupation" value={data.jobTitle} />
          <Row label="Monthly Take-Home" value={data.monthlyTakeHomeIncome ? `$${data.monthlyTakeHomeIncome}` : null} />
          <Row label="Other Income" value={data.monthlyOtherIncome ? `$${data.monthlyOtherIncome}` : null} />
          <Row label="Total Income (calc)" value={totalIncome ? `$${totalIncome.toFixed(2)}` : null} />
          <Row label="Total Recurring Expenses (calc)" value={totalBills ? `$${totalBills.toFixed(2)}` : null} />
          <Row label="Remaining Monthly Cash Flow (calc)" value={remaining !== undefined ? `$${remaining.toFixed(2)}` : null} />
          <Row label="Savings" value={data.approximateSavings} />
          <Row label="Financial Pressures" value={data.financialPressures} />
          <p className="mt-2 text-[11px] text-amber-400/80">Private - never auto-published to student. Student sees approved summary only.</p>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-2 font-display text-[16px] font-bold uppercase tracking-[0.03em]">Goals</h2>
          <Row label="Primary Goal" value={data.primaryGoal || data.whyJoinHft} />
          <Row label="90-Day Goal" value={data.goal90Day} />
          <Row label="6-12 Month Goal" value={data.goal6Month || data.goal12Month} />
          <Row label="Longer-term Goal" value={data.goal12Month} />
          <Row label="Motivation" value={data.goalImportance} />
        </Panel>

        <Panel>
          <h2 className="mb-2 font-display text-[16px] font-bold uppercase tracking-[0.03em]">Learning Profile / Schedule</h2>
          <Row label="Learning Style/Prefs" value={data.learningPrefs || data.learningPace} />
          <Row label="Practice/Homework Prefs" value={data.practiceAssignmentsHelp} />
          <Row label="Weekly Capacity" value={data.hoursPerWeek || data.hoursPerWeekHft} />
          <Row label="Support Prefs" value={data.supportWhenStuck || data.accountabilityPrefs} />
          <Row label="Time Zone" value={data.timeZone || data.timeZone2} />
          <Row label="Schedule/Obligations" value={data.workSchedule || data.commitments} />
          <Row label="Recommended Class Windows" value={data.preferredStudyTimes} />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-2 font-display text-[16px] font-bold uppercase tracking-[0.03em]">Instructor Assessment & Plan (INSTRUCTOR ONLY)</h2>
          <Row label="Instructor Assessment" value={data.instructorNotes} />
          <Row label="Strengths" value={data.strengthsIdentified} />
          <Row label="Areas to Focus" value={data.areasToFocus} />
          <Row label="Top 3 Priorities" value={data.areasToFocus} />
          <Row label="Personalized Plan" value={data.personalizedPlan} />
          <Row label="Action Items" value={data.actionItems} />
          <p className="mt-2 text-[11px] text-amber-400/80">Private - not student-visible until explicitly published.</p>
        </Panel>

        <Panel>
          <h2 className="mb-2 font-display text-[16px] font-bold uppercase tracking-[0.03em]">Academy / Next Steps</h2>
          <Row label="Recommended Academy Starting Point" value={data.recommendedStart} />
          <Row label="Recommended First Lesson" value={data.recommendedStart} />
          <Row label="First Homework/Practice" value={data.actionItems} />
          <Row label="Next Action" value={data.actionItems} />
          <p className="mt-2 text-[11px] text-white/50">Instructor must approve starting point. No auto-assignment.</p>
        </Panel>
      </div>
    </div>
  );
}
