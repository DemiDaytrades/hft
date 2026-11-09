export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 transition-all duration-700"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
