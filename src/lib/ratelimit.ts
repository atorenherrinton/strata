// Process-local fixed-window rate limiter. Good enough for a single
// long-running process (local dev, a single VM); serverless deployments
// with many cold instances get a looser but still-helpful ceiling.
// For production multi-instance enforcement, back this with Redis or
// a similar shared store — the public surface is the same.

export type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();
const MAX_BUCKETS = 5_000;

export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowMs;
    buckets.set(key, { count: 1, resetAt });
    if (buckets.size > MAX_BUCKETS) sweep(now);
    return {
      ok: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt,
    };
  }
  if (existing.count >= config.limit) {
    return {
      ok: false,
      limit: config.limit,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }
  existing.count += 1;
  return {
    ok: true,
    limit: config.limit,
    remaining: config.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

function sweep(now: number) {
  // Drop expired entries; if still above the cap, drop the oldest.
  for (const [k, v] of buckets) {
    if (v.resetAt <= now) buckets.delete(k);
  }
  if (buckets.size > MAX_BUCKETS) {
    const overflow = buckets.size - MAX_BUCKETS;
    const it = buckets.keys();
    for (let i = 0; i < overflow; i++) {
      const next = it.next();
      if (next.done) break;
      buckets.delete(next.value);
    }
  }
}

// Test seam — not for production call sites.
export function __resetRateLimits(): void {
  buckets.clear();
}
