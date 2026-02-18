# Workflows (n8n)

## Exported files
- `packages/tooling/workflows/exported/ingest-users.json`
- `packages/tooling/workflows/exported/list-users.json`
- `packages/tooling/workflows/exported/clear-users.json`

## Import steps
1. Start n8n (`n8n`) and open `http://localhost:5678`.
2. Use **Import from file** and import each JSON export.
3. Configure `postgres-local` credentials in every Postgres node.
4. Activate workflows.

## Expected webhook paths
- Ingest: `POST /webhook/ingest-users`
- List: `GET /webhook/list-users`
- Clear: `POST /webhook/clear-users`

## Notes
- `clear-users` runs `TRUNCATE TABLE users RESTART IDENTITY;`.
- Keep credentials inside n8n; do not commit secrets.
