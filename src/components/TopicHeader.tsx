"use client";

import { useState } from "react";
import { deleteTopicAction, updateTopicAction } from "@/app/actions";
import { ConfirmButton } from "./ConfirmButton";
import { TITLE_MAX } from "@/lib/validate";
import { countLabel } from "@/lib/format";

export function TopicHeader({
  topicId,
  title,
  noteCount,
}: {
  topicId: string;
  title: string;
  noteCount: number;
}) {
  const [editing, setEditing] = useState(false);
  const update = updateTopicAction.bind(null, topicId);
  const remove = deleteTopicAction.bind(null, topicId);

  if (editing) {
    return (
      <form action={update} className="topic-title-edit">
        <label htmlFor="topic-title-edit" className="visually-hidden">
          Topic title
        </label>
        <input
          id="topic-title-edit"
          name="title"
          defaultValue={title}
          maxLength={TITLE_MAX}
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
    );
  }

  return (
    <div>
      <h1 className="topic-title-line">
        <span>{title}</span>
      </h1>
      <div className="actions topic-actions-row">
        <span className="muted-faint">{countLabel(noteCount, "note")}</span>
        <button
          type="button"
          className="secondary"
          onClick={() => setEditing(true)}
        >
          Rename
        </button>
        <a
          className="back-link"
          href={`/api/topics/${topicId}/export?format=md`}
          download
        >
          Export .md
        </a>
        <a
          className="back-link"
          href={`/api/topics/${topicId}/export?format=json`}
          download
        >
          Export .json
        </a>
        <a
          className="back-link"
          href={`/topics/${topicId}/feed.xml`}
          target="_blank"
          rel="noopener"
        >
          RSS
        </a>
        <form action={remove} className="inline-form">
          <ConfirmButton
            message={`Delete "${title}" and all its notes? This cannot be undone.`}
            className="danger"
          >
            Delete topic
          </ConfirmButton>
        </form>
      </div>
    </div>
  );
}
