import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const topics = await db.topic.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ topics });
}

export async function POST(req: Request) {
  const { title } = await req.json();
  const topic = await db.topic.create({ data: { title } });
  return NextResponse.json(topic, { status: 201 });
}
