import Link from "next/link";
import { db } from "@/lib/db";
import { createTopic } from "./actions";

export default async function HomePage() {
  const topics = await db.topic.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main>
      <h1>Stratum</h1>
      <p>
        <Link href="/core">Core sample →</Link>
      </p>

      <h2>Topics</h2>
      <ul>
        {topics.map((t) => (
          <li key={t.id}>
            <Link href={`/topics/${t.id}`}>{t.title}</Link>
          </li>
        ))}
      </ul>

      <h2>New topic</h2>
      <form action={createTopic}>
        <input name="title" placeholder="Topic title" required />
        <button type="submit">Create</button>
      </form>
    </main>
  );
}
