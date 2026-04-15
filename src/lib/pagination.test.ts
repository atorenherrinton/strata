import { describe, expect, it } from "vitest";
import { paginate, parsePage, PAGE_SIZE } from "./pagination";

describe("parsePage", () => {
  it("defaults to 1 on missing / NaN / negative", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage(-5)).toBe(1);
    expect(parsePage(0)).toBe(1);
  });
  it("floors positive numbers", () => {
    expect(parsePage("3")).toBe(3);
    expect(parsePage("3.9")).toBe(3);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 125 }, (_, i) => i);

  it("returns a slice of the requested page", () => {
    const p = paginate(items, 2, 50);
    expect(p.items).toEqual(items.slice(50, 100));
    expect(p.page).toBe(2);
    expect(p.totalPages).toBe(3);
    expect(p.total).toBe(125);
  });

  it("clamps pages above the maximum to the last page", () => {
    const p = paginate(items, 99, 50);
    expect(p.page).toBe(3);
    expect(p.items).toEqual(items.slice(100, 125));
  });

  it("uses PAGE_SIZE when no size is given", () => {
    const p = paginate(items, 1);
    expect(p.pageSize).toBe(PAGE_SIZE);
  });

  it("reports one empty page for an empty list", () => {
    const p = paginate([], 1);
    expect(p.items).toEqual([]);
    expect(p.totalPages).toBe(1);
    expect(p.total).toBe(0);
  });
});
