Title: Local Postgres setup (Linux/WSL) and schema initialization (no Docker)
Milestone: M1 - Local Infra + n8n/Postgres
Labels: infra,docs

## Functional Requirements
- Document Postgres installation for Linux and WSL
- Provide SQL schema file `infra/sql/users.sql` matching the required table
- Provide environment examples (no secrets)

## Non-Functional Requirements
- Docker must remain optional
- Setup must be reproducible

## Acceptance Criteria
- User can create `hw_db` and apply `users.sql` successfully

## Deliverables / Evidence
- `docs/evidence/M1-db.md` with:
  - install steps
  - `psql` commands used
  - verification query output (e.g. SELECT count(*) FROM users;)

## Repo Areas
- `infra/sql/users.sql`, `PROJECT-SETUP.md`, `docs/evidence/M1-db.md`
