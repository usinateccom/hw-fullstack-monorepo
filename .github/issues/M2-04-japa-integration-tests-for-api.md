Title: Add Japa integration tests for /health, /users/execute, /users/clear
Milestone: M2 - Crypto + Backend Use Cases
Labels: backend,testing

## GitFlow Branch
- feature/M2-04-japa-tests

## Goal
Add test coverage using Japa for the main backend endpoints.

## Functional Requirements
- Add tests:
  - `/health` 200
  - `/users/execute` success path using mocked secure endpoint + mocked n8n webhook
  - `/users/clear` success path with mocked n8n webhook

## Non-Functional Requirements
- Tests must be deterministic (no reliance on real external services)

## Acceptance Criteria
- `bun run test` passes from repo root

## Deliverables / Evidence
- `docs/evidence/M2-crypto.md` includes test output
