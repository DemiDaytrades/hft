import { requireActiveMember } from "@/lib/dal";
import { getActiveBookingForUser } from "@/lib/bookings";
import { getQuestionnaireForUser } from "@/lib/consultation-questionnaire";
import { Panel } from "@/components/ui";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: any }) {
  if (value === null || value === undefined || value === "") return null;
  const v = Array.isArray(value) ? value.join(", ") : String(value);
  if (!v.trim()) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 py-2 border-b border-white/5">
      <span className="sm:w-64 shrink-0 text-sm text-white/50">{label}</span>
      <span className="text-sm text-white whitespace-pre-wrap">{v}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel>
      <h2 className="mb-3 font-display text-[16px] font-bold uppercase tracking-[0.03em]">{title}</h2>
      <div className="space-y-1">{children}</div>
    </Panel>
  );
}

export default async function MyQuestionnairePage() {
  const user = await requireActiveMember();
  const questionnaire = await getQuestionnaireForUser(user.id);
  const booking = await getActiveBookingForUser(user.id);
  const data = questionnaire?.data || {};

  if (!questionnaire) {
    return (
      <Panel>
        <p className="text-white/70">No questionnaire is available yet. Your instructor will provide next steps for your consultation.</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">My Questionnaire</h1>
        <p className="mt-1 text-[14px] text-white/45">Submitted snapshot of your Strategy Consultation Questionnaire</p>
        <p className="mt-1 text-[13px] text-white/60">Status: {questionnaire.status === "submitted" ? "Submitted" : "Draft"} {questionnaire.submittedAt && `• ${new Date(questionnaire.submittedAt).toLocaleString()}`}</p>
        {booking && <p className="text-[13px] text-white/60">Consultation: {new Date(booking.appointmentAt).toLocaleString("en-US", { timeZone: "America/Chicago" })} CT</p>}
      </div>

      <Section title="A — About You">
        <Row label="About yourself" value={data.aboutYourself} />
        <Row label="Current work/school/business" value={data.currentWork} />
        <Row label="Working toward" value={data.workingTowardLife} />
        <Row label="Own/start business" value={data.ownOrStartBusiness} />
        <Row label="Business ideas" value={data.businessIdeas} />
        <Row label="Strengths" value={data.strengths} />
        <Row label="Consistency interference" value={data.consistencyInterference} />
        <Row label="Motivation" value={data.motivation} />
        <Row label="Proudest accomplishment" value={data.proudAccomplishment} />
        <Row label="HFT help besides trading" value={data.hftHelpBesidesTrading} />
      </Section>

      <Section title="B — Employment & Income">
        <Row label="Employment status" value={data.employmentStatus} />
        <Row label="Job title" value={data.jobTitle} />
        <Row label="Employer" value={data.employerName} />
        <Row label="Compensation" value={data.compensationType} />
        <Row label="Hours/week" value={data.hoursPerWeek} />
        <Row label="Pay frequency" value={data.payFrequency} />
        <Row label="Take-home per paycheck" value={data.takeHomePerPaycheck} />
        <Row label="Monthly take-home" value={data.monthlyTakeHomeIncome} />
        <Row label="Other income sources" value={data.otherIncomeSources} />
        <Row label="Monthly other income" value={data.monthlyOtherIncome} />
        <Row label="Income consistency" value={data.incomeConsistency} />
        <Row label="Notes" value={data.employmentNotes} />
      </Section>

      <Section title="C — Monthly Bills">
        <Row label="Rent/mortgage" value={data.billRentMortgage} />
        <Row label="Car payment" value={data.billCarPayment} />
        <Row label="Car insurance" value={data.billCarInsurance} />
        <Row label="Phone" value={data.billPhone} />
        <Row label="Utilities" value={data.billUtilities} />
        <Row label="Internet" value={data.billInternet} />
        <Row label="Credit cards" value={data.billCreditCards} />
        <Row label="Loans" value={data.billLoans} />
        <Row label="Child/family support" value={data.billChildFamilySupport} />
        <Row label="Groceries" value={data.billGroceries} />
        <Row label="Gas/transportation" value={data.billGasTransportation} />
        <Row label="Subscriptions" value={data.billSubscriptions} />
        <Row label="Other recurring" value={data.billOtherRecurring} />
        <Row label="Custom bills" value={(data.customBills || []).map((b: any) => b.name && b.amount ? `${b.name}: $${b.amount}` : null).filter(Boolean).join("; ")} />
        <Row label="Savings" value={data.approximateSavings} />
        <Row label="Disposable income after obligations" value={data.disposableIncomeAfterObligations} />
        <Row label="Financial pressures" value={data.financialPressures} />
        <Row label="Upcoming expenses" value={data.upcomingMajorExpenses} />
      </Section>

      <Section title="D — Financial & Life Goals">
        <Row label="Current monthly income" value={data.currentApproxMonthlyIncome} />
        <Row label="Desired future monthly income" value={data.desiredFutureMonthlyIncome} />
        <Row label="Meaningful monthly income" value={data.meaningfulMonthlyIncome} />
        <Row label="Biggest financial goal" value={data.biggestFinancialGoal} />
        <Row label="Small/near-term goal" value={data.smallNearTermGoal} />
        <Row label="30-day goal" value={data.goal30Day} />
        <Row label="60-day goal" value={data.goal60Day} />
        <Row label="90-day goal" value={data.goal90Day} />
        <Row label="6-12 month goal" value={data.goal612Month} />
        <Row label="Additional income would allow" value={data.additionalIncomeWouldAllow} />
        <Row label="Trading role hope" value={data.tradingRoleHope} />
        <Row label="Goal importance" value={data.goalImportance} />
      </Section>

      <Section title="E — Trading Background">
        <Row label="Traded before" value={data.tradedBefore} />
        <Row label="Experience" value={data.experienceLevel} />
        <Row label="Markets" value={data.marketsTraded} />
        <Row label="Demo/Live" value={[data.demoExperience, data.liveExperience].filter(Boolean).join(" / ")} />
        <Row label="Platforms" value={data.platformsUsed} />
        <Row label="Broker" value={data.brokerCurrent} />
        <Row label="Previous education" value={data.previousEducation} />
        <Row label="Experience length" value={data.experienceLength} />
        <Row label="Loss/scam" value={data.lossOrScam} />
        <Row label="Interest in Forex/HFT" value={data.interestInForexHft} />
      </Section>

      <Section title="F — Trading Psychology & Discipline">
        <Row label="Patience/Discipline/Confidence" value={[data.patienceRating, data.disciplineRating, data.confidenceRulesRating].filter(Boolean).map((v,i)=>["Patience","Discipline","Confidence"][i]+":"+v).join(" | ")} />
        <Row label="FOMO" value={data.fomoTendency} />
        <Row label="Biggest weakness" value={data.biggestWeakness} />
        <Row label="Biggest strength" value={data.biggestStrength} />
      </Section>

      <Section title="G — Learning Style">
        <Row label="Learning methods" value={data.learningMethods} />
        <Row label="Instruction preference" value={data.instructionPreference} />
      </Section>

      <Section title="H — Schedule & Availability">
        <Row label="Time zone" value={data.timeZone} />
        <Row label="Work/school schedule" value={data.workSchoolSchedule} />
        <Row label="Days available" value={data.daysAvailable} />
        <Row label="Hours/week for HFT" value={data.hoursPerWeekHft} />
        <Row label="Preferred study times" value={data.preferredStudyTimes} />
        <Row label="Friday coaching" value={data.fridayCoaching} />
      </Section>

      <Section title="I — Goals, Expectations & Support">
        <Row label="Why join HFT" value={data.whyJoinHft} />
        <Row label="Most want to learn" value={data.mostWantToLearn} />
        <Row label="30/60/90 day" value={[data.progress30Days, data.progress60Days, data.progress90Days].filter(Boolean).join(" | ")} />
        <Row label="Feedback frequency" value={data.feedbackFrequency} />
      </Section>
    </div>
  );
}
