import Link from "next/link";
import { NewTopicForm } from "@/components/NewTopicForm";
import { getTopicsWithNoteCounts } from "@/lib/queries";
import { countLabel, formatShortDate } from "@/lib/format";

function parseImportedBadge(raw: string | undefined): string | null {
  if (!raw) return null;
  const m = raw.match(/^(\d+)t-(\d+)n-(\d+)tags$/);
  if (!m) return null;
  const [, t, n, g] = m;
  return `Imported ${countLabel(+t, "topic")}, ${countLabel(+n, "note")}, and ${countLabel(+g, "tag")}.`;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ imported?: string }>;
}) {
  const { imported } = await searchParams;
  const banner = parseImportedBadge(imported);
  const topics = await getTopicsWithNoteCounts();

  return (
    <main>
      <h1>Topics</h1>
      {banner ? (
        <p className="import-banner" role="status">
          {banner}
        </p>
      ) : null}

      {topics.length === 0 ? (
        <p className="empty">
          No topics yet. Start your first stratum below — a topic is the column
          you stack notes onto.
        </p>
      ) : (
        <ul className="topics-list" aria-label="Topics">
          {topics.map((t) => (
            <li key={t.id}>
              <Link href={`/topics/${t.id}`}>{t.title}</Link>
              <span className="topic-meta">
                {countLabel(t._count.notes, "note")} · started{" "}
                {formatShortDate(t.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <NewTopicForm />

      <p className="muted section-spaced">
        {topics.length > 0 ? (
          <>
            <a href="/api/export" download>
              Export everything as JSON
            </a>
            {" · "}
          </>
        ) : null}
        <Link href="/import">Import from JSON</Link>
      </p>
    </main>
  );
}
