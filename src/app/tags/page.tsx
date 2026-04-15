import Link from "next/link";
import { getTagsWithCounts } from "@/lib/queries";
import { TagRow } from "@/components/TagRow";

export const dynamic = "force-dynamic";

export default async function TagsPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string }>;
}) {
  const { err } = await searchParams;
  const tags = await getTagsWithCounts();

  return (
    <main>
      <p className="back-link">
        <Link href="/">← All topics</Link>
      </p>
      <h1>Tags</h1>
      <p className="muted">
        Rename a tag to retitle it everywhere. Renaming to an existing tag merges the
        two. Deleting removes the tag from every note; the notes stay.
      </p>
      {err ? (
        <p className="form-error" role="alert">
          {err}
        </p>
      ) : null}

      {tags.length === 0 ? (
        <p className="empty">No tags yet.</p>
      ) : (
        <ul className="topics-list" aria-label="Tags">
          {tags.map((t) => (
            <TagRow key={t.id} name={t.name} count={t._count.notes} />
          ))}
        </ul>
      )}
    </main>
  );
}
