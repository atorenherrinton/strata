import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify, topicToMarkdown } from "@/lib/export";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const format = (new URL(req.url).searchParams.get("format") ?? "json").toLowerCase();

  const topic = await db.topic.findUnique({
    where: { id },
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
        include: { tags: true },
      },
    },
  });
  if (!topic)
    return NextResponse.json({ error: "Topic not found." }, { status: 404 });

  const slug = slugify(topic.title);

  if (format === "md" || format === "markdown") {
    const md = topicToMarkdown({
      id: topic.id,
      title: topic.title,
      createdAt: topic.createdAt,
      notes: topic.notes.map((n) => ({
        id: n.id,
        body: n.body,
        createdAt: n.createdAt,
        tags: n.tags.map((t) => t.name),
      })),
    });
    return new NextResponse(md, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}.md"`,
      },
    });
  }

  const payload = {
    id: topic.id,
    title: topic.title,
    createdAt: topic.createdAt.toISOString(),
    notes: topic.notes.map((n) => ({
      id: n.id,
      body: n.body,
      createdAt: n.createdAt.toISOString(),
      tags: n.tags.map((t) => t.name),
    })),
  };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.json"`,
    },
  });
}
