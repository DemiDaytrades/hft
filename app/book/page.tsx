"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";

const BOOKING_TIMEZONE = "America/Chicago";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { CTA, Panel } from "@/components/ui";

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

type Step = "type" | "time" | "contact" | "pay" | "done";

type QuestionConfig = {
  key: string; // q1-q6
  label: string;
};

/** Dynamic consultation questions based on duration. */
const QUESTIONS_BY_DURATION: Record<number, QuestionConfig[]> = {
  10: [
    { key: "q3", label: "What would you like to discuss during this call?" },
  ],
  15: [
    { key: "q1", label: "Have you traded before?" },
    { key: "q2", label: "What are you interested in learning / getting help with?" },
  ],
  20: [
    { key: "q1", label: "Have you traded before?" },
    { key: "q2", label: "What are you interested in learning?" },
    { key: "q3", label: "What would you like to know about HFT?" },
  ],
};

/** Full questionnaire for 30/45/60-minute consultations. */
const FULL_QUESTIONS: QuestionConfig[] = [
  { key: "q1", label: "Have you traded before?" },
  { key: "q2", label: "What are you interested in learning?" },
  { key: "q3", label: "What would you like to discuss during this call?" },
  { key: "q4", label: "What are your trading/financial education goals?" },
  { key: "q5", label: "What is currently stopping you from joining HFT?" },
  { key: "q6", label: "How did you hear about HFT?" },
];

/** Returns the active question configs for the selected consultation type. */
function getActiveQuestions(type: ConsultationType | null): QuestionConfig[] {
  if (!type) return FULL_QUESTIONS;
  const byDuration = QUESTIONS_BY_DURATION[type.durationMin];
  if (byDuration) return byDuration;
  return FULL_QUESTIONS;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

/** Local date string YYYY-MM-DD in America/Chicago timezone. */
function localDateString(d: Date): string {
  return d.toLocaleDateString("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/** Format a date string YYYY-MM-DD for display: "Friday, November 6". */
function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Use noon UTC to avoid timezone offset shifting the date
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Chicago",
  });
}

