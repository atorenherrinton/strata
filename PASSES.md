# Pass Log

A running record of what each pass did, what it chose, and what it deferred.

## Pass 1 — Silhouette (2026-04-15)

- Created repo skeleton: `README.md`, `PASSES.md`, `feedback.md`, `.gitignore`.
- Established the layered-generation premise.
- App concept: **undetermined**. Pass 2 will choose.
- Deferred: everything.

---

## Pass 2 — Blocking (2026-04-15)

- **App concept chosen and locked: Stratum** — a web app for time-layered notes. Each topic accumulates notes over time, rendered as stacked strata by date. A "core sample" view filters by tag to produce a cross-section across topics. The concept mirrors the repo's own layered-generation premise.
- **Stack:** Next.js 15 (App Router) + TypeScript + Prisma + SQLite.
- **Data model** (`prisma/schema.prisma`): `Topic`, `Note`, `Tag` with a many-to-many between notes and tags.
- **Routes stubbed:**
  - `/` — home, topic list.
  - `/topics/[id]` — strata column for one topic.
  - `GET/POST /api/topics` — list + create topics.
  - `GET/POST /api/topics/[id]/notes` — list + create notes on a topic.
  - `GET /api/core` — tag-filtered cross-section.
- **Components stubbed:** `TopicList`, `StrataColumn`, `NoteCard`.
- **Entry points:** `src/app/layout.tsx`, `src/app/page.tsx`.
- All handlers return empty payloads or `501`; all components render empty shells. No logic yet — that's Pass 3.
- Deferred: DB client wiring, happy-path CRUD, date bucketing, core-sample query, styling, error handling, tests.

---

## Pass 3 — Rough (2026-04-15)

End-to-end happy path. Every screen works when you do the obvious thing.

- **DB client wired** (`src/lib/db.ts`): real Prisma singleton with dev-mode hot-reload guard.
- **Server actions** (`src/app/actions.ts`): `createTopic`, `createNote` (with tag connect-or-create).
- **Pages now fetch real data:**
  - `/` — lists topics from DB, has a "new topic" form that creates one and redirects into it.
  - `/topics/[id]` — loads topic + its notes (with tags), groups them into strata by ISO date via `bucketByDate`, renders the column, shows a new-note form.
  - `/core` — new page. Lists all tags in a dropdown; submitting filters notes across all topics by that tag and renders them as a strata column prefixed with topic title.
- **API routes now functional:** `GET/POST /api/topics`, `GET/POST /api/topics/[id]/notes`, `GET /api/core?tag=…` — all hit the DB for real.
- **Components:** `StrataColumn`, `NoteCard` render real data including tags; added `NewNoteForm` (binds topicId to the `createNote` action). `TopicList` kept but superseded by the home page's inline list.
- **Helpers** (`src/lib/strata.ts`): `bucketByDate` (groups notes by ISO date, newest first) and `parseTags` (splits comma list, lowercases, trims).
- **.gitignore:** added `.next/`, `*.db`, `*.db-journal`.
- Not run locally yet — no `npm install` or `prisma db push` in this pass. First-run setup is: `npm install && npx prisma db push && npm run dev`.
- Deferred to Pass 4: input validation, empty-state copy, error handling, loading states, 404s, edit/delete, styling, accessibility.

---

## Pass 4 — Detail (2026-04-15)

Edge cases, validation, error handling, styling, and full CRUD across the whole repo.

- **Validation** (`src/lib/validate.ts`): `validateTitle`, `validateBody`, `validateTagsInput` with typed `Valid<T>` result. Shared limits: title ≤120, body ≤4000, tags ≤12 per note, tag name `^[a-z0-9][a-z0-9\-_]*$`, dedup and case-fold. Wired into every server action and API route. The old `parseTags` in `lib/strata.ts` is gone.
- **Server actions rewritten** (`src/app/actions.ts`): now `createTopicAction`, `updateTopicAction`, `deleteTopicAction`, `createNoteAction`, `updateNoteAction`, `deleteNoteAction`. Create actions use `useActionState`-compatible `FormState` with inline error return. Update/delete actions redirect and carry an `?err=` param on validation failure.
- **Edit + delete UI:**
  - `TopicHeader` — rename topic inline, delete topic with `confirm()` prompt (cascades to notes).
  - `NoteCard` — edit/delete per note, inline edit form, delete confirm.
  - `ConfirmButton` — small client wrapper for `window.confirm` guarded submits.
