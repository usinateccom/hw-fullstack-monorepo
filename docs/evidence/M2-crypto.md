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

## Curl examples (localhost)
```bash
curl -i http://localhost:3001/health
curl -i -X POST http://localhost:3001/users/execute -H 'content-type: application/json' -d '{}'
curl -i -X POST http://localhost:3001/users/clear -H 'content-type: application/json' -d '{}'
```
