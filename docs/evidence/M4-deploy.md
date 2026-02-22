# Evidence: M4-deploy.md

## M4-04 - vercel + CI pipeline

### CI workflow
- File: `.github/workflows/ci.yml`
- Trigger: push/PR on `develop` and `main`
- Jobs:
  - `bun install --frozen-lockfile`
  - `bun run test`
  - `bun run lint`
  - `bun run typecheck`
  - `bun run --cwd packages/frontend/web build`

### Vercel deploy workflow
- File: `.github/workflows/vercel-deploy.yml`
- Preview deploy: PRs targeting `develop`/`main` (when Vercel secrets exist)
- Production deploy: push to `main` (when Vercel secrets exist)
- Required GitHub secrets:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

## C0-11 - unified CD for 3 deploys

### Workflow
- File: `.github/workflows/release-deploy.yml`
- Trigger:
  - `push` on `main`
  - `workflow_dispatch`

### Unified deployment order
1. Railway backend deploy hook trigger
2. Railway n8n deploy hook trigger
3. Readiness wait (`backend /health`, `n8n /`)
4. Vercel production deploy
5. Smoke checks (`/health`, frontend root, `/users/execute`, `/users/clear`)

### Required GitHub secrets
- `RAILWAY_BACKEND_DEPLOY_HOOK_URL`
- `RAILWAY_N8N_DEPLOY_HOOK_URL`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Required GitHub variables
- `PROD_BACKEND_URL`
- `PROD_N8N_URL`
- `PROD_FRONTEND_URL`

### CI proof placeholders
- `[ ] PR checks screenshot/link`
- `[ ] main branch workflow run screenshot/link`
- `[ ] vercel preview workflow run link`
- `[ ] vercel production workflow run link`
- `[ ] vercel preview URL`
- `[ ] vercel production URL`

## M4-01 - backend deployment

### Platform
- `PENDING` (Railway/Render/Fly)

### Backend URL
- `https://hw-fullstack-monorepo-production.up.railway.app`

### Env var names configured
- `API_PORT`
- `API_HOST`
- `CORS_ORIGIN`
- `SECURE_ENDPOINT_URL`
- `N8N_WEBHOOK_INGEST_URL`
- `N8N_WEBHOOK_LIST_URL`
- `N8N_WEBHOOK_CLEAR_URL`
- `HTTP_TIMEOUT_MS`
- `HTTP_RETRIES`

### Curl proof placeholders
```bash
curl -i https://hw-fullstack-monorepo-production.up.railway.app/health
curl -i -X POST https://hw-fullstack-monorepo-production.up.railway.app/users/execute -H 'content-type: application/json' -d '{}'
curl -i -X POST https://hw-fullstack-monorepo-production.up.railway.app/users/clear -H 'content-type: application/json' -d '{}'
```

## M4-02 - frontend deployment

### Platform
- `PENDING` (Vercel/Netlify)

### Frontend URL
- `https://hw-fullstack-monorepo-web.vercel.app`

### Frontend env var
- `VITE_API_BASE_URL=https://<backend-url>`

### E2E proof placeholders
- `[ ] front online screenshot`
- `[ ] execute flow screenshot`
- `[ ] clear flow screenshot`

## M4-03 - final reviewer pack

### Reviewer quickcheck
1. Open frontend URL.
2. Click `Executar` and verify dynamic table population.
3. Click `Limpar` and verify table clears without reload.
4. Call backend `/health` and confirm `200`.

### Remaining external actions
- Publish backend and frontend URLs.
- Attach screenshots and curl outputs above.

## Local validation status (2026-02-18)
- Monorepo checks executed successfully:
  - `bun run test`
  - `bun run lint`
  - `bun run typecheck`
- Deploy evidence is still pending cloud publication and public URLs.

## Remaining manual cloud actions
- Validate n8n production service is online (`200` on service root).
- Ensure n8n workflows are `Published` and webhook production URLs copied exactly to backend env.
- Confirm secure endpoint env uses official source:
  - `SECURE_ENDPOINT_URL=https://n8n-apps.nlabshealth.com/webhook/data-5dYbrVSlMVJxfmco`
- Attach final run screenshots after `execute` and `clear`.

## Production fetch diagnostics checklist
- `[ ] Vercel env: VITE_API_BASE_URL points to backend public URL (not localhost)`
- `[ ] Backend env: CORS_ORIGIN includes frontend Vercel domain(s)`
- `[ ] Curl https://<backend-url>/health returns 200`
- `[ ] Curl POST /users/execute returns JSON payload`
- `[ ] Browser Network tab confirms request target matches configured backend URL`

## C0-13 production smoke/runbook hardening

Added:
- `scripts/prod-smoke.sh` (single entrypoint to test backend + n8n in production)
- root script alias: `bun run smoke:prod`
- deploy docs updated with copy/paste smoke command and diagnostics map

Smoke command:
```bash
BACKEND_URL="https://<backend-domain>" \
N8N_BASE_URL="https://<n8n-domain>" \
SEED_COUNT="20" \
bun run smoke:prod
```

Observed from this execution environment (agent sandbox):
- DNS lookups for target domains failed with `Could not resolve host`
- Result: external validation must be re-run from operator machine/CI runner with public DNS access

## C0-14 strict scope alignment
- Removed non-scope seed/populate flow from app and docs.
- Frontend now exposes only challenge-required actions:
  - `Executar`
  - `Limpar`
- Production smoke and API docs now validate only `/users/execute` and `/users/clear` plus n8n webhooks.
