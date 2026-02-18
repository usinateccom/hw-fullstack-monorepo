Title: Initialize Bun + Lerna monorepo structure (agentic-ready)
Milestone: M0 - Bootstrap & Standards
Labels: epic,chore,docs

## Goal
Create a clean Bun monorepo (Lerna) that separates backend, frontend and shared packages, plus agentic instruction folders.

## Functional Requirements
- Create the repository tree:
  - `packages/backend/api`
  - `packages/frontend/web`
  - `packages/shared/contracts`
  - `packages/tooling/rag`
  - `packages/tooling/workflows`
  - `docs/`, `docs/evidence/`
  - `instructions/`, `.codex/`, `.gemini/`, `AGENTS.md`
  - `.github/issues/`, PR template
- Add root scripts:
  - `dev`, `test`, `lint`, `typecheck`, `rag:index`, `rag:search`, `gh:bootstrap`

## Non-Functional Requirements
- Bun-first tooling
- No secrets committed
- Docker is optional only (do not require it)

## Acceptance Criteria
- `bun install` works at root
- `bun run test` runs all packages (may be empty test placeholders)
- Repo contains `README.md` and `PROJECT-SETUP.md` (initial content)

## Deliverables / Evidence
- `docs/evidence/M0-setup.md` with:
  - `bun -v`, `bun install`, `bun run test` outputs
  - tree snapshot or summary

## Repo Areas
- Root `package.json`, `lerna.json`, `tsconfig.base.json`
- `packages/*`, `docs/*`, `instructions/*`, `.codex/*`, `.gemini/*`
