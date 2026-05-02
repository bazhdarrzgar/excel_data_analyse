#!/bin/bash

# Move to project root
cd "$(dirname "$0")/.."

# Clear screen for a clean look
clear

echo "===================================================="
echo "   🚀 Project Requirements Installer (Linux)   "
echo "===================================================="
echo ""

# Check if Node.js, npm, and node_modules exist
NODE_EXIST=$(command -v node)
NPM_EXIST=$(command -v npm)
MODULES_EXIST=[ -d "node_modules" ]

if [ -x "$NODE_EXIST" ] && [ -x "$NPM_EXIST" ] && [ -d "node_modules" ]; then
    echo "✨ Requirements is already exist and up to date for running it in linux."
    echo ""
    echo "You can start the project by running: ./Run/launcher.sh"
    exit 0
fi

# If node is missing
if ! [ -x "$NODE_EXIST" ]; then
    echo "📦 Node.js not found. Installing Node.js..."
    # Using NodeSource for LTS version
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js is already installed: $(node -v)"
fi

# If npm is missing (though usually comes with node)
if ! [ -x "$NPM_EXIST" ]; then
    echo "📦 npm not found. Installing npm..."
    sudo apt-get install -y npm
else
    echo "✅ npm is already installed: $(npm -v)"
fi

# Install node modules if missing or if node/npm were just installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing node modules... This may take a minute."
    npm install
    echo "✅ Node modules installed successfully."
else
    echo "✅ Node modules are already present."
fi

echo ""
echo "✨ Requirements is already exist and up to date for running it in linux."
echo "===================================================="
echo "🚀 You're all set! Run ./Run/launcher.sh to start the app."
