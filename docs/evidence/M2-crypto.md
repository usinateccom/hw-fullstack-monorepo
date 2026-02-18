# Evidence: M2-crypto.md

## Spec extraction
- Source used: local PDF (`docs/spec/test-spec.pdf`, gitignored).
- Architecture + checklist documented in `docs/architecture.md`.
- Payload field names/encodings are not explicitly defined in the PDF; assumptions are listed in architecture docs.

## Backend implementation
### M2-01
- Fastify/Bun skeleton with `GET /health`.

### M2-02
- AES-256-GCM decryptor (`Aes256GcmDecryptor`) with fail-closed errors.
- Secure endpoint client with timeout and safe error mapping.
- Deterministic unit tests with fixture (no live endpoint dependency).

### M2-03
- `POST /users/execute` flow:
  - fetch secure payload
  - decrypt AES-256-GCM
  - forward users to `N8N_WEBHOOK_INGEST_URL`
  - return persisted payload from n8n
- `POST /users/clear` flow:
  - call `N8N_WEBHOOK_CLEAR_URL`
  - return `{ cleared: true }`
- Retry + timeout for n8n calls:
  - retries: `HTTP_RETRIES` (default 3)
  - timeout: `HTTP_TIMEOUT_MS` (default 10000 ms)
- Consistent error envelope:
  - `{ "error": { "code": "...", "message": "...", "details": {} } }`

## Curl examples (localhost)
```bash
curl -i http://localhost:3001/health

curl -i -X POST http://localhost:3001/users/execute \
  -H 'content-type: application/json'

curl -i -X POST http://localhost:3001/users/clear \
  -H 'content-type: application/json'
```

## Commands
```bash
bun run test
bun run lint
bun run typecheck
```

## Outputs / notes
- `test/lint/typecheck` executed locally and passing in this branch.
- Endpoint lookup and GitHub operations from this sandbox can fail due DNS/network restrictions.
- Live call command for evaluator environment:
```bash
curl -s "$SECURE_ENDPOINT_URL" | jq
```
