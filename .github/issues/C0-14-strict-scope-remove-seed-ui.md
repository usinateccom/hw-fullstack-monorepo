Title: Enforce original test scope by removing seed/populate flow from UI, API docs and smoke references
Milestone: C0 - Final Hardening
Labels: frontend,backend,docs,qa

## GitFlow Branch
- feature/C0-14-strict-scope-remove-seed-ui

## Goal
Match delivery strictly to the original challenge scope: only `Executar` and `Limpar` flows.

## Functional Requirements
- Remove `Popular <N>` UI flow from frontend.
- Remove `/users/seed` route usage from frontend.
- Remove backend `/users/seed` route wiring and seed use case references.
- Keep mandatory flows:
  - `POST /users/execute`
  - `POST /users/clear`
- Update docs and evidence that mention seed/populate flow.

## Non-Functional Requirements
- Keep test suite green.
- Keep error envelope and dynamic table behavior.
- No secrets in repo.

## Acceptance Criteria
- UI has only two buttons: `Executar` and `Limpar`.
- Backend route map no longer exposes `/users/seed`.
- Documentation reflects strict original scope.
- `bun run test`, `bun run lint`, `bun run typecheck` pass.

## Deliverables / Evidence
- `packages/frontend/web/src/App.tsx`
- `packages/frontend/web/tests/app.jest.test.js`
- `packages/backend/api/src/presentation/routes/users-routes.ts`
- docs updates in `docs/api.md`, `docs/deploy.md`, `docs/workflows.md`, `docs/evidence/*`
