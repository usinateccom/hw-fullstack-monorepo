# Codex Instructions

You must follow `instructions/core.instructions.md` and `instructions/filter.instructions.md`.

## Mandatory workflow
1) Read the current issue `.github/issues/<file>.md`
2) If relevant, run RAG search:
   - `bun run rag:search "<keywords>"`
3) Implement only the issue scope
4) Add/adjust tests
5) Update docs + evidence
6) Validate:
   - `bun run test`
   - `bun run lint`
   - `bun run typecheck`

## Forbidden
- No git commits
- No Docker dependency
- No framework swaps
