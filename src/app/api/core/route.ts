import { NextResponse } from "next/server";

// Core-sample endpoint: cross-section of notes across topics filtered by tag.
export async function GET(_req: Request) {
  return NextResponse.json({ core: [] });
}
