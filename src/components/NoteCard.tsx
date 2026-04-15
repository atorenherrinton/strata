import type { Note } from "@/lib/types";

export function NoteCard({ note }: { note: Note }) {
  return (
    <article>
      <p>{note.body}</p>
    </article>
  );
}
