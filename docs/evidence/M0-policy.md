# Evidence: M0-policy.md

## Policy files present
- `instructions/core.instructions.md`
- `instructions/filter.instructions.md`
- `AGENTS.md`
- `.codex/` adapter folder
- `.gemini/` adapter folder

## Usage summary
- Core policy enforces issue-by-issue execution and Bun-first workflow.
- Scope filter prevents overengineering and non-requested features.
- `AGENTS.md` documents branch/PR/evidence lifecycle.
- Agentic process now requires `bun run rag:search` before coding each issue.
