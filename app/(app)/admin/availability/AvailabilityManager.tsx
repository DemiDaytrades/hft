"use client";

import { useState, useEffect } from "react";
import { Panel } from "@/components/ui";
import type { ConsultationType } from "@/lib/consultation-types";

type AvailabilityRule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
};

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const money = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function AvailabilityManager({
  initialTypes,
}: {
  initialTypes: ConsultationType[];
}) {
  const [types, setTypes] = useState<ConsultationType[]>(initialTypes);
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [editingType, setEditingType] = useState<ConsultationType | null>(null);
  const [newType, setNewType] = useState<{
    name: string;
    description: string;
    durationMin: string;
    priceCents: string;
    active: boolean;
    displayOrder: string;
  }>({
    name: "",
    description: "",
    durationMin: "",
    priceCents: "",
    active: true,
    displayOrder: "0",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    try {
      const res = await fetch("/api/availability-rules");
      if (!res.ok) throw new Error("Failed to load availability rules.");
      const data = await res.json();
      setRules((data as { rules: AvailabilityRule[] }).rules);
    } catch {
      setError("Could not load availability rules.");
    }
  }

  async function saveType() {
    setLoading(true);
    setError("");
    try {
      const durationMin = Number.parseInt(newType.durationMin, 10);
      const priceCents = Number.parseInt(newType.priceCents, 10);
      if (!newType.name || !durationMin || !priceCents) {
        setError("Name, duration, and price are required.");
        return;
      }

      if (editingType) {
        await fetch(`/api/consultation-types/${editingType.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newType.name,
            description: newType.description,
            durationMin,
            priceCents,
            active: newType.active,
            displayOrder: Number.parseInt(newType.displayOrder, 10) || 0,
          }),
        });
      } else {
        await fetch("/api/consultation-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newType.name,
            description: newType.description,
            durationMin,
            priceCents,
            active: newType.active,
            displayOrder: Number.parseInt(newType.displayOrder, 10) || 0,
          }),
        });
      }

      const res = await fetch("/api/consultation-types");
      if (res.ok) {
        const data = (await res.json()) as { types: ConsultationType[] };
        setTypes(data.types);
      }
      setEditingType(null);
      setNewType({
        name: "",
        description: "",
        durationMin: "",
        priceCents: "",
        active: true,
        displayOrder: "0",
      });
      setSuccess("Consultation type saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteType(id: string) {
    if (
      !window.confirm("Delete this consultation type? This cannot be undone.")
    )
      return;
    try {
      await fetch(`/api/consultation-types/${id}`, { method: "DELETE" });
      setTypes((t) => t.filter((x) => x.id !== id));
      setSuccess("Consultation type deleted.");
    } catch {
      setError("Failed to delete type.");
    }
  }

  async function saveRules() {
    setLoading(true);
    setError("");
    try {
      for (const rule of rules) {
        await fetch("/api/availability-rules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dayOfWeek: rule.dayOfWeek,
            startTime: rule.startTime,
            endTime: rule.endTime,
            enabled: rule.enabled,
          }),
        });
      }
      setSuccess("Availability rules saved.");
    } catch {
      setError("Failed to save availability rules.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-sm border border-zone-sell/40 bg-zone-sell/10 px-4 py-3 text-[13.5px] text-white/85">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-sm border border-zone-buy/40 bg-zone-buy/10 px-4 py-3 text-[13.5px] text-white/85">
          {success}
        </div>
      )}

      {/* Consultation types */}
      <Panel className="rounded-lg border border-white/8 bg-ink-900/80 p-6">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.14em] text-white">
              Consultation types
            </h2>
            <p className="mt-1 text-[13px] text-white/50">
              Configure what customers can book and how much it costs.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingType(null);
              setNewType({
                name: "",
                description: "",
                durationMin: "",
                priceCents: "",
                active: true,
                displayOrder: "0",
              });
            }}
            className="rounded-sm bg-brand-600 px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-brand-500"
          >
            + Add type
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-4 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Name
                </th>
                <th className="px-4 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Duration
                </th>
                <th className="px-4 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Price
                </th>
                <th className="px-4 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Active
                </th>
                <th className="px-4 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Order
                </th>
                <th className="px-4 py-3 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.id} className="border-b border-white/8 hover:bg-white/3">
                  <td className="px-4 py-3">
                    {editingType?.id === t.id ? (
                      <input
                        defaultValue={t.name}
                        className="w-full rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white outline-none focus:border-brand-600"
                      />
                    ) : (
                      <span className="font-display text-[14px] text-white">{t.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{t.durationMin} min</td>
                  <td className="px-4 py-3">{money(t.priceCents)}</td>
                  <td className="px-4 py-3">
                    {t.active ? (
                      <span className="text-[12px] text-zone-buy font-semibold">
                        Yes
                      </span>
                    ) : (
                      <span className="text-[12px] text-white/50">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{t.displayOrder}</td>
                  <td className="px-4 py-3">
                    {editingType?.id === t.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={saveType}
                          className="px-3 py-1.5 rounded-sm bg-white/10 text-[12px] text-white hover:bg-white/20"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingType(null)}
                          className="px-3 py-1.5 rounded-sm bg-white/8 text-[12px] text-white/60 hover:bg-white/15"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingType(t)}
                          className="px-3 py-1.5 rounded-sm bg-white/8 text-[12px] text-white/60 hover:bg-white/15"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteType(t.id)}
                          className="px-3 py-1.5 rounded-sm bg-zone-sell/10 text-[12px] text-zone-sell hover:bg-zone-sell/20"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {editingType === null && (
                <tr className="border-b border-white/8">
                  <td className="px-4 py-3 col-span-6">
                    <div className="grid gap-3 sm:grid-cols-4">
                      <input
                        placeholder="Name (e.g. Quick Question)"
                        value={newType.name}
                        onChange={(e) =>
                          setNewType({ ...newType, name: e.target.value })
                        }
                        className="rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white outline-none focus:border-brand-600"
                      />
                      <input
                        placeholder="Description"
                        value={newType.description}
                        onChange={(e) =>
                          setNewType({ ...newType, description: e.target.value })
                        }
                        className="rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white outline-none focus:border-brand-600"
                      />
                      <input
                        type="number"
                        placeholder="Min"
                        value={newType.durationMin}
                        onChange={(e) =>
                          setNewType({ ...newType, durationMin: e.target.value })
                        }
                        className="rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white outline-none focus:border-brand-600"
                      />
                      <input
                        type="number"
                        placeholder="¢"
                        value={newType.priceCents}
                        onChange={(e) =>
                          setNewType({ ...newType, priceCents: e.target.value })
                        }
                        className="rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white outline-none focus:border-brand-600"
                      />
                    </div>
                    <div className="mt-3 flex gap-3">
                      <button
                        onClick={saveType}
                        disabled={loading}
                        className="rounded-sm bg-brand-600 px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-40 hover:bg-brand-500"
                      >
                        {loading ? "Saving…" : "Create type"}
                      </button>
                      <button
                        onClick={() => {
                          setNewType({
                            name: "",
                            description: "",
                            durationMin: "",
                            priceCents: "",
                            active: true,
                            displayOrder: "0",
                          });
                        }}
                        className="px-3 py-1.5 rounded-sm bg-white/8 text-[12px] text-white/60 hover:bg-white/15"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Availability rules */}
      <Panel className="rounded-lg border border-white/8 bg-ink-900/80 p-6">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.14em] text-white">
              Weekly availability
            </h2>
            <p className="mt-1 text-[13px] text-white/50">
              Demi&apos;s recurring availability by day of week (Central Time).
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {DAYS.map((day) => {
            const rule = rules.find((r) => r.dayOfWeek === day.value);
            return (
              <div
                key={day.value}
                className="flex items-center gap-3 border-b border-white/8 pb-3"
              >
                <span className="w-16 font-display text-[13px] text-white/60">
                  {day.label}
                </span>
                <input
                  type="time"
                  defaultValue={rule?.startTime || "09:00"}
                  onChange={(e) => {
                    setRules((rs) => {
                      const idx = rs.findIndex((r) => r.dayOfWeek === day.value);
                      const next = [...rs];
                      if (idx >= 0) {
                        next[idx] = { ...next[idx], startTime: e.target.value };
                      } else {
                        next.push({
                          id: crypto.randomUUID().replace(/-/g, ""),
                          dayOfWeek: day.value,
                          startTime: e.target.value,
                          endTime: rule?.endTime || "17:00",
                          enabled: true,
                        });
                      }
                      return next;
                    });
                  }}
                  className="rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white outline-none focus:border-brand-600"
                />
                <span className="w-8 text-[12px] text-white/40">to</span>
                <input
                  type="time"
                  defaultValue={rule?.endTime || "17:00"}
                  onChange={(e) => {
                    setRules((rs) => {
                      const idx = rs.findIndex((r) => r.dayOfWeek === day.value);
                      const next = [...rs];
                      if (idx >= 0) {
                        next[idx] = { ...next[idx], endTime: e.target.value };
                      } else {
                        next.push({
                          id: crypto.randomUUID().replace(/-/g, ""),
                          dayOfWeek: day.value,
                          startTime: rule?.startTime || "09:00",
                          endTime: e.target.value,
                          enabled: true,
                        });
                      }
                      return next;
                    });
                  }}
                  className="rounded-sm border border-white/12 bg-ink-950/80 px-3 py-2 text-[13px] text-white outline-none focus:border-brand-600"
                />
                <label className="flex items-center gap-2 text-[13px] text-white/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule?.enabled ?? true}
                    onChange={(e) => {
                      setRules((rs) => {
                        const idx = rs.findIndex((r) => r.dayOfWeek === day.value);
                        const next = [...rs];
                        if (idx >= 0) {
                          next[idx] = { ...next[idx], enabled: e.target.checked };
                        } else {
                          next.push({
                            id: crypto.randomUUID().replace(/-/g, ""),
                            dayOfWeek: day.value,
                            startTime: "09:00",
                            endTime: "17:00",
                            enabled: e.target.checked,
                          });
                        }
                        return next;
                      });
                    }}
                    className="rounded border-white/12 bg-ink-950 text-brand-600 focus:ring-brand-600"
                  />
                  Enabled
                </label>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <button
            onClick={saveRules}
            disabled={loading}
            className="rounded-sm bg-brand-600 px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-40 hover:bg-brand-500"
          >
            {loading ? "Saving…" : "Save availability rules"}
          </button>
        </div>
      </Panel>
    </div>
  );
}
