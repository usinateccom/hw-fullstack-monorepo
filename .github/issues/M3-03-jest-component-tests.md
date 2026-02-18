Title: Add Jest tests for UI state transitions (execute/clear)
Milestone: M3 - Frontend UX + Integration
Labels: frontend,testing

## GitFlow Branch
- feature/M3-03-jest-tests

## Goal
Add basic UI tests to validate dynamic behavior without real backend calls.

## Functional Requirements
- Mock API client
- Test:
  - execute populates table
  - clear empties table
  - loading disables buttons

## Non-Functional Requirements
- Tests deterministic and fast

## Acceptance Criteria
- `bun run test` passes from root

## Deliverables / Evidence
- `docs/evidence/M3-ui.md` includes test output
