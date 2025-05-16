#!/bin/bash
set -e

# Function to list available services
list_available_services() {
  echo "Available services:"
  jq -r '.repositories | keys[]' "$CONFIG_PATH" | while read -r service; do
    echo "  - $service"
  done
}

# Check if SERVICE environment variable is set
if [ -z "$SERVICE" ]; then
  echo "Error: SERVICE environment variable is not set"
  echo "Usage: SERVICE=<service-name> DAYS=<number> ./restart-service.sh [--overwrite] [--no-pr-mr]"
  echo
  CONFIG_PATH="$(dirname "$0")/config.json"
  list_available_services
  exit 1
fi

# Set default DAYS if not provided
DAYS=${DAYS:-90}

# Convert service name to lowercase and replace spaces with hyphens
SERVICE_KEY=$(echo "$SERVICE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

DEBUG_LEVEL="${DEBUG_LEVEL:-3}"
ONLY_PR_MR=true
OVERWRITE=false

# Parse additional flags
while [[ $# -gt 0 ]]; do
  case $1 in
    --no-pr-mr)
      ONLY_PR_MR=false
      ;;
    --overwrite)
      OVERWRITE=true
      ;;
  esac
  shift
done

# Map service to repo path
CONFIG_PATH="$(dirname "$0")/config.json"
REPO_PATH=$(jq -r ".repositories[\"$SERVICE\"]" "$CONFIG_PATH")

if [[ -z "$REPO_PATH" || "$REPO_PATH" == "null" ]]; then
  echo "Error: Could not find repository path for service '$SERVICE'"
  echo
  list_available_services
  exit 1
fi

cd "$(dirname "$0")/.."

echo "Cleaning up update files for $SERVICE_KEY..."
pnpm clean:git-updates "$SERVICE_KEY"

echo "Regenerating git diffs for the last $DAYS days..."
if [ "$ONLY_PR_MR" = true ]; then
  ./git_greppers/git_grepper.sh --repo-path "/Users/lazmini/code/public-scripts/$SERVICE_KEY" --debug-level "$DEBUG_LEVEL" --days "$DAYS" --only-with-pr-mr ${OVERWRITE:+--overwrite}
else
  ./git_greppers/git_grepper.sh --repo-path "/Users/lazmini/code/public-scripts/$SERVICE_KEY" --debug-level "$DEBUG_LEVEL" --days "$DAYS" ${OVERWRITE:+--overwrite}
fi

echo "Generating update files from diffs..."
if [ "$OVERWRITE" = true ]; then
  pnpm test:git-updates --overwrite --service "$SERVICE_KEY"
else
  pnpm test:git-updates --service "$SERVICE_KEY"
fi

echo "Done! All updates for $SERVICE have been regenerated." 