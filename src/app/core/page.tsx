import Link from "next/link";
import { db } from "@/lib/db";
import { bucketByDate } from "@/lib/strata";
import { StrataColumn } from "@/components/StrataColumn";
import type { Note } from "@/lib/types";

export default async function CorePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag: rawTag } = await searchParams;
  const tag = rawTag?.trim().toLowerCase() || "";

  const allTags = await db.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { notes: true } } },
  });

  let notes: Note[] = [];
  if (tag) {
    const rows = await db.note.findMany({
      where: { tags: { some: { name: tag } } },
      orderBy: { createdAt: "desc" },
      include: { tags: true, topic: true },
    });
    notes = rows.map((n) => ({
      id: n.id,
      topicId: n.topicId,
      body: n.body,
      createdAt: n.createdAt,
      tags: n.tags.map((t) => t.name),
      topicTitle: n.topic.title,
    }));
  }
  const strata = bucketByDate(notes);

  return (
    <main>
      <p className="back-link">
        <Link href="/">← All topics</Link>
      </p>
      <h1>Core sample</h1>
      <p style={{ color: "var(--ink-soft)" }}>
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
