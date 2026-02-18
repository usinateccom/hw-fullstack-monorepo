# Evidence: M2-crypto.md

## Spec extraction
- Source used: local PDF (`Teste para Desenvolvedor Fullstack - H&W Publishing (1).pdf`).
- Architecture + checklist documented in `docs/architecture.md`.
- Payload field names/encodings are not explicitly defined in the PDF; assumptions are listed in architecture docs.

## Backend implementation (M2-01 + M2-02)
- Fastify/Bun skeleton with `GET /health`.
- AES-256-GCM decryptor (`Aes256GcmDecryptor`) with fail-closed errors.
- Secure endpoint client with timeout and safe error mapping.
- Deterministic crypto unit tests with local fixture (no live endpoint dependency).

## Commands
```bash
bun -v
bun run test --scope @backend/api
bun run lint --scope @backend/api
bun run typecheck --scope @backend/api
curl -sS https://n8n-apps.nlabshealth.com/webhook/data-5dYbrVSlMVJxfmco
```

## Outputs / notes
- Endpoint lookup from this sandbox currently fails DNS resolution (`Could not resolve host`).
- Because of network restrictions in this environment, package installation and live endpoint proof remain pending.
- Unit fixture confirms decryptor behavior for valid payload, invalid payload, and tampered authTag.
