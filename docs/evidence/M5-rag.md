# Evidence: M5-rag.md

## M5-01 - local rag-like index/search

### Commands executed
```bash
bun run rag:index
bun run rag:search "AES-256-GCM"
bun run rag:search "TRUNCATE users"
bun run rag:search "execute clear production webhook placeholder"
bun run rag:search "unified cd railway vercel deploy hooks"
```

### Observed outputs
- Index generated at `packages/tooling/rag/rag/index.json`
- Indexed files: `34`
- Search returns ranked matches with:
  - score
  - file path
  - content snippet

Example hits:
- `docs/architecture.md`
- `docs/evidence/M2-crypto.md`
- `.github/issues/M2-02-secure-endpoint-fetch-and-decrypt-aes-256-gcm.md`
- `docs/workflows.md`
- `docs/api.md`

## M5-02 - workflow documentation
- Updated `AGENTS.md` to require `bun run rag:search` before coding each issue.
- Added `docs/agentic-workflow.md` with concise step-by-step and example commands.

### Notes
- local-only implementation
- no external APIs or embeddings
- run `rag:index` before `rag:search` to refresh index
