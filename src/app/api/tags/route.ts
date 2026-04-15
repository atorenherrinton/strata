import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const tags = await db.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { notes: true } } },
  });
  return NextResponse.json({
    tags: tags.map((t) => ({ name: t.name, count: t._count.notes })),
  });
}
