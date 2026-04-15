import { Suspense } from "react";
import Link from "next/link";
import { SearchBar } from "./SearchBar";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          Stratum
        </Link>
        <Suspense fallback={<div className="header-search" aria-hidden />}>
          <SearchBar />
        </Suspense>
        <nav className="nav" aria-label="Primary">
          <Link href="/">Topics</Link>
          <Link href="/core">Core</Link>
          <Link href="/tags">Tags</Link>
          <Link href="/search">Search</Link>
        </nav>
      </div>
    </header>
  );
}
