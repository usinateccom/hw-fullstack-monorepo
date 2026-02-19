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
N8N_WEBHOOK_INGEST_URL=http://localhost:5678/webhook/ingest-users
N8N_WEBHOOK_LIST_URL=http://localhost:5678/webhook/list-users
N8N_WEBHOOK_CLEAR_URL=http://localhost:5678/webhook/clear-users
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
