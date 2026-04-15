"use client";

import { useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useKeybinding } from "@/lib/useKeybinding";

export function SearchBar() {
  const ref = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const params = useSearchParams();
  const currentQ = pathname === "/search" ? (params.get("q") ?? "") : "";

  const focusSearch = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    ref.current?.focus();
    ref.current?.select();
  }, []);
  useKeybinding("/", focusSearch);

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
