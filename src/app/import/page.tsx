import Link from "next/link";
import { ImportForm } from "@/components/ImportForm";

export default function ImportPage() {
  return (
    <main>
      <p className="back-link">
        <Link href="/">← All topics</Link>
      </p>
      <h1>Import</h1>
      <p className="muted">
        Upload a JSON file emitted by <code>GET /api/export</code> (or the "Export
        everything as JSON" link on the home page). Imports are additive — every
        topic in the file becomes a fresh topic here, duplicates and all.
      </p>
      <p className="muted">
        Schema: <code>{`{ schemaVersion: 1, topics: [{ title, createdAt?, notes: [{ body, createdAt, tags: string[] }] }] }`}</code>
      </p>
      <ImportForm />
    </main>
  );
}
