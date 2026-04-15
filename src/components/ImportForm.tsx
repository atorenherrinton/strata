"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { importAction } from "@/app/actions";
import type { FormState } from "@/lib/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Importing…" : "Import"}
    </button>
  );
}

export function ImportForm() {
  const [state, action] = useActionState<FormState, FormData>(importAction, null);

  return (
    <form action={action} aria-labelledby="import-heading">
      <h2 id="import-heading">Upload</h2>
      {state?.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="form-row">
        <label htmlFor="import-file">JSON file</label>
        <input
          id="import-file"
          name="file"
          type="file"
          accept="application/json,.json"
          required
        />
        <span className="hint">
          Max 10 MB. Body, tag, and title rules are enforced on every record.
        </span>
      </div>
      <SubmitButton />
    </form>
  );
}
