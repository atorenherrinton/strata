// Helpers shared across server actions.
// Kept separate from "use server" action files so it can be imported by
// both server and client code (currently server-only, but future-proof).

export type FormState = { error?: string; ok?: boolean } | null;

export function errField(message: string) {
  return { error: message } satisfies NonNullable<FormState>;
}

export function errorQuery(message: string): string {
  return `err=${encodeURIComponent(message)}`;
}
