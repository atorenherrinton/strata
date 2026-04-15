"use client";

import { useState } from "react";
import type { Note } from "@/lib/types";
import { deleteNoteAction, updateNoteAction } from "@/app/actions";
import { ConfirmButton } from "./ConfirmButton";
import { BODY_MAX } from "@/lib/validate";
import { formatTime } from "@/lib/format";
import { renderNoteMarkdown } from "@/lib/markdown";

export function NoteCard({
  note,
  topicPrefix,
  editable = true,
}: {
  note: Note;
  topicPrefix?: string;
  editable?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const update = updateNoteAction.bind(null, note.id, note.topicId);
  const remove = deleteNoteAction.bind(null, note.id, note.topicId);

  if (editing) {
    return (
      <article className="note-card" aria-label="Edit note">
        <form action={update} className="note-edit-area">
          <label htmlFor={`note-${note.id}-body`} className="visually-hidden">
            Note body
          </label>
          <textarea
            id={`note-${note.id}-body`}
            name="body"
            defaultValue={note.body}
            maxLength={BODY_MAX}
            required
          />
          <label htmlFor={`note-${note.id}-tags`} className="visually-hidden">
            Tags
          </label>
          <input
            id={`note-${note.id}-tags`}
            name="tags"
            defaultValue={note.tags.join(", ")}
            placeholder="comma, separated"
            autoComplete="off"
          />
          <div className="actions">
            <button type="submit">Save</button>
            <button
              type="button"
              className="secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    );
  }

  const rendered = renderNoteMarkdown(note.body);
  return (
    <article className="note-card">
      {topicPrefix ? (
        <p className="note-topic-line">
          <span className="note-topic-prefix">{topicPrefix}</span>
        </p>
      ) : null}
      <div
        className="note-body"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
      <div className="note-meta">
        <div className="tags" aria-label={note.tags.length ? "Tags" : undefined}>
          {note.tags.map((t) => (
            <span className="tag" key={t}>
              #{t}
            </span>
          ))}
        </div>
        <div className="actions">
          <time dateTime={new Date(note.createdAt).toISOString()}>
            {formatTime(note.createdAt)}
          </time>
          {editable ? (
            <>
              <button
                type="button"
                className="secondary"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <form action={remove} className="inline-form">
                <ConfirmButton
                  message="Delete this note?"
                  className="danger"
                  ariaLabel="Delete note"
                >
                  Delete
                </ConfirmButton>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
