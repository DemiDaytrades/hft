import Link from "next/link";
import PlanContent from "@/components/financial-plan/PlanContent";
import { getStudentPlan } from "@/lib/financial-plan/service";
import { getIntakeV2Db } from "@/lib/student-intake-v2/service";
import { requireActiveMember } from "@/lib/dal";
import { getQuestionnaireForUser } from "@/lib/consultation-questionnaire";
import { Panel } from "@/components/ui";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: any }) {
  if (value === null || value === undefined || value === "") return null;
  const v = Array.isArray(value) ? value.join(", ") : String(value);
  if (!v.trim()) return null;
  return (
    <div className="flex justify-between py-2 border-b border-white/5">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm text-white">{v}</span>
    </div>
  );
}

export default async function MyFinancesPage() {
  const user = await requireActiveMember();
  const published = await getStudentPlan(getIntakeV2Db(), user.id);
  if (published) return <div className="mx-auto max-w-5xl space-y-7 py-6"><h1 className="text-3xl font-bold text-white">Your Financial / Trading Readiness Plan</h1><Link href="/financial-plan" className="block text-sm text-brand-300">Version {published.plan.version} · Published {published.plan.publishedAt.slice(0,10)} · Open plan details →</Link>{published.sourceOutdated && <p className="text-sm text-brand-300">A newer completed intake is available. This plan remains based on the earlier reviewed source pending publication of a revision.</p>}<PlanContent content={published.plan.content}/></div>;
  const questionnaire = await getQuestionnaireForUser(user.id);
  const data = questionnaire?.data || {};

  const fixed = [
    data.billRentMortgage,
    data.billCarPayment,
    data.billCarInsurance,
    data.billPhone,
    data.billUtilities,
    data.billInternet,
    data.billCreditCards,
    data.billLoans,
    data.billChildFamilySupport,
    data.billGroceries,
    data.billGasTransportation,
    data.billSubscriptions,
    data.billOtherRecurring,
  ];
  let total = 0;
  for (const v of fixed) {
    const n = parseFloat(v || "0");
    if (!isNaN(n) && v !== "") total += n;
  }
  for (const b of data.customBills || []) {
    const n = parseFloat(b.amount || "0");
    if (!isNaN(n) && b.amount !== "") total += n;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">My Finances</h1>
        <p className="mt-1 text-[14px] text-white/45">Legacy self-reported financial summary — not a V2 readiness plan</p>
      </div>

      <Link href="/financial-plan" className="block text-sm text-brand-300">View your published Financial / Trading Readiness Plan status →</Link>

      <Panel>
        <h2 className="mb-3 font-display text-[16px] font-bold uppercase tracking-[0.03em]">Income (Private)</h2>
        <Row label="Monthly take-home income" value={data.monthlyTakeHomeIncome ? `$${data.monthlyTakeHomeIncome}` : null} />
        <Row label="Hourly rate" value={data.hourlyRate} />
        <Row label="Salary" value={data.salary} />
        <Row label="Other income sources" value={data.otherIncomeSources} />
        <Row label="Monthly other income" value={data.monthlyOtherIncome ? `$${data.monthlyOtherIncome}` : null} />
        <Row label="Income consistency" value={data.incomeConsistency} />
        <Row label="Current approximate monthly income" value={data.currentApproxMonthlyIncome} />
        <Row label="Desired future monthly income" value={data.desiredFutureMonthlyIncome} />
      </Panel>

      <Panel>
        <h2 className="mb-3 font-display text-[16px] font-bold uppercase tracking-[0.03em]">Monthly Bills</h2>
        <Row label="Rent/mortgage" value={data.billRentMortgage ? `$${data.billRentMortgage}` : null} />
        <Row label="Car payment" value={data.billCarPayment ? `$${data.billCarPayment}` : null} />
        <Row label="Car insurance" value={data.billCarInsurance ? `$${data.billCarInsurance}` : null} />
        <Row label="Phone" value={data.billPhone ? `$${data.billPhone}` : null} />
        <Row label="Utilities" value={data.billUtilities ? `$${data.billUtilities}` : null} />
        <Row label="Internet" value={data.billInternet ? `$${data.billInternet}` : null} />
        <Row label="Credit cards" value={data.billCreditCards ? `$${data.billCreditCards}` : null} />
        <Row label="Loans" value={data.billLoans ? `$${data.billLoans}` : null} />
        <Row label="Child/family support" value={data.billChildFamilySupport ? `$${data.billChildFamilySupport}` : null} />
        <Row label="Groceries" value={data.billGroceries ? `$${data.billGroceries}` : null} />
        <Row label="Gas/transportation" value={data.billGasTransportation ? `$${data.billGasTransportation}` : null} />
        <Row label="Subscriptions" value={data.billSubscriptions ? `$${data.billSubscriptions}` : null} />
        <Row label="Other recurring" value={data.billOtherRecurring ? `$${data.billOtherRecurring}` : null} />
        {(data.customBills || []).map((b: any, idx: number) => (
          <div key={b.id || idx} className="flex justify-between py-2 border-b border-white/5">
            <span className="text-sm text-white/50">{b.name || "Custom bill"}</span>
            <span className="text-sm text-white">{b.amount ? `$${b.amount}` : "—"}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 mt-2 border-t border-white/10">
          <span className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white">Total Monthly Obligations</span>
          <span className="text-[18px] font-semibold text-white">${total.toFixed(2)}</span>
        </div>
        <p className="text-[11px] text-white/40 mt-2">Editable bill tracking (paid/unpaid/due dates/history) is planned for a future phase. This view uses your questionnaire snapshot.</p>
      </Panel>

      <Panel>
        <h2 className="mb-3 font-display text-[16px] font-bold uppercase tracking-[0.03em]">Financial Snapshot</h2>
        <Row label="Savings" value={data.approximateSavings ? `$${data.approximateSavings}` : null} />
        <Row label="Disposable income after obligations" value={data.disposableIncomeAfterObligations} />
        <Row label="Financial pressures" value={data.financialPressures} />
        <Row label="Major upcoming expenses" value={data.upcomingMajorExpenses} />
      </Panel>

      <Panel>
        <h2 className="mb-3 font-display text-[16px] font-bold uppercase tracking-[0.03em]">Financial Goals</h2>
        <Row label="Meaningful monthly income" value={data.meaningfulMonthlyIncome} />
        <Row label="Biggest financial goal" value={data.biggestFinancialGoal} />
        <Row label="Small/near-term goal" value={data.smallNearTermGoal} />
        <Row label="Trading role hope" value={data.tradingRoleHope} />
        <Row label="Goal importance" value={data.goalImportance} />
        <p className="text-[11px] text-white/40 mt-2">Private to you and authorized instructors. Never public.</p>
      </Panel>
    </div>
  );
}
