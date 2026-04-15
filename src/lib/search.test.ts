import { describe, expect, it } from "vitest";
import { highlight, matchesAll, tokenize, type SearchableNote } from "./search";

function note(overrides: Partial<SearchableNote> = {}): SearchableNote {
  return {
    id: "n",
    topicId: "t",
    body: "",
    createdAt: new Date("2026-04-15T00:00:00Z"),
    tags: [],
    ...overrides,
  };
}

describe("tokenize", () => {
  it("lowercases and splits on whitespace, drops empties", () => {
    expect(tokenize("  Hello  WORLD   foo ")).toEqual(["hello", "world", "foo"]);
  });
  it("empty input → empty list", () => {
    expect(tokenize("")).toEqual([]);
    expect(tokenize("   ")).toEqual([]);
  });
});

describe("matchesAll", () => {
  it("empty term list matches anything", () => {
    expect(matchesAll(note({ body: "hi" }), [])).toBe(true);
  });
  it("ANDs terms across body, topic title, and tags", () => {
    const n = note({
      body: "Quartz crystal found in the outcrop",
      topicTitle: "Field notes",
      tags: ["mineral", "photo"],
    });
    expect(matchesAll(n, ["quartz"])).toBe(true);
    expect(matchesAll(n, ["field", "quartz"])).toBe(true);
    expect(matchesAll(n, ["mineral", "outcrop"])).toBe(true);
    expect(matchesAll(n, ["quartz", "granite"])).toBe(false);
  });
  it("is case-insensitive", () => {
    expect(matchesAll(note({ body: "Feldspar" }), ["FELDSPAR"])).toBe(true);
  });
});

describe("highlight", () => {
  it("returns the whole text as one non-hit segment when no terms", () => {
    expect(highlight("hello", [])).toEqual([{ text: "hello", hit: false }]);
  });
  it("splits around a single match", () => {
    expect(highlight("find the needle here", ["needle"])).toEqual([
      { text: "find the ", hit: false },
      { text: "needle", hit: true },
      { text: " here", hit: false },
    ]);
  });
  it("merges overlapping term matches", () => {
    expect(highlight("abcabc", ["abc", "bca"])).toEqual([
      { text: "abcabc", hit: true },
    ]);
  });
  it("handles multiple disjoint matches", () => {
    const parts = highlight("one two one two", ["one"]);
    const hits = parts.filter((p) => p.hit).map((p) => p.text);
    expect(hits).toEqual(["one", "one"]);
  });
});
