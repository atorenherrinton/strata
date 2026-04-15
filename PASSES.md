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
