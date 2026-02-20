# Evidence: C0-final-hardening.md

## Goal
Finalize repository hygiene and evaluator-ready docs for local-first delivery.

## Completed actions
- Hardened `.gitignore` strategy:
  - keeps `bun.lock` tracked
  - ignores non-Bun lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `npm-shrinkwrap.json`)
  - keeps `.env` ignored and `.env.example` tracked
- Hardened `start:all` behavior:
  - auto-fallback to Node `22.12.0` from nvm when shell is on `22.11.x`
  - checks only ports for enabled services (`INCLUDE_*` aware)
- Removed seed-based local test path:
  - deleted `scripts/seed-users.sh`
  - removed root command `bun run seed:users`
  - docs now enforce official acceptance path only (`/users/execute` and `/users/clear`)
- Expanded setup docs with copy/paste flows, troubleshooting, and useful command index.
- Expanded `README.md` with scope checklist, quickstart, manual e2e checks, and command catalog.
- Hardened docs for operational clarity:
  - `start:all` documented as daily runtime command after one-time bootstrap
  - `docs/workflows.md` now explains production webhook URL mapping and dynamic path cases
  - `docs/deploy.md` now includes click-by-click go-live sequence and rollback checklist
- Implemented issue #60 (`start:all` readiness hardening):
  - deterministic startup order: n8n -> backend -> frontend
  - HTTP readiness gates for n8n and backend (`/health`)
  - configurable timeout and poll interval:
    - `STARTUP_MAX_WAIT_SEC`
    - `STARTUP_POLL_INTERVAL_SEC`
    - `N8N_READY_URL`
    - `BACKEND_READY_URL`
  - fail-fast on readiness timeout or early child process exit with actionable logs

## Validation commands and outputs (2026-02-19)

```bash
bun run test
bun run lint
bun run typecheck
```

Observed:
- `bun run test` -> success for all projects
- `bun run lint` -> success for all projects
- `bun run typecheck` -> success for all projects

## Reliability matrix (issue #60)

| Scenario | Command | Expected | Observed |
|---|---|---|---|
| Syntax validation | `bash -n scripts/start-all.sh` | shell script is valid | pass |
| Backend readiness waits and fails fast when backend exits early | `INCLUDE_N8N=0 INCLUDE_FRONTEND=0 bun run start:all` | clear readiness log + non-zero exit | pass (`[readiness] backend process exited before becoming ready`) |
| Forced bad backend readiness URL | `INCLUDE_N8N=0 INCLUDE_FRONTEND=0 BACKEND_READY_URL=http://127.0.0.1:9/health STARTUP_MAX_WAIT_SEC=4 bun run start:all` | readiness gate fails quickly with explicit reason | pass (explicit readiness failure) |

Reference startup logs (expected shape on healthy run):
```text
[stage 1/3] Starting n8n...
[readiness] waiting for n8n: http://127.0.0.1:5678 (timeout 90s)
[readiness] n8n ready (HTTP 200) after 4s.
[stage 2/3] Starting backend...
[readiness] waiting for backend: http://127.0.0.1:3001/health (timeout 90s)
[readiness] backend ready (HTTP 200) after 1s.
[stage 3/3] Starting frontend...
All enabled services started in dependency order. Press Ctrl+C to stop.
```

```bash
bun run test:e2e
```

Observed:
- `2 passed` (Playwright)

```bash
timeout 8s env INCLUDE_N8N=0 INCLUDE_BACKEND=0 VITE_PORT=5181 bun run start:all
```

Observed:
- frontend starts successfully via `start:all`
- no immediate Node version gate failure in this path

```bash
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) FROM users;"
```

Observed:
- count validation is performed only through execute/clear flow

## End-to-end persistence proof (backend -> n8n -> postgres)

```bash
curl -s -X POST http://127.0.0.1:3001/users/clear -H 'content-type: application/json' -d '{}'
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) AS after_clear FROM users;"

curl -s -X POST http://127.0.0.1:3001/users/execute -H 'content-type: application/json' -d '{}'
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) AS after_execute FROM users;"
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT id,nome,email,phone FROM users ORDER BY id ASC LIMIT 3;"

curl -s -X POST http://127.0.0.1:3001/users/clear -H 'content-type: application/json' -d '{}'
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) AS after_final_clear FROM users;"
```

Observed:
- `after_clear = 0`
- `/users/execute` returned users payload
- `after_execute = 50`
- SQL sample rows returned valid `nome/email/phone`
- final clear returned `after_final_clear = 0`

## Deliverable checklist
- [x] Cleanup/hardening changes applied
- [x] `.gitignore` + `.env.example` policy explicit
- [x] Setup docs include full useful command catalog
- [x] Local validation commands documented and executed
- [x] Acceptance path clarified as backend -> n8n -> postgres (`execute/clear`)
- [x] Repository ready for evaluator local run
