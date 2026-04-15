import Link from "next/link";
import { notFound } from "next/navigation";
import { bucketByDate } from "@/lib/strata";
import { getTopicPage, getTopicWithNotes, toNote } from "@/lib/queries";
import { matchesAll, tokenize } from "@/lib/search";
import { countLabel } from "@/lib/format";
import { PAGE_SIZE, paginate, parsePage } from "@/lib/pagination";
import { StrataColumn } from "@/components/StrataColumn";
import { NewNoteForm } from "@/components/NewNoteForm";
import { TopicHeader } from "@/components/TopicHeader";
import { NoteFocusShortcut } from "@/components/NoteFocusShortcut";
import { Pager } from "@/components/Pager";

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ err?: string; q?: string; page?: string }>;
}) {
  const { id } = await params;
  const { err, q: rawQ, page: rawPage } = await searchParams;
  const q = (rawQ ?? "").trim();
  const terms = tokenize(q);
  const pageNum = parsePage(rawPage);
  const filtering = terms.length > 0;

  // Two paths: paginated DB read (no filter) vs. full read + in-memory
  // filter + paginate (search within topic). The in-memory path is still
  // bounded by one topic's note count, which is the right ceiling.
  let notes;
  let pagerInfo;

  if (!filtering) {
    const { topic, total } = await getTopicPage(id, {
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
    if (!topic) notFound();
    notes = topic.notes.map(toNote);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    pagerInfo = {
      topic,
      totalAll: total,
      page: {
        items: notes,
        page: Math.min(pageNum, totalPages),
        pageSize: PAGE_SIZE,
        total,
        totalPages,
      },
      filteredCount: total,
    };
  } else {
    const topic = await getTopicWithNotes(id);
    if (!topic) notFound();
    const all = topic.notes.map(toNote);
    const matched = all.filter((n) => matchesAll(n, terms));
    const page = paginate(matched, pageNum);
    notes = page.items;
    pagerInfo = { topic, totalAll: all.length, page, filteredCount: matched.length };
  }

  const { topic, totalAll, page, filteredCount } = pagerInfo;
  const strata = bucketByDate(notes);

  return (
    <main>
      <NoteFocusShortcut />
      <p className="back-link">
        <Link href="/">← All topics</Link>
      </p>
      <TopicHeader topicId={id} title={topic.title} noteCount={totalAll} />
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

      {totalAll === 0 ? (
        <p className="empty">
          No notes yet. Add one above — each note lands in today's layer. (Press{" "}
          <kbd>n</kbd> to focus the note field.)
        </p>
      ) : filtering && filteredCount === 0 ? (
        <p className="empty">
          No notes in this topic match <code>{q}</code>.
        </p>
      ) : (
        <>
          {filtering ? (
            <p className="muted">
              {filteredCount} of {countLabel(totalAll, "note")} match.
            </p>
          ) : null}
          <StrataColumn strata={strata} />
          <Pager
            page={page}
            pathname={`/topics/${id}`}
            extraParams={q ? { q } : {}}
          />
        </>
      )}
    </main>
  );
}
