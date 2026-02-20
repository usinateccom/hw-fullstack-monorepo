#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v bun >/dev/null 2>&1; then
  echo "bun is required" >&2
  exit 1
fi

if ! command -v bunx >/dev/null 2>&1; then
  echo "bunx is required" >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required" >&2
  exit 1
fi

N8N_USER_FOLDER="${N8N_USER_FOLDER:-/tmp/n8n-home}"
N8N_CONFIG_FILE="${N8N_USER_FOLDER}/.n8n/config"
if [[ -z "${N8N_ENCRYPTION_KEY:-}" && -f "$N8N_CONFIG_FILE" ]]; then
  N8N_ENCRYPTION_KEY="$(sed -n 's/.*"encryptionKey":[[:space:]]*"\([^"]*\)".*/\1/p' "$N8N_CONFIG_FILE" | head -n 1)"
fi
N8N_ENCRYPTION_KEY="${N8N_ENCRYPTION_KEY:-local-dev-key}"
N8N_PORT="${N8N_PORT:-5678}"
N8N_LISTEN_ADDRESS="${N8N_LISTEN_ADDRESS:-127.0.0.1}"
API_PORT="${API_PORT:-3001}"
VITE_PORT="${VITE_PORT:-5173}"
INCLUDE_N8N="${INCLUDE_N8N:-1}"
INCLUDE_BACKEND="${INCLUDE_BACKEND:-1}"
INCLUDE_FRONTEND="${INCLUDE_FRONTEND:-1}"
STARTUP_MAX_WAIT_SEC="${STARTUP_MAX_WAIT_SEC:-90}"
STARTUP_POLL_INTERVAL_SEC="${STARTUP_POLL_INTERVAL_SEC:-2}"
N8N_READY_URL="${N8N_READY_URL:-http://127.0.0.1:${N8N_PORT}}"
BACKEND_READY_URL="${BACKEND_READY_URL:-http://127.0.0.1:${API_PORT}/health}"
BACKEND_START_CMD="${BACKEND_START_CMD:-bun src/server.ts}"

mkdir -p "$N8N_USER_FOLDER"

cleanup() {
  if [[ -n "${N8N_PID:-}" ]]; then
    kill "$N8N_PID" 2>/dev/null || true
  fi
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

log() {
  printf "%s\n" "$*"
}

is_port_listening() {
  local port="$1"
  if (exec 3<>"/dev/tcp/127.0.0.1/${port}") >/dev/null 2>&1; then
    exec 3>&-
    return 0
  fi
  if command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
    return $?
  fi
  if command -v ss >/dev/null 2>&1; then
    ss -ltn "sport = :$port" | awk 'NR>1 {found=1} END {exit found ? 0 : 1}'
    return $?
  fi
  if command -v nc >/dev/null 2>&1; then
    nc -z 127.0.0.1 "$port" >/dev/null 2>&1
    return $?
  fi
  return 1
}

check_port_available() {
  local port="$1"
  if is_port_listening "$port"; then
    echo "Port $port is already in use. Set a different port or stop the process." >&2
    exit 1
  fi
}

is_pid_alive() {
  local pid="$1"
  kill -0 "$pid" >/dev/null 2>&1
}

wait_for_http_ready() {
  local name="$1"
  local url="$2"
  local pid="$3"
  local accepted_regex="$4"
  local waited=0

  log "[readiness] waiting for ${name}: ${url} (timeout ${STARTUP_MAX_WAIT_SEC}s)"

  while (( waited < STARTUP_MAX_WAIT_SEC )); do
    if ! is_pid_alive "$pid"; then
      log "[readiness] ${name} process exited before becoming ready."
      return 1
    fi

    local status
    status="$(curl -sS -o /dev/null -w "%{http_code}" "$url" || true)"
    if [[ "$status" =~ $accepted_regex ]]; then
      log "[readiness] ${name} ready (HTTP ${status}) after ${waited}s."
      return 0
    fi

    sleep "$STARTUP_POLL_INTERVAL_SEC"
    waited=$((waited + STARTUP_POLL_INTERVAL_SEC))
  done

  log "[readiness] timeout waiting for ${name} at ${url}."
  log "[readiness] hint: verify env vars, logs, and whether the service can bind the configured port."
  return 1
}

if [[ "$INCLUDE_FRONTEND" -eq 1 ]]; then
  # Prefer a compatible nvm Node automatically when available.
  if command -v node >/dev/null 2>&1; then
    CURRENT_NODE="$(node -v 2>/dev/null || true)"
  else
    CURRENT_NODE=""
  fi
  if [[ "$CURRENT_NODE" =~ ^v22\.11\..* ]] && [[ -x "$HOME/.nvm/versions/node/v22.12.0/bin/node" ]]; then
    export PATH="$HOME/.nvm/versions/node/v22.12.0/bin:$PATH"
  fi

  NODE_VERSION="$(node -v 2>/dev/null || true)"
  if [[ -n "$NODE_VERSION" ]]; then
    NODE_MAJOR="$(echo "$NODE_VERSION" | sed 's/^v//' | cut -d. -f1)"
    NODE_MINOR="$(echo "$NODE_VERSION" | sed 's/^v//' | cut -d. -f2)"
    if [[ "$NODE_MAJOR" -lt 20 ]]; then
      echo "Node >= 20.19 or 22.12 is required for frontend/Vite (found $NODE_VERSION)." >&2
      echo "Tip: nvm install 22.12.0 && nvm use 22.12.0" >&2
      exit 1
    fi
    if [[ "$NODE_MAJOR" -eq 20 && "$NODE_MINOR" -lt 19 ]]; then
      echo "Node >= 20.19 is required for frontend/Vite (found $NODE_VERSION)." >&2
      echo "Tip: nvm install 20.19.0 && nvm use 20.19.0" >&2
      exit 1
    fi
    if [[ "$NODE_MAJOR" -eq 22 && "$NODE_MINOR" -lt 12 ]]; then
      echo "Node >= 22.12 is required for frontend/Vite (found $NODE_VERSION)." >&2
      echo "Tip: nvm install 22.12.0 && nvm use 22.12.0" >&2
      echo "Alternative: INCLUDE_FRONTEND=0 bun run start:all" >&2
      exit 1
    fi
  fi
fi

if [[ "$INCLUDE_N8N" -eq 1 ]]; then
  check_port_available "$N8N_PORT"
fi
if [[ "$INCLUDE_BACKEND" -eq 1 ]]; then
  check_port_available "$API_PORT"
fi
if [[ "$INCLUDE_FRONTEND" -eq 1 ]]; then
  check_port_available "$VITE_PORT"
fi

if [[ "$INCLUDE_N8N" -eq 1 ]]; then
  log "[stage 1/3] Starting n8n..."
  (
    cd "$ROOT_DIR"
    exec env \
      N8N_USER_FOLDER="$N8N_USER_FOLDER" \
      N8N_ENCRYPTION_KEY="$N8N_ENCRYPTION_KEY" \
      N8N_PORT="$N8N_PORT" \
      N8N_LISTEN_ADDRESS="$N8N_LISTEN_ADDRESS" \
      N8N_HOST=localhost \
      N8N_PROTOCOL=http \
      N8N_DIAGNOSTICS_ENABLED=false \
      N8N_LOG_LEVEL=info \
      bunx n8n start
  ) &
  N8N_PID=$!
  if ! wait_for_http_ready "n8n" "$N8N_READY_URL" "$N8N_PID" '^[234][0-9][0-9]$'; then
    log "n8n failed readiness check. Exiting."
    exit 1
  fi
else
  log "[stage 1/3] Skipping n8n (INCLUDE_N8N=0)."
fi

if [[ "$INCLUDE_BACKEND" -eq 1 ]]; then
  log "[stage 2/3] Starting backend..."
  (
    cd "$ROOT_DIR/packages/backend/api"
    exec bash -lc "$BACKEND_START_CMD"
  ) &
  BACKEND_PID=$!
  if ! wait_for_http_ready "backend" "$BACKEND_READY_URL" "$BACKEND_PID" '^2[0-9][0-9]$'; then
    log "backend failed readiness check. Exiting."
    exit 1
  fi
else
  log "[stage 2/3] Skipping backend (INCLUDE_BACKEND=0)."
fi

if [[ "$INCLUDE_FRONTEND" -eq 1 ]]; then
  log "[stage 3/3] Starting frontend..."
  (
    cd "$ROOT_DIR/packages/frontend/web"
    exec bun run dev
  ) &
  FRONTEND_PID=$!
else
  log "[stage 3/3] Skipping frontend (INCLUDE_FRONTEND=0)."
fi

log "All enabled services started in dependency order. Press Ctrl+C to stop."

PIDS=()
if [[ -n "${N8N_PID:-}" ]]; then PIDS+=("$N8N_PID"); fi
if [[ -n "${BACKEND_PID:-}" ]]; then PIDS+=("$BACKEND_PID"); fi
if [[ -n "${FRONTEND_PID:-}" ]]; then PIDS+=("$FRONTEND_PID"); fi

wait -n "${PIDS[@]}"
log "A service exited. Shutting down all."
exit 1