- **Forms** (`NewTopicForm`, `NewNoteForm`): client components using `useActionState` + `useFormStatus` for pending/error states. Proper `<label>` pairs, `maxLength`, `autoComplete`, hints, `aria-labelledby`/`role="alert"`. Note form auto-resets on success.
- **Empty states + 404s:**
  - Home: "No topics yet" empty block.
  - Topic page: calls `notFound()`; segment-level `not-found.tsx` renders "Topic not found".
  - Core page: separate empty copy for "no tags yet" vs. "no notes tagged #x".
  - Root `not-found.tsx` for stray URLs.
- **Error + loading boundaries:** `src/app/error.tsx` (global client boundary), `src/app/loading.tsx`, plus per-segment `loading.tsx` for `/topics/[id]` and `/core` with themed copy ("Excavating…", "Drilling…", "Coring…").
- **Styling** (`src/app/globals.css`): geological palette (earth tones, dark-mode aware), serif body with sans UI, stratified background bands cycling across six tones, pill tags, sticky site header. All components use semantic classes — no inline style except a couple of one-offs.
- **Layout:** `SiteHeader` with brand + primary nav (Topics / Core sample) in `layout.tsx`; updated `metadata` description.
- **API hardening:**
  - `POST /api/topics` validates title, returns 400 on bad JSON / invalid.
  - `GET/POST /api/topics/[id]/notes` returns 404 if topic missing; POST validates body + tags (accepts tags as array or CSV).
  - `GET /api/core` requires `?tag=`, returns 400 otherwise; includes `count` in response.
- **Accessibility:** labels on every input, `aria-label` on icon-less buttons, `role="alert"` on form errors, `<time dateTime>` on all dates, `role="list"`/`listitem` on strata column, visible focus rings, `prefers-color-scheme: dark` respected.
- **Removed:** `src/components/TopicList.tsx` (superseded in Pass 3, confirmed dead).
- **Still deferred to Pass 5 (Finish):** tests, CI, deploy config, docs beyond README, keyboard shortcuts, pagination for long note histories.

---

## Pass 5 — Finish (2026-04-15)

Tests, CI, tooling, deploy config.

- **Unit tests (Vitest):**
  - `src/lib/validate.test.ts` — full coverage of `validateTitle`, `validateBody`, `validateTagsInput` (trim, dedup, char-rule, length caps, count cap, edge cases).
  - `src/lib/strata.test.ts` — `bucketByDate` grouping, newest-first ordering, within-date order preservation, empty input.
  - `vitest.config.ts` wires the `@/*` alias and scopes test discovery to `src/**/*.test.{ts,tsx}`.
- **Lint (ESLint 9, flat config):** `eslint.config.mjs` extends `next/core-web-vitals` + `next/typescript` via `FlatCompat`. Unused-arg underscore convention allowed.
- **Typecheck:** `npm run typecheck` runs `tsc --noEmit` against the existing strict config.
- **Formatting:** `.prettierrc.json` with 88-col, double-quote, trailing-comma-all; `npm run format` applies it.
- **CI:** `.github/workflows/ci.yml` runs on push to `main` and all PRs. Steps: checkout → Node 20 → `npm ci` → `prisma generate` → typecheck → lint → vitest (`--run`) → `prisma db push` → `next build`. Uses a SQLite `DATABASE_URL` for the build.
- **Prisma config:** schema now reads `DATABASE_URL` from env (was hard-coded). `.env.example` committed with the SQLite default.
- **Deploy:** `vercel.json` sets `buildCommand` to `prisma generate && prisma migrate deploy && next build`. README has a deploy section that calls out the SQLite → Postgres/Turso swap required for serverless.
- **package.json:** bumped to 0.5.0. New scripts: `lint`, `typecheck`, `test`, `test:ci`, `format`, `db:studio`, `postinstall` (for prisma client on install). Added dev deps: `vitest`, `eslint` + `eslint-config-next` + `@eslint/eslintrc`, `prettier`.
- **README rewritten** for Pass 5: app description, run/develop/deploy sections, full script table.
- Nothing deferred at this fidelity. Pass 6 (feature expansion) would add: search, pagination, export, keyboard shortcuts, richer tag management.

