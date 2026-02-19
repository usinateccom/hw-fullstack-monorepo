# PROJECT-SETUP (Linux / WSL)

This repository implements a fullstack flow:
- Backend (Bun + Fastify) decrypts AES-256-GCM and orchestrates n8n webhooks.
- n8n persists users into PostgreSQL.
- Frontend (React + Vite) renders a dynamic `<table>` and provides `Executar` + `Limpar` without reload.

Docker is optional only.

## 1) Prerequisites

### 1.1 System packages
```bash
sudo apt update
sudo apt install -y git curl unzip jq
```

### 1.2 Bun
```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bun -v
```

## 2) Clone and install
```bash
git clone <YOUR_REPO_URL>
cd hw-fullstack-monorepo
bun install
```

## 2.1) Start all services (n8n + backend + frontend)
```bash
bun run start:all
```
Note:
- If your shell is on Node `22.11.x`, `start:all` will auto-use Node `22.12.0` from nvm when available.

### Optional flags
```bash
# Start without n8n
INCLUDE_N8N=0 bun run start:all

# Start only backend
INCLUDE_N8N=0 INCLUDE_FRONTEND=0 bun run start:all

# Start only frontend
INCLUDE_N8N=0 INCLUDE_BACKEND=0 bun run start:all

# Custom ports
N8N_PORT=5680 VITE_PORT=5174 API_PORT=3002 bun run start:all
```

## 3) PostgreSQL local setup

### 3.1 Install and start
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

### 3.2 Create DB
```bash
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d postgres
```
```sql
ALTER USER postgres WITH PASSWORD 'Tst1320';
CREATE DATABASE hw_fullstack_db OWNER postgres;
\q
```

### 3.3 Apply schema
```bash
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -f infra/sql/users.sql
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) FROM users;"
```

## 4) n8n local setup

### 4.1 Install Node + n8n
```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
bunx n8n
```

Open `http://localhost:5678`.

### 4.2 Import workflows
Import JSONs from:
- `packages/tooling/workflows/exported/ingest-users.json`
- `packages/tooling/workflows/exported/list-users.json`
- `packages/tooling/workflows/exported/clear-users.json`

Configure Postgres credentials in each workflow.

### 4.3 Publish workflows (CLI) and restart n8n
If you imported workflows by CLI, publish each one and restart n8n to apply production webhooks:
```bash
N8N_USER_FOLDER=~/.n8n-test N8N_ENCRYPTION_KEY=<your-key> bunx n8n list:workflow
N8N_USER_FOLDER=~/.n8n-test N8N_ENCRYPTION_KEY=<your-key> bunx n8n publish:workflow --id <workflow-id>
```
Important:
- `publish:workflow` only takes effect after n8n restart.
- Stop n8n (`Ctrl+C`) and start again with the same `N8N_USER_FOLDER` and `N8N_ENCRYPTION_KEY`.
- In n8n UI, open each workflow, ensure Postgres nodes use `postgres-local`, save, and activate.
- Copy the **Production URL** from each Webhook node (ingest/list/clear).

## 5) Backend config and run

### 5.1 Environment
```bash
cd packages/backend/api
cp .env.example .env
```

Set in `.env` (complete example):
```bash
API_PORT=3001
API_HOST=0.0.0.0
CORS_ORIGIN=http://localhost:5173
SECURE_ENDPOINT_URL=https://n8n-apps.nlabshealth.com/webhook/data-5dYbrVSlMVJxfmco
N8N_WEBHOOK_INGEST_URL=<copy-from-n8n-production-webhook>
N8N_WEBHOOK_LIST_URL=<copy-from-n8n-production-webhook>
N8N_WEBHOOK_CLEAR_URL=<copy-from-n8n-production-webhook>
HTTP_TIMEOUT_MS=10000
HTTP_RETRIES=3
```

### 5.2 Start backend
```bash
bun run dev
```

## 6) Frontend config and run

### 6.1 Environment
```bash
cd packages/frontend/web
cp .env.example .env
```

Set in `.env`:
```bash
VITE_API_BASE_URL=http://localhost:3001
```

### 6.2 Start frontend
```bash
bun run dev
```

## 7) Validation
From root:
```bash
bun run test
bun run lint
bun run typecheck
```

Local smoke (backend + n8n + postgres):
```bash
chmod +x scripts/local-e2e-smoke.sh
./scripts/local-e2e-smoke.sh
```

Seed multiple fixture users directly in PostgreSQL:
```bash
bun run seed:users
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) FROM users;"
```

## 8) Optional Docker path
```bash
cd infra
docker compose up -d
```

## 9) Where to add n8n credential
Create this credential in n8n UI:
1. Open `http://localhost:5678`.
2. Go to `Credentials` and create a `Postgres` credential.
3. Use:
   - `Host=localhost`
   - `Port=5432`
   - `Database=hw_fullstack_db`
   - `User=postgres`
   - `Password=Tst1320`
   - `SSL=off`
4. Save as `postgres-local`.
5. Open each imported workflow and select this credential in all Postgres nodes.

## 10) Final local proof (issue #17)
With n8n and backend running:
```bash
curl -s -X POST http://127.0.0.1:3001/users/execute -H 'content-type: application/json' -d '{}'
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) FROM users;"

curl -s -X POST http://127.0.0.1:3001/users/clear -H 'content-type: application/json' -d '{}'
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) FROM users;"
```
Expected:
- After execute: `count(*) > 0`
- After clear: `count(*) = 0`

If both counts remain `0`, verify:
1. backend is running (`curl http://127.0.0.1:3001/health`)
2. webhook URLs in backend `.env` are copied from n8n production URL
3. workflows are saved + activated in n8n after restart

## 11) Useful command reference
```bash
# Full stack
bun run start:all

# Partial start
INCLUDE_N8N=0 INCLUDE_FRONTEND=0 bun run start:all
INCLUDE_N8N=0 INCLUDE_BACKEND=0 bun run start:all

# Populate many fixture users
bun run seed:users

# DB quick checks
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) FROM users;"
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT id,nome,email,phone FROM users ORDER BY id DESC LIMIT 10;"
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "TRUNCATE TABLE users RESTART IDENTITY;"

# API quick checks
curl -i http://127.0.0.1:3001/health
curl -i -X POST http://127.0.0.1:3001/users/execute -H 'content-type: application/json' -d '{}'
curl -i -X POST http://127.0.0.1:3001/users/clear -H 'content-type: application/json' -d '{}'

# Quality gate
bun run test
bun run lint
bun run typecheck
```

## 12) Troubleshooting
- `Node >= 22.12 is required... found v22.11.0`:
  - run `source ~/.nvm/nvm.sh && nvm use 22.12.0`
  - or use `start:all` fallback (it auto-picks `~/.nvm/versions/node/v22.12.0/bin/node` when available)
- `Mismatching encryption keys` in n8n:
  - keep the same pair of `N8N_USER_FOLDER` and `N8N_ENCRYPTION_KEY`
  - if using a new key, use a clean folder (example: `~/.n8n-test`)
- `webhook ... is not registered`:
  - verify workflow is `Saved` and `Active`
  - copy webhook **Production URL** from n8n UI
  - update backend `.env` and restart backend
- `curl: (7) Failed to connect to 127.0.0.1:3001`:
  - backend is not running (start `bun run dev` in `packages/backend/api`)
