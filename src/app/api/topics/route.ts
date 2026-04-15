import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateTitle } from "@/lib/validate";

export async function GET() {
  const topics = await db.topic.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ topics });
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const title = validateTitle((payload as { title?: unknown })?.title);
  if (!title.ok) return NextResponse.json({ error: title.error }, { status: 400 });

  const topic = await db.topic.create({ data: { title: title.value } });
  return NextResponse.json(topic, { status: 201 });
}
