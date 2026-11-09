import type { Answer, AssessmentReview, Concept, HomeworkBranch, InteractiveLesson, Question, StudentLesson, StudentQuestion } from "./contracts";

export function interactiveLesson(content: unknown): InteractiveLesson | null {
  if (typeof content !== "string" || !content.startsWith("{")) return null;
  try {
    const doc = JSON.parse(content);
    return doc?.format === "hft-interactive-v1" && typeof doc.version === "string" && Array.isArray(doc.steps) && Array.isArray(doc.questionBanks) ? doc : null;
  } catch { return null; }
}
export function studentQuestion(q: Question): StudentQuestion {
  const { correct: _correct, rubric: _rubric, ...safe } = q;
  return safe;
}
export function studentLesson(doc: InteractiveLesson): StudentLesson {
  const { questionBanks: _banks, homework: _homework, steps, ...safe } = doc;
  return { ...safe, steps: steps.map(step => ({ ...step, activities: step.activities?.map(a => {
    const { correct: _c, rubric: _r, feedback: _f, retryFeedback: _retry, ...activity } = a;
    return activity;
  }) })) };
}
export function matchesAnswer(actual: unknown, expected: unknown): boolean {
  if (typeof actual !== typeof expected || actual === null || expected === null) return actual === expected;
  if (Array.isArray(expected)) return Array.isArray(actual) && actual.length === expected.length && actual.every((v,i) => matchesAnswer(v,expected[i]));
  if (typeof expected === "object") {
    if (Array.isArray(actual)) return false;
    const a = actual as Record<string,unknown>, e = expected as Record<string,unknown>;
    const keys = Object.keys(e);
    return Object.keys(a).length === keys.length && keys.every(k => Object.hasOwn(a,k) && matchesAnswer(a[k],e[k]));
  }
  return actual === expected;
}
export function validateAnswer(q: Question, value: unknown): asserts value is Answer {
  const bad = () => { throw new Error(`Provide a valid answer for ${q.id}.`); };
  if (q.kind === "choice") {
    if (typeof value !== "string" || !q.options?.some(o=>o.id===value)) bad();
  } else if (q.kind === "written") {
    if (typeof value !== "string" || value.trim().length < 10 || value.length > 5000) bad();
  } else if (q.kind === "true_false_explain") {
    const v = value as Record<string,unknown>;
    if (!v || Array.isArray(v) || typeof v !== "object" || !["true","false"].includes(String(v.choice)) || typeof v.explanation !== "string" || v.explanation.trim().length < 10 || v.explanation.length > 5000 || Object.keys(v).some(k=>!["choice","explanation"].includes(k))) bad();
  } else if (q.kind === "ordering") {
    if (!Array.isArray(value) || value.length !== q.items?.length || new Set(value).size !== value.length || value.some(id=>typeof id!=="string" || !q.items?.some(i=>i.id===id))) bad();
  } else if (q.kind === "matching") {
    const v = value as Record<string,unknown>;
    if (!v || typeof v!=="object" || Array.isArray(v) || Object.keys(v).length!==q.items?.length || !q.items?.every(i=>Object.hasOwn(v,i.id) && q.targets?.some(t=>t.id===v[i.id])) || new Set(Object.values(v)).size!==Object.values(v).length) bad();
  }
}
export function assessmentResult(questions: Question[], answers: Record<string,Answer>, review: AssessmentReview | null) {
  const grades: Record<string,boolean> = {};
  for (const q of questions) {
    const manual = q.kind === "written" || q.kind === "true_false_explain";
    grades[q.id] = manual ? review?.grades[q.id] === true : matchesAnswer(answers[q.id],q.correct);
    if (q.kind === "true_false_explain" && !matchesAnswer((answers[q.id] as Record<string,string>)?.choice,q.correct)) grades[q.id]=false;
  }
  const mastery = Object.fromEntries(questions.filter(q=>q.mastery).map(q=>[q.id, !!review?.mastery[q.id] && grades[q.id]]));
  const masteryPassed = !!review && Object.keys(mastery).length > 0 && Object.values(mastery).every(Boolean);
  const score = review ? Math.round(Object.values(grades).filter(Boolean).length / questions.length * 100) : null;
  const weakConcepts = [...new Set(questions.filter(q=>!grades[q.id] || (q.mastery && !mastery[q.id])).map(q=>q.concept))] as Concept[];
  let branch: HomeworkBranch = "strong";
  if (review) {
    if ((score ?? 0)<50 || weakConcepts.length>=3) branch="broad";
    else if (weakConcepts.some(c=>c==="barter" || c==="functions")) branch="barter";
    else if (weakConcepts.length) branch="currency";
  }
  return { grades, score, mastery, masteryPassed, weakConcepts, branch, passed: !!review && (score ?? 0)>=80 && masteryPassed };
}
