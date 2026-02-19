Title: Run final security hygiene audit (secrets, env handling, dependency/runtime checks)
Milestone: M6 - Delivery Audit & Signoff
Labels: security,qa,chore

## GitFlow Branch
- feature/C0-07-security-hygiene

## Goal
Ensure no accidental secret exposure and validate secure defaults before final submission.

## Functional Requirements
- Verify no secrets are committed in repository files/history scope being delivered.
- Confirm `.env.example` exposes names only (no private values).
- Confirm docs do not leak credentials or tokens.
- Record dependency/runtime versions used in final validation.

## Non-Functional Requirements
- Keep report concise and actionable.
- If a finding exists, include fix and retest note.

## Acceptance Criteria
- Secret scan result documented.
- No real tokens/passwords embedded in tracked files.
- Final audit file states pass/fail with rationale.

## Deliverables / Evidence
- `docs/evidence/C0-security.md`

