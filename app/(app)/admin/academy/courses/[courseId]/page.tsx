import { requireAdmin } from "@/lib/dal";
import { db, newId, nowIso } from "@/lib/academy";
import { redirect } from "next/navigation";
import { Panel } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  await requireAdmin();
  const { courseId } = await params;
  const course = await db().prepare(`SELECT * FROM "academy_course" WHERE id = ?;`).bind(courseId).first<any>();
  const { results: modules } = await db().prepare(`SELECT * FROM "academy_module" WHERE course_id = ? ORDER BY sort_order ASC;`).bind(courseId).all<any>();

  async function update(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const track = (formData.get("track") as string) || "Foundations";
    const status = (formData.get("status") as string) || "draft";
    const sortOrder = parseInt((formData.get("sort_order") as string) || "0");
    const now = nowIso();
    await db().prepare(`UPDATE "academy_course" SET title=?, description=?, track=?, status=?, sort_order=?, updated_at=? WHERE id=?;`).bind(title, description, track, status, sortOrder, now, courseId).run();
    redirect(`/admin/academy/courses/${courseId}`);
  }

  async function addModule(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const sortOrder = parseInt((formData.get("sort_order") as string) || "0");
    const id = newId();
    const now = nowIso();
    await db().prepare(`INSERT INTO "academy_module" (id, course_id, title, description, sort_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?);`).bind(id, courseId, title, description, sortOrder, now, now).run();
    redirect(`/admin/academy/courses/${courseId}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <a href="/admin/academy" className="text-white/60 hover:text-white text-sm">← Back to Academy</a>
        <h1 className="mt-2 font-display text-[30px] font-bold uppercase tracking-[0.03em]">{course.title}</h1>
      </div>
      <Panel>
        <form action={update} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-white/60 mb-1">Title</label>
              <input name="title" defaultValue={course.title} required className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Sort Order</label>
              <input name="sort_order" type="number" defaultValue={course.sort_order} className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Description</label>
            <textarea name="description" defaultValue={course.description} rows={3} className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-white/60 mb-1">Track</label>
              <select name="track" defaultValue={course.track} className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white">
                <option>Foundations</option>
                <option>Developing Trader</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Status</label>
              <select name="status" defaultValue={course.status} className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white">
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>
          </div>
          <button className="rounded-sm bg-brand-600 px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">Save Course</button>
        </form>
      </Panel>
      <Panel>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.03em]">Modules</h2>
        </div>
        <div className="space-y-2 mb-6">
          {modules.map((m: any) => (
            <div key={m.id} className="flex items-center justify-between border-b border-white/5 pb-2">
              <div>
                <a href={`/admin/academy/modules/${m.id}/lessons`} className="inline-flex min-h-11 items-center rounded font-medium text-white underline decoration-white/30 underline-offset-4 hover:text-brand-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">{m.title}</a>
                <p className="text-[12px] text-white/40">order {m.sort_order}</p>
              </div>
              <a href={`/admin/academy/modules/${m.id}/lessons`} className="text-brand-400 hover:text-brand-300 text-sm">Manage Lessons</a>
            </div>
          ))}
        </div>
        <form action={addModule} className="grid gap-3 sm:grid-cols-4">
          <input name="title" placeholder="Module title" required className="sm:col-span-2 rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          <input name="sort_order" type="number" placeholder="Order" defaultValue="0" className="rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          <button className="rounded-sm border border-white/12 px-4 py-2.5 text-white/80">Add Module</button>
        </form>
      </Panel>
    </div>
  );
}
