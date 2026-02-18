# Agentic Workflow

## Rule
One issue = one branch = one PR.

## Steps
1) Pick an issue file from `.github/issues/`
2) Create branch:
   - `git checkout -b feat/<issue-slug>`
3) Implement + tests + docs
4) Update evidence in `docs/evidence/`
5) Validate:
   - `bun run test`
   - `bun run lint`
   - `bun run typecheck`
6) Push and open PR (optional via gh)

## Done when
- Acceptance Criteria satisfied
- Evidence updated
- No secrets committed
