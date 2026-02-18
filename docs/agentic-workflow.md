# Agentic Workflow

## Purpose
Keep issue delivery fast and reproducible by checking local docs context before writing code.

## Standard loop
1. Choose issue in `.github/issues/`.
2. Run:
```bash
bun run rag:search "<issue keywords>"
```
3. Create feature branch.
4. Implement only the issue scope.
5. Update evidence file for the milestone.
6. Run validations (`test`, `lint`, `typecheck`).
7. Open PR to `develop`.

## Example
For issue `M2-03`:
```bash
bun run rag:search "M2-03 n8n execute clear"
git checkout -b feature/M2-03-n8n-forward-ingest
```

Use top hits to avoid duplicating existing decisions from `docs/` and issue files.
