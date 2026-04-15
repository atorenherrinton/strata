import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateBody, validateTagsInput } from "@/lib/validate";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const topic = await db.topic.findUnique({ where: { id }, select: { id: true } });
  if (!topic)
    return NextResponse.json({ error: "Topic not found." }, { status: 404 });

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
  const topic = await db.topic.findUnique({ where: { id }, select: { id: true } });
  if (!topic)
    return NextResponse.json({ error: "Topic not found." }, { status: 404 });

  let payload: { body?: unknown; tags?: unknown };
  try {
    payload = (await req.json()) as { body?: unknown; tags?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body = validateBody(payload.body);
  if (!body.ok) return NextResponse.json({ error: body.error }, { status: 400 });

  const tagsRaw = Array.isArray(payload.tags)
    ? payload.tags.join(",")
    : typeof payload.tags === "string"
      ? payload.tags
      : "";
  const tags = validateTagsInput(tagsRaw);
  if (!tags.ok) return NextResponse.json({ error: tags.error }, { status: 400 });

  const note = await db.note.create({
    data: {
      topicId: id,
      body: body.value,
      tags: {
        connectOrCreate: tags.value.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    include: { tags: true },
  });
  return NextResponse.json(note, { status: 201 });
}
