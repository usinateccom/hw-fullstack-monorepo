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
- Added fixture seeding utility:
  - `scripts/seed-users.sh`
  - root script: `bun run seed:users`
- Expanded setup docs with copy/paste flows, troubleshooting, and useful command index.
- Expanded `README.md` with scope checklist, quickstart, manual e2e checks, and command catalog.

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

```bash
timeout 8s env INCLUDE_N8N=0 INCLUDE_BACKEND=0 VITE_PORT=5181 bun run start:all
```

Observed:
- frontend starts successfully via `start:all`
- no immediate Node version gate failure in this path

```bash
bun run seed:users
```

Observed:
- `INSERT 0 20`
- `Inserted/updated fixture users into hw_fullstack_db.users`

```bash
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) FROM users;"
```

Observed:
- `count = 21` in the validation environment (20 fixtures + 1 existing row)

## Deliverable checklist
- [x] Cleanup/hardening changes applied
- [x] `.gitignore` + `.env.example` policy explicit
- [x] Setup docs include full useful command catalog
- [x] Local validation commands documented and executed
- [x] Repository ready for evaluator local run
