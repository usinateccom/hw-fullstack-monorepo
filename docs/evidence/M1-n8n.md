# Evidence: M1-n8n.md

## Version checks
```bash
node -v
bun -v
n8n --version
```

## Imported workflows
- `ingest-users`
- `list-users`
- `clear-users`

## Screenshot placeholders
- `[ ] n8n canvas with ingest-users`
- `[ ] n8n canvas with list-users`
- `[ ] n8n canvas with clear-users`

## Webhook URL summary
- `POST http://localhost:5678/webhook/ingest-users`
- `GET  http://localhost:5678/webhook/list-users`
- `POST http://localhost:5678/webhook/clear-users`

## C0-03 live verification notes (2026-02-19)

### Environment used
- n8n via `bunx n8n` (`2.8.3`) with `N8N_USER_FOLDER=/tmp/n8n-home`
- local credential imported as `postgres-local` for database `hw_fullstack_db`
- workflows imported from `packages/tooling/workflows/exported/*.json`

### Commands executed
```bash
N8N_USER_FOLDER=/tmp/n8n-home bunx n8n import:credentials --input=/tmp/n8n-creds.json
N8N_USER_FOLDER=/tmp/n8n-home bunx n8n import:workflow --input=/tmp/n8n-workflows/ingest-users.json
N8N_USER_FOLDER=/tmp/n8n-home bunx n8n import:workflow --input=/tmp/n8n-workflows/list-users.json
N8N_USER_FOLDER=/tmp/n8n-home bunx n8n import:workflow --input=/tmp/n8n-workflows/clear-users.json
N8N_USER_FOLDER=/tmp/n8n-home bunx n8n start --host 127.0.0.1 --port 5678
curl -i -X POST http://127.0.0.1:5678/webhook/ingest-users -H 'content-type: application/json' -d '{}'
```

### Observed result
- n8n starts and marks workflows as activated in logs.
- Production webhook path returns `404` in headless run:
```text
The requested webhook "POST ingest-users" is not registered.
```

### Current status
- n8n runtime and credential import are validated.
- Webhook registration behavior in this headless setup still needs final adjustment before marking C0-03 as complete.
