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

### Deployment approach
Deploy folder `packages/frontend/web` as static site plus Bun server option.

### Frontend runtime API target
Edit `packages/frontend/web/runtime-config.js`:
```js
globalThis.__API_BASE_URL = "https://<backend-url>";
```

### Frontend publish checks
- Open frontend URL.
- Click `Executar` and verify table fills.
- Click `Limpar` and verify table clears without reload.

### Optional static hosting command
If platform supports command-based start:
```bash
cd packages/frontend/web
bun src/server.ts
```
