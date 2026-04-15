"use client";

import { useEffect } from "react";

function isTypingContext(el: EventTarget | null): boolean {
  const node = el as HTMLElement | null;
  if (!node) return false;
  return (
    node.tagName === "INPUT" ||
    node.tagName === "TEXTAREA" ||
    node.tagName === "SELECT" ||
    node.isContentEditable
  );
}

type Options = {
  // Skip the handler when the user is typing in an input/textarea/etc.
  skipInTypingContext?: boolean;
  // Run even when the user holds a modifier. Default: skip.
  allowModifiers?: boolean;
};

export function useKeybinding(
  key: string,
  handler: (e: KeyboardEvent) => void,
  { skipInTypingContext = true, allowModifiers = false }: Options = {},
) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== key) return;
      if (!allowModifiers && (e.metaKey || e.ctrlKey || e.altKey)) return;
      if (skipInTypingContext && isTypingContext(e.target)) return;
      handler(e);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, handler, skipInTypingContext, allowModifiers]);
}
