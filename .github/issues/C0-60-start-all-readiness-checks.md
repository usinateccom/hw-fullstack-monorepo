Title: Improve start:all with dependency-aware orchestration and readiness checks
Milestone: C0 - Final Hardening
Labels: infra,chore,qa

## GitFlow Branch
- feature/C0-60-start-all-readiness

## Goal
Make local startup deterministic so `bun run start:all` starts services in order with readiness checks.

## Functional Requirements
- Keep one command entrypoint (`bun run start:all`).
- Start order with readiness checks:
  1. n8n
  2. backend
  3. frontend
- Add configurable wait/retry logic for:
  - n8n URL availability
  - backend `/health` availability
- Provide explicit logs for each readiness stage.
- Fail fast with clear reason on timeout.

## Non-Functional Requirements
- Bun-first commands only.
- Linux/WSL compatible.
- No Docker required for local baseline.

## Acceptance Criteria
- `bun run start:all` reliably starts all services in order.
- If n8n is unavailable, script exits with actionable error and no orphan processes.
- `PROJECT-SETUP.md` includes behavior and troubleshooting notes.

## Deliverables / Evidence
- `scripts/start-all.sh`
- `PROJECT-SETUP.md`
- `docs/evidence/C0-final-hardening.md`
