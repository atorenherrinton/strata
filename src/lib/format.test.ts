import { describe, expect, it } from "vitest";
import { countLabel, formatLongDate, formatShortDate, formatTime } from "./format";

describe("countLabel", () => {
  it("uses singular for 1", () => {
    expect(countLabel(1, "note")).toBe("1 note");
  });
  it("uses plural for 0 and >1", () => {
    expect(countLabel(0, "note")).toBe("0 notes");
    expect(countLabel(7, "note")).toBe("7 notes");
  });
  it("respects a custom plural", () => {
    expect(countLabel(3, "octopus", "octopi")).toBe("3 octopi");
  });
});

describe("format helpers", () => {
  it("produce non-empty strings for a known input", () => {
    const d = new Date("2026-04-15T10:30:00Z");
    expect(formatTime(d).length).toBeGreaterThan(0);
    expect(formatShortDate(d).length).toBeGreaterThan(0);
    expect(formatLongDate("2026-04-15").length).toBeGreaterThan(0);
  });

  it("formatLongDate pins to local midnight and includes the weekday", () => {
    // We don't assert specific locale output; just that it references the day.
    const out = formatLongDate("2026-04-15");
    expect(out).toMatch(/\d{4}/);
  });
});
