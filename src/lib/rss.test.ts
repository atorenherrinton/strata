import { describe, expect, it } from "vitest";
import { buildRss, escapeXml } from "./rss";

describe("escapeXml", () => {
  it("escapes the five predefined entities", () => {
    expect(escapeXml(`a & <b> "c" 'd'`)).toBe(
      "a &amp; &lt;b&gt; &quot;c&quot; &apos;d&apos;",
    );
  });
});

describe("buildRss", () => {
  const feed = buildRss({
    title: "Field & notes",
    link: "https://example.com/topics/t1",
    description: "Time-layered notes.",
    items: [
      {
        title: "First <note>",
        link: "https://example.com/topics/t1",
        guid: "n1",
        pubDate: new Date("2026-04-15T10:00:00Z"),
        description: "hello & world",
        categories: ["fossil"],
      },
    ],
    lastBuildDate: new Date("2026-04-15T10:00:00Z"),
  });

  it("opens with the XML declaration and rss 2.0 envelope", () => {
    expect(feed.startsWith('<?xml version="1.0"')).toBe(true);
    expect(feed).toContain('<rss version="2.0">');
    expect(feed).toContain("<channel>");
  });

  it("escapes reserved characters in title and body", () => {
    expect(feed).toContain("Field &amp; notes");
    expect(feed).toContain("First &lt;note&gt;");
    expect(feed).toContain("hello &amp; world");
  });

  it("emits categories and an isPermaLink=false GUID", () => {
    expect(feed).toContain("<category>fossil</category>");
    expect(feed).toContain(`<guid isPermaLink="false">n1</guid>`);
  });
});
