#!/bin/bash

# This script sets up local git repositories for generating update files
# It runs git_grepper.sh against multiple repositories and then runs the update generation
# Author: Based on repositories used by lazrossi's setup

# Get the directory of this script
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
cd "$SCRIPT_DIR"

# Set default flags for git_grepper.sh
FLAGS="--no-diff --only-with-pr-mr"

# Set debug level (1 for normal, 2 for verbose, 3 for very verbose)
DEBUG_LEVEL=1

# Define repositories to process
# Format: "path_to_repo name_for_output"
REPOSITORIES=(
  # Main API repository
  "/Users/lazrossi/Spoke/meeting-baas"
  
  # Speaking bots repository
  "/Users/lazrossi/Spoke/speaking-meeting-bot"
  
  # SDK generator repository
  "/Users/lazrossi/Documents/code/mcp-s/sdk-generator"
  
  # MCP server repositories
  "/Users/lazrossi/Documents/code/mcp-s/mcp-on-vercel"
  "/Users/lazrossi/Documents/code/mcp-s/mcp-on-vercel-documentation"
  "/Users/lazrossi/Documents/code/mcp-baas"
  
  # Add any new repositories below (path without trailing slash)
  # "/path/to/new/repository"
)

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

# Process each repository
echo -e "${BLUE}Starting git diff generation for all repositories...${NC}"
for REPO_PATH in "${REPOSITORIES[@]}"; do
    # Check if repository exists
    if [ ! -d "$REPO_PATH" ]; then
        echo -e "${YELLOW}Warning: Repository path not found: $REPO_PATH - skipping${NC}"
        continue
    fi
    
    REPO_NAME=$(basename "$REPO_PATH")
    echo -e "${GREEN}Processing repository: $REPO_NAME${NC}"
    
    # Run git_grepper.sh with specified flags
    echo -e "${BLUE}Running: ./git_grepper.sh $REPO_PATH $DEBUG_LEVEL $FLAGS${NC}"
    ./git_grepper.sh "$REPO_PATH" "$DEBUG_LEVEL" $FLAGS
    
    echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
    echo "-------------------------------------------"
done

# Return to the project root directory
cd ../../

# Generate the updates
echo -e "${BLUE}Generating updates from collected git diffs...${NC}"
pnpm clean:git-updates

echo -e "${BLUE}Regenerating all updates...${NC}"
pnpm test:git-updates

echo -e "${GREEN}All repositories processed and updates generated!${NC}"
echo -e "${YELLOW}You can now run 'pnpm dev' to start the development server${NC}" 