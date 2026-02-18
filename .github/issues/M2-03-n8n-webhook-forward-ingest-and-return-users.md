Title: Forward decrypted users to n8n ingest webhook and return persisted users to frontend
Milestone: M2 - Crypto + Backend Use Cases
Labels: backend,workflows,testing

## GitFlow Branch
- feature/M2-03-n8n-forward-ingest

## Goal
Backend must forward decrypted users to n8n webhook so n8n stores in Postgres and returns persisted users.

## Functional Requirements
- Add endpoint `POST /users/execute`
  - fetch secure endpoint
  - decrypt AES-256-GCM
  - POST decrypted users to `N8N_WEBHOOK_INGEST_URL`
  - return response payload to frontend
- Add endpoint `POST /users/clear`
  - call `N8N_WEBHOOK_CLEAR_URL`
  - return `{ cleared: true }`

## Non-Functional Requirements
- Timeouts and retries (e.g. 3 attempts) for n8n webhook calls
- Return consistent error format

## Acceptance Criteria
- Manual E2E: clicking "Executar" populates table
- Manual E2E: clicking "Limpar" clears table and truncates DB

## Deliverables / Evidence
- `docs/evidence/M2-crypto.md` includes:
  - curl examples to `/users/execute` and `/users/clear`
  - response samples (redacted where needed)
