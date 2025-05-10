#!/bin/bash
set -e

# Check if SERVICE environment variable is set
if [ -z "$SERVICE" ]; then
  echo "Error: SERVICE environment variable is not set"
  echo "Usage: SERVICE=<service-name> DAYS=<number> ./restart-service.sh"
  exit 1
fi

# Set default DAYS if not provided
DAYS=${DAYS:-90}

# Convert service name to lowercase and replace spaces with hyphens
SERVICE_KEY=$(echo "$SERVICE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

DEBUG_LEVEL="${DEBUG_LEVEL:-3}"
ONLY_PR_MR=true

# Parse additional flags
while [[ $# -gt 0 ]]; do
  case $1 in
    --no-pr-mr)
      ONLY_PR_MR=false
      ;;
  esac
  shift
done

# Map service to repo path
CONFIG_PATH="$(dirname "$0")/config.json"
REPO_PATH=$(jq -r ".repositories[\"$SERVICE\"]" "$CONFIG_PATH")

if [[ -z "$REPO_PATH" || "$REPO_PATH" == "null" ]]; then
  echo "Error: Could not find repository path for service '$SERVICE'"
  exit 1
fi

cd "$(dirname "$0")/.."

echo "Cleaning up update files for $SERVICE_KEY..."
pnpm clean:git-updates "$SERVICE_KEY"

echo "Regenerating git diffs for the last $DAYS days..."
if [ "$ONLY_PR_MR" = true ]; then
  ./git_greppers/git_grepper.sh "/Users/lazmini/code/public-scripts/$SERVICE_KEY" "$DEBUG_LEVEL" --days "$DAYS" --only-with-pr-mr --overwrite
else
  ./git_greppers/git_grepper.sh "/Users/lazmini/code/public-scripts/$SERVICE_KEY" "$DEBUG_LEVEL" --days "$DAYS" --overwrite
fi

echo "Generating update files from diffs..."
pnpm test:git-updates

echo "Done! All updates for $SERVICE have been regenerated." 