/** Format a time from an ISO string where time part is already in Chicago time. */
function formatTimeCT(iso: string): string {
  const [, timePart] = iso.split("T");
  const [hour, minute] = timePart.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("type");
  const [types, setTypes] = useState<ConsultationType[]>([]);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    smsConsent: false,
    q1: "", // Have you traded before?
    q2: "", // What are you interested in learning?
    q3: "", // What would you like to discuss?
    q4: "", // What are your goals?
    q5: "", // What is stopping you from joining HFT?
    q6: "", // How did you hear about HFT?
  });

  const activeQuestions = useMemo(
    () => getActiveQuestions(selectedType),
    [selectedType]
  );

  useEffect(() => {
    fetchTypes();
  }, []);

  async function fetchTypes() {
    try {
      const res = await fetch("/api/consultation-types");
      if (!res.ok) throw new Error("Failed to load consultation types.");
      const data = (await res.json()) as { types: ConsultationType[] };
      setTypes(data.types);
    } catch (err) {
      setError("Could not load consultation types. Try again later.");
    }
  }

  async function fetchSlots(dateStr: string) {
    if (!selectedType || !dateStr) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/availability?date=${dateStr}&durationMin=${selectedType.durationMin}`,
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
  }

  const handleSelectType = (type: ConsultationType) => {
    setSelectedType(type);
    setError("");
    // Reset calendar to today when changing type
    setCalendarDate(new Date());
    setSelectedDate(null);
    setSlots([]);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slot: AvailableSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setError("");
  };

  const handleSelectDate = (dateStr: string, isPast: boolean) => {
    if (isPast) return;
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setError("");
    fetchSlots(dateStr);
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

  /** Calendar days for the currently viewed month. */
  const calendarDays = useMemo(() => {
    const year = calendarDate.getUTCFullYear();
    const month = calendarDate.getUTCMonth();
    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0));
    const startOffset = firstDay.getUTCDay(); // 0 = Sunday
    const todayStr = localDateString(new Date());
    const days: {
      date: Date;
      dateStr: string;
      isPast: boolean;
      isCurrentMonth: boolean;
      isSelected: boolean;
      hasSlots: boolean;
    }[] = [];

    // Leading padding days from previous month
    for (let i = 0; i < startOffset; i++) {
      const d = new Date(Date.UTC(year, month, -startOffset + i + 1, 12, 0, 0));
      days.push({
        date: d,
        dateStr: localDateString(d),
        isPast: true,
        isCurrentMonth: false,
        isSelected: false,
        hasSlots: false,
      });
    }

    // Current month days
    for (let d = 1; d <= lastDay.getUTCDate(); d++) {
      const date = new Date(Date.UTC(year, month, d, 12, 0, 0));
      const dateStr = localDateString(date);
      days.push({
        date,
        dateStr,
        isPast: dateStr < todayStr,
        isCurrentMonth: true,
        isSelected: dateStr === selectedDate,
        hasSlots: dateStr === selectedDate && slots.length > 0,
      });
    }

    // Trailing padding days to next month
    const totalCells = Math.ceil((startOffset + lastDay.getUTCDate()) / 7) * 7;
    const trailing = totalCells - (startOffset + lastDay.getUTCDate());
    for (let i = 1; i <= trailing; i++) {
      const d = new Date(Date.UTC(year, month + 1, i, 12, 0, 0));
      days.push({
        date: d,
        dateStr: localDateString(d),
        isPast: true,
        isCurrentMonth: false,
        isSelected: false,
        hasSlots: false,
      });
    }

    return days;
  }, [calendarDate, selectedDate, slots.length]);

  const isFormValid = () => {
    if (!formData.firstName.trim()) return false;
    if (!formData.lastName.trim()) return false;
    if (!formData.email.trim()) return false;
    if (!formData.phone.trim()) return false;
    return true;
  };

  async function handleProceedToPayment() {
    if (!selectedType || !selectedSlot?.available) {
      setError("Please select a consultation type and an available time.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationTypeId: selectedType.id,
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          customerEmail: formData.email,
          customerPhone: formData.phone,
          appointmentAt: selectedSlot.start,
          durationMin: selectedType.durationMin,
          priceCents: selectedType.priceCents,
          questions: (() => {
            const obj: Record<string, string> = {};
            for (const q of activeQuestions) {
              obj[q.key] =
                ((formData as unknown) as Record<string, string>)[q.key] ??
                "";
            }
            return obj;
          })(),
          smsOptedIn: formData.smsConsent,
        }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        if (res.status === 409) {
          setError(err.error || "That appointment slot is no longer available.");
        } else {
          setError(err.error || "Failed to create booking. Try again.");
        }
        return;
      }

      const data = (await res.json()) as { checkoutUrl?: string };
      if (data.checkoutUrl) {
        setStep("pay");
        setTimeout(() => {
          window.location.href = data.checkoutUrl!;
        }, 100);
      } else {
        setError("No checkout URL returned. Try again.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError("Failed to start checkout. Try again.");
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  const stepOrder: Step[] = ["type", "time", "contact", "pay", "done"];
  const stepLabels: Record<Step, string> = {
    type: "Choose consultation type",
    time: "Choose appointment time",
    contact: "Your information",
    pay: "Payment",
    done: "Complete",
  };

  const currentMonthLabel = calendarDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/Chicago",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/8 bg-ink-950/80 backdrop-blur-xl">
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label="High Frequency Talent — home">
            <Logo />
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="rounded-sm px-3 py-2 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60 hover:text-white"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="container-page flex-1 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            {stepOrder.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-display text-[12px] font-semibold transition-colors ${
                    step === s
                      ? "bg-brand-600 text-white"
                      : stepOrder.indexOf(s) < stepOrder.indexOf(step)
                        ? "bg-white/10 text-white/50"
                        : "bg-white/8 text-white/30"
                  }`}
                >
                  {i + 1}
                </div>
                {i < 4 && (
                  <div className="h-px flex-1 bg-white/8" />
                )}
                <span
                  className={`font-display text-[13px] tracking-[0.14em] transition-colors ${
                    step === s ? "text-brand-500 font-semibold" : "text-white/50"
                  }`}
                >
                  {stepLabels[s]}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Choose consultation type */}
          {step === "type" && (
            <Panel className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
              <h2 className="font-display text-[24px] font-bold uppercase tracking-[0.04em] mb-6">
                Choose your consultation
              </h2>
              <p className="mb-6 text-[14px] text-white/60">
                Select the type of call you&apos;d like with Demi. All sessions are
                private, one-on-one, and held over video.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {types.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleSelectType(type)}
                    className={`cursor-pointer rounded-sm border p-4 text-left transition-colors ${
                      selectedType?.id === type.id
                        ? "border-brand-600 bg-brand-600/10"
                        : "border-white/12 bg-ink-950/40 hover:border-white/30"
                    }`}
                  >
                    <h3 className="font-display text-[16px] font-bold tracking-[0.04em]">
                      {type.name}
                    </h3>
                    <p className="mt-1 text-[13px] text-white/50">
                      {type.description}
                    </p>
                    <p className="mt-2 text-[14px] font-semibold text-white">
                      {money(type.priceCents)}
                    </p>
                    <p className="mt-1 text-[12px] text-white/40">
                      {type.durationMin} minutes
                    </p>
                  </div>
                ))}
              </div>
              {error && (
                <p className="mt-4 rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85">
                  {error}
                </p>
              )}
              <div className="mt-8 flex justify-end">
                <button
                  disabled={!selectedType}
                  onClick={() => {
                    if (selectedType) setStep("time");
                  }}
                  className="rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-500"
                >
                  Continue
                </button>
              </div>
            </Panel>
          )}

          {/* Step 2: Choose appointment time */}
          {step === "time" && selectedType && (
            <Panel className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="font-display text-[24px] font-bold uppercase tracking-[0.04em]">
                    Choose your appointment
                  </h2>
                  <p className="mt-1 text-[14px] text-white/60">
                    All times shown in Central Time (CT).
                  </p>
                </div>
                <Link
                  href="/"
                  className="rounded-sm px-3 py-2 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60 hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep("type");
                  }}
                >
                  ← Back
                </Link>
              </div>

              <div className="space-y-6">
                {/* Calendar */}
                <div className="rounded-sm border border-white/12 bg-ink-950/80 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={previousMonth}
                      className="rounded-sm px-3 py-1.5 border border-white/12 bg-ink-950 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      ‹
                    </button>
                    <span className="font-display text-[18px] font-bold text-white">
                      {currentMonthLabel}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="rounded-sm px-3 py-1.5 border border-white/12 bg-ink-950 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      ›
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {DAYS_OF_WEEK.map((day) => (
                      <div
                        key={day}
                        className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day) => {
                      const isSelectable =
                        day.isCurrentMonth && !day.isPast;
                      const isSelected = day.isSelected;
                      const hasSlots = day.hasSlots;

                      return (
                        <button
                          key={day.dateStr}
                          onClick={() =>
                            isSelectable
                              ? handleSelectDate(day.dateStr, day.isPast)
                              : undefined
                          }
                          disabled={!isSelectable}
                          className={`aspect-square rounded-sm border text-center text-[13px] transition-colors ${
                            !isSelectable
                              ? "border-transparent bg-ink-950 text-white/15 cursor-not-allowed"
                              : isSelected
                                ? "border-brand-600 bg-brand-600/20 text-brand-400 font-semibold"
                                : hasSlots
                                  ? "border-white/12 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
                                  : "border-white/8 bg-ink-950/40 text-white/40 hover:bg-white/5"
                          }`}
                        >
                          {day.date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {selectedDate && !slots.length && !loading && (
                    <p className="mt-2 text-[13px] text-white/50 text-center">
                      No available times for this date. Please choose another day.
                    </p>
                  )}
                </div>

                {/* Time slots */}
                {loading && (
                  <p className="text-[14px] text-white/50 text-center">
                    Loading available times…
                  </p>
                )}
                {!loading && selectedDate && slots.length === 0 && (
                  <p className="text-[14px] text-white/50 text-center">
                    No available times for {formatDateDisplay(selectedDate)}. Please choose another day.
                  </p>
                )}
                {!loading && selectedDate && slots.length > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-display text-[15px] font-bold text-white">
                        Available times
                      </p>
                      <p className="text-[13px] text-white/50">
                        {formatDateDisplay(selectedDate)}
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {slots.map((slot) => (
                        <button
                          key={slot.start}
                          onClick={() => handleSelectSlot(slot)}
                          disabled={!slot.available}
                          className={`cursor-pointer rounded-sm border px-4 py-3 transition-colors text-[14px] ${
                            slot.available
                              ? selectedSlot?.start === slot.start
                                ? "border-brand-600 bg-brand-600/10 text-brand-400 font-semibold"
                                : "border-white/12 bg-ink-950/40 text-white/80 hover:border-white/30 hover:bg-white/5"
                              : "border-white/8 bg-ink-950/20 text-white/25 cursor-not-allowed"
                          }`}
                        >
                          {formatTimeCT(slot.start)}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Selected summary */}
                {selectedSlot && selectedType && (
                  <div className="rounded-sm border border-brand-600/40 bg-brand-600/10 p-4 mt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-[14px] font-semibold text-white">
                          {selectedType.name}
                        </p>
                        <p className="mt-1 text-[13px] text-white/60">
                          {formatDateDisplay(selectedDate!)}
                        </p>
                        <p className="mt-1 text-[13px] text-white/60">
                          {formatTimeCT(selectedSlot.start)} –{" "}
                          {formatTimeCT(selectedSlot.end)} CT
                        </p>
                        <p className="mt-1 text-[13px] font-bold text-white">
                          {money(selectedType.priceCents)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    disabled={!selectedSlot?.available}
                    onClick={() => {
                      if (selectedSlot?.available) setStep("contact");
                    }}
                    className="rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-500"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </Panel>
          )}

          {/* Step 3: Contact information */}
          {step === "contact" && selectedType && selectedSlot && (
            <Panel className="rounded-lg border border-white/8 bg-ink-900/80 p-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="font-display text-[24px] font-bold uppercase tracking-[0.04em]">
                    Your information
                  </h2>
                  <p className="mt-1 text-[14px] text-white/60">
                    Tell us about yourself so we can prepare for your call.
                  </p>
                </div>
                <Link
                  href="/"
                  className="rounded-sm px-3 py-2 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60 hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep("time");
                  }}
                >
                  ← Back
                </Link>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="firstName"
                      className="block font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-2"
                    >
                      First name
                    </label>
                    <input
                      name="firstName"
                      id="firstName"
                      defaultValue={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-brand-600"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="lastName"
                      className="block font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-2"
                    >
                      Last name
                    </label>
                    <input
                      name="lastName"
                      id="lastName"
                      defaultValue={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-brand-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-2"
                    >
                      Email
                    </label>
                    <input
                      name="email"
                      id="email"
                      type="email"
                      defaultValue={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-brand-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-2"
                    >
                      Phone
                    </label>
                    <input
                      name="phone"
                      id="phone"
                      type="tel"
                      defaultValue={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-brand-600"
                    />
                  </div>
                </div>

                <div className="border-t border-white/8 pt-6">
                  <p className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-4">
                    Consultation questions
                  </p>
                  <div className="space-y-3">
                    {activeQuestions.map((q) => {
                      const value =
                        ((formData as unknown) as Record<string, string>)[
                          q.key
                        ] ?? "";
                      return (
                        <div key={q.key}>
                          <label
                            htmlFor={`q-${q.key}`}
                            className="block font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 mb-2"
                          >
                            {q.label}
                          </label>
                          <textarea
                            name={q.key}
                            id={`q-${q.key}`}
                            defaultValue={value}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [q.key]: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-brand-600"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      name="sms-consent"
                      id="sms-consent"
                      type="checkbox"
                      defaultChecked={formData.smsConsent}
                      onChange={(e) =>
                        setFormData({ ...formData, smsConsent: e.target.checked })
                      }
                      className="mt-1.5 rounded border-white/12 bg-ink-950 text-brand-600 focus:ring-brand-600"
                    />
                    <label
                      htmlFor="sms-consent"
                      className="text-[13px] leading-relaxed text-white/60 cursor-pointer select-none"
                    >
                      I agree to receive SMS messages from High Frequency Talent about my consultation, including booking confirmations, scheduling updates, reminders, payment/transaction updates, and customer support. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase.
                    </label>
                  </div>
                  <p className="pl-7 text-[13px] text-white/50">
                    See{" "}
                    <a href="/terms" className="text-brand-500 hover:text-brand-400 underline decoration-brand-700/60 underline-offset-2">
                      Terms &amp; Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-brand-500 hover:text-brand-400 underline decoration-brand-700/60 underline-offset-2">
                      Privacy Policy
                    </a>.
                  </p>
                </div>

                {error && (
                  <p className="mt-2 rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85">
                    {error}
                  </p>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    disabled={loading || !isFormValid()}
                    onClick={handleProceedToPayment}
                    className="rounded-sm bg-brand-600 px-7 py-3.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-500"
                  >
                    {loading ? "Creating booking…" : "Pay & confirm appointment"}
                  </button>
                </div>
              </form>
            </Panel>
          )}
        </div>
      </main>
    </div>
  );
}
