#!/bin/bash

# Debug: print received arguments
echo "DEBUG: Script received arguments: $@"

# Set the current directory to the one where this script is located
cd "$(dirname "$0")" || exit 1

# Store the docs directory for later use
DOCS_DIR="$(pwd)/../../"

# Default paths - use full paths to avoid issues
GIT_GREPPER=${GIT_GREPPER:-"$(pwd)/git_grepper.sh"}
CONFIG_PATH=${CONFIG_PATH:-"$(pwd)/config.json"}
OUTPUT_DIR=${OUTPUT_DIR:-"$(pwd)"}

# Source utility functions and handlers first
source "$(pwd)/utils.sh" || { echo "Failed to source utils.sh"; exit 1; }
source "$(pwd)/github_handler.sh" || { echo "Failed to source github_handler.sh"; exit 1; }
source "$(pwd)/gitlab_handler.sh" || { echo "Failed to source gitlab_handler.sh"; exit 1; }

# Initialize debug function
DEBUG_LEVEL=${DEBUG_LEVEL:-1}
init_debug "$DEBUG_LEVEL"

# Debug environment variables
debug 2 "Environment variables:"
debug 2 "REPO_NAME from env: '$REPO_NAME'"
debug 2 "npm_config_repo: '$npm_config_repo'"
debug 2 "REPO: '$REPO'"

# Default values
REPO_NAME=${REPO_NAME:-""}
DRY_RUN=0
WITH_DIFF="--with-diff"
WITH_CODE="--include-code"
CHECKOUT_DEPTH=${CHECKOUT_DEPTH:-1}
PREVIEW_MODE=${PREVIEW_MODE:-0}
GENERATE_PR_PREVIEWS=${GENERATE_PR_PREVIEWS:-0}
PR_DAYS_RANGE=${PR_DAYS_RANGE:-7}
EXTRA_FLAGS=()

# Repository path resolution function
get_repo_path() {
  local repo_name=$1
  
  # Check if config file exists
  if [[ -f "$CONFIG_PATH" ]]; then
    # Use jq to get the path from config
    local path=$(jq -r ".repositories.\"$repo_name\"" "$CONFIG_PATH")
    if [[ "$path" != "null" && -n "$path" ]]; then
      debug 2 "Found repository path in config: $path"
      echo "$path"
      return 0
    fi
  fi
  
  # If repo_name is a full path, use it directly
  if [[ -d "$repo_name" ]]; then
    debug 2 "Using provided path directly: $repo_name"
    echo "$repo_name"
    return 0
  fi
  
  # If we get here, the repo wasn't found in config and isn't a valid path
  debug 0 "Repository '$repo_name' not found in config.json and is not a valid path"
  return 1
}

# Parse command line arguments - order agnostic
debug 2 "Starting argument parsing with $# arguments: $*"
while [[ $# -gt 0 ]]; do
  debug 3 "Processing argument: '$1'"
  case $1 in
    --repo=*)
      REPO_NAME="${1#*=}"
      debug 2 "Found repo name from --repo=: '$REPO_NAME'"
      shift
      ;;
    --repo)
      shift
      REPO_NAME="$1"
      debug 2 "Found repo name from --repo: '$REPO_NAME'"
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --with-diff)
      WITH_DIFF="--with-diff"
      shift
      ;;
    --no-diff)
      WITH_DIFF="--no-diff"
      shift
      ;;
    --include-code)
      WITH_CODE="--include-code"
      shift
      ;;
    --no-code)
      WITH_CODE="--no-code"
      shift
      ;;
    --overwrite)
      EXTRA_FLAGS+=("--overwrite")
      shift
      ;;
    --only-with-pr-mr)
      EXTRA_FLAGS+=("--only-with-pr-mr")
      shift
      ;;
    --preview)
      PREVIEW_MODE=1
      shift
      ;;
    --generate-pr-previews)
      GENERATE_PR_PREVIEWS=1
      shift
      ;;
    --days=*)
      PR_DAYS_RANGE="${1#*=}"
      EXTRA_FLAGS+=("--days=${PR_DAYS_RANGE}")
      shift
      ;;
    --days)
      shift
      PR_DAYS_RANGE="$1"
      EXTRA_FLAGS+=("--days=$PR_DAYS_RANGE")
      shift
      ;;
    --debug=*)
      DEBUG_LEVEL="${1#*=}"
      init_debug "$DEBUG_LEVEL"
      shift
      ;;
    --debug)
      shift
      DEBUG_LEVEL="$1"
      init_debug "$DEBUG_LEVEL"
      shift
      ;;
    *)
      # If it's not a known flag, assume it's the repo name
      if [[ -z "$REPO_NAME" ]]; then
        REPO_NAME="$1"
        debug 2 "Found repo name from positional argument: '$REPO_NAME'"
      else
        debug 1 "Unknown option: '$1'"
        echo "Unknown option: $1"
        echo "Usage: $0 [--repo=<repo_name>] [--dry-run] [--with-diff|--no-diff] [--include-code|--no-code] [--overwrite] [--only-with-pr-mr] [--days=N] [--debug=N]"
        exit 1
      fi
      shift
      ;;
  esac
