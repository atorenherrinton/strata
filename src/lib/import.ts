import { validateBody, validateTagsInput, validateTitle } from "./validate";

export const SUPPORTED_SCHEMA_VERSIONS = [1] as const;

export type ImportedNote = {
  body: string;
  createdAt: string;
  tags: string[];
};

export type ImportedTopic = {
  title: string;
  createdAt?: string;
  notes: ImportedNote[];
};

export type ImportPayload = {
  schemaVersion: number;
  topics: ImportedTopic[];
};

export type ParseResult =
  | { ok: true; payload: ImportPayload }
  | { ok: false; error: string };

export function parseImportJson(raw: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Not valid JSON." };
  }
  if (!data || typeof data !== "object")
    return { ok: false, error: "Root must be an object." };

  const root = data as Record<string, unknown>;
  const version = Number(root.schemaVersion);
  if (!SUPPORTED_SCHEMA_VERSIONS.includes(version as 1)) {
    return {
      ok: false,
      error: `Unsupported schemaVersion: ${String(root.schemaVersion)}. Supported: ${SUPPORTED_SCHEMA_VERSIONS.join(", ")}.`,
    };
  }
  if (!Array.isArray(root.topics))
    return { ok: false, error: "'topics' must be an array." };

  const topics: ImportedTopic[] = [];
  for (const [i, rawTopic] of root.topics.entries()) {
    if (!rawTopic || typeof rawTopic !== "object")
      return { ok: false, error: `topics[${i}] must be an object.` };
    const t = rawTopic as Record<string, unknown>;

    const title = validateTitle(t.title);
    if (!title.ok) return { ok: false, error: `topics[${i}].title: ${title.error}` };

    if (!Array.isArray(t.notes))
      return { ok: false, error: `topics[${i}].notes must be an array.` };

    const notes: ImportedNote[] = [];
    for (const [j, rawNote] of t.notes.entries()) {
      if (!rawNote || typeof rawNote !== "object")
        return { ok: false, error: `topics[${i}].notes[${j}] must be an object.` };
      const n = rawNote as Record<string, unknown>;

      const body = validateBody(n.body);
      if (!body.ok)
        return { ok: false, error: `topics[${i}].notes[${j}].body: ${body.error}` };

      const tagsSource = Array.isArray(n.tags) ? n.tags.join(",") : "";
      const tags = validateTagsInput(tagsSource);
      if (!tags.ok)
        return { ok: false, error: `topics[${i}].notes[${j}].tags: ${tags.error}` };

      const createdAt =
        typeof n.createdAt === "string" && !Number.isNaN(Date.parse(n.createdAt))
          ? n.createdAt
          : new Date().toISOString();

      notes.push({ body: body.value, tags: tags.value, createdAt });
    }

    topics.push({
      title: title.value,
      createdAt:
        typeof t.createdAt === "string" && !Number.isNaN(Date.parse(t.createdAt))
          ? t.createdAt
          : undefined,
      notes,
    });
  }

  return { ok: true, payload: { schemaVersion: 1, topics } };
}

export type ImportSummary = {
  topics: number;
  notes: number;
  tags: number;
};

export function summarize(payload: ImportPayload): ImportSummary {
  const tagSet = new Set<string>();
  let notes = 0;
  for (const t of payload.topics) {
    notes += t.notes.length;
    for (const n of t.notes) for (const tag of n.tags) tagSet.add(tag);
  }
  return { topics: payload.topics.length, notes, tags: tagSet.size };
}
