#!/bin/bash

# check-branch.sh - Validates branch name and commit messages
# Used in pre-push hook

set -e

# Get current branch name
BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse --abbrev-ref HEAD)

# Check if branch is main
if [ "$BRANCH" = "main" ]; then
  echo "❌ Cannot push directly to main"
  exit 1
fi

# Check branch name format: <type>/<number>-<slug>
if ! echo "$BRANCH" | grep -qE "^(feat|fix|chore|docs|refactor|test|ci|perf)/[0-9]+-[a-z0-9-]+$"; then
  echo "❌ Branch name '$BRANCH' does not match pattern: <type>/<number>-<slug>"
  echo "   Example: feat/123-add-login"
  exit 1
fi

# Check if .env or secret files are staged
if git diff --cached --name-only | grep -qE "\.(env|pem|key|secret)$"; then
  echo "❌ Secret files detected in staging"
  exit 1
fi

# Validate commit messages with commitlint
echo "Validating commit messages..."
npx commitlint --from HEAD~1 --to HEAD --verbose

echo "✅ Branch validation passed"