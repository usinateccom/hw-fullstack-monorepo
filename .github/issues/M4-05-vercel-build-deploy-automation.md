Title: Configure Vercel deploy with frontend build and GitHub Actions automation
Milestone: M4 - Deploy + Evidence Pack
Labels: deploy,frontend,docs,qa

## GitFlow Branch
- feature/M4-05-vercel-build-deploy-pipeline

## Goal
Enable reproducible Vercel deployment flow with explicit frontend build validation and GitHub Actions automation.

## Functional Requirements
- Add frontend build validation to CI quality workflow.
- Add GitHub Actions workflow for Vercel:
  - preview deploy on PR
  - production deploy on `main`
- Document required Vercel/GitHub secrets and setup sequence.
- Update deploy evidence template with CI and Vercel proof placeholders.

## Non-Functional Requirements
- Bun-first commands only.
- No secrets committed.
- Linux/WSL docs remain reproducible.

## Acceptance Criteria
- CI includes frontend build step.
- Vercel workflow file exists and is gated by required secrets.
- Documentation includes click-by-click setup and smoke checks.

## Deliverables / Evidence
- `.github/workflows/ci.yml`
- `.github/workflows/vercel-deploy.yml`
- `docs/deploy.md`
- `README.md`
- `docs/evidence/M4-deploy.md`
