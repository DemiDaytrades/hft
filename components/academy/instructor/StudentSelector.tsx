import type { instructorStudents } from "@/lib/academy/instructor/service";

export default function StudentSelector({
  students,
  selected,
  action = "/admin/academy/student",
  label = "View as student · read only",
  buttonLabel = "View as student",
}: {
  students: Awaited<ReturnType<typeof instructorStudents>>;
  selected?: string;
  action?: string;
  label?: string;
  buttonLabel?: string;
}) {
  return (
    <form action={action} className="flex min-w-0 flex-wrap items-end gap-3 rounded-lg border border-white/15 p-4">
      <label className="min-w-0 flex-1 text-sm text-white/70">
        {label}
        <select name="studentId" required defaultValue={selected ?? ""} className="mt-2 block w-full max-w-full rounded border border-white/20 bg-ink-900 p-3 text-white">
          <option value="" disabled>Select a student</option>
          <optgroup label="ACTIVE STUDENTS">
            {students.active.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.email}</option>)}
          </optgroup>
          <optgroup label="FORMER / DEACTIVATED STUDENTS">
            {students.former.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.email} · FORMER</option>)}
          </optgroup>
        </select>
      </label>
      <button className="rounded bg-brand-500 px-5 py-3 text-sm font-semibold text-white">{buttonLabel}</button>
    </form>
  );
}
