Title: Add performance smoke report for execute and clear flows with response-time budget
Milestone: M6 - Delivery Audit & Signoff
Labels: backend,frontend,qa,performance

## GitFlow Branch
- feature/C0-06-performance-smoke

## Goal
Provide lightweight performance evidence aligned with evaluation criteria.

## Functional Requirements
- Measure latency for:
  - backend `POST /users/execute`
  - backend `POST /users/clear`
  - frontend click-to-render for execute/clear (manual stopwatch acceptable with method noted)
- Document results and acceptable budget thresholds.

## Non-Functional Requirements
- Keep method simple and reproducible.
- Include environment constraints in interpretation.

## Acceptance Criteria
- Report contains measured numbers and command/method used.
- No unexplained outlier remains undocumented.

## Deliverables / Evidence
- `docs/evidence/C0-performance.md`

