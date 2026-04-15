export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(s: string): string {
  // CDATA can't contain the sequence ]]>. Defensive split-and-rejoin.
  return `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

export type FeedItem = {
  title: string;
  link: string;
  guid: string;
  pubDate: Date | string;
  description: string;
  contentHtml?: string;
  categories?: string[];
};

export type FeedMeta = {
  title: string;
  link: string;
  description: string;
  items: FeedItem[];
  lastBuildDate?: Date;
};

export function buildRss(feed: FeedMeta): string {
  const lastBuild = (feed.lastBuildDate ?? new Date()).toUTCString();
  const hasHtml = feed.items.some((i) => i.contentHtml);
  const nsContent = hasHtml
    ? ' xmlns:content="http://purl.org/rss/1.0/modules/content/"'
    : "";
  const items = feed.items
    .map((i) => {
      const cats = (i.categories ?? [])
        .map((c) => `    <category>${escapeXml(c)}</category>`)
        .join("\n");
      const content = i.contentHtml
        ? `\n    <content:encoded>${cdata(i.contentHtml)}</content:encoded>`
        : "";
      return `  <item>
    <title>${escapeXml(i.title)}</title>
    <link>${escapeXml(i.link)}</link>
    <guid isPermaLink="false">${escapeXml(i.guid)}</guid>
    <pubDate>${new Date(i.pubDate).toUTCString()}</pubDate>
    <description>${escapeXml(i.description)}</description>${cats ? "\n" + cats : ""}${content}
  </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"${nsContent}>
<channel>
  <title>${escapeXml(feed.title)}</title>
  <link>${escapeXml(feed.link)}</link>
  <description>${escapeXml(feed.description)}</description>
  <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
</channel>
</rss>
`;
}
