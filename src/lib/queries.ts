import { db } from "./db";
import type { Note } from "./types";

// ---- Row shapes returned by Prisma with our standard includes ----

type NoteRow = {
  id: string;
  topicId: string;
  body: string;
  createdAt: Date;
  tags: { name: string }[];
};

type NoteRowWithTopic = NoteRow & {
  topic: { title: string };
};

// ---- Mappers: Prisma rows → plain Note objects used by the UI ----

export function toNote(n: NoteRow): Note {
  return {
    id: n.id,
    topicId: n.topicId,
    body: n.body,
    createdAt: n.createdAt,
    tags: n.tags.map((t) => t.name),
  };
}

export function toNoteWithTopic(n: NoteRowWithTopic): Note {
  return { ...toNote(n), topicTitle: n.topic.title };
}

// ---- Reusable queries. Every page that needs notes comes through here. ----

export function getTopicWithNotes(id: string) {
  return db.topic.findUnique({
    where: { id },
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
        include: { tags: true },
      },
    },
  });
}

export async function getTopicsWithNoteCounts() {
  return db.topic.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { notes: true } } },
  });
}

export async function getAllNotesWithTopic(): Promise<Note[]> {
  const rows = await db.note.findMany({
    orderBy: { createdAt: "desc" },
    include: { tags: true, topic: true },
  });
  return rows.map(toNoteWithTopic);
}

export async function getNotesByTag(tag: string): Promise<Note[]> {
  const rows = await db.note.findMany({
    where: { tags: { some: { name: tag } } },
    orderBy: { createdAt: "desc" },
    include: { tags: true, topic: true },
  });
  return rows.map(toNoteWithTopic);
}

export async function getTagsWithCounts() {
  return db.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { notes: true } } },
  });
}
