import Link from "next/link";
import { NewTopicForm } from "@/components/NewTopicForm";
import { getTopicsWithNoteCounts } from "@/lib/queries";
import { countLabel, formatShortDate } from "@/lib/format";

export default async function HomePage() {
  const topics = await getTopicsWithNoteCounts();

  return (
    <main>
      <h1>Topics</h1>

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

      {topics.length > 0 ? (
        <p className="muted section-spaced">
          <a href="/api/export" download>
            Export everything as JSON
          </a>
        </p>
      ) : null}
    </main>
  );
}
