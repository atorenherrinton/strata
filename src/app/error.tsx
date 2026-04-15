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

  const isProd = process.env.NODE_ENV === "production";
  const detail = isProd
    ? error.digest
      ? `Reference: ${error.digest}`
      : "The error has been logged."
    : error.message;

  return (
    <main>
      <h1>A fault in the strata</h1>
      <p>Something broke while loading this page.</p>
      <pre className="error-pre">{detail}</pre>
      <div className="actions">
        <button type="button" onClick={reset}>
          Try again
        </button>
        <Link href="/">Back to topics</Link>
      </div>
    </main>
  );
}
