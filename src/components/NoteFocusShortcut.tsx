"use client";

import { useCallback } from "react";
import { useKeybinding } from "@/lib/useKeybinding";

// Press "n" to jump focus to the new-note textarea on the topic page.
export function NoteFocusShortcut() {
  const focusNote = useCallback((e: KeyboardEvent) => {
    const el = document.getElementById("note-body") as HTMLTextAreaElement | null;
    if (el) {
      e.preventDefault();
      el.focus();
    }
  }, []);
  useKeybinding("n", focusNote);
  return null;
}
