# PROJECT-SETUP (Linux / WSL)

This repository implements a fullstack flow:
- Backend (Bun + Fastify) decrypts AES-256-GCM and orchestrates n8n webhooks.
- n8n persists users into PostgreSQL.
- Frontend renders a dynamic `<table>` and provides `Executar` + `Limpar` without reload.

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

### 1.3 Optional GitHub CLI
```bash
sudo apt install -y gh
gh --version
```

## 2) Clone and install
```bash
git clone <YOUR_REPO_URL>
cd hw-fullstack-monorepo
bun install
```

## 3) PostgreSQL local setup

### 3.1 Install and start
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

### 3.2 Create DB
```bash
sudo -u postgres psql
```
```sql
CREATE USER hw_user WITH PASSWORD 'hw_pass';
CREATE DATABASE hw_db OWNER hw_user;
\q
```

### 3.3 Apply schema
```bash
psql "postgresql://hw_user:hw_pass@localhost:5432/hw_db" -f infra/sql/users.sql
psql "postgresql://hw_user:hw_pass@localhost:5432/hw_db" -c "SELECT count(*) FROM users;"
```

## 4) n8n local setup

### 4.1 Install Node + n8n
```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
npm i -g n8n
n8n
```

Open `http://localhost:5678`.

### 4.2 Import workflows
Import JSONs from:
- `packages/tooling/workflows/exported/ingest-users.json`
- `packages/tooling/workflows/exported/list-users.json`
- `packages/tooling/workflows/exported/clear-users.json`

Configure Postgres credentials in each workflow node.

## 5) Backend config and run

### 5.1 Environment
```bash
cd packages/backend/api
cp .env.example .env
```

Set in `.env`:
- `SECURE_ENDPOINT_URL`
- `N8N_WEBHOOK_INGEST_URL`
- `N8N_WEBHOOK_LIST_URL`
- `N8N_WEBHOOK_CLEAR_URL`
- `CORS_ORIGIN`

### 5.2 Start backend
```bash
bun run dev
```

## 6) Frontend run

### 6.1 Runtime backend URL
Edit:
- `packages/frontend/web/runtime-config.js`

Example:
```js
globalThis.__API_BASE_URL = "http://localhost:3001";
```

### 6.2 Start frontend
```bash
cd packages/frontend/web
bun run dev
```

## 7) Validation
From root:
```bash
bun run test
bun run lint
bun run typecheck
```

## 8) Optional Docker path
```bash
cd infra
docker compose up -d
```
