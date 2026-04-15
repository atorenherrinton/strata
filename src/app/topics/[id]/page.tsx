import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { bucketByDate } from "@/lib/strata";
import { StrataColumn } from "@/components/StrataColumn";
import { NewNoteForm } from "@/components/NewNoteForm";
import { TopicHeader } from "@/components/TopicHeader";
import { NoteFocusShortcut } from "@/components/NoteFocusShortcut";
import { matchesAll, tokenize } from "@/lib/search";
import type { Note } from "@/lib/types";

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

  const topic = await db.topic.findUnique({
    where: { id },
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
        include: { tags: true },
      },
    },
  });

  if (!topic) notFound();

  const allNotes: Note[] = topic.notes.map((n) => ({
    id: n.id,
    topicId: n.topicId,
    body: n.body,
    createdAt: n.createdAt,
    tags: n.tags.map((t) => t.name),
  }));
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
            <p style={{ color: "var(--ink-soft)" }}>
              {filtered.length} of {allNotes.length}{" "}
              {allNotes.length === 1 ? "note" : "notes"} match.
            </p>
          ) : null}
          <StrataColumn strata={strata} />
        </>
      )}
    </main>
  );
}
