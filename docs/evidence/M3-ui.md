# Evidence: M3-ui.md

## M3-01 - React UI table and layout
- Implemented responsive React UI.
- UI contains:
  - `<table>` with `nome/email/phone`
  - button `Executar`
  - button `Popular <N>` and quantity input
  - button `Limpar`
- Dynamic updates happen without page reload.

## M3-02 - API integration
- `Executar` calls `POST /users/execute` and updates table state.
- `Popular <N>` calls `POST /users/seed` and updates table state.
- `Limpar` calls `POST /users/clear` and clears table state.
- Loading and error states implemented.

## M3-03 - Jest component tests
- Jest + React Testing Library tests cover:
  - execute populates table
  - seed populates table and sends quantity payload
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

## Latest E2E run (2026-02-19)
```bash
PATH=$HOME/.nvm/versions/node/v22.12.0/bin:$PATH bun run test:e2e
# 2 passed (3.3s)
```

### Frontend test highlights
- Jest + RTL state transitions:
  - execute populates table
  - seed populates table and validates request body
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
- [x] start frontend app for E2E runner (`playwright.config.mjs` webServer)
- [x] click `Executar` and verify rows rendered
- [x] click `Limpar` and verify table empty
- [x] repeat flow without page reload

## Screenshot evidence
- `docs/evidence/assets/m3-desktop-after-execute.png`
- `docs/evidence/assets/m3-desktop-after-clear.png`
- `docs/evidence/assets/m3-mobile-after-execute.png`
