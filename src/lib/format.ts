// Shared date/time formatters. Centralised here so every view renders dates the
// same way and locale-tweaks land in one place.

export function formatTime(d: Date | string): string {
  return new Date(d).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatShortDate(d: Date | string): string {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatLongDate(iso: string): string {
  // `iso` is a YYYY-MM-DD stratum key; pin to local midnight so the weekday
  // doesn't slip across a UTC boundary.
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function countLabel(n: number, singular: string, plural = singular + "s"): string {
  return `${n} ${n === 1 ? singular : plural}`;
}
