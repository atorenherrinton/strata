import { NextResponse } from "next/server";

export async function GET(_req: Request, _ctx: { params: { id: string } }) {
  return NextResponse.json({ notes: [] });
}

export async function POST(_req: Request, _ctx: { params: { id: string } }) {
  return NextResponse.json({ id: null }, { status: 501 });
}
