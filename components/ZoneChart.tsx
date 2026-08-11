import Candles from "./Candles";
import { zoneSeries, seriesRange } from "@/lib/candles";

const W = 700;
const H = 380;
const AXIS = 62;
const LABELS = 218;
const TOTAL = W + LABELS + AXIS;

const SELL = "#e0342b";
const HOLD = "#f2b705";
const BUY = "#22c55e";

/**
 * The 3ZS framework diagram: premium / conference / discount bands drawn
 * over a hand-shaped candle series. `variant="live"` adds the entry,
 * confirmation and take-profit annotations from the strategy walkthrough.
 */
export default function ZoneChart({
  variant = "framework",
  title,
}: {
  variant?: "framework" | "live";
  title: string;
}) {
  const { lo, hi } = seriesRange(zoneSeries);
  const span = hi - lo;
  const y = (v: number) => H - ((v - lo) / span) * H;

  // Band edges as a fraction of the visible range.
  const sellTop = hi;
  const sellBot = lo + span * 0.72;
  const holdBot = lo + span * 0.4;
  const buyBot = lo;

  const bands = [
    {
      n: 1,
      from: sellTop,
      to: sellBot,
      color: SELL,
      name: "Sell Zone",
      sub: "Premium Zone",
    },
    {
      n: 2,
      from: sellBot,
      to: holdBot,
      color: HOLD,
      name: "Consolidation",
      name2: "(Conference) Zone",
      sub: "Battle Zone",
    },
    {
      n: 3,
      from: holdBot,
      to: buyBot,
      color: BUY,
      name: "Buy Zone",
      sub: "Discount Zone",
    },
  ];

  // Price ladder on the far right.
  const ticks = Array.from({ length: 7 }, (_, i) => lo + (span / 6) * i);
  const times = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "23:00"];

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${TOTAL} ${H + 34}`}
        className="block w-full min-w-[720px]"
        role="img"
        aria-label={`${title}: candlestick chart divided into sell, consolidation and buy zones`}
      >
        <title>{title}</title>

        {/* Bands */}
        {bands.map((b) => (
          <g key={b.n}>
            <rect
              x={0}
              y={y(b.from)}
              width={W + LABELS}
              height={y(b.to) - y(b.from)}
              fill={b.color}
              opacity={0.13}
            />
            <line
              x1={0}
              x2={W + LABELS}
              y1={y(b.to)}
              y2={y(b.to)}
              stroke={b.color}
              strokeWidth="1.4"
              strokeDasharray="7 6"
              opacity="0.8"
            />
          </g>
        ))}

        {/* Grid */}
        <g stroke="#ffffff" strokeOpacity="0.05">
          {times.map((_, i) => (
            <line
              key={i}
              x1={(W / (times.length - 1)) * i}
              x2={(W / (times.length - 1)) * i}
              y1={0}
              y2={H}
            />
          ))}
        </g>

        <Candles
          data={zoneSeries}
          width={W}
          height={H}
          range={{ lo, hi }}
          up={BUY}
          down={SELL}
        />

        {variant === "live" && (
          <g>
            {/* Rejection / short entry out of the premium zone */}
            <g stroke={SELL} fill={SELL}>
              <line
                x1={175}
                x2={175}
                y1={y(hi) + 14}
                y2={y(sellBot) - 6}
                strokeWidth="1.4"
                strokeDasharray="4 4"
              />
              <path d={`M170 ${y(sellBot) - 14} L175 ${y(sellBot) - 4} L180 ${y(sellBot) - 14} Z`} />
              <text
                x={182}
                y={y(hi) + 22}
                fontSize="13"
                fontWeight="600"
                letterSpacing="0.06em"
              >
                Short entry
              </text>
            </g>

            {/* Conference build-up bracket */}
            <g stroke={HOLD} fill={HOLD}>
              <path
                d={`M330 ${y(holdBot) + 30} H470`}
                strokeWidth="1.4"
                strokeDasharray="5 5"
                fill="none"
              />
              <text
                x={334}
                y={y(holdBot) + 22}
                fontSize="13"
                fontWeight="600"
                letterSpacing="0.06em"
              >
                Conference
              </text>
            </g>

            {/* Long entry off the discount zone */}
            <g stroke={BUY} fill={BUY}>
              <line
                x1={512}
                x2={512}
                y1={y(holdBot) + 46}
                y2={y(holdBot) + 8}
                strokeWidth="1.4"
                strokeDasharray="4 4"
              />
              <path d={`M507 ${y(holdBot) + 18} L512 ${y(holdBot) + 6} L517 ${y(holdBot) + 18} Z`} />
              <text
                x={520}
                y={y(holdBot) + 54}
                fontSize="13"
                fontWeight="600"
                letterSpacing="0.06em"
              >
                Long entry
              </text>
            </g>

            {/* Take profit */}
            <g fill={BUY}>
              <circle cx={670} cy={y(hi) + 30} r="5" />
              <text
                x={640}
                y={y(hi) + 18}
                fontSize="13"
                fontWeight="600"
                textAnchor="middle"
                letterSpacing="0.06em"
              >
                Take profit
              </text>
            </g>
          </g>
        )}

        {/* Zone labels */}
        {bands.map((b) => {
          const mid = (y(b.from) + y(b.to)) / 2;
          return (
            <g key={`l${b.n}`}>
              <text
                x={W + 20}
                y={b.name2 ? mid - 12 : mid - 4}
                fill={b.color}
                fontSize="16"
                fontWeight="700"
                letterSpacing="0.05em"
                className="uppercase"
              >
                {b.name.toUpperCase()}
              </text>
              {b.name2 && (
                <text
                  x={W + 20}
                  y={mid + 6}
                  fill={b.color}
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="0.05em"
                >
                  {b.name2.toUpperCase()}
                </text>
              )}
              <text
                x={W + 20}
                y={b.name2 ? mid + 26 : mid + 16}
                fill="#ffffff"
                fillOpacity="0.6"
                fontSize="13.5"
              >
                {b.sub}
              </text>
              <circle
                cx={W + LABELS - 22}
                cy={mid}
                r="14"
                fill={b.color}
              />
              <text
                x={W + LABELS - 22}
                y={mid + 5.5}
                textAnchor="middle"
                fill="#0a0a0b"
                fontSize="15"
                fontWeight="800"
              >
                {b.n}
              </text>
            </g>
          );
        })}

        {/* Price axis */}
        <line
          x1={W + LABELS}
          x2={W + LABELS}
          y1={0}
          y2={H}
          stroke="#ffffff"
          strokeOpacity="0.1"
        />
        {ticks.map((t, i) => (
          <text
            key={i}
            x={TOTAL - 6}
            // Clamp so the top and bottom labels aren't clipped by the viewBox.
            y={Math.min(H - 2, Math.max(11, y(t) + 4))}
            textAnchor="end"
            fill="#ffffff"
            fillOpacity="0.4"
            fontSize="12"
          >
            {t.toFixed(1)}
          </text>
        ))}

        {/* Time axis */}
        <line x1={0} x2={W} y1={H} y2={H} stroke="#ffffff" strokeOpacity="0.1" />
        {times.map((t, i) => (
          <text
            key={t}
            x={(W / (times.length - 1)) * i}
            y={H + 22}
            textAnchor={i === 0 ? "start" : i === times.length - 1 ? "end" : "middle"}
            fill="#ffffff"
            fillOpacity="0.4"
            fontSize="12"
          >
            {t}
          </text>
        ))}
      </svg>
    </div>
  );
}
