#!/bin/bash

# This script sets up local git repositories for generating update files
# It runs git_grepper.sh against multiple repositories and then runs the update generation
# Author: Based on repositories used by lazrossi's setup

# Load repository paths from config
CONFIG_PATH="$(dirname "$0")/config.json"
if [[ -f "$CONFIG_PATH" ]]; then
    MEETING_BAAS_PATH=$(jq -r '.repositories."meeting-baas"' "$CONFIG_PATH")
    SPEAKING_BOT_PATH=$(jq -r '.repositories."speaking-meeting-bot"' "$CONFIG_PATH")
    SDK_GENERATOR_PATH=$(jq -r '.repositories."sdk-generator"' "$CONFIG_PATH")
    MCP_VERCEL_PATH=$(jq -r '.repositories."mcp-on-vercel"' "$CONFIG_PATH")
    MCP_DOCS_PATH=$(jq -r '.repositories."mcp-on-vercel-documentation"' "$CONFIG_PATH")
    MCP_BAAS_PATH=$(jq -r '.repositories."mcp-baas"' "$CONFIG_PATH")
else
    echo "Error: config.json not found"
    exit 1
fi

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
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --with-diff --include-code --only-with-pr-mr --overwrite --days 7 --verbose
    echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
    echo "-------------------------------------------"
else
    echo -e "${YELLOW}Warning: Repository path not found: $REPO_PATH - skipping${NC}"
fi

# Speaking bots repository
REPO_PATH="$SPEAKING_BOT_PATH"
if [ -d "$REPO_PATH" ]; then
    REPO_NAME=$(basename "$REPO_PATH") 
    echo -e "${GREEN}Processing repository: $REPO_NAME${NC}"
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --with-diff --include-code --only-with-pr-mr --overwrite --days 7 --verbose
    echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
    echo "-------------------------------------------"
else
    echo -e "${YELLOW}Warning: Repository path not found: $REPO_PATH - skipping${NC}"
fi

# SDK generator repository
REPO_PATH="$SDK_GENERATOR_PATH"
if [ -d "$REPO_PATH" ]; then
    REPO_NAME=$(basename "$REPO_PATH")
    echo -e "${GREEN}Processing repository: $REPO_NAME${NC}"
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --with-diff --include-code --only-with-pr-mr --overwrite --days 7 --verbose
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
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --with-diff --include-code --only-with-pr-mr --overwrite --days 7 --verbose
    echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
    echo "-------------------------------------------"
else
    echo -e "${YELLOW}Warning: Repository path not found: $REPO_PATH - skipping${NC}"
fi

# MCP documentation repository
REPO_PATH="$MCP_DOCS_PATH"
if [ -d "$REPO_PATH" ]; then
    REPO_NAME=$(basename "$REPO_PATH")
    echo -e "${GREEN}Processing repository: $REPO_NAME${NC}"
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --with-diff --include-code --only-with-pr-mr --overwrite --days 7 --verbose
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
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" --with-diff --include-code --only-with-pr-mr --overwrite --days 7 --verbose
    echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
    echo "-------------------------------------------"
else
    echo -e "${YELLOW}Warning: Repository path not found: $REPO_PATH - skipping${NC}"
fi

# Return to the project root directory
cd ../../

# Generate the updates
echo -e "${BLUE}Generating updates from collected git diffs...${NC}"
cd /Users/lazmini/code/Meeting-Baas/docs
pnpm clean:git-updates

echo -e "${BLUE}Regenerating all updates...${NC}"
pnpm test:git-updates

echo -e "${GREEN}All repositories processed and updates generated!${NC}"
echo -e "${YELLOW}You can now run 'pnpm dev' to start the development server${NC}" 