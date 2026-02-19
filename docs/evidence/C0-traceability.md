# Evidence: C0-traceability.md

## Scope Traceability Matrix

| Requirement | Implementation Reference | Validation Evidence | Status |
|---|---|---|---|
| Backend in Node/Fastify + Bun runtime | `packages/backend/api/package.json`, `packages/backend/api/src/infrastructure/http/create-app.ts` | `bun run test`, `bun run lint`, `bun run typecheck` pass | done |
| Secure endpoint fetch | `packages/backend/api/src/infrastructure/http/secure-endpoint-client.ts` | secure endpoint contract verified in `docs/evidence/M2-crypto.md` | done |
| AES-256-GCM decryption | `packages/backend/api/src/application/services/aes256gcm-decryptor.ts` | unit tests in `packages/backend/api/tests/unit/aes256gcm-decryptor.test.ts` | done |
| Send decrypted payload to n8n webhook | `packages/backend/api/src/application/use-cases/execute-users-pipeline.ts`, `packages/backend/api/src/infrastructure/http/n8n-webhook-client.ts` | integration/japa tests for execute flow | done |
| n8n persists to PostgreSQL and returns users | `packages/tooling/workflows/exported/ingest-users.json`, `packages/tooling/workflows/exported/list-users.json` | SQL and workflow evidence in `docs/evidence/M1-db.md`, `docs/evidence/M1-n8n.md` | partial |
| Frontend renders dynamic `<table>` | `packages/frontend/web/src/App.js` | Jest/RTL tests in `packages/frontend/web/tests/app.jest.test.js` | done |
| Frontend has buttons `Executar` and `Limpar` with dynamic updates | `packages/frontend/web/src/App.js`, `packages/frontend/web/src/state.js` | Jest/RTL state transition tests | done |
| Clear action truncates DB through n8n | `packages/tooling/workflows/exported/clear-users.json` | workflow SQL query uses `TRUNCATE TABLE users RESTART IDENTITY` | done |
| Responsive frontend | `packages/frontend/web/src/styles.css` | responsive rules + manual checklist in `docs/evidence/M3-ui.md` | partial |
| Required users schema | `infra/sql/users.sql` | DB schema output in `docs/evidence/M1-db.md` | done |
| Documentation and setup reproducibility | `README.md`, `PROJECT-SETUP.md`, `docs/workflows.md` | documented commands and evidence files | done |
| Cloud deploy with public URLs | `docs/deploy.md`, `docs/evidence/M4-deploy.md`, `README.md` | URLs still `PENDING` | missing |

## Blocking Gaps

1. Cloud deployment signoff is pending.
   - Action: complete issue `#19` and fill live URLs/curl outputs in `README.md` and `docs/evidence/M4-deploy.md`.
2. Live n8n+Postgres full-flow proof is not fully captured as command output in current environment.
   - Action: complete issue `#17` with execute/clear DB before-after outputs.
3. Frontend responsive proof is still checklist/placeholder-based.
   - Action: complete issue `#18` with final screenshots from desktop/mobile.

## Signoff Notes

- Local quality gates (`test/lint/typecheck`) are green.
- Backend/Frontend feature scope is implemented and tested with deterministic tests.
- Final submission is blocked only by live deployment proof and final runbook evidence completion.

