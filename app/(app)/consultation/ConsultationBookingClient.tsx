"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CTA, Panel } from "@/components/ui";

const BOOKING_TIMEZONE = "America/Chicago";

type ConsultationType = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  priceCents: number;
};

type AvailableSlot = {
  start: string;
  end: string;
  available: boolean;
};

type Booking = {
  id: string;
  appointmentAt: string;
  status: string;
  consultationTypeId: string;
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function localDateString(d: Date): string {
  return d.toLocaleDateString("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: BOOKING_TIMEZONE,
  });
}

function formatTimeCT(iso: string): string {
  const [, timePart] = iso.split("T");
  if (!timePart) return iso;
  const [hour, minute] = timePart.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export default function ConsultationBookingClient({
  consultationType,
  existingBooking,
}: {
  consultationType: ConsultationType | null;
  existingBooking: Booking | null;
}) {
  const [booking, setBooking] = useState<Booking | null>(existingBooking);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const durationMin = consultationType?.durationMin ?? 30;

  const fetchSlots = useCallback(
    async (dateStr: string) => {
      if (!dateStr) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/availability?date=${dateStr}&durationMin=${durationMin}`,
        );
        if (!res.ok) throw new Error("Failed to load available times.");
        const data = (await res.json()) as { slots: AvailableSlot[] };
        setSlots(data.slots);
        setSelectedSlot(null);
      } catch (err) {
        setError("Could not load available times. Try again later.");
      } finally {
        setLoading(false);
      }
    },
    [durationMin],
  );

  const handleBook = async () => {
    if (!selectedSlot?.available || !consultationType) {
      setError("Please select an available time.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/member/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentAt: selectedSlot.start,
        }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Failed to book.");
      }
      const data = await res.json() as { booking: Booking };
      setBooking(data.booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book.");
    } finally {
      setLoading(false);
    }
  };

  const previousMonth = () => {
    setCalendarDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    setSelectedDate(null);
    setSlots([]);
    setSelectedSlot(null);
  };

  const nextMonth = () => {
    setCalendarDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    setSelectedDate(null);
    setSlots([]);
    setSelectedSlot(null);
  };

  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const todayStr = localDateString(new Date());
    const days: {
      date: Date;
      dateStr: string;
      isPast: boolean;
      isCurrentMonth: boolean;
      isSelected: boolean;
    }[] = [];

    for (let i = 0; i < startOffset; i++) {
      const d = new Date(year, month, -startOffset + i + 1);
      days.push({
        date: d,
        dateStr: localDateString(d),
        isPast: true,
        isCurrentMonth: false,
        isSelected: false,
      });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dateStr = localDateString(date);
      days.push({
        date,
        dateStr,
        isPast: dateStr < todayStr,
        isCurrentMonth: true,
        isSelected: dateStr === selectedDate,
      });
    }

    const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;
    const trailing = totalCells - (startOffset + lastDay.getDate());
    for (let i = 1; i <= trailing; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        dateStr: localDateString(d),
        isPast: true,
        isCurrentMonth: false,
        isSelected: false,
      });
    }

    return days;
  }, [calendarDate, selectedDate]);

  if (booking) {
    return (
      <Panel>
        <h2 className="font-display text-[20px] font-bold uppercase tracking-[0.03em]">
          Consultation scheduled
        </h2>
        <p className="mt-2 text-[15px] text-white/70">
          Your HFT Strategy Consultation is booked.
        </p>
        <div className="mt-4 rounded-sm border border-white/10 bg-ink-950/60 p-4">
          <p className="font-display text-[16px] text-white">
            {formatDateDisplay(booking.appointmentAt.split("T")[0])}
          </p>
          <p className="mt-1 text-[15px] text-white/80">
            {formatTimeCT(booking.appointmentAt)} CT
          </p>
          <p className="mt-2 text-[13px] text-white/50">
            Duration: {durationMin} minutes · Price: $0
          </p>
        </div>
      </Panel>
    );
  }

  if (!consultationType) {
    return (
      <Panel>
        <p className="text-white/70">Consultation type not available.</p>
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">
            {consultationType.name}
          </h2>
          <p className="mt-1 text-[13px] text-white/50">
            {durationMin} min · $0
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={previousMonth}
              className="rounded-sm px-2 py-1 text-white/60 hover:text-white"
            >
              ←
            </button>
            <p className="font-display text-[14px] font-semibold uppercase tracking-[0.16em] text-white/70">
              {calendarDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
                timeZone: "America/Chicago",
              })}
            </p>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-sm px-2 py-1 text-white/60 hover:text-white"
            >
              →
            </button>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="py-2 text-center font-display text-[11px] uppercase tracking-[0.18em] text-white/40"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => (
              <button
                key={idx}
                type="button"
                disabled={day.isPast || !day.isCurrentMonth}
                onClick={() => {
                  if (day.isPast || !day.isCurrentMonth) return;
                  setSelectedDate(day.dateStr);
                  setSelectedSlot(null);
                  setError("");
                  fetchSlots(day.dateStr);
                }}
                className={`aspect-square rounded-sm text-[14px] transition-colors ${
                  day.isSelected
                    ? "bg-brand-600 text-white"
                    : day.isPast || !day.isCurrentMonth
                      ? "text-white/25 cursor-not-allowed"
                      : "text-white/80 hover:bg-white/5"
                }`}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55">
            {selectedDate ? formatDateDisplay(selectedDate) : "Select a date"}
          </p>
          <div className="mt-4 space-y-2 max-h-[420px] overflow-y-auto">
            {loading && (
              <p className="text-[13px] text-white/40">Loading times...</p>
            )}
            {!loading && selectedDate && slots.length === 0 && (
              <p className="text-[13px] text-white/40">No available times.</p>
            )}
            {slots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot)}
                className={`w-full rounded-sm border px-4 py-2 text-left text-[14px] transition-colors ${
                  selectedSlot?.start === slot.start
                    ? "border-brand-600 bg-brand-600/20 text-white"
                    : slot.available
                      ? "border-white/12 text-white/80 hover:border-white/30"
                      : "border-white/8 text-white/30 cursor-not-allowed"
                }`}
              >
                {formatTimeCT(slot.start)} CT
              </button>
            ))}
          </div>

          {selectedSlot && (
            <div className="mt-6">
              <button
                type="button"
                disabled={loading}
                onClick={handleBook}
                className="w-full rounded-sm bg-brand-600 px-6 py-3 font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-500 disabled:opacity-40"
              >
                {loading ? "Booking..." : "Book for $0 (no payment)"}
              </button>
            </div>
          )}

          {error && (
            <p className="mt-3 rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-2 text-[13px] text-white/80">
              {error}
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}
