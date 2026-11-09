"use client";

import type { Answer, StudentQuestion } from "@/lib/academy/learning/contracts";

export const inputClass = "w-full rounded-lg border border-white/20 bg-ink-900 p-3 text-sm text-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30";
export const buttonClass = "rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400";

export function QuestionInput({ question, value, onChange, disabled = false }: { question: StudentQuestion; value?: Answer; onChange: (answer: Answer) => void; disabled?: boolean }) {
  const q = question;
  if (q.kind === "choice") return <fieldset disabled={disabled} className="lx-response-list space-y-3"><legend className="sr-only">{q.prompt}</legend>{q.options?.map((option,index)=><label key={option.id} className={`lx-response group relative flex min-h-20 cursor-pointer items-center gap-4 rounded-xl border px-4 py-5 text-sm transition sm:px-5 ${value===option.id?"is-selected border-brand-400 bg-brand-500/10":"border-white/15 bg-white/[.025] hover:border-white/40"}`}><input type="radio" name={q.id} value={option.id} checked={value===option.id} onChange={()=>onChange(option.id)} className="peer sr-only"/><span aria-hidden="true" className="lx-response-letter">{String.fromCharCode(65+index)}</span><span className="min-w-0 flex-1 leading-6">{option.label}</span><span className="lx-response-indicator" aria-hidden="true">{value===option.id?'✓':''}</span></label>)}</fieldset>;
  if (q.kind === "matching") {
    const selected = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    return <div className="lx-matching space-y-3">{q.items?.map(item => <label key={item.id} className="grid items-center gap-2 text-sm sm:grid-cols-2"><span>{item.label}</span><select className={inputClass} disabled={disabled} value={selected[item.id] ?? ""} onChange={e => onChange({ ...selected, [item.id]: e.target.value })}><option value="">Choose a match</option>{q.targets?.map(target => <option key={target.id} value={target.id}>{target.label}</option>)}</select></label>)}</div>;
  }
  if (q.kind === "ordering") {
    const order = Array.isArray(value) ? value : [...(q.items ?? [])].reverse().map(item => item.id);
    function move(index: number, direction: number) { const next = [...order]; [next[index], next[index + direction]] = [next[index + direction], next[index]]; onChange(next); }
    return <div><p className="mb-3 text-xs text-white/50">Use Move up / Move down to arrange the sequence, then check your answer.</p><ol className="space-y-2">{order.map((id, index) => <li key={id} className="lx-ordering-item flex flex-wrap items-center gap-3 rounded-xl border border-white/15 bg-white/[.025] p-4"><span className="mr-auto text-sm"><span className="mr-3 text-brand-400">{index + 1}.</span>{q.items?.find(item => item.id === id)?.label}</span><button type="button" disabled={disabled || index === 0} onClick={() => move(index, -1)} aria-label={`Move ${q.items?.find(item => item.id === id)?.label} up`} className="rounded border border-white/20 px-3 py-2 text-xs disabled:opacity-30">Move up</button><button type="button" disabled={disabled || index === order.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${q.items?.find(item => item.id === id)?.label} down`} className="rounded border border-white/20 px-3 py-2 text-xs disabled:opacity-30">Move down</button></li>)}</ol></div>;
  }
  if (q.kind === "true_false_explain") {
    const answer = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    return <div className="space-y-3"><label className="block text-sm">Your judgment<select disabled={disabled} className={`${inputClass} mt-2`} value={answer.choice ?? ""} onChange={e => onChange({ ...answer, choice: e.target.value })}><option value="">Choose true or false</option><option value="true">True</option><option value="false">False</option></select></label><label className="block text-sm">Explain your reasoning<textarea disabled={disabled} className={`${inputClass} mt-2`} rows={4} value={answer.explanation ?? ""} onChange={e => onChange({ ...answer, explanation: e.target.value })} /></label></div>;
  }
  return <label className="block text-sm"><span className="sr-only">Your response to {q.prompt}</span><textarea disabled={disabled} rows={5} className={inputClass} placeholder="Explain in your own words…" value={typeof value === "string" ? value : ""} onChange={e => onChange(e.target.value)} /></label>;
}
