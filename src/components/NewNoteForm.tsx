"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createNoteAction } from "@/app/actions";
import type { FormState } from "@/lib/actions";
import { BODY_MAX, TAGS_MAX_COUNT } from "@/lib/validate";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Adding…" : "Add note"}
    </button>
  );
}

export function NewNoteForm({ topicId }: { topicId: string }) {
  const bound = createNoteAction.bind(null, topicId);
  const [state, action] = useActionState<FormState, FormData>(bound, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} aria-labelledby="new-note-heading">
      <h2 id="new-note-heading">New note</h2>
      {state?.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="form-row">
        <label htmlFor="note-body">Body</label>
        <textarea
          id="note-body"
          name="body"
          maxLength={BODY_MAX}
          placeholder="What did you observe today?"
          required
        />
        <span className="hint">
          Up to {BODY_MAX.toLocaleString()} characters. Supports{" "}
          <code>**bold**</code>, <code>*italic*</code>,{" "}
          <code>`code`</code>, fenced <code>```blocks```</code>, and{" "}
          <code>[links](https://…)</code>.
        </span>
      </div>
      <div className="form-row">
        <label htmlFor="note-tags">Tags</label>
        <input
          id="note-tags"
          name="tags"
          type="text"
          placeholder="comma, separated, lowercase"
          autoComplete="off"
        />
        <span className="hint">
          Letters, digits, dash, underscore — up to {TAGS_MAX_COUNT} tags.
        </span>
      </div>
      <SubmitButton />
    </form>
  );
}
