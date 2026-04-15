"use client";

import { useEffect } from "react";

// Press "n" to jump focus to the new-note textarea on the topic page.
export function NoteFocusShortcut() {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "n" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      const el = document.getElementById("note-body") as HTMLTextAreaElement | null;
      if (el) {
        e.preventDefault();
        el.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
