Title: Hotfix frontend/backward-compat for seed route not deployed in backend
Milestone: C0 - Final Hardening
Labels: frontend,backend,deploy,qa,docs

## GitFlow Branch
- feature/C0-12-seed-route-compat-hotfix

## Goal
Prevent misleading generic errors when frontend includes `Popular <N>` but production backend still does not expose `POST /users/seed`.

## Functional Requirements
- Improve frontend error parsing to read both `error.message` and top-level `message` from backend.
- Add explicit user-facing message for seed route absence (`Route POST:/users/seed not found`).
- Keep existing execute/clear flow unchanged.
- Document diagnosis and hotfix in deploy evidence.

## Acceptance Criteria
- Clicking `Popular <N>` against backend without `/users/seed` shows a clear compatibility message.
- Generic message `Falha de comunicacao com backend` is reduced for parseable backend errors.
- Tests and quality checks are green.

## Deliverables / Evidence
- `packages/frontend/web/src/App.tsx`
- `packages/frontend/web/tests/app.jest.test.js`
- `docs/evidence/M4-deploy.md`
