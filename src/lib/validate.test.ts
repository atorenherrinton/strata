import { describe, expect, it } from "vitest";
import {
  BODY_MAX,
  TAGS_MAX_COUNT,
  TAG_MAX_LEN,
  TITLE_MAX,
  validateBody,
  validateTagsInput,
  validateTitle,
} from "./validate";

describe("validateTitle", () => {
  it("accepts a normal title, trimmed", () => {
    expect(validateTitle("  Cretaceous notes  ")).toEqual({
      ok: true,
      value: "Cretaceous notes",
    });
  });

  it("rejects non-strings", () => {
    expect(validateTitle(undefined).ok).toBe(false);
    expect(validateTitle(42).ok).toBe(false);
    expect(validateTitle(null).ok).toBe(false);
  });

  it("rejects empty/whitespace-only", () => {
    expect(validateTitle("").ok).toBe(false);
    expect(validateTitle("   ").ok).toBe(false);
  });

  it("rejects titles past the limit", () => {
    const tooLong = "x".repeat(TITLE_MAX + 1);
    expect(validateTitle(tooLong).ok).toBe(false);
  });

  it("accepts titles at the limit", () => {
    const atLimit = "x".repeat(TITLE_MAX);
    expect(validateTitle(atLimit)).toEqual({ ok: true, value: atLimit });
  });
});

describe("validateBody", () => {
  it("accepts normal text, trimmed", () => {
    expect(validateBody("\n hello world \n")).toEqual({
      ok: true,
      value: "hello world",
    });
  });

  it("rejects empty", () => {
    expect(validateBody("").ok).toBe(false);
    expect(validateBody("\n\n  ").ok).toBe(false);
  });

  it("rejects over the length cap", () => {
    expect(validateBody("x".repeat(BODY_MAX + 1)).ok).toBe(false);
  });

  it("accepts at the length cap", () => {
    const s = "x".repeat(BODY_MAX);
    expect(validateBody(s)).toEqual({ ok: true, value: s });
  });
});

describe("validateTagsInput", () => {
  it("splits CSV, lowercases, trims, drops empties", () => {
    expect(validateTagsInput("  Foo,  bar , ,BAZ ")).toEqual({
      ok: true,
      value: ["foo", "bar", "baz"],
    });
  });

  it("deduplicates", () => {
    expect(validateTagsInput("a, b, a, B, a")).toEqual({
      ok: true,
      value: ["a", "b"],
    });
  });

  it("accepts non-string as empty list", () => {
    expect(validateTagsInput(undefined)).toEqual({ ok: true, value: [] });
    expect(validateTagsInput(null)).toEqual({ ok: true, value: [] });
  });

  it("rejects tags that don't match the character rule", () => {
    expect(validateTagsInput("good, bad tag").ok).toBe(false);
    expect(validateTagsInput("-leading-dash").ok).toBe(false);
    expect(validateTagsInput("has space").ok).toBe(false);
    expect(validateTagsInput("emoji🦖").ok).toBe(false);
  });

  it("allows dash and underscore in the middle", () => {
    expect(validateTagsInput("a-b, c_d, 1-2_3")).toEqual({
      ok: true,
      value: ["a-b", "c_d", "1-2_3"],
    });
  });

  it("rejects tags exceeding the length limit", () => {
    expect(validateTagsInput("x".repeat(TAG_MAX_LEN + 1)).ok).toBe(false);
  });

  it("rejects too many tags", () => {
    const many = Array.from({ length: TAGS_MAX_COUNT + 1 }, (_, i) => `t${i}`).join(
      ",",
    );
    expect(validateTagsInput(many).ok).toBe(false);
  });

  it("accepts up to the tag count limit", () => {
    const many = Array.from({ length: TAGS_MAX_COUNT }, (_, i) => `t${i}`).join(",");
    const res = validateTagsInput(many);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.value).toHaveLength(TAGS_MAX_COUNT);
  });
});
