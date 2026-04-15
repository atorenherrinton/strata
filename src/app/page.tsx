import Link from "next/link";
import { db } from "@/lib/db";
import { NewTopicForm } from "@/components/NewTopicForm";

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function HomePage() {
  const topics = await db.topic.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { notes: true } } },
  });

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
                {t._count.notes} {t._count.notes === 1 ? "note" : "notes"} ·{" "}
                started {formatDate(t.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <NewTopicForm />
    </main>
  );
}
