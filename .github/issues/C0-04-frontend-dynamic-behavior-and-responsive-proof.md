Title: Validate frontend dynamic table behavior and responsive UX with execution evidence
Milestone: M6 - Delivery Audit & Signoff
Labels: frontend,qa,docs

## GitFlow Branch
- feature/C0-04-frontend-ux-proof

## Goal
Prove that required frontend interactions work dynamically (no reload) and are responsive.

## Functional Requirements
- Validate user flows:
  - click `Executar` and confirm table rows render from backend response
  - click `Limpar` and confirm rows disappear without page reload
- Capture responsive proof for desktop and mobile viewport.
- Confirm buttons and table semantics remain accessible.

## Non-Functional Requirements
- Keep screenshot set minimal and informative.
- Include timestamps and environment used.

## Acceptance Criteria
- Dynamic updates happen without reloading page.
- Visual evidence exists for desktop and mobile states.

## Deliverables / Evidence
- Update `docs/evidence/M3-ui.md` with:
  - E2E checklist marked with actual results
  - screenshot references/placeholders replaced where possible