done

debug 2 "Finished argument parsing. REPO_NAME='$REPO_NAME'"

# Check if jq is installed
check_jq

# Check for required parameters
if [[ -z "$REPO_NAME" ]]; then
  debug 1 "Repository name is empty"
  echo "Error: Repository name or path is required."
  echo "Usage: $0 [--repo=<repo_name>] [--dry-run] [--with-diff|--no-diff] [--include-code|--no-code] [--overwrite] [--only-with-pr-mr] [--days=N] [--debug=N]"
  echo "Available repositories in config:"
  if [[ -f "$CONFIG_PATH" ]]; then
    jq -r '.repositories | keys[]' "$CONFIG_PATH"
  fi
  exit 1
fi

# Get repository path and check if it exists
REPO_PATH=$(get_repo_path "$REPO_NAME")
if [[ $? -ne 0 ]]; then
  echo "Error: Could not resolve repository path for '$REPO_NAME'"
  echo "Available repositories in config:"
  if [[ -f "$CONFIG_PATH" ]]; then
    jq -r '.repositories | keys[]' "$CONFIG_PATH"
  fi
  exit 1
fi

# If REPO_NAME is a path, extract the basename as the actual repo name
if [[ "$REPO_NAME" == "$REPO_PATH" ]]; then
  REPO_NAME=$(basename "$REPO_PATH")
fi

debug 1 "Processing repository: $REPO_NAME (path: $REPO_PATH)"

# Check if the repository directory exists
if [[ ! -d "$REPO_PATH" ]]; then
  debug 0 "Repository directory not found: $REPO_PATH"
  exit 1
fi

# Check if OUTPUT_DIR exists
if [[ ! -d "$OUTPUT_DIR" ]]; then
  mkdir -p "$OUTPUT_DIR"
fi

# Function to determine the repository type (GitHub/GitLab)
determine_repo_type() {
  local repo_path=$1
  
  cd "$repo_path" || return "unknown"
  
  # Get the remote URL
  local remote_url=$(git remote get-url origin 2>/dev/null)
  
  if [[ -z "$remote_url" ]]; then
    debug 1 "No remote URL found, assuming local repository"
    echo "local"
    return
  fi
  
  if [[ "$remote_url" == *"github.com"* ]]; then
    debug 2 "Detected GitHub repository"
    echo "github"
    return
  elif [[ "$remote_url" == *"gitlab.com"* ]]; then
    debug 2 "Detected GitLab repository"
    echo "gitlab"
    return
  else
    debug 2 "Unknown repository type, using default handler"
    echo "unknown"
    return
  fi
}

