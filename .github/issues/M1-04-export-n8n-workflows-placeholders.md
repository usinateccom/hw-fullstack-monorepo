Title: Add exported n8n workflow JSONs (ingest/list/clear) + import instructions
Milestone: M1 - Local Infra + n8n/Postgres
Labels: workflows,docs

## GitFlow Branch
- feature/M1-04-n8n-workflows

## Goal
Provide reproducible n8n workflows: ingest users, list users, clear users (TRUNCATE).

## Functional Requirements
- Add workflow JSON exports under:
  - `packages/tooling/workflows/exported/ingest-users.json`
  - `packages/tooling/workflows/exported/list-users.json`
  - `packages/tooling/workflows/exported/clear-users.json`
- Document how to import them in `docs/workflows.md`.
- Ensure clear workflow performs a TRUNCATE on `users`.

## Non-Functional Requirements
- Workflows must be readable and minimal.
- No secrets committed.

## Acceptance Criteria
- A user can import workflows into n8n UI and execute them.
- Postgres nodes are configurable via n8n credentials.

## Deliverables / Evidence
- `docs/evidence/M1-n8n.md` with:
  - n8n version
  - imported workflows list (screenshots placeholders)
  - webhook URLs documented
