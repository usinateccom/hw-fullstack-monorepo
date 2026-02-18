Title: Implement local RAG-like docs index + search CLI for repo documentation
Milestone: M5 - Bonus RAG-ready Docs Search
Labels: rag,tooling,docs

## GitFlow Branch
- feature/M5-01-rag-cli

## Goal
Provide a local “RAG-like” tool to index repo docs and search them quickly.

## Functional Requirements
- Implement:
  - `bun run rag:index` -> creates a JSON index from `docs/` + `instructions/` + `.github/issues/`
  - `bun run rag:search "<query>"` -> returns ranked matches with file paths and snippets
- Store index under `packages/tooling/rag/rag/index.json`

## Non-Functional Requirements
- No external services
- Fast execution

## Acceptance Criteria
- Search returns relevant hits for queries like "AES-256-GCM" and "TRUNCATE users".

## Deliverables / Evidence
- `docs/evidence/M5-rag.md` with:
  - index generation output
  - sample searches
