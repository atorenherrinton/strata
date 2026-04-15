import Link from "next/link";
import { bucketByDate } from "@/lib/strata";
import { getAllNotesWithTopic } from "@/lib/queries";
import { matchesAll, tokenize } from "@/lib/search";
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

  const all = terms.length ? await getAllNotesWithTopic() : [];
  const matched = all.filter((n) => matchesAll(n, terms));
  const strata = bucketByDate(matched);

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

      {terms.length === 0 ? null : matched.length === 0 ? (
        <p className="empty">
          No notes match <code>{q}</code>. Searched {all.length}{" "}
          {all.length === 1 ? "note" : "notes"}.
        </p>
      ) : (
        <>
          <p className="muted">
            {matched.length} of {all.length}{" "}
            {all.length === 1 ? "note" : "notes"} matched.
          </p>
          <StrataColumn strata={strata} editable={false} showTopicPrefix />
        </>
      )}
    </main>
  );
}
