import Link from "next/link";
import { db } from "@/lib/db";
import { bucketByDate } from "@/lib/strata";
import { StrataColumn } from "@/components/StrataColumn";
import { NewNoteForm } from "@/components/NewNoteForm";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = await db.topic.findUnique({
    where: { id },
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
        include: { tags: true },
      },
    },
  });

  const notes = (topic?.notes ?? []).map((n) => ({
    id: n.id,
    topicId: n.topicId,
    body: n.body,
    createdAt: n.createdAt,
    tags: n.tags.map((t) => t.name),
  }));
  const strata = bucketByDate(notes);

  return (
    <main>
      <p>
        <Link href="/">← All topics</Link>
      </p>
      <h1>{topic?.title}</h1>
      <NewNoteForm topicId={id} />
      <StrataColumn strata={strata} />
    </main>
  );
}
