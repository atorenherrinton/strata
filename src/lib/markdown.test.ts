import { describe, expect, it } from "vitest";
import { plainText, renderNoteMarkdown } from "./markdown";

describe("renderNoteMarkdown", () => {
  it("wraps plain text in a paragraph", () => {
    expect(renderNoteMarkdown("hello")).toBe("<p>hello</p>");
  });

  it("escapes HTML in user input", () => {
    const out = renderNoteMarkdown("<script>alert(1)</script>");
    expect(out).not.toContain("<script>");
    expect(out).toContain("&lt;script&gt;");
  });

  it("escapes attribute-breaking characters", () => {
    const out = renderNoteMarkdown(`hello "world" 'quote' & ampersand`);
    expect(out).toContain("&quot;world&quot;");
    expect(out).toContain("&#39;quote&#39;");
    expect(out).toContain("&amp;");
  });

  it("renders bold and italic", () => {
    expect(renderNoteMarkdown("make it **loud** and *soft*")).toBe(
      "<p>make it <strong>loud</strong> and <em>soft</em></p>",
    );
  });

  it("renders inline code with content escaped", () => {
    const out = renderNoteMarkdown("try `<b>` please");
    expect(out).toContain("<code>&lt;b&gt;</code>");
  });

  it("renders fenced code blocks with content escaped", () => {
    const out = renderNoteMarkdown("```\n<script>x</script>\n```");
    expect(out).toContain("<pre><code>&lt;script&gt;x&lt;/script&gt;</code></pre>");
    expect(out).not.toContain("<p>");
  });

  it("autolinks bare http(s) URLs", () => {
    const out = renderNoteMarkdown("see https://example.com now");
    expect(out).toContain(
      '<a href="https://example.com" rel="noopener noreferrer">https://example.com</a>',
    );
  });

  it("renders [text](url) only for http(s) and absolute paths", () => {
    const ok = renderNoteMarkdown("[home](/) and [ex](https://e.com)");
    expect(ok).toContain('href="/"');
    expect(ok).toContain('href="https://e.com"');

    const blocked = renderNoteMarkdown("[x](javascript:alert(1))");
    // Left as literal text — important thing is there's no anchor href.
    expect(blocked).not.toMatch(/<a[^>]*href=/);
  });

  it("produces no open href quotes even when URL text contains quotes", () => {
    const out = renderNoteMarkdown(`read https://x.com/"onerror=alert(1)//`);
    // The " was escaped to &quot; before autolink, breaking the URL match
    // at that boundary. Either way, no unescaped quote should slip out.
    expect(out).not.toMatch(/href="[^"]*"[^>]*onerror/);
  });

  it("splits paragraphs on blank lines and keeps single newlines as <br>", () => {
    const out = renderNoteMarkdown("one\ntwo\n\nthree");
    expect(out).toContain("<p>one<br>two</p>");
    expect(out).toContain("<p>three</p>");
  });

  it("ignores sentinel characters in user input", () => {
    const weird = renderNoteMarkdown("hello\u0001L0\u0001 world");
    expect(weird).not.toContain("\u0001");
    expect(weird).toContain("hello");
  });
});

describe("plainText", () => {
  it("strips markdown but keeps the words", () => {
    expect(plainText("**bold** and *it* `code`")).toBe("bold and it code");
  });
  it("strips code fences entirely and collapses whitespace", () => {
    expect(plainText("hello\n```\nblock\n```\nworld")).toBe("hello world");
  });
  it("keeps link text, drops the URL", () => {
    expect(plainText("[Bear Creek](https://example.com)")).toBe("Bear Creek");
  });
});
