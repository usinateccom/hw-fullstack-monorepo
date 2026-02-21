Title: Add unified CD pipeline for backend + n8n + frontend deploy with production smoke checks
Milestone: C0 - Final Hardening
Labels: deploy,ci,backend,frontend,workflows,qa,docs

## GitFlow Branch
- feature/C0-11-unified-cd-three-deploys

## Goal
Provide one production pipeline that triggers all three deploys (Railway backend, Railway n8n, Vercel frontend) and validates runtime health/smoke in sequence.

## Functional Requirements
- Add GitHub Actions workflow to run on `push` to `main` and manual dispatch.
- Trigger Railway backend and n8n deployments via deploy hooks.
- Trigger Vercel production deploy.
- Run post-deploy smoke checks:
  - backend `/health`
  - n8n root URL
  - backend `/users/execute`
  - backend `/users/clear`
- Fail pipeline if any required secret is missing or smoke check fails.

## Non-Functional Requirements
- Keep secrets only in GitHub Actions secrets/vars.
- Keep pipeline deterministic and observable.
- Keep docs copy/paste-friendly.

## Acceptance Criteria
- Main push can trigger deploy for all three services in one workflow.
- Pipeline logs clearly show each stage status.
- Documentation lists required secrets/vars and troubleshooting.

## Deliverables / Evidence
- `.github/workflows/release-deploy.yml`
- `docs/deploy.md`
- `docs/evidence/M4-deploy.md`
- `docs/evidence/C0-final-hardening.md`
- `docs/evidence/M5-rag.md`
