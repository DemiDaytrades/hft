import type { Candle } from "@/lib/candles";
import { seriesRange } from "@/lib/candles";

type Props = {
  data: Candle[];
  width: number;
  height: number;
  /** Optional explicit price range — pass when overlaying zone bands. */
  range?: { lo: number; hi: number };
  up?: string;
  down?: string;
  bodyWidth?: number;
  className?: string;
};

/**
 * Bare candlestick renderer. Emits a <g> so callers can compose it into a
 * larger SVG (zone bands, axes, annotations) without nesting viewports.
 */
export default function Candles({
  data,
  width,
  height,
  range,
  up = "#22c55e",
  down = "#e0342b",
  bodyWidth,
  className,
}: Props) {
  const { lo, hi } = range ?? seriesRange(data);
  const step = width / data.length;
  const bw = bodyWidth ?? Math.max(2, step * 0.58);
  const y = (v: number) => height - ((v - lo) / (hi - lo)) * height;

  return (
    <g className={className}>
      {data.map((d, i) => {
        const x = i * step + step / 2;
        const bull = d.c >= d.o;
        const color = bull ? up : down;
        const top = y(Math.max(d.o, d.c));
        const bot = y(Math.min(d.o, d.c));
        return (
          <g key={i} fill={color} stroke={color}>
            <line
              x1={x}
              x2={x}
              y1={y(d.h)}
              y2={y(d.l)}
              strokeWidth={Math.max(0.8, bw * 0.16)}
            />
            <rect
              x={x - bw / 2}
              y={top}
              width={bw}
              height={Math.max(1, bot - top)}
              strokeWidth={0}
            />
          </g>
        );
      })}
    </g>
  );
}

/** Convenience wrapper that renders a standalone, responsive chart. */
export function CandleChart({
  data,
  up,
  down,
  className = "",
  viewW = 300,
  viewH = 120,
}: {
  data: Candle[];
  up?: string;
  down?: string;
  className?: string;
  viewW?: number;
  viewH?: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <Candles data={data} width={viewW} height={viewH} up={up} down={down} />
    </svg>
  );
}
