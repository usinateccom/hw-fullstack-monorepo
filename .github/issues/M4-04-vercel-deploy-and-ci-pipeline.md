Title: Add Vercel deployment + CI pipeline (quality gate + smoke checks)
Milestone: M4 - Deploy + Evidence Pack
Labels: deploy,frontend,backend,ci,docs

## GitFlow Branch
- feature/M4-04-vercel-ci-pipeline

## Goal
Finalize cloud readiness by deploying frontend to Vercel and enforcing CI checks on every PR.

## Functional Requirements
- Add CI workflow in `.github/workflows/ci.yml` to run on push/PR:
  - `bun install`
  - `bun run test`
  - `bun run lint`
  - `bun run typecheck`
  - optional frontend e2e step (`bun run test:e2e`) with a clear flag to disable if runner constraints exist.
- Add a frontend deploy workflow for Vercel (or document Vercel Git integration path):
  - production deploy from `main`
  - preview deploy for PRs
- Document required Vercel environment variables and where to configure them:
  - `VITE_API_BASE_URL`
- Document backend CORS requirement for deployed frontend domain.

## Non-Functional Requirements
- No secrets committed.
- CI runtime should stay reasonably fast and deterministic.
- Keep Bun-first commands only.

## Acceptance Criteria
- Every PR shows CI status with test/lint/typecheck passing.
- Frontend has public Vercel URL connected to backend URL.
- README includes live URLs and quick verification steps.
- `docs/evidence/M4-deploy.md` updated with:
  - Vercel project name
  - deployed URLs (preview + production)
  - CI run links/screenshots placeholders

## Deliverables / Evidence
- `.github/workflows/ci.yml`
- `.github/workflows/vercel-deploy.yml` (or documented Git integration alternative)
- `docs/deploy.md` and `README.md` updated
- `docs/evidence/M4-deploy.md` updated with proof
