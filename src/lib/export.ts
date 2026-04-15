export type ExportNote = {
  id: string;
  body: string;
  createdAt: Date | string;
  tags: string[];
};

export type ExportTopic = {
  id: string;
  title: string;
  createdAt: Date | string;
  notes: ExportNote[];
};

export function topicToMarkdown(topic: ExportTopic): string {
  const lines: string[] = [];
  lines.push(`# ${topic.title}`);
  lines.push("");
  const byDate = new Map<string, ExportNote[]>();
  for (const n of topic.notes) {
    const d = new Date(n.createdAt).toISOString().slice(0, 10);
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d)!.push(n);
  }
  const dates = [...byDate.keys()].sort((a, b) => (a < b ? 1 : -1));
  for (const d of dates) {
    lines.push(`## ${d}`);
    lines.push("");
    for (const n of byDate.get(d)!) {
      const tags = n.tags.length ? "  " + n.tags.map((t) => `#${t}`).join(" ") : "";
      const body = n.body.replace(/\n/g, "\n  ");
      lines.push(`- ${body}${tags}`);
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "export"
  );
}
