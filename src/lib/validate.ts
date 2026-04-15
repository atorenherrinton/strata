export const TITLE_MAX = 120;
export const BODY_MAX = 4000;
export const TAG_MAX_LEN = 32;
export const TAGS_MAX_COUNT = 12;

export type Valid<T> = { ok: true; value: T } | { ok: false; error: string };

export function validateTitle(raw: unknown): Valid<string> {
  if (typeof raw !== "string") return { ok: false, error: "Title is required." };
  const title = raw.trim();
  if (title.length === 0) return { ok: false, error: "Title can't be empty." };
  if (title.length > TITLE_MAX)
    return { ok: false, error: `Title must be ${TITLE_MAX} characters or fewer.` };
  return { ok: true, value: title };
}

export function validateBody(raw: unknown): Valid<string> {
  if (typeof raw !== "string") return { ok: false, error: "Note body is required." };
  const body = raw.trim();
  if (body.length === 0) return { ok: false, error: "A note can't be empty." };
  if (body.length > BODY_MAX)
    return { ok: false, error: `Note must be ${BODY_MAX} characters or fewer.` };
  return { ok: true, value: body };
}

export function validateTagsInput(raw: unknown): Valid<string[]> {
  const source = typeof raw === "string" ? raw : "";
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of source.split(",")) {
    const tag = part.trim().toLowerCase();
    if (tag.length === 0) continue;
    if (tag.length > TAG_MAX_LEN)
      return { ok: false, error: `Tag "${tag.slice(0, 16)}…" is too long (max ${TAG_MAX_LEN}).` };
    if (!/^[a-z0-9][a-z0-9\-_]*$/.test(tag))
      return {
        ok: false,
        error: `Tag "${tag}" must be letters/digits/dash/underscore, starting alphanumeric.`,
      };
    if (seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  if (out.length > TAGS_MAX_COUNT)
    return { ok: false, error: `Too many tags (max ${TAGS_MAX_COUNT}).` };
  return { ok: true, value: out };
}
