export type Candle = { o: number; h: number; l: number; c: number };

/** Mulberry32 — deterministic so server and client render identically. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds an OHLC series that follows `path` — a list of segments, each with a
 * drift per bar and a volatility. Lets us hand-shape a chart (sell off →
 * consolidate → rally) instead of relying on random walk luck.
 */
export function buildSeries(
  start: number,
  path: { bars: number; drift: number; vol: number }[],
  seed = 7,
): Candle[] {
  const rand = rng(seed);
  const out: Candle[] = [];
  let price = start;

  for (const leg of path) {
    for (let i = 0; i < leg.bars; i++) {
      const o = price;
      const shock = (rand() - 0.5) * 2 * leg.vol;
      const c = o + leg.drift + shock;
      const wick = leg.vol * (0.35 + rand() * 0.75);
      out.push({
        o,
        c,
        h: Math.max(o, c) + wick * rand(),
        l: Math.min(o, c) - wick * rand(),
      });
      price = c;
    }
  }
  return out;
}

export function seriesRange(data: Candle[]) {
  const lo = Math.min(...data.map((d) => d.l));
  const hi = Math.max(...data.map((d) => d.h));
  const pad = (hi - lo) * 0.06;
  return { lo: lo - pad, hi: hi + pad };
}

/** Hero terminal chart — a steady climb with two pullbacks. */
export const heroSeries = buildSeries(
  17820,
  [
    { bars: 10, drift: 14, vol: 34 },
    { bars: 6, drift: -20, vol: 30 },
    { bars: 14, drift: 22, vol: 32 },
    { bars: 5, drift: -16, vol: 26 },
    { bars: 17, drift: 26, vol: 34 },
  ],
  11,
);

/**
 * 3ZS framework chart — rallies into the premium (sell) zone, rejects,
 * consolidates in the conference zone, then reacts up off the discount zone.
 */
export const zoneSeries = buildSeries(
  17980,
  [
    { bars: 8, drift: 34, vol: 30 },
    { bars: 4, drift: 8, vol: 40 },
    { bars: 7, drift: -46, vol: 32 },
    { bars: 12, drift: 2, vol: 34 },
    { bars: 6, drift: -40, vol: 30 },
    { bars: 5, drift: 6, vol: 30 },
    { bars: 14, drift: 40, vol: 34 },
  ],
  23,
);

/** Small illustrative series for each of the three zone cards. */
export const rejectionSeries = buildSeries(
  100,
  [
    { bars: 7, drift: 2.4, vol: 1.6 },
    { bars: 3, drift: 0.2, vol: 2.2 },
    { bars: 8, drift: -3, vol: 1.8 },
  ],
  4,
);

export const consolidationSeries = buildSeries(
  100,
  [
    { bars: 3, drift: -1.6, vol: 1.4 },
    { bars: 12, drift: 0, vol: 1.5 },
    { bars: 3, drift: 2.6, vol: 1.4 },
  ],
  9,
);

export const reversalSeries = buildSeries(
  100,
  [
    { bars: 6, drift: -2.6, vol: 1.6 },
    { bars: 3, drift: 0.1, vol: 1.8 },
    { bars: 9, drift: 3.2, vol: 1.7 },
  ],
  15,
);
