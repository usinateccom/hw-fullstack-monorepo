Title: Add Postgres schema exactly as required by the test spec
Milestone: M1 - Local Infra + n8n/Postgres
Labels: infra,docs

## GitFlow Branch
- feature/M1-03-users-sql-schema

## Goal
Ensure the project uses the exact `users` table schema required by the spec.

## Functional Requirements
- Create/replace `infra/sql/users.sql` with:
  - `id SERIAL PRIMARY KEY`
  - `nome VARCHAR(128) NOT NULL`
  - `email VARCHAR(255) UNIQUE NOT NULL`
  - `phone VARCHAR(20) NOT NULL`
- Add a short verification query section in docs.

## Non-Functional Requirements
- No Docker required.
- Must work on Linux and WSL.

## Acceptance Criteria
- Running `psql ... -f infra/sql/users.sql` succeeds.
- `SELECT * FROM users LIMIT 1;` works.

## Deliverables / Evidence
- `docs/evidence/M1-db.md` includes:
  - commands used
  - output of `\d users`
  - output of `SELECT count(*) FROM users;`
