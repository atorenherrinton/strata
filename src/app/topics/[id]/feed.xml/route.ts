import { NextResponse } from "next/server";
import { getTopicWithNotes } from "@/lib/queries";
import { buildRss } from "@/lib/rss";

function baseUrl(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const topic = await getTopicWithNotes(id);
  if (!topic)
    return NextResponse.json({ error: "Topic not found." }, { status: 404 });

  const site = baseUrl(req);
  const link = `${site}/topics/${topic.id}`;
  const items = topic.notes.slice(0, 50).map((n) => ({
    title:
      n.body.slice(0, 80).replace(/\n+/g, " ").trim() +
      (n.body.length > 80 ? "…" : ""),
    link,
    guid: n.id,
    pubDate: n.createdAt,
    description: n.body,
    categories: n.tags.map((t) => t.name),
  }));

  const xml = buildRss({
    title: `Stratum — ${topic.title}`,
    link,
    description: `Time-layered notes for "${topic.title}".`,
    items,
    lastBuildDate: topic.notes[0]?.createdAt ?? new Date(),
  });

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}
