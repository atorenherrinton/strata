import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("tag") ?? "";
  const tag = raw.trim().toLowerCase();
  if (!tag) {
    return NextResponse.json(
      { error: "Missing 'tag' query parameter." },
      { status: 400 },
    );
  }
  const notes = await db.note.findMany({
    where: { tags: { some: { name: tag } } },
    orderBy: { createdAt: "desc" },
    include: { tags: true, topic: true },
  });
  return NextResponse.json({ tag, count: notes.length, notes });
}
