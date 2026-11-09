import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getBooking, updateBooking } from "@/lib/bookings";
import { requireAdmin } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Appointment",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

const statuses: { value: string; label: string }[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no-show", label: "No Show" },
  { value: "completed", label: "Completed" },
];

const outcomes: { value: string; label: string }[] = [
  { value: "not-set", label: "Not set" },
  { value: "joined-hft", label: "Joined HFT" },
  { value: "follow-up", label: "Follow Up" },
  { value: "needs-more-time", label: "Needs More Time" },
  { value: "not-interested", label: "Not Interested" },
];

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const booking = await getBooking(id);
  if (!booking) redirect("/admin/bookings");

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
            Appointment details
          </h1>
          <p className="mt-1 text-[14px] text-white/45">
            Booking for {booking.customerName}
          </p>
        </div>
        <a
          href="/admin/bookings"
          className="rounded-sm px-3 py-2 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60 hover:text-white"
        >
          ← Back to list
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Booking info card */}
        <div className="lg:col-span-2">
          <Panel className="rounded-lg border border-white/8 bg-ink-900/80 p-6 mb-6">
            <h2 className="mb-4 font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/80">
              Appointment information
            </h2>
            <dl className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Type
                  </p>
                  <p className="font-display text-[15px] text-white">
                    {booking.consultationTypeId}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Duration
                  </p>
                  <p className="font-display text-[15px] text-white">
                    {booking.durationMin} minutes
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Date & time (CT)
                  </p>
                  <p className="font-display text-[15px] text-white">
                    {new Date(booking.appointmentAt).toLocaleString("en-US", {
                      timeZone: "America/Chicago",
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Amount paid
                  </p>
                  <p className="font-display text-[15px] font-semibold text-white">
                    {money(booking.priceCents)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Status
                  </p>
                  <p className="font-display text-[15px] text-white">
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Outcome
                  </p>
                  <p className="font-display text-[15px] text-white">
                    {booking.outcome.charAt(0).toUpperCase() + booking.outcome.slice(1)}
                  </p>
                </div>
              </div>
              {booking.stripeSessionId && (
                <div className="pt-4 border-t border-white/8">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Stripe session
                  </p>
                  <p className="font-display text-[13px] text-white/40 break-all">
                    {booking.stripeSessionId}
                  </p>
                  {booking.stripePaymentIntentId && (
                    <p className="font-display text-[13px] text-white/40 break-all mt-1">
                      {booking.stripePaymentIntentId}
                    </p>
                  )}
                </div>
              )}
            </dl>
          </Panel>

          {/* Questionnaire answers */}
          <Panel className="rounded-lg border border-white/8 bg-ink-900/80 p-6">
            <h2 className="mb-4 font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/80">
              Consultation answers
            </h2>
            <div className="space-y-3">
              {Object.entries(booking.questions).map(([label, value]) => (
                <div key={label}>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    {label}
                  </p>
                  <p className="font-display text-[14px] text-white whitespace-pre-line">
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Admin actions sidebar */}
        <div className="lg:col-span-1">
          <Panel className="rounded-lg border border-white/8 bg-ink-900/80 p-6 sticky top-6">
            <h2 className="mb-4 font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-white/80">
              Manage appointment
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const status = formData.get("status") as string;
                const outcome = formData.get("outcome") as string;
                const notes = formData.get("admin_notes") as string;

                try {
                  await updateBooking(id, {
                    status: (status as
                      | "confirmed"
                      | "cancelled"
                      | "no-show"
                      | "completed"
                      | "pending") || undefined,
                    outcome: (outcome as
                      | "not-set"
                      | "joined-hft"
                      | "follow-up"
                      | "needs-more-time"
                      | "not-interested") || undefined,
                    adminNotes: notes,
                  });
                } catch {
                  // Error handling could be added
                }
              }}
              className="space-y-4"
            >
              <div>
                <label
                  className="block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-2"
                >
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={booking.status}
                  className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[14px] text-white outline-none transition-colors focus:border-brand-600"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-2"
                >
                  Post-call outcome
                </label>
                <select
                  name="outcome"
                  defaultValue={booking.outcome}
                  className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[14px] text-white outline-none transition-colors focus:border-brand-600"
                >
                  {outcomes.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-2"
                >
                  Admin notes
                </label>
                <textarea
                  name="admin_notes"
                  defaultValue={booking.adminNotes}
                  rows={4}
                  className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[14px] text-white outline-none transition-colors focus:border-brand-600"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-sm bg-brand-600 px-6 py-3 font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-500"
              >
                Save changes
              </button>
            </form>

            <p className="mt-6 text-[12px] text-white/40">
              Status and notes updates do not alter Stripe payment history.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-lg border bg-ink-900/80 ${className}`}>
      {children}
    </div>
  );
}
