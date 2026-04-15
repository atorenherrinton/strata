import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const notes = await db.note.findMany({
    where: { topicId: id },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });
  return NextResponse.json({ notes });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const { body, tags } = (await req.json()) as {
    body: string;
    tags?: string[];
  };
  const note = await db.note.create({
    data: {
      topicId: id,
      body,
      tags: {
        connectOrCreate: (tags ?? []).map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: { tags: true },
  });
  return NextResponse.json(note, { status: 201 });
}
