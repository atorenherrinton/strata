import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const topics = await db.topic.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      notes: {
        orderBy: { createdAt: "asc" },
        include: { tags: true },
      },
    },
  });

  const payload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: 1,
    topics: topics.map((t) => ({
      id: t.id,
      title: t.title,
      createdAt: t.createdAt.toISOString(),
      notes: t.notes.map((n) => ({
        id: n.id,
        body: n.body,
        createdAt: n.createdAt.toISOString(),
        tags: n.tags.map((x) => x.name),
      })),
    })),
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="stratum-${new Date()
        .toISOString()
        .slice(0, 10)}.json"`,
    },
  });
}
