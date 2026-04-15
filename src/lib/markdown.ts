// Minimal, dependency-free, safe-by-construction markdown renderer.
//
// Supported:
//   **bold**
//   *italic* and _italic_
//   `inline code`
//   ```fenced code blocks```
//   [label](https://url)   -- http(s):// and absolute /path only
//   autolinked http(s) URLs
//   paragraph breaks (blank line), soft line breaks (<br>)
//
// Safety model: every piece of user text is escaped before any HTML is
// emitted. The output contains ONLY: <p>, <br>, <strong>, <em>, <code>,
// <pre>, <a href="..." rel="noopener noreferrer">. URLs captured from
// escaped source can't introduce quotes into the attribute because the
// escape step already neutralised them.

const SENTINEL = "\u0001";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderBlock(raw: string): string {
  const codeSpans: string[] = [];
  const linkHtml: string[] = [];

  // 0. Strip any lurking sentinel chars so user input can't collide.
  let t = raw.split(SENTINEL).join("");

  // 1. Extract inline code to placeholders (protect from further passes).
  t = t.replace(/`([^`\n]+)`/g, (_m, body: string) => {
    codeSpans.push(body);
    return `${SENTINEL}S${codeSpans.length - 1}${SENTINEL}`;
  });

  // 2. Escape all remaining text.
  t = esc(t);

  // 3. Extract [text](url) to link placeholders. The URL only matches
  //    http(s):// or a site-absolute /path so `javascript:` etc. never hit.
  t = t.replace(
    /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
    (_m, label: string, href: string) => {
      linkHtml.push(
        `<a href="${href}" rel="noopener noreferrer">${label}</a>`,
      );
      return `${SENTINEL}L${linkHtml.length - 1}${SENTINEL}`;
    },
  );

  // 4. Autolink bare URLs to placeholders. Use a non-capturing prefix so we
  //    don't eat the leading boundary character.
  t = t.replace(
    /(^|[^">])(https?:\/\/[^\s<)]+)/g,
    (_m, prefix: string, url: string) => {
      linkHtml.push(
        `<a href="${url}" rel="noopener noreferrer">${url}</a>`,
      );
      return `${prefix}${SENTINEL}L${linkHtml.length - 1}${SENTINEL}`;
    },
  );

  // 5. Bold / italic on plain escaped text (placeholders are digits so
  //    they can't be mistaken for content).
  t = t.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  t = t.replace(/(^|\W)_([^_\n]+)_(?!\w)/g, "$1<em>$2</em>");

  // 6. Restore link placeholders (already HTML).
  t = t.replace(
    new RegExp(`${SENTINEL}L(\\d+)${SENTINEL}`, "g"),
    (_m, i) => linkHtml[Number(i)],
  );

  // 7. Restore inline code placeholders, escaping their contents now.
  t = t.replace(
    new RegExp(`${SENTINEL}S(\\d+)${SENTINEL}`, "g"),
    (_m, i) => `<code>${esc(codeSpans[Number(i)])}</code>`,
  );

  // 8. Soft line breaks.
  return t.replace(/\n/g, "<br>");
}

export function renderNoteMarkdown(raw: string): string {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      out.push(`<p>${renderBlock(paragraph.join("\n"))}</p>`);
      paragraph = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      flushParagraph();
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        body.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // consume closing fence if present
      out.push(`<pre><code>${esc(body.join("\n"))}</code></pre>`);
      continue;
    }
    if (line.trim() === "") {
      flushParagraph();
    } else {
      paragraph.push(line);
    }
    i++;
  }
  flushParagraph();

  return out.join("\n");
}

// Plain-text projection of a note body: useful for search haystacks,
// RSS descriptions, and any context that shouldn't leak markdown syntax.
export function plainText(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\b_([^_]+)_\b/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
