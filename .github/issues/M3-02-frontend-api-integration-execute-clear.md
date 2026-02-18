Title: Integrate frontend with backend API for execute and clear flows
Milestone: M3 - Frontend UX + Integration
Labels: frontend,testing

## GitFlow Branch
- feature/M3-02-frontend-api

## Goal
Wire the UI buttons to backend API endpoints and update table state.

## Functional Requirements
- On "Executar":
  - call backend `POST /users/execute`
  - render returned users in table
- On "Limpar":
  - call backend `POST /users/clear`
  - clear UI table immediately after success
- Add loading and error states.

## Non-Functional Requirements
- Avoid UI flicker; disable button while loading.
- Handle backend error payload consistently.

## Acceptance Criteria
- Clicking "Executar" populates table dynamically.
- Clicking "Limpar" clears table dynamically (no reload).

## Deliverables / Evidence
- `docs/evidence/M3-ui.md` includes a short E2E checklist and outputs
