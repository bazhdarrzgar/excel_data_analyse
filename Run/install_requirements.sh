#!/bin/bash

# Move to project root
cd "$(dirname "$0")/.."

# Clear screen for a clean look
clear

echo "===================================================="
echo "   🚀 Project Requirements Installer (Linux)   "
echo "===================================================="
echo ""

# Check if Node.js, nub, and node_modules exist
NODE_EXIST=$(command -v node)

if [ -x "$(command -v nub)" ]; then
    NUB_EXIST="nub"
elif [ -x "$HOME/.nub/bin/nub" ]; then
    NUB_EXIST="$HOME/.nub/bin/nub"
else
    NUB_EXIST=""
fi

if [ -x "$NODE_EXIST" ] && [ -n "$NUB_EXIST" ] && [ -d "node_modules" ]; then
    echo "✨ Requirements already exist and are up to date for running in Linux."
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
    NODE_EXIST=$(command -v node)
else
    echo "✅ Node.js is already installed: $(node -v)"
fi

# If nub is missing
if [ -z "$NUB_EXIST" ]; then
    echo "📦 nub not found. Installing nub..."
    curl -fsSL https://nubjs.com/install.sh | bash
    if [ -x "$HOME/.nub/bin/nub" ]; then
        NUB_EXIST="$HOME/.nub/bin/nub"
        export PATH="$HOME/.nub/bin:$PATH"
    else
        # Try installing via npm as fallback if npm is available
        if [ -x "$(command -v npm)" ]; then
            echo "Attempting to install nub via npm..."
            sudo npm install -g --ignore-scripts=false @nubjs/nub
            if [ -x "$(command -v nub)" ]; then
                NUB_EXIST="nub"
            fi
        fi
    fi
    
    if [ -z "$NUB_EXIST" ]; then
        echo "❌ nub installation failed. Please install nub manually: https://nubjs.com/"
        exit 1
    fi
    echo "✅ nub installed successfully."
else
    echo "✅ nub is already installed: $($NUB_EXIST --version 2>/dev/null || echo 'present')"
fi

# Install node modules if missing
if [ ! -d "node_modules" ]; then
    echo "📦 Installing node modules... This may take a minute."
    $NUB_EXIST install
    echo "✅ Node modules installed successfully."
else
    echo "✅ Node modules are already present."
fi

echo ""
echo "✨ Requirements is already exist and up to date for running it in linux."
echo "===================================================="
echo "🚀 You're all set! Run ./Run/launcher.sh to start the app."
