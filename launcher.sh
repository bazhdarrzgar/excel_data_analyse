#!/bin/bash
echo "Starting Project Dashboard..."
node scripts/launcher.mjs
if [ $? -ne 0 ]; then
    echo "Error starting launcher. Make sure Node.js is installed."
    read -p "Press enter to exit"
fi
