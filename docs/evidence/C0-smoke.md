# Evidence: C0-smoke.md

## Goal
One-command local smoke verification for required fullstack flow.

## Script
- `scripts/local-e2e-smoke.sh`

## Covered checks
1. PostgreSQL connectivity
2. `users` table presence
3. n8n webhook reachability
4. backend `GET /health`
5. backend `POST /users/execute`
6. DB count growth after execute
7. backend `POST /users/clear`
8. DB count reset after clear

## Usage
```bash
chmod +x scripts/local-e2e-smoke.sh
./scripts/local-e2e-smoke.sh
```

Optional relaxed mode (diagnostic only):
```bash
SMOKE_STRICT_DB_GROWTH=0 ./scripts/local-e2e-smoke.sh
```

## Notes
- Default mode is strict and fails if DB row count does not increase after execute.
- This script is intended for final reviewer and release smoke checks.

