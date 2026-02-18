# Deployment

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

### CORS
Set `CORS_ORIGIN` to the frontend deployed URL.

### Post-deploy smoke test
```bash
curl -i https://<backend-url>/health
curl -i -X POST https://<backend-url>/users/execute -H 'content-type: application/json' -d '{}'
curl -i -X POST https://<backend-url>/users/clear -H 'content-type: application/json' -d '{}'
```

## Frontend (React page)

### Recommended platforms
- Vercel
- Netlify

### Build/runtime strategy in this repository
The frontend runs as static assets served by Bun (`packages/frontend/web/src/server.ts`).

### Frontend runtime variable
- `__API_BASE_URL` (global value injected in hosting layer) or fallback to `http://localhost:3001`.
