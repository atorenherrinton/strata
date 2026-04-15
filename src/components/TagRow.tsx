"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteTagAction, renameTagAction } from "@/app/actions";
import { ConfirmButton } from "./ConfirmButton";
import { TAG_MAX_LEN } from "@/lib/validate";

export function TagRow({ name, count }: { name: string; count: number }) {
  const [editing, setEditing] = useState(false);
  const rename = renameTagAction.bind(null, name);
  const remove = deleteTagAction.bind(null, name);

  return (
    <li>
      {editing ? (
        <form
          action={rename}
          className="actions"
          style={{ flex: 1, gap: "0.5rem" }}
        >
          <label htmlFor={`rename-${name}`} className="visually-hidden">
            Rename #{name}
          </label>
          <input
            id={`rename-${name}`}
            name="name"
            defaultValue={name}
            maxLength={TAG_MAX_LEN}
            required
            autoFocus
          />
          <button type="submit">Save</button>
          <button
            type="button"
            className="secondary"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <Link href={`/core?tag=${encodeURIComponent(name)}`}>#{name}</Link>
          <span className="topic-meta">
            {count} {count === 1 ? "note" : "notes"}
          </span>
          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() => setEditing(true)}
            >
              Rename
            </button>
            <form action={remove} className="inline-form">
              <ConfirmButton
                message={`Remove #${name} from all notes? The notes themselves stay.`}
                className="danger"
              >
                Delete
              </ConfirmButton>
            </form>
          </div>
        </>
      )}
    </li>
  );
}
