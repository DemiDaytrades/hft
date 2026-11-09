"use client";

import { useEffect, useState } from "react";

type Props = { assignmentId: string; type?: "homework" | "practical" | "chart_demo" };

export function AssignmentPanel({ assignmentId, type = "homework" }: Props) {
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<"not_started" | "in_progress" | "submitted" | "under_review" | "approved" | "revision_required">("not_started");
  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [originalId, setOriginalId] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/academy/assignments/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assignmentId, action: "save", responseText: response }) });
      setStatus("in_progress");
    } finally {
      setSaving(false);
    }
  }

  async function submit() {
    setSaving(true);
    try {
      const res = await fetch("/api/academy/assignments/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assignmentId, action: "submit", responseText: response }) });
      const data: any = await res.json();
      if (data.submission) {
        setStatus(data.submission.status);
        setOriginalId(data.submission.id);
        setSubmissions((prev) => [...prev, data.submission]);
      } else {
        setStatus("submitted");
      }
    } finally {
      setSaving(false);
    }
  }

  async function resubmit() {
    if (!originalId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/academy/assignments/resubmit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ originalSubmissionId: originalId, responseText: response, fileUrls: files }) });
      const data: any = await res.json();
      if (data.submission) {
        setStatus("submitted");
        setOriginalId(data.submission.id);
        setSubmissions((prev) => [...prev, data.submission]);
      }
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assignmentId", assignmentId);
      const res = await fetch("/api/academy/assignments/upload", { method: "POST", body: formData });
      const data: any = await res.json();
      if (data.success) {
        setFiles((prev) => [...prev, data]);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }

  const statusLabel: Record<string, string> = {
    not_started: "Not Started",
    in_progress: "In Progress",
    submitted: "Submitted",
    under_review: "Under Review",
    approved: "Approved",
    revision_required: "Revision Required"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-4">
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40">{type === "chart_demo" ? "Chart Demonstration / Practical" : "Homework Assignment"}</p>
          <p className="mt-1 text-[13px] text-white/70">Status: {statusLabel[status]}</p>
        </div>
        <div className="flex gap-2">
          {status !== "submitted" && status !== "under_review" && status !== "approved" && status !== "revision_required" && (
            <>
              <button onClick={save} disabled={saving} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[10px] uppercase tracking-[0.24em] text-white/70">Save</button>
              <button onClick={submit} disabled={saving || !response.trim()} className="rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 font-display text-[10px] uppercase tracking-[0.24em] text-white disabled:opacity-40">Submit</button>
            </>
          )}
          {status === "revision_required" && (
            <button onClick={resubmit} disabled={saving} className="rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 font-display text-[10px] uppercase tracking-[0.24em] text-white">Resubmit with Revisions</button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
        <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Instructions</p>
        <p className="mt-2 text-[14px] text-white/70">Complete the assignment. For chart demonstrations, upload annotated screenshots and explain your markings, reasoning, entry/stop/target, and confluence.</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
        <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Your Response / Explanation</p>
        <textarea value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Write your response, analysis, calculations, or chart explanation..." className="mt-3 w-full rounded-sm border border-white/12 bg-black/40 p-4 text-[14px] text-white placeholder:text-white/30" rows={10} />
      </div>

      {(type === "chart_demo" || type === "practical") && (
        <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Chart Screenshot Upload</p>
          <p className="mt-2 text-[13px] text-white/50">Upload annotated chart images (PNG, JPG, JPEG, WebP). Max 10MB. Files are stored securely and associated with your submission.</p>
          <div className="mt-4 flex items-center gap-3">
            <label className="cursor-pointer rounded-sm border border-white/12 px-4 py-2 font-display text-[10px] uppercase tracking-[0.24em] text-white/70">
              {uploading ? "Uploading..." : "Choose File"}
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={uploadFile} className="hidden" disabled={uploading} />
            </label>
            <span className="text-[12px] text-white/30">{files.length} file(s) attached</span>
          </div>
        </div>
      )}

      {status === "revision_required" && feedback && (
        <div className="rounded-lg border border-brand-600/60 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-brand-400">Instructor Feedback</p>
          <p className="mt-2 text-[14px] text-white/70 whitespace-pre-wrap">{feedback}</p>
        </div>
      )}

      {status === "approved" && (
        <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Approved</p>
          <p className="mt-2 text-[14px] text-white/70">This submission has been approved by the instructor.</p>
        </div>
      )}

      <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
        <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Submission History</p>
        <p className="mt-2 text-[13px] text-white/50">All submissions and revisions are tracked. Prior evidence is preserved across resubmissions.</p>
        {submissions.length > 0 && (
          <div className="mt-3 space-y-2">
            {submissions.map((s, idx) => (
              <div key={idx} className="text-[12px] text-white/60">Revision {s.attempt_number || idx+1} • {s.status}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
