# Evidence: M3-ui.md

## M3-01 - React UI table and layout
- Implemented responsive frontend page in `packages/frontend/web`.
- UI contains:
  - `<table>` with `nome/email/phone`
  - button `Executar`
  - button `Limpar`
- Dynamic updates happen without page reload.

## M3-02 - API integration
- `Executar` calls `POST /users/execute` and updates table state from backend response.
- `Limpar` calls `POST /users/clear` and clears table on success.
- Loading and error states implemented in UI.
- Buttons are disabled while loading to avoid flicker and duplicate requests.

## Commands
```bash
cd packages/frontend/web
bun run dev
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
