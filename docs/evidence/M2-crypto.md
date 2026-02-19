# Evidence: M2-crypto.md

## Spec extraction and payload validation
- Source used: `docs/spec/test-spec.pdf`.
- Endpoint queried:
  - `GET https://n8n-apps.nlabshealth.com/webhook/data-5dYbrVSlMVJxfmco`
- Observed keys:
  - top: `success`, `data`
  - data: `algorithm`, `encrypted`, `secretKey`
  - encrypted: `iv`, `authTag`, `encrypted`

## Backend implementation
### M2-01
- Fastify/Bun skeleton with `GET /health`.

### M2-02
- AES-256-GCM decryptor (`Aes256GcmDecryptor`) with:
  - nested payload support (`data.encrypted.*` + `data.secretKey`)
  - `hex`/`base64` decoding support
  - strict key-length validation and fail-closed errors
- Secure endpoint client with timeout and safe error mapping.
- Unit tests for base64 fixtures and nested hex payload fixtures.

### M2-03
- `POST /users/execute`: fetch -> decrypt -> n8n ingest -> return payload.
- `POST /users/clear`: n8n clear -> `{ cleared: true }`.
- Timeout + retry on n8n client:
  - `HTTP_TIMEOUT_MS`
  - `HTTP_RETRIES`
- Consistent error envelope:
  - `{ "error": { "code", "message", "details?" } }`

### M2-04
- Japa integration tests added for:
  - `GET /health`
  - `POST /users/execute`
  - `POST /users/clear`
- Deterministic Bun unit/integration tests remain for core components.

## Commands
```bash
bun run test
bun run lint
bun run typecheck
```

## Latest validation run (2026-02-18)
```bash
bun run test      # PASS
bun run lint      # PASS
bun run typecheck # PASS
```

### Backend test highlights
- Bun tests: `13 pass`, `0 fail`.
- Japa tests: `3 passed` for:
  - `GET /health`
  - `POST /users/execute`
  - `POST /users/clear`

## Curl examples (localhost)
```bash
curl -i http://localhost:3001/health
curl -i -X POST http://localhost:3001/users/execute -H 'content-type: application/json' -d '{}'
curl -i -X POST http://localhost:3001/users/clear -H 'content-type: application/json' -d '{}'
```

## C0-02 live contract check (2026-02-19)

Environment used for deterministic live HTTP validation:
- backend on `127.0.0.1:3101`
- temporary webhook server on `127.0.0.1:7777` emulating n8n responses
- secure endpoint live URL kept enabled

### `GET /health` success
```http
HTTP/1.1 200 OK
{"status":"ok"}
```

### `POST /users/execute` success
```http
HTTP/1.1 200 OK
{"users":[{"id":1,"nome":"Ana","email":"ana@example.com","phone":"+55 11 90000-0001"},{"id":2,"nome":"Beto","email":"beto@example.com","phone":"+55 11 90000-0002"}]}
```

### `POST /users/clear` success
```http
HTTP/1.1 200 OK
{"cleared":true}
```

### Controlled failure envelope (`/users/clear` with invalid webhook path)
```http
HTTP/1.1 400 Bad Request
{"error":{"code":"N8N_WEBHOOK_FAILED","message":"Webhook do n8n retornou erro","details":{"status":404}}}
```
