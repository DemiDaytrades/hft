import { requireAdmin } from "@/lib/dal";
import { db, newId, nowIso } from "@/lib/academy";
import { redirect } from "next/navigation";
import { Panel } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  await requireAdmin();
  async function create(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const description = (formData.get("description") as string) || "";
    const track = (formData.get("track") as string) || "Foundations";
    const status = (formData.get("status") as string) || "draft";
    const sortOrder = parseInt((formData.get("sort_order") as string) || "0");
    const id = newId();
    const now = nowIso();
    await db().prepare(`INSERT INTO "academy_course" (id, title, slug, description, track, status, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`).bind(id, title, slug, description, track, status, sortOrder, now, now).run();
    redirect(`/admin/academy/courses/${id}`);
  }
  return (
    <div className="space-y-6">
      <div>
        <a href="/admin/academy" className="text-white/60 hover:text-white text-sm">← Back to Academy</a>
        <h1 className="mt-2 font-display text-[30px] font-bold uppercase tracking-[0.03em]">Create Course</h1>
      </div>
      <Panel>
        <form action={create} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Title</label>
            <input name="title" required className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Slug</label>
            <input name="slug" className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Description</label>
            <textarea name="description" rows={3} className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm text-white/60 mb-1">Track</label>
              <select name="track" className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white">
                <option>Foundations</option>
                <option>Developing Trader</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Status</label>
              <select name="status" className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white">
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Sort Order</label>
              <input name="sort_order" type="number" defaultValue="0" className="w-full rounded-sm border border-white/12 bg-ink-950 px-4 py-2.5 text-white" />
            </div>
          </div>
          <button className="rounded-sm bg-brand-600 px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">Create</button>
        </form>
      </Panel>
    </div>
  );
}
