import Candles from "./Candles";
import { heroSeries, seriesRange } from "@/lib/candles";

const W = 640;
const H = 340;

/**
 * Stand-in for the hero photography in the brand mockups: a trading
 * terminal rendered entirely in SVG so it stays sharp and weighs nothing.
 * Swap this for a real screenshot/photo when assets are available.
 */
export default function TerminalChart({
  className = "",
}: {
  className?: string;
}) {
  const range = seriesRange(heroSeries);
  const last = heroSeries[heroSeries.length - 1];
  const first = heroSeries[0];
  const changePct = ((last.c - first.o) / first.o) * 100;
  const priceY =
    H - ((last.c - range.lo) / (range.hi - range.lo)) * H;

  const gridRows = 6;
  const gridCols = 9;

  return (
    <div className={`relative ${className}`}>
      {/* Ambient glow behind the panel */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 animate-pulse-glow rounded-full bg-brand-600/18 blur-[70px]"
      />

      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-ink-900 shadow-[0_40px_120px_-40px_rgba(227,69,9,0.55)]">
        {/* Terminal chrome */}
        <div className="flex items-center gap-3 border-b border-white/8 bg-ink-850 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-600/70" />
          </div>
          <p className="font-display text-[13px] font-semibold uppercase tracking-[0.2em] text-white/70">
            NAS100 · 5M
          </p>
          <span className="ml-auto flex items-center gap-2 rounded-sm bg-brand-600/12 px-2.5 py-1 font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
            Live
          </span>
        </div>

        {/* Price header */}
        <div className="flex items-end gap-4 px-4 pt-4">
          <p className="font-display text-[30px] font-bold leading-none text-white">
            {last.c.toLocaleString("en-US", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </p>
          <p className="font-display text-[15px] font-semibold leading-none text-zone-buy">
            +{changePct.toFixed(2)}%
          </p>
          <p className="ml-auto font-display text-[12px] uppercase tracking-[0.18em] text-white/40">
            3ZS Framework
          </p>
        </div>

        {/* Chart */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="block h-[clamp(200px,26vw,300px)] w-full"
          aria-label="Illustrative NAS100 5-minute candlestick chart"
          role="img"
        >
          <defs>
            <linearGradient id="term-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e34509" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#e34509" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid */}
          <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1">
            {Array.from({ length: gridRows + 1 }, (_, i) => (
              <line
                key={`r${i}`}
                x1={0}
                x2={W}
                y1={(H / gridRows) * i}
                y2={(H / gridRows) * i}
              />
            ))}
            {Array.from({ length: gridCols + 1 }, (_, i) => (
              <line
                key={`c${i}`}
                y1={0}
                y2={H}
                x1={(W / gridCols) * i}
                x2={(W / gridCols) * i}
              />
            ))}
          </g>

          <rect x={0} y={priceY} width={W} height={H - priceY} fill="url(#term-fade)" />

          <Candles
            data={heroSeries}
            width={W}
            height={H}
            range={range}
            up="#22c55e"
            down="#e0342b"
          />

          {/* Last-price marker */}
          <line
            x1={0}
            x2={W}
            y1={priceY}
            y2={priceY}
            stroke="#e34509"
            strokeWidth="1.4"
            strokeDasharray="6 5"
            opacity="0.85"
          />
        </svg>

        {/* Ticker strip */}
        <div className="flex items-center justify-between gap-4 border-t border-white/8 bg-ink-850 px-4 py-3 font-display text-[12px] uppercase tracking-[0.16em]">
          {[
            ["Buy Zone", "text-zone-buy"],
            ["Conference", "text-zone-hold"],
            ["Sell Zone", "text-zone-sell"],
          ].map(([label, tone]) => (
            <span key={label} className={`flex items-center gap-2 ${tone}`}>
              <span className="h-2 w-2 rounded-full bg-current" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Floating alert card. Anchored over the empty lower-left of the
          chart (the series trends up-right) so it never hides the axis
          labels or the zone legend strip. */}
      <div className="absolute bottom-24 left-4 hidden w-[232px] rounded-md border border-brand-600/45 bg-ink-850/95 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:block">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-500">
          Live Trade Alert
        </p>
        <p className="mt-2 font-display text-[17px] font-bold uppercase text-white">
          NAS100 · Long
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">
          Discount zone reaction confirmed. Risk 1%. Targets set.
        </p>
      </div>
    </div>
  );
}
