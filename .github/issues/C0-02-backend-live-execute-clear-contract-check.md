Title: Validate backend live contract for /health, /users/execute, /users/clear against scope
Milestone: M6 - Delivery Audit & Signoff
Labels: backend,qa,testing

## GitFlow Branch
- feature/C0-02-backend-live-contract

## Goal
Run live contract checks (non-mocked) for required backend routes and capture evidence.

## Functional Requirements
- Validate endpoints:
  - `GET /health`
  - `POST /users/execute`
  - `POST /users/clear`
- Record status codes and payload shape.
- Confirm error envelope format for a controlled failure case.

## Non-Functional Requirements
- Use deterministic commands and include exact outputs.
- Do not expose secrets in evidence.

## Acceptance Criteria
- All three endpoints return expected success responses.
- Error response follows `{ error: { code, message, details? } }`.

## Deliverables / Evidence
- Update `docs/evidence/M2-crypto.md` with:
  - curl commands
  - response payload samples
  - notes for any environment assumptions

