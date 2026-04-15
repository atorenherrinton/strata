import type { Note, Stratum } from "./types";

export function bucketByDate(notes: Note[]): Stratum[] {
  const buckets = new Map<string, Note[]>();
  for (const n of notes) {
    const date = new Date(n.createdAt).toISOString().slice(0, 10);
    if (!buckets.has(date)) buckets.set(date, []);
    buckets.get(date)!.push(n);
  }
  return [...buckets.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, notes]) => ({ date, notes }));
}
