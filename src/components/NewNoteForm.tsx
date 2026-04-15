import { createNote } from "@/app/actions";

export function NewNoteForm({ topicId }: { topicId: string }) {
  const action = createNote.bind(null, topicId);
  return (
    <form action={action}>
      <textarea name="body" placeholder="Note body" required />
      <input name="tags" placeholder="tags, comma, separated" />
      <button type="submit">Add note</button>
    </form>
  );
}
