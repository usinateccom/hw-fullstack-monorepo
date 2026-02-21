Title: Add production seed dataset flow, persist verification, and docs/rag synchronization
Milestone: C0 - Final Hardening
Labels: backend,frontend,docs,qa,rag

## GitFlow Branch
- feature/C0-10-production-seed-dataset-rag-docs-sync

## Goal
Allow controlled insertion of a configurable amount of fictitious users through the existing backend -> n8n -> PostgreSQL production flow, and align docs/RAG with the final runbook.

## Functional Requirements
- Add backend endpoint `POST /users/seed` with payload `{ count: number }`.
- Generate deterministic fictitious users (`nome/email/phone`) and persist using existing n8n ingest/list flow.
- Frontend must provide a quantity field + action button to trigger seed flow and update table dynamically.
- Keep execute/clear behavior unchanged.
- Update API and setup docs with copy/paste commands for production seed validation.
- Reindex RAG after docs updates.

## Non-Functional Requirements
- Bun-first commands only.
- No secrets in repository.
- Keep error envelope consistency.

## Acceptance Criteria
- Calling `POST /users/seed` with `count > 0` returns persisted users payload.
- Frontend can seed `N` records and render them without page reload.
- `bun run test`, `bun run lint`, `bun run typecheck` are green.
- `bun run rag:index` runs and `packages/tooling/rag/rag/index.json` is updated.

## Deliverables / Evidence
- `packages/backend/api/src/**`
- `packages/frontend/web/src/**`
- `docs/api.md`
- `docs/workflows.md`
- `PROJECT-SETUP.md`
- `docs/evidence/C0-final-hardening.md`
- `docs/evidence/M4-deploy.md`
- `docs/evidence/M5-rag.md`
