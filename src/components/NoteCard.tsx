import type { Note } from "@/lib/types";

export function NoteCard({ note }: { note: Note }) {
  return (
    <article>
      <p>{note.body}</p>
      {note.tags.length > 0 ? (
        <p>
          {note.tags.map((t) => (
            <span key={t}>#{t} </span>
          ))}
        </p>
      ) : null}
    </article>
  );
}
