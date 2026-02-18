Title: Add agentic instruction packs (Codex/Gemini/Copilot) + personas
Milestone: M0 - Bootstrap & Standards
Labels: docs,chore

## Functional Requirements
- Add `instructions/*.instructions.md` policy packs:
  - core, personas, backend, frontend, testing, security, scripts, rag, filter
- Add `.codex/` and `.gemini/` adapters pointing to the core policies
- Add `AGENTS.md` describing the issue-by-issue workflow

## Non-Functional Requirements
- Rules must prevent scope creep ("no features not requested by the current issue")
- Must specify language policy: runtime logs PT-BR, comments/docblocks EN

## Acceptance Criteria
- Policies exist and are discoverable
- `AGENTS.md` clearly describes branch/PR and evidence process

## Deliverables / Evidence
- `docs/evidence/M0-policy.md` linking all policies and explaining how to use them

## Repo Areas
- `instructions/*`, `.codex/*`, `.gemini/*`, `AGENTS.md`
