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
cat /tmp/n8n-home/.n8n/config
N8N_USER_FOLDER=/tmp/n8n-home N8N_ENCRYPTION_KEY=10rqKJhukO76Y7HHBSGuhrf1Ps0MyRrl \
  bunx n8n import:credentials --input /tmp/n8n-postgres-credentials.json
N8N_USER_FOLDER=/tmp/n8n-home N8N_ENCRYPTION_KEY=10rqKJhukO76Y7HHBSGuhrf1Ps0MyRrl \
  bunx n8n import:workflow --input packages/tooling/workflows/exported/ingest-users.json
N8N_USER_FOLDER=/tmp/n8n-home N8N_ENCRYPTION_KEY=10rqKJhukO76Y7HHBSGuhrf1Ps0MyRrl \
  bunx n8n import:workflow --input packages/tooling/workflows/exported/list-users.json
N8N_USER_FOLDER=/tmp/n8n-home N8N_ENCRYPTION_KEY=10rqKJhukO76Y7HHBSGuhrf1Ps0MyRrl \
  bunx n8n import:workflow --input packages/tooling/workflows/exported/clear-users.json
N8N_USER_FOLDER=/tmp/n8n-home N8N_ENCRYPTION_KEY=10rqKJhukO76Y7HHBSGuhrf1Ps0MyRrl \
  bunx n8n publish:workflow --id sYR9JTbdNug0EIE6
timeout 8s N8N_USER_FOLDER=/tmp/n8n-home N8N_ENCRYPTION_KEY=10rqKJhukO76Y7HHBSGuhrf1Ps0MyRrl \
  N8N_PORT=5679 N8N_LISTEN_ADDRESS=127.0.0.1 bunx n8n start
```

### Observed result
- Credentials and workflows imported successfully via CLI.
- Publishing workflows works but requires restart to apply.
- n8n server fails to bind the local port in this sandbox:
```text
n8n webserver failed, exiting listen EPERM: operation not permitted 127.0.0.1:5679
```

### Current status
- Import/publish steps are reproducible.
- Full live webhook execution is blocked here due to sandbox port restrictions.
- Run the same commands on a local machine (outside sandbox) to complete the webhook proof.
