import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import LifecycleControls from "@/components/admin/LifecycleControls";
import ComplimentaryControls from "@/components/admin/ComplimentaryControls";
import { requireAdmin } from "@/lib/dal";
import { getLatestIntake } from "@/lib/student-intake";
import { getActiveDraftForStudent, getLatestCompletedIntake } from "@/lib/student-intake-v2/service";
import { getPlacement } from "@/lib/student-placement";
import { getQuestionnaireForUserId } from "@/lib/consultation-questionnaire/admin";
import { getActiveBookingForUser } from "@/lib/bookings";
import { getLatestPlan } from "@/lib/training-plan";
import {
  academyAccessStatus,
  assignmentStatusLabel,
  canonicalAssessmentStatus,
  financialPlanStatus,
  formatProfileDate,
  formatProfileDateTime,
  humanize,
  instructorPlacementStatus,
  learningPathStatus,
  legacyIntakeStatusLabel,
  legacyQuestionnaireStatusLabel,
  membershipStatus,
  type StatusSummary,
  type StatusTone,
} from "@/lib/student-profile-summary";

const statusCardTone: Record<StatusTone, string> = {
  neutral: "border-white/10 bg-ink-900/60",
  active: "border-brand-500/35 bg-brand-600/10",
  complete: "border-emerald-400/25 bg-emerald-400/5",
  pending: "border-amber-400/25 bg-amber-400/5",
  blocked: "border-red-400/25 bg-red-400/5",
};

const statusBadgeTone: Record<StatusTone, string> = {
  neutral: "border-white/15 bg-white/5 text-white/65",
  active: "border-brand-400/35 bg-brand-500/10 text-brand-200",
  complete: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  pending: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  blocked: "border-red-400/30 bg-red-400/10 text-red-200",
};

const statusDotTone: Record<StatusTone, string> = {
  neutral: "bg-white/35",
  active: "bg-brand-400",
  complete: "bg-emerald-400",
  pending: "bg-amber-400",
  blocked: "bg-red-400",
};

function StatusBadge({ status }: { status: StatusSummary }) {
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${statusBadgeTone[status.tone]}`}>
      {status.label}
    </span>
  );
}

function StatusCard({ label, status }: { label: string; status: StatusSummary }) {
  return (
    <article className={`rounded-xl border p-4 ${statusCardTone[status.tone]}`}>
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${statusDotTone[status.tone]}`} />
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">{label}</p>
      </div>
      <p className="mt-3 text-lg font-semibold text-white">{status.label}</p>
      {status.detail && <p className="mt-1 text-xs leading-5 text-white/55">{status.detail}</p>}
    </article>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  if (value === null || value === undefined || value === "") return null;
  const v = Array.isArray(value) ? value.join(", ") : typeof value === "object" ? JSON.stringify(value) : String(value);
  if (!v.trim()) return null;
  return (
    <div className="grid gap-1 border-b border-white/5 py-2 last:border-0 sm:grid-cols-[11rem_1fr] sm:gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 sm:text-xs sm:font-medium sm:normal-case sm:tracking-normal">{label}</span>
      <span className="text-sm leading-6 text-white/90">{v}</span>
    </div>
  );
}

function DetailSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-ink-950/30 p-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {description && <p className="mt-1 text-xs leading-5 text-white/45">{description}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function HistoryLink({ href, title, detail }: { href: string; title: string; detail: string }) {
  return (
    <Link href={href} className="group rounded-lg border border-white/10 bg-ink-950/40 p-4 transition-colors hover:border-brand-400/40 hover:bg-white/5">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-white/50">{detail}</p>
      <span className="mt-3 inline-block text-xs font-semibold text-brand-300 group-hover:text-brand-200">Open →</span>
    </Link>
  );
}

function parseJsonObject(value: unknown): any {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(String(value));
  } catch {
    return {};
  }
}

