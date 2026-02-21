# Workflows (n8n)

## Exported files
- `packages/tooling/workflows/exported/ingest-users.json`
- `packages/tooling/workflows/exported/list-users.json`
- `packages/tooling/workflows/exported/clear-users.json`

## Import steps
1. Start n8n (`n8n`) and open `http://localhost:5678`.
2. Use **Import from file** and import each JSON export.
3. Configure `postgres-local` credentials in every Postgres node.
4. Save workflows and activate each one.

## Credentials (required)
Create one Postgres credential and reuse in all Postgres nodes:
- Host: `localhost`
- Port: `5432`
- Database: `hw_fullstack_db`
- User: `postgres`
- Password: `<defined .env password>`
- SSL: `off`

## Expected webhook paths
- Ingest: `POST /webhook/ingest-users`
- List: `GET /webhook/list-users`
- Clear: `POST /webhook/clear-users`

## Production URL mapping (do not guess paths)
n8n can generate dynamic webhook paths depending on workflow/node metadata.
Always copy the full **Production URL** from each Webhook node and map in backend `.env`:
- `N8N_WEBHOOK_INGEST_URL=<production-url-of-ingest-users>`
- `N8N_WEBHOOK_LIST_URL=<production-url-of-list-users>`
- `N8N_WEBHOOK_CLEAR_URL=<production-url-of-clear-users>`

Common mistake:
- Running curl with placeholders like `<path-real-ingest>` returns:
  - `The requested webhook "POST <path-real-ingest>" is not registered`
- Use the copied URL exactly as shown in node Production URL tab.

If imported via CLI, publish and restart n8n:
```bash
N8N_USER_FOLDER=~/.n8n-test N8N_ENCRYPTION_KEY=<your-key> bunx n8n list:workflow
N8N_USER_FOLDER=~/.n8n-test N8N_ENCRYPTION_KEY=<your-key> bunx n8n publish:workflow --id <workflow-id>
```

Optional webhook registry inspection:
```bash
bun -e 'import { Database } from "bun:sqlite";
const db=new Database(process.env.HOME+"/.n8n-test/.n8n/database.sqlite",{readonly:true});
const rows=db.query("select workflowId, webhookPath, method from webhook_entity order by workflowId").all();
console.log(rows);'
```

## Notes
- `clear-users` runs `TRUNCATE TABLE users RESTART IDENTITY;`.
- Keep credentials inside n8n; do not commit secrets.
- `404 The requested webhook ... is not registered` means workflow is not active and/or backend env has wrong webhook URL.
- `502 Application failed to respond` on n8n URL means runtime/service issue (not webhook path issue).

## End-to-end production smoke commands
```bash
# n8n webhooks (direct)
curl -i -X POST "https://<n8n-domain>/webhook/ingest-users" -H 'content-type: application/json' -d '{}'
curl -i "https://<n8n-domain>/webhook/list-users"
curl -i -X POST "https://<n8n-domain>/webhook/clear-users" -H 'content-type: application/json' -d '{}'

# backend pipeline
curl -i -X POST "https://<backend-domain>/users/execute" -H 'content-type: application/json' -d '{}'
curl -i -X POST "https://<backend-domain>/users/seed" -H 'content-type: application/json' -d '{"count":50}'
curl -i -X POST "https://<backend-domain>/users/clear" -H 'content-type: application/json' -d '{}'
```
