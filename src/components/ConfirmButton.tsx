"use client";

import type { ReactNode } from "react";

export function ConfirmButton({
  message,
  children,
  className,
  ariaLabel,
}: {
  message: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
