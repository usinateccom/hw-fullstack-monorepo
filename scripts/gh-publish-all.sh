#!/usr/bin/env bash
set -euo pipefail

# Publishes all local branches and creates missing PRs for feature/release flows.

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh is not installed"
  exit 1
fi

gh auth status >/dev/null

echo "==> Pushing all branches with force-with-lease"
git push --force-with-lease origin --all

echo "==> Ensuring base branches are up"
git push --force-with-lease origin develop
git push --force-with-lease origin main

create_pr_if_missing() {
  local head="$1"
  local base="$2"
  local title="$3"
  local body="$4"

  if gh pr list --state all --head "$head" --base "$base" --json number --jq 'length > 0' | grep -q true; then
    echo "PR already exists for $head -> $base"
    return 0
  fi

  echo "Creating PR: $head -> $base"
  gh pr create --base "$base" --head "$head" --title "$title" --body "$body"
}

# Feature -> develop PRs
create_pr_if_missing "feature/M0-03-gh-import-issues" "develop" \
  "chore(github): add issue import script and full milestone backlog" \
  "Scope: M0-03\nIncludes import script and issue backlog files."

create_pr_if_missing "feature/M1-03-users-sql-schema" "develop" \
  "feat(infra): add required users schema and db evidence" \
  "Scope: M1-03\nAdds exact users schema and DB evidence."

create_pr_if_missing "feature/M1-04-n8n-workflows" "develop" \
  "feat(workflows): add n8n ingest/list/clear exports and docs" \
  "Scope: M1-04\nAdds exported workflows and import documentation."

create_pr_if_missing "feature/M2-01-fastify-bun-skeleton" "develop" \
  "feat(backend): create fastify bun skeleton with health endpoint" \
  "Scope: M2-01\nBackend app skeleton with DDD-ish structure and /health."

create_pr_if_missing "feature/M2-02-aes-gcm-decrypt" "develop" \
  "feat(backend): implement aes-256-gcm decryptor and secure endpoint client" \
  "Scope: M2-02\nCrypto decryptor + secure endpoint client + tests."

create_pr_if_missing "feature/M2-03-n8n-forward-ingest" "develop" \
  "feat(backend): add users execute/clear orchestration with n8n retries" \
  "Scope: M2-03\nAdds /users/execute and /users/clear with timeout/retry and error envelope."

create_pr_if_missing "feature/M2-04-japa-tests" "develop" \
  "test(backend): add m2-04 api route contracts and japa bootstrap" \
  "Scope: M2-04\nAdds deterministic route contracts + Japa bootstrap placeholder."

create_pr_if_missing "feature/M3-01-react-ui-table" "develop" \
  "feat(frontend): add responsive react table UI with dynamic execute/clear" \
  "Scope: M3-01\nResponsive table UI and dynamic updates without reload."

create_pr_if_missing "feature/M3-02-frontend-api" "develop" \
  "feat(frontend): integrate execute and clear actions with backend api" \
  "Scope: M3-02\nWires frontend actions to backend endpoints."

create_pr_if_missing "feature/M3-03-jest-tests" "develop" \
  "test(frontend): add state transition tests and jest bootstrap placeholder" \
  "Scope: M3-03\nAdds frontend deterministic state tests and Jest bootstrap placeholder."

create_pr_if_missing "feature/M4-01-deploy-backend" "develop" \
  "docs(deploy): add backend deployment guide and evidence checklist" \
  "Scope: M4-01\nBackend deployment docs and evidence scaffolding."

create_pr_if_missing "feature/M4-02-deploy-frontend" "develop" \
  "docs(deploy): document frontend deployment and runtime api config" \
  "Scope: M4-02\nFrontend deployment docs and runtime API config strategy."

create_pr_if_missing "feature/M4-03-evidence-pack" "develop" \
  "docs(project): finalize setup guide, readme and m4 evidence pack" \
  "Scope: M4-03\nFinal docs/evidence pack updates."

create_pr_if_missing "feature/M5-01-rag-cli" "develop" \
  "feat(tooling): implement local rag index and search cli" \
  "Scope: M5-01\nImplements local docs index/search tooling."

create_pr_if_missing "feature/M5-02-rag-workflow-doc" "develop" \
  "docs(agentic): require rag search before coding each issue" \
  "Scope: M5-02\nUpdates AGENTS workflow and adds agentic workflow docs."

# Release -> main PRs
create_pr_if_missing "release/m2" "main" \
  "chore(release): m2" \
  "Release M2: backend crypto/orchestration milestone."

create_pr_if_missing "release/m3" "main" \
  "chore(release): m3" \
  "Release M3: frontend UX and integration milestone."

create_pr_if_missing "release/m4" "main" \
  "chore(release): m4" \
  "Release M4: deploy and evidence pack milestone."

create_pr_if_missing "release/m5" "main" \
  "chore(release): m5" \
  "Release M5: local RAG and agentic workflow docs milestone."

echo "Done."
