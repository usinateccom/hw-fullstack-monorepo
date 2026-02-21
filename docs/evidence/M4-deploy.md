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
curl -i -X POST https://hw-fullstack-monorepo-production.up.railway.app/users/seed -H 'content-type: application/json' -d '{"count":20}'
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
- Attach final run screenshots after `execute` and `seed`.

## Production fetch diagnostics checklist
- `[ ] Vercel env: VITE_API_BASE_URL points to backend public URL (not localhost)`
- `[ ] Backend env: CORS_ORIGIN includes frontend Vercel domain(s)`
- `[ ] Curl https://<backend-url>/health returns 200`
- `[ ] Curl POST /users/execute returns JSON payload`
- `[ ] Browser Network tab confirms request target matches configured backend URL`
