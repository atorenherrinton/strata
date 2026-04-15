import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          Stratum
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/">Topics</Link>
          <Link href="/core">Core sample</Link>
        </nav>
      </div>
    </header>
  );
}
