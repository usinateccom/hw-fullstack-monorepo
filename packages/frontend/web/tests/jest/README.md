# Jest placeholder

This project keeps deterministic frontend tests on `bun:test` due network restrictions in the sandbox.

When registry access is available:
1. Install `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
2. Port state/interaction tests to component-level Jest tests.
3. Run `bun run test:jest` with real jest command.
