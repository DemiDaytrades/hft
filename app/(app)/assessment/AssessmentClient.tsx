"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { PQuestion } from "@/lib/placement-assessment";
import { ensureAttempt, saveAnswers, submitAssessment, getLatestResult } from "./actions";

export default function AssessmentClient({ userId, activeAttempt, latestResult, eligibility, questions }: { userId: string; activeAttempt: any; latestResult: any; eligibility: string; questions: Omit<PQuestion,"correct"|"explanation">[] }) {
  const router = useRouter();
  const [attemptId, setAttemptId] = useState<string | null>(activeAttempt?.id ?? null);
  const [answers, setAnswers] = useState<any>(activeAttempt?.answers ? JSON.parse(activeAttempt.answers) : {});
  const [index, setIndex] = useState(0);
  const [review, setReview] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!attemptId) {
      ensureAttempt().then(setAttemptId);
    }
  }, [attemptId]);

  useEffect(() => {
    if (!attemptId || result) return;
    const t = setTimeout(() => {
      saveAnswers(attemptId, answers).catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [answers, attemptId, result]);

  const q = questions[index];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  async function handleSaveExit() {
    if (attemptId) await saveAnswers(attemptId, answers);
    router.push("/dashboard");
  }

  async function handleSubmit() {
    if (answeredCount < questions.length) return;
    setSaving(true);
    setError("");
    try { const res = await submitAssessment(attemptId!, answers); setResult(res); } catch (e) { setError(e instanceof Error ? e.message : "Unable to submit."); } finally { setSaving(false); }
  }

  if (result) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold uppercase">HFT Placement Results</h1>
        <p className="text-white">Overall Score: {result.overallScore}/100</p>
        <p className="text-white">Placement Level: {result.recommendedLevel}</p>
        <p className="text-white">Recommended HFT Track: {result.recommendedTrack}</p>
        <div className="space-y-2">
          <p className="text-white">Forex Knowledge: {result.categoryScores.forexKnowledge}</p>
          <p className="text-white">Risk Management: {result.categoryScores.riskManagement}</p>
          <p className="text-white">Execution: {result.categoryScores.execution}</p>
          <p className="text-white">Psychology: {result.categoryScores.psychology}</p>
          <p className="text-white">Analysis: {result.categoryScores.analysis}</p>
        </div>
        <div>
          <h2 className="font-bold text-white">Strengths</h2>
          <p className="text-white/80">{result.strengths.join(", ")}</p>
        </div>
        <div>
          <h2 className="font-bold text-white">Focus Areas</h2>
          <p className="text-white/80">{result.focusAreas.join(", ")}</p>
        </div>
        {result.safeguardReason && <p className="text-white/60">{result.safeguardReason}</p>}
        <p className="text-white/60">Your placement helps HFT build your personalized training program. Your instructor may adjust your final training path based on your Strategy Call and demonstrated skills.</p>
      </div>
    );
  }

  if (review) {
    const unanswered = questions.filter((q) => !answers[q.id] || (Array.isArray(answers[q.id]) && answers[q.id].length === 0));
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold uppercase">Review Assessment</h1>{error && <p role="alert" className="text-red-300">{error}</p>}
        <p className="text-white/60">Unanswered: {unanswered.length}</p>
        <button disabled={unanswered.length > 0 || saving} onClick={handleSubmit} className="rounded bg-brand-600 px-4 py-2 text-white">
          {saving ? "Submitting..." : "Submit Assessment"}
        </button>
        <button onClick={() => setReview(false)} className="rounded bg-white/10 px-4 py-2 text-white">Back to Questions</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold uppercase">HFT Placement Assessment</h1>
      <p className="text-white/60">{eligibility}</p>
      <p className="text-white/60">Question {index + 1} / {questions.length} · {answeredCount}/{questions.length} answered</p>
      <div className="h-2 w-full rounded bg-white/10">
        <div className="h-2 rounded bg-brand-600" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-white/60">Category: {q.category}</p>
      <div className="rounded-lg border border-white/10 bg-ink-900/60 p-5">
        <p className="text-white">{q.question}</p>
        {q.choices.map((c: string) => (
          <label key={c} className="block text-white/80">
            <input
              type={q.type === "multiple-select" ? "checkbox" : "radio"}
              name={q.id}
              value={c}
              checked={q.type === "multiple-select" ? (answers[q.id] ?? []).includes(c) : (answers[q.id] ?? [])[0] === c}
              onChange={(e) => {
                if (q.type === "multiple-select") {
                  const cur = answers[q.id] ?? [];
                  setAnswers({ ...answers, [q.id]: e.target.checked ? [...cur, c] : cur.filter((x: string) => x !== c) });
                } else {
                  setAnswers({ ...answers, [q.id]: [c] });
                }
              }}
            /> {c}
          </label>
        ))}
      </div>
      <div className="flex gap-3">
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} className="rounded bg-white/10 px-4 py-2 text-white">Previous</button>
        {index < questions.length - 1 ? (
          <button onClick={() => setIndex(index + 1)} className="rounded bg-brand-600 px-4 py-2 text-white">Next</button>
        ) : (
          <button onClick={() => setReview(true)} className="rounded bg-brand-600 px-4 py-2 text-white">Review</button>
        )}
        <button onClick={handleSaveExit} className="rounded bg-white/10 px-4 py-2 text-white">Save & Exit</button>
      </div>
      {latestResult && (
        <div className="rounded-lg border border-white/10 bg-ink-900/60 p-5">
          <h2 className="font-bold text-white">Latest Result</h2>
          <p className="text-white/80">Overall: {latestResult.overallScore}/100 · {latestResult.recommendedLevel} · {latestResult.recommendedTrack}</p>
        </div>
      )}
    </div>
  );
}
