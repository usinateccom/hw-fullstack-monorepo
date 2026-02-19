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

### Post-deploy smoke test
```bash
curl -i https://<backend-url>/health
curl -i -X POST https://<backend-url>/users/execute -H 'content-type: application/json' -d '{}'
curl -i -X POST https://<backend-url>/users/clear -H 'content-type: application/json' -d '{}'
```

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

### Vercel environment variables
- `VITE_API_BASE_URL=https://<backend-url>`

### Frontend publish checks
- Open frontend URL.
- Click `Executar` and verify table fills.
- Click `Limpar` and verify table clears without reload.
