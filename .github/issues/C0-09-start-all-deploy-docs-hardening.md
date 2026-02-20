Title: Harden docs for start:all-only local flow, n8n webhook mapping, and click-by-click deploy with rollback
Milestone: C0 - Final Hardening
Labels: docs,qa,chore

## GitFlow Branch
- feature/C0-09-start-all-deploy-docs-hardening

## Goal
Close final documentation gaps for evaluator reproducibility and deployment safety.

## Functional Requirements
- Update `README.md` with explicit one-time bootstrap dependency for `start:all`.
- Update `PROJECT-SETUP.md` with deterministic one-time setup and daily `start:all` path.
- Update `docs/workflows.md` with production URL mapping and dynamic webhook guidance.
- Update `docs/deploy.md` with ordered go-live sequence, smoke checks, and rollback actions.
- Update evidence for this hardening issue.

## Non-Functional Requirements
- Keep docs concise but copy/paste friendly.
- Keep instructions Linux/WSL friendly.
- No secrets committed.

## Acceptance Criteria
- A reviewer can follow docs and run full local flow with `start:all` for daily operation.
- n8n webhook path troubleshooting is explicit (`404 webhook not registered` case).
- Deploy docs include step order and rollback checklist.

## Deliverables / Evidence
- `README.md`
- `PROJECT-SETUP.md`
- `docs/workflows.md`
- `docs/deploy.md`
- `docs/evidence/C0-final-hardening.md`
