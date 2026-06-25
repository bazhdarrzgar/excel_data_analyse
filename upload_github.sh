#!/bin/bash

# Move to project root
cd "$(dirname "$0")"

echo "🚀 Starting upload to GitHub..."
echo ""

# Show changed files
echo "🔍 Changed files:"
git status -s
echo ""

# Check if there are any changes
if [ -z "$(git status --porcelain)" ]; then
    echo "✨ No changes to commit. Everything is up to date."
    exit 0
fi

# Ask for commit message
COMMIT_MSG=$1
if [ -z "$COMMIT_MSG" ]; then
    read -p "💬 Enter commit message [Default: update: $(date '+%Y-%m-%d %H:%M:%S')]: " USER_MSG
    if [ -z "$USER_MSG" ]; then
        COMMIT_MSG="update: $(date '+%Y-%m-%d %H:%M:%S')"
    else
        COMMIT_MSG="$USER_MSG"
    fi
fi

# Add all changes
echo "➕ Staging changes..."
git add .

# Commit changes
echo "💾 Committing changes with message: '$COMMIT_MSG'..."
git commit -m "$COMMIT_MSG"

# Push changes
echo "📤 Pushing to GitHub..."
git push

echo "✅ Done! Changes uploaded successfully."
