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
| 3    | Rough      | Happy-path functionality, end-to-end. No error handling, no polish.      |
| 4    | Detail     | Edge cases, error handling, validation, styling.                         |
| 5    | Finish     | Tests, docs, CI, deploy config.                                          |

Later passes may be added (Pass 6: feature expansion, Pass 7: refactor, etc.) but each still touches the whole repo at one fidelity.

## Current pass

**Pass 2 — Blocking.** App concept locked: **Stratum**, a web app for time-layered notes. Topics accumulate notes over time and render as stacked strata by date; a "core sample" view filters by tag to cut a cross-section across topics. Stack: Next.js 15 (App Router) + TypeScript + Prisma + SQLite. All routes, components, and models exist as stubs — no logic yet. Pass 3 (Rough) will wire up happy-path CRUD end-to-end.

## Rules for the AI

1. Never skip passes. Each pass must leave the whole repo at a consistent fidelity.
2. Commit at the end of every pass with a `pass/N-name` tag.
3. No TODOs left behind in a pass — anything unfinished at the current fidelity is a bug.
4. The app concept, once chosen in Pass 2, is locked. Refinement only.

## Rules for the human

Don't edit the code. Feedback goes in `feedback.md` and the AI addresses it in the next pass.
