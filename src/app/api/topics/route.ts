import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ topics: [] });
}

export async function POST(_req: Request) {
  return NextResponse.json({ id: null }, { status: 501 });
}
