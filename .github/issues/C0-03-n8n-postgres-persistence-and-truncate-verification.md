Title: Verify n8n workflow persistence and TRUNCATE behavior in PostgreSQL with live evidence
Milestone: M6 - Delivery Audit & Signoff
Labels: workflows,infra,qa

## GitFlow Branch
- feature/C0-03-n8n-postgres-verify

## Goal
Confirm the full data path from backend to n8n to PostgreSQL, including clear flow with TRUNCATE.

## Functional Requirements
- Execute live flow:
  - run execute pipeline and confirm inserted/updated records
  - run clear pipeline and confirm table reset
- Validate DB state with SQL queries before/after.
- Confirm `users` schema matches spec exactly.

## Non-Functional Requirements
- Evidence must be reproducible with copy/paste commands.
- Avoid manual-only claims without command output.

## Acceptance Criteria
- `execute` results in persisted rows in `users`.
- `clear` results in `count(*) = 0`.
- Schema still matches required definition.

## Deliverables / Evidence
- Update `docs/evidence/M1-db.md` and `docs/evidence/M1-n8n.md` with:
  - commands used
  - SQL outputs
  - webhook route confirmation

