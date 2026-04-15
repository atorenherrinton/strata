# strata

An AI-controlled repository. Humans do not write the code here; an AI agent does, and it builds the app the way a diffusion model builds an image: in **layers**, whole-to-whole, low-fidelity to high-fidelity.

## The layered-generation premise

Conventional software grows feature-by-feature: one slice goes from 0% to 100% while the rest of the app stays at 0%. This repo inverts that. Every pass touches the *whole* codebase at a given fidelity before any part is refined further.

Each pass is a commit (or a short series of commits) tagged `pass/N-name`. You can check out any pass to see the app at that fidelity.

### The passes

| Pass | Name       | Fidelity                                                                 |
|------|------------|--------------------------------------------------------------------------|
| 1    | Silhouette | Folders, stub files, this README. No app concept committed yet.          |
| 2    | Blocking   | App concept chosen. Data models, routes, entry points — all stubs.       |
| 3    | Rough      | Happy-path functionality, end-to-end. No error handling, no polish.     |
| 4    | Detail     | Edge cases, error handling, validation, styling.                         |
| 5    | Finish     | Tests, docs, CI, deploy config.                                          |
| 6    | Expansion  | New capabilities: search, tag management, export, keyboard shortcuts.    |
| 7    | Refactor   | Consolidate duplication. No behavior change.                             |
| 8    | Scale-out  | Pagination, JSON import, per-topic RSS, sitemap + robots.                |

Later passes may be added (Pass 9: multi-user/auth, Pass 10: real FTS, etc.) but each still touches the whole repo at one fidelity.

## The app: Stratum

**Stratum** is a time-layered note-taking app. Each topic is a column you stack notes onto; notes are grouped into *strata* by date. A *core sample* view filters notes across every topic by a single tag, giving you a cross-section of thought over time.

The app concept mirrors the repo's own layered-generation premise.

Stack: Next.js 15 (App Router) · TypeScript · Prisma · SQLite (local) / Postgres-ready (prod).

## Current pass

**Pass 8 — Scale-out.** Pagination for topic + search pages (50 notes per page, Prisma `skip/take` when unfiltered, in-memory otherwise). JSON import at `/import` round-trips the Pass 6 export format, with the same validation rules applied to every record and a 10 MB file cap. Per-topic RSS feeds live at `/topics/[id]/feed.xml`. Dynamic `sitemap.xml` and `robots.txt` ship out of the box; both honour `NEXT_PUBLIC_SITE_URL`. Suite now 59 tests across 9 files.

**Pass 7 — Refactor.** No new features. The query and mapping layer is consolidated in `src/lib/queries.ts`, date + count formatting lives in `src/lib/format.ts`, a shared `useKeybinding` hook backs the <kbd>/</kbd> and <kbd>n</kbd> shortcuts, and inline styles moved to utility classes. The refactor surfaced and fixed one real bug: `matchesAll` wasn't lowercasing caller-supplied search terms, so API-layer queries with uppercase input silently missed. Full vitest suite (42 tests) stays green.

**Pass 6 — Expansion.** On top of the Finish-fidelity base the app now has: global + per-topic search (AND-of-terms across body, tags, and topic titles), a dedicated tags page with rename/merge/delete, JSON + Markdown export (per topic and full backup), and keyboard shortcuts (<kbd>/</kbd> focuses the header search, <kbd>n</kbd> jumps to the new-note field on a topic page). All new features are tested and ship through the same CI + deploy chain established in Pass 5.

### Run it locally

```
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

Then open <http://localhost:3000>.

### Develop

| Command              | Purpose                                               |
|----------------------|-------------------------------------------------------|
| `npm run dev`        | Next.js dev server with HMR                           |
| `npm run test`       | Vitest in watch mode                                  |
| `npm run test:ci`    | Vitest single-run (what CI runs)                      |
| `npm run typecheck`  | `tsc --noEmit`                                        |
| `npm run lint`       | `next lint` (ESLint flat config)                      |
| `npm run format`     | Prettier across the repo                              |
| `npm run db:studio`  | Prisma Studio — inspect the local DB                  |
| `npm run build`      | Production build                                      |

### Deploy (Vercel)

1. Import the repo on Vercel.
2. Set `DATABASE_URL` to a persistent database (Vercel Postgres, Neon, Turso, Supabase, etc.). SQLite's local file won't survive serverless cold-starts.
3. Update `prisma/schema.prisma`'s `provider` to match your chosen database (`postgresql`, `mysql`, …) and commit a migration.
4. Push. `vercel.json` runs `prisma generate && prisma migrate deploy && next build`.

## Rules for the AI

1. Never skip passes. Each pass must leave the whole repo at a consistent fidelity.
2. Commit at the end of every pass with a `pass/N-name` tag.
3. No TODOs left behind in a pass — anything unfinished at the current fidelity is a bug.
4. The app concept, once chosen in Pass 2, is locked. Refinement only.

## Rules for the human

Don't edit the code. Feedback goes in `feedback.md` and the AI addresses it in the next pass.
