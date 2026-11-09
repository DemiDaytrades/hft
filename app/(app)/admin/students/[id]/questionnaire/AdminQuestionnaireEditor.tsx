"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import QuestionnaireForm from "@/app/(app)/consultation/questionnaire/QuestionnaireForm";
import StrategyConsultationReport from "./StrategyConsultationReport";

type Props = {
  userId: string;
  userName: string;
  userEmail: string;
};

export default function AdminQuestionnaireEditor({ userId, userName, userEmail }: Props) {
  const [canonicalIntakeExists, setCanonicalIntakeExists] = useState(false);
  const [protectedKeys, setProtectedKeys] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    load();
  }, [userId]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/consultation/questionnaire?userId=${userId}`);
      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update consultation");
      setQuestionnaire(data.questionnaire);
      setCanonicalIntakeExists(!!data.canonicalIntakeExists);
      setProtectedKeys(data.protectedKeys || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update consultation");
    } finally {
      setLoading(false);
    }
  }

  async function startOrCreate() {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/consultation/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-or-create", userId }),
      });
      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update consultation");
      setQuestionnaire(data.questionnaire);
      setMode("edit");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update consultation");
    } finally {
      setActionLoading(false);
    }
  }

  async function completeConsultation() {
    const hasData = questionnaire?.data && Object.keys(questionnaire.data).length > 0;
    if (!hasData) {
      if (!confirm("This consultation has little/no data saved. Save a draft first if needed. Complete anyway?")) return;
    } else {
      if (!confirm("Complete this consultation and go to Consultation Results?")) return;
    }
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/consultation/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", id: questionnaire.id, userId, data: questionnaire.data }),
      });
      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update consultation");
      setQuestionnaire(data.questionnaire);
      setMode("view");
      window.location.href = `/admin/students/${userId}/consultation-results`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update consultation");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <div className="text-white/60">Loading...</div>;

  const status = questionnaire?.status || "Not Started";

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {canonicalIntakeExists && <div className="rounded border border-white/10 p-4"><p>Overlapping answers are historical and read-only. Legacy-only answers and notes remain editable here.</p><Link className="text-brand-400" href={`/admin/student-intake-v2?studentUserId=${encodeURIComponent(userId)}`}>Open canonical consultation review</Link></div>}
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-ink-900/60 p-4">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Instructor Action</p>
          <p className="mt-1 text-[14px] text-white">Status: {status === "submitted" ? "Completed" : status === "in_progress" ? "In Progress" : "Not Started"}</p>
          <p className="text-[12px] text-white/50">Enter responses live or edit as needed. Save Draft is available in edit mode.</p>
        </div>
        <div className="flex gap-2">
          {status === "Not Started" || !questionnaire ? (
            <button onClick={startOrCreate} disabled={actionLoading || canonicalIntakeExists} className="rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 font-display text-[11px] uppercase tracking-[0.24em] text-white">
              Start Consultation
            </button>
          ) : (
            <>
              <button onClick={() => setMode(mode === "edit" ? "view" : "edit")} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[11px] uppercase tracking-[0.24em] text-white/70">
                {mode === "edit" ? "View Read-Only" : "Edit Consultation"}
              </button>
              {mode === "edit" && status !== "submitted" && (
                <button onClick={completeConsultation} disabled={actionLoading} className="rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 font-display text-[11px] uppercase tracking-[0.24em] text-white">
                  Complete Consultation
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {mode === "edit" && questionnaire && (
        <div className="space-y-4">
          <div className="rounded-lg border border-brand-600/40 bg-ink-900/40 p-4">
            <p className="text-[12px] text-white/70">Instructor Entry Mode - Responses are saved as draft. Use "Complete Consultation" when finished.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-ink-900/60">
            <QuestionnaireForm questionnaire={questionnaire} apiEndpoint="/api/admin/consultation/questionnaire" userId={userId} canonicalIntakeExists={canonicalIntakeExists} protectedKeys={protectedKeys} />
          </div>
        </div>
      )}
      {mode === "view" && questionnaire && (
        <StrategyConsultationReport userId={userId} userName={userName} questionnaire={questionnaire} onEdit={() => setMode("edit")} />
      )}
    </div>
  );
}
