This directory stores n8n workflow JSON exports.

- `ingest-users.json`: receives decrypted users, upserts into Postgres, returns persisted rows.
- `list-users.json`: returns persisted users from Postgres.
- `clear-users.json`: truncates `users` table and returns `{ cleared: true }`.

Import these files through n8n UI (Import from file).
