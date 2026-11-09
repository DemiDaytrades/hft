import { requireAdmin } from "@/lib/dal";
import { db, newId, nowIso } from "@/lib/academy";
import { redirect } from "next/navigation";
import { Panel } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function LessonsPage({ params }: { params: Promise<{ moduleId: string }> }) {
  await requireAdmin();
  const { moduleId } = await params;
  const module = await db().prepare(`SELECT * FROM "academy_module" WHERE id = ?;`).bind(moduleId).first<any>();
  const course = await db().prepare(`SELECT * FROM "academy_course" WHERE id = ?;`).bind(module.course_id).first<any>();
  const { results: lessons } = await db().prepare(`SELECT * FROM "academy_lesson" WHERE module_id = ? ORDER BY sort_order ASC;`).bind(moduleId).all<any>();

  async function addLesson(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const lesson_type = (formData.get("lesson_type") as string) || "text";
    const content = (formData.get("content") as string) || "";
    const video_url = (formData.get("video_url") as string) || null;
    const estimated_minutes = formData.get("estimated_minutes") ? parseInt(formData.get("estimated_minutes") as string) : null;
    const sortOrder = parseInt((formData.get("sort_order") as string) || "0");
    const status = (formData.get("status") as string) || "draft";
    const id = newId();
    const now = nowIso();
    await db().prepare(`INSERT INTO "academy_lesson" (id, module_id, title, description, lesson_type, content, video_url, estimated_minutes, sort_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`).bind(id, moduleId, title, description, lesson_type, content, video_url, estimated_minutes, sortOrder, status, now, now).run();
    redirect(`/admin/academy/modules/${moduleId}/lessons`);
  }

  return (
    <div className="space-y-6">
      <div>
        <a href={`/admin/academy/courses/${course.id}`} className="text-white/60 hover:text-white text-sm">← Back to {course.title}</a>
        <h1 className="mt-2 font-display text-[30px] font-bold uppercase tracking-[0.03em]">{module.title} — Lessons</h1>
      </div>
      <Panel>
        <div className="space-y-2 mb-6">
          {lessons.map((l: any) => (
            <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-2">
              <div>
                <a href={`/admin/academy/inspect/${l.id}`} className="inline-flex min-h-11 items-center rounded font-medium text-white underline decoration-white/30 underline-offset-4 hover:text-brand-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">{l.title}</a>
                <p className="text-[12px] text-white/40">{l.lesson_type} • {l.status} • order {l.sort_order}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
              <a href={`/admin/academy/inspect/${l.id}`} className="inline-flex min-h-11 items-center rounded border border-white/20 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">Inspect lesson</a>
              <a href={`/admin/academy/preview/${l.id}`} className="inline-flex min-h-11 items-center rounded bg-brand-500 px-3 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">Preview as student</a>
              <a href={`/admin/academy/lessons/${l.id}`} className="rounded-sm border border-white/12 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/70 hover:text-white">Edit</a>
              </div>
            </div>
          ))}
        </div>
        <form action={addLesson} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="title" placeholder="Lesson title" required className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
            <input name="sort_order" type="number" placeholder="Order" defaultValue="0" className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <select name="lesson_type" className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white">
              <option value="text">text</option>
              <option value="video">video</option>
              <option value="mixed">mixed</option>
            </select>
            <input name="video_url" placeholder="Video URL (optional)" className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
            <input name="estimated_minutes" type="number" placeholder="Minutes (optional)" className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          </div>
          <textarea name="content" placeholder="Content" rows={4} className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          <select name="status" className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <button className="rounded-sm border border-white/12 px-4 py-2.5 text-white/80">Add Lesson</button>
        </form>
      </Panel>
    </div>
  );
}
