Title: Create final scope traceability matrix and identify remaining delivery gaps
Milestone: M6 - Delivery Audit & Signoff
Labels: docs,qa,chore

## GitFlow Branch
- feature/C0-01-scope-traceability

## Goal
Produce a requirement-by-requirement traceability map from test scope to code/docs/evidence and list objective gaps.

## Functional Requirements
- Create `docs/evidence/C0-traceability.md` with a matrix:
  - scope requirement
  - implementation reference (file/path)
  - validation evidence (command/output/link)
  - status: done / partial / missing
- Include explicit section for blocking gaps and owner/action.

## Non-Functional Requirements
- Keep matrix concise and reviewer-friendly.
- No ambiguous language.

## Acceptance Criteria
- Every requirement in the test prompt appears in the matrix.
- Each row has concrete code/doc references.
- Any pending item has a clear next action.

## Deliverables / Evidence
- `docs/evidence/C0-traceability.md`

