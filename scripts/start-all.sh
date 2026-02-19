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
N8N_ENCRYPTION_KEY="${N8N_ENCRYPTION_KEY:-local-dev-key}"
N8N_PORT="${N8N_PORT:-5678}"
N8N_LISTEN_ADDRESS="${N8N_LISTEN_ADDRESS:-127.0.0.1}"

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

log "Starting n8n..."
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

log "Starting backend..."
(
  cd "$ROOT_DIR/packages/backend/api"
  exec bun run dev
) &
BACKEND_PID=$!

log "Starting frontend..."
(
  cd "$ROOT_DIR/packages/frontend/web"
  exec bun run dev
) &
FRONTEND_PID=$!

log "All services started. Press Ctrl+C to stop."

wait -n "$N8N_PID" "$BACKEND_PID" "$FRONTEND_PID"
log "A service exited. Shutting down all."
exit 1
