# Supabase references audit

This file lists remaining textual occurrences of "Supabase" or related identifiers found in the repository and gives quick guidance on whether to update or keep them.

Summary (automatically compiled during the migration effort):

- Where to keep the text as-is (reason: infra/artifact or SQL object names):
  - docker/volumes/db/*.sql (e.g. `_supabase.sql`, `webhooks.sql`, roles.sql) — these define DB roles/schemas that are named with the `supabase_` prefix; do NOT rename unless you migrate DB objects (high risk).
  - docker/volumes/functions/* and other functions that call Supabase REST endpoints — these are legacy function implementations and should be kept for reference or removed if you stop using the Supabase stack.
  - frontend/dist/* (build artifacts) — generated bundle still contains the old supabase client code if you previously built with supabase installed. These files are build outputs and can be ignored or regenerated.

- Where to update (recommended):
  - Documentation (README.md, QUICKSTART.md, MIGRATION_README.md, MIGRATION_PLAN.md, docs/*.md, newProposal/*) — change wording to mark Supabase as "legacy" or "self-hosted" and update container names (e.g. `supabase-db` -> `olimpo-db`) where the repo uses a different DB container.
  - `.env` files in `frontend/` — comment or remove VITE_SUPABASE_* keys if the app no longer depends on them.
  - docker/README.md — mark as legacy (done).

Notes and next steps (recommended):

1. Search the repo for `supabase` (case-insensitive) before any large rename. Some matches are intentional in SQL and container roles and should remain unchanged.

2. If you want to remove *all* traces of the word `supabase` from the repo (including SQL objects and Docker roles), plan a DB migration that renames schemas/roles and update any code that references them. This is a multi-step migration: backup DB → create new schema/roles → copy data → update app config → test → drop old schema.

3. If the goal is purely cosmetic (remove mentions from docs and non-critical files), continue by editing the remaining .md files under `docs/` and `newProposal/`. This file acts as the canonical list of retained/changed occurrences.

If you want, I can now:
- apply the remaining doc edits (marking Supabase as legacy) across the repository, or
- produce a safe automated patch that comments out or removes the remaining frontend env variables and non-code mentions.

Tell me which of the two you'd prefer and I'll proceed.
