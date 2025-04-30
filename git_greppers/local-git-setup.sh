#!/bin/bash

# This script sets up local git repositories for generating update files
# It runs git_grepper.sh against multiple repositories and then runs the update generation
# Author: Based on repositories used by lazrossi's setup


# REPLACE THESE PATHS WITH YOURS THANKS

# Define repository paths
MEETING_BAAS_PATH="/Users/lazrossi/Spoke/meeting-baas"
SPEAKING_BOT_PATH="/Users/lazrossi/Spoke/speaking-meeting-bot"
SDK_GENERATOR_PATH="/Users/lazrossi/Documents/code/mcp-s/sdk-generator"
MCP_VERCEL_PATH="/Users/lazrossi/Documents/code/mcp-s/mcp-on-vercel"
MCP_DOCS_PATH="/Users/lazrossi/Documents/code/mcp-s/mcp-on-vercel-documentation"
MCP_BAAS_PATH="/Users/lazrossi/Documents/code/mcp-baas"

# Get the directory of this script
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
cd "$SCRIPT_DIR"

# Set debug level (1 for normal, 2 for verbose, 3 for very verbose)
DEBUG_LEVEL=1

# Color codes for better output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git_grepper.sh exists
if [ ! -f "$SCRIPT_DIR/git_grepper.sh" ]; then
    echo -e "${RED}Error: git_grepper.sh not found in $SCRIPT_DIR${NC}"
    exit 1
fi

# Make sure git_grepper.sh is executable
chmod +x "$SCRIPT_DIR/git_grepper.sh"

# Process each repository with custom flags
echo -e "${BLUE}Starting git diff generation for all repositories...${NC}"

# Main API repository
REPO_PATH="$MEETING_BAAS_PATH"
if [ -d "$REPO_PATH" ]; then
    REPO_NAME=$(basename "$REPO_PATH")
    echo -e "${GREEN}Processing repository: $REPO_NAME${NC}"
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --no-diff --only-with-pr-mr
    echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
    echo "-------------------------------------------"
else
    echo -e "${YELLOW}Warning: Repository path not found: $REPO_PATH - skipping${NC}"
fi

# Speaking bots repository - with diffs
REPO_PATH="$SPEAKING_BOT_PATH"
if [ -d "$REPO_PATH" ]; then
    REPO_NAME=$(basename "$REPO_PATH") 
    echo -e "${GREEN}Processing repository: $REPO_NAME${NC}"
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --with-diff --include-code --only-with-pr-mr
    echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
    echo "-------------------------------------------"
else
    echo -e "${YELLOW}Warning: Repository path not found: $REPO_PATH - skipping${NC}"
fi

# SDK generator repository - with diffs
REPO_PATH="$SDK_GENERATOR_PATH"
if [ -d "$REPO_PATH" ]; then
    REPO_NAME=$(basename "$REPO_PATH")
    echo -e "${GREEN}Processing repository: $REPO_NAME${NC}"
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --with-diff --include-code --only-with-pr-mr
    echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
    echo "-------------------------------------------"
else
    echo -e "${YELLOW}Warning: Repository path not found: $REPO_PATH - skipping${NC}"
fi

# MCP server repository
REPO_PATH="$MCP_VERCEL_PATH"
if [ -d "$REPO_PATH" ]; then
    REPO_NAME=$(basename "$REPO_PATH")
    echo -e "${GREEN}Processing repository: $REPO_NAME${NC}"
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --no-diff --only-with-pr-mr
    echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
    echo "-------------------------------------------"
else
    echo -e "${YELLOW}Warning: Repository path not found: $REPO_PATH - skipping${NC}"
fi

# MCP documentation repository - with diffs
REPO_PATH="$MCP_DOCS_PATH"
if [ -d "$REPO_PATH" ]; then
    REPO_NAME=$(basename "$REPO_PATH")
    echo -e "${GREEN}Processing repository: $REPO_NAME${NC}"
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --with-diff --include-code --only-with-pr-mr
    echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
    echo "-------------------------------------------"
else
    echo -e "${YELLOW}Warning: Repository path not found: $REPO_PATH - skipping${NC}"
fi

# MCP BaaS repository
REPO_PATH="$MCP_BAAS_PATH"
if [ -d "$REPO_PATH" ]; then
    REPO_NAME=$(basename "$REPO_PATH") 
    echo -e "${GREEN}Processing repository: $REPO_NAME${NC}"
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --no-diff --only-with-pr-mr
    echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
    echo "-------------------------------------------"
else
    echo -e "${YELLOW}Warning: Repository path not found: $REPO_PATH - skipping${NC}"
fi

# Return to the project root directory
cd ../../

# Generate the updates
echo -e "${BLUE}Generating updates from collected git diffs...${NC}"
pnpm clean:git-updates

echo -e "${BLUE}Regenerating all updates...${NC}"
pnpm test:git-updates

echo -e "${GREEN}All repositories processed and updates generated!${NC}"
echo -e "${YELLOW}You can now run 'pnpm dev' to start the development server${NC}" 