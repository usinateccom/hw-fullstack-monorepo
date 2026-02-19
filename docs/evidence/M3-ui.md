# Evidence: M3-ui.md

## M3-01 - React UI table and layout
- Implemented responsive React UI.
- UI contains:
  - `<table>` with `nome/email/phone`
  - button `Executar`
  - button `Limpar`
- Dynamic updates happen without page reload.

## M3-02 - API integration
- `Executar` calls `POST /users/execute` and updates table state.
- `Limpar` calls `POST /users/clear` and clears table state.
- Loading and error states implemented.

## M3-03 - Jest component tests
- Jest + React Testing Library tests cover:
  - execute populates table
  - clear empties table
  - loading disables buttons

## Commands
```bash
cd packages/frontend/web
bun run dev
bun run test
bun run test:e2e
bun run lint
bun run typecheck
```

## Latest validation run (2026-02-18)
```bash
bun run test      # PASS
bun run lint      # PASS
bun run typecheck # PASS
```

### Frontend test highlights
- Jest + RTL state transitions:
  - execute populates table
  - clear empties table
  - loading disables buttons
- Playwright E2E (mocked API in browser route interception):
  - execute renders rows in `<table>`
  - clear restores empty state
  - flow runs without page reload

## Automated E2E suite
- File: `packages/frontend/web/tests/e2e/execute-clear.spec.ts`
- Config: `packages/frontend/web/playwright.config.mjs`
- Runner:
```bash
bun run test:e2e
```

## E2E checklist
- [ ] start backend and n8n
- [ ] click `Executar` and verify rows rendered
- [ ] click `Limpar` and verify table empty
- [ ] repeat flow without page reload

## Screenshot placeholders
- `[ ] desktop layout after execute`
- `[ ] desktop layout after clear`
- `[ ] mobile layout`
