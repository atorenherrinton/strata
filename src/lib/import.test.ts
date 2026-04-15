import { describe, expect, it } from "vitest";
import { parseImportJson, summarize } from "./import";

function good() {
  return JSON.stringify({
    schemaVersion: 1,
    topics: [
      {
        title: "Trip notes",
        createdAt: "2026-03-01T00:00:00Z",
        notes: [
          {
            body: "Saw a fossil.",
            createdAt: "2026-03-02T10:00:00Z",
            tags: ["fossil", "photo"],
          },
          {
            body: "Rained all day.",
            createdAt: "2026-03-03T11:00:00Z",
            tags: [],
          },
        ],
      },
    ],
  });
}

describe("parseImportJson", () => {
  it("accepts a well-formed v1 payload", () => {
    const r = parseImportJson(good());
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.payload.topics).toHaveLength(1);
      expect(r.payload.topics[0].notes).toHaveLength(2);
      expect(r.payload.topics[0].notes[0].tags).toEqual(["fossil", "photo"]);
    }
  });

  it("rejects malformed JSON", () => {
    expect(parseImportJson("{not json").ok).toBe(false);
  });

  it("rejects unsupported schema versions", () => {
    const r = parseImportJson(JSON.stringify({ schemaVersion: 99, topics: [] }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/schemaVersion/);
  });

  it("rejects a topic with no title", () => {
    const payload = JSON.parse(good());
    payload.topics[0].title = "";
    const r = parseImportJson(JSON.stringify(payload));
    expect(r.ok).toBe(false);
  });

  it("rejects an invalid tag", () => {
    const payload = JSON.parse(good());
    payload.topics[0].notes[0].tags = ["has space"];
    const r = parseImportJson(JSON.stringify(payload));
    expect(r.ok).toBe(false);
  });

  it("falls back to current date when note createdAt is missing", () => {
    const payload = JSON.parse(good());
    delete payload.topics[0].notes[0].createdAt;
    const r = parseImportJson(JSON.stringify(payload));
    expect(r.ok).toBe(true);
    if (r.ok)
      expect(
        !Number.isNaN(Date.parse(r.payload.topics[0].notes[0].createdAt)),
      ).toBe(true);
  });
});

describe("summarize", () => {
  it("counts topics, notes, and unique tags", () => {
    const r = parseImportJson(good());
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(summarize(r.payload)).toEqual({ topics: 1, notes: 2, tags: 2 });
    }
  });
});
