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
- Frontend: React + Vite
- Workflows: n8n (ingest/list/clear)
- Database: PostgreSQL

## Monorepo layout
- `packages/backend/api`
- `packages/frontend/web`
- `packages/tooling/workflows/exported`
- `infra/sql/users.sql`
- `docs/` and `docs/evidence/`

## Local run
Detailed steps: `PROJECT-SETUP.md`

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
- M5: `docs/evidence/M5-rag.md`
