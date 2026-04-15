"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createTopicAction, type FormState } from "@/app/actions";
import { TITLE_MAX } from "@/lib/validate";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creating…" : "Create topic"}
    </button>
  );
}

export function NewTopicForm() {
  const [state, action] = useActionState<FormState, FormData>(createTopicAction, null);

  return (
    <form action={action} aria-labelledby="new-topic-heading">
      <h2 id="new-topic-heading">New topic</h2>
      {state?.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="form-row">
        <label htmlFor="topic-title">Title</label>
        <input
          id="topic-title"
          name="title"
          type="text"
          maxLength={TITLE_MAX}
          placeholder="e.g. Cretaceous field notes"
          required
          autoComplete="off"
        />
        <span className="hint">Up to {TITLE_MAX} characters.</span>
      </div>
      <SubmitButton />
    </form>
  );
}
