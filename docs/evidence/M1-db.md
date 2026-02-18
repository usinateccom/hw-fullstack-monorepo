# Evidence: M1-db.md

## Commands used
```bash
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -f infra/sql/users.sql
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "\\d users"
PGPASSWORD='Tst1320' psql -h localhost -U postgres -d hw_fullstack_db -c "SELECT count(*) FROM users;"
```

## Expected outputs

### `\d users`
```text
                        Table "public.users"
 Column |          Type          | Collation | Nullable |              Default
--------+------------------------+-----------+----------+-----------------------------------
 id     | integer                |           | not null | nextval('users_id_seq'::regclass)
 nome   | character varying(128) |           | not null |
 email  | character varying(255) |           | not null |
 phone  | character varying(20)  |           | not null |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_email_key" UNIQUE CONSTRAINT, btree (email)
```

### `SELECT count(*) FROM users;`
```text
 count
-------
     0
(1 row)
```
