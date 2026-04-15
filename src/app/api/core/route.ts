import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const tag = new URL(req.url).searchParams.get("tag");
  const notes = await db.note.findMany({
    where: tag ? { tags: { some: { name: tag } } } : undefined,
    orderBy: { createdAt: "desc" },
    include: { tags: true, topic: true },
  });
  return NextResponse.json({ notes });
}
