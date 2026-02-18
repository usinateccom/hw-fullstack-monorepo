# Agentic Workflow

## Rule
One issue = one branch = one PR.

## Steps
1) Pick an issue file from `.github/issues/`
2) Before coding, run docs lookup:
   - `bun run rag:search "<issue keywords>"`
3) Create branch:
   - `git checkout -b feature/<ISSUE-ID>-<slug>`
4) Implement + tests + docs
5) Update evidence in `docs/evidence/`
6) Validate:
   - `bun run test`
   - `bun run lint`
   - `bun run typecheck`
7) Push and open PR (optional via gh)

## Done when
- Acceptance Criteria satisfied
- Evidence updated
- No secrets committed
