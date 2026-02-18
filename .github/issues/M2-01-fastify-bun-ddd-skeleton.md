Title: Implement Bun + Fastify backend skeleton with DDD boundaries and health endpoint
Milestone: M2 - Crypto + Backend Use Cases
Labels: backend,testing,docs

## GitFlow Branch
- feature/M2-01-fastify-bun-skeleton

## Goal
Create a Bun runtime backend using Fastify, organized in DDD layers.

## Functional Requirements
- Create Fastify server entrypoint with:
  - `GET /health` returning `{ status: "ok" }`
- Define DDD-ish structure:
  - `domain/` entities + value objects (minimal)
  - `application/` use cases
  - `infrastructure/` adapters (http clients)
  - `presentation/` controllers/routes
- Add basic config loading from `.env` (no secrets committed)

## Non-Functional Requirements
- Fast startup time
- Clear error handling boundaries

## Acceptance Criteria
- `bun run dev` starts server
- `GET /health` returns 200

## Deliverables / Evidence
- `docs/evidence/M2-crypto.md` includes:
  - `bun -v`
  - server startup log
  - curl output for `/health`
