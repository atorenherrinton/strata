import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { bucketByDate } from "@/lib/strata";
import { StrataColumn } from "@/components/StrataColumn";
import { NewNoteForm } from "@/components/NewNoteForm";
import { TopicHeader } from "@/components/TopicHeader";

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ err?: string }>;
}) {
  const { id } = await params;
  const { err } = await searchParams;
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

  const notes = topic.notes.map((n) => ({
    id: n.id,
    topicId: n.topicId,
    body: n.body,
    createdAt: n.createdAt,
    tags: n.tags.map((t) => t.name),
  }));
  const strata = bucketByDate(notes);

  return (
    <main>
      <p className="back-link">
        <Link href="/">← All topics</Link>
      </p>
      <TopicHeader topicId={id} title={topic.title} noteCount={notes.length} />
      {err ? (
        <p className="form-error" role="alert">
          {err}
        </p>
      ) : null}
      <NewNoteForm topicId={id} />
      {notes.length === 0 ? (
        <p className="empty">
          No notes yet. Add one above — each note lands in today's layer.
        </p>
      ) : (
        <StrataColumn strata={strata} />
      )}
    </main>
  );
}
