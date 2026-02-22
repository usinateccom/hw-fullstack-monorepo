#!/usr/bin/env bash
set -euo pipefail

# Usage:
# BACKEND_URL="https://backend.example.com" \
# N8N_BASE_URL="https://n8n.example.com" \
# ./scripts/prod-smoke.sh

BACKEND_URL="${BACKEND_URL:-}"
N8N_BASE_URL="${N8N_BASE_URL:-}"

if [[ -z "$BACKEND_URL" || -z "$N8N_BASE_URL" ]]; then
  echo "ERROR: BACKEND_URL and N8N_BASE_URL are required."
  echo "Example:"
  echo '  BACKEND_URL="https://backend.example.com" N8N_BASE_URL="https://n8n.example.com" bun run smoke:prod'
  exit 1
fi

normalize_url() {
  local value="$1"
  value="${value%/}"
  if [[ "$value" != http://* && "$value" != https://* ]]; then
    value="https://${value}"
  fi
  printf '%s' "$value"
}

BACKEND_URL="$(normalize_url "$BACKEND_URL")"
N8N_BASE_URL="$(normalize_url "$N8N_BASE_URL")"

tmpdir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmpdir"
}
trap cleanup EXIT

request() {
  local name="$1"
  local method="$2"
  local url="$3"
  local body="${4:-}"
  local headers_file="$tmpdir/${name}.headers"
  local body_file="$tmpdir/${name}.body"

  local args=(-sS -i -X "$method" "$url")
  if [[ -n "$body" ]]; then
    args+=(-H "content-type: application/json" -d "$body")
  fi

  if ! curl "${args[@]}" >"$headers_file" 2>"$body_file.err"; then
    echo "[$name] FAIL curl error"
    sed -n '1,3p' "$body_file.err"
    if grep -qi "Could not resolve host" "$body_file.err"; then
      echo "[$name] DIAG DNS failure. Check domain and platform networking."
    fi
    return 1
  fi

  awk 'BEGIN{status=""} /^HTTP/{status=$2} END{print status}' "$headers_file" >"$tmpdir/${name}.status"
  awk 'BEGIN{in_body=0} /^\r?$/{in_body=1;next} {if(in_body) print}' "$headers_file" >"$body_file"

  local status
  status="$(cat "$tmpdir/${name}.status")"
  echo "[$name] HTTP $status"
  sed -n '1,3p' "$body_file"

  if [[ "$status" == "404" ]] && grep -qi "webhook.*not registered" "$body_file"; then
    echo "[$name] DIAG webhook not registered/active in n8n production."
  fi
  if [[ "$status" == "502" ]] && grep -qi "Application failed to respond" "$body_file"; then
    echo "[$name] DIAG service up at edge but app not responding (startup/runtime failure)."
  fi
}

echo "== Production Smoke =="
echo "BACKEND_URL=$BACKEND_URL"
echo "N8N_BASE_URL=$N8N_BASE_URL"
echo

request "backend-health" "GET" "$BACKEND_URL/health"
request "backend-execute" "POST" "$BACKEND_URL/users/execute" '{}'
request "backend-clear" "POST" "$BACKEND_URL/users/clear" '{}'

request "n8n-ingest" "POST" "$N8N_BASE_URL/webhook/ingest-users" '{"users":[{"nome":"Smoke User","email":"smoke.user@example.com","phone":"+55 11 90000-0001"}]}'
request "n8n-list" "GET" "$N8N_BASE_URL/webhook/list-users"
request "n8n-clear" "POST" "$N8N_BASE_URL/webhook/clear-users" '{}'

echo
echo "Smoke finished."
