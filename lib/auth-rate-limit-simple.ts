import "server-only";

/**
 * Simple in-isolate rate limiter (best-effort). Resets on isolate recycle.
 * Complements Better Auth's own protections and enumeration-safe responses.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function hitRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    // opportunistic cleanup
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    return false;
  }
  b.count += 1;
  return b.count > limit;
}
