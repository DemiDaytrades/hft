"use client";

import { useEffect, useState } from "react";

type Choice = { id: string; choice_text: string; sort_order: number };
type Question = { id: string; question_text: string; question_type: string; explanation?: string; points?: number; choices: Choice[] };

export function QuizRunner({ quizId }: { quizId: string }) {
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    start();
  }, [quizId]);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/quiz/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quizId }) });
      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start");
      setAttempt(data.attempt);
      const qres = await fetch(`/api/academy/quiz/questions?quizId=${quizId}`);
      const qdata: any = await qres.json();
      if (!qres.ok) throw new Error(qdata.error || "Failed to load questions");
      setQuiz(qdata.quiz);
      setQuestions(qdata.questions || []);
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  function selectAnswer(qid: string, choiceId: string, multi: boolean) {
    if (multi) {
      const cur = answers[qid] || [];
      if (cur.includes(choiceId)) {
        setAnswers({ ...answers, [qid]: cur.filter((c) => c !== choiceId) });
      } else {
        setAnswers({ ...answers, [qid]: [...cur, choiceId] });
      }
    } else {
      setAnswers({ ...answers, [qid]: [choiceId] });
    }
  }

  async function handleSubmit() {
    if (!attempt) return;
    setSubmitting(true);
    try {
      const responses = Object.entries(answers).map(([questionId, selectedChoiceIds]) => ({ questionId, selectedChoiceIds }));
      const res = await fetch("/api/academy/quiz/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attemptId: attempt.id, responses }) });
      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setResult(data);
      setConfirm(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-white/60">Loading quiz...</div>;
  if (error) return <div className="p-8 text-center text-brand-400">{error}</div>;
  if (result) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Quiz Result</p>
          <h2 className="mt-2 font-display text-[32px] font-bold uppercase tracking-[0.03em] text-white">Score: {result.scorePercent}%</h2>
          <p className="mt-2 text-[14px] text-white/70">{result.passed ? "Passed" : "Not Passed"} • {result.earnedPoints}/{result.totalPoints} points • Attempts Used: {result.attemptsUsed} of {result.maxAttempts}</p>
        </div>
        {!result.passed && result.attemptsUsed < result.maxAttempts && (
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
            <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Attempt {result.attemptsUsed} Failed</p>
            <p className="mt-2 text-[14px] text-white/70">Review relevant lessons and topics. You have {result.maxAttempts - result.attemptsUsed} attempt remaining. Correct answers are not shown before/after in full form to preserve learning integrity.</p>
            <button onClick={() => { setResult(null); setAnswers({}); setCurrent(0); start(); }} className="mt-4 rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-2.5 font-display text-[11px] uppercase tracking-[0.24em] text-white">Use Attempt {result.attemptsUsed + 1}</button>
          </div>
        )}
        {!result.passed && result.instructorReviewRequired && (
          <div className="rounded-lg border border-brand-600/60 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
            <p className="font-display text-[12px] uppercase tracking-[0.28em] text-brand-400">Instructor Review Required</p>
            <p className="mt-2 text-[14px] text-white/70">Attempts Used: {result.attemptsUsed} of {result.maxAttempts}. Further automatic attempts are locked. Your instructor will review your weak areas and may authorize exactly one additional attempt.</p>
          </div>
        )}
        {result.passed && (
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
            <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Educational Feedback</p>
            <p className="mt-2 text-[14px] text-white/70">Review explanations in lesson context as needed. Answer keys are not revealed.</p>
          </div>
        )}
      </div>
    );
  }

  const q = questions[current];
  if (!q) return <div className="p-8 text-center text-white/60">No questions available.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-4">
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40">{quiz?.title || "Quiz"}</p>
          <p className="mt-1 text-[13px] text-white/70">Attempt {attempt?.attempt_number || 1} of {quiz?.max_attempts || 2} • Question {current + 1} of {questions.length}</p>
        </div>
        <button onClick={() => setConfirm(true)} disabled={Object.keys(answers).length === 0 || submitting} className="rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-2.5 font-display text-[11px] uppercase tracking-[0.24em] text-white disabled:opacity-40">Submit Quiz</button>
      </div>
      {confirm && (
        <div className="rounded-lg border border-white/10 bg-black/80 p-6">
          <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Confirm Submission</p>
          <p className="mt-2 text-[14px] text-white/70">Submit your answers now? You cannot change answers after submission.</p>
          <div className="mt-4 flex gap-3">
            <button onClick={handleSubmit} disabled={submitting} className="rounded-sm bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-2.5 font-display text-[11px] uppercase tracking-[0.24em] text-white">Confirm & Submit</button>
            <button onClick={() => setConfirm(false)} className="rounded-sm border border-white/12 px-6 py-2.5 font-display text-[11px] uppercase tracking-[0.24em] text-white/70">Cancel</button>
          </div>
        </div>
      )}
      <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-8 space-y-6">
        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40">Question {current + 1}</p>
          <p className="mt-3 text-[18px] text-white">{q.question_text}</p>
        </div>
        <div className="space-y-2">
          {(q.choices || []).map((c) => {
            const selected = (answers[q.id] || []).includes(c.id);
            return (
              <button key={c.id} onClick={() => selectAnswer(q.id, c.id, false)} className={`w-full text-left rounded-sm border p-4 transition-colors ${selected ? 'border-brand-500 bg-brand-500/10' : 'border-white/12 hover:border-white/30'}`}>
                <span className="text-[14px] text-white">{c.choice_text}</span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between">
          <button disabled={current === 0} onClick={() => setCurrent(current - 1)} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[10px] uppercase tracking-[0.24em] text-white/70 disabled:opacity-30">Previous</button>
          <button disabled={current === questions.length - 1} onClick={() => setCurrent(current + 1)} className="rounded-sm border border-white/12 px-4 py-2 font-display text-[10px] uppercase tracking-[0.24em] text-white/70 disabled:opacity-30">Next</button>
        </div>
      </div>
    </div>
  );
}
