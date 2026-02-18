# Evidence: M3-ui.md

## M3-01 - React UI table and layout
- Implemented responsive frontend page in `packages/frontend/web`.
- UI contains:
  - `<table>` with `nome/email/phone`
  - button `Executar`
  - button `Limpar`
- Dynamic updates happen without page reload.

## Commands
```bash
cd packages/frontend/web
bun run dev
```

## Screenshot placeholders
- `[ ] desktop layout with empty table`
- `[ ] desktop after clicking Executar`
- `[ ] mobile layout`

## Notes
- Current M3-01 uses local mock users to validate dynamic table behavior.
- M3-02 will connect UI directly to backend endpoints.
