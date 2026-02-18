# H&W Fullstack Test — Bun Monorepo (Fastify + React + n8n + Postgres)

This repository implements the required pipeline:
1) Backend calls a secure endpoint returning AES-256-GCM encrypted payload
2) Backend decrypts the payload (AES-256-GCM)
3) Backend forwards decrypted users to an n8n webhook
4) n8n persists users in PostgreSQL and returns persisted data
5) Frontend renders a `<table>` with the users and supports:
   - **Executar**: runs the pipeline and updates UI dynamically (no reload)
   - **Limpar**: clears UI dynamically (no reload) and triggers an n8n workflow to truncate `users`

## Repo Layout
- `packages/backend/api`: Bun + Fastify API (DDD + Japa)
- `packages/frontend/web`: React UI (Jest)
- `packages/shared/contracts`: shared types/schemas
- `packages/tooling/workflows`: n8n workflow exports + docs
- `packages/tooling/rag`: local docs search (bonus)
- `docs/`: architecture, api, deploy, evidence pack
- `instructions/`, `.codex/`, `.gemini/`, `AGENTS.md`: agentic development policies

## Quickstart
See `PROJECT-SETUP.md`.

## Commands
From repo root:
- `bun install`
- `bun run dev`
- `bun run test`
- `bun run lint`
- `bun run typecheck`
- `bun run rag:index`
- `bun run rag:search "n8n webhook"`

## Evidence Pack
All milestone proofs live under:
- `docs/evidence/`

## GitHub Automation
Auto-create labels, milestones and issues from `.github/issues/*.md` via:
```bash
./scripts/gh-bootstrap.sh <repo-name> public
```