function formatBooking(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const db = (await getCloudflareContext()).env.DB;
  const user = await db
    .prepare(`SELECT id, name, email, role, banned, must_change_password, "subscriptionStatus", "complimentaryAccessStartsAt", "complimentaryAccessExpiresAt", "complimentaryAccessRevokedAt", "lifecycle_status", "createdAt" FROM "user" WHERE id = ?;`)
    .bind(id)
    .first<any>();
  if (!user) notFound();

  const [
    intake,
    placement,
    questionnaire,
    booking,
    latestCanonicalIntake,
    activeCanonicalDraft,
    trainingPlan,
    learningPath,
    financialPlan,
    assignmentsResult,
  ] = await Promise.all([
    getLatestIntake(id),
    getPlacement(id),
    getQuestionnaireForUserId(id),
    getActiveBookingForUser(id),
    getLatestCompletedIntake(db, id),
    getActiveDraftForStudent(db, id),
    getLatestPlan(id),
    db.prepare(`SELECT v.version, v.status, v.student_json, v.approved_at FROM learning_path_series s JOIN learning_path_version v ON v.id = s.current_version_id AND v.series_id = s.id WHERE s.student_id = ?;`).bind(id).first<any>(),
    db.prepare(`SELECT v.version, v.status, v.published_at, s.published_version_id, pv.version AS published_version FROM financial_plan_series s JOIN financial_plan_version v ON v.series_id = s.id LEFT JOIN financial_plan_version pv ON pv.id = s.published_version_id WHERE s.student_id = ? ORDER BY v.version DESC LIMIT 1;`).bind(id).first<any>(),
    db.prepare(`SELECT a.id, a.status, a.assigned_at, c.title, c.track FROM student_course_assignment a JOIN academy_course c ON c.id = a.course_id WHERE a.user_id = ? ORDER BY a.assigned_at DESC, a.id;`).bind(id).all<any>(),
  ]);

  const assignments = assignmentsResult.results;
  const data = parseJsonObject(intake?.data);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const legacyIntakeStatus = legacyIntakeStatusLabel(intake?.status);
  const questionnaireStatus = legacyQuestionnaireStatusLabel(questionnaire);
  const trainingPlanStatus = trainingPlan?.status ? humanize(trainingPlan.status) : "Not Started";
  const canonicalStatus = canonicalAssessmentStatus(activeCanonicalDraft, latestCanonicalIntake);
  const memberStatus = membershipStatus(user);
  const accessStatus = academyAccessStatus(user);
  const placementStatus = instructorPlacementStatus(learningPath, placement);
  const pathStatus = learningPathStatus(learningPath);
  const financialStatus = financialPlanStatus(financialPlan);
  const placementApproved = learningPath?.status === "APPROVED";
  const assessmentAction = activeCanonicalDraft ? "Continue assessment" : latestCanonicalIntake ? "Review assessment" : "Start assessment";
  const assessmentHref = `/admin/student-intake-v2?studentUserId=${encodeURIComponent(id)}`;
  const questionnaireSubmitted = formatProfileDateTime(questionnaire?.submittedAt);
  const bookingLabel = booking ? [formatBooking(booking.appointmentAt), booking.consultationTypeId, booking.status].filter(Boolean).join(" · ") : null;
  const intakeCompleted = formatProfileDate(intake?.completedAt);
  const intakeUpdated = formatProfileDateTime(intake?.updatedAt);
  const trainingPlanUpdated = formatProfileDateTime(trainingPlan?.updatedAt);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">Student profile</p>
          <h1 className="mt-2 break-words font-display text-3xl font-bold uppercase tracking-[0.03em] text-white sm:text-4xl">{user.name ?? "Student"}</h1>
          <p className="mt-2 break-all text-sm text-white/60">{user.email}</p>
          <p className="mt-1 text-xs text-white/40">
            Member since {formatProfileDate(user.createdAt) ?? "—"} · Lifecycle {humanize(user.lifecycle_status) || "Active"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={memberStatus} />
          <StatusBadge status={canonicalStatus} />
        </div>
      </header>

      <section className="rounded-xl border border-brand-500/35 bg-gradient-to-br from-brand-600/15 via-ink-900 to-ink-950 p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">Current assessment</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Student Assessment &amp; Consultation</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">
              The canonical four-stage workflow is the current source of truth for assessment capture, instructor review, and next-step recommendations.
            </p>
            <p className="mt-3 text-xs leading-5 text-white/45">Opens the existing workflow with this student selected.</p>
          </div>
          <Link
            href={assessmentHref}
            className="inline-flex shrink-0 items-center justify-center rounded-sm bg-brand-600 px-5 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500"
          >
            {assessmentAction}
          </Link>
        </div>
      </section>

      <section aria-label="Student status" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard label="Membership" status={memberStatus} />
        <StatusCard label="Current canonical assessment" status={canonicalStatus} />
        <StatusCard label="Instructor placement" status={placementStatus} />
        <StatusCard label="Academy access" status={accessStatus} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em] text-white">Learning &amp; Academy</h2>
          <p className="mt-1 text-sm text-white/55">Assignments, reviewed plans, and the current learning sequence.</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <article className="flex min-w-0 flex-col rounded-xl border border-white/10 bg-ink-900/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">Academy Assignments</h3>
                <p className="mt-1 text-xs text-white/45">
                  {assignments.length} {assignments.length === 1 ? "assigned course" : "assigned courses"}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/65">
                {assignments.length ? "Assigned" : "None"}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {assignments.slice(0, 3).map((assignment: any) => (
                <div key={assignment.id} className="flex items-start justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{assignment.title}</p>
                    <p className="mt-0.5 text-[11px] text-white/40">{assignment.track ?? "Course"}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-white/50">{assignmentStatusLabel(assignment.status)}</span>
                </div>
              ))}
              {assignments.length > 3 && <p className="text-xs text-white/45">+{assignments.length - 3} more assignments</p>}
              {assignments.length === 0 && <p className="text-sm text-white/50">No published courses are assigned.</p>}
            </div>
            {assignments.length > 0 && !placementApproved && (
              <p className="mt-4 rounded-lg border border-amber-400/25 bg-amber-400/5 p-3 text-xs leading-5 text-amber-100/85">
                Assigned course access is separate from instructor placement. Placement and learning-path approval are still pending.
              </p>
            )}
            <Link href={`/admin/students/${id}/academy`} className="mt-auto pt-5 text-sm font-semibold text-brand-300 hover:text-brand-200">
              Manage Academy assignments →
            </Link>
          </article>

          <article className="flex min-w-0 flex-col rounded-xl border border-white/10 bg-ink-900/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Personalized Learning Path</h3>
              <StatusBadge status={pathStatus} />
            </div>
            <p className="mt-3 text-sm leading-6 text-white/65">{pathStatus.detail}</p>
            {!placementApproved && (
              <p className="mt-3 rounded-lg border border-white/10 bg-ink-950/40 p-3 text-xs leading-5 text-white/50">
                No approved personalized path. Any legacy manual placement is historical context only.
              </p>
            )}
            <Link href={`/admin/learning-path?studentId=${encodeURIComponent(id)}`} className="mt-auto pt-5 text-sm font-semibold text-brand-300 hover:text-brand-200">
              Review learning path →
            </Link>
          </article>

          <article className="flex min-w-0 flex-col rounded-xl border border-white/10 bg-ink-900/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Financial / Trading Readiness Plan</h3>
              <StatusBadge status={financialStatus} />
            </div>
            <p className="mt-3 text-sm leading-6 text-white/65">{financialStatus.detail}</p>
            <p className="mt-3 rounded-lg border border-white/10 bg-ink-950/40 p-3 text-xs leading-5 text-white/50">
              Financial readiness is separate from educational placement and Academy access.
            </p>
            <Link href={`/admin/financial-plan?studentId=${encodeURIComponent(id)}`} className="mt-auto pt-5 text-sm font-semibold text-brand-300 hover:text-brand-200">
              Review financial readiness →
            </Link>
          </article>
        </div>
      </section>

      <details className="rounded-xl border border-white/10 bg-ink-900/50">
        <summary className="flex cursor-pointer list-none flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="text-xl font-semibold text-white">Account Management</h2>
            <p className="mt-1 text-sm leading-6 text-white/50">
              Membership, complimentary access, invitation delivery, lifecycle, billing warnings, deactivation, and audit.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
            <span className="rounded-full border border-white/10 px-2.5 py-1">{memberStatus.label}</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1">Academy: {accessStatus.label}</span>
            <span className="rounded border border-white/15 px-3 py-1.5 text-white/65">Expand</span>
          </div>
        </summary>
        <div className="space-y-5 border-t border-white/10 p-5">
          <p className="text-sm leading-6 text-white/55">
            Access changes and billing decisions are separate. Deactivation preserves historical records and does not cancel Stripe billing.
          </p>
          <ComplimentaryControls email={user?.email ?? ""} userId={id} expiresAt={user?.complimentaryAccessExpiresAt ?? null} revokedAt={user?.complimentaryAccessRevokedAt ?? null} />
          <LifecycleControls studentId={id} />
        </div>
      </details>

      <details className="rounded-xl border border-white/10 bg-ink-900/50">
        <summary className="flex cursor-pointer list-none flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="text-xl font-semibold text-white">Historical Records</h2>
            <p className="mt-1 text-sm leading-6 text-white/50">
              Legacy intake, strategy questionnaire, consultation reports, training plans, and legacy placement.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
            <span className="rounded-full border border-white/10 px-2.5 py-1">Legacy intake: {legacyIntakeStatus}</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1">Questionnaire: {questionnaireStatus}</span>
            <span className="rounded border border-white/15 px-3 py-1.5 text-white/65">Expand</span>
          </div>
        </summary>
        <div className="space-y-5 border-t border-white/10 p-5">
          <p className="rounded-lg border border-white/10 bg-ink-950/40 p-4 text-sm leading-6 text-white/55">
            The canonical assessment above is the current source of truth. These records are preserved for reference and audit. Historical intake remains available; legacy-only answers may be editable, while facts covered by the canonical assessment are read-only.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <HistoryLink
              href={`/admin/students/${id}/intake`}
              title="Historical intake"
              detail={[legacyIntakeStatus, intakeCompleted ? `Completed ${intakeCompleted}` : intakeUpdated ? `Updated ${intakeUpdated}` : null].filter(Boolean).join(" · ")}
            />
            <HistoryLink
              href={`/admin/students/${id}/questionnaire`}
              title="Strategy questionnaire"
              detail={[questionnaireStatus, questionnaireSubmitted ? `Submitted ${questionnaireSubmitted}` : null].filter(Boolean).join(" · ")}
            />
            <HistoryLink
              href={`/admin/students/${id}/consultation-results`}
              title="Consultation reports"
              detail={`Questionnaire ${questionnaireStatus}`}
            />
            <HistoryLink
              href={`/admin/students/${id}/training-plan`}
              title="Historical training plan"
              detail={[trainingPlanStatus, trainingPlanUpdated ? `Updated ${trainingPlanUpdated}` : null].filter(Boolean).join(" · ")}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <DetailSection title="Strategy consultation handoff">
              <Row label="Legacy questionnaire" value={[questionnaireStatus, questionnaireSubmitted ? `Submitted ${questionnaireSubmitted}` : null].filter(Boolean).join(" · ")} />
              <Row label="Active booking" value={bookingLabel ?? "No active booking linked"} />
              <p className="pt-3 text-xs leading-5 text-white/45">
                Current workflow: canonical assessment → instructor review → reviewed learning path / financial readiness.
              </p>
            </DetailSection>

            <DetailSection title="Historical HFT placement" description="Manual placement is historical and read-only. Current sequencing uses the instructor-reviewed Personalized Learning Path.">
              <Row label="Historical starting level" value={placement?.instructorLevel} />
              <Row label="Historical HFT track" value={placement?.instructorTrack} />
              <Row label="Historical instructor reason" value={placement?.instructorReason} />
              <Row label="Placed at" value={formatProfileDateTime(placement?.placedAt)} />
              <Row label="Placed by" value={placement?.placedBy} />
            </DetailSection>
          </div>

          <details className="rounded-lg border border-white/10 bg-ink-950/30">
            <summary className="cursor-pointer p-4 text-sm font-semibold text-white/80">Legacy intake answers</summary>
            <div className="grid gap-4 border-t border-white/10 p-4 xl:grid-cols-2">
              <DetailSection title="Student overview">
                <Row label="Name" value={user?.name} />
                <Row label="Email" value={user?.email} />
                <Row label="Membership" value={user?.subscriptionStatus ?? "none"} />
                <Row label="Member since" value={formatProfileDate(user?.createdAt)} />
                <Row label="Legacy intake status" value={legacyIntakeStatus} />
                <Row label="Legacy intake completed" value={intakeCompleted} />
              </DetailSection>

              <DetailSection title="Student goals">
                <Row label="Why join HFT" value={data.whyHFT} />
                <Row label="Hoping to accomplish" value={data.hoping} />
                <Row label="90-day goal" value={data.progress90 ?? data.q3} />
                <Row label="Longer-term goals" value={data.q4 ?? data.financial612} />
              </DetailSection>

              <DetailSection title="Trading experience">
                <Row label="Traded before" value={data.tradedBefore} />
                <Row label="Markets" value={data.tradedMarkets ?? data.markets} />
                <Row label="Platforms" value={data.platformsUsed ?? data.platforms} />
                <Row label="Demo/Live" value={data.q8} />
                <Row label="Prior courses" value={data.priorCourse} />
                <Row label="Significant loss/scam" value={data.q10} />
              </DetailSection>

              <DetailSection title="Learning profile — self reported">
                <Row label="Learning methods" value={data.learnMethods ?? data.learning} />
                <Row label="Patience" value={data.patience ?? data.q12} />
                <Row label="Discipline" value={data.discipline ?? data.q13} />
                <Row label="Struggles" value={data.q14} />
                <Row label="Availability" value={data.q15 ?? data.bestTimes} />
              </DetailSection>

              <DetailSection title="Financial assessment (admin only)">
                <Row label="Monthly take-home" value={data.q16 ?? data.income} />
                <Row label="Essential expenses" value={data.q17} />
                <Row label="Disposable income" value={data.q23 ?? data.disposable} />
                <Row label="Risk comfort" value={data.q25 ?? data.riskComfort} />
              </DetailSection>

              <DetailSection title="Weekly schedule / availability">
                {days.map((day) => {
                  const dayStatus = data[`sched_${day}_status`];
                  const start = data[`sched_${day}_start`];
                  const end = data[`sched_${day}_end`];
                  if (!dayStatus) return null;
                  return <Row key={day} label={day} value={dayStatus === "Off" ? "Off" : `${start ?? "?"} – ${end ?? "?"}`} />;
                })}
                <Row label="Timezone" value={data.timezone} />
                <Row label="Commute" value={data.commute} />
                <Row label="Best days" value={data.bestDays} />
                <Row label="Best times" value={data.bestTimes} />
                <Row label="Responsibilities" value={data.responsibilities} />
              </DetailSection>

              <DetailSection title="Support & learning preferences">
                <Row label="Support between classes" value={data.supportBetween} />
                <Row label="Practice hours/week" value={data.practiceHours} />
                <Row label="Trading journal" value={data.journalWilling} />
                <Row label="Feedback preference" value={data.feedbackPref} />
              </DetailSection>

              <DetailSection title="Expectations / risk">
                <Row label="Risk acknowledgment" value={data.riskAck} />
                <Row label="Demo comfort" value={data.demoComfort} />
              </DetailSection>

              <DetailSection title="Instructor assessment (admin only)">
                <Row label="Notes" value={data.q26 ?? data.notes} />
                <Row label="Recommended track/level" value={data.q27} />
                <Row label="Primary focus areas" value={data.q28} />
                <Row label="Risks/concerns" value={data.q29} />
                <Row label="Next steps" value={data.q30} />
              </DetailSection>

              <DetailSection title="After-call summary (admin only)">
                <Row label="Trading level" value={data.summaryLevel} />
                <Row label="Markets traded" value={data.summaryMarkets} />
                <Row label="MT5 status" value={data.summaryMt5} />
                <Row label="Broker status" value={data.summaryBroker} />
                <Row label="Financial goal" value={data.summaryFinancialGoal} />
                <Row label="6–12 month goal" value={data.summary612} />
                <Row label="Top learning goal #1" value={data.summaryGoal1} />
                <Row label="Top learning goal #2" value={data.summaryGoal2} />
                <Row label="Top learning goal #3" value={data.summaryGoal3} />
                <Row label="Main weakness" value={data.summaryWeakness} />
                <Row label="Learning style" value={data.summaryLearningStyle} />
                <Row label="Work schedule" value={data.summarySchedule} />
                <Row label="Best class windows" value={data.summaryBestWindows} />
                <Row label="Homework preference" value={data.summaryHomework} />
                <Row label="Support preference" value={data.summarySupport} />
                <Row label="First lesson" value={data.summaryFirstLesson} />
                <Row label="Next action" value={data.summaryNextAction} />
              </DetailSection>
            </div>
          </details>
        </div>
      </details>
    </div>
  );
}
