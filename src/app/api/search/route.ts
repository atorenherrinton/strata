import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { matchesAll, tokenize } from "@/lib/search";

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  const terms = tokenize(q);
  if (terms.length === 0) {
    return NextResponse.json({ q, count: 0, notes: [] });
  }

  const rows = await db.note.findMany({
    orderBy: { createdAt: "desc" },
    include: { tags: true, topic: true },
  });
  const matched = rows
    .map((n) => ({
      id: n.id,
      topicId: n.topicId,
      topicTitle: n.topic.title,
      body: n.body,
      createdAt: n.createdAt,
      tags: n.tags.map((t) => t.name),
    }))
    .filter((n) => matchesAll(n, terms));

  return NextResponse.json({ q, count: matched.length, notes: matched });
}
