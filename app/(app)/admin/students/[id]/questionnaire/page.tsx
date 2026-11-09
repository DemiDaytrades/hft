import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { getQuestionnaireForUserId } from "@/lib/consultation-questionnaire/admin";
import { getActiveBookingForUser } from "@/lib/bookings";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import AdminQuestionnaireEditor from "./AdminQuestionnaireEditor";

function Row({ label, value }: { label: string; value: any }) {
  if (value === null || value === undefined || value === "") return null;
  const v = Array.isArray(value) ? value.join(", ") : String(value);
  if (!v.trim()) return null;
  return (
    <div className="flex gap-3 py-1 border-b border-white/5">
      <span className="w-56 shrink-0 text-sm text-white/50">{label}</span>
      <span className="text-sm text-white">{v}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-ink-900/60 p-5">
      <h2 className="mb-3 font-bold text-white">{title}</h2>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

export default async function AdminQuestionnairePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const db = (await getCloudflareContext()).env.DB;
  const user = await db.prepare(`SELECT id, name, email FROM "user" WHERE id = ?;`).bind(id).first<any>();
  const questionnaire = await getQuestionnaireForUserId(id);
  const booking = await getActiveBookingForUser(id);
  const data: any = (questionnaire as any)?.data || {};

  const q: any = questionnaire;
  const statusLabel = (() => {
    if (q?.status === "submitted") return "Completed";
    if (q?.status === "in_progress") return "In Progress";
    if (q?.status === "draft") {
      const hasData = q?.data && typeof q.data === "object" && Object.keys(q.data).length > 0;
      return hasData ? "In Progress" : "Not Started";
    }
    return "Not Started";
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase">Strategy Consultation Questionnaire</h1>
          <p className="text-white">{user?.name ?? "—"} · {user?.email}</p>
          <p className="text-white/60">Status: {statusLabel}</p>
          {(q as any)?.submittedAt && (
            <p className="text-white/60">Submitted: {new Date((q as any).submittedAt).toLocaleString()}</p>
          )}
        </div>
        <Link href={`/admin/students/${id}`} className="rounded bg-white/10 px-4 py-2 text-white">← Back to Student Profile</Link>
      </div>

      <AdminQuestionnaireEditor userId={id} userName={user?.name || ""} userEmail={user?.email || ""} />

      <Section title="Consultation Booking">
        {booking ? (
          <>
            <Row label="Appointment" value={new Date(booking.appointmentAt).toLocaleString("en-US", { timeZone: "America/Chicago" })} />
            <Row label="Type" value={booking.consultationTypeId} />
            <Row label="Duration" value={`${booking.durationMin} min`} />
            <Row label="Status" value={booking.status} />
          </>
        ) : (
          <p className="text-white/50 text-sm">No active booking linked</p>
        )}
      </Section>

      <Section title="Private Financial Snapshot (INSTRUCTOR ONLY)">
        <Row label="Monthly take-home" value={data.monthlyTakeHomeIncome} />
        <Row label="Hourly rate" value={data.hourlyRate} />
        <Row label="Savings" value={data.approximateSavings} />
        <Row label="Disposable income after obligations" value={data.disposableIncomeAfterObligations} />
        <Row label="Financial pressures" value={data.financialPressures} />
      </Section>
    </div>
  );
}
