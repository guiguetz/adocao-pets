#!/bin/bash

# worktree-down.sh - Removes a worktree after story completion
#
# Usage:
#   ./tools/worktree-down.sh <story-id>
#
# This script:
# 1. Removes the Neon database branch
# 2. Removes the git worktree
# 3. Prints cleanup instructions

set -e

STORY_ID=$1

if [ -z "$STORY_ID" ]; then
  echo "Usage: $0 <story-id>"
  exit 1
fi

WORKTREE_DIR="../${STORY_ID}"

if [ ! -d "$WORKTREE_DIR" ]; then
  echo "Worktree not found: $WORKTREE_DIR"
  exit 1
fi

echo "Removing worktree for story: $STORY_ID"

# Remove Neon database branch (if neonctl is available)
if command -v neonctl &> /dev/null; then
  echo "Removing Neon database branch..."
  NEON_BRANCH="preview/${STORY_ID}"
  neonctl branches delete "$NEON_BRANCH" --force
  echo "Removed Neon branch: $NEON_BRANCH"
else
  echo "neonctl not found, skipping database branch removal"
  echo "Please remove the Neon branch manually: preview/${STORY_ID}"
fi

# Remove the worktree
echo "Removing git worktree..."
git worktree remove "$WORKTREE_DIR" --force

echo ""
echo "Worktree removed successfully!"
echo ""
echo "Cleanup instructions:"
echo "  1. Delete the local branch: git branch -D feat/${STORY_ID}-*"
echo "  2. Delete the remote branch: git push origin --delete feat/${STORY_ID}-*"
echo "  3. Remove the Neon branch (if not done automatically)"