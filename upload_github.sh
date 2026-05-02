#!/bin/bash

# Check if a commit message was provided
COMMIT_MSG=$1
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="update: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo "🚀 Starting upload to GitHub..."

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
