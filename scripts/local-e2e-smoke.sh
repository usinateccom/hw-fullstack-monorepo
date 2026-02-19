#!/usr/bin/env bash
set -euo pipefail

# One-command local smoke verification:
# - PostgreSQL connectivity + users table
# - n8n webhook reachability
# - backend health
# - execute + clear flow and DB assertions

GREEN="$(printf '\033[32m')"
RED="$(printf '\033[31m')"
YELLOW="$(printf '\033[33m')"
RESET="$(printf '\033[0m')"

pass() { echo "${GREEN}[PASS]${RESET} $*"; }
warn() { echo "${YELLOW}[WARN]${RESET} $*"; }
fail() { echo "${RED}[FAIL]${RESET} $*"; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

require_cmd curl
require_cmd psql
require_cmd jq

PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGUSER="${PGUSER:-postgres}"
PGPASSWORD="${PGPASSWORD:-Tst1320}"
PGDATABASE="${PGDATABASE:-hw_fullstack_db}"

API_BASE_URL="${API_BASE_URL:-http://127.0.0.1:3001}"
N8N_WEBHOOK_INGEST_URL="${N8N_WEBHOOK_INGEST_URL:-http://127.0.0.1:5678/webhook/ingest-users}"
N8N_WEBHOOK_CLEAR_URL="${N8N_WEBHOOK_CLEAR_URL:-http://127.0.0.1:5678/webhook/clear-users}"
SMOKE_STRICT_DB_GROWTH="${SMOKE_STRICT_DB_GROWTH:-1}"

export PGPASSWORD

echo "== Local E2E Smoke =="
echo "PG: ${PGUSER}@${PGHOST}:${PGPORT}/${PGDATABASE}"
echo "API: ${API_BASE_URL}"
echo "n8n ingest: ${N8N_WEBHOOK_INGEST_URL}"
echo "n8n clear: ${N8N_WEBHOOK_CLEAR_URL}"

if psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c "SELECT 1;" >/dev/null 2>&1; then
  pass "PostgreSQL connectivity"
else
  fail "Cannot connect to PostgreSQL"
fi

if psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c "\\d users" >/dev/null 2>&1; then
  pass "users table exists"
else
  fail "users table not found"
fi

n8n_ingest_status="$(curl -sS -o /tmp/smoke-n8n-ingest.out -w "%{http_code}" -X POST "$N8N_WEBHOOK_INGEST_URL" -H 'content-type: application/json' -d '{}' || true)"
if [[ "$n8n_ingest_status" == "200" || "$n8n_ingest_status" == "400" || "$n8n_ingest_status" == "404" ]]; then
  warn "n8n ingest webhook responded with HTTP ${n8n_ingest_status} (continuing; backend check is authoritative)"
else
  fail "n8n ingest webhook not reachable"
fi

health_status="$(curl -sS -o /tmp/smoke-health.out -w "%{http_code}" "${API_BASE_URL}/health" || true)"
if [[ "$health_status" != "200" ]]; then
  fail "Backend /health failed (HTTP ${health_status})"
fi
pass "Backend /health responded 200"

count_before="$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -tAc "SELECT count(*) FROM users;")"
echo "DB count before execute: ${count_before}"

execute_status="$(curl -sS -o /tmp/smoke-execute.out -w "%{http_code}" -X POST "${API_BASE_URL}/users/execute" -H 'content-type: application/json' -d '{}' || true)"
if [[ "$execute_status" != "200" ]]; then
  cat /tmp/smoke-execute.out || true
  fail "POST /users/execute failed (HTTP ${execute_status})"
fi
pass "POST /users/execute responded 200"

count_after_execute="$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -tAc "SELECT count(*) FROM users;")"
echo "DB count after execute: ${count_after_execute}"
if [[ "${count_after_execute}" -le "${count_before}" ]]; then
  if [[ "${SMOKE_STRICT_DB_GROWTH}" == "1" ]]; then
    fail "DB row count did not increase after execute; check n8n webhook path/registration"
  fi
  warn "DB row count did not increase after execute; continuing because SMOKE_STRICT_DB_GROWTH=0"
else
  pass "DB row count increased after execute"
fi

clear_status="$(curl -sS -o /tmp/smoke-clear.out -w "%{http_code}" -X POST "${API_BASE_URL}/users/clear" -H 'content-type: application/json' -d '{}' || true)"
if [[ "$clear_status" != "200" ]]; then
  cat /tmp/smoke-clear.out || true
  fail "POST /users/clear failed (HTTP ${clear_status})"
fi
pass "POST /users/clear responded 200"

count_after_clear="$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -tAc "SELECT count(*) FROM users;")"
echo "DB count after clear: ${count_after_clear}"
if [[ "${count_after_clear}" != "0" ]]; then
  fail "DB not cleared after /users/clear (count=${count_after_clear})"
fi
pass "DB cleared after /users/clear"

echo
echo "${GREEN}Smoke completed successfully.${RESET}"
