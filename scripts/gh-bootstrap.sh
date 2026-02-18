#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/gh-bootstrap.sh <repo-name> [public|private]
# Example:
#   ./scripts/gh-bootstrap.sh hw-fullstack-monorepo public

REPO_NAME="${1:-}"
VISIBILITY="${2:-private}"

if [[ -z "$REPO_NAME" ]]; then
  echo "ERROR: repo name is required"
  echo "Usage: ./scripts/gh-bootstrap.sh <repo-name> [public|private]"
  exit 1
fi

if [[ "$VISIBILITY" != "public" && "$VISIBILITY" != "private" ]]; then
  echo "ERROR: visibility must be public or private"
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: GitHub CLI (gh) is not installed."
  exit 1
fi

echo "==> Checking gh authentication..."
gh auth status >/dev/null

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: You must run this inside a git repository."
  exit 1
fi

DEFAULT_BRANCH="main"

echo "==> Creating GitHub repository: $REPO_NAME ($VISIBILITY)"
gh repo create "$REPO_NAME" --"$VISIBILITY" --source=. --remote=origin --push

echo "==> Ensuring default branch is '$DEFAULT_BRANCH'"
gh repo edit "$REPO_NAME" --default-branch "$DEFAULT_BRANCH" >/dev/null 2>&1 || true

FULL_REPO="$(gh repo view --json owner,name -q '.owner.login + "/" + .name')"
echo "==> Repo: $FULL_REPO"

echo "==> Creating labels..."
declare -a LABELS=(
  "epic|Epics|6f42c1"
  "backend|Backend|1f77b4"
  "frontend|Frontend|ff7f0e"
  "infra|Infra|2ca02c"
  "workflows|n8n Workflows|17becf"
  "docs|Documentation|9467bd"
  "testing|Tests|d62728"
  "rag|RAG/Docs Search|8c564b"
  "deploy|Deployment|bcbd22"
  "security|Security|e377c2"
  "chore|Chores|7f7f7f"
)

for item in "${LABELS[@]}"; do
  IFS="|" read -r name desc color <<< "$item"
  gh label create "$name" --repo "$FULL_REPO" --description "$desc" --color "$color" --force >/dev/null 2>&1 || true
done

echo "==> Creating milestones..."
declare -a MILESTONES=(
  "M0 - Bootstrap & Standards"
  "M1 - Local Infra + n8n/Postgres"
  "M2 - Crypto + Backend Use Cases"
  "M3 - Frontend UX + Integration"
  "M4 - Deploy + Evidence Pack"
  "M5 - Bonus RAG-ready Docs Search"
)

for ms in "${MILESTONES[@]}"; do
  existing="$(gh api "repos/$FULL_REPO/milestones" --paginate -q ".[] | select(.title==\"$ms\") | .number" | head -n 1 || true)"
  if [[ -z "$existing" ]]; then
    gh api "repos/$FULL_REPO/milestones" -f title="$ms" >/dev/null
  fi
done

if [[ ! -d ".github/issues" ]]; then
  echo "ERROR: .github/issues folder not found. Create issue markdown files first."
  exit 1
fi

echo "==> Creating issues from .github/issues/*.md"
shopt -s nullglob
FILES=(.github/issues/*.md)

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "ERROR: No issue files found in .github/issues/"
  exit 1
fi

for f in "${FILES[@]}"; do
  title="$(grep -m1 '^Title:' "$f" | sed 's/^Title:[ ]*//')"
  milestone="$(grep -m1 '^Milestone:' "$f" | sed 's/^Milestone:[ ]*//')"
  labels="$(grep -m1 '^Labels:' "$f" | sed 's/^Labels:[ ]*//')"

  if [[ -z "$title" || -z "$milestone" ]]; then
    echo "ERROR: Missing Title or Milestone in $f"
    exit 1
  fi

  body_file="$(mktemp)"
  awk 'NR>3{print}' "$f" > "$body_file"

  echo "  -> Creating issue: $title"
  gh issue create         --repo "$FULL_REPO"         --title "$title"         --body-file "$body_file"         --milestone "$milestone"         ${labels:+--label "$labels"}         >/dev/null

  rm -f "$body_file"
done

echo "==> Done."
echo "Repo created with labels, milestones, and issues."
