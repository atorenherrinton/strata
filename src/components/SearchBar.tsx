"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function SearchBar() {
  const ref = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const params = useSearchParams();
  const currentQ = pathname === "/search" ? params.get("q") ?? "" : "";

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      ref.current?.focus();
      ref.current?.select();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form action="/search" method="get" role="search" className="header-search">
      <label htmlFor="header-q" className="visually-hidden">
        Search
      </label>
      <input
        ref={ref}
        id="header-q"
        name="q"
        type="search"
        defaultValue={currentQ}
        placeholder="Search  (press /)"
        aria-keyshortcuts="/"
      />
    </form>
  );
}
