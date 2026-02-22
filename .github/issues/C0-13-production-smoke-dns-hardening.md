Title: Add production smoke script with DNS/CORS/webhook diagnostics and final runbook hardening
Milestone: C0 - Final Hardening
Labels: qa,deploy,docs,backend,frontend,workflows

## GitFlow Branch
- feature/C0-13-production-smoke-runbook

## Goal
Provide a deterministic production validation entrypoint that quickly identifies whether failures are in DNS, backend health, n8n webhook registration, or frontend/backend env alignment.

## Functional Requirements
- Add `scripts/prod-smoke.sh` to validate:
  - backend `/health`
  - backend `/users/execute`
  - backend `/users/clear`
  - optional backend `/users/seed`
  - n8n webhooks `ingest/list/clear`
- Script must print actionable diagnosis for:
  - DNS failures
  - `404 webhook not registered`
  - `502 Application failed to respond`
  - missing `/users/seed` route on outdated backend deploys
- Add root script alias `bun run smoke:prod`.
- Update deploy docs with exact copy/paste usage.

## Non-Functional Requirements
- No secrets in repository.
- Script should rely only on env vars.
- Output must be concise and readable.

## Acceptance Criteria
- Running `BACKEND_URL=... N8N_BASE_URL=... bun run smoke:prod` executes full smoke flow.
- Docs clearly explain required variables and expected outcomes.
- Evidence file updated with production validation checklist.

## Deliverables / Evidence
- `scripts/prod-smoke.sh`
- `package.json` (`smoke:prod` script)
- `docs/deploy.md` (new section)
- `docs/evidence/M4-deploy.md` (validation checklist update)
