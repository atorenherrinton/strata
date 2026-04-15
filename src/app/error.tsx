"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <h1>A fault in the strata</h1>
      <p>Something broke while loading this page.</p>
      <pre
        style={{
          background: "var(--bg-elev)",
          border: "1px solid var(--rule)",
          padding: "0.75rem",
          borderRadius: "4px",
          fontSize: "0.85rem",
          overflow: "auto",
        }}
      >
        {error.message}
      </pre>
      <div className="actions">
        <button type="button" onClick={reset}>
          Try again
        </button>
        <Link href="/">Back to topics</Link>
      </div>
    </main>
  );
}
