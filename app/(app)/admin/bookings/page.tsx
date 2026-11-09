import type { Metadata } from "next";

import { listBookingsWithTypes } from "@/lib/bookings";
import { requireAdmin } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Appointments",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

const statusLabel: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  "no-show": "No Show",
  completed: "Completed",
};

const outcomeLabel: Record<string, string> = {
  "not-set": "Not set",
  "joined-hft": "Joined HFT",
  "follow-up": "Follow Up",
  "needs-more-time": "Needs More Time",
  "not-interested": "Not Interested",
};

export default async function AdminBookingsPage() {
  await requireAdmin();

  const bookings = await listBookingsWithTypes();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold uppercase tracking-[0.03em]">
            Appointments
          </h1>
          <p className="mt-1 text-[14px] text-white/45">
            {bookings.length} consultation booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <a
          href="/admin/availability"
          className="rounded-sm bg-brand-600 px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500"
        >
          Manage availability
        </a>
      </div>

      <section className="rounded-lg border border-white/8 bg-ink-900/80 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/8 bg-ink-950/40">
              <th className="px-6 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Customer
              </th>
              <th className="px-6 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Type
              </th>
              <th className="px-6 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Date / time (CT)
              </th>
              <th className="px-6 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Duration
              </th>
              <th className="px-6 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Amount
              </th>
              <th className="px-6 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Status
              </th>
              <th className="px-6 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Outcome
              </th>
              <th className="px-6 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="border-b border-white/8 hover:bg-white/3 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-display text-[14px] font-semibold text-white">
                    {b.customerName}
                  </p>
                  <p className="mt-1 text-[12.5px] text-white/45">
                    {b.customerEmail}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-display text-[14px] text-white">
                    {b.consultationTypeName}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-display text-[14px] text-white">
                    {new Date(b.appointmentAt).toLocaleString("en-US", {
                      timeZone: "America/Chicago",
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-display text-[14px] text-white">
                    {b.durationMin} min
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-display text-[14px] font-semibold text-white">
                    {money(b.priceCents)}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-sm px-2 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.16em] ${
                      b.status === "confirmed"
                        ? "bg-zone-buy/10 text-zone-buy border border-zone-buy/30"
                        : b.status === "pending"
                          ? "bg-zone-hold/10 text-zone-hold border border-zone-hold/30"
                          : b.status === "cancelled"
                            ? "bg-zone-sell/10 text-zone-sell border border-zone-sell/30"
                            : "bg-white/8 text-white/50 border border-white/8"
                    }`}
                  >
                    {statusLabel[b.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-display text-[13px] text-white/50">
                    {outcomeLabel[b.outcome]}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`/admin/bookings/${b.id}`}
                    className="text-[13px] text-brand-500 hover:text-brand-400 font-display font-semibold uppercase tracking-[0.14em]"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-white/50">
                  No appointments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
