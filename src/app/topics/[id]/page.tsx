import { StrataColumn } from "@/components/StrataColumn";

export default function TopicPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>Topic {params.id}</h1>
      <StrataColumn strata={[]} />
    </main>
  );
}
