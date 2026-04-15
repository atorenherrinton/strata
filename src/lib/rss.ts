export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export type FeedItem = {
  title: string;
  link: string;
  guid: string;
  pubDate: Date | string;
  description: string;
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
  const items = feed.items
    .map((i) => {
      const cats = (i.categories ?? [])
        .map((c) => `    <category>${escapeXml(c)}</category>`)
        .join("\n");
      return `  <item>
    <title>${escapeXml(i.title)}</title>
    <link>${escapeXml(i.link)}</link>
    <guid isPermaLink="false">${escapeXml(i.guid)}</guid>
    <pubDate>${new Date(i.pubDate).toUTCString()}</pubDate>
    <description>${escapeXml(i.description)}</description>${cats ? "\n" + cats : ""}
  </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
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
