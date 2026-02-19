Title: Complete cloud deployment signoff and publish final live URLs in README and evidence
Milestone: M6 - Delivery Audit & Signoff
Labels: deploy,qa,docs

## GitFlow Branch
- feature/C0-05-deploy-signoff

## Goal
Close all remaining deployment gaps and provide reviewer-ready public URLs with proof.

## Functional Requirements
- Deploy backend publicly (Railway/Render/Fly/Heroku equivalent).
- Deploy frontend publicly (Vercel/Netlify equivalent) pointing to deployed backend.
- Replace all `PENDING` deployment placeholders in docs.
- Add live curl proofs for backend endpoints.

## Non-Functional Requirements
- No secrets committed.
- URLs must be stable and directly testable.

## Acceptance Criteria
- `README.md` shows working frontend and backend URLs.
- `docs/evidence/M4-deploy.md` contains platform, URLs, env var names, and curl outputs.
- Reviewer can run quickcheck end-to-end from public URLs.

## Deliverables / Evidence
- Updated `README.md`
- Updated `docs/evidence/M4-deploy.md`

