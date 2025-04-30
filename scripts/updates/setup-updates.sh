#!/bin/bash

# Set the directory to the script's directory
cd "$(dirname "$0")"
cd ../..

# Run the clean command first
echo "Cleaning git updates..."
pnpm clean:git-updates

# Then run the git updates generation
echo "Generating git updates..."
pnpm test:git-updates

echo "Updates setup complete!" 