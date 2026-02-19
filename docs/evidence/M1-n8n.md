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

# 2026-02-19 retry in elevated environment
INCLUDE_FRONTEND=0 bash scripts/start-all.sh
curl -s http://127.0.0.1:3001/health
curl -s -X POST http://127.0.0.1:3001/users/execute -H 'content-type: application/json' -d '{}'
curl -s -X POST http://127.0.0.1:3001/users/clear -H 'content-type: application/json' -d '{}'

# inspect registered webhook paths in n8n sqlite
bun -e 'import { Database } from "bun:sqlite"; const db=new Database("/tmp/n8n-home/.n8n/database.sqlite",{readonly:true}); console.log(db.query("select workflowId,webhookPath,method from webhook_entity").all())'
```

### Additional observed result (2026-02-19)
- `scripts/start-all.sh` now autodetects n8n encryption key from `N8N_USER_FOLDER/.n8n/config`, fixing startup mismatch.
- Backend and n8n start successfully in the same run.
- n8n logs still show production webhooks unresolved in this environment:
```text
Processed 6 draft workflows, 0 published workflows.
```
- Backend calls to `/users/execute` and `/users/clear` still return:
```json
{"error":{"code":"N8N_WEBHOOK_FAILED","message":"Webhook do n8n retornou erro","details":{"status":404}}}
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
- Full live webhook execution is still blocked by n8n webhook registration (`404`) in this environment.
- To close issue C0-03, run one final local proof in n8n UI: open each workflow, save + activate, copy production webhook URLs from UI, update backend `.env`, then rerun execute/clear and SQL checks.
