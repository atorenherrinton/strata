import type { Note } from "./types";
import { plainText } from "./markdown";

// Tokenize a search query into lowercase terms. AND semantics between terms.
export function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export type SearchableNote = Note & { topicTitle?: string };

// In-memory case-insensitive filter. Good enough for the SQLite/single-user
// scale this app targets; swap for FTS5 or Postgres tsvector at scale.
export function matchesAll(note: SearchableNote, terms: string[]): boolean {
  if (terms.length === 0) return true;
  const haystack = [
    plainText(note.body),
    note.topicTitle ?? "",
    note.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return terms.every((t) => haystack.includes(t.toLowerCase()));
}

export function highlight(text: string, terms: string[]): Array<{ text: string; hit: boolean }> {
  if (terms.length === 0) return [{ text, hit: false }];
  const lower = text.toLowerCase();
  const marks: Array<[number, number]> = [];
  for (const t of terms) {
    let i = 0;
    while (true) {
      const pos = lower.indexOf(t, i);
      if (pos === -1) break;
      marks.push([pos, pos + t.length]);
      i = pos + t.length;
    }
  }
  if (marks.length === 0) return [{ text, hit: false }];
  marks.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const m of marks) {
    const last = merged[merged.length - 1];
    if (last && m[0] <= last[1]) last[1] = Math.max(last[1], m[1]);
    else merged.push([m[0], m[1]]);
  }
  const parts: Array<{ text: string; hit: boolean }> = [];
  let cursor = 0;
  for (const [s, e] of merged) {
    if (s > cursor) parts.push({ text: text.slice(cursor, s), hit: false });
    parts.push({ text: text.slice(s, e), hit: true });
    cursor = e;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), hit: false });
  return parts;
}
