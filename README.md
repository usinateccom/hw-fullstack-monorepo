# H&W Fullstack Test - Bun Monorepo

Fullstack pipeline in this repository:
1. Backend fetches encrypted payload from secure endpoint.
2. Backend decrypts AES-256-GCM payload.
3. Backend forwards decrypted users to n8n ingest webhook.
4. n8n persists users in PostgreSQL and returns persisted data.
5. Frontend renders a dynamic `<table>` with `Executar` and `Limpar` (no reload).

## Scope Status (against test brief)
- Backend stack (`Fastify` + `n8n` + `PostgreSQL`): complete
- AES-256-GCM decrypt + secure endpoint integration: complete
- Frontend table + execute/clear dynamic behavior: complete
- Local reproducibility + docs + evidence: complete
- CI quality gate (`test/lint/typecheck`): configured in `.github/workflows/ci.yml`
- Cloud deploy URLs: deployment playbook documented in `docs/deploy.md`; final URLs depend on manual cloud provisioning

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

## Quickstart (copy/paste)
```bash
# from repo root
bun install
sudo service postgresql start
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -f infra/sql/users.sql
bun run start:all
```

Important:
- `start:all` starts services, but does not create n8n workflows or Postgres credentials automatically.
- Complete one-time bootstrap in `PROJECT-SETUP.md` section `4) n8n local setup` before first `execute/clear`.

In another terminal:
```bash
# quality gate
bun run test
bun run lint
bun run typecheck
```

## Manual E2E checks
```bash
# backend health
curl -i http://127.0.0.1:3001/health

# pipeline execute/clear through backend
curl -i -X POST http://127.0.0.1:3001/users/execute -H 'content-type: application/json' -d '{}'
curl -i -X POST http://127.0.0.1:3001/users/clear -H 'content-type: application/json' -d '{}'

# db verification
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) FROM users;"
```

Official acceptance path:
- Use `POST /users/execute` and `POST /users/clear` to validate backend -> n8n -> postgres pipeline.

## Useful commands
```bash
# run only frontend or backend with start:all
INCLUDE_N8N=0 INCLUDE_BACKEND=0 bun run start:all
INCLUDE_N8N=0 INCLUDE_FRONTEND=0 bun run start:all

# n8n workflow CLI
N8N_USER_FOLDER=~/.n8n-test N8N_ENCRYPTION_KEY=<key> bunx n8n list:workflow
N8N_USER_FOLDER=~/.n8n-test N8N_ENCRYPTION_KEY=<key> bunx n8n publish:workflow --id <workflow-id>

# clear database
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "TRUNCATE TABLE users RESTART IDENTITY;"
```

## Local setup guide
- Full setup and troubleshooting: `PROJECT-SETUP.md`

## Cloud finalization checklist
1. Deploy backend on Railway/Render/Fly and configure backend env vars.
2. Provision production Postgres and set n8n production credentials.
3. Import/publish workflows in production n8n and copy production webhook URLs.
4. Deploy frontend on Vercel with root `packages/frontend/web`.
5. Set `VITE_API_BASE_URL` in Vercel to backend public URL.
6. Set backend `CORS_ORIGIN` to frontend Vercel domain.
7. Run production smoke checks (`/health`, `/users/execute`, `/users/clear`).
8. If smoke fails, follow rollback sequence in `docs/deploy.md`.
9. Update `docs/evidence/M4-deploy.md` with URLs and proof outputs.

## Evidence pack
- M0: `docs/evidence/M0-setup.md`, `docs/evidence/M0-policy.md`
- M1: `docs/evidence/M1-db.md`, `docs/evidence/M1-n8n.md`
- M2: `docs/evidence/M2-crypto.md`
- M3: `docs/evidence/M3-ui.md`
- M4: `docs/evidence/M4-deploy.md`
- M5: `docs/evidence/M5-rag.md`
- Final hardening: `docs/evidence/C0-final-hardening.md`
