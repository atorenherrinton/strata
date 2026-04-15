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
