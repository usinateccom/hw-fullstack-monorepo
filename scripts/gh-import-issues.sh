#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/gh-import-issues.sh owner/repo
# Example:
#   ./scripts/gh-import-issues.sh youruser/hw-fullstack-monorepo

REPO="${1:-}"
if [[ -z "$REPO" ]]; then
  echo "ERROR: repo is required (owner/repo)"
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh not installed"
  exit 1
fi

gh auth status >/dev/null

if [[ ! -d ".github/issues" ]]; then
  echo "ERROR: .github/issues not found"
  exit 1
fi

shopt -s nullglob
FILES=(.github/issues/*.md)
if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "ERROR: no issue files found"
  exit 1
fi

for f in "${FILES[@]}"; do
  title="$(grep -m1 '^Title:' "$f" | sed 's/^Title:[ ]*//')"
  milestone="$(grep -m1 '^Milestone:' "$f" | sed 's/^Milestone:[ ]*//')"
  labels="$(grep -m1 '^Labels:' "$f" | sed 's/^Labels:[ ]*//')"

  if [[ -z "$title" || -z "$milestone" ]]; then
    echo "ERROR: missing Title/Milestone in $f"
    exit 1
  fi

  body_file="$(mktemp)"
  awk 'NR>3{print}' "$f" > "$body_file"

  echo "Creating: $title"

  cmd=(
    gh issue create
    --repo "$REPO"
    --title "$title"
    --body-file "$body_file"
    --milestone "$milestone"
  )

  if [[ -n "$labels" ]]; then
    IFS=',' read -r -a label_parts <<< "$labels"
    for label in "${label_parts[@]}"; do
      cleaned="$(echo "$label" | xargs)"
      [[ -n "$cleaned" ]] && cmd+=(--label "$cleaned")
    done
  fi

  "${cmd[@]}" >/dev/null
  rm -f "$body_file"
done

echo "Done."
