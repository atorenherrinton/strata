import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __resetRateLimits, rateLimit } from "./ratelimit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-15T00:00:00Z"));
    __resetRateLimits();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const cfg = { limit: 3, windowMs: 1000 };

  it("allows up to `limit` requests in a window, then blocks", () => {
    expect(rateLimit("k", cfg).ok).toBe(true);
    expect(rateLimit("k", cfg).ok).toBe(true);
    expect(rateLimit("k", cfg).ok).toBe(true);
    expect(rateLimit("k", cfg).ok).toBe(false);
  });

  it("reports remaining and resetAt correctly", () => {
    const a = rateLimit("k", cfg);
    expect(a.remaining).toBe(2);
    const b = rateLimit("k", cfg);
    expect(b.remaining).toBe(1);
    expect(b.resetAt).toBe(a.resetAt);
  });

  it("resets the window after resetAt passes", () => {
    rateLimit("k", cfg);
    rateLimit("k", cfg);
    rateLimit("k", cfg);
    expect(rateLimit("k", cfg).ok).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(rateLimit("k", cfg).ok).toBe(true);
  });

  it("separates buckets by key", () => {
    rateLimit("a", cfg);
    rateLimit("a", cfg);
    rateLimit("a", cfg);
    expect(rateLimit("a", cfg).ok).toBe(false);
    expect(rateLimit("b", cfg).ok).toBe(true);
  });
});
