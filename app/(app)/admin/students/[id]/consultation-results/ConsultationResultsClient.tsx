"use client";

import { useEffect, useState } from "react";

export default function ConsultationResultsClient({ userId, questionnaire }: { userId: string; questionnaire: any }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState<any>({ latest: null, history: [], published: null });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/consultation/game-plan?userId=${userId}`);
      const json: any = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [userId]);

  async function action(act: string, extra: any = {}) {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/consultation/game-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: act, userId, ...extra }),
      });
      const json: any = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setData((prev: any) => ({ ...prev, latest: json.latest }));
      setMessage("Success");
      load();
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  }

  const latest: any = data.latest;
  const status = latest?.status || "none";

  return (
    <div className="rounded-lg border border-white/10 bg-ink-900/60 p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Consultation Results Workflow</p>
          <p className="mt-1 text-[13px] text-white/70">Game Plan Status: {status} • Questionnaire: {questionnaire?.status === "submitted" ? "Completed" : questionnaire?.status || "Not Started"}</p>
          <p className="text-[11px] text-white/50">Private data remains instructor-only until Publish. Publishing does NOT assign Academy content.</p>
          {data.published && <p className="text-[11px] text-emerald-400/80">Currently published version {data.published.version}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => action("generate-draft")} disabled={saving || status === "published" || status === "approved"} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[11px] uppercase tracking-[0.24em] text-white/70 disabled:opacity-40">
            Generate/Update Draft
          </button>
          <button onClick={() => action("review", { versionId: latest?.id })} disabled={saving || !latest?.id || status === "published" || status === "approved" || status === "review"} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[11px] uppercase tracking-[0.24em] text-white/70 disabled:opacity-40">
            Move to Review
          </button>
          <button onClick={() => action("approve", { versionId: latest?.id })} disabled={saving || !latest?.id || status !== "review"} className="rounded-sm border border-brand-600/60 px-4 py-2 font-display text-[11px] uppercase tracking-[0.24em] text-white disabled:opacity-40">
            Approve Plan
          </button>
          <button onClick={() => { if (confirm("Publish approved Game Plan to student? Only student_visible_payload will be visible.")) action("publish", { versionId: latest?.id }); }} disabled={saving || !latest?.id || status !== "approved"} className="rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 font-display text-[11px] uppercase tracking-[0.24em] text-white disabled:opacity-40">
            Publish to Student
          </button>
          <button onClick={() => { if (confirm("Create new revision from published version? Published version will remain unchanged.")) action("create-revision", { versionId: data.published?.published_version_id || latest?.id }); }} disabled={saving || !data.published} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[11px] uppercase tracking-[0.24em] text-white/70 disabled:opacity-40">
            Create Revision
          </button>
        </div>
      </div>
      {message && <p className="text-[12px] text-white/60">{message}</p>}
      {data.history?.length > 0 && (
        <div className="text-[11px] text-white/50">
          History: {data.history.map((h: any) => `v${h.version}(${h.status})`).join(" → ")}
        </div>
      )}
    </div>
  );
}
