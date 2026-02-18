# Evidence: M4-deploy.md

## M4-01 - backend deployment

### Platform
- `PENDING` (Railway/Render/Fly)

### Backend URL
- `PENDING`

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
curl -i https://<backend-url>/health
curl -i -X POST https://<backend-url>/users/execute -H 'content-type: application/json' -d '{}'
curl -i -X POST https://<backend-url>/users/clear -H 'content-type: application/json' -d '{}'
```

## M4-02 - frontend deployment

### Platform
- `PENDING` (Vercel/Netlify)

### Frontend URL
- `PENDING`

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
