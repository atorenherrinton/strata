import Link from "next/link";
import { notFound } from "next/navigation";
import { bucketByDate } from "@/lib/strata";
import { getTopicWithNotes, toNote } from "@/lib/queries";
import { matchesAll, tokenize } from "@/lib/search";
import { countLabel } from "@/lib/format";
import { StrataColumn } from "@/components/StrataColumn";
import { NewNoteForm } from "@/components/NewNoteForm";
import { TopicHeader } from "@/components/TopicHeader";
import { NoteFocusShortcut } from "@/components/NoteFocusShortcut";

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ err?: string; q?: string }>;
}) {
  const { id } = await params;
  const { err, q: rawQ } = await searchParams;
  const q = (rawQ ?? "").trim();
  const terms = tokenize(q);

  const topic = await getTopicWithNotes(id);
  if (!topic) notFound();

  const allNotes = topic.notes.map(toNote);
  const filtered = terms.length
    ? allNotes.filter((n) => matchesAll(n, terms))
    : allNotes;
  const strata = bucketByDate(filtered);

  return (
    <main>
      <NoteFocusShortcut />
      <p className="back-link">
        <Link href="/">← All topics</Link>
      </p>
      <TopicHeader
        topicId={id}
        title={topic.title}
        noteCount={allNotes.length}
      />
      {err ? (
        <p className="form-error" role="alert">
          {err}
        </p>
      ) : null}

      <form
        action={`/topics/${id}`}
        method="get"
        role="search"
        className="form-row"
      >
        <label htmlFor="topic-q">Filter this topic</label>
        <input
          id="topic-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Filter notes in this topic…"
        />
        {q ? (
          <div className="actions">
            <button type="submit">Apply</button>
            <Link href={`/topics/${id}`} className="back-link">
              Clear
            </Link>
          </div>
        ) : null}
      </form>

      <NewNoteForm topicId={id} />

      {allNotes.length === 0 ? (
        <p className="empty">
          No notes yet. Add one above — each note lands in today's layer. (Press{" "}
          <kbd>n</kbd> to focus the note field.)
        </p>
      ) : filtered.length === 0 ? (
        <p className="empty">
          No notes in this topic match <code>{q}</code>.
        </p>
      ) : (
        <>
          {q ? (
            <p className="muted">
              {filtered.length} of {countLabel(allNotes.length, "note")} match.
            </p>
          ) : null}
          <StrataColumn strata={strata} />
        </>
      )}
    </main>
  );
}
