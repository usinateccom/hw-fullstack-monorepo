# H&W Fullstack Test - Bun Monorepo

Pipeline implemented in this repository:
1. Backend fetches encrypted payload from secure endpoint.
2. Backend decrypts AES-256-GCM payload.
3. Backend forwards decrypted users to n8n ingest webhook.
4. n8n persists users in PostgreSQL and returns persisted data.
5. Frontend displays users in a dynamic `<table>` with `Executar` and `Limpar` (no page reload).

## Live URLs
- Frontend: `PENDING`
- Backend: `PENDING`

## Tech stack
- Backend: Bun + Fastify (DDD-ish boundaries)
- Frontend: React UI (ESM runtime) served by Bun static server
- Workflows: n8n (ingest/list/clear)
- Database: PostgreSQL

## Monorepo layout
- `packages/backend/api`
- `packages/frontend/web`
- `packages/tooling/workflows/exported`
- `infra/sql/users.sql`
- `docs/` and `docs/evidence/`

## Local run (Linux/WSL)
Detailed steps: `PROJECT-SETUP.md`

Quick commands:
```bash
bun install

# backend
cd packages/backend/api
cp .env.example .env
bun run dev

# frontend
cd ../frontend/web
# edit runtime-config.js if needed
globalThis.__API_BASE_URL = "http://localhost:3001"
bun run dev
```

## Validation
From root:
```bash
bun run test
bun run lint
bun run typecheck
```

## Evidence pack
- M0: `docs/evidence/M0-setup.md`, `docs/evidence/M0-policy.md`
- M1: `docs/evidence/M1-db.md`, `docs/evidence/M1-n8n.md`
- M2: `docs/evidence/M2-crypto.md`
- M3: `docs/evidence/M3-ui.md`
- M4: `docs/evidence/M4-deploy.md`

## Notes about current sandbox
- Cloud deploy and GitHub PR creation require external network and are blocked in this environment.
- Commands and placeholders for final online proof are already documented.
