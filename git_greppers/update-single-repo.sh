#!/bin/bash

# This script updates a single repository based on the argument
# Usage: ./update-single-repo.sh <repo-name>

# Get the directory of this script (macOS compatible way)
get_script_dir() {
  local source="${BASH_SOURCE[0]}"
  while [ -h "$source" ]; do
    local dir="$( cd -P "$( dirname "$source" )" && pwd )"
    source="$(readlink "$source")"
    [[ $source != /* ]] && source="$dir/$source"
  done
  echo "$( cd -P "$( dirname "$source" )" && pwd )"
}

SCRIPT_DIR=$(get_script_dir)
cd "$SCRIPT_DIR"

# Path to git_grepper.sh
GIT_GREPPER="${SCRIPT_DIR}/git_grepper.sh"

# Use a case statement instead of associative arrays for compatibility with older bash
get_repo_path() {
  local repo_name=$1
  case "$repo_name" in
    "meeting-baas")
      echo "/Users/lazrossi/Spoke/meeting-baas"
      ;;
    "speaking-meeting-bot")
      echo "/Users/lazrossi/Spoke/speaking-meeting-bot"
      ;;
    "sdk-generator")
      echo "/Users/lazrossi/Documents/code/mcp-s/sdk-generator"
      ;;
    "mcp-on-vercel")
      echo "/Users/lazrossi/Documents/code/mcp-s/mcp-on-vercel"
      ;;
    "mcp-on-vercel-documentation")
      echo "/Users/lazrossi/Documents/code/mcp-s/mcp-on-vercel-documentation"
      ;;
    "mcp-baas")
      echo "/Users/lazrossi/Documents/code/mcp-baas"
      ;;
    *)
      echo ""
      ;;
  esac
}

# List all available repos
list_repos() {
  echo "meeting-baas"
  echo "speaking-meeting-bot"
  echo "sdk-generator"
  echo "mcp-on-vercel"
  echo "mcp-on-vercel-documentation"
  echo "mcp-baas"
}

# Default debug level
DEBUG_LEVEL=1

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if an argument was provided
if [ $# -eq 0 ]; then
  echo -e "${RED}Error: No repository name provided${NC}"
  echo -e "Usage: ./update-single-repo.sh <repo-name>"
  echo -e "Available repositories:"
  list_repos | while read -r repo; do
    echo -e "  - ${BLUE}$repo${NC}"
  done
  exit 1
fi

REPO_NAME=$1
REPO_PATH=$(get_repo_path "$REPO_NAME")

# Check if the repository exists
if [ -z "$REPO_PATH" ]; then
  echo -e "${RED}Error: Unknown repository '$REPO_NAME'${NC}"
  echo -e "Available repositories:"
  list_repos | while read -r repo; do
    echo -e "  - ${BLUE}$repo${NC}"
  done
  exit 1
fi

# Check if git_grepper.sh exists
if [ ! -f "$GIT_GREPPER" ]; then
  echo -e "${RED}Error: git_grepper.sh not found at $GIT_GREPPER${NC}"
  exit 1
fi

# Make sure git_grepper.sh is executable
chmod +x "$GIT_GREPPER"

# Process the repository
echo -e "${BLUE}Starting git diff generation for $REPO_NAME...${NC}"

if [ -d "$REPO_PATH" ]; then
  echo -e "${GREEN}Processing repository: $REPO_NAME${NC}"
  
  # First, just fetch (without merging) to make sure remote refs are up-to-date
  echo -e "${BLUE}Fetching latest refs from remote...${NC}"
  (cd "$REPO_PATH" && git fetch --all)
  
  # For speaking bots, use the with-diff flag to include code
  if [ "$REPO_NAME" = "speaking-meeting-bot" ]; then
    # Use the explicit repo name parameter to ensure consistent naming - use space between option and value
    "$GIT_GREPPER" "$REPO_PATH" "$DEBUG_LEVEL" --with-diff --include-code --only-with-pr-mr --use-remote --repo-name "$REPO_NAME"
  else
    # For other repositories, use the explicit repo name parameter to ensure consistent naming
    "$GIT_GREPPER" "$REPO_PATH" "$DEBUG_LEVEL" --no-diff --only-with-pr-mr --use-remote --repo-name "$REPO_NAME"
  fi
  
  echo -e "${GREEN}Completed processing for: $REPO_NAME${NC}"
  echo "-------------------------------------------"
else
  echo -e "${RED}Error: Repository path not found: $REPO_PATH${NC}"
  exit 1
fi

echo -e "${GREEN}Repository $REPO_NAME processed successfully!${NC}"
echo -e "${YELLOW}Run 'pnpm clean:git-updates && pnpm test:git-updates' to regenerate documentation${NC}" 