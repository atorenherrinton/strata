import Link from "next/link";
import type { Page } from "@/lib/pagination";

export function Pager({
  page,
  pathname,
  extraParams = {},
}: {
  page: Page<unknown>;
  pathname: string;
  extraParams?: Record<string, string>;
}) {
  if (page.totalPages <= 1) return null;

  const hrefFor = (n: number) => {
    const params = new URLSearchParams(extraParams);
    if (n > 1) params.set("page", String(n));
    else params.delete("page");
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const prev = page.page > 1 ? hrefFor(page.page - 1) : null;
  const next = page.page < page.totalPages ? hrefFor(page.page + 1) : null;

  return (
    <nav className="pager" aria-label="Pagination">
      {prev ? (
        <Link href={prev} rel="prev">
          ← Newer
        </Link>
      ) : (
        <span className="pager-spacer" aria-hidden />
      )}
      <span className="pager-position">
        Page {page.page} of {page.totalPages}
      </span>
      {next ? (
        <Link href={next} rel="next">
          Older →
        </Link>
      ) : (
        <span className="pager-spacer" aria-hidden />
      )}
    </nav>
  );
}
