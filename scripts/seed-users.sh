#!/usr/bin/env bash
set -euo pipefail

PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGUSER="${PGUSER:-postgres}"
PGDATABASE="${PGDATABASE:-hw_fullstack_db}"
PGPASSWORD="${PGPASSWORD:-Tst1320}"

export PGPASSWORD

psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" <<'SQL'
INSERT INTO users (nome, email, phone) VALUES
  ('Ana Silva', 'ana.fixture@example.com', '+55 11 99999-1111'),
  ('Bruno Souza', 'bruno.fixture@example.com', '+55 21 98888-2222'),
  ('Carla Mendes', 'carla.fixture@example.com', '+55 31 97777-3333'),
  ('Diego Lima', 'diego.fixture@example.com', '+55 41 96666-4444'),
  ('Eduarda Nunes', 'eduarda.fixture@example.com', '+55 51 95555-5555'),
  ('Felipe Rocha', 'felipe.fixture@example.com', '+55 61 94444-6666'),
  ('Gabriela Costa', 'gabriela.fixture@example.com', '+55 71 93333-7777'),
  ('Henrique Alves', 'henrique.fixture@example.com', '+55 81 92222-8888'),
  ('Isabela Freitas', 'isabela.fixture@example.com', '+55 91 91111-9999'),
  ('Joao Pereira', 'joao.fixture@example.com', '+55 11 90000-0000'),
  ('Karen Martins', 'karen.fixture@example.com', '+55 21 98989-1111'),
  ('Lucas Araujo', 'lucas.fixture@example.com', '+55 31 97878-2222'),
  ('Mariana Barros', 'mariana.fixture@example.com', '+55 41 96767-3333'),
  ('Nicolas Ribeiro', 'nicolas.fixture@example.com', '+55 51 95656-4444'),
  ('Olivia Duarte', 'olivia.fixture@example.com', '+55 61 94545-5555'),
  ('Paulo Gomes', 'paulo.fixture@example.com', '+55 71 93434-6666'),
  ('Quezia Soares', 'quezia.fixture@example.com', '+55 81 92323-7777'),
  ('Rafael Castro', 'rafael.fixture@example.com', '+55 91 91212-8888'),
  ('Sofia Melo', 'sofia.fixture@example.com', '+55 11 90101-9999'),
  ('Tiago Farias', 'tiago.fixture@example.com', '+55 21 99090-0000')
ON CONFLICT (email) DO UPDATE
SET nome = EXCLUDED.nome,
    phone = EXCLUDED.phone;
SQL

echo "Inserted/updated fixture users into $PGDATABASE.users"
