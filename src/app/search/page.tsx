import Link from "next/link";
import { db } from "@/lib/db";
import { bucketByDate } from "@/lib/strata";
import { matchesAll, tokenize, type SearchableNote } from "@/lib/search";
import { StrataColumn } from "@/components/StrataColumn";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = (rawQ ?? "").trim();
  const terms = tokenize(q);

  let notes: SearchableNote[] = [];
  let total = 0;
  if (terms.length > 0) {
    const rows = await db.note.findMany({
      orderBy: { createdAt: "desc" },
      include: { tags: true, topic: true },
    });
    total = rows.length;
    notes = rows
      .map((n) => ({
        id: n.id,
        topicId: n.topicId,
        body: n.body,
        createdAt: n.createdAt,
        tags: n.tags.map((t) => t.name),
        topicTitle: n.topic.title,
      }))
      .filter((n) => matchesAll(n, terms));
  }

  const strata = bucketByDate(notes);

  return (
    <main>
      <p className="back-link">
        <Link href="/">← All topics</Link>
      </p>
      <h1>Search</h1>
      <form action="/search" method="get" role="search" className="form-row">
        <label htmlFor="q">Query</label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search note text, tags, and topic titles…"
          autoFocus
        />
        <span className="hint">
          Space-separated terms are ANDed. Tags and topic titles are included.
        </span>
        <div className="actions">
          <button type="submit">Search</button>
          {q ? (
            <Link href="/search" className="back-link">
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      {terms.length === 0 ? null : notes.length === 0 ? (
        <p className="empty">
          No notes match <code>{q}</code>. Searched {total}{" "}
          {total === 1 ? "note" : "notes"}.
        </p>
      ) : (
        <>
          <p style={{ color: "var(--ink-soft)" }}>
            {notes.length} of {total} {total === 1 ? "note" : "notes"} matched.
          </p>
          <StrataColumn strata={strata} editable={false} showTopicPrefix />
        </>
      )}
    </main>
  );
}
