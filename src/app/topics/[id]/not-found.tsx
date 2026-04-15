import Link from "next/link";

export default function TopicNotFound() {
  return (
    <main>
      <h1>Topic not found</h1>
      <p>This topic may have been deleted, or the link is wrong.</p>
      <p>
        <Link href="/">← Back to topics</Link>
      </p>
    </main>
  );
}
