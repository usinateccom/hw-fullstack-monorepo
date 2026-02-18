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

### Notes
- Deployment actions are pending due network restrictions in the current sandbox.
