#!/bin/bash
# Move to project root
cd "$(dirname "$0")/.."

# Find nub or node
if [ -x "$(command -v nub)" ]; then
    RUN_CMD="nub"
elif [ -x "$HOME/.nub/bin/nub" ]; then
    RUN_CMD="$HOME/.nub/bin/nub"
elif [ -x "$(command -v node)" ]; then
    RUN_CMD="node"
else
    RUN_CMD=""
fi

if [ -z "$RUN_CMD" ]; then
    echo "Error starting launcher. Make sure Node.js or nub is installed."
    read -p "Press enter to exit"
    exit 1
fi

echo "Building the application..."
if [ "$RUN_CMD" = "nub" ] || [ "$RUN_CMD" = "$HOME/.nub/bin/nub" ]; then
    $RUN_CMD run build
else
    npm run build
fi

if [ $? -ne 0 ]; then
    echo "Error building the application."
    read -p "Press enter to exit"
    exit 1
fi

echo "Starting Project Dashboard in Build/Production Mode..."
$RUN_CMD scripts/launcher.mjs --prod
if [ $? -ne 0 ]; then
    echo "Error starting launcher."
    read -p "Press enter to exit"
fi
