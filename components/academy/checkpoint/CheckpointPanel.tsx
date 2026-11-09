"use client";

type Part = { id: string; part_type: string; required: boolean; quiz_id?: string; assignment_id?: string };

export function CheckpointPanel({ checkpointId, parts }: { checkpointId: string; parts: Part[] }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
        <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Checkpoint</p>
        <h2 className="mt-2 font-display text-[28px] font-bold uppercase tracking-[0.03em] text-white">Requirements</h2>
        <p className="mt-2 text-[14px] text-white/70">All required parts must be satisfied. Hard gate enforced server-side.</p>
      </div>

      <div className="space-y-3">
        {parts.map((part) => (
          <div key={part.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-4">
            <div>
              <p className="font-display text-[12px] uppercase tracking-[0.24em] text-white/80">{part.part_type.replace('_', ' ')}</p>
              <p className="mt-1 text-[12px] text-white/50">{part.required ? "Required" : "Optional"}</p>
            </div>
            <span className="rounded-sm border border-white/12 px-3 py-1 font-display text-[10px] uppercase tracking-[0.24em] text-white/40">Pending</span>
          </div>
        ))}
        {parts.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6 text-center text-white/50">No parts configured</div>
        )}
      </div>

      <div className="rounded-lg border border-white/10 bg-gradient-to-br from-ink-900 to-ink-950 p-6">
        <p className="font-display text-[12px] uppercase tracking-[0.28em] text-white/40">Status</p>
        <p className="mt-2 text-[14px] text-white/70">Locked until all requirements complete. Server-side validation remains authoritative.</p>
      </div>
    </div>
  );
}
