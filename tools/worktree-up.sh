#!/bin/bash

# worktree-up.sh - Creates a worktree for parallel story development
#
# Usage:
#   ./tools/worktree-up.sh <story-id>
#
# This script:
# 1. Creates a new branch for the story
# 2. Creates a worktree for the branch
# 3. Creates a Neon database branch
# 4. Writes .env.local with the new connection
# 5. Opens a new tmux window

set -e

STORY_ID=$1

if [ -z "$STORY_ID" ]; then
  echo "Usage: $0 <story-id>"
  exit 1
fi

# Validate story ID format
if [[ ! "$STORY_ID" =~ ^e[0-9]+s[0-9]+$ ]]; then
  echo "Invalid story ID format: $STORY_ID"
  echo "Expected format: eNNsNN (e.g., e1s1, e10s2)"
  exit 1
fi

# Get the story title from the epic file
EPIC_FILE="specs/epics/${STORY_ID}.md"
if [ ! -f "$EPIC_FILE" ]; then
  echo "Epic file not found: $EPIC_FILE"
  exit 1
fi

# Extract title from the epic file
TITLE=$(grep "^# " "$EPIC_FILE" | head -1 | sed 's/^# //')
if [ -z "$TITLE" ]; then
  TITLE="Story $STORY_ID"
fi

# Create branch name
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--+/-/g' | sed 's/^-//' | sed 's/-$//')
BRANCH_NAME="feat/${STORY_ID}-${SLUG}"

echo "Creating worktree for story: $STORY_ID"
echo "Branch: $BRANCH_NAME"

# Create the branch and worktree
git worktree add "../${STORY_ID}" -b "$BRANCH_NAME"

# Create Neon database branch (if neonctl is available)
if command -v neonctl &> /dev/null; then
  echo "Creating Neon database branch..."
  NEON_BRANCH="preview/${STORY_ID}"
  neonctl branches create --name "$NEON_BRANCH"
  
  # Get the connection string
  CONNECTION_STRING=$(neonctl connection-string --branch "$NEON_BRANCH")
  
  # Write .env.local
  cat > "../${STORY_ID}/.env.local" << EOF
DATABASE_URL="${CONNECTION_STRING}"
AUTH_SECRET="dev-secret-${STORY_ID}"
AUTH_GOOGLE_ID="test-google-id"
AUTH_GOOGLE_SECRET="test-google-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_TEST_MODE="true"
EOF
  
  echo "Created .env.local with Neon branch: $NEON_BRANCH"
else
  echo "neonctl not found, skipping database branch creation"
  echo "Please create .env.local manually in the worktree"
fi

# Create tmux window
if command -v tmux &> /dev/null; then
  echo "Opening tmux window..."
  tmux new-window -n "$STORY_ID" "cd ../${STORY_ID} && echo 'Worktree ready for $STORY_ID' && bash"
else
  echo "tmux not found, please open a new terminal for the worktree"
fi

echo ""
echo "Worktree created successfully!"
echo "Location: ../${STORY_ID}"
echo "Branch: $BRANCH_NAME"
echo ""
echo "Next steps:"
echo "  cd ../${STORY_ID}"
echo "  pnpm install"
echo "  pnpm verify"