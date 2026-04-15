import { NextResponse } from "next/server";
import { getAllNotesWithTopic } from "@/lib/queries";
import { matchesAll, tokenize } from "@/lib/search";

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  const terms = tokenize(q);
  if (terms.length === 0) {
    return NextResponse.json({ q, count: 0, notes: [] });
  }
  const all = await getAllNotesWithTopic();
  const matched = all.filter((n) => matchesAll(n, terms));
  return NextResponse.json({ q, count: matched.length, notes: matched });
}
