import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateTagsInput } from "@/lib/validate";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ name: string }> },
) {
  const { name } = await ctx.params;
  let payload: { name?: unknown };
  try {
    payload = (await req.json()) as { name?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const tags = validateTagsInput(payload.name);
  if (!tags.ok || tags.value.length !== 1) {
    return NextResponse.json(
      { error: tags.ok ? "Provide exactly one replacement tag." : tags.error },
      { status: 400 },
    );
  }
  const target = tags.value[0];
  const source = await db.tag.findUnique({ where: { name } });
  if (!source)
    return NextResponse.json({ error: "Tag not found." }, { status: 404 });

  if (target === name) return NextResponse.json({ name: target });

  const existing = await db.tag.findUnique({ where: { name: target } });
  if (existing) {
    const sourceWithNotes = await db.tag.findUnique({
      where: { name },
      include: { notes: { select: { id: true } } },
    });
    if (sourceWithNotes) {
      await db.$transaction([
        ...sourceWithNotes.notes.map((n) =>
          db.note.update({
            where: { id: n.id },
            data: {
              tags: {
                disconnect: { id: sourceWithNotes.id },
                connect: { id: existing.id },
              },
            },
          }),
        ),
        db.tag.delete({ where: { id: sourceWithNotes.id } }),
      ]);
    }
    return NextResponse.json({ name: target, merged: true });
  }
  await db.tag.update({ where: { name }, data: { name: target } });
  return NextResponse.json({ name: target, merged: false });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ name: string }> },
) {
  const { name } = await ctx.params;
  const source = await db.tag.findUnique({ where: { name } });
  if (!source)
    return NextResponse.json({ error: "Tag not found." }, { status: 404 });
  await db.tag.delete({ where: { name } });
  return new NextResponse(null, { status: 204 });
}
