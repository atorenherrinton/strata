import Link from "next/link";
import { bucketByDate } from "@/lib/strata";
import { getNotesByTag, getTagsWithCounts } from "@/lib/queries";
import { StrataColumn } from "@/components/StrataColumn";
import type { Note } from "@/lib/types";

export default async function CorePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag: rawTag } = await searchParams;
  const tag = rawTag?.trim().toLowerCase() || "";

  const allTags = await getTagsWithCounts();
  const notes: Note[] = tag ? await getNotesByTag(tag) : [];
  const strata = bucketByDate(notes);

  return (
    <main>
      <p className="back-link">
        <Link href="/">← All topics</Link>
      </p>
      <h1>Core sample</h1>
      <p className="muted">
        Pick a tag to slice a cross-section across every topic.
      </p>

      {allTags.length === 0 ? (
        <p className="empty">
          No tags yet. Tag a note inside any topic and it will show up here.
        </p>
      ) : (
        <form action="/core" method="get" className="form-row" role="search">
          <label htmlFor="core-tag">Tag</label>
          <select id="core-tag" name="tag" defaultValue={tag}>
            <option value="">— pick a tag —</option>
            {allTags.map((t) => (
              <option key={t.id} value={t.name}>
                #{t.name} ({t._count.notes})
              </option>
            ))}
          </select>
          <div className="actions">
            <button type="submit">Core</button>
            {tag ? (
              <Link href="/core" className="back-link">
                Clear
              </Link>
            ) : null}
          </div>
        </form>
      )}

      {tag && notes.length === 0 ? (
        <p className="empty">
          No notes tagged <code>#{tag}</code>.
        </p>
      ) : null}
      {tag && notes.length > 0 ? (
        <StrataColumn strata={strata} editable={false} showTopicPrefix />
      ) : null}
    </main>
  );
}
