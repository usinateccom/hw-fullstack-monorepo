Title: Run n8n locally via Node (no Docker) + import workflows
Milestone: M1 - Local Infra + n8n/Postgres
Labels: workflows,docs

## Functional Requirements
- Document Node installation (NVM recommended) for Linux/WSL
- Document installing and running n8n without Docker
- Provide workflow export placeholders under `packages/tooling/workflows/exported/`
- Document how to import workflows in n8n UI

## Non-Functional Requirements
- Keep instructions short and accurate
- No platform-specific assumptions beyond Linux/WSL

## Acceptance Criteria
- n8n UI reachable locally
- Workflows can be imported

## Deliverables / Evidence
- `docs/evidence/M1-n8n.md` with:
  - `node -v`, `bun -v`, `n8n --version` outputs
  - screenshot placeholders
  - webhook URLs summary

## Repo Areas
- `packages/tooling/workflows/exported/*`, `docs/workflows.md`, `PROJECT-SETUP.md`
