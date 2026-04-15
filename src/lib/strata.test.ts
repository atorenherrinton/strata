import { describe, expect, it } from "vitest";
import { bucketByDate } from "./strata";
import type { Note } from "./types";

function note(id: string, iso: string, body = ""): Note {
  return { id, topicId: "t", body, createdAt: new Date(iso), tags: [] };
}

describe("bucketByDate", () => {
  it("returns an empty list for no notes", () => {
    expect(bucketByDate([])).toEqual([]);
  });

  it("groups notes by ISO date (UTC slice)", () => {
    const notes = [
      note("a", "2026-04-15T10:00:00Z"),
      note("b", "2026-04-15T22:30:00Z"),
      note("c", "2026-04-14T05:00:00Z"),
    ];
    const strata = bucketByDate(notes);
    expect(strata.map((s) => s.date)).toEqual(["2026-04-15", "2026-04-14"]);
    expect(strata[0].notes.map((n) => n.id)).toEqual(["a", "b"]);
    expect(strata[1].notes.map((n) => n.id)).toEqual(["c"]);
  });

  it("sorts strata newest-first", () => {
    const notes = [
      note("old", "2026-01-01T00:00:00Z"),
      note("new", "2026-06-01T00:00:00Z"),
      note("mid", "2026-03-15T00:00:00Z"),
    ];
    const strata = bucketByDate(notes);
    expect(strata.map((s) => s.date)).toEqual([
      "2026-06-01",
      "2026-03-15",
      "2026-01-01",
    ]);
  });

  it("preserves note insertion order within a date", () => {
    const notes = [
      note("first", "2026-04-15T10:00:00Z"),
      note("second", "2026-04-15T11:00:00Z"),
      note("third", "2026-04-15T12:00:00Z"),
    ];
    const [stratum] = bucketByDate(notes);
    expect(stratum.notes.map((n) => n.id)).toEqual(["first", "second", "third"]);
  });
});
