import { describe, expect, it } from "vitest";
import { slugify, topicToMarkdown } from "./export";

describe("slugify", () => {
  it("lowercases, collapses non-alphanumerics, trims dashes", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
    expect(slugify("   --Trim-- ")).toBe("trim");
  });
  it("caps length at 60 characters", () => {
    expect(slugify("x".repeat(120)).length).toBe(60);
  });
  it("falls back to 'export' for empty results", () => {
    expect(slugify("!!!")).toBe("export");
    expect(slugify("")).toBe("export");
  });
});

describe("topicToMarkdown", () => {
  it("renders a heading, date subheadings, and bullet notes", () => {
    const md = topicToMarkdown({
      id: "t1",
      title: "Cretaceous",
      createdAt: "2026-04-10T00:00:00Z",
      notes: [
        {
          id: "n1",
          body: "Found a fossil.",
          createdAt: "2026-04-15T10:00:00Z",
          tags: ["fossil", "photo"],
        },
        {
          id: "n2",
          body: "Rained out.",
          createdAt: "2026-04-14T09:00:00Z",
          tags: [],
        },
      ],
    });
    expect(md).toContain("# Cretaceous");
    expect(md).toContain("## 2026-04-15");
    expect(md).toContain("## 2026-04-14");
    expect(md).toContain("- Found a fossil.  #fossil #photo");
    expect(md).toContain("- Rained out.");
  });
  it("puts newer dates before older dates", () => {
    const md = topicToMarkdown({
      id: "t",
      title: "T",
      createdAt: "2026-01-01T00:00:00Z",
      notes: [
        { id: "a", body: "old", createdAt: "2026-01-01T00:00:00Z", tags: [] },
        { id: "b", body: "new", createdAt: "2026-02-01T00:00:00Z", tags: [] },
      ],
    });
    expect(md.indexOf("## 2026-02-01")).toBeLessThan(md.indexOf("## 2026-01-01"));
  });
});
