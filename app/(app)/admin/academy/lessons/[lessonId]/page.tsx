import { requireAdmin } from "@/lib/dal";
import { db, newId, nowIso } from "@/lib/academy";
import { redirect } from "next/navigation";
import { Panel } from "@/components/ui";

import {CLASSIFICATIONS,DOMAINS,type Classification,type Domain} from '@/lib/learning-path/contracts';

export const dynamic = "force-dynamic";

export default async function AdminLessonEditPage({ params }: { params: Promise<{ lessonId: string }> }) {
  await requireAdmin();
  const { lessonId } = await params;
  const lesson = await db().prepare(`SELECT * FROM "academy_lesson" WHERE id = ?;`).bind(lessonId).first<any>();
  if (!lesson) redirect("/admin/academy");
  const module = await db().prepare(`SELECT * FROM "academy_module" WHERE id = ?;`).bind(lesson.module_id).first<any>();
  const course = await db().prepare(`SELECT * FROM "academy_course" WHERE id = ?;`).bind(module.course_id).first<any>();
  
  const quiz = await db().prepare(`SELECT * FROM "academy_quiz" WHERE lesson_id = ? LIMIT 1;`).bind(lessonId).first<any>();
  const assignment = await db().prepare(`SELECT * FROM "academy_assignment" WHERE lesson_id = ? LIMIT 1;`).bind(lessonId).first<any>();
  const questions = quiz ? await db().prepare(`SELECT * FROM "academy_quiz_question" WHERE quiz_id = ? ORDER BY sort_order ASC;`).bind(quiz.id).all<any>() : { results: [] };
  
  async function updateLesson(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const lesson_type = (formData.get("lesson_type") as string) || "text";
    const content = (formData.get("content") as string) || "";
    const video_url = (formData.get("video_url") as string) || null;
    const estimated_minutes = formData.get("estimated_minutes") ? parseInt(formData.get("estimated_minutes") as string) : null;
    const sort_order = parseInt((formData.get("sort_order") as string) || "0");
    const status = (formData.get("status") as string) || "draft";
    const classification=String(formData.get('placement_classification')||'REQUIRED_CORE');
    const domains=formData.getAll('competency_domains').map(String);
    if(!CLASSIFICATIONS.includes(classification as Classification)||domains.some(d=>!DOMAINS.includes(d as Domain))||(lessonId==='hft-money-1'&&classification!=='REQUIRED_CORE'))throw new Error('Invalid curriculum placement metadata; Lesson 1 remains required core.');
    const requires_quiz = formData.get("requires_quiz") ? 1 : 0;
    const requires_assignment = formData.get("requires_assignment") ? 1 : 0;
    const requires_practical = formData.get("requires_practical") ? 1 : 0;
    const passing_gate = formData.get("passing_gate") ? 1 : 0;
    const now = nowIso();
    await db().prepare(`UPDATE "academy_lesson" SET title=?, description=?, lesson_type=?, content=?, video_url=?, estimated_minutes=?, sort_order=?, status=?, requires_quiz=?, requires_assignment=?, requires_practical=?, passing_gate=?, placement_classification=?, competency_domains_json=?, updated_at=? WHERE id=?;`)
      .bind(title, description, lesson_type, content, video_url, estimated_minutes, sort_order, status, requires_quiz, requires_assignment, requires_practical, passing_gate, classification, JSON.stringify(domains), now, lessonId).run();
    redirect(`/admin/academy/lessons/${lessonId}`);
  }
  
  async function upsertQuiz(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = (formData.get("quiz_title") as string) || `${lesson.title} Quiz`;
    const instructions = (formData.get("quiz_instructions") as string) || "";
    const passing_score_percent = parseInt((formData.get("passing_score_percent") as string) || "80");
    const max_attempts = parseInt((formData.get("max_attempts") as string) || "2");
    const now = nowIso();
    if (quiz) {
      await db().prepare(`UPDATE "academy_quiz" SET title=?, instructions=?, passing_score_percent=?, max_attempts=?, updated_at=? WHERE id=?;`)
        .bind(title, instructions, passing_score_percent, max_attempts, now, quiz.id).run();
    } else {
      const id = newId();
      await db().prepare(`INSERT INTO "academy_quiz" (id, lesson_id, module_id, title, instructions, passing_score_percent, max_attempts, randomize_questions, randomize_answers, require_pass_to_unlock, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`)
        .bind(id, lessonId, module.id, title, instructions, passing_score_percent, max_attempts, 1, 1, 1, now, now).run();
    }
    redirect(`/admin/academy/lessons/${lessonId}`);
  }
  
  async function addQuestion(formData: FormData) {
    "use server";
    await requireAdmin();
    if (!quiz) return;
    const question_text = formData.get("question_text") as string;
    const explanation = (formData.get("explanation") as string) || "";
    const points = parseInt((formData.get("points") as string) || "1");
    const sort_order = parseInt((formData.get("sort_order") as string) || "0");
    const choice_a = formData.get("choice_a") as string;
    const choice_b = formData.get("choice_b") as string;
    const choice_c = formData.get("choice_c") as string;
    const choice_d = formData.get("choice_d") as string;
    const correct = (formData.get("correct") as string) || "a";
    const now = nowIso();
    const qid = newId();
    await db().prepare(`INSERT INTO "academy_quiz_question" (id, quiz_id, question_type, question_text, explanation, points, sort_order, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?);`)
      .bind(qid, quiz.id, "multiple_choice_single", question_text, explanation, points, sort_order, now, now).run();
    const choices = [["a", choice_a], ["b", choice_b], ["c", choice_c], ["d", choice_d]];
    for (let i = 0; i < choices.length; i++) {
      if (choices[i][1]) {
        await db().prepare(`INSERT INTO "academy_quiz_question_choice" (id, question_id, choice_text, is_correct, sort_order, created_at) VALUES (?,?,?,?,?,?);`)
          .bind(newId(), qid, choices[i][1], choices[i][0] === correct ? 1 : 0, i, nowIso()).run();
      }
    }
    redirect(`/admin/academy/lessons/${lessonId}`);
  }
  
  async function upsertAssignment(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = (formData.get("assignment_title") as string) || `${lesson.title} Assignment`;
    const instructions = (formData.get("assignment_instructions") as string) || "";
    const assignment_type = (formData.get("assignment_type") as string) || (lesson.requires_practical ? "chart_demo" : "homework");
    const requires_approval_to_unlock = formData.get("requires_approval_to_unlock") ? 1 : 1;
    const now = nowIso();
    if (assignment) {
      await db().prepare(`UPDATE "academy_assignment" SET title=?, instructions=?, assignment_type=?, requires_approval_to_unlock=?, updated_at=? WHERE id=?;`)
        .bind(title, instructions, assignment_type, requires_approval_to_unlock, now, assignment.id).run();
    } else {
      const id = newId();
      await db().prepare(`INSERT INTO "academy_assignment" (id, lesson_id, module_id, title, instructions, assignment_type, requires_file_upload, requires_approval_to_unlock, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?);`)
        .bind(id, lessonId, module.id, title, instructions, assignment_type, assignment_type === "chart_demo" ? 1 : 0, requires_approval_to_unlock, now, now).run();
    }
    redirect(`/admin/academy/lessons/${lessonId}`);
  }
  
  return (
    <div className="space-y-6">
      <div>
        <a href={`/admin/academy/modules/${module.id}/lessons`} className="text-white/60 hover:text-white text-sm">← Back to {module.title} Lessons</a>
        <h1 className="mt-2 font-display text-[30px] font-bold uppercase tracking-[0.03em]">Edit Lesson: {lesson.title}</h1>
        <p className="text-white/50 text-sm">Course: {course.title}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={`/admin/academy/inspect/${lessonId}`} className="inline-flex min-h-11 items-center rounded border border-white/20 px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">Inspect lesson</a>
          <a href={`/admin/academy/preview/${lessonId}`} className="inline-flex min-h-11 items-center rounded bg-brand-500 px-4 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">Preview as student</a>
        </div>
      </div>
      
      <Panel>
        <h2 className="font-display text-[18px] uppercase tracking-[0.15em] mb-4">Lesson Details</h2>
        <form action={updateLesson} className="space-y-3">
          <label className="block">Placement classification <select name="placement_classification" defaultValue={lesson.placement_classification} className="bg-ink-950 p-3">{CLASSIFICATIONS.map(c=><option key={c} value={c}>{c.replaceAll('_',' ')}</option>)}</select></label>
          <fieldset><legend>Competency domains (lesson evidence remains concept-scoped)</legend>{DOMAINS.map(d=><label key={d} className="mr-4 inline-block"><input type="checkbox" name="competency_domains" value={d} defaultChecked={JSON.parse(lesson.competency_domains_json||'[]').includes(d)}/> {d.replaceAll('_',' ')}</label>)}</fieldset>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="title" defaultValue={lesson.title} required className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
            <input name="sort_order" type="number" defaultValue={lesson.sort_order} className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <select name="lesson_type" defaultValue={lesson.lesson_type} className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white">
              <option value="text">text</option><option value="video">video</option><option value="mixed">mixed</option>
            </select>
            <input name="video_url" defaultValue={lesson.video_url || ""} placeholder="Video URL" className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
            <input name="estimated_minutes" type="number" defaultValue={lesson.estimated_minutes || ""} placeholder="Minutes" className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          </div>
          <textarea name="content" defaultValue={lesson.content || ""} rows={6} className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          <select name="status" defaultValue={lesson.status} className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white">
            <option value="draft">draft</option><option value="published">published</option>
          </select>
          <button className="rounded-sm border border-white/12 px-4 py-2.5 text-white/80">Update Lesson</button>
        </form>
      </Panel>
      
      <Panel>
        <h2 className="font-display text-[18px] uppercase tracking-[0.15em] mb-4">Assessment & Progression</h2>
        <form action={updateLesson} className="space-y-3 mb-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-white/80"><input type="checkbox" name="requires_quiz" defaultChecked={!!lesson.requires_quiz} /> Requires Quiz</label>
            <label className="flex items-center gap-2 text-white/80"><input type="checkbox" name="requires_assignment" defaultChecked={!!lesson.requires_assignment} /> Requires Assignment / Homework</label>
            <label className="flex items-center gap-2 text-white/80"><input type="checkbox" name="requires_practical" defaultChecked={!!lesson.requires_practical} /> Requires Practical / Chart Demonstration</label>
            <label className="flex items-center gap-2 text-white/80"><input type="checkbox" name="passing_gate" defaultChecked={!!lesson.passing_gate} /> Passing Gate (blocks progression)</label>
          </div>
          <p className="text-[12px] text-white/40">When Passing Gate is enabled, the next lesson/checkpoint remains locked until all required assessment components are passed/approved.</p>
          <button className="rounded-sm border border-white/12 px-4 py-2.5 text-white/80">Update Assessment Flags</button>
        </form>
      </Panel>
      
      <Panel>
        <h2 className="font-display text-[18px] uppercase tracking-[0.15em] mb-4">Quiz Configuration (max 2 automatic attempts)</h2>
        <form action={upsertQuiz} className="space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="quiz_title" defaultValue={quiz?.title || ""} placeholder="Quiz title" className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
            <input name="passing_score_percent" type="number" defaultValue={quiz?.passing_score_percent || 80} className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="max_attempts" type="number" defaultValue={quiz?.max_attempts || 2} readOnly className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white/50" />
            <textarea name="quiz_instructions" defaultValue={quiz?.instructions || ""} placeholder="Quiz instructions" rows={2} className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          </div>
          <button className="rounded-sm border border-white/12 px-4 py-2.5 text-white/80">{quiz ? "Update Quiz" : "Create Quiz"}</button>
        </form>
        {quiz && (
          <div>
            <h3 className="text-white/80 mb-2">Questions ({questions.results.length}) - correct answers not exposed to students</h3>
            <form action={addQuestion} className="space-y-2">
              <textarea name="question_text" placeholder="Question text" required className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
              <div className="grid gap-2 sm:grid-cols-4">
                <input name="choice_a" placeholder="Choice A" required className="rounded-sm border border-white/12 bg-ink-950 px-3 py-2 text-white" />
                <input name="choice_b" placeholder="Choice B" required className="rounded-sm border border-white/12 bg-ink-950 px-3 py-2 text-white" />
                <input name="choice_c" placeholder="Choice C" required className="rounded-sm border border-white/12 bg-ink-950 px-3 py-2 text-white" />
                <input name="choice_d" placeholder="Choice D" required className="rounded-sm border border-white/12 bg-ink-950 px-3 py-2 text-white" />
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <select name="correct" className="rounded-sm border border-white/12 bg-ink-950 px-3 py-2 text-white"><option value="a">Correct: A</option><option value="b">B</option><option value="c">C</option><option value="d">D</option></select>
                <input name="explanation" placeholder="Explanation/educational feedback" className="rounded-sm border border-white/12 bg-ink-950 px-3 py-2 text-white" />
                <button className="rounded-sm border border-white/12 px-4 py-2 text-white/80">Add Question</button>
              </div>
            </form>
          </div>
        )}
      </Panel>
      
      <Panel>
        <h2 className="font-display text-[18px] uppercase tracking-[0.15em] mb-4">Assignment / Homework / Practical / Chart Demo</h2>
        <form action={upsertAssignment} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="assignment_title" defaultValue={assignment?.title || ""} placeholder="Assignment title" className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
            <select name="assignment_type" defaultValue={assignment?.assignment_type || (lesson.requires_practical ? "chart_demo" : "homework")} className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white">
              <option value="homework">Homework</option><option value="practical">Practical</option><option value="chart_demo">Chart Demonstration</option>
            </select>
          </div>
          <textarea name="assignment_instructions" defaultValue={assignment?.instructions || ""} placeholder="Instructions, requirements, submission guidelines" rows={4} className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          <label className="flex items-center gap-2 text-white/80"><input type="checkbox" name="requires_approval_to_unlock" defaultChecked={assignment ? !!assignment.requires_approval_to_unlock : true} /> Instructor approval required before progression (existing revision/resubmission workflow supported)</label>
          <p className="text-[12px] text-white/40">Uses existing R2 ACADEMY_BUCKET and upload infrastructure for chart screenshots.</p>
          <button className="rounded-sm border border-white/12 px-4 py-2.5 text-white/80">{assignment ? "Update Assignment" : "Create Assignment"}</button>
        </form>
      </Panel>
    </div>
  );
}
