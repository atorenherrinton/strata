import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Off the map</h1>
      <p>There's no stratum at that depth.</p>
      <p>
        <Link href="/">← Back to topics</Link>
      </p>
    </main>
  );
}