# Function to get repository identifier (owner/repo)
get_repo_identifier() {
  local repo_path=$1
  local repo_type=$2
  local identifier=""
  
  cd "$repo_path" || return ""
  
  # Get the remote URL
  local remote_url=$(git remote get-url origin 2>/dev/null)
  
  if [[ -z "$remote_url" ]]; then
    debug 1 "No remote URL found, returning empty identifier"
    echo ""
    return
  fi
  
  # Handle different URL formats
  if [[ "$remote_url" =~ ^https://.*$ ]]; then
    # HTTPS URL format
    identifier=$(echo "$remote_url" | sed -E 's|https://([^/]+)/(.+)\.git$|\2|' | sed -E 's|https://([^/]+)/(.+)$|\2|')
  elif [[ "$remote_url" =~ ^git@.*$ ]]; then
    # SSH URL format
    identifier=$(echo "$remote_url" | sed -E 's|git@([^:]+):(.+)\.git$|\2|' | sed -E 's|git@([^:]+):(.+)$|\2|')
  else
    # Other formats, try best effort
    identifier=$(echo "$remote_url" | grep -oE '[^/]+/[^/]+$' | sed 's/\.git$//')
  fi
  
  debug 2 "Repository identifier: $identifier"
  echo "$identifier"
}

# Main function to process a repository
process_repository() {
  local repo_path=$1
  local output_dir=$2
  local repo_name=$3
  local dry_run=$4
  local with_diff=$5
  local with_code=$6
  local pr_previews=$7
  local pr_days_range=$8
  local preview_mode=$9
  local extra_flags=("${@:10}")
  
  # Store current directory
  local current_dir=$(pwd)
  
  # Change to repo directory for git operations
  cd "$repo_path" || return 1
  
  # Determine repository type
  local repo_type=$(determine_repo_type "$repo_path")
  local repo_identifier=$(get_repo_identifier "$repo_path" "$repo_type")
  
  debug 1 "Repository type: $repo_type"
  debug 1 "Repository identifier: $repo_identifier"
  
  # Determine primary branch
  PRIMARY_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "master")
  if [[ "$PRIMARY_BRANCH" == "HEAD" ]]; then
    PRIMARY_BRANCH="master"
  fi
  
  # Run git_grepper on the repository
  echo "[INFO] Running git_grepper on $PRIMARY_BRANCH branch"
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "[DRY RUN] Would run: $GIT_GREPPER --repo-path=\"$REPO_PATH\" --debug-level=\"$DEBUG_LEVEL\" $WITH_DIFF $WITH_CODE ${EXTRA_FLAGS[*]}"
  else
    "$GIT_GREPPER" \
      --repo-path="$REPO_PATH" \
      --debug-level="$DEBUG_LEVEL" \
      $WITH_DIFF \
      $WITH_CODE \
      "${EXTRA_FLAGS[@]}"
  fi
  
  # Return to original directory
  cd "$current_dir"
  
  # Process PR/MR previews if enabled
  if [[ "$pr_previews" -eq 1 ]]; then
    debug 1 "Generating PR/MR previews for repository: $repo_name"
    
    case "$repo_type" in
      github)
        debug 1 "Processing GitHub PRs"
        check_github_cli
        
        # Get recent PRs using our GitHub handler function
        get_recent_github_prs "$repo_path" "$pr_days_range" "RECENT_PRS"
        
        # Process each PR to generate preview pages
        local pr_count=${#RECENT_PRS[@]}
        debug 1 "Found $pr_count recent PRs to process"
        
        for pr_info in "${RECENT_PRS[@]}"; do
          if [[ "$dry_run" -eq 0 ]]; then
            generate_github_pr_preview "$repo_path" "$repo_name" "$pr_info" "$GIT_GREPPER" "$output_dir"
          else
            debug 1 "Dry run: would generate GitHub PR preview for $pr_info"
          fi
        done
        ;;
        
      gitlab)
        debug 1 "Processing GitLab MRs"
        check_gitlab_cli
        
        # Get recent MRs using our GitLab handler function
        get_recent_gitlab_mrs "$repo_path" "$pr_days_range" "RECENT_MRS"
        
        # Process each MR to generate preview pages
        local mr_count=${#RECENT_MRS[@]}
        debug 1 "Found $mr_count recent MRs to process"
        
        for mr_info in "${RECENT_MRS[@]}"; do
          if [[ "$dry_run" -eq 0 ]]; then
            generate_gitlab_mr_preview "$repo_path" "$repo_name" "$mr_info" "$GIT_GREPPER" "$output_dir"
          else
            debug 1 "Dry run: would generate GitLab MR preview for $mr_info"
          fi
        done
        ;;
        
      *)
        debug 1 "Repository type $repo_type does not support PR/MR previews"
        ;;
    esac
  fi
  
  return 0
}

# Run the main process
debug 1 "Starting update for repository: $REPO_NAME"
process_repository "$REPO_PATH" "$OUTPUT_DIR" "$REPO_NAME" "$DRY_RUN" "$WITH_DIFF" "$WITH_CODE" "$GENERATE_PR_PREVIEWS" "$PR_DAYS_RANGE" "$PREVIEW_MODE" "${EXTRA_FLAGS[@]}"

exit_code=$?
debug 1 "Finished processing repository $REPO_NAME with exit code $exit_code"
exit $exit_code 