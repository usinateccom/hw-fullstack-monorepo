Title: Deploy backend to cloud platform (Railway/Render/Fly/Heroku) and document steps
Milestone: M4 - Deploy + Evidence Pack
Labels: deploy,backend,docs

## GitFlow Branch
- feature/M4-01-deploy-backend

## Goal
Deploy backend publicly and document how to reproduce.

## Functional Requirements
- Choose a cloud platform and deploy backend.
- Configure env vars securely on the platform.
- Add CORS config so frontend can call backend.

## Non-Functional Requirements
- No secrets in repo
- Stable URL

## Acceptance Criteria
- Backend URL online, `/health` returns 200.

## Deliverables / Evidence
- `docs/evidence/M4-deploy.md` includes:
  - platform used
  - deployed URL
  - env var list (names only)
  - curl output for `/health`
