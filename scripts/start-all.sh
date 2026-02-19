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

N8N_USER_FOLDER="${N8N_USER_FOLDER:-/tmp/n8n-home}"
N8N_CONFIG_FILE="${N8N_USER_FOLDER}/.n8n/config"
if [[ -z "${N8N_ENCRYPTION_KEY:-}" && -f "$N8N_CONFIG_FILE" ]]; then
  N8N_ENCRYPTION_KEY="$(sed -n 's/.*"encryptionKey":[[:space:]]*"\([^"]*\)".*/\1/p' "$N8N_CONFIG_FILE" | head -n 1)"
fi
N8N_ENCRYPTION_KEY="${N8N_ENCRYPTION_KEY:-local-dev-key}"
N8N_PORT="${N8N_PORT:-5678}"
N8N_LISTEN_ADDRESS="${N8N_LISTEN_ADDRESS:-127.0.0.1}"
INCLUDE_N8N="${INCLUDE_N8N:-1}"
INCLUDE_BACKEND="${INCLUDE_BACKEND:-1}"
INCLUDE_FRONTEND="${INCLUDE_FRONTEND:-1}"

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
  if command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
    return $?
  fi
  if command -v ss >/dev/null 2>&1; then
    ss -ltn "sport = :$port" | awk 'NR>1{exit 0} END{exit 1}'
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
  check_port_available "${API_PORT:-3001}"
fi
if [[ "$INCLUDE_FRONTEND" -eq 1 ]]; then
  check_port_available "${VITE_PORT:-5173}"
fi

log "Starting n8n..."
if [[ "$INCLUDE_N8N" -eq 1 ]]; then
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
else
  log "Skipping n8n (INCLUDE_N8N=0)."
fi

log "Starting backend..."
if [[ "$INCLUDE_BACKEND" -eq 1 ]]; then
  (
    cd "$ROOT_DIR/packages/backend/api"
    exec bun run dev
  ) &
  BACKEND_PID=$!
else
  log "Skipping backend (INCLUDE_BACKEND=0)."
fi

log "Starting frontend..."
if [[ "$INCLUDE_FRONTEND" -eq 1 ]]; then
  (
    cd "$ROOT_DIR/packages/frontend/web"
    exec bun run dev
  ) &
  FRONTEND_PID=$!
else
  log "Skipping frontend (INCLUDE_FRONTEND=0)."
fi

log "All services started. Press Ctrl+C to stop."

PIDS=()
if [[ -n "${N8N_PID:-}" ]]; then PIDS+=("$N8N_PID"); fi
if [[ -n "${BACKEND_PID:-}" ]]; then PIDS+=("$BACKEND_PID"); fi
if [[ -n "${FRONTEND_PID:-}" ]]; then PIDS+=("$FRONTEND_PID"); fi

wait -n "${PIDS[@]}"
log "A service exited. Shutting down all."
exit 1
