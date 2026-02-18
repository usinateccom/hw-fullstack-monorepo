# PROJECT-SETUP (Linux / WSL)

This repository is a Bun monorepo (Lerna) implementing a fullstack pipeline:
- Backend (Bun + Fastify) decrypts AES-256-GCM from a secure endpoint and forwards users to n8n
- n8n persists into PostgreSQL and returns persisted users
- Frontend (React) shows users in a table and supports "Executar" and "Limpar" without page reload
- "Limpar" also triggers an n8n workflow that truncates the `users` table

> Docker is OPTIONAL. This guide assumes **no Docker** by default.

---

## 1) Prerequisites

### 1.1 Linux / WSL packages
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

### 1.3 GitHub CLI (optional, for automated repo/issues)
```bash
sudo apt install -y gh
gh --version
```

### 1.4 WSL systemd (recommended for Postgres service)
1) Edit `/etc/wsl.conf`:
```ini
[boot]
systemd=true
```
2) From Windows PowerShell:
```powershell
wsl --shutdown
```
3) Back in WSL:
```bash
systemctl --version
```

---

## 2) Clone & install

```bash
git clone <YOUR_REPO_URL>
cd hw-fullstack-monorepo
bun install
```

---

## 3) PostgreSQL (no Docker)

### 3.1 Install Postgres
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
sudo systemctl status postgresql --no-pager
```

### 3.2 Create DB and user
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
```

Verify:
```bash
psql "postgresql://hw_user:hw_pass@localhost:5432/hw_db" -c "SELECT count(*) FROM users;"
```

---

## 4) n8n (no Docker)

> n8n is easiest to run via Node when avoiding Docker.

### 4.1 Install Node via NVM
```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
node -v
npm -v
```

### 4.2 Install and run n8n
```bash
npm i -g n8n
n8n
```

Open:
- http://localhost:5678

### 4.3 Import workflows
In n8n UI:
- Import each JSON file from:
  - `packages/tooling/workflows/exported/`

You will have 3 workflows:
- ingest-users
- list-users
- clear-users

### 4.4 Configure Postgres credentials in n8n
Inside each workflow, configure a Postgres node with:
- host: localhost
- port: 5432
- db: hw_db
- user: hw_user
- password: hw_pass

---

## 5) Environment variables

### 5.1 Backend env
Copy:
- `packages/backend/api/.env.example` -> `packages/backend/api/.env`

Set:
- `SECURE_ENDPOINT_URL=...`
- `N8N_WEBHOOK_INGEST_URL=...`
- `N8N_WEBHOOK_LIST_URL=...`
- `N8N_WEBHOOK_CLEAR_URL=...`

### 5.2 Frontend env
Copy:
- `packages/frontend/web/.env.example` -> `packages/frontend/web/.env`

Set:
- `VITE_API_BASE_URL=http://localhost:3001` (example)

---

## 6) Run locally

### 6.1 Run backend
```bash
cd packages/backend/api
bun run dev
```

### 6.2 Run frontend
```bash
cd packages/frontend/web
bun run dev
```

---

## 7) Tests

From root:
```bash
bun run test
```

---

## 8) OPTIONAL: Docker path
If you prefer Docker, use the optional `infra/docker-compose.yml` and skip manual Postgres/n8n installation.

```bash
cd infra
docker compose up -d
```
