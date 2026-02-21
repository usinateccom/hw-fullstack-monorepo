# Deployment

This repository uses a local-first validation baseline and a cloud-finalization path.

## CI quality gate (GitHub Actions)

Workflow file:
- `.github/workflows/ci.yml`

Runs on push/PR to `develop` and `main`:
- `bun install --frozen-lockfile`
- `bun run test`
- `bun run lint`
- `bun run typecheck`
- `bun run --cwd packages/frontend/web build`

## Vercel deploy automation (GitHub Actions)

Workflow file:
- `.github/workflows/vercel-deploy.yml`

Behavior:
- PR to `develop/main`: preview deploy job.
- Push to `main`: production deploy job.
- `workflow_dispatch`: manual rerun support.

Required GitHub repository secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VITE_API_BASE_URL` (recommended for production build context)

Important:
- Jobs are gated by secrets presence; if missing, deploy jobs are skipped.
- No Vercel credentials are stored in repository files.

## Unified CD (3 deploys in sequence)

Workflow file:
- `.github/workflows/release-deploy.yml`

Behavior:
- Trigger: push to `main` and manual dispatch.
- Stage 1: trigger Railway backend deploy (deploy hook).
- Stage 2: trigger Railway n8n deploy (deploy hook).
- Stage 3: wait readiness for backend `/health` and n8n root URL.
- Stage 4: build and deploy frontend to Vercel production.
- Stage 5: production smoke (`/health`, frontend root, `/users/execute`, `/users/clear`).

Required GitHub secrets:
- `RAILWAY_BACKEND_DEPLOY_HOOK_URL`
- `RAILWAY_N8N_DEPLOY_HOOK_URL`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Required GitHub repository variables:
- `PROD_BACKEND_URL` (example: `https://hw-fullstack-monorepo-production.up.railway.app`)
- `PROD_N8N_URL` (example: `https://n8ndocker-production-7c03.up.railway.app`)
- `PROD_FRONTEND_URL` (example: `https://hw-fullstack-monorepo-web.vercel.app`)

## Backend (Fastify + Bun)

### Recommended platforms
- Railway
- Render
- Fly.io

### Start command
```bash
cd packages/backend/api
bun src/server.ts
```

### Step-by-step (click-by-click)
1. Create backend service in Railway/Render/Fly from this repository.
2. Set working directory to `packages/backend/api` (if platform requires monorepo root override).
3. Set install command to `bun install`.
4. Set start command to `bun src/server.ts`.
5. Configure backend env vars (list below).
6. Deploy and wait for healthy state.
7. Validate `GET /health` on public URL.

### Environment variables (backend)
- `API_PORT`
- `API_HOST`
- `CORS_ORIGIN`
- `SECURE_ENDPOINT_URL`
- `N8N_WEBHOOK_INGEST_URL`
- `N8N_WEBHOOK_LIST_URL`
- `N8N_WEBHOOK_CLEAR_URL`
- `HTTP_TIMEOUT_MS`
- `HTTP_RETRIES`

`CORS_ORIGIN` supports multiple origins as comma-separated values:
```bash
CORS_ORIGIN=https://your-prod-frontend.vercel.app,https://your-preview-frontend.vercel.app
```

### Post-deploy smoke test
```bash
curl -i https://<backend-url>/health
curl -i -X POST https://<backend-url>/users/execute -H 'content-type: application/json' -d '{}'
curl -i -X POST https://<backend-url>/users/clear -H 'content-type: application/json' -d '{}'
```

### n8n production dependency
Before `/users/execute` and `/users/clear` can pass, production n8n must be ready:
1. Create/import workflows (ingest/list/clear) in production n8n.
2. Configure production Postgres credentials in workflow nodes.
3. Activate workflows.
4. Copy each webhook **Production URL** into backend env:
   - `N8N_WEBHOOK_INGEST_URL`
   - `N8N_WEBHOOK_LIST_URL`
   - `N8N_WEBHOOK_CLEAR_URL`

## Frontend (React + Vite)

### Recommended platforms
- Vercel
- Netlify

### Build command
```bash
cd packages/frontend/web
bun run build
```

### Publish directory
- `packages/frontend/web/dist`

### Environment variable
- `VITE_API_BASE_URL=https://<backend-url>`

### Vercel deployment model
- Recommended: Vercel Git integration (no custom GH Action required).
- Project root: `packages/frontend/web`
- Build command: `bun run build`
- Output directory: `dist`
- Install command: `bun install`

### Vercel setup (click-by-click)
1. In Vercel, import the GitHub repository.
2. Set **Root Directory** to `packages/frontend/web`.
3. Set **Framework Preset** to `Vite`.
4. Set **Install Command** to `bun install`.
5. Set **Build Command** to `bun run build`.
6. Set **Output Directory** to `dist`.
7. Add environment variable `VITE_API_BASE_URL=https://<backend-url>` for Preview and Production.
8. Deploy once manually from Vercel UI to validate project linkage.
9. Copy `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` into GitHub secrets.
10. Add `VERCEL_TOKEN` in GitHub secrets.

### Vercel environment variables
- `VITE_API_BASE_URL=https://<backend-url>`

### Frontend publish checks
- Open frontend URL.
- Click `Executar` and verify table fills.
- Click `Limpar` and verify table clears without reload.

## Ordered production go-live sequence
1. Provision production Postgres.
2. Deploy/configure production n8n (with Postgres credentials).
3. Import/activate workflows and capture production webhook URLs.
4. Deploy backend with production env vars (including webhook URLs).
5. Smoke backend routes.
6. Deploy frontend and point `VITE_API_BASE_URL` to backend.
7. Validate full UI flow (`Executar` and `Limpar`).
8. Register evidence in `docs/evidence/M4-deploy.md`.
9. Confirm latest `main` run completed in:
   - `.github/workflows/ci.yml`
   - `.github/workflows/vercel-deploy.yml`

## Rollback
If production smoke fails after a deploy:
1. Frontend: rollback to previous successful deployment on Vercel/Netlify.
2. Backend: rollback to previous successful deployment on Railway/Render/Fly.
3. Reapply previous backend env set (especially `N8N_WEBHOOK_*`, `CORS_ORIGIN`, `VITE_API_BASE_URL` alignment).
4. Re-run smoke checks on rolled-back versions.
5. Open incident note in evidence doc with timestamp, failed check, rollback target and result.

## Production troubleshooting: `Failed to fetch`
If frontend shows `Failed to fetch` after deploy:
1. In Vercel project, verify `VITE_API_BASE_URL` is set to backend public URL (not localhost).
2. In backend platform, verify `CORS_ORIGIN` includes the frontend Vercel domain.
3. Run from terminal:
```bash
curl -i https://<backend-url>/health
curl -i -X POST https://<backend-url>/users/execute -H 'content-type: application/json' -d '{}'
```
4. If backend curl works but browser still fails, inspect browser Network tab:
   - status `0` / CORS error: fix `CORS_ORIGIN`
   - DNS/TLS failure: verify backend URL in `VITE_API_BASE_URL`
   - `4xx/5xx` with JSON error: backend is reachable, fix backend env/workflow
