import type { Topic } from "@/lib/types";

export function TopicList({ topics }: { topics: Topic[] }) {
  return (
    <ul>
      {topics.map((t) => (
        <li key={t.id}>{t.title}</li>
      ))}
    </ul>
  );
}
