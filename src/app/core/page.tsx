import Link from "next/link";
import { db } from "@/lib/db";
import { bucketByDate } from "@/lib/strata";
import { StrataColumn } from "@/components/StrataColumn";

export default async function CorePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const allTags = await db.tag.findMany({ orderBy: { name: "asc" } });

  const notes = tag
    ? (
        await db.note.findMany({
          where: { tags: { some: { name: tag } } },
          orderBy: { createdAt: "desc" },
          include: { tags: true, topic: true },
        })
      ).map((n) => ({
        id: n.id,
        topicId: n.topicId,
        body: `[${n.topic.title}] ${n.body}`,
        createdAt: n.createdAt,
        tags: n.tags.map((t) => t.name),
      }))
    : [];
  const strata = bucketByDate(notes);

  return (
    <main>
      <p>
        <Link href="/">← Home</Link>
      </p>
      <h1>Core sample</h1>
      <form action="/core" method="get">
        <select name="tag" defaultValue={tag ?? ""}>
          <option value="">— pick a tag —</option>
          {allTags.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
        <button type="submit">Core</button>
      </form>
      {tag ? <StrataColumn strata={strata} /> : null}
    </main>
  );
}